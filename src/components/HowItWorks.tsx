const steps = [
  { num: 1, title: "Tell us your situation", desc: "Where are you? What's your nationality? What visa do you have? Our AI asks the right questions to determine your exact path — no guessing.", time: "~2 minutes" },
  { num: 2, title: "We validate your documents", desc: "The AI checks what you have (passport, birth certificate, proof of address) and tells you exactly what's needed — before you waste a trip to an office.", time: "~2 minutes" },
  { num: 3, title: "Get your personalized Ready Pack", desc: "A complete PDF with your pre-filled form guide, the correct email address for your region, a Portuguese email template ready to send, a document checklist, and a Portuguese cheat sheet for in-person visits.", time: "Instant download" },
  { num: 4, title: "Submit and get your CPF", desc: "Follow the step-by-step instructions. If you chose the email method, you'll typically receive your CPF number within 3-7 business days. If in-person, often the same day.", time: "3-7 days (email) or same day (in-person)" },
];

const HowItWorks = () => {
  return (
    <section id="how" className="py-24 px-8 max-w-[900px] mx-auto">
      <div className="text-xs uppercase tracking-[3px] text-primary font-semibold mb-4">How it works</div>
      <div className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tight">From confused to CPF in 4 steps</div>
      <div className="mt-12 relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-primary/10" />
        {steps.map((step) => (
          <div key={step.num} className="flex gap-6 mb-10 relative">
            <div className="w-[50px] h-[50px] min-w-[50px] bg-background border-2 border-primary rounded-full flex items-center justify-center font-bold text-lg text-primary relative z-10">
              {step.num}
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{step.desc}</p>
              <span className="inline-block bg-success/10 text-success px-2.5 py-1 rounded-md text-xs font-medium mt-2">
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
