import { useNavigate } from "react-router-dom";

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
    <section className="py-24 px-8 text-center relative bg-primary/[0.03]">
      <h2 className="text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-tight">
        Brazil is waiting.<br />
        <span className="text-primary font-serif italic">Let's get you ready.</span>
      </h2>
      <p className="text-muted-foreground mt-4 mx-auto max-w-[480px] leading-relaxed">
        Five minutes now saves you hours later. Get your CPF sorted before you even land.
      </p>
      <button onClick={handleCTA} className="mt-8 bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/20">
        Let's do this →
      </button>
    </section>
  );
};

export default FinalCTA;
