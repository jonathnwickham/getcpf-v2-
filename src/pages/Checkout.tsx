import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Logo from "@/components/Logo";

const PRODUCT_ID = "0LD5G";
const CREATOR_HANDLE = "telosmedia";
const FALLBACK_URL = `https://www.fanbasis.com/agency-checkout/${CREATOR_HANDLE}/${PRODUCT_ID}`;

const Checkout = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "payment">("email");
  const [checkoutSecret, setCheckoutSecret] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user]);

  const EMBEDDED_URL = checkoutSecret
    ? `https://embedded.fanbasis.io/session/${CREATOR_HANDLE}/${PRODUCT_ID}/${checkoutSecret}`
    : null;

  const handleEmailContinue = async () => {
    if (!email.includes("@")) return;
    setStep("payment");
    setLoadingCheckout(true);
    setCheckoutError(false);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { email },
      });
      if (error || !data?.checkout_session_secret) {
        setCheckoutError(true);
      } else {
        setCheckoutSecret(data.checkout_session_secret);
      }
    } catch {
      setCheckoutError(true);
    }
    setLoadingCheckout(false);
  };

  const [paymentVerified, setPaymentVerified] = useState(false);

  const handlePaymentComplete = () => {
    navigate("/get-started");
  };

  // Poll verify-payment endpoint every 5 seconds once checkout is showing
  useEffect(() => {
    if (step !== "payment" || !email || paymentVerified) return;

    const poll = async () => {
      try {
        const { data } = await supabase.functions.invoke("verify-payment", {
          body: { email },
        });
        if (data?.paid) {
          setPaymentVerified(true);
          handlePaymentComplete();
        }
      } catch (err) {
        console.error("Payment verification poll error:", err);
      }
    };

    const interval = setInterval(poll, 5000);
    // Also poll immediately
    poll();

    return () => clearInterval(interval);
  }, [step, email, paymentVerified]);

  // Listen for postMessage from Fanbasis iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "fanbasis:payment_success" || event.data?.status === "success") {
        handlePaymentComplete();
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="border-b border-border bg-background">
        <div className="flex items-center justify-between px-6 py-4 max-w-[600px] mx-auto">
          <a href="/">
            <Logo className="h-10" />
          </a>
          <span className="text-xs text-muted-foreground font-medium">
            {step === "email" ? "Step 1 of 2" : "Step 2 of 2"}
          </span>
        </div>
      </div>

      <div className="flex-1 flex items-start justify-center px-6 py-8 md:py-12">
        <div className="w-full max-w-[500px]">
          {step === "email" ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                  🇧🇷
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  Get your CPF sorted
                </h1>
                <p className="text-muted-foreground text-sm mt-2 max-w-[400px] mx-auto">
                  Enter your email to get started. We'll save your progress so you can pick up anytime.
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold">CPF Application Service</span>
                  <span className="text-lg font-bold">$49</span>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><span className="text-primary">✓</span> Pre-filled government forms</li>
                  <li className="flex items-center gap-2"><span className="text-primary">✓</span> Step-by-step office guide</li>
                  <li className="flex items-center gap-2"><span className="text-primary">✓</span> Same-day CPF number</li>
                </ul>
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground block mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  autoFocus
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && email.includes("@")) handleEmailContinue();
                  }}
                />
              </div>

              <button
                onClick={handleEmailContinue}
                disabled={!email.includes("@")}
                className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue to payment →
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-sm">CPF Application Service</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">{email}</p>
                  </div>
                  <span className="text-xl font-bold">$49</span>
                </div>
              </div>

              {/* Embedded Fanbasis Checkout */}
              {loadingCheckout ? (
                <div className="flex flex-col items-center gap-3 py-8">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-muted-foreground">Loading secure checkout...</p>
                </div>
              ) : checkoutError || !EMBEDDED_URL ? (
                <div className="space-y-4">
                  <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-5 text-center">
                    <p className="text-sm font-semibold text-foreground mb-1">Checkout unavailable</p>
                    <p className="text-xs text-muted-foreground">Please use the external payment link instead.</p>
                  </div>
                  <a
                    href={FALLBACK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-foreground text-background py-4 rounded-xl font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-3"
                  >
                    Pay $49 securely ↗
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-xl overflow-hidden border border-border bg-card">
                    <iframe
                      src={EMBEDDED_URL}
                      className="w-full border-0"
                      style={{ height: "520px" }}
                      allow="payment"
                      title="Fanbasis Checkout"
                    />
                  </div>
                  <button
                    onClick={handlePaymentComplete}
                    className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all"
                  >
                    I've completed my payment ✓
                  </button>
                </div>
              )}

              <p className="text-xs text-center text-muted-foreground">
                🔒 Secure payment powered by Fanbasis
              </p>

              <button
                onClick={() => { setStep("email"); setCheckoutSecret(null); setCheckoutError(false); }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                ← Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
