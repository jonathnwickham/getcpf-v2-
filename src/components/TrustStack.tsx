import founderPhoto from "@/assets/founder-jonathan.jpg";

const trustBadges = [
  { icon: "🔒", text: "Your data stays private" },
  { icon: "📋", text: "Based on official government rules" },
  { icon: "🌍", text: "Works wherever you are" },
  { icon: "⚡", text: "Ready when you are" },
];

const TrustStack = () => (
  <section className="py-20 px-6 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
    <div className="max-w-[900px] mx-auto">
      <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tight text-center mb-12">
        Zero risk. Full refund if it does not work.
      </h2>

      <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12">
        {/* Founder photo */}
        <img
          src={founderPhoto}
          alt="Jonathan Wickham, founder of GET CPF"
          className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover shrink-0 border-2 border-primary/20 mx-auto md:mx-0"
          style={{ objectPosition: "center 42%" }}
        />

        {/* Quote */}
        <div>
          <blockquote className="text-sm text-muted-foreground leading-relaxed space-y-4">
            <p>
              "I fell in love with Brazil and when I needed my CPF, I spent days jumping between government sites, Reddit threads, and AI tools that each gave me half the answer. So I documented every step, built it into a tool, and got my CPF on my first try. Now you get the version I wish I had. If you follow the steps and still get rejected, I'll refund you in full — no questions asked."
            </p>
          </blockquote>
          <p className="mt-4 text-sm font-semibold text-foreground">
            — Jonathan Wickham, 🇿🇦 South African · São Paulo
          </p>
        </div>
      </div>

      {/* Trust badges */}
      <div className="flex justify-center gap-8 md:gap-12 flex-wrap mt-12 pt-8 border-t border-border/50">
        {trustBadges.map((item) => (
          <div key={item.text} className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <span className="text-lg">{item.icon}</span> {item.text}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustStack;
