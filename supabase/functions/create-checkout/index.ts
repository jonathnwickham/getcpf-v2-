const ALLOWED_ORIGINS = ["https://getcpf.com", "https://www.getcpf.com", "https://getcpf.netlify.app", "http://localhost:5177", "http://localhost:8080", "http://localhost:5176"];

const corsHeaders = (origin: string) => ({
  "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
});

Deno.serve(async (req) => {
  const origin = req.headers.get("origin") || "";
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(origin) });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const apiKey = Deno.env.get("FANBASIS_API_KEY");
    const handle = Deno.env.get("FANBASIS_HANDLE") || "telosmedia";
    const productId = Deno.env.get("FANBASIS_PRODUCT_ID") || "0LD5G";

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "FANBASIS_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders(origin), "Content-Type": "application/json" } }
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
          product_id: productId,
          metadata: body.metadata || { source: "cpf-app" },
        }),
      }
    );

    if (!fanbasisRes.ok) {
      const errorText = await fanbasisRes.text();
      console.error("Fanbasis API error:", fanbasisRes.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to create checkout session" }),
        { status: 502, headers: { ...corsHeaders(origin), "Content-Type": "application/json" } }
      );
    }

    const fanbasisData = await fanbasisRes.json();
    const secret = fanbasisData.data?.checkout_session_secret || fanbasisData.checkout_session_secret;

    if (!secret) {
      console.error("No secret in response:", JSON.stringify(fanbasisData));
      return new Response(
        JSON.stringify({ error: "Invalid checkout response" }),
        { status: 502, headers: { ...corsHeaders(origin), "Content-Type": "application/json" } }
      );
    }

    const embed_url = `https://embedded.fanbasis.io/session/${handle}/${productId}/${secret}`;

    // Save to DB (non-fatal)
    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2.100.1");
      const supabase = createClient(supabaseUrl, supabaseKey);
      await supabase.from("checkout_sessions").insert({
        email: body.email ? body.email.toLowerCase().trim() : null,
        checkout_session_secret: secret,
        product_id: productId,
      });
    } catch (e) {
      console.error("DB save failed (non-fatal):", e);
    }

    return new Response(
      JSON.stringify({ checkout_session_secret: secret, embed_url }),
      { status: 200, headers: { ...corsHeaders(origin), "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("create-checkout error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders(origin), "Content-Type": "application/json" } }
    );
  }
});
