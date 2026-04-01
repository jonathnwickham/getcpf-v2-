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
    <div className="fixed bottom-4 left-4 right-4 md:bottom-0 md:left-0 md:right-0 z-[100] bg-card/70 backdrop-blur-xl border border-border/50 md:border-t md:border-x-0 md:border-b-0 rounded-xl md:rounded-none px-4 py-3 md:px-6 md:py-4 shadow-xl animate-slide-in">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
        <p className="text-xs md:text-sm text-muted-foreground flex-1 min-w-0">
          Essential cookies only. No tracking.{" "}
          <a href="/privacy" className="underline hover:text-foreground">Learn more</a>
        </p>
        <button
          onClick={accept}
          className="bg-primary text-primary-foreground px-4 py-1.5 md:px-5 md:py-2 rounded-lg text-xs md:text-sm font-semibold hover:opacity-90 transition-all shrink-0"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
