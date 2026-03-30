const Transformation = () => {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-[960px] mx-auto flex flex-col md:flex-row items-stretch gap-0">
        {/* Before */}
        <div className="flex-1 flex flex-col items-center text-center px-8 py-10">
          <div className="relative w-64 h-56 mb-8">
            {/* Counter desk */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-52 h-20 bg-muted/60 rounded-xl border border-border shadow-sm" />
            
            {/* Person at counter */}
            <div className="absolute bottom-16 left-[38%] -translate-x-1/2 flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-muted border-2 border-border flex items-center justify-center">
                <svg className="w-7 h-7 text-muted-foreground/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                </svg>
              </div>
              <div className="w-10 h-16 bg-muted/80 rounded-lg mt-1 border border-border/50" />
            </div>

            {/* Document with red X */}
            <div className="absolute top-6 right-6 bg-card border border-border rounded-xl px-3 py-2.5 shadow-lg flex items-center gap-2">
              <svg className="w-5 h-5 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <span className="text-destructive font-bold text-sm">✕</span>
            </div>

            {/* Confused question marks */}
            <div className="absolute top-3 left-10 text-muted-foreground/30 text-2xl font-serif select-none">?</div>
            <div className="absolute top-8 left-4 text-muted-foreground/20 text-lg font-serif select-none">?</div>
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
          <div className="relative w-64 h-56 mb-8">
            {/* Counter desk */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-52 h-20 bg-muted/60 rounded-xl border border-border shadow-sm" />
            
            {/* Person walking away (shifted right, confident) */}
            <div className="absolute bottom-16 left-[55%] -translate-x-1/2 flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-primary/15 border-2 border-primary/30 flex items-center justify-center">
                <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                </svg>
              </div>
              <div className="w-10 h-16 bg-primary/10 rounded-lg mt-1 border border-primary/20" />
            </div>

            {/* Document with green check */}
            <div className="absolute top-6 right-4 bg-card border border-primary/20 rounded-xl px-3 py-2.5 shadow-lg flex items-center gap-2">
              <svg className="w-5 h-5 text-primary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <span className="text-primary font-bold text-sm">✓</span>
            </div>

            {/* Phone showing Nubank */}
            <div className="absolute top-10 left-4 bg-card border border-border rounded-xl px-3 py-2 shadow-lg flex items-center gap-1.5">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3" />
              </svg>
              <span className="text-xs font-bold text-primary">Nubank</span>
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
