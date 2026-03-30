const steps = [
  { num: 1, title: "Tell us about you", desc: "Where are you? What's your nationality? We ask the right questions so we can figure out the fastest path for your specific situation.", time: "~2 minutes" },
  { num: 2, title: "We check everything", desc: "Passport, proof of address, mother's name — we make sure everything is exactly right before you go anywhere. No wasted trips.", time: "~2 minutes" },
  { num: 3, title: "Get your Ready Pack", desc: "Your personalised application pack: pre-filled forms, the right office for your state, a Portuguese cheat sheet, and exactly what to say when you get there.", time: "Instant" },
  { num: 4, title: "Walk in, walk out with your CPF", desc: "Show up prepared, hand over your documents, and walk out with your CPF number. Most people are done in under an hour.", time: "Same day" },
];

const HowItWorks = () => {
  return (
    <section id="how" className="py-24 px-8 max-w-[900px] mx-auto">
      <div className="text-xs uppercase tracking-[3px] text-primary font-bold mb-4">Four steps</div>
      <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tight">From zero to CPF in one visit</h2>
      <p className="text-sm text-muted-foreground mt-3 italic">
        This is preparation, not automation. You still go to the office. We make sure it works when you do.
      </p>
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
