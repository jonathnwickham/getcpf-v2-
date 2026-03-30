import { CreditCard, Smartphone, Home } from "lucide-react";

const cards = [
  {
    icon: CreditCard,
    title: "Open a bank account in 10 minutes",
    desc: "Nubank, Inter, C6, digital banks approve you instantly with a CPF. Get a debit card, Pix, and credit line.",
  },
  {
    icon: Smartphone,
    title: "Get a SIM card and data plan",
    desc: "Walk into any Claro, Vivo, or TIM store and activate a prepaid or postpaid plan on the spot.",
  },
  {
    icon: Home,
    title: "Start apartment hunting",
    desc: "QuintoAndar, ZAP Imóveis, OLX, lease an apartment, sign contracts, set up utilities. All need a CPF.",
  },
];

const AfterCPF = () => {
  return (
    <section className="py-24 px-8">
      <div className="max-w-[1000px] mx-auto text-center">
        <div className="text-xs uppercase tracking-[3px] text-primary font-bold mb-4">After your CPF</div>
        <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tight">
          Your CPF unlocks everything
        </h2>
        <p className="text-muted-foreground mt-3 max-w-md mx-auto text-sm leading-relaxed">
          Once you have your CPF, we show you exactly what to do next — step by step.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 hover:shadow-md transition-all">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AfterCPF;
