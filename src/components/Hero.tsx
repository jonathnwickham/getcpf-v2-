interface HeroProps {
  onOpenModal: () => void;
}

const Hero = ({ onOpenModal }: HeroProps) => {
  const proofItems = [
    { num: "100%", label: "Online process" },
    { num: "~5 min", label: "AI consultation" },
    { num: "Free", label: "CPF itself" },
    { num: "24/7", label: "Available anytime" },
  ];

  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-32 pb-16 relative overflow-hidden">
      <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,hsl(var(--accent-glow)/0.08)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="animate-fade-up inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full text-xs text-primary font-medium mb-8">
        AI-powered CPF registration assistant
      </div>

      <h1 className="animate-fade-up-1 text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.05] tracking-[-2px] max-w-[800px]">
        Get your Brazilian <span className="text-primary">CPF</span> without the headache
      </h1>

      <p className="animate-fade-up-2 text-[clamp(1rem,2vw,1.25rem)] text-text-secondary max-w-[560px] mt-6 leading-relaxed font-light">
        Answer a few questions. Get a personalized, ready-to-submit application pack with pre-filled forms, the right email address, and exactly where to go. In minutes, not days.
      </p>

      <div className="animate-fade-up-3 flex gap-4 mt-8 flex-wrap justify-center">
        <button onClick={onOpenModal} className="bg-primary text-primary-foreground px-8 py-3.5 rounded-[10px] font-semibold text-base hover:brightness-110 hover:-translate-y-0.5 transition-all inline-flex items-center gap-2">
          Get my CPF pack →
        </button>
        <a href="#how" className="border border-foreground/15 text-foreground px-8 py-3.5 rounded-[10px] font-medium text-base hover:border-foreground/30 hover:bg-foreground/[0.03] transition-all">
          See how it works
        </a>
      </div>

      <div className="animate-fade-up-4 flex gap-10 mt-12 flex-wrap justify-center">
        {proofItems.map((item) => (
          <div key={item.label} className="text-center">
            <div className="text-2xl font-bold text-primary">{item.num}</div>
            <div className="text-xs text-text-tertiary mt-1">{item.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Hero;
