import { useNavigate } from "react-router-dom";
import protocolResultImg from "@/assets/protocol-result.png";
import protocolFormImg from "@/assets/protocol-preview.png";

const ProductPreview = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-secondary/30">
      <div className="max-w-5xl mx-auto px-6">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-center mb-4">
          We package everything for you
        </h2>
        <p className="text-center text-muted-foreground max-w-[560px] mx-auto mb-12 text-sm leading-relaxed">
          You fill in one form. We organise the rest — pre-filled documents, the right office, a Portuguese cheat sheet, and AI that checks everything before you go.
        </p>

        {/* Two document mockups */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-10">
          {/* Form (step 1) */}
          <div className="relative flex-shrink-0">
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider text-center mb-3">Step 1 — You fill in the form</p>
            <div
              className="rounded-lg overflow-hidden shadow-xl border border-border bg-white"
              style={{ maxWidth: 340 }}
            >
              <img
                src={protocolFormImg}
                alt="CPF application form from Receita Federal"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          </div>

          {/* Arrow */}
          <div className="text-3xl text-muted-foreground hidden md:block">→</div>

          {/* Protocol result (step 2) */}
          <div className="relative flex-shrink-0">
            <p className="text-sm font-bold text-primary uppercase tracking-wider text-center mb-3">Step 2 — We build your Ready Pack</p>
            <div
              className="rounded-lg overflow-hidden shadow-2xl border-2 border-primary/30 bg-white"
              style={{ maxWidth: 380 }}
            >
              <img
                src={protocolResultImg}
                alt="CPF protocol document — the official receipt you print and bring to the Receita Federal office"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Three callout items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <CalloutItem
            text="AI checks your documents — know before you go that everything is correct"
          />
          <CalloutItem
            text="We tell you exactly where to go, what to say, and what to bring"
          />
          <CalloutItem
            text="Every step translated into Portuguese — no surprises at the counter"
          />
        </div>

        {/* Muted line */}
        <p className="text-center text-sm text-muted-foreground italic mb-8">
          All you do is show up. We handle the preparation so you don't have to figure it out alone.
        </p>

        {/* CTA */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate("/pricing")}
            className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold text-base hover:opacity-90 transition-all shadow-lg"
          >
            Get started — <span className="line-through opacity-60">$49</span> $29 →
          </button>
        </div>
      </div>
    </section>
  );
};

const CalloutItem = ({ text }: { text: string }) => (
  <div className="flex items-start gap-3">
    <span className="text-primary text-xl mt-0.5 shrink-0">✓</span>
    <p className="text-sm text-foreground font-medium">{text}</p>
  </div>
);

export default ProductPreview;
