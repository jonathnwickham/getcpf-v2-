import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

const StickyMobileCTA = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
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
        className="bg-white/95 backdrop-blur-lg border-t border-gray-100 px-4 pt-3"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <button
          onClick={handleClick}
          className="w-full bg-green-800 text-white py-3.5 rounded-full font-semibold text-base hover:bg-green-900 transition-all min-h-[52px]"
        >
          Get started · <s className="opacity-50">$49</s> $29
        </button>
      </div>
    </div>
  );
};

export default StickyMobileCTA;
