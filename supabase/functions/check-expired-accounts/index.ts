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

    // ── Phase 1: Purge sensitive identity data after 30 days ──
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const { data: staleSensitive, error: purgeQueryErr } = await supabase
      .from("applications")
      .select("id, user_id, email, passport_number")
      .lt("created_at", thirtyDaysAgo)
      .not("passport_number", "is", null);

    let purgedCount = 0;
    if (!purgeQueryErr && staleSensitive && staleSensitive.length > 0) {
      for (const app of staleSensitive) {
        const { error: purgeErr } = await supabase
          .from("applications")
          .update({
            passport_number: null,
            mother_name: null,
            mother_alternative: null,
            father_name: null,
            passport_photo_url: null,
            selfie_url: null,
            address_proof_url: null,
          })
          .eq("id", app.id);

        if (!purgeErr) {
          purgedCount++;
          console.log(`[data_purge] Cleared sensitive data for application ${app.id}`);
        } else {
          console.error(`[data_purge] Failed for ${app.id}:`, purgeErr);
        }
      }
      console.log(`[data_purge] Purged sensitive data from ${purgedCount} application(s)`);
    }

    // ── Phase 2: Flag never-paid accounts older than 90 days ──
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
            `- ${p.email} (created ${new Date(p.created_at!).toLocaleDateString()})`
        )
        .join("\n");

      console.log(`[check_expired_accounts] ${expiredCount} account(s) due for deletion`);

      // Send admin deletion alert email
      try {
        await supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "admin-deletion-alert",
            idempotencyKey: `admin-deletion-${new Date().toISOString().split("T")[0]}`,
            templateData: { count: expiredCount, accountList },
          },
        });
        console.log("Admin deletion alert email queued");
      } catch (emailErr) {
        console.error("Failed to queue admin deletion alert:", emailErr);
      }
    }

    return new Response(
      JSON.stringify({
        purged_sensitive_data: purgedCount,
        accounts_due_for_deletion: expiredCount,
        accounts: (neverPaidProfiles || []).map((p) => ({
          user_id: p.id,
          created_at: p.created_at,
        })),
      }),
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
