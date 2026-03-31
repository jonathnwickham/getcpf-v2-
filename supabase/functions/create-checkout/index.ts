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
    const apiKey = Deno.env.get("FANBASIS_API_KEY");
    if (!apiKey) {
      console.error("FANBASIS_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Payment service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const fanbasisRes = await fetch(
      "https://www.fanbasis.com/public-api/checkout-sessions/embedded",
      {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: "0LD5G",
          metadata: {
            user_email: normalizedEmail,
            source: "cpf-app",
          },
        }),
      }
    );

    if (!fanbasisRes.ok) {
      const errorText = await fanbasisRes.text();
      console.error("Fanbasis API error:", fanbasisRes.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to create checkout session" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const fanbasisData = await fanbasisRes.json();
    const secret = fanbasisData.checkout_session_secret || fanbasisData.data?.checkout_session_secret;

    if (!secret) {
      console.error("No checkout_session_secret in response:", fanbasisData);
      return new Response(
        JSON.stringify({ error: "Invalid checkout response" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Save checkout session to database
    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      await supabase.from("checkout_sessions").insert({
        email: normalizedEmail,
        checkout_session_secret: secret,
        product_id: "0LD5G",
      });
      console.log(`Saved checkout session for ${normalizedEmail}`);
    } catch (dbErr) {
      // Non-fatal: log but don't fail the checkout
      console.error("Failed to save checkout session to DB:", dbErr);
    }

    return new Response(
      JSON.stringify({ checkout_session_secret: secret }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("create-checkout error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
