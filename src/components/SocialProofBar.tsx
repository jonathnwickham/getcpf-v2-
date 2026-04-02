import nubankLogo from "@/assets/logos/nubank.png";
import ifoodLogo from "@/assets/logos/ifood.png";
import mercadoLivreLogo from "@/assets/logos/mercadolivre.png";
import rappiLogo from "@/assets/logos/rappi.png";
import vivoLogo from "@/assets/logos/vivo.png";
import quintoAndarLogo from "@/assets/logos/quintoandar.png";
import amazonLogo from "@/assets/logos/amazon.png";
import correiosLogo from "@/assets/logos/correios.png";
import { useCpfCount } from "@/hooks/use-cpf-count";

const logos = [
  { src: nubankLogo, alt: "Nubank" },
  { src: ifoodLogo, alt: "iFood" },
  { src: mercadoLivreLogo, alt: "Mercado Livre" },
  { src: rappiLogo, alt: "Rappi" },
  { src: vivoLogo, alt: "Vivo" },
  { src: quintoAndarLogo, alt: "QuintoAndar" },
  { src: amazonLogo, alt: "Amazon BR" },
  { src: correiosLogo, alt: "Correios" },
];

const SocialProofBar = () => {
  const cpfCount = useCpfCount();
  const displayCount = cpfCount !== null ? cpfCount : 200;

  return (
    <section className="py-6 px-6 bg-background border-y border-border/50">
      <div className="max-w-[900px] mx-auto text-center">
        
        <p className="text-xs text-muted-foreground font-medium mb-5">
          Your CPF unlocks everyday services like these.
        </p>
        <div className="grid grid-cols-4 gap-1.5 justify-items-center items-center max-w-[340px] md:max-w-none mx-auto md:flex md:flex-wrap md:gap-5 md:justify-center">
          {logos.map((logo) => (
            <img
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
              loading="eager"
              decoding="async"
              width={80}
              height={31}
              className="h-[31px] md:h-[36px] w-auto rounded object-contain"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofBar;
