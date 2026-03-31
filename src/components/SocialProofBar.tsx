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
    <section className="py-10 px-6 bg-background border-y border-border/50">
      <div className="max-w-[900px] mx-auto text-center">
        <p className="text-xs text-muted-foreground font-medium mb-5">
          Your CPF unlocks all of these. {displayCount}+ people have used GET CPF to get theirs.
        </p>
        <div className="flex flex-wrap gap-5 justify-center items-center">
          {logos.map((logo) => (
            <img
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
              loading="eager"
              decoding="async"
              width={80}
              height={25}
              className="h-[25px] w-auto rounded object-contain"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofBar;
