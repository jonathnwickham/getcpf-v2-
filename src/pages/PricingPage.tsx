import { useState, useEffect } from "react";
import SEO from "@/components/SEO";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";

const tiers = [
  {
    name: "Self-Service",
    price: "$29",
    originalPrice: "$49",
    description: "Everything automated. AI-powered, instant access.",
    highlighted: true,
    badge: "Available now",
    comingSoon: false,
    features: [
      "AI-powered consultation for your situation",
      "Pre-filled form data with copy buttons",
      "Portuguese email template with your details",
      "Document storage (passport, address proof)",
      "AI document scanner, checks your docs are correct",
      "Correct Receita Federal office for your state",
      "Document checklist with quality tips",
      "Portuguese cheat sheet for office visits",
      "Host declaration letter generator",
      "Post-CPF partner recommendations",
      "Application status tracking",
    ],
    cta: "Get started, $29",
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

const PRODUCT_ID = "0LD5G";
const CREATOR_HANDLE = "telosmedia";
const FALLBACK_URL = `https://www.fanbasis.com/agency-checkout/${CREATOR_HANDLE}/${PRODUCT_ID}`;

const PricingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  // Page meta
  const [flowStep, setFlowStep] = useState<FlowStep>("email");

  // Sync URL with step
  useEffect(() => {
    const stepNum = { email: 1, plan: 2, payment: 3, password: 4, done: 5 }[flowStep] || 1;
    const url = stepNum > 1 ? `/pricing?step=${stepNum}` : "/pricing";
    window.history.replaceState(null, "", url);
  }, [flowStep]);

  // Handle browser back button
  useEffect(() => {
    const handlePop = () => {
      const params = new URLSearchParams(window.location.search);
      const step = parseInt(params.get("step") || "1");
      const steps: FlowStep[] = ["email", "plan", "payment", "password", "done"];
      setFlowStep(steps[step - 1] || "email");
    };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  // If logged in: redirect paid users to dashboard, skip email step for unpaid users
  useEffect(() => {
    if (!user) return;
    const checkPaid = async () => {
      const { data: apps } = await supabase
        .from("applications")
        .select("status")
        .eq("user_id", user.id)
        .in("status", ["paid", "prepared", "office_visited", "cpf_issued"])
        .limit(1);
      if (apps && apps.length > 0) {
        navigate("/dashboard");
      } else {
        // Logged in but hasn't paid: pre-fill email and skip to plan selection
        setEmail(user.email || "");
        if (flowStep === "email") {
          setFlowStep("plan");
        }
      }
    };
    checkPaid();
  }, [user, navigate]);
  const [email, setEmail] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // Fanbasis checkout state
  const [checkoutSecret, setCheckoutSecret] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  // Promo code state
  const [promoInput, setPromoInput] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount_percent: number } | null>(null);
  const [promoError, setPromoError] = useState("");

  const BASE_PRICE = 49;
  const finalPrice = appliedPromo
    ? (BASE_PRICE * (1 - appliedPromo.discount_percent / 100)).toFixed(2)
    : BASE_PRICE.toFixed(2);
  const discount = appliedPromo
    ? (BASE_PRICE * appliedPromo.discount_percent / 100).toFixed(2)
    : null;

  const applyPromo = async () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    setPromoLoading(true);
    setPromoError("");
    const { data: promo } = await supabase
      .rpc("validate_promo_code", { _code: code })
      .maybeSingle();

    if (!promo) {
      setPromoError("Code not found or expired");
      setAppliedPromo(null);
    } else {
      setAppliedPromo({ code: promo.code, discount_percent: promo.discount_percent });
      setPromoError("");
    }
    setPromoLoading(false);
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoInput("");
    setPromoError("");
  };

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }
    window.history.pushState(null, "", "/pricing?step=2");
    setFlowStep("plan");
  };

  const handleSelectPlan = async (tierName: string) => {
    setSelectedPlan(tierName);
    window.history.pushState(null, "", "/pricing?step=3");
    setFlowStep("payment");
    
    // Start loading embedded checkout
    setLoadingCheckout(true);
    setCheckoutError(false);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { email },
      });
      if (error || !data?.checkout_session_secret) {
        console.error("Checkout error:", error, data);
        setCheckoutError(true);
      } else {
        setCheckoutSecret(data.checkout_session_secret);
      }
    } catch (err) {
      console.error("Checkout fetch error:", err);
      setCheckoutError(true);
    }
    setLoadingCheckout(false);
  };

  const [paymentVerified, setPaymentVerified] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [pollCount, setPollCount] = useState(0);

  const EMBEDDED_URL = checkoutSecret
    ? `https://embedded.fanbasis.io/session/telosmedia/0LD5G/${checkoutSecret}`
    : null;

  const handlePaymentComplete = () => {
    // Show celebration for 2.5 seconds before moving to account step
    setShowPaymentSuccess(true);
    setTimeout(() => {
      setShowPaymentSuccess(false);
      setFlowStep("password");
    }, 2500);
  };

  const MAX_POLLS = 90; // ~3 minutes at 2s intervals

  // Poll verify-payment endpoint every 2 seconds once on payment step
  useEffect(() => {
    if (flowStep !== "payment" || !email || paymentVerified) return;

    const poll = async () => {
      setPollCount(c => {
        if (c >= MAX_POLLS) return c;
        return c + 1;
      });
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

    const interval = setInterval(() => {
      if (pollCount < MAX_POLLS) poll();
    }, 2000);
    poll();

    return () => clearInterval(interval);
  }, [flowStep, email, paymentVerified]);

  // Listen for postMessage from Fanbasis iframe for payment completion
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "fanbasis:payment_success" || event.data?.status === "success") {
        handlePaymentComplete();
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleWaitlist = async (e: React.FormEvent, tierName: string) => {
    e.preventDefault();
    const wEmail = waitlistEmail.trim() || email.trim();
    if (!wEmail) return;
    const { error } = await supabase.from("waitlist").insert({ email: wEmail, plan: tierName } as any);
    if (error) {
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
      return;
    }
    setWaitlistSubmitted(true);
    toast({ title: "You're on the list!", description: "We'll let you know the moment it's ready." });

    // Send waitlist confirmation email
    try {
      await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "waitlist-confirmation",
          recipientEmail: wEmail,
          idempotencyKey: `waitlist-${wEmail}-${tierName}`,
          templateData: { plan: tierName },
        },
      });
    } catch (emailErr) {
      console.error("Waitlist confirmation email error:", emailErr);
    }
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
        emailRedirectTo: `${window.location.origin}/get-started`,
        data: { plan: "self-service" },
      },
    });

    if (error) {
      if (error.message?.toLowerCase().includes("already registered") || error.message?.toLowerCase().includes("already been registered")) {
        // Try signing in instead
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          toast({
            title: "Account already exists",
            description: "An account with this email already exists. Please sign in instead.",
            variant: "destructive",
          });
          setLoading(false);
          setTimeout(() => navigate("/login"), 2000);
        } else {
          toast({ title: "Welcome back!", description: "Signed in to your existing account." });
          setLoading(false);
          navigate("/get-started");
        }
      } else {
        toast({ title: "Something went wrong", description: error.message, variant: "destructive" });
        setLoading(false);
      }
    } else {
      // Auto-confirm is enabled, so sign in immediately and redirect
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        // Fallback: show done step if auto-sign-in fails
        setFlowStep("done");
        setLoading(false);
      } else {
        toast({ title: "Account created!", description: "Let's get your CPF sorted." });
        setLoading(false);
        navigate("/get-started");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Pricing — GET CPF | $29 One-Time Payment" description="Get your Brazilian CPF for $29 (beta pricing). AI-powered preparation, pre-filled forms, and 100% acceptance guarantee." path="/pricing" />
      {/* Top bar */}
      <div className="border-b border-border bg-background sticky top-0 z-50">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between px-6 py-4">
          <a href="/">
            <Logo className="h-10" />
          </a>
          {!user ? (
            <a href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Already have an account? <span className="text-primary font-semibold">Sign in</span>
            </a>
          ) : (
            <button onClick={() => supabase.auth.signOut().then(() => window.location.href = "/")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sign out
            </button>
          )}
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 py-12">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {["Your email", "Choose plan", "Payment", "Create account"].map((label, i) => {
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
                    {(tier as any).originalPrice && (
                      <span className="text-2xl line-through text-muted-foreground/50 mr-2">{(tier as any).originalPrice}</span>
                    )}
                    {tier.price} <span className="text-base font-normal text-muted-foreground">USD</span>
                  </div>
                  {(tier as any).originalPrice && (
                    <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full mt-2">
                      🎉 Beta pricing — limited spots
                    </div>
                  )}
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
                      <form onSubmit={(e) => handleWaitlist(e, tier.name)} className="space-y-2">
                        <input
                          type="email"
                          value={waitlistEmail}
                          onChange={(e) => setWaitlistEmail(e.target.value)}
                          required
                          placeholder="your@email.com"
                          className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                        <button
                          type="submit"
                          className="w-full py-3.5 rounded-xl font-semibold border border-border text-foreground hover:bg-secondary transition-all"
                        >
                          Join waitlist →
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

            {/* Guarantee + micro-testimonials */}
            <div className="mt-8 space-y-4 max-w-[700px] mx-auto">
              <div className="flex items-center justify-center gap-2 text-sm text-primary font-semibold">
                <span>🛡️</span>
                If you follow our steps and get rejected — full refund. No questions asked.
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                {[
                  { text: "Got my CPF in 45 minutes. The Portuguese phrases saved me.", name: "James K.", loc: "São Paulo" },
                  { text: "Worth every cent. I'd have wasted the whole day without this.", name: "Sarah M.", loc: "Florianópolis" },
                  { text: "We both got CPFs on the first try. The troubleshooter is genius.", name: "Lisa W.", loc: "Rio de Janeiro" },
                ].map((t) => (
                  <div key={t.name} className="bg-card border border-border rounded-xl p-4">
                    <p className="text-xs text-muted-foreground leading-relaxed">"{t.text}"</p>
                    <p className="text-xs text-primary font-semibold mt-2">{t.name} — {t.loc}</p>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => setFlowStep("email")} className="mt-8 text-sm text-muted-foreground hover:text-foreground mx-auto block">
              ← Back
            </button>
          </div>
        )}

        {/* STEP 3: Payment — Fanbasis Checkout */}
        {flowStep === "payment" && (
          <div className="max-w-md mx-auto text-center relative">
            {/* Payment success overlay */}
            {showPaymentSuccess && (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm rounded-2xl animate-fade-in">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  {Array.from({ length: 24 }).map((_, i) => {
                    const colors = ["hsl(var(--primary))", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"];
                    const color = colors[i % colors.length];
                    const left = Math.random() * 100;
                    const delay = Math.random() * 0.5;
                    const size = 5 + Math.random() * 5;
                    const duration = 1.2 + Math.random() * 1;
                    const drift = (Math.random() - 0.5) * 100;
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
                          ["--drift" as string]: `${drift}px`,
                        }}
                      />
                    );
                  })}
                </div>
                <style>{`
                  @keyframes confetti-fall {
                    0% { opacity: 1; transform: translateY(0) translateX(0) rotate(0deg); }
                    100% { opacity: 0; transform: translateY(320px) translateX(var(--drift)) rotate(720deg); }
                  }
                  @keyframes success-pop {
                    0% { transform: scale(0); opacity: 0; }
                    50% { transform: scale(1.2); }
                    100% { transform: scale(1); opacity: 1; }
                  }
                `}</style>
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4" style={{ animation: "success-pop 0.5s ease-out forwards" }}>
                  <span className="text-4xl">✓</span>
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight mb-2">Payment received!</h2>
                <p className="text-sm text-muted-foreground">Setting up your account...</p>
              </div>
            )}

            <h1 className="text-3xl font-extrabold tracking-tight mb-3">One quick payment</h1>

            {/* Order summary */}
            <div className="bg-card border border-border rounded-xl p-5 mb-6 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-sm">{selectedPlan} - CPF Application Service</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">{email}</p>
                </div>
                {appliedPromo ? (
                  <div className="text-right">
                    <span className="line-through text-muted-foreground text-sm">$29</span>{" "}
                    <span className="font-bold text-primary text-xl">${finalPrice}</span>
                    <div className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full mt-1">
                      🎉 {appliedPromo.code} -${discount}
                      <button onClick={removePromo} className="hover:text-primary/70">✕</button>
                    </div>
                  </div>
                ) : (
                  <span className="text-xl font-bold"><span className="line-through text-muted-foreground text-sm">$49</span> $29</span>
                )}
              </div>
            </div>

            {/* Promo code input */}
            {!appliedPromo && (
              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    value={promoInput}
                    onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError(""); }}
                    placeholder="Discount code"
                    maxLength={30}
                    className="flex-1 bg-secondary border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono tracking-wide"
                  />
                  <button
                    onClick={applyPromo}
                    disabled={promoLoading || !promoInput.trim()}
                    className="bg-secondary border border-border px-5 py-3 rounded-xl text-sm font-semibold hover:bg-muted transition-all disabled:opacity-50"
                  >
                    {promoLoading ? "..." : "Apply"}
                  </button>
                </div>
                {promoError && <p className="text-xs text-destructive mt-1.5 text-left">{promoError}</p>}
              </div>
            )}

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
                  Pay ${finalPrice} securely ↗
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl overflow-hidden border border-border bg-card">
                  <iframe
                    src={EMBEDDED_URL}
                    className="w-full border-0"
                    style={{ minHeight: "450px", height: "calc(100vh - 320px)", maxHeight: "800px" }}
                    allow="payment"
                    title="Fanbasis Checkout"
                  />
                </div>
                <div className="flex flex-col items-center gap-2 py-2">
                {!paymentVerified && pollCount < MAX_POLLS ? (
                  <>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span>
                        {pollCount <= 2
                          ? "Complete your payment above..."
                          : pollCount <= 6
                            ? "Waiting for payment confirmation..."
                            : "Still checking, this can take a moment..."}
                      </span>
                    </div>
                    {pollCount > 4 && (
                      <p className="text-xs text-muted-foreground/70">
                        Payments typically confirm within 30 seconds
                      </p>
                    )}
                  </>
                ) : !paymentVerified ? (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Payment not detected yet.</p>
                    <button
                      onClick={() => setPollCount(0)}
                      className="text-sm text-primary font-semibold hover:underline"
                    >
                      Check again
                    </button>
                    <p className="text-xs text-muted-foreground mt-1">
                      Already paid? <a href="/contact" className="text-primary hover:underline">Contact support</a>
                    </p>
                  </div>
                ) : null}
                </div>
              </div>
            )}

            <div className="mt-6 text-center text-sm text-primary font-semibold">
              🛡️ If you follow our steps and get rejected - full refund. No questions asked.
            </div>

            <div className="mt-3 flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Secure checkout
              </span>
              <span>•</span>
              <span>One-time payment</span>
            </div>

            <button onClick={() => { setFlowStep("plan"); setCheckoutSecret(null); setCheckoutError(false); setPollCount(0); }} className="mt-6 text-sm text-muted-foreground hover:text-foreground mx-auto block min-h-[44px] flex items-center justify-center">
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
            <form onSubmit={handleCreateAccount} className="space-y-4 text-left relative z-10">
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
              <label className={`flex items-start gap-2.5 cursor-pointer p-3 rounded-xl border transition-colors ${agreed ? 'border-primary/30 bg-primary/5' : 'border-border bg-secondary/50'}`}>
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 w-4 h-4 rounded border-border accent-primary" />
                <span className="text-sm text-muted-foreground leading-relaxed">
                  I agree to the <a href="/terms" className="text-primary hover:underline font-semibold">Terms of Service</a> and <a href="/privacy" className="text-primary hover:underline font-semibold">Privacy Policy</a>.
                </span>
              </label>
              <button
                type="submit"
                disabled={loading || !agreed}
                className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Setting things up..." : "Create my account →"}
              </button>
              {!agreed && (
                <p className="text-sm text-muted-foreground text-center">☝️ Check the box above to continue</p>
              )}
            </form>
          </div>
        )}

        {/* STEP 5: Done — Check your email */}
        {flowStep === "done" && (
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">✉️</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-3">Check your email</h1>
            <p className="text-muted-foreground text-sm mb-4">
              We sent a verification link to <strong className="text-foreground">{email}</strong>.
              Click the link to activate your account, then sign in to start your CPF application.
            </p>
            <p className="text-xs text-muted-foreground mb-8">
              Didn't get it? Check your spam folder.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all"
            >
              Go to sign in →
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PricingPage;
