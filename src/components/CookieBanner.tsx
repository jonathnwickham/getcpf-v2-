import { useState, useEffect } from "react";

const COOKIE_KEY = "cpf_cookie_consent";

const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value};expires=${expires};path=/;SameSite=Lax`;
};

const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? match[1] : null;
};

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (getCookie(COOKIE_KEY) !== "accepted") {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const accept = () => {
    setCookie(COOKIE_KEY, "accepted", 365);
    setVisible(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-card border-t border-border px-6 py-4 shadow-lg animate-slide-in">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-muted-foreground flex-1 min-w-0">
          We use essential cookies for authentication only. No advertising or tracking cookies. By continuing you accept this.
        </p>
        <div className="flex gap-2 shrink-0">
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg border border-border transition-colors"
          >
            Learn more
          </a>
          <button
            onClick={accept}
            className="bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
