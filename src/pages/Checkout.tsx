import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const PRODUCT_ID = "0LD5G";
const CREATOR_HANDLE = "telosmedia";
const CHECKOUT_URL = `https://www.fanbasis.com/agency-checkout/${CREATOR_HANDLE}/${PRODUCT_ID}`;

const Checkout = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "payment">("email");
  const [paymentOpened, setPaymentOpened] = useState(false);

  // Pre-fill email from auth if available
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const handleEmailContinue = () => {
    if (!email.includes("@")) return;
    setStep("payment");
  };

  const handlePayNow = () => {
    window.location.href = CHECKOUT_URL;
  };

  const handlePaymentComplete = () => {
    // TODO: Replace this manual button with automatic webhook-based payment verification.
    // Set up a Fanbasis webhook subscription listening for payment.succeeded events
    // and verify payment server-side before advancing the user.
    navigate("/get-started");
  };

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
        <div className="w-full max-w-[500px]">
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

              {!paymentOpened ? (
                <div className="space-y-4">
                  <button
                    onClick={handlePayNow}
                    className="w-full bg-foreground text-background py-4 rounded-xl font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-3"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    Pay $49 securely →
                  </button>
                  <p className="text-xs text-center text-muted-foreground">
                    You'll be taken to our secure payment page to complete checkout
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 text-center">
                    <div className="text-2xl mb-2">💳</div>
                    <p className="text-sm font-semibold text-foreground mb-1">Payment page is open</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Complete your payment in the tab that just opened. Once done, click below to continue.
                    </p>
                  </div>

                  <button
                    onClick={handlePayNow}
                    className="w-full border border-border bg-secondary text-foreground py-3 rounded-xl font-semibold text-sm hover:bg-secondary/80 transition-all"
                  >
                    Reopen payment page ↗
                  </button>

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
              )}

              <p className="text-xs text-center text-muted-foreground">
                🔒 Secure payment powered by Fanbasis
              </p>

              <button
                onClick={() => { setStep("email"); setPaymentOpened(false); }}
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
