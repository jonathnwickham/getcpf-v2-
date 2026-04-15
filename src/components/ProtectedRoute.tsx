import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Logo from "@/components/Logo";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requirePayment?: boolean;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requirePayment, requireAdmin }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const needsPaymentCheck = requirePayment || ["/ready-pack", "/dashboard"].some(p => location.pathname.startsWith(p));
  const needsAdminCheck = requireAdmin || location.pathname.startsWith("/admin");

  useEffect(() => {
    if (loading || !user) {
      setChecking(false);
      return;
    }

    const check = async () => {
      try {
        // Check admin first. admins bypass payment check
        if (needsAdminCheck || needsPaymentCheck) {
          const adminRes = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" as const });
          const userIsAdmin = adminRes.data === true;
          setIsAdmin(userIsAdmin);

          // Admins bypass payment requirement
          if (userIsAdmin) {
            setIsPaid(true);
            setChecking(false);
            return;
          }
        } else {
          setIsAdmin(true);
        }

        // Check payment status via applications table first
        if (needsPaymentCheck) {
          const payRes = await supabase
              .from("applications")
              .select("status")
              .eq("user_id", user.id)
              .in("status", ["paid", "prepared", "office_visited", "cpf_issued"])
              .limit(1);
          
          if (payRes.data && payRes.data.length > 0) {
            setIsPaid(true);
          } else {
            // Fallback: check checkout_sessions via verify-payment
            try {
              const { data: vpData } = await supabase.functions.invoke("verify-payment", {
                body: { email: user.email },
              });
              setIsPaid(vpData?.paid === true);
            } catch {
              setIsPaid(false);
            }
          }
        } else {
          setIsPaid(true);
        }

        // Admin was already checked above (line 34), no need to re-check
        if (!needsAdminCheck) {
          setIsAdmin(true);
        }
      } catch {
        setIsPaid(false);
        setIsAdmin(false);
      }
      setChecking(false);
    };

    check();
  }, [user, loading, needsPaymentCheck, needsAdminCheck]);

  if (loading || checking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check email verification
  if (!user.email_confirmed_at) {
    return <VerifyEmailScreen />;
  }

  // Admin check. show access denied
  if (needsAdminCheck && !isAdmin) {
    return <AccessDeniedScreen />;
  }

  // Payment check. show explanation screen instead of silent redirect
  if (needsPaymentCheck && !isPaid) {
    return <PaymentRequiredScreen />;
  }

  return <>{children}</>;
};

const AccessDeniedScreen = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <a href="/" className="inline-block mb-8">
          <Logo className="h-10" />
        </a>
        <div className="bg-white border border-gray-100 rounded-2xl p-8">
          <div className="text-5xl mb-4">🚫</div>
          <h1 className="text-xl font-extrabold mb-2">Access denied</h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            You do not have permission to view this page. If you believe this is an error, please contact support.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-green-800 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-all"
          >
            Go to homepage
          </button>
        </div>
      </div>
    </div>
  );
};

const VerifyEmailScreen = () => {
  const { signOut, user } = useAuth();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (!user?.email || sending || cooldown > 0) return;
    setSending(true);
    try {
      await supabase.auth.resend({ type: "signup", email: user.email });
      setSent(true);
      setCooldown(60);
    } catch {
      // silently fail — user can try again
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <a href="/" className="inline-block mb-8">
          <Logo className="h-10" />
        </a>
        <div className="bg-white border border-gray-100 rounded-2xl p-8">
          <div className="text-5xl mb-4">📧</div>
          <h1 className="text-xl font-extrabold mb-2">Check your inbox</h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            Click the link we sent you to activate your account. Once verified, you'll get instant access to your CPF Ready Pack.
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Didn't get it? Check your spam folder or{" "}
            <button
              onClick={() => window.location.reload()}
              className="text-green-800 font-semibold hover:underline"
            >
              refresh this page
            </button>{" "}
            after clicking the link.
          </p>
          <button
            onClick={handleResend}
            disabled={sending || cooldown > 0}
            className="w-full bg-green-800 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            {sending
              ? "Sending..."
              : sent && cooldown > 0
              ? `Email sent! Resend in ${cooldown}s`
              : "Resend email"}
          </button>
          <button
            onClick={signOut}
            className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
          >
            Sign out and try a different email
          </button>
        </div>
      </div>
    </div>
  );
};

const PaymentRequiredScreen = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <a href="/" className="inline-block mb-8">
          <Logo className="h-10" />
        </a>
        <div className="bg-white border border-gray-100 rounded-2xl p-8">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-xl font-extrabold mb-2">Purchase required</h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            You haven't completed your purchase yet. Get your CPF Ready Pack to access this page.
          </p>
          <button
            onClick={() => navigate("/pricing")}
            className="w-full bg-green-800 text-white px-6 py-3.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-green-800/20"
          >
            Complete purchase. <span className="line-through opacity-60">$49</span> $29 →
          </button>
          <p className="text-xs text-gray-500 mt-4">
            Already paid? <a href="/contact" className="text-green-800 font-semibold hover:underline">Contact support</a>
          </p>
          <button
            onClick={signOut}
            className="text-xs text-gray-500 hover:text-gray-900 transition-colors mt-3"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute;
