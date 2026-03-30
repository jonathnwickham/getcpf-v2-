const Transformation = () => {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-[960px] mx-auto flex flex-col md:flex-row items-stretch gap-0">
        {/* Before */}
        <div className="flex-1 flex flex-col items-center text-center px-8 py-10">
          <div className="relative w-72 h-64 mb-8">
            {/* Counter desk */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-56 h-20 bg-muted/60 rounded-xl border border-border shadow-sm" />
            
            {/* Person at counter */}
            <div className="absolute bottom-16 left-[35%] -translate-x-1/2 flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-muted border-2 border-border flex items-center justify-center">
                <svg className="w-7 h-7 text-muted-foreground/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                </svg>
              </div>
              <div className="w-10 h-16 bg-muted/80 rounded-lg mt-1 border border-border/50" />
            </div>

            {/* CPF form with red rejection */}
            <div className="absolute top-2 right-2 bg-card border border-destructive/30 rounded-xl p-3 shadow-lg w-28">
              <div className="text-[9px] font-bold text-muted-foreground mb-1.5">CPF Form</div>
              <div className="space-y-1">
                <div className="h-1.5 bg-muted rounded w-full" />
                <div className="h-1.5 bg-muted rounded w-3/4" />
                <div className="h-1.5 bg-muted rounded w-5/6" />
              </div>
              <div className="mt-2 flex items-center gap-1">
                <span className="text-destructive font-bold text-xs">✕</span>
                <span className="text-[8px] text-destructive font-semibold">REJECTED</span>
              </div>
            </div>

            {/* Confused question marks */}
            <div className="absolute top-1 left-8 text-muted-foreground/30 text-2xl font-serif select-none">?</div>
            <div className="absolute top-7 left-3 text-muted-foreground/20 text-lg font-serif select-none">?</div>
          </div>
          <p className="text-sm text-muted-foreground italic leading-relaxed">
            Before. Most people make at least one wasted trip.
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
        <div className="flex-1 flex flex-col items-center text-center px-8 py-10">
          <div className="relative w-72 h-64 mb-8">
            {/* Counter desk */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-56 h-20 bg-muted/60 rounded-xl border border-border shadow-sm" />
            
            {/* Person walking away confidently */}
            <div className="absolute bottom-16 left-[55%] -translate-x-1/2 flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-primary/15 border-2 border-primary/30 flex items-center justify-center">
                <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                </svg>
              </div>
              <div className="w-10 h-16 bg-primary/10 rounded-lg mt-1 border border-primary/20" />
            </div>

            {/* CPF form with green approval */}
            <div className="absolute top-2 right-2 bg-card border border-primary/20 rounded-xl p-3 shadow-lg w-28">
              <div className="text-[9px] font-bold text-muted-foreground mb-1.5">CPF Form</div>
              <div className="space-y-1">
                <div className="h-1.5 bg-primary/20 rounded w-full" />
                <div className="h-1.5 bg-primary/20 rounded w-3/4" />
                <div className="h-1.5 bg-primary/20 rounded w-5/6" />
              </div>
              <div className="mt-2 flex items-center gap-1">
                <span className="text-primary font-bold text-xs">✓</span>
                <span className="text-[8px] text-primary font-semibold">APPROVED</span>
              </div>
            </div>

            {/* Phone with Nubank app open */}
            <div className="absolute top-6 left-2 bg-card border border-border rounded-xl p-2.5 shadow-lg w-24">
              <div className="flex items-center gap-1 mb-1.5">
                <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3" />
                </svg>
                <span className="text-[9px] font-bold text-primary">Nubank</span>
              </div>
              <div className="bg-primary/10 rounded-md p-1.5">
                <div className="text-[8px] text-primary font-semibold">Welcome! 🎉</div>
                <div className="text-[7px] text-muted-foreground mt-0.5">Account ready</div>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground italic leading-relaxed">
            After. Our users are done in one visit.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Transformation;
