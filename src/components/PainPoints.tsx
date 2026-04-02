const painPoints = [
  {
    title: "Sending a parcel",
    text: "A friend left their clothes at your Airbnb. They need them shipped urgently. You go to Correios. They ask for your CPF. You don't have one. You spend the rest of the day trying to find someone who'll lend you theirs. Half a day gone for a parcel.",
  },
  {
    title: "Buying a SIM card",
    text: "Every carrier needs a CPF to activate a plan. Without one you're on roaming. Your foreign card works fine, at around $15 a day until you sort this out.",
  },
  {
    title: "Ordering food delivery",
    text: "iFood, Rappi, 99Food. All need a CPF to create an account. You're asking the person at reception to order for you or eating wherever you can pay cash.",
  },
  {
    title: "Opening a bank account",
    text: "Nubank, Inter, C6. Every bank and fintech in Brazil requires a CPF. No account means no Pix. No Pix in Brazil in 2026 means you are doing everything the hard way.",
  },
];

const PainPoints = () => {
  return (
    <section className="py-12 px-8 relative bg-secondary">
      <div className="max-w-[900px] mx-auto">
        <div className="text-xs uppercase tracking-[3px] text-primary font-bold mb-4">The problem</div>
        <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tight max-w-[700px]">
          Brazil is incredible. But without a CPF, everyday things get a lot more complicated.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {painPoints.map((point) => (
            <div key={point.title} className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold text-base mb-2">{point.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{point.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PainPoints;
