import founderPhoto from "@/assets/founder-jonathan.jpg";

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
    title: "People moving for work",
    desc: "Your employer needs your CPF for payroll. HR won't wait while you figure out the bureaucracy.",
  },
  {
    emoji: "❤️",
    title: "Partners & spouses",
    desc: "Moved for love? A CPF lets you build a life here. Joint accounts, car insurance, even a gym membership.",
  },
  {
    emoji: "🎓",
    title: "Students",
    desc: "Brazilian universities require a CPF for enrollment. Get it sorted before classes start, not during.",
  },
  {
    emoji: "🏖️",
    title: "Long-stay travellers",
    desc: "Staying more than a few weeks? A CPF unlocks local prices, Pix payments, and iFood delivery.",
  },
  {
    emoji: "🌎",
    title: "Tourists & short-stay visitors",
    desc: "Even on a tourist visa, a CPF lets you buy a local SIM, use Pix, order on iFood, and skip gringo prices.",
  },
  {
    emoji: "🧳",
    title: "Snowbirds & seasonal visitors",
    desc: "Spend a few months a year in Brazil? A CPF makes every return easier. Banking, phone plans, and online shopping just work.",
  },
];

const WhoIsThisFor = () => (
  <section className="py-24 px-8 bg-secondary">
    <div className="max-w-[900px] mx-auto">
      <div className="text-xs uppercase tracking-[3px] text-primary font-bold mb-4">Who is this for</div>
      <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tight">
        If you're a foreigner in Brazil, this is for you
      </h2>
      <p className="text-muted-foreground mt-4 max-w-[560px] text-sm leading-relaxed">
        It doesn't matter why you're here. If you need a CPF and don't want to waste a day figuring it out, we've got you.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
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

      {/* Founder story */}
      <div className="mt-16 bg-card border border-border rounded-2xl p-8 md:p-10">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-xl shrink-0">
            🧑‍💻
          </div>
          <div>
            <h3 className="font-bold text-base">Why I built this</h3>
            <p className="text-xs text-muted-foreground">From the founder of GET CPF</p>
          </div>
        </div>
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>
            I built GET CPF because I needed it myself. I moved to Brazil, had no idea where to go or what to bring, 
            and spent days jumping between government sites, Reddit, and AI tools that gave me half the answer 
            with none of the context.
          </p>
          <p>
            So I documented every step, built it into a tool, and got my CPF on the first try. That's what this is. 
            The price is fair, it's staying where it is, and it does exactly what it says.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default WhoIsThisFor;
