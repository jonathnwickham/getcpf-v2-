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

    toast({ title: "Signed in successfully" });

    try {
      const userId = authData.user?.id;
      if (!userId) { navigate("/get-started"); return; }

      const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
      if (isAdmin) { navigate("/admin"); return; }

      const { data: allApps } = await supabase
        .from("applications").select("status").eq("user_id", userId)
        .order("created_at", { ascending: false }).limit(1);

      if (allApps && allApps.length > 0) {
        const latestStatus = allApps[0].status;
        if (["paid", "prepared", "office_visited", "cpf_issued"].includes(latestStatus || "")) {
          navigate("/ready-pack");
        } else {
          navigate("/get-started");
        }
        return;
      }

      const userEmail = authData.user?.email;
      if (userEmail) {
        const { data: payRes } = await supabase.functions.invoke("verify-payment", { body: { email: userEmail } });
        if (payRes?.paid) { navigate("/get-started"); return; }
      }

      navigate("/pricing");
    } catch {
      navigate("/get-started");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEO title="Log In · GET CPF" description="Log in to your GET CPF account to access your CPF application documents and status." path="/login" />

      {/* Top bar */}
      <div className="border-b border-gray-100 bg-white/90 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-8 h-16">
          <a href="/"><Logo className="h-10" /></a>
          <Link to="/signup" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            Don't have an account? <span className="text-green-800 font-semibold">Sign up</span>
          </Link>
        </div>
      </div>

      <div className="flex-1 flex items-start sm:items-center justify-center px-5 sm:px-8 pt-16 sm:pt-0 pb-16">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold tracking-tight">Welcome back</h1>
            <p className="text-gray-500 mt-2 text-sm">Pick up right where you left off</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-semibold block mb-1.5">Email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-800/20"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-green-800/20"
                  placeholder="••••••••"
                />
                <button
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-green-800 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-green-900 transition-all btn-press disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  One moment...
                </span>
              ) : "Sign in"}
            </button>
          </form>

          <div className="text-center mt-8">
            <Link to="/forgot-password" className="text-sm text-green-800 hover:underline">
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
