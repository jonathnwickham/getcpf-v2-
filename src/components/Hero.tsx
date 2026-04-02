import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FileCheck, MapPin, Languages, CheckCircle } from "lucide-react";
import brazilStencil from "@/assets/brazil-stencil.png";

const offices = [
  { city: "São Paulo", office: "CAC Bela Vista" },
  { city: "Rio de Janeiro", office: "CAC Centro" },
  { city: "Florianópolis", office: "Receita Federal Centro" },
  { city: "Curitiba", office: "Delegacia Centro" },
  { city: "Salvador", office: "CAC Comércio" },
  { city: "Belo Horizonte", office: "CAC Savassi" },
  { city: "Brasília", office: "Delegacia Asa Sul" },
  { city: "Recife", office: "CAC Boa Vista" },
];

interface HeroProps {
  onOpenModal?: () => void;
}

const CountUp = ({ end, suffix = "", duration = 1500 }: { end: number; suffix?: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const steps = 40;
    const stepTime = duration / steps;
    let current = 0;
    const timer = setInterval(() => {
      current++;
      setCount(Math.round((current / steps) * end));
      if (current >= steps) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  return <div ref={ref}>{started ? count : 0}{suffix}</div>;
};

const Hero = ({ onOpenModal }: HeroProps) => {
  const navigate = useNavigate();
  const [officeIndex, setOfficeIndex] = useState(0);

  const handleCTA = () => {
    if (onOpenModal) onOpenModal();
    else navigate("/get-started");
  };

  const stats = [
    { value: "5 min", label: "SETUP" },
    { value: "Same day", label: "RESULT" },
    { value: "50+", label: "COUNTRIES" },
    { value: "$29", label: "ONE-TIME" },
  ];

  return (
    <section
      className="flex flex-col justify-center items-center px-6 pt-[10.25rem] md:pt-36 pb-6 relative overflow-hidden bg-primary/[0.03]"
      style={{
        backgroundImage: `url(${brazilStencil})`,
        backgroundPosition: 'center 85%',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100em auto',
      }}
    >
      {/* Reduce stencil opacity via overlay */}
      <div className="absolute inset-0 bg-background/[0.96] pointer-events-none" />
      <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,hsl(var(--accent-glow)/0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-[680px] mx-auto w-full text-center relative z-10">
        {/* Beta badge */}
        <div className="animate-fade-up-1 mb-4 inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5">
          <span className="text-sm">🎉</span>
          <span className="text-xs font-bold text-primary">Beta is live - limited spots at $29</span>
        </div>

        <h1 className="animate-fade-up-1 text-[clamp(2.2rem,5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-1.5px]">
          Get your Brazilian CPF<br />
          <span className="text-primary font-serif italic">without the headache</span>
        </h1>

        <p className="animate-fade-up-2 text-[clamp(1rem,2vw,1.15rem)] text-muted-foreground mt-4 leading-relaxed max-w-[460px] mx-auto">
          5-minute setup. One visit. Walk out with your CPF. We prepare everything so when you show up, it works.
        </p>

        <div className="animate-fade-up-3 flex gap-4 mt-6 justify-center">
          <button onClick={handleCTA} className="bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-semibold text-base hover:opacity-90 transition-all inline-flex items-center gap-2 shadow-lg shadow-primary/20 min-h-[52px]">
            Get my CPF Pack - $29 →
          </button>
          <a href="#how" className="text-foreground px-8 py-3.5 rounded-xl font-semibold text-base transition-all min-h-[52px] inline-flex items-center bg-muted border border-border">
            See how it works
          </a>
        </div>

        {/* Stats row with dividers */}
        <div className="animate-fade-up-4 flex items-center justify-center mt-8 gap-0">
          {stats.map((stat, i) => (
            <div key={stat.label} className={`flex-1 text-center ${i > 0 ? "border-l border-border" : ""}`}>
              <div className="text-lg font-bold text-foreground">{stat.value}</div>
              <div className="text-[11px] text-muted-foreground font-medium tracking-[1.5px] uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
