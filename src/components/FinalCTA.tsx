import { useNavigate } from "react-router-dom";
import brazilStencil from "@/assets/brazil-flag-cristo-stencil.png";

interface FinalCTAProps {
  onOpenModal?: () => void;
}

const FinalCTA = ({ onOpenModal }: FinalCTAProps) => {
  const navigate = useNavigate();

  const handleCTA = () => {
    if (onOpenModal) onOpenModal();
    else navigate("/get-started");
  };

  return (
    <section className="py-32 px-8 text-center relative bg-primary/[0.03] overflow-hidden">
      {/* Green glow behind stencil */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse,hsl(var(--primary)/0.06)_0%,transparent_70%)] pointer-events-none" />
      {/* Flag + Cristo stencil, spread wide */}
      <img
        src={brazilStencil}
        alt=""
        aria-hidden="true"
        loading="lazy"
        width={1400}
        height={512}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70rem] max-w-none opacity-[0.07] pointer-events-none select-none"
      />

      <div className="relative z-10">
        <h2 className="text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-tight">
          Ready when you are.
        </h2>
        <p className="text-muted-foreground mt-5 mx-auto max-w-[480px] leading-relaxed">
          Five minutes of preparation now saves you a wasted day later. Get everything sorted before you even walk in.
        </p>
        <button onClick={handleCTA} className="mt-10 bg-primary text-primary-foreground px-10 py-4 rounded-xl font-semibold text-base hover:opacity-90 transition-all shadow-lg shadow-primary/20 min-h-[52px]">
          Let's do this →
        </button>
      </div>
    </section>
  );
};

export default FinalCTA;
