import { corsHeaders } from "@supabase/supabase-js/cors";

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
            user_email: email,
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
    const secret = fanbasisData.checkout_session_secret;

    if (!secret) {
      console.error("No checkout_session_secret in response:", fanbasisData);
      return new Response(
        JSON.stringify({ error: "Invalid checkout response" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
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
