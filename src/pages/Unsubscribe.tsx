import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Logo from "@/components/Logo";

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "valid" | "already" | "invalid" | "no_token" | "success" | "error">("loading");

  useEffect(() => {
    if (!token) {
      setStatus("no_token");
      return;
    }

    const validate = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const res = await fetch(
          `${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${token}`,
          { headers: { apikey: anonKey } }
        );
        const data = await res.json();
        if (data.valid === false && data.reason === "already_unsubscribed") {
          setStatus("already");
        } else if (data.valid) {
          setStatus("valid");
        } else {
          setStatus("invalid");
        }
      } catch {
        setStatus("invalid");
      }
    };
    validate();
  }, [token]);

  const handleUnsubscribe = async () => {
    try {
      const { data } = await supabase.functions.invoke("handle-email-unsubscribe", {
        body: { token },
      });
      if (data?.success) {
        setStatus("success");
      } else if (data?.reason === "already_unsubscribed") {
        setStatus("already");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <a href="/" className="mb-8">
        <Logo className="h-10" />
      </a>

      <div className="w-full max-w-md text-center">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-green-800 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Validating...</p>
          </div>
        )}

        {status === "valid" && (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">Unsubscribe</h1>
            <p className="text-gray-500 text-sm">
              Are you sure you want to unsubscribe from GetCPF emails?
            </p>
            <button
              onClick={handleUnsubscribe}
              className="w-full bg-destructive text-destructive-foreground py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-all"
            >
              Confirm Unsubscribe
            </button>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-3">
            <h1 className="text-2xl font-bold">Unsubscribed</h1>
            <p className="text-gray-500 text-sm">
              You've been unsubscribed. You won't receive any more emails from us.
            </p>
          </div>
        )}

        {status === "already" && (
          <div className="space-y-3">
            <h1 className="text-2xl font-bold">Already Unsubscribed</h1>
            <p className="text-gray-500 text-sm">
              You've already unsubscribed from our emails.
            </p>
          </div>
        )}

        {status === "no_token" && (
          <div className="space-y-3">
            <h1 className="text-2xl font-bold">Unsubscribe</h1>
            <p className="text-gray-500 text-sm">
              To unsubscribe, use the personal link included at the bottom of any email from us.
            </p>
            <p className="text-gray-500 text-sm">
              Need help? Contact <a href="mailto:support@getcpf.com" className="text-green-800 font-semibold hover:underline">support@getcpf.com</a>
            </p>
            <a href="/" className="text-sm text-green-800 font-semibold hover:underline inline-block mt-2">
              Back to homepage →
            </a>
          </div>
        )}

        {status === "invalid" && (
          <div className="space-y-3">
            <h1 className="text-2xl font-bold">Invalid Link</h1>
            <p className="text-gray-500 text-sm">
              This unsubscribe link is invalid or has expired. Please use the latest link from your most recent email.
            </p>
            <a href="/" className="text-sm text-green-800 font-semibold hover:underline inline-block mt-2">
              Back to homepage →
            </a>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-3">
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="text-gray-500 text-sm">
              We couldn't process your request. Please try again or contact support@getcpf.com.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Unsubscribe;
