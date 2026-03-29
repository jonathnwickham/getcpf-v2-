import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { fetchLatestApplication, applicationHasReadyPack, readPersistedOnboardingData, hasReadyPackData, saveLatestApplication } from "@/lib/application-storage";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast({ title: "That didn't work", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    toast({ title: "Good to see you again 👋" });

    // Check if user has a completed application → ready-pack, otherwise → get-started
    try {
      const userId = authData.user?.id;
      if (userId) {
        const app = await fetchLatestApplication(userId);
        if (app && applicationHasReadyPack(app)) {
          navigate("/ready-pack");
        } else {
          // Also check local storage as fallback
          const localData = readPersistedOnboardingData();
          if (localData && hasReadyPackData(localData)) {
            // Save local data to DB then go to ready-pack
            try {
              await saveLatestApplication(userId, localData, "prepared");
            } catch {}
            navigate("/ready-pack");
          } else {
            navigate("/get-started");
          }
        }
      } else {
        navigate("/get-started");
      }
    } catch {
      navigate("/get-started");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-bold tracking-tight inline-block">
            cpf<span className="text-primary">easy</span>.ai
          </a>
          <h1 className="text-2xl font-extrabold mt-6">Welcome back</h1>
          <p className="text-muted-foreground mt-2 text-sm">Pick up right where you left off</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
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
              className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? "One moment..." : "Sign in"}
          </button>
        </form>

        <div className="text-center mt-6 space-y-2">
          <Link to="/forgot-password" className="text-sm text-primary hover:underline block">
            Forgot your password?
          </Link>
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
