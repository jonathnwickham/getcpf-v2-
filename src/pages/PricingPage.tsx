import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";

const tiers = [
  {
    name: "Self-Service",
    price: "$49",
    description: "Everything automated. AI-powered, instant access.",
    highlighted: true,
    badge: "Available now",
    comingSoon: false,
    features: [
      "AI-powered consultation for your situation",
      "Pre-filled form data with copy buttons",
      "Portuguese email template with your details",
      "Document storage (passport, address proof)",
      "AI document scanner — checks your docs are correct",
      "Correct Receita Federal office for your state",
      "Document checklist with quality tips",
      "Portuguese cheat sheet for office visits",
      "Host declaration letter generator",
      "Post-CPF partner recommendations",
      "Application status tracking",
    ],
    cta: "Get started — $49",
  },
  {
    name: "Concierge",
    price: "$97",
    description: "Everything in Self-Service plus real human support via WhatsApp.",
    highlighted: false,
    badge: "Coming soon",
    comingSoon: true,
    features: [
      "Everything in Self-Service",
      "WhatsApp / in-app messaging support",
      "Location-specific advice for your office",
      "Help troubleshooting if something goes wrong",
      "Advice specific to your nationality & visa",
      "Response within a few hours (Brazil time)",
    ],
    cta: "Join waitlist",
  },
  {
    name: "Full Assist",
    price: "$197",
    description: "A real person guides you through every single step until you have your CPF.",
    highlighted: false,
    badge: "Coming soon",
    comingSoon: true,
    features: [
      "Everything in Concierge",
      "Personal guide through each step",
      "Document review before submission",
      "Told exactly what to say at the office",
      "Follow-up until CPF is confirmed",
      "Priority response time",
    ],
    cta: "Join waitlist",
  },
];

type FlowStep = "email" | "plan" | "payment" | "password" | "done";

const PricingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [flowStep, setFlowStep] = useState<FlowStep>("email");
  const [email, setEmail] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes("@")) {
      setFlowStep("plan");
    }
  };

  const handleSelectPlan = (tierName: string) => {
    setSelectedPlan(tierName);
    setFlowStep("payment");
  };

  const handleMockPayment = (method: "card" | "paypal") => {
    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Payment sorted!", description: `$49 charged via ${method === "card" ? "card" : "PayPal"}. Let's set up your account.` });
      setFlowStep("password");
    }, 1500);
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Password too short", description: "Make it at least 6 characters.", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Those don't match", description: "Check your passwords and try again.", variant: "destructive" });
      return;
    }
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { plan: "self-service" },
      },
    });

    if (error) {
      toast({ title: "Something went wrong", description: error.message, variant: "destructive" });
      setLoading(false);
    } else {
      toast({ title: "You're in! 🎉", description: "Let's get your CPF sorted." });
      navigate("/get-started");
      setLoading(false);
    }
  };

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    setWaitlistSubmitted(true);
    toast({ title: "You're on the list!", description: "We'll let you know the moment it's ready." });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border bg-background sticky top-0 z-50">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between px-6 py-4">
          <a href="/" className="text-lg font-bold tracking-tight">
            GET <span className="text-primary">CPF</span>
          </a>
          <a href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Already have an account? <span className="text-primary font-semibold">Sign in</span>
          </a>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 py-12">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {["Email", "Plan", "Payment", "Account"].map((label, i) => {
            const steps: FlowStep[] = ["email", "plan", "payment", "password"];
            const isActive = steps.indexOf(flowStep) >= i || flowStep === "done";
            const isCurrent = steps[i] === flowStep;
            return (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                } ${isCurrent ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}>
                  {flowStep === "done" || (steps.indexOf(flowStep) > i) ? "✓" : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                  {label}
                </span>
                {i < 3 && <div className={`w-8 h-px ${isActive ? "bg-primary" : "bg-border"}`} />}
              </div>
            );
          })}
        </div>

        {/* STEP 1: Email */}
        {flowStep === "email" && (
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-3xl font-extrabold tracking-tight mb-3">Let's get your CPF sorted</h1>
            <p className="text-muted-foreground text-sm mb-8">Pop in your email and we'll get you started.</p>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@email.com"
                className="w-full bg-secondary border border-border rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all"
              >
                That's me — let's go →
              </button>
            </form>
            <p className="text-xs text-muted-foreground mt-4">No spam, ever. Just your CPF kit.</p>
          </div>
        )}

        {/* STEP 2: Plan Selection */}
        {flowStep === "plan" && (
          <div>
            <div className="text-center mb-10">
              <h1 className="text-3xl font-extrabold tracking-tight mb-3">Choose how you want to do this</h1>
              <p className="text-muted-foreground text-sm">The CPF itself is free. You're paying for preparation that makes it work first time.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`bg-card rounded-2xl p-8 text-left relative ${
                    tier.highlighted
                      ? "border-2 border-primary shadow-lg shadow-primary/5"
                      : "border border-border"
                  }`}
                >
                  {tier.badge && (
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold ${
                      tier.comingSoon
                        ? "bg-muted text-muted-foreground border border-border"
                        : "bg-primary text-primary-foreground"
                    }`}>
                      {tier.badge}
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground font-semibold mb-2">{tier.name}</div>
                  <div className="text-4xl font-extrabold tracking-tight">
                    {tier.price} <span className="text-base font-normal text-muted-foreground">USD</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-3 mb-6 leading-relaxed">{tier.description}</div>
                  <ul className={`mb-8 space-y-2.5 ${tier.comingSoon ? "opacity-60" : ""}`}>
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                        <span className="text-primary font-bold shrink-0 mt-0.5">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  {tier.comingSoon ? (
                    !waitlistSubmitted ? (
                      <form onSubmit={handleWaitlist} className="space-y-2">
                        <button
                          type="submit"
                          className="w-full py-3.5 rounded-xl font-semibold border border-border text-muted-foreground cursor-not-allowed opacity-60"
                          disabled
                        >
                          Coming soon
                        </button>
                      </form>
                    ) : (
                      <div className="text-center text-sm text-primary font-semibold py-3.5">✓ On the waitlist</div>
                    )
                  ) : (
                    <button
                      onClick={() => handleSelectPlan(tier.name)}
                      className="w-full py-3.5 rounded-xl font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-md shadow-primary/20 transition-all"
                    >
                      {tier.cta} →
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button onClick={() => setFlowStep("email")} className="mt-8 text-sm text-muted-foreground hover:text-foreground mx-auto block">
              ← Back
            </button>
          </div>
        )}

        {/* STEP 3: Payment */}
        {flowStep === "payment" && (
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-3xl font-extrabold tracking-tight mb-3">One quick payment</h1>
            <p className="text-muted-foreground text-sm mb-2">
              {selectedPlan} plan — <span className="font-bold text-foreground">$49 USD</span>
            </p>
            <p className="text-xs text-muted-foreground mb-8">for {email}</p>

            <div className="space-y-3">
              {/* Mock Stripe card payment */}
              <button
                onClick={() => handleMockPayment("card")}
                disabled={loading}
                className="w-full bg-foreground text-background py-4 rounded-xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <span className="animate-pulse">Sorting your payment...</span>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <line x1="2" x2="22" y1="10" y2="10" />
                    </svg>
                    Pay with card
                  </>
                )}
              </button>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex-1 h-px bg-border" />
                or
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Mock PayPal payment */}
              <button
                onClick={() => handleMockPayment("paypal")}
                disabled={loading}
                className="w-full bg-[hsl(48,100%,50%)] text-[hsl(220,20%,20%)] py-4 rounded-xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="animate-pulse">Sorting your payment...</span>
                ) : (
                  <>
                    <span className="font-extrabold text-base tracking-tight">Pay with </span>
                    <span className="font-extrabold text-base tracking-tight text-[hsl(210,80%,45%)]">PayPal</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Secure checkout
              </span>
              <span>•</span>
              <span>One-time payment</span>
            </div>

            <button onClick={() => setFlowStep("plan")} className="mt-8 text-sm text-muted-foreground hover:text-foreground">
              ← Back to plans
            </button>
          </div>
        )}

        {/* STEP 4: Set Password (create account) */}
        {flowStep === "password" && (
          <div className="max-w-md mx-auto text-center relative">
            {/* Confetti burst */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {Array.from({ length: 30 }).map((_, i) => {
                const colors = ["hsl(var(--primary))", "#f59e0b", "#ef4444", "#3b82f6", "#10b981", "#8b5cf6"];
                const color = colors[i % colors.length];
                const left = Math.random() * 100;
                const delay = Math.random() * 0.8;
                const size = 6 + Math.random() * 6;
                const duration = 1.5 + Math.random() * 1.5;
                const drift = (Math.random() - 0.5) * 120;
                return (
                  <div
                    key={i}
                    className="absolute rounded-sm"
                    style={{
                      left: `${left}%`,
                      top: "-10px",
                      width: `${size}px`,
                      height: `${size}px`,
                      backgroundColor: color,
                      animation: `confetti-fall ${duration}s ease-out ${delay}s forwards`,
                      opacity: 0,
                      transform: `translateX(0px) rotate(0deg)`,
                      ["--drift" as string]: `${drift}px`,
                    }}
                  />
                );
              })}
            </div>
            <style>{`
              @keyframes confetti-fall {
                0% { opacity: 1; transform: translateY(0) translateX(0) rotate(0deg); }
                100% { opacity: 0; transform: translateY(420px) translateX(var(--drift)) rotate(720deg); }
              }
            `}</style>
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
              <span className="text-3xl">✓</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-3 animate-fade-in">You're in!</h1>
            <p className="text-muted-foreground text-sm mb-8">
              Set a password so you can come back anytime — your progress will be saved.
            </p>
            <form onSubmit={handleCreateAccount} className="space-y-4 text-left">
              <div>
                <label className="text-sm font-semibold text-foreground block mb-1.5">Email</label>
                <div className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-muted-foreground">
                  {email}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground block mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="••••••••"
                  autoFocus
                />
                <p className="text-xs text-muted-foreground mt-1">At least 6 characters</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground block mb-1.5">Confirm password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="••••••••"
                />
              </div>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 w-4 h-4 rounded border-border accent-primary" />
                <span className="text-xs text-muted-foreground leading-relaxed">
                  I agree to the <a href="/terms" className="text-primary hover:underline font-semibold">Terms of Service</a> and <a href="/privacy" className="text-primary hover:underline font-semibold">Privacy Policy</a>.
                </span>
              </label>
              <button
                type="submit"
                disabled={loading || !agreed}
                className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50"
              >
                {loading ? "Setting things up..." : "Create my account →"}
              </button>
            </form>
          </div>
        )}

        {/* STEP 5: Done */}
        {flowStep === "done" && (
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🎉</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-3">You're all set!</h1>
            <p className="text-muted-foreground text-sm mb-8">
              Your account is ready — sign in and let's get your CPF sorted.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all"
            >
              Sign in →
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PricingPage;
