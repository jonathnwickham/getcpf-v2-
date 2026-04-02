import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

const StickyMobileCTA = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Show after scrolling past the hero (~600px)
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    if (user) {
      navigate("/ready-pack");
    } else {
      navigate("/pricing");
    }
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div
        className="bg-background/95 backdrop-blur-lg border-t border-border px-4 pt-3"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <button
          onClick={handleClick}
          className="w-full bg-primary text-primary-foreground py-3.5 rounded-full font-semibold text-base hover:opacity-90 transition-all shadow-lg shadow-primary/20 min-h-[52px]"
        >
          Get My CPF Pack — <span className="line-through opacity-60">$49</span> $29 →
        </button>
      </div>
    </div>
  );
};

export default StickyMobileCTA;
