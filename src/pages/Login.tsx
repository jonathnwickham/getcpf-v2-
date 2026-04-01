import { useState } from "react";
import SEO from "@/components/SEO";
import Logo from "@/components/Logo";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { fetchLatestApplication, applicationHasReadyPack, readPersistedOnboardingData, hasReadyPackData, saveLatestApplication } from "@/lib/application-storage";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

    // Route admins to dashboard first, otherwise continue normal user flow
    try {
      const userId = authData.user?.id;
      if (!userId) {
        navigate("/get-started");
        return;
      }

      const { data: isAdmin } = await supabase.rpc("has_role", {
        _user_id: userId,
        _role: "admin",
      });

      if (isAdmin) {
        navigate("/admin");
        return;
      }

      // Check if user has ANY application (draft or beyond)
      const { data: allApps } = await supabase
        .from("applications")
        .select("status")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1);

      if (allApps && allApps.length > 0) {
        const latestStatus = allApps[0].status;
        // If they have a ready-pack-eligible status, go to ready-pack
        if (["paid", "prepared", "office_visited", "cpf_issued"].includes(latestStatus || "")) {
          const app = await fetchLatestApplication(userId);
          if (app && applicationHasReadyPack(app)) {
            navigate("/ready-pack");
          } else {
            navigate("/get-started");
          }
        } else {
          // Draft or other status — continue onboarding
          navigate("/get-started");
        }
        return;
      }

      // No application yet — check if they paid via checkout_sessions
      const userEmail = authData.user?.email;
      if (userEmail) {
        const { data: payRes } = await supabase.functions.invoke("verify-payment", {
          body: { email: userEmail },
        });
        if (payRes?.paid) {
          navigate("/get-started");
          return;
        }
      }

      // No payment found — send to pricing
      navigate("/pricing");
    } catch {
      navigate("/get-started");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-start justify-center px-6 pt-24 pb-16"
      style={{ backgroundImage: "radial-gradient(circle at 50% 0%, hsl(var(--primary) / 0.04), transparent 60%)" }}
    >
      <SEO title="Log In — GET CPF" description="Log in to your GET CPF account to access your CPF application documents and status." path="/login" />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/"><Logo className="h-10" /></a>
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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
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
