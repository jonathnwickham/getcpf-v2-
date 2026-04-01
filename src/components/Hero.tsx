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

  const proofItems = [
    { num: 5, suffix: " min", label: "Setup time", isCount: true },
    { num: 7, suffix: "", label: "R$ at Correios", prefix: "R$", isCount: false },
    { num: 0, suffix: "", label: "When you go in", text: "Same day", isCount: false },
    { num: 50, suffix: "+", label: "Nationalities served", isCount: true },
  ];

  return (
    <section
      className="flex flex-col justify-center items-center px-6 pt-[9.25rem] md:pt-36 pb-10 relative overflow-hidden bg-primary/[0.03]"
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

      <div className="max-w-[1100px] mx-auto w-full grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8 lg:gap-14 items-center relative z-10">
        {/* Left — copy */}
        <div className="text-center lg:text-left">
          {/* Beta badge */}
          <div className="animate-fade-up-1 mb-4 inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-xs font-bold text-primary uppercase tracking-wider">BETA IS LIVE - JOIN FOR $29</span>
          </div>

          <h1 className="animate-fade-up-1 text-[clamp(2.2rem,5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-1.5px]">
            Get your Brazilian{" "}
            <span className="text-primary font-serif italic">CPF</span>{" "}
            without the headache
          </h1>

          <p className="animate-fade-up-2 text-[clamp(1rem,2vw,1.15rem)] text-muted-foreground mt-4 leading-relaxed max-w-[520px] mx-auto lg:mx-0">
            A few minutes of preparation is all it takes. We get everything ready so when you walk in, you walk out.
          </p>

          <div className="animate-fade-up-3 flex gap-4 mt-6 flex-wrap justify-center lg:justify-start">
            <button onClick={handleCTA} className="bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-semibold text-base hover:opacity-90 transition-all inline-flex items-center gap-2 shadow-lg shadow-primary/20 min-h-[52px]">
              Get started — <span className="line-through opacity-60">$49</span> $29 →
            </button>
            <a href="#how" className="bg-secondary text-foreground px-8 py-3.5 rounded-xl font-semibold text-base hover:bg-secondary/80 transition-all min-h-[52px] inline-flex items-center">
              See how it works
            </a>
          </div>

          {/* Stats row with count-up */}
          <div className="animate-fade-up-4 grid grid-cols-4 gap-4 sm:flex sm:flex-wrap sm:gap-8 mt-6 justify-center lg:justify-start">
            {proofItems.map((item) => (
              <div key={item.label} className="text-center lg:text-left">
                <div className="text-lg font-bold text-foreground">
                  {item.isCount ? (
                    <CountUp end={item.num} suffix={item.suffix} />
                  ) : item.text ? (
                    item.text
                  ) : (
                    `${item.prefix || ""}${item.num}${item.suffix}`
                  )}
                </div>
                <div className="text-xs text-muted-foreground font-medium">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Product Mockup */}
        <div className="animate-fade-up-3 hidden lg:block relative">
          <div className="animate-float">
            <div className="bg-card border border-border rounded-2xl shadow-2xl shadow-primary/10 overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3.5 bg-muted/50 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/40" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/40" />
                  <div className="w-3 h-3 rounded-full bg-primary/40" />
                </div>
                <div className="flex-1 bg-background rounded-md px-3 py-1.5 text-[11px] text-muted-foreground text-center">
                  getcpf.com/ready-pack
                </div>
              </div>
              <div className="p-7 space-y-5">
                <div className="text-base font-bold text-foreground">Your Ready Pack</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 flex items-start gap-2.5">
                    <FileCheck className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-semibold">Your forms, pre-filled</div>
                      <div className="text-xs text-muted-foreground">Ready to print</div>
                    </div>
                  </div>
                  <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 flex items-start gap-2.5">
                    <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-semibold">Nearest Receita Federal</div>
                      <div className="text-xs text-muted-foreground transition-all duration-500">{offices[officeIndex].city}</div>
                    </div>
                  </div>
                  <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 flex items-start gap-2.5">
                    <Languages className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-semibold">What to say</div>
                      <div className="text-xs text-muted-foreground">Portuguese cheat sheet</div>
                    </div>
                  </div>
                  <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 flex items-start gap-2.5">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-semibold">Doc checklist</div>
                      <div className="text-xs text-muted-foreground">3 of 4 ready</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Application progress</span>
                    <span className="text-primary font-bold">75%</span>
                  </div>
                  <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full w-[75%]" />
                  </div>
                </div>
                <div className="space-y-2.5">
                  {[
                    { label: "Passport copy", done: true },
                    { label: "Proof of address", done: true },
                    { label: "Host declaration", done: false },
                  ].map((doc) => (
                    <div key={doc.label} className="flex items-center gap-2 text-xs">
                      {doc.done ? (
                        <CheckCircle className="w-4 h-4 text-primary" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
                      )}
                      <span className={doc.done ? "text-foreground" : "text-muted-foreground"}>{doc.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-6 bg-primary/5 rounded-[50%] blur-xl" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
