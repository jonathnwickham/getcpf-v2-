const steps = [
  { num: 1, title: "Tell us your situation", desc: "Which state are you in? What's your nationality? Our system asks the right questions to determine your exact path — consulate, in-person office, or email.", time: "~2 minutes" },
  { num: 2, title: "We validate your documents", desc: "We check what you have (passport, birth certificate, proof of address) and tell you exactly what's needed — before you waste a trip to an office.", time: "~2 minutes" },
  { num: 3, title: "Get your personalized Ready Pack", desc: "A complete package with your pre-filled application form, the correct Receita Federal office for your state, a Portuguese cheat sheet, document checklist, and step-by-step instructions.", time: "Instant" },
  { num: 4, title: "Visit the office and get your CPF", desc: "Walk into the Receita Federal office with everything prepared. Most people walk out with their CPF number the same day. We'll show you exactly where to go.", time: "Same day (in-person)" },
];

const HowItWorks = () => {
  return (
    <section id="how" className="py-24 px-8 max-w-[900px] mx-auto">
      <div className="text-xs uppercase tracking-[3px] text-primary font-bold mb-4">How it works</div>
      <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tight">From confused to CPF in 4 steps</h2>
      <div className="mt-12 relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/40 to-border" />
        {steps.map((step) => (
          <div key={step.num} className="flex gap-6 mb-10 relative">
            <div className="w-[50px] h-[50px] min-w-[50px] bg-card border-2 border-primary rounded-full flex items-center justify-center font-bold text-lg text-primary relative z-10 shadow-sm">
              {step.num}
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-md text-xs font-semibold mt-2">
                {step.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
