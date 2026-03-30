import { Smartphone, UtensilsCrossed, Plane, Building2, Ticket, ShoppingCart } from "lucide-react";

const painCards = [
  { icon: Smartphone, title: "Can't buy a SIM card", desc: "Carriers require a CPF to activate any SIM. No phone, no Uber, no maps, no WhatsApp." },
  { icon: UtensilsCrossed, title: "Can't order food delivery", desc: "iFood, Rappi, and most delivery apps require a CPF to create an account or pay." },
  { icon: Plane, title: "Can't buy domestic flights", desc: "GOL, LATAM, and Azul all require a CPF at checkout for domestic ticket purchases." },
  { icon: Building2, title: "Can't open a bank account", desc: "Nubank, Inter, C6 — every bank and fintech in Brazil requires a CPF to sign up." },
  { icon: Ticket, title: "Can't buy event tickets", desc: "Concert, football, theatre — ticket platforms demand a CPF. No workaround." },
  { icon: ShoppingCart, title: "Can't shop online", desc: "Amazon Brazil, Mercado Livre, and most e-commerce sites require a CPF at checkout." },
];

const PainPoints = () => {
  return (
    <section className="py-24 px-8 relative bg-secondary">
      <div className="max-w-[1100px] mx-auto">
        <div className="text-xs uppercase tracking-[3px] text-primary font-bold mb-4">The problem</div>
        <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tight max-w-[600px]">
          Life without a CPF
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
          {painCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="bg-card border border-border border-l-4 border-l-destructive/60 rounded-xl p-6 hover:border-l-destructive hover:shadow-md hover:-translate-y-0.5 transition-all">
                <Icon className="w-6 h-6 text-muted-foreground mb-3" />
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

export default PainPoints;
