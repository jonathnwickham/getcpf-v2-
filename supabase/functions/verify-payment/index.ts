import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return new Response(
        JSON.stringify({ error: "A valid email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Fast path: check DB first
    const { data: dbSession } = await supabase
      .from("checkout_sessions")
      .select("id, paid, paid_at, payment_id")
      .eq("email", normalizedEmail)
      .eq("paid", true)
      .limit(1)
      .maybeSingle();

    if (dbSession) {
      return new Response(
        JSON.stringify({ paid: true, paid_at: dbSession.paid_at, payment_id: dbSession.payment_id }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Fallback: check Fanbasis transactions API directly
    const apiKey = Deno.env.get("FANBASIS_API_KEY");
    if (apiKey) {
      try {
        const fbRes = await fetch(
          "https://www.fanbasis.com/public-api/checkout-sessions/0LD5G/transactions",
          {
            method: "GET",
            headers: { "x-api-key": apiKey },
          }
        );

        if (fbRes.ok) {
          const fbData = await fbRes.json();
          const txList = fbData?.data?.transactions || [];

          // Transactions returned by this endpoint are already successful
          // Email is in fan.email
          const match = txList.find((tx: any) => {
            const txEmail = (tx.fan?.email || "").toLowerCase().trim();
            return txEmail === normalizedEmail;
          });

          if (match) {
            const txId = String(match.id || "");
            const paidAt = match.transaction_date || new Date().toISOString();
            console.log(`Fanbasis API confirmed payment for ${normalizedEmail}, tx: ${txId}`);

            // Update DB so future checks are instant
            await supabase
              .from("checkout_sessions")
              .update({
                paid: true,
                paid_at: paidAt,
                payment_id: txId,
                amount_cents: match.amount ? Math.round(match.amount * 100) : null,
              })
              .eq("email", normalizedEmail)
              .eq("paid", false);

            // Also update profile plan
            const { data: profile } = await supabase
              .from("profiles")
              .select("id")
              .eq("email", normalizedEmail)
              .maybeSingle();

            if (profile) {
              await supabase
                .from("profiles")
                .update({ plan: "self_service" })
                .eq("id", profile.id);
            }

            // Trigger purchase confirmation email
            try {
              await supabase.functions.invoke("send-transactional-email", {
                body: {
                  templateName: "purchase-confirmation",
                  recipientEmail: normalizedEmail,
                  idempotencyKey: `purchase-confirm-${txId || normalizedEmail}`,
                },
              });
              console.log(`Purchase confirmation email queued for ${normalizedEmail}`);
            } catch (emailErr) {
              console.error("Failed to queue purchase confirmation:", emailErr);
            }

            return new Response(
              JSON.stringify({ paid: true, paid_at: paidAt, payment_id: txId }),
              { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
        } else {
          console.error("Fanbasis API error:", fbRes.status);
        }
      } catch (fbErr) {
        console.error("Fanbasis API check failed:", fbErr);
      }
    }

    return new Response(
      JSON.stringify({ paid: false, paid_at: null, payment_id: null }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("verify-payment error:", err);
    return new Response(
      JSON.stringify({ error: "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
