import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
        

        // Check payment status
        if (needsPaymentCheck) {
          const payRes = await supabase
              .from("applications")
              .select("status")
              .eq("user_id", user.id)
              .in("status", ["paid", "prepared", "office_visited", "cpf_issued"])
              .limit(1);
          setIsPaid(!!payRes.data && payRes.data.length > 0);
        } else {
          setIsPaid(true);
        }

        // Check admin via database role only
        if (needsAdminCheck) {
          const adminRes = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" as const });
          setIsAdmin(adminRes.data === true);
        } else {
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading...</div>
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

  // Admin check — show access denied
  if (needsAdminCheck && !isAdmin) {
    return <AccessDeniedScreen />;
  }

  // Payment check
  if (needsPaymentCheck && !isPaid) {
    toast.info("You need to complete your purchase first to access this page.");
    return <Navigate to="/pricing" replace />;
  }

  return <>{children}</>;
};

const AccessDeniedScreen = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <a href="/" className="text-2xl font-bold tracking-tight inline-block mb-8">
          GET <span className="text-primary">CPF</span>
        </a>
        <div className="bg-card border border-border rounded-2xl p-8">
          <div className="text-5xl mb-4">🚫</div>
          <h1 className="text-xl font-extrabold mb-2">Access denied</h1>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            You do not have permission to view this page. If you believe this is an error, please contact support.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-all"
          >
            Go to homepage
          </button>
        </div>
      </div>
    </div>
  );
};

const VerifyEmailScreen = () => {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <a href="/" className="text-2xl font-bold tracking-tight inline-block mb-8">
          GET <span className="text-primary">CPF</span>
        </a>
        <div className="bg-card border border-border rounded-2xl p-8">
          <div className="text-5xl mb-4">📧</div>
          <h1 className="text-xl font-extrabold mb-2">Check your inbox</h1>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Click the link we sent you to activate your account. Once verified, you'll get instant access to your CPF Ready Pack.
          </p>
          <p className="text-xs text-muted-foreground mb-6">
            Didn't get it? Check your spam folder or{" "}
            <button
              onClick={() => window.location.reload()}
              className="text-primary font-semibold hover:underline"
            >
              refresh this page
            </button>{" "}
            after clicking the link.
          </p>
          <button
            onClick={signOut}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign out and try a different email
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute;
