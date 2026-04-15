import { useState, useEffect } from "react";
import Logo from "@/components/Logo";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Check for recovery token in URL hash
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setReady(true);
    }
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast({ title: "Something went wrong", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "All set. your password is updated" });
      navigate("/login");
    }
    setLoading(false);
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center">
          <a href="/" className="inline-block mb-6"><Logo className="h-10" /></a>
          <h1 className="text-xl font-bold">This link isn't working</h1>
          <p className="text-gray-500 mt-2 text-sm">It may have expired. request a new one and you'll be sorted in a minute.</p>
          <div className="mt-6 flex flex-col gap-3">
            <a href="/forgot-password" className="bg-green-800 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-all inline-block">
              Request a new link →
            </a>
            <a href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Back to homepage
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="inline-block mb-6"><Logo className="h-10" /></a>
          <h1 className="text-2xl font-extrabold">Pick a new password</h1>
          <p className="text-gray-500 mt-2 text-sm">Choose something you'll remember. then you're back in</p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-900 block mb-1.5">New password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-800 text-white py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? "Updating..." : "Save new password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
