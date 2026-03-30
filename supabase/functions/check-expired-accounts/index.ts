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

    // Find accounts older than 30 days that aren't active subscribers
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const { data: expiredProfiles, error } = await supabase
      .from("profiles")
      .select("id, email, created_at, plan")
      .lt("created_at", thirtyDaysAgo)
      .not("plan", "eq", "active_subscriber");

    if (error) {
      console.error("Query error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const expiredCount = expiredProfiles?.length || 0;

    if (expiredCount > 0) {
      // Build email body
      const accountList = expiredProfiles!
        .map(
          (p) =>
            `- User ID: ${p.id} | Created: ${new Date(p.created_at!).toLocaleDateString()} | Email: ${p.email}`
        )
        .join("\n");

      const emailBody = `Data deletion due for ${expiredCount} account(s):\n\n${accountList}\n\nReview these in the admin dashboard and delete as needed.`;

      // Log to console (admin notification — in production this would email jonathan@getcpf.com)
      console.log(`[check_expired_accounts] ${emailBody}`);

      return new Response(
        JSON.stringify({
          message: `${expiredCount} account(s) due for deletion`,
          accounts: expiredProfiles!.map((p) => ({
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
