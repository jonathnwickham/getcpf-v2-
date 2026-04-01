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

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/get-started`,
        data: { full_name: fullName },
      },
    });

    if (error) {
      toast({ title: "Something went wrong", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    setEmailSent(true);
    setLoading(false);
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <a href="/"><Logo className="h-10" /></a>
          <div className="mt-8 bg-card border border-border rounded-2xl p-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✉️</span>
            </div>
            <h1 className="text-xl font-extrabold mb-2">Check your email</h1>
            <p className="text-sm text-muted-foreground mb-4">
              We sent a verification link to <strong className="text-foreground">{email}</strong>. Click the link to activate your account.
            </p>
            <p className="text-xs text-muted-foreground">
              Didn't get it? Check your spam folder or{" "}
              <button
                onClick={() => setEmailSent(false)}
                className="text-primary font-semibold hover:underline"
              >
                try again
              </button>
            </p>
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            Already verified?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/"><Logo className="h-10" /></a>
          <h1 className="text-2xl font-extrabold mt-6">Let's set you up</h1>
          <p className="text-muted-foreground mt-2 text-sm">Create an account so your progress is saved</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-foreground block mb-1.5">Full name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="John Smith"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-foreground block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="you@email.com"
            />
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
            />
            <p className="text-xs text-muted-foreground mt-1">At least 6 characters</p>
          </div>

          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-border accent-primary"
            />
            <span className="text-xs text-muted-foreground leading-relaxed">
              I have read and agree to the{" "}
              <Link to="/terms" className="text-primary hover:underline font-semibold">Terms of Service</Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-primary hover:underline font-semibold">Privacy Policy</Link>.
            </span>
          </label>

          <button
            type="submit"
            disabled={loading || !agreed}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? "Setting things up..." : "Create my account"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
