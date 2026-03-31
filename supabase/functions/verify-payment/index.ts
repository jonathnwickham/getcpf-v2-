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

    // 2. Fallback: check Fanbasis API directly for transactions
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
          const transactions = fbData.data || fbData.transactions || fbData || [];
          const txList = Array.isArray(transactions) ? transactions : [];

          // Find a successful transaction matching this email
          const match = txList.find((tx: any) => {
            const txEmail = (tx.buyer_email || tx.email || tx.customer_email || tx.metadata?.user_email || "").toLowerCase().trim();
            const txStatus = (tx.status || "").toLowerCase();
            return txEmail === normalizedEmail && (txStatus === "succeeded" || txStatus === "paid" || txStatus === "completed");
          });

          if (match) {
            console.log(`Fanbasis API confirmed payment for ${normalizedEmail}`);
            
            // Update DB so future checks are fast
            await supabase
              .from("checkout_sessions")
              .update({
                paid: true,
                paid_at: new Date().toISOString(),
                payment_id: match.transaction_id || match.id || null,
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

            return new Response(
              JSON.stringify({ paid: true, paid_at: new Date().toISOString(), payment_id: match.transaction_id || match.id || null }),
              { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
        } else {
          console.error("Fanbasis API error:", fbRes.status, await fbRes.text());
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
