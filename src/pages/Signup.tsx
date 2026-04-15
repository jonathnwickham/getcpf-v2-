import { useState } from "react";
import SEO from "@/components/SEO";
import Logo from "@/components/Logo";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data: signUpData, error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}/get-started`, data: { full_name: fullName } },
    });
    if (error) { toast({ title: "Something went wrong", description: error.message, variant: "destructive" }); setLoading(false); return; }
    if (signUpData?.session) {
      toast({ title: "Account created!" });
      try {
        const { data: payRes } = await supabase.functions.invoke("verify-payment", { body: { email } });
        if (payRes?.paid) { window.location.href = "/get-started"; return; }
      } catch {}
      // Not paid yet, redirect to pricing
      window.location.href = "/pricing";
      return;
    }
    setEmailSent(true);
    setLoading(false);
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-5 sm:px-8">
        <div className="w-full max-w-sm text-center">
          <a href="/"><Logo className="h-10 mx-auto" /></a>
          <div className="mt-8 bg-white border border-gray-100 rounded-xl p-8">
            <div className="w-16 h-16 bg-green-800/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✉️</span>
            </div>
            <h1 className="text-xl font-extrabold mb-2">Check your email</h1>
            <p className="text-sm text-gray-500 mb-4">
              We sent a verification link to <strong className="text-gray-900">{email}</strong>. Click the link to activate your account.
            </p>
            <p className="text-xs text-gray-400">
              Didn't get it? Check your spam folder or{" "}
              <button onClick={() => setEmailSent(false)} className="text-green-800 font-semibold hover:underline">try again</button>
            </p>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            Already verified? <Link to="/login" className="text-green-800 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEO title="Sign Up · GET CPF" description="Create your GET CPF account to start your Brazilian CPF application." path="/signup" />

      <div className="border-b border-gray-100 bg-white/90 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-8 h-16">
          <a href="/"><Logo className="h-10" /></a>
          <Link to="/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            Already have an account? <span className="text-green-800 font-semibold">Sign in</span>
          </Link>
        </div>
      </div>

      <div className="flex-1 flex items-start sm:items-center justify-center px-5 sm:px-8 pt-16 sm:pt-0 pb-16">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold tracking-tight">Let's set you up</h1>
            <p className="text-gray-500 mt-2 text-sm">Create an account so your progress is saved</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-sm font-semibold block mb-1.5">Full name</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-800/20" placeholder="John Smith" />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-800/20" placeholder="you@email.com" />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1.5">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-800/20" placeholder="••••••••" />
              <p className="text-xs text-gray-400 mt-1">At least 6 characters</p>
            </div>

            <label className={`flex items-start gap-2.5 cursor-pointer p-3 rounded-xl border transition-colors ${agreed ? 'border-green-800/30 bg-green-800/5' : 'border-gray-100 bg-gray-50'}`}>
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-green-800" />
              <span className="text-xs text-gray-500 leading-relaxed">
                I agree to the <Link to="/terms" className="text-green-800 hover:underline font-semibold">Terms of Service</Link> and <Link to="/privacy" className="text-green-800 hover:underline font-semibold">Privacy Policy</Link>.
              </span>
            </label>

            <button type="submit" disabled={loading || !agreed}
              className="w-full bg-green-800 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-green-900 transition-all btn-press disabled:opacity-50">
              {loading ? "Setting things up..." : "Create my account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
