import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Logo from "@/components/Logo";
import SEO from "@/components/SEO";

const VerifyPayment = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<"found" | "not_found" | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setChecking(true);
    setResult(null);

    try {
      const { data } = await supabase.functions.invoke("verify-payment", {
        body: { email: email.trim().toLowerCase() },
      });

      if (data?.paid) {
        setResult("found");
        // Redirect to signup/login after 2 seconds
        setTimeout(() => navigate(`/pricing?step=4&email=${encodeURIComponent(email.trim().toLowerCase())}`), 2000);
      } else {
        setResult("not_found");
      }
    } catch {
      setResult("not_found");
    }

    setChecking(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <SEO title="Verify Payment | GET CPF" description="Verify your payment and continue to your CPF Ready Pack." path="/verify" noIndex />
      <div className="w-full max-w-md text-center">
        <a href="/" className="inline-block mb-8">
          <Logo className="h-10" />
        </a>

        <div className="bg-white border border-gray-100 rounded-2xl p-8">
          <h1 className="text-xl font-semibold mb-2">Welcome back</h1>
          <p className="text-sm text-gray-500 mb-6">
            Already paid on Fanbasis? Enter the email you used to purchase and we'll verify it.
          </p>

          {result === "found" ? (
            <div className="space-y-3">
              <div className="w-12 h-12 bg-green-800/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-green-800 text-xl font-bold">✓</span>
              </div>
              <p className="text-sm font-semibold text-green-800">Payment confirmed!</p>
              <p className="text-xs text-gray-500">Taking you to create your account...</p>
            </div>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email you used to pay"
                required
                autoFocus
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-800/20 focus:border-green-800"
              />
              <button
                type="submit"
                disabled={checking}
                className="w-full bg-green-800 text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-green-900 transition-all disabled:opacity-50"
              >
                {checking ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Checking...
                  </span>
                ) : "Verify my payment"}
              </button>

              {result === "not_found" && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left">
                  <p className="text-sm font-medium text-amber-900 mb-1">Payment not found yet</p>
                  <p className="text-xs text-amber-800">
                    It can take 1-2 minutes for payments to process. Make sure you're using the same email you paid with. If it's been more than 5 minutes, <a href="/contact" className="text-green-800 font-semibold hover:underline">contact us</a>.
                  </p>
                </div>
              )}
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Haven't paid yet? <a href="/pricing" className="text-green-800 font-semibold hover:underline">Go to pricing</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyPayment;
