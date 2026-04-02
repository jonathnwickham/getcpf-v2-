import { X, Check } from "lucide-react";

const beforeSteps = [
  "Googled for hours, found conflicting advice",
  "Went to the wrong office, turned away at the door",
  "Missing one document, told to come back next week",
];

const afterSteps = [
  "5-minute questionnaire, personalised pack ready",
  "Exact documents, right office, no surprises",
  "Walk in, walk out with your CPF number",
];

const unlockedItems = [
  { emoji: "🏦", label: "Bank account" },
  { emoji: "🍔", label: "iFood" },
  { emoji: "🏋️", label: "Gym membership" },
];

const Transformation = () => {
  return (
    <section className="py-12 md:py-20 px-6 bg-background">
      <div className="max-w-[960px] mx-auto flex flex-col md:flex-row items-stretch">
        {/* Before */}
        <div className="flex-1 px-4 sm:px-6 md:px-10 py-8">
          <h3 className="text-lg font-bold text-foreground mb-1">Without GET CPF</h3>
          <p className="text-sm text-muted-foreground mb-6">What most foreigners experience</p>

          {/* Rejected form card */}
          <div className="bg-card border border-destructive/20 rounded-xl p-3.5 shadow-sm mb-6 w-[170px]">
            <div className="text-[9px] font-bold text-muted-foreground mb-1.5 tracking-wide uppercase">CPF Form</div>
            <div className="space-y-1">
              <div className="h-1.5 bg-muted rounded w-full" />
              <div className="h-1.5 bg-muted rounded w-3/4" />
              <div className="h-1.5 bg-muted rounded w-5/6" />
            </div>
            <div className="mt-2.5 flex items-center gap-1.5">
              <span className="text-destructive font-bold text-xs">✕</span>
              <span className="text-[9px] text-destructive font-semibold tracking-wide">REJECTED</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4 mb-6">
            {beforeSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-destructive/10 flex items-center justify-center">
                  <X className="w-3 h-3 text-destructive" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{step}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground italic">
            2–3 trips. 1–2 weeks. A lot of stress.
          </p>
        </div>

        {/* Divider — desktop */}
        <div className="hidden md:flex flex-col items-center py-8">
          <div className="flex-1 w-px bg-border" />
          <span className="text-2xl my-3 select-none">🇧🇷</span>
          <div className="flex-1 w-px bg-border" />
        </div>
        {/* Divider — mobile */}
        <div className="flex md:hidden items-center gap-4 py-4 px-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-2xl select-none">🇧🇷</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* After */}
        <div className="flex-1 px-4 sm:px-6 md:px-10 py-8">
          <h3 className="text-lg font-bold text-primary mb-1">With GET CPF</h3>
          <p className="text-sm text-muted-foreground mb-6">What our users experience</p>

          {/* Approved form + unlocked services */}
          <div className="flex items-start gap-2 sm:gap-3 mb-6">
            <div className="bg-card border border-primary/20 rounded-xl p-3.5 shadow-sm w-[140px] sm:w-[170px] flex-shrink-0">
              <div className="text-[9px] font-bold text-muted-foreground mb-1.5 tracking-wide uppercase">CPF Form</div>
              <div className="space-y-1">
                <div className="h-1.5 bg-primary/20 rounded w-full" />
                <div className="h-1.5 bg-primary/20 rounded w-3/4" />
                <div className="h-1.5 bg-primary/20 rounded w-5/6" />
              </div>
              <div className="mt-2.5 flex items-center gap-1.5">
                <span className="text-primary font-bold text-xs">✓</span>
                <span className="text-[9px] text-primary font-semibold tracking-wide">APPROVED</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-1 min-w-0">
              {unlockedItems.map((item, i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded-lg px-3 py-1.5 shadow-sm flex items-center gap-2"
                >
                  <span className="text-sm">{item.emoji}</span>
                  <span className="text-[10px] font-medium text-foreground whitespace-nowrap">{item.label}</span>
                  <Check className="w-3 h-3 text-primary ml-auto" />
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4 mb-4">
            {afterSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <p className="text-sm text-foreground leading-relaxed">{step}</p>
              </div>
            ))}
          </div>

          {/* 4-step journey */}
          <div className="bg-card border border-border rounded-xl p-4 mb-6">
            <div className="space-y-2">
              {journeySteps.map((s) => (
                <div key={s.num} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                    {s.num}
                  </span>
                  <span className="text-xs text-foreground font-medium">{s.label}</span>
                  <span className="text-[10px] text-muted-foreground ml-auto">{s.time}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-primary italic">
            1 trip. Same day. Done.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Transformation;
