import founderPhoto from "@/assets/founder-jonathan.jpg";
import { Shield } from "lucide-react";

const Testimonials = () => {
  return (
    <section className="py-24 px-8 bg-secondary">
      <div className="max-w-[700px] mx-auto">
        <div className="text-center mb-10">
          <div className="text-xs uppercase tracking-[3px] text-primary font-bold mb-4">Our guarantee</div>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tight">
            Zero risk. Full refund if it does not work.
          </h2>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 md:p-10 text-center">
          <img
            src={founderPhoto}
            alt="Jonathan Wickham, founder of GET CPF"
            className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-2 border-primary/20"
            style={{ objectPosition: "center 42%" }}
          />
          <div className="font-bold text-base mb-1">Jonathan Wickham</div>
          <div className="text-xs text-muted-foreground mb-6">🇿🇦 South African · São Paulo</div>

          <blockquote className="text-sm text-muted-foreground leading-relaxed italic max-w-[520px] mx-auto">
            "I built this because I needed it myself and could not find anything like it. If you follow the steps and still get rejected at the counter, I will refund you in full. No questions, no process, no waiting. That is my personal guarantee."
          </blockquote>

          <div className="flex items-center justify-center gap-2 mt-6 text-primary">
            <Shield className="w-5 h-5" />
            <span className="text-sm font-semibold">Full refund guarantee, backed by the founder personally</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Reviews coming soon. Be one of our first users.
        </p>
      </div>
    </section>
  );
};

export default Testimonials;
