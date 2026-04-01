import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-webhook-signature",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Read raw body for signature validation
    const rawBody = await req.text();
    const signature = req.headers.get("x-webhook-signature");
    const webhookSecret = Deno.env.get("FANBASIS_WEBHOOK_SECRET");

    // Validate signature if secret is configured
    if (webhookSecret && signature) {
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(webhookSecret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(rawBody));
      const expectedHex = Array.from(new Uint8Array(sig))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      // Constant-time comparison
      if (expectedHex.length !== signature.length || expectedHex !== signature) {
        console.error("Webhook signature mismatch");
        return new Response("Unauthorized", { status: 401, headers: corsHeaders });
      }
    } else if (webhookSecret && !signature) {
      console.error("Missing x-webhook-signature header");
      return new Response("Unauthorized", { status: 401, headers: corsHeaders });
    }

    const event = JSON.parse(rawBody);
    console.log("Webhook event received:", JSON.stringify(event).substring(0, 500));

    // We only care about payment.succeeded
    const eventType = event.type || (event.status === "succeeded" || event.status === "paid" ? "payment.succeeded" : null);

    if (eventType !== "payment.succeeded") {
      console.log("Ignoring event type:", eventType);
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Extract buyer email and payment details
    const buyerEmail = event.buyer?.email || event.api_metadata?.user_email;
    const paymentId = event.payment_id;
    const customerId = event.customer_id;
    const amount = event.amount;
    const currency = event.currency;
    const checkoutSessionId = event.checkout_session_id;

    if (!buyerEmail) {
      console.error("No buyer email in webhook payload:", JSON.stringify(event));
      return new Response(JSON.stringify({ error: "No buyer email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Payment succeeded for ${buyerEmail}, payment_id: ${paymentId}`);

    // Create Supabase admin client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Update checkout_sessions: mark as paid
    const { error: updateError } = await supabase
      .from("checkout_sessions")
      .update({
        paid: true,
        paid_at: new Date().toISOString(),
        payment_id: paymentId || null,
        fanbasis_customer_id: customerId || null,
        amount_cents: typeof amount === "number" ? Math.round(amount * 100) : amount,
        currency: currency || "USD",
      })
      .eq("email", buyerEmail.toLowerCase())
      .eq("paid", false);

    if (updateError) {
      console.error("Error updating checkout_sessions:", updateError);
    } else {
      console.log(`Marked checkout session as paid for ${buyerEmail}`);
    }

    // Also update the profile plan if user exists
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", buyerEmail.toLowerCase())
      .maybeSingle();

    if (profile) {
      await supabase
        .from("profiles")
        .update({ plan: "self_service" })
        .eq("id", profile.id);
      console.log(`Updated profile plan for ${buyerEmail}`);
    }

    // Send post-purchase confirmation email
    try {
      await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "purchase-confirmation",
          recipientEmail: buyerEmail,
          idempotencyKey: `purchase-confirm-${paymentId || buyerEmail}`,
          templateData: { name: profile ? undefined : undefined },
        },
      });
      console.log(`Purchase confirmation email queued for ${buyerEmail}`);
    } catch (emailErr) {
      console.error("Failed to queue purchase confirmation email:", emailErr);
    }

    // Send onboarding welcome email
    try {
      await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "onboarding-welcome",
          recipientEmail: buyerEmail,
          idempotencyKey: `onboarding-welcome-${paymentId || buyerEmail}`,
        },
      });
      console.log(`Onboarding welcome email queued for ${buyerEmail}`);
    } catch (emailErr) {
      console.error("Failed to queue onboarding welcome email:", emailErr);
    }

    return new Response(JSON.stringify({ received: true, email: buyerEmail }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
