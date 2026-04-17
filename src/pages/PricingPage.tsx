import { useState, useEffect } from "react";
import SEO from "@/components/SEO";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
  },
  {
    name: "Concierge",
    price: "$97",
    description: "Self-Service + real human support via WhatsApp.",
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
  },
  {
    name: "Full Assist",
    price: "$197",
    description: "Personal guide through every step until you have your CPF.",
    highlighted: false,
    badge: "Coming soon",
    comingSoon: true,
    features: [
      "Everything in Concierge",
      "Personal guide each step",
      "Document review before submission",
      "Told exactly what to say at the office",
      "Follow-up until CPF is confirmed",
      "Priority response time",
    ],
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

  // Read step and email from URL on initial load (e.g., redirect from /verify)
  const initialParams = new URLSearchParams(window.location.search);
  const initialStep = parseInt(initialParams.get("step") || "1");
  const initialEmail = initialParams.get("email") || "";
  const steps: FlowStep[] = ["email", "plan", "payment", "password", "done"];
  const [flowStep, setFlowStep] = useState<FlowStep>(steps[initialStep - 1] || "email");

  useEffect(() => {
    const stepNum = { email: 1, plan: 2, payment: 3, password: 4, done: 5 }[flowStep] || 1;
    const url = stepNum > 1 ? `/pricing?step=${stepNum}` : "/pricing";
    window.history.replaceState(null, "", url);
  }, [flowStep]);

  useEffect(() => {
    const handlePop = () => {
      const params = new URLSearchParams(window.location.search);
      const step = parseInt(params.get("step") || "1");
      setFlowStep(steps[step - 1] || "email");
    };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

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
        setEmail(user.email || "");
        if (flowStep === "email") setFlowStep("plan");
      }
    };
    checkPaid();
  }, [user, navigate]);

  const [email, setEmail] = useState(initialEmail);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [agreementError, setAgreementError] = useState(false);

  const [checkoutSecret, setCheckoutSecret] = useState<string | null>(null);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  const [promoInput, setPromoInput] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount_percent: number } | null>(null);
  const [promoError, setPromoError] = useState("");

  const BASE_PRICE = 29;
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
    const { data: promo } = await supabase.rpc("validate_promo_code", { _code: code }).maybeSingle();
    if (!promo) {
      setPromoError("Code not found or expired");
      setAppliedPromo(null);
    } else {
      setAppliedPromo({ code: promo.code, discount_percent: promo.discount_percent });
      setPromoError("");
    }
    setPromoLoading(false);
  };

  const removePromo = () => { setAppliedPromo(null); setPromoInput(""); setPromoError(""); };
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
    setLoadingCheckout(true);
    setCheckoutError(false);
    try {
      const res = await supabase.functions.invoke("create-checkout", { body: { email, metadata: { user_email: email, source: "cpf-app" } } });
      const secret = res.data?.checkout_session_secret;
      const embedUrl = res.data?.embed_url;
      if (embedUrl) {
        setCheckoutSecret(secret);
        setEmbedUrl(embedUrl);
      } else if (secret) {
        setCheckoutSecret(secret);
        setEmbedUrl(`https://embedded.fanbasis.io/session/telosmedia/0LD5G/${secret}`);
      } else {
        console.error("create-checkout response:", JSON.stringify(res));
        setCheckoutError(true);
      }
    } catch (err) {
      console.error("create-checkout failed:", err);
      setCheckoutError(true);
    }
    setLoadingCheckout(false);
  };

  const [paymentVerified, setPaymentVerified] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [pollCount, setPollCount] = useState(0);
  const EMBEDDED_URL = embedUrl || (checkoutSecret ? `https://embedded.fanbasis.io/session/telosmedia/0LD5G/${checkoutSecret}` : null);
  const MAX_POLLS = 90;

  const handlePaymentComplete = () => {
    setShowPaymentSuccess(true);
    setTimeout(() => { setShowPaymentSuccess(false); navigate(`/welcome?email=${encodeURIComponent(email)}`); }, 2500);
  };

  useEffect(() => {
    if (flowStep !== "payment" || !email || paymentVerified) return;
    let count = 0;
    const poll = async () => {
      count++;
      setPollCount(count);
      if (count > MAX_POLLS) return;
      try {
        const { data } = await supabase.functions.invoke("verify-payment", {
          body: { email, checkout_session_secret: checkoutSecret },
        });
        console.log(`[verify-payment] poll #${count}:`, data?.paid ? "PAID" : "not yet");
        if (data?.paid) { setPaymentVerified(true); handlePaymentComplete(); }
      } catch (err) {
        console.error("[verify-payment] poll error:", err);
      }
    };
    poll();
    const interval = setInterval(poll, 2000);
    return () => clearInterval(interval);
  }, [flowStep, email, paymentVerified, checkoutSecret]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "fanbasis:payment_success" || event.data?.status === "success") handlePaymentComplete();
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleWaitlist = async (e: React.FormEvent, tierName: string) => {
    e.preventDefault();
    const wEmail = waitlistEmail.trim() || email.trim();
    if (!wEmail) return;
    const { error } = await supabase.from("waitlist").insert({ email: wEmail, plan: tierName } as any);
    if (error) { toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" }); return; }
    setWaitlistSubmitted(true);
    toast({ title: "You're on the list!", description: "We'll let you know the moment it's ready." });
    try {
      await supabase.functions.invoke("send-transactional-email", {
        body: { templateName: "waitlist-confirmation", recipientEmail: wEmail, idempotencyKey: `waitlist-${wEmail}-${tierName}`, templateData: { plan: tierName } },
      });
    } catch {}
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) { setAgreementError(true); toast({ title: "Please accept the terms", description: "Tick the box above to create your account.", variant: "destructive" }); return; }
    if (password.length < 6) { toast({ title: "Password too short", description: "Make it at least 6 characters.", variant: "destructive" }); return; }
    if (password !== confirmPassword) { toast({ title: "Those don't match", description: "Check your passwords and try again.", variant: "destructive" }); return; }
    setLoading(true);
    // Create user via admin API — no confirmation email, no rate limits
    const { data: createData } = await supabase.functions.invoke("confirm-user", {
      body: { email, password, plan: "self-service" },
    });
    if (createData?.error === "already_registered") {
      // User exists — try signing in
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        toast({ title: "Account already exists", description: "An account with this email already exists. Please sign in instead.", variant: "destructive" });
        setLoading(false);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast({ title: "Welcome back!", description: "Signed in to your existing account." }); setLoading(false); navigate("/get-started");
      }
    } else if (createData?.error) {
      toast({ title: "Something went wrong", description: createData.error, variant: "destructive" }); setLoading(false);
    } else {
      // User created and confirmed — sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        toast({ title: "Something went wrong", description: "Please try signing in.", variant: "destructive" });
        setLoading(false);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast({ title: "Account created!", description: "Let's get your CPF sorted." }); setLoading(false); navigate("/get-started");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO title="Pricing · GET CPF | $29 One-Time Payment" description="Get your Brazilian CPF for $29 (beta pricing). AI-powered preparation, pre-filled forms, and money-back guarantee." path="/pricing" />

      {/* Top bar */}
      <div className="border-b border-gray-100 bg-white/90 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-8 h-16">
          <a href="/"><Logo className="h-10" /></a>
          {!user ? (
            <a href="/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Already have an account? <span className="text-green-800 font-semibold">Sign in</span>
            </a>
          ) : (
            <button onClick={() => supabase.auth.signOut().then(() => window.location.href = "/")} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Sign out</button>
          )}
        </div>
      </div>

      <div className={`mx-auto py-12 ${flowStep === "payment" ? "max-w-[1100px] px-0 sm:px-6" : "max-w-[1100px] px-5 sm:px-8"}`}>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {["Your email", "Choose plan", "Payment", "Create account"].map((label, i) => {
            const steps: FlowStep[] = ["email", "plan", "payment", "password"];
            const isActive = steps.indexOf(flowStep) >= i || flowStep === "done";
            const isCurrent = steps[i] === flowStep;
            return (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isActive ? "bg-green-800 text-white" : "bg-gray-100 text-gray-400"
                } ${isCurrent ? "ring-2 ring-green-800 ring-offset-2" : ""}`}>
                  {flowStep === "done" || (steps.indexOf(flowStep) > i) ? "✓" : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${isActive ? "text-gray-900" : "text-gray-400"}`}>{label}</span>
                {i < 3 && <div className={`w-8 h-px ${isActive ? "bg-green-800" : "bg-gray-200"}`} />}
              </div>
            );
          })}
        </div>

        {/* STEP 1: Email */}
        {flowStep === "email" && (
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-3xl font-extrabold tracking-tight mb-3">Let's get your CPF sorted</h1>
            <p className="text-gray-500 text-sm mb-8">Pop in your email and we'll get you started.</p>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                placeholder="you@email.com" autoFocus
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-800/20"
              />
              <button type="submit" className="w-full bg-green-800 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-green-900 transition-all btn-press">
                That's me, let's go →
              </button>
            </form>
            <p className="text-xs text-gray-400 mt-4">No spam, ever. Just your CPF kit.</p>
          </div>
        )}

        {/* STEP 2: Plan Selection */}
        {flowStep === "plan" && (
          <div>
            <div className="text-center mb-10">
              <h1 className="text-3xl font-extrabold tracking-tight mb-3">Choose how you want to do this</h1>
              <p className="text-gray-500 text-sm">The CPF itself is free. You're paying for preparation that makes it work first time.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`bg-white rounded-xl p-8 text-left relative ${
                    tier.highlighted ? "border-2 border-green-800 animate-subtle-pulse" : "border border-gray-100"
                  }`}
                >
                  {tier.badge && (
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold ${
                      tier.comingSoon ? "bg-gray-100 text-gray-500 border border-gray-200" : "bg-green-800 text-white"
                    }`}>{tier.badge}</div>
                  )}
                  <div className="text-sm text-gray-500 font-semibold mb-2">{tier.name}</div>
                  <div className="text-4xl font-extrabold tracking-tight">
                    {tier.originalPrice && <span className="text-2xl line-through text-gray-300 mr-2">{tier.originalPrice}</span>}
                    {tier.price} <span className="text-base font-normal text-gray-400">USD</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-3 mb-7 leading-relaxed">{tier.description}</p>
                  <ul className={`mb-8 space-y-3 ${tier.comingSoon ? "opacity-50" : ""}`}>
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <span className="text-green-800 font-bold shrink-0 mt-0.5">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  {tier.comingSoon ? (
                    !waitlistSubmitted ? (
                      <form onSubmit={(e) => handleWaitlist(e, tier.name)} className="space-y-2">
                        <input type="email" value={waitlistEmail} onChange={(e) => setWaitlistEmail(e.target.value)} required placeholder="your@email.com"
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-800/20" />
                        <button type="submit" className="w-full py-3.5 rounded-full font-semibold border border-gray-200 text-gray-600 hover:border-gray-300 transition-all btn-press">Join waitlist</button>
                      </form>
                    ) : (
                      <div className="text-center text-sm text-green-800 font-semibold py-3.5">✓ On the waitlist</div>
                    )
                  ) : (
                    <button onClick={() => handleSelectPlan(tier.name)} className="w-full py-3.5 rounded-full font-semibold bg-green-800 text-white hover:bg-green-900 transition-all btn-press hover-glow">
                      Get started · <s className="opacity-50">$49</s> $29 →
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-4 max-w-[700px] mx-auto">
              <div className="flex items-center justify-center gap-2 text-sm text-green-800 font-semibold">
                🛡️ If you follow our steps and get rejected, full refund. No questions asked.
              </div>
            </div>

            <button onClick={() => setFlowStep("email")} className="mt-8 text-sm text-gray-400 hover:text-gray-700 mx-auto block">← Back</button>
          </div>
        )}

        {/* STEP 3: Payment */}
        {flowStep === "payment" && (
          <div className="w-full text-center relative px-3 sm:px-6 sm:max-w-lg sm:mx-auto">
            {showPaymentSuccess && (
              <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  {Array.from({ length: 24 }).map((_, i) => {
                    const colors = ["#166534", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"];
                    const color = colors[i % colors.length];
                    const left = Math.random() * 100;
                    const delay = Math.random() * 0.5;
                    const size = 5 + Math.random() * 5;
                    const duration = 1.2 + Math.random() * 1;
                    const drift = (Math.random() - 0.5) * 100;
                    return (
                      <div key={i} className="absolute rounded-sm" style={{
                        left: `${left}%`, top: "-10px", width: `${size}px`, height: `${size}px`,
                        backgroundColor: color, animation: `confetti-fall ${duration}s ease-out ${delay}s forwards`,
                        opacity: 0, ["--drift" as string]: `${drift}px`,
                      }} />
                    );
                  })}
                </div>
                <style>{`@keyframes confetti-fall { 0% { opacity: 1; transform: translateY(0) translateX(0) rotate(0deg); } 100% { opacity: 0; transform: translateY(320px) translateX(var(--drift)) rotate(720deg); } }`}</style>
                <div className="w-20 h-20 bg-green-800/10 rounded-full flex items-center justify-center mb-4" style={{ animation: "success-pop 0.5s ease-out forwards" }}>
                  <span className="text-4xl text-green-800">✓</span>
                </div>
                <style>{`@keyframes success-pop { 0% { transform: scale(0); opacity: 0; } 50% { transform: scale(1.2); } 100% { transform: scale(1); opacity: 1; } }`}</style>
                <h2 className="text-2xl font-extrabold tracking-tight mb-2">Payment received!</h2>
                <p className="text-sm text-gray-500">Setting up your account...</p>
              </div>
            )}

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">One quick payment</h1>

            <div className="bg-white border border-gray-100 rounded-xl p-3 sm:p-4 mb-3 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-sm">{selectedPlan} · CPF Application Service</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{email}</p>
                </div>
                <span className="text-xl font-bold"><span className="line-through text-gray-300 text-sm">$49</span> $29</span>
              </div>
            </div>

            <div className="bg-green-800/5 border border-green-800/10 rounded-xl px-4 py-3 mb-4 text-left">
              <p className="text-xs text-gray-600">
                💡 <span className="font-semibold">Have a discount code?</span> You can enter it in the payment form below.
              </p>
            </div>

            {loadingCheckout ? (
              <div className="flex flex-col items-center gap-3 py-8">
                <div className="w-6 h-6 border-2 border-green-800 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-500">Loading secure checkout...</p>
              </div>
            ) : checkoutError || !EMBEDDED_URL ? (
              <div className="space-y-4">
                <div className="bg-white border border-gray-100 rounded-xl p-6 text-center space-y-4">
                  <p className="text-sm font-semibold">Complete your payment on Fanbasis</p>
                  <p className="text-xs text-gray-500">Click below to pay securely. Once done, come back here and click "I've paid".</p>
                  <a href={FALLBACK_URL} target="_blank" rel="noopener noreferrer"
                    className="w-full bg-green-800 text-white py-4 rounded-xl font-bold text-sm hover:bg-green-900 transition-all flex items-center justify-center gap-3">
                    Pay ${finalPrice} securely ↗
                  </a>
                  <button
                    onClick={async () => {
                      setLoadingCheckout(true);
                      try {
                        const { data } = await supabase.functions.invoke("verify-payment", { body: { email } });
                        if (data?.paid) {
                          handlePaymentComplete();
                        } else {
                          toast({ title: "Payment not found yet", description: "It can take a minute to process. Try again shortly.", variant: "destructive" });
                        }
                      } catch {
                        toast({ title: "Could not verify", description: "Please try again in a moment.", variant: "destructive" });
                      }
                      setLoadingCheckout(false);
                    }}
                    className="w-full bg-gray-50 text-gray-900 py-3 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-all border border-gray-100"
                  >
                    I've paid — verify my payment
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="overflow-hidden rounded-xl border border-gray-100">
                  <iframe src={EMBEDDED_URL} className="w-full border-0" style={{ minHeight: "900px", height: "1200px", maxHeight: "2000px" }} allow="payment" title="Fanbasis Checkout" />
                </div>
                <div className="flex flex-col items-center gap-2 py-1">
                  {!paymentVerified && pollCount < MAX_POLLS ? (
                    <>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="w-4 h-4 border-2 border-green-800 border-t-transparent rounded-full animate-spin" />
                        <span>{pollCount <= 2 ? "Complete your payment above..." : pollCount <= 6 ? "Waiting for payment confirmation..." : "Still checking, this can take a moment..."}</span>
                      </div>
                      {pollCount > 10 && (
                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center mt-2 w-full">
                          <p className="text-xs text-gray-500 mb-2">Having trouble with the form above?</p>
                          <a href={FALLBACK_URL} target="_blank" rel="noopener noreferrer" className="text-xs text-green-800 font-semibold hover:underline">
                            Pay directly on Fanbasis instead ↗
                          </a>
                        </div>
                      )}
                    </>
                  ) : !paymentVerified ? (
                    <div className="text-center space-y-2">
                      <p className="text-sm text-gray-500">Payment not detected yet.</p>
                      <button onClick={() => setPollCount(0)} className="text-sm text-green-800 font-semibold hover:underline">Check again</button>
                      <a href={FALLBACK_URL} target="_blank" rel="noopener noreferrer" className="text-xs text-green-800 font-semibold hover:underline block">
                        Pay on Fanbasis website instead ↗
                      </a>
                    </div>
                  ) : null}
                </div>
                {!paymentVerified && pollCount > 0 && pollCount < MAX_POLLS && (
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                    <div className="w-3 h-3 border-2 border-green-800 border-t-transparent rounded-full animate-spin" />
                    <span>Checking for payment...</span>
                  </div>
                )}
              </div>
            )}

            <div className="mt-3 text-center text-xs sm:text-sm text-green-800 font-semibold">
              🛡️ Full refund if you follow our steps and get rejected.
            </div>
            <div className="mt-2 flex items-center justify-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">🔒 Secure checkout</span>
              <span>·</span>
              <span>One-time payment</span>
            </div>

            <button onClick={() => { setFlowStep("plan"); setCheckoutSecret(null); setCheckoutError(false); setPollCount(0); }}
              className="mt-4 text-sm text-gray-400 hover:text-gray-700 mx-auto block min-h-[44px] flex items-center justify-center">← Back to plans</button>
          </div>
        )}

        {/* STEP 4: Set Password */}
        {flowStep === "password" && (
          <div className="max-w-md mx-auto text-center relative">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {Array.from({ length: 30 }).map((_, i) => {
                const colors = ["#166534", "#f59e0b", "#ef4444", "#3b82f6", "#10b981", "#8b5cf6"];
                const color = colors[i % colors.length];
                return (
                  <div key={i} className="absolute rounded-sm" style={{
                    left: `${Math.random() * 100}%`, top: "-10px", width: `${6 + Math.random() * 6}px`, height: `${6 + Math.random() * 6}px`,
                    backgroundColor: color, animation: `confetti-fall ${1.5 + Math.random() * 1.5}s ease-out ${Math.random() * 0.8}s forwards`,
                    opacity: 0, ["--drift" as string]: `${(Math.random() - 0.5) * 120}px`,
                  }} />
                );
              })}
            </div>
            <style>{`@keyframes confetti-fall { 0% { opacity: 1; transform: translateY(0) translateX(0) rotate(0deg); } 100% { opacity: 0; transform: translateY(420px) translateX(var(--drift)) rotate(720deg); } }`}</style>

            <div className="w-16 h-16 bg-green-800/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl text-green-800">✓</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-3">You're in!</h1>
            <p className="text-gray-500 text-sm mb-8">Set a password so you can come back anytime.</p>

            <form onSubmit={handleCreateAccount} className="space-y-4 text-left relative z-10">
              <div>
                <label className="text-sm font-semibold block mb-1.5">Email</label>
                <div className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-400">{email}</div>
              </div>
              <div>
                <label className="text-sm font-semibold block mb-1.5">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} autoFocus
                  placeholder="••••••••" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-800/20" />
                <p className="text-xs text-gray-400 mt-1">At least 6 characters</p>
              </div>
              <div>
                <label className="text-sm font-semibold block mb-1.5">Confirm password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6}
                  placeholder="••••••••" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-800/20" />
              </div>
              <label className={`flex items-start gap-2.5 cursor-pointer p-3 rounded-xl border transition-colors ${agreed ? 'border-green-800/30 bg-green-800/5' : agreementError ? 'border-red-300 bg-red-50' : 'border-gray-100 bg-gray-50'}`}>
                <input type="checkbox" checked={agreed} onChange={(e) => { setAgreed(e.target.checked); setAgreementError(false); }} className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-green-800" />
                <span className="text-sm text-gray-500 leading-relaxed">
                  I agree to the <a href="/terms" className="text-green-800 hover:underline font-semibold">Terms of Service</a> and <a href="/privacy" className="text-green-800 hover:underline font-semibold">Privacy Policy</a>.
                </span>
              </label>
              <button type="submit" disabled={loading}
                className="w-full bg-green-800 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-green-900 transition-all btn-press disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Setting things up..." : "Create my account →"}
              </button>
              {!agreed && <p className={`text-sm text-center ${agreementError ? 'text-red-500' : 'text-gray-400'}`}>☝️ Check the box above to continue</p>}
            </form>
          </div>
        )}

        {/* STEP 5: Done */}
        {flowStep === "done" && (
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-green-800/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">✉️</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-3">Check your email</h1>
            <p className="text-gray-500 text-sm mb-4">
              We sent a verification link to <strong className="text-gray-900">{email}</strong>. Click the link to activate your account, then sign in to start your CPF application.
            </p>
            <p className="text-xs text-gray-400 mb-8">Didn't get it? Check your spam folder.</p>
            <button onClick={() => navigate("/login")} className="w-full bg-green-800 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-green-900 transition-all btn-press">
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
