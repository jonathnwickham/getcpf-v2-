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

export const openCookiePreferences = () => {
  document.cookie = `${COOKIE_KEY}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
  window.dispatchEvent(new CustomEvent("cookie-preferences-reset"));
};

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = getCookie(COOKIE_KEY);
    if (!consent) setVisible(true);

    const handler = () => setVisible(true);
    window.addEventListener("cookie-preferences-reset", handler);
    return () => window.removeEventListener("cookie-preferences-reset", handler);
  }, []);

  if (!visible) return null;

  const accept = () => {
    setCookie(COOKIE_KEY, "accepted", 365);
    setVisible(false);
  };

  const reject = () => {
    setCookie(COOKIE_KEY, "rejected", 365);
    setVisible(false);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 md:bottom-0 md:left-0 md:right-0 z-[100] bg-white/70 backdrop-blur-xl border border-gray-100/50 md:border-t md:border-x-0 md:border-b-0 rounded-xl md:rounded-none px-4 py-4 md:px-6 md:py-4 shadow-xl animate-slide-in">
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-sm text-gray-500 flex-1 min-w-0 leading-relaxed">
          We use essential cookies only for authentication. No tracking, no ads.{" "}
          <a href="/privacy#cookies" className="underline hover:text-gray-900 inline-block py-2 min-h-[44px]">Cookie policy</a>
        </p>
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <button
            onClick={reject}
            className="flex-1 sm:flex-initial border border-gray-100 text-gray-900 px-5 py-3 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-all min-h-[44px]"
          >
            Reject all
          </button>
          <button
            onClick={accept}
            className="flex-1 sm:flex-initial bg-green-800 text-white px-5 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-all min-h-[44px]"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
