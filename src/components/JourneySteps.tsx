const journeySteps = [
  { num: 1, label: "Tell us about you", time: "~2 min" },
  { num: 2, label: "We check everything", time: "~2 min" },
  { num: 3, label: "Get your Ready Pack", time: "instant" },
  { num: 4, label: "Walk in, walk out", time: "same day" },
];

const JourneySteps = () => (
  <section className="py-10 md:py-14 px-6 bg-primary/[0.03] border-y border-border/30">
    <div className="max-w-[700px] mx-auto text-center">
      <p className="text-sm font-bold text-primary uppercase tracking-[2px] mb-6">How it works</p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
        {journeySteps.map((s, i) => (
          <div key={s.num} className="flex items-center gap-3 sm:gap-2">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                {s.num}
              </span>
              <div className="text-left sm:text-center">
                <span className="text-sm font-semibold text-foreground block leading-tight">{s.label}</span>
                <span className="text-[10px] text-muted-foreground">{s.time}</span>
              </div>
            </div>
            {i < journeySteps.length - 1 && (
              <span className="hidden sm:inline text-muted-foreground/40 text-lg ml-2">→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default JourneySteps;
