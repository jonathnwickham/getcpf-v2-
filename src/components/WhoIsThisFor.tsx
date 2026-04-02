const personas = [
  {
    emoji: "💻",
    title: "Digital nomads",
    desc: "Working remotely from Brazil? You need a CPF to open a bank account, get a local SIM, and sign up for coworking spaces.",
  },
  {
    emoji: "🏠",
    title: "Expats settling in",
    desc: "Renting an apartment, setting up utilities, getting health insurance. None of it works without a CPF.",
  },
  {
    emoji: "✈️",
    title: "Moving for work",
    desc: "Your employer needs your CPF for payroll. HR won't wait while you figure out the bureaucracy.",
  },
  {
    emoji: "🏖️",
    title: "Long-stay travellers",
    desc: "Even on a tourist visa, a CPF lets you buy a local SIM, use Pix, order on iFood, and skip gringo prices.",
  },
];

const WhoIsThisFor = () => (
  <section className="py-24 px-8 bg-secondary">
    <div className="max-w-[1100px] mx-auto">
      <div className="text-xs uppercase tracking-[3px] text-primary font-bold mb-4">Who is this for</div>
      <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tight">
        If you're a foreigner in Brazil, this is for you
      </h2>
      <p className="text-muted-foreground mt-4 max-w-[560px] text-sm leading-relaxed">
        It doesn't matter why you're here. If you need a CPF and don't want to waste a day figuring it out, we've got you.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-12">
        {personas.map((p) => (
          <div
            key={p.title}
            className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 hover:shadow-md transition-all"
          >
            <div className="text-3xl mb-3">{p.emoji}</div>
            <h3 className="font-bold text-base mb-1.5">{p.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhoIsThisFor;
