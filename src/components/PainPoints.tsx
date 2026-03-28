const painCards = [
  { icon: "📱", title: "Can't buy a SIM card", desc: "Carriers require a CPF to activate any SIM. No phone, no Uber, no maps, no WhatsApp." },
  { icon: "🍕", title: "Can't order food delivery", desc: "iFood, Rappi, and most delivery apps require a CPF to create an account or pay." },
  { icon: "✈️", title: "Can't buy domestic flights", desc: "GOL, LATAM, and Azul all require a CPF at checkout for domestic ticket purchases." },
  { icon: "🏦", title: "Can't open a bank account", desc: "Nubank, Inter, C6 — every bank and fintech in Brazil requires a CPF to sign up." },
  { icon: "🎫", title: "Can't buy event tickets", desc: "Concert, football, theatre — ticket platforms demand a CPF. No workaround." },
  { icon: "🛒", title: "Can't shop online", desc: "Amazon Brazil, Mercado Livre, and most e-commerce sites require a CPF at checkout." },
];

const PainPoints = () => {
  return (
    <section className="py-24 px-8 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="max-w-[1100px] mx-auto">
        <div className="text-xs uppercase tracking-[3px] text-primary font-semibold mb-4">The problem</div>
        <div className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tight max-w-[600px]">
          Without a CPF, Brazil locks you out
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {painCards.map((card) => (
            <div key={card.title} className="bg-card border border-foreground/[0.06] rounded-lg p-6 hover:border-primary/20 hover:-translate-y-0.5 transition-all">
              <div className="text-2xl mb-3">{card.icon}</div>
              <h3 className="font-semibold mb-2">
                <span className="text-destructive font-bold mr-1">✕</span> {card.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PainPoints;
