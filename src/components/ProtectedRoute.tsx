import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading…</div>
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

  return <>{children}</>;
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
          <h1 className="text-xl font-extrabold mb-2">Check your email</h1>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            We've sent you a verification link. Click it to activate your account and access your CPF Ready Pack.
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
