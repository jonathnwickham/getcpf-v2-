import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FileCheck, MapPin, Languages, CheckCircle, FileText, Search } from "lucide-react";
import brazilStencil from "@/assets/brazil-stencil.png";
import { useCpfCount } from "@/hooks/use-cpf-count";
import nubankLogo from "@/assets/logos/nubank.png";
import ifoodLogo from "@/assets/logos/ifood.png";
import mercadoLivreLogo from "@/assets/logos/mercadolivre.png";
import rappiLogo from "@/assets/logos/rappi.png";
import vivoLogo from "@/assets/logos/vivo.png";
import quintoAndarLogo from "@/assets/logos/quintoandar.png";
import amazonLogo from "@/assets/logos/amazon.png";
import correiosLogo from "@/assets/logos/correios.png";
import { useCpfCount } from "@/hooks/use-cpf-count";

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

const empathyLines = [
  "Turned away at Correios because you don't have a CPF?",
  "Trying to open Nubank but they need your CPF first?",
  "Can't order iFood without a CPF account?",
  "Landlord asking for a CPF you don't have yet?",
  "Trying to buy a SIM card but every carrier needs a CPF?",
  "Can't buy event tickets without a CPF at checkout?",
];

const Hero = ({ onOpenModal }: HeroProps) => {
  const navigate = useNavigate();
  const [officeIndex, setOfficeIndex] = useState(0);
  const [empathyIndex, setEmpathyIndex] = useState(0);
  const [empathyVisible, setEmpathyVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setOfficeIndex((prev) => (prev + 1) % offices.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setEmpathyVisible(false);
      setTimeout(() => {
        setEmpathyIndex((prev) => (prev + 1) % empathyLines.length);
        setEmpathyVisible(true);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCTA = () => {
    if (onOpenModal) onOpenModal();
    else navigate("/get-started");
  };

  const cpfCount = useCpfCount();
  const displayCount = cpfCount !== null ? `${cpfCount}+` : "200+";

  const proofItems = [
    { num: "~5 min", label: "Setup time" },
    { num: "R$7", label: "At Correios" },
    { num: "Same day", label: "When you go in" },
    { num: displayCount, label: "CPFs prepared" },
  ];

  const flags = ["🇺🇸", "🇬🇧", "🇩🇪", "🇫🇷", "🇿🇦", "🇳🇬", "🇦🇺", "🇦🇷", "🇨🇴", "🇮🇳", "🇯🇵", "🇰🇷"];

  return (
    <section className="min-h-[90vh] flex flex-col justify-center items-center px-6 pt-32 pb-16 relative overflow-hidden bg-[hsl(160_84%_28%/0.03)]">
      {/* Radial glow */}
      <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,hsl(var(--accent-glow)/0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* Brazilian stencil background */}
      <img
        src={brazilStencil}
        alt=""
        aria-hidden="true"
        className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[100em] max-w-none opacity-[0.04] pointer-events-none select-none"
        width={1200}
        height={800}
      />

      <div className="max-w-[1100px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left, Copy */}
        <div className="text-center lg:text-left">
          <div className="animate-fade-up inline-flex items-center gap-2 bg-primary/5 border border-primary/15 px-4 py-1.5 rounded-full text-xs text-primary font-semibold mb-8">
            <span className="text-sm">🛡️</span>
            If you follow our steps and get rejected — full refund. No questions asked.
          </div>

          <p
            className={`text-sm italic text-muted-foreground/70 mb-4 h-5 transition-opacity duration-400 ${empathyVisible ? "opacity-100" : "opacity-0"}`}
          >
            {empathyLines[empathyIndex]}
          </p>

          <h1 className="animate-fade-up-1 text-[clamp(2.2rem,5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-1.5px]">
            Get your Brazilian{" "}
            <span className="text-primary font-serif italic">CPF</span>{" "}
            without the headache
          </h1>

          <p className="animate-fade-up-2 text-[clamp(1rem,2vw,1.15rem)] text-muted-foreground mt-6 leading-relaxed max-w-[520px] mx-auto lg:mx-0">
            A few minutes of preparation is all it takes. We get everything ready so when you walk in, you walk out. No wasted trips, no rejected forms, no showing up to the wrong office.
          </p>

          <p className="animate-fade-up-2 text-sm text-muted-foreground/70 mt-3 max-w-[520px] mx-auto lg:mx-0">
            You still need to visit an office in person. We make sure that visit works the first time.
          </p>

          <div className="animate-fade-up-3 flex gap-4 mt-8 flex-wrap justify-center lg:justify-start">
            <button onClick={handleCTA} className="bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-semibold text-base hover:opacity-90 transition-all inline-flex items-center gap-2 shadow-lg shadow-primary/20 min-h-[52px]">
              Get started →
            </button>
            <a href="#how" className="bg-secondary text-foreground px-8 py-3.5 rounded-xl font-semibold text-base hover:bg-secondary/80 transition-all min-h-[52px] inline-flex items-center">
              See how it works
            </a>
          </div>

          <div className="animate-fade-up-4 grid grid-cols-2 sm:flex gap-8 sm:gap-10 mt-12 justify-center lg:justify-start">
            {proofItems.map((item) => (
              <div key={item.label} className="text-center lg:text-left">
                <div className="text-2xl font-bold text-foreground">{item.num}</div>
                <div className="text-xs text-muted-foreground mt-1 font-medium">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Logo trust strip */}
          <div className="animate-fade-up-4 mt-8">
            <p className="text-xs text-muted-foreground mb-3 text-center lg:text-left">Your CPF unlocks all of these and everything else in Brazil.</p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start items-center">
              {["Nubank", "iFood", "Mercado Livre", "Rappi", "Vivo", "QuintoAndar", "Amazon BR", "Correios"].map((name) => (
                <span key={name} className="text-xs font-semibold text-muted-foreground/50 tracking-wide uppercase">{name}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right, Product Mockup */}
        <div className="animate-fade-up-3 hidden lg:block relative">
          <div className="animate-float">
          <div className="bg-card border border-border rounded-2xl shadow-2xl shadow-primary/10 overflow-hidden">
            {/* Browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/40" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/40" />
                <div className="w-3 h-3 rounded-full bg-primary/40" />
              </div>
              <div className="flex-1 bg-background rounded-md px-3 py-1 text-[10px] text-muted-foreground text-center">
                getcpf.com/ready-pack
              </div>
            </div>
            {/* Mock dashboard content */}
            <div className="p-5 space-y-4">
              <div className="text-sm font-bold text-foreground">Your Ready Pack</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 flex items-start gap-2">
                  <FileCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold">Your forms, pre-filled</div>
                    <div className="text-[10px] text-muted-foreground">Ready to print</div>
                  </div>
                </div>
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold">Nearest Receita Federal</div>
                    <div className="text-[10px] text-muted-foreground transition-all duration-500">{offices[officeIndex].city}, {offices[officeIndex].office}</div>
                  </div>
                </div>
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 flex items-start gap-2">
                  <Languages className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold">What to say</div>
                    <div className="text-[10px] text-muted-foreground">Portuguese cheat sheet</div>
                  </div>
                </div>
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold">Doc checklist</div>
                    <div className="text-[10px] text-muted-foreground">3 of 4 ready</div>
                  </div>
                </div>
              </div>
              {/* Fake progress */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px]">
                  <span className="text-muted-foreground font-medium">Application progress</span>
                  <span className="text-primary font-bold">75%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full w-[75%]" />
                </div>
              </div>
              {/* Mini document rows */}
              <div className="space-y-2">
                {[
                  { label: "Passport copy", done: true },
                  { label: "Proof of address", done: true },
                  { label: "Host declaration", done: false },
                ].map((doc) => (
                  <div key={doc.label} className="flex items-center gap-2 text-[11px]">
                    {doc.done ? (
                      <CheckCircle className="w-3.5 h-3.5 text-primary" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-muted-foreground/30" />
                    )}
                    <span className={doc.done ? "text-foreground" : "text-muted-foreground"}>{doc.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div>
          {/* Shadow that stays in place while card floats */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-6 bg-primary/5 rounded-[50%] blur-xl" />
        </div>
      </div>

      {/* Nationality flags */}
      <div className="animate-fade-up-4 mt-14 flex flex-col items-center gap-3">
        <div className="flex gap-2 flex-wrap justify-center items-center">
          <span className="text-3xl">🇧🇷</span>
          <span className="text-muted-foreground mx-1">←</span>
          {flags.map((flag) => (
            <span key={flag} className="text-2xl">{flag}</span>
          ))}
          <span className="text-sm text-muted-foreground font-medium self-center ml-1">+43 more</span>
        </div>
        <p className="text-xs text-muted-foreground">Works for any nationality</p>
      </div>
    </section>
  );
};

export default Hero;
