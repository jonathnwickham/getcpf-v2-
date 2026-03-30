import { X, Check } from "lucide-react";

const beforeSteps = [
  "Googled for hours \u2014 found conflicting advice",
  "Went to the wrong office \u2014 turned away at the door",
  "Missing one document \u2014 told to come back next week",
];

const afterSteps = [
  "5-minute questionnaire \u2014 personalised pack ready",
  "Exact documents, right office, no surprises",
  "Walk in, walk out with your CPF number",
];

const Transformation = () => {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-[1000px] mx-auto flex flex-col md:flex-row items-stretch gap-0">
        {/* Before */}
        <div className="flex-1 px-8 py-10">
          <h3 className="text-xl font-bold text-foreground mb-6">Without GET CPF</h3>

          {/* Rejected form card */}
          <div className="bg-card border border-destructive/20 rounded-xl p-4 shadow-sm mb-8 max-w-[200px]">
            <div className="text-[10px] font-bold text-muted-foreground mb-2 tracking-wide uppercase">CPF Form</div>
            <div className="space-y-1.5">
              <div className="h-1.5 bg-muted rounded w-full" />
              <div className="h-1.5 bg-muted rounded w-3/4" />
              <div className="h-1.5 bg-muted rounded w-5/6" />
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-destructive font-bold text-sm">✕</span>
              <span className="text-[10px] text-destructive font-semibold tracking-wide">REJECTED</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-5 mb-8">
            {beforeSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center">
                  <X className="w-3.5 h-3.5 text-destructive" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{step}</p>
              </div>
            ))}
          </div>

          <p className="text-sm text-muted-foreground italic">
            2–3 trips. 1–2 weeks. A lot of stress.
          </p>
        </div>

        {/* Divider — desktop */}
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
          <h3 className="text-xl font-bold text-primary mb-6">With GET CPF</h3>

          {/* Approved form + Nubank cards */}
          <div className="flex gap-3 mb-8">
            <div className="bg-card border border-primary/20 rounded-xl p-4 shadow-sm max-w-[200px]">
              <div className="text-[10px] font-bold text-muted-foreground mb-2 tracking-wide uppercase">CPF Form</div>
              <div className="space-y-1.5">
                <div className="h-1.5 bg-primary/20 rounded w-full" />
                <div className="h-1.5 bg-primary/20 rounded w-3/4" />
                <div className="h-1.5 bg-primary/20 rounded w-5/6" />
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                <span className="text-primary font-bold text-sm">✓</span>
                <span className="text-[10px] text-primary font-semibold tracking-wide">APPROVED</span>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-3 shadow-sm max-w-[130px] self-start">
              <div className="flex items-center gap-1.5 mb-2">
                <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3" />
                </svg>
                <span className="text-[10px] font-bold text-primary">Nubank</span>
              </div>
              <div className="bg-primary/10 rounded-md p-2">
                <div className="text-[9px] text-primary font-semibold">Welcome! 🎉</div>
                <div className="text-[8px] text-muted-foreground mt-0.5">Account ready</div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-5 mb-8">
            {afterSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-primary" />
                </div>
                <p className="text-sm text-foreground leading-relaxed">{step}</p>
              </div>
            ))}
          </div>

          <p className="text-sm text-primary italic">
            1 trip. Same day. Done.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Transformation;
