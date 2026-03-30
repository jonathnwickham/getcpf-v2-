import { X, Check } from "lucide-react";

const beforeSteps = [
  "Googled for hours \u2014 found conflicting information",
  "Went to the wrong office \u2014 turned away",
  "Missing one document \u2014 told to come back",
  "Second trip \u2014 finally got it (maybe)",
];

const afterSteps = [
  "5-minute questionnaire \u2014 personalised pack ready",
  "Exact documents listed \u2014 nothing missing",
  "Right office, right time \u2014 no queue surprises",
  "Walk out with CPF number same day",
];

const Transformation = () => {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-[960px] mx-auto flex flex-col md:flex-row items-stretch gap-0">
        {/* Before */}
        <div className="flex-1 px-8 py-10">
          <h3 className="text-xl font-bold text-foreground mb-1">Without GET CPF</h3>
          <p className="text-sm text-muted-foreground mb-8">What most foreigners experience</p>

          <div className="space-y-5">
            {beforeSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center">
                  <X className="w-3.5 h-3.5 text-destructive" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{step}</p>
              </div>
            ))}
          </div>

          <p className="text-sm text-muted-foreground italic mt-8">
            Average: 2–3 trips. 1–2 weeks. A lot of stress.
          </p>
        </div>

        {/* Divider with flag — desktop */}
        <div className="hidden md:flex flex-col items-center py-10">
          <div className="flex-1 w-px bg-border" />
          <span className="text-3xl my-4 select-none">🇧🇷</span>
          <div className="flex-1 w-px bg-border" />
        </div>
        {/* Divider — mobile */}
        <div className="flex md:hidden items-center gap-4 py-6 px-8">
          <div className="flex-1 h-px bg-border" />
          <span className="text-3xl select-none">🇧🇷</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* After */}
        <div className="flex-1 px-8 py-10">
          <h3 className="text-xl font-bold text-primary mb-1">With GET CPF</h3>
          <p className="text-sm text-muted-foreground mb-8">What our users experience</p>

          <div className="space-y-5">
            {afterSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-primary" />
                </div>
                <p className="text-sm text-foreground leading-relaxed">{step}</p>
              </div>
            ))}
          </div>

          <p className="text-sm text-primary italic mt-8">
            Average: 1 trip. Same day. Done.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Transformation;
