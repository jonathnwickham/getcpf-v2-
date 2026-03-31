import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

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

  // Pre-fill email from auth if available
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const handleEmailContinue = () => {
    if (!email.includes("@")) return;
    setStep("payment");
    fetchCheckoutSession(email);
  };

  const fetchCheckoutSession = async (userEmail: string) => {
    setLoadingCheckout(true);
    setCheckoutError(false);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { email: userEmail },
      });

      if (error || !data?.checkout_session_secret) {
        console.error("Checkout session error:", error, data);
        setCheckoutError(true);
      } else {
        setCheckoutSecret(data.checkout_session_secret);
      }
    } catch (err) {
      console.error("Failed to create checkout:", err);
      setCheckoutError(true);
    } finally {
      setLoadingCheckout(false);
    }
  };

  const handlePaymentComplete = () => {
    // TODO: Replace this manual button with automatic webhook-based payment verification.
    // Set up a Fanbasis webhook subscription listening for payment.succeeded events
    // and verify payment server-side before advancing the user.
    navigate("/get-started");
  };

  const handleFallbackPay = () => {
    window.open(FALLBACK_URL, "_blank");
  };

  const embeddedUrl = checkoutSecret
    ? `https://embedded.fanbasis.io/session/${CREATOR_HANDLE}/${PRODUCT_ID}/${checkoutSecret}`
    : null;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="border-b border-border bg-background">
        <div className="flex items-center justify-between px-6 py-4 max-w-[600px] mx-auto">
          <a href="/" className="text-lg font-bold tracking-tight">
            GET <span className="text-primary">CPF</span>
          </a>
          <span className="text-xs text-muted-foreground font-medium">
            {step === "email" ? "Step 1 of 2" : "Step 2 of 2"}
          </span>
        </div>
      </div>

      <div className="flex-1 flex items-start justify-center px-6 py-8 md:py-12">
        <div className="w-full max-w-[600px]">
          {step === "email" ? (
            /* Step 1: Email capture */
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
            /* Step 2: Payment */
            <div className="space-y-5">
              {/* Order summary */}
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-sm">CPF Application Service</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">{email}</p>
                  </div>
                  <span className="text-xl font-bold">$49</span>
                </div>
              </div>

              {/* Embedded checkout or fallback */}
              {loadingCheckout ? (
                <div className="space-y-3">
                  <Skeleton className="w-full h-[700px] rounded-xl" />
                  <p className="text-xs text-center text-muted-foreground">Loading secure checkout...</p>
                </div>
              ) : checkoutError ? (
                /* Fallback UI */
                <div className="bg-card border border-border rounded-xl p-6 text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    We couldn't load the embedded checkout. You can complete your payment in a new tab instead.
                  </p>
                  <button
                    onClick={handleFallbackPay}
                    className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all"
                  >
                    Pay $49 →
                  </button>
                  <p className="text-xs text-muted-foreground">
                    Complete your payment in the new tab, then click below to continue
                  </p>
                  {/* TODO: Replace this manual button with automatic webhook-based payment verification.
                      Set up a Fanbasis webhook subscription listening for payment.succeeded events
                      and verify payment server-side before advancing the user. */}
                  <button
                    onClick={handlePaymentComplete}
                    className="w-full border border-border bg-secondary text-foreground py-3 rounded-xl font-semibold text-sm hover:bg-secondary/80 transition-all"
                  >
                    I've completed my payment ✓
                  </button>
                </div>
              ) : embeddedUrl ? (
                /* Embedded Fanbasis checkout */
                <div className="space-y-4">
                  <iframe
                    src={embeddedUrl}
                    title="Fanbasis Checkout"
                    style={{
                      width: "100%",
                      minHeight: "700px",
                      border: "none",
                      borderRadius: "12px",
                    }}
                    allow="payment"
                  />
                  <p className="text-xs text-center text-muted-foreground">
                    🔒 Secure payment powered by Fanbasis
                  </p>
                  {/* TODO: Replace this manual button with automatic webhook-based payment verification.
                      Set up a Fanbasis webhook subscription listening for payment.succeeded events
                      and verify payment server-side before advancing the user. */}
                  <button
                    onClick={handlePaymentComplete}
                    className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all"
                  >
                    I've completed my payment ✓
                  </button>
                </div>
              ) : null}

              <button
                onClick={() => setStep("email")}
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
