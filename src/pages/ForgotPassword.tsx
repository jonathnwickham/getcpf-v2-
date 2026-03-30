import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast({ title: "Something went wrong", description: error.message, variant: "destructive" });
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <div className="text-5xl mb-4">📧</div>
          <h1 className="text-2xl font-extrabold">Check your inbox</h1>
          <p className="text-muted-foreground mt-2 text-sm">We sent a reset link to <strong>{email}</strong> — it'll be there in a minute</p>
          <Link to="/login" className="mt-6 inline-block text-primary font-semibold hover:underline text-sm">
            ← Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-bold tracking-tight">
            GET <span className="text-primary">CPF</span>
          </a>
          <h1 className="text-2xl font-extrabold mt-6">Forgot your password?</h1>
          <p className="text-muted-foreground mt-2 text-sm">No worries — enter your email and we'll send you a link to reset it</p>
        </div>

        <form onSubmit={handleReset} className="space-y-4">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send me a reset link"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link to="/login" className="text-primary font-semibold hover:underline">
            ← Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
