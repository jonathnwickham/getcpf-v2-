import { useNavigate } from "react-router-dom";
import protocolResultImg from "@/assets/protocol-result.png";
import protocolFormImg from "@/assets/protocol-preview.png";

const ProductPreview = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-secondary/30">
      <div className="max-w-5xl mx-auto px-6">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-center mb-12">
          This is what you walk in with
        </h2>

        {/* Two document mockups */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-10">
          {/* Form (step 1) */}
          <div className="relative flex-shrink-0">
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider text-center mb-3">Step 1 — Fill in the form</p>
            <div
              className="rounded-lg overflow-hidden shadow-xl border border-border bg-white"
              style={{ transform: "rotate(-2deg)", maxWidth: 340 }}
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
            <p className="text-xs font-bold text-primary uppercase tracking-wider text-center mb-3">Step 2 — Your protocol is generated</p>
            <div
              className="rounded-lg overflow-hidden shadow-2xl border-2 border-primary/30 bg-white"
              style={{ transform: "rotate(3deg)", maxWidth: 380 }}
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
            text="Your reference number — proof your application was submitted correctly"
          />
          <CalloutItem
            text="Valid for 90 days — plenty of time to visit the office"
          />
          <CalloutItem
            text="In Portuguese — we translate everything so you know exactly what to bring"
          />
        </div>

        {/* Muted line */}
        <p className="text-center text-sm text-muted-foreground italic mb-8">
          Generated from the official Receita Federal system. Accepted at every office in Brazil.
        </p>

        {/* CTA */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate("/pricing")}
            className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold text-base hover:opacity-90 transition-all shadow-lg"
          >
            Get my Ready Pack — $49 →
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
