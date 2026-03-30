import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find accounts older than 90 days that never paid
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();

    const { data: expiredProfiles, error } = await supabase
      .from("profiles")
      .select("id, email, created_at, plan")
      .lt("created_at", ninetyDaysAgo)
      .or("plan.is.null,plan.eq.free,plan.eq.self_service");

    if (error) {
      console.error("Query error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Further filter: only accounts that never completed a payment
    const neverPaidProfiles = [];
    for (const profile of expiredProfiles || []) {
      const { data: apps } = await supabase
        .from("applications")
        .select("status")
        .eq("user_id", profile.id)
        .in("status", ["paid", "prepared", "office_visited", "cpf_issued"])
        .limit(1);
      
      if (!apps || apps.length === 0) {
        neverPaidProfiles.push(profile);
      }
    }

    const expiredCount = neverPaidProfiles.length;

    if (expiredCount > 0) {
      const accountList = neverPaidProfiles
        .map(
          (p) =>
            `- User ID: ${p.id} | Created: ${new Date(p.created_at!).toLocaleDateString()} | Email: ${p.email}`
        )
        .join("\n");

      const emailBody = `Data deletion due for ${expiredCount} account(s) (90+ days, never paid):\n\n${accountList}\n\nReview these in the admin dashboard and delete as needed.`;

      console.log(`[check_expired_accounts] ${emailBody}`);

      return new Response(
        JSON.stringify({
          message: `${expiredCount} account(s) due for deletion`,
          accounts: neverPaidProfiles.map((p) => ({
            user_id: p.id,
            created_at: p.created_at,
          })),
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ message: "No accounts due for deletion" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
