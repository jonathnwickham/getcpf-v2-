import { useNavigate } from "react-router-dom";

interface PricingProps {
  onOpenModal?: () => void;
}

const readyPackFeatures = [
  "AI consultation tailored to your exact situation",
  "Pre-filled application form guide",
  "Correct Receita Federal office for your state",
  "Document checklist with quality tips",
  "Portuguese cheat sheet for office visits",
  "Step-by-step in-person visit guide",
  "Resident vs non-resident classification",
  "Post-CPF next steps (bank, SIM, Pix)",
];

const conciergeFeatures = [
  "Everything in Ready Pack",
  "WhatsApp support during your office visit",
  "Real-time translation assistance",
  "Post-submission tracking until CPF confirmed",
  "Rejection troubleshooting if anything goes wrong",
  "Bank account setup guidance after CPF",
];

const Pricing = ({ onOpenModal }: PricingProps) => {
  const navigate = useNavigate();

  const handleCTA = () => {
    if (onOpenModal) onOpenModal();
    else navigate("/get-started");
  };

  return (
    <section id="pricing" className="py-24 px-8 text-center bg-secondary">
      <div className="text-xs uppercase tracking-[3px] text-primary font-bold mb-4">Simple pricing</div>
      <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tight mx-auto">Pay once. Get your CPF.</h2>
      <p className="text-muted-foreground mt-4 mx-auto max-w-[520px] text-sm leading-relaxed">
        The CPF itself is free — issued by the Brazilian government. You're paying for expert guidance that makes sure it works first time.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[750px] mx-auto mt-12">
        {/* Ready Pack */}
        <div className="bg-card border-2 border-primary rounded-2xl p-8 text-left relative shadow-lg shadow-primary/5">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold">
            Most popular
          </div>
          <div className="text-sm text-muted-foreground font-semibold mb-2">Ready Pack</div>
          <div className="text-4xl font-extrabold tracking-tight">$79 <span className="text-base font-normal text-muted-foreground">USD</span></div>
          <div className="text-sm text-muted-foreground mt-3 mb-6 leading-relaxed">Everything you need to get your CPF without stress or rejection.</div>
          <ul className="mb-8 space-y-2.5">
            {readyPackFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                <span className="text-primary font-bold shrink-0 mt-0.5">✓</span> {f}
              </li>
            ))}
          </ul>
          <button onClick={handleCTA} className="w-full py-3.5 rounded-xl font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-md shadow-primary/20">
            Get started →
          </button>
        </div>

        {/* Concierge */}
        <div className="bg-card border border-border rounded-2xl p-8 text-left">
          <div className="text-sm text-muted-foreground font-semibold mb-2">Concierge</div>
          <div className="text-4xl font-extrabold tracking-tight">$149 <span className="text-base font-normal text-muted-foreground">USD</span></div>
          <div className="text-sm text-muted-foreground mt-3 mb-6 leading-relaxed">For those who want hands-on support through the entire process.</div>
          <ul className="mb-8 space-y-2.5">
            {conciergeFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                <span className="text-primary font-bold shrink-0 mt-0.5">✓</span> {f}
              </li>
            ))}
          </ul>
          <button onClick={handleCTA} className="w-full py-3.5 rounded-xl font-semibold border border-border text-foreground hover:bg-secondary transition-all">
            Get started →
          </button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
