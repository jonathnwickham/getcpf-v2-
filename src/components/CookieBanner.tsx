import { useState, useEffect } from "react";

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookie-consent");
    if (!accepted) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-card border-t border-border px-6 py-4 shadow-lg animate-slide-in">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-muted-foreground">
          We use essential cookies to keep you logged in. By continuing, you accept our{" "}
           <a href="/privacy" className="text-primary hover:underline font-semibold">Privacy Policy</a>.
        </p>
        <button
          onClick={() => { localStorage.setItem("cookie-consent", "true"); setVisible(false); }}
          className="bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all shrink-0"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;