import { useNavigate } from "react-router-dom";

interface HeroProps {
  onOpenModal?: () => void;
}

const Hero = ({ onOpenModal }: HeroProps) => {
  const navigate = useNavigate();

  const handleCTA = () => {
    if (onOpenModal) onOpenModal();
    else navigate("/get-started");
  };

  const proofItems = [
    { num: "~5 min", label: "That's all it takes" },
    { num: "Free", label: "The CPF itself" },
    { num: "Same day", label: "Walk out with it" },
    { num: "24/7", label: "Start anytime" },
  ];

  return (
    <section className="min-h-[90vh] flex flex-col justify-center items-center text-center px-6 pt-32 pb-16 relative overflow-hidden bg-[hsl(160_84%_28%/0.03)]">
      <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,hsl(var(--accent-glow)/0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="animate-fade-up inline-flex items-center gap-2 bg-primary/5 border border-primary/15 px-4 py-1.5 rounded-full text-xs text-primary font-semibold mb-8">
        <span className="w-1.5 h-1.5 bg-primary rounded-full" />
        Trusted by 200+ foreigners moving to Brazil
      </div>

      <h1 className="animate-fade-up-1 text-[clamp(2.5rem,5.5vw,4rem)] font-extrabold leading-[1.08] tracking-[-1.5px] max-w-[720px]">
        Get your Brazilian{" "}
        <span className="text-primary font-serif italic">CPF</span>{" "}
        without the headache
      </h1>

      <p className="animate-fade-up-2 text-[clamp(1rem,2vw,1.15rem)] text-muted-foreground max-w-[540px] mt-6 leading-relaxed">
        Answer a few questions and we'll prepare everything you need — the right forms, the right office, the right words to say. You just show up.
      </p>

      <div className="animate-fade-up-3 flex gap-4 mt-8 flex-wrap justify-center">
        <button onClick={handleCTA} className="bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-semibold text-base hover:opacity-90 transition-all inline-flex items-center gap-2 shadow-lg shadow-primary/20">

          Get my CPF pack →
        </button>
        <a href="#how" className="bg-secondary text-foreground px-8 py-3.5 rounded-xl font-semibold text-base hover:bg-secondary/80 transition-all">
          See how it works
        </a>
      </div>

      <div className="animate-fade-up-4 flex gap-10 mt-14 flex-wrap justify-center">
        {proofItems.map((item) => (
          <div key={item.label} className="text-center">
            <div className="text-2xl font-bold text-foreground">{item.num}</div>
            <div className="text-xs text-muted-foreground mt-1 font-medium">{item.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Hero;
