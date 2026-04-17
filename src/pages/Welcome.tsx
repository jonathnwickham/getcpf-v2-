import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import Logo from "@/components/Logo";

const Welcome = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [email] = useState(emailParam);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [agreementError, setAgreementError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [checking, setChecking] = useState(true);

  // Verify payment on mount
  useEffect(() => {
    if (!email) { setChecking(false); return; }
    const check = async () => {
      try {
        const { data } = await supabase.functions.invoke("verify-payment", { body: { email } });
        setVerified(data?.paid === true);
      } catch {}
      setChecking(false);
    };
    check();
  }, [email]);

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
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        toast({ title: "Account already exists", description: "Please sign in instead.", variant: "destructive" });
        setLoading(false);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast({ title: "Welcome back!", description: "Signed in to your existing account." });
        setLoading(false);
        navigate("/get-started");
      }
    } else if (createData?.error) {
      toast({ title: "Something went wrong", description: createData.error, variant: "destructive" });
      setLoading(false);
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        toast({ title: "Something went wrong", description: "Please try signing in.", variant: "destructive" });
        setLoading(false);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast({ title: "Account created!", description: "Let's get your CPF sorted." });
        setLoading(false);
        navigate("/get-started");
      }
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-green-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!email || !verified) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-5">
        <SEO title="Welcome | GET CPF" path="/welcome" noIndex />
        <div className="max-w-sm text-center">
          <a href="/"><Logo className="h-10 mx-auto mb-8" /></a>
          <h1 className="text-2xl font-extrabold tracking-tight mb-3">Payment not found</h1>
          <p className="text-gray-500 text-sm mb-6">We couldn't verify a payment for this email. If you just paid, it can take a minute to process.</p>
          <a href="/verify" className="inline-block bg-green-800 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-green-900 transition-all">Verify my payment</a>
          <p className="text-xs text-gray-400 mt-4">Haven't paid yet? <a href="/pricing" className="text-green-800 font-semibold hover:underline">Go to pricing</a></p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEO title="Create Your Account | GET CPF" description="Set up your account and start your CPF application." path="/welcome" noIndex />

      <div className="border-b border-gray-100 bg-white/90 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-8 h-16">
          <a href="/"><Logo className="h-10" /></a>
          <a href="/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            Already have an account? <span className="text-green-800 font-semibold">Sign in</span>
          </a>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 py-16">
        <div className="w-16 h-16 bg-green-800/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl text-green-800">&#10003;</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-center mb-3">You're in!</h1>
        <p className="text-gray-500 text-sm text-center mb-8">Set a password so you can come back anytime.</p>

        <form onSubmit={handleCreateAccount} className="space-y-4 text-left">
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
        </form>
      </div>
    </div>
  );
};

export default Welcome;
