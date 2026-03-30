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

const Hero = ({ onOpenModal }: HeroProps) => {
  const navigate = useNavigate();
  const [officeIndex, setOfficeIndex] = useState(0);

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

  const orbitFlags = ["🇺🇸", "🇬🇧", "🇩🇪", "🇫🇷", "🇿🇦", "🇮🇹", "🇦🇺", "🇦🇷", "🇨🇴", "🇮🇳", "🇯🇵", "🇰🇷", "🇵🇹", "🇳🇱", "🇨🇦", "🇮🇪"];

  return (
    <section className="flex flex-col justify-center items-center px-6 pt-32 pb-8 relative overflow-hidden bg-[hsl(160_84%_28%/0.03)]">
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

      <div className="max-w-[1100px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
        {/* Left, Copy + proof */}
        <div className="text-center lg:text-left">
          <h1 className="animate-fade-up-1 text-[clamp(2.2rem,5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-1.5px]">
            Get your Brazilian{" "}
            <span className="text-primary font-serif italic">CPF</span>{" "}
            without the headache
          </h1>

          <p className="animate-fade-up-2 text-[clamp(1rem,2vw,1.15rem)] text-muted-foreground mt-5 leading-relaxed max-w-[520px] mx-auto lg:mx-0">
            A few minutes of preparation is all it takes. We get everything ready so when you walk in, you walk out.
          </p>

          <div className="animate-fade-up-3 flex gap-4 mt-7 flex-wrap justify-center lg:justify-start">
            <button onClick={handleCTA} className="bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-semibold text-base hover:opacity-90 transition-all inline-flex items-center gap-2 shadow-lg shadow-primary/20 min-h-[52px]">
              Get started →
            </button>
            <a href="#how" className="bg-secondary text-foreground px-8 py-3.5 rounded-xl font-semibold text-base hover:bg-secondary/80 transition-all min-h-[52px] inline-flex items-center">
              See how it works
            </a>
          </div>

          <div className="animate-fade-up-3 flex items-center gap-2 mt-3 justify-center lg:justify-start text-xs text-muted-foreground">
            <span>🛡️</span>
            If you follow our steps and get rejected, full refund. No questions asked.
          </div>

          {/* Stats */}
          <div className="animate-fade-up-4 flex flex-wrap gap-6 sm:gap-8 mt-8 justify-center lg:justify-start">
            {proofItems.map((item) => (
              <div key={item.label} className="text-center lg:text-left">
                <div className="text-lg font-bold text-foreground">{item.num}</div>
                <div className="text-[10px] text-muted-foreground font-medium">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Brand logos */}
          <div className="animate-fade-up-4 mt-5">
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start items-center">
              {[
                { src: nubankLogo, alt: "Nubank" },
                { src: ifoodLogo, alt: "iFood" },
                { src: mercadoLivreLogo, alt: "Mercado Livre" },
                { src: rappiLogo, alt: "Rappi" },
                { src: vivoLogo, alt: "Vivo" },
                { src: quintoAndarLogo, alt: "QuintoAndar" },
                { src: amazonLogo, alt: "Amazon BR" },
                { src: correiosLogo, alt: "Correios" },
              ].map((logo) => (
                <img
                  key={logo.alt}
                  src={logo.src}
                  alt={logo.alt}
                  className="h-5 w-auto rounded object-contain opacity-60 hover:opacity-100 transition-all duration-300"
                />
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5 lg:text-left text-center">Your CPF unlocks all of these</p>
          </div>
        </div>

        {/* Right, Product Mockup — bigger */}
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
            <div className="p-6 space-y-5">
              <div className="text-sm font-bold text-foreground">Your Ready Pack</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-3.5 flex items-start gap-2">
                  <FileCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold">Your forms, pre-filled</div>
                    <div className="text-[10px] text-muted-foreground">Ready to print</div>
                  </div>
                </div>
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-3.5 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold">Nearest Receita Federal</div>
                    <div className="text-[10px] text-muted-foreground transition-all duration-500">{offices[officeIndex].city}, {offices[officeIndex].office}</div>
                  </div>
                </div>
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-3.5 flex items-start gap-2">
                  <Languages className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold">What to say</div>
                    <div className="text-[10px] text-muted-foreground">Portuguese cheat sheet</div>
                  </div>
                </div>
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-3.5 flex items-start gap-2">
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
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-6 bg-primary/5 rounded-[50%] blur-xl" />
        </div>
      </div>

      {/* Flag marquee — full width below grid */}
      <div className="animate-fade-up-4 mt-6 flex flex-col items-center gap-1.5 w-full max-w-[1100px]">
        <div className="w-full overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10" />
          <div className="flex gap-3 animate-marquee w-max">
            {[...orbitFlags, ...orbitFlags].map((flag, i) => (
              <span key={i} className="text-lg shrink-0">{flag}</span>
            ))}
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground font-medium">🇧🇷 50+ countries supported</p>
      </div>
    </section>
  );
};

export default Hero;
