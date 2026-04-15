import { useNavigate } from "react-router-dom";

interface FinalCTAProps {
  onOpenModal?: () => void;
}

const flags = ["🇺🇸", "🇬🇧", "🇩🇪", "🇫🇷", "🇿🇦", "🇮🇹", "🇦🇺", "🇦🇷", "🇨🇴", "🇮🇳", "🇯🇵", "🇰🇷", "🇵🇹", "🇳🇱", "🇨🇦", "🇮🇪", "🇲🇽", "🇨🇱", "🇪🇸", "🇨🇳"];

const FinalCTA = ({ onOpenModal }: FinalCTAProps) => {
  const navigate = useNavigate();

  const handleCTA = () => {
    if (onOpenModal) onOpenModal();
    else navigate("/pricing");
  };

  return (
    <section className="py-28 sm:py-36 px-5 text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Ready when you are.</h2>
        <p className="text-gray-500 mt-6 max-w-md mx-auto leading-relaxed">
          Five minutes of preparation now saves you a wasted day later.
        </p>

        <div className="mt-8 w-full overflow-hidden">
          <div className="flex items-center gap-1 animate-[marquee_25s_linear_infinite] w-max">
            {[...Array(3)].flatMap((_, rep) =>
              flags.map((flag, i) => (
                <span key={`${rep}-${i}`} className="text-2xl mx-1">{flag}</span>
              ))
            )}
          </div>
        </div>
        <p className="text-sm text-gray-400 mt-5">50+ countries supported</p>

        <button
          onClick={handleCTA}
          className="mt-8 bg-green-800 text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-green-900 transition-all btn-press inline-flex items-center gap-2"
        >
          Get started · <s className="opacity-50">$49</s> $29
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
        </button>
      </div>
    </section>
  );
};

export default FinalCTA;
