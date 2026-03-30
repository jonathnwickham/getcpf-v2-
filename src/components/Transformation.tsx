import { X, CheckCircle, Smartphone, FileText, User } from "lucide-react";

const Transformation = () => {
  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-[900px] mx-auto flex flex-col md:flex-row items-center gap-0">
        {/* Before */}
        <div className="flex-1 flex flex-col items-center text-center px-6 py-10">
          <div className="relative w-48 h-48 mb-6">
            {/* Counter desk */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-16 bg-muted rounded-lg border border-border" />
            {/* Person */}
            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-muted-foreground/20 flex items-center justify-center">
                <User className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="w-8 h-14 bg-muted-foreground/15 rounded-md mt-1" />
            </div>
            {/* Document with red X */}
            <div className="absolute top-4 right-2 bg-card border border-border rounded-lg p-2 shadow-md">
              <FileText className="w-5 h-5 text-muted-foreground" />
              <X className="w-4 h-4 text-destructive absolute -top-1 -right-1" />
            </div>
            {/* Confused marks */}
            <div className="absolute top-2 left-6 text-muted-foreground/40 text-lg font-bold">?</div>
            <div className="absolute top-6 left-2 text-muted-foreground/30 text-sm font-bold">?</div>
          </div>
          <p className="text-sm text-muted-foreground italic">
            Before. Most people make at least one wasted trip.
          </p>
        </div>

        {/* Divider with flag */}
        <div className="hidden md:flex flex-col items-center h-64">
          <div className="flex-1 w-px bg-border" />
          <span className="text-2xl my-3">🇧🇷</span>
          <div className="flex-1 w-px bg-border" />
        </div>
        {/* Mobile divider */}
        <div className="flex md:hidden items-center gap-4 py-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-2xl">🇧🇷</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* After */}
        <div className="flex-1 flex flex-col items-center text-center px-6 py-10">
          <div className="relative w-48 h-48 mb-6">
            {/* Counter desk */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-16 bg-muted rounded-lg border border-border" />
            {/* Person walking away (shifted right) */}
            <div className="absolute bottom-14 left-[60%] -translate-x-1/2 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div className="w-8 h-14 bg-primary/15 rounded-md mt-1" />
            </div>
            {/* Document with green check */}
            <div className="absolute top-4 right-2 bg-card border border-primary/20 rounded-lg p-2 shadow-md">
              <FileText className="w-5 h-5 text-primary" />
              <CheckCircle className="w-4 h-4 text-primary absolute -top-1 -right-1" />
            </div>
            {/* Phone with Nubank */}
            <div className="absolute top-8 left-4 bg-card border border-border rounded-lg px-2 py-1.5 shadow-md flex items-center gap-1">
              <Smartphone className="w-4 h-4 text-primary" />
              <span className="text-[9px] font-bold text-primary">Nubank</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground italic">
            After. Our users are done in one visit.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Transformation;
