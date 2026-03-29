import { useState } from "react";

const faqs = [
  { q: "What exactly do I get for $49?", a: "A personalized Ready Pack containing: a pre-filled form guide, the correct Receita Federal office for your state, a Portuguese cheat sheet, document checklist, and step-by-step instructions. Everything you need to walk in and walk out with your CPF." },
  { q: "Do you actually issue the CPF?", a: "No. Only the Brazilian Federal Revenue Service (Receita Federal) can issue a CPF. We provide expert guidance and document preparation to make sure your application is complete and submitted to the right place. The CPF itself is free — our fee covers the preparation service." },
  { q: "Is it really free to get a CPF?", a: "Yes. The Brazilian government charges nothing for CPF registration at Receita Federal offices. Partner agencies (banks, post offices) charge a small R$7 (~$1.50) convenience fee. Our service fee is for the guidance that ensures your application succeeds on the first try." },
  { q: "How long does it take to get my CPF?", a: "If you go to a Receita Federal office in person (which we recommend), you can often get it the same day. The email method takes 3-7 business days but is less reliable. Our Ready Pack tells you the fastest option based on your location." },
  { q: "I'm not in Brazil yet. Can I still get a CPF?", a: "Yes. You can apply through a Brazilian consulate or embassy in your country. We recommend doing this before you travel so you'll have your CPF ready when you land — meaning you can immediately buy a SIM card, use Pix, and access all services." },
  { q: "What about my personal data?", a: "We collect only what's needed to generate your Ready Pack. Sensitive data like passport numbers is used solely to create your personalized documents and is not stored after your session. We never sell or share your information." },
  { q: "What if my application gets rejected?", a: "Our system validates your documents and information before you submit, catching the most common rejection reasons. If you do get rejected, our Ready Pack includes troubleshooting guidance, and Concierge plan users get direct support to resolve the issue." },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 px-8 max-w-[700px] mx-auto">
      <div className="text-xs uppercase tracking-[3px] text-primary font-bold mb-4">FAQ</div>
      <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tight">Common questions</h2>
      <div className="mt-8">
        {faqs.map((faq, i) => (
          <div key={i} className="border-b border-border py-5">
            <button
              className="w-full flex justify-between items-center text-left font-semibold text-foreground"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              {faq.q}
              <span className={`text-lg text-muted-foreground transition-transform shrink-0 ml-4 ${openIndex === i ? "rotate-45 text-primary" : ""}`}>
                +
              </span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 text-sm text-muted-foreground leading-relaxed ${openIndex === i ? "max-h-[300px] pt-3" : "max-h-0"}`}>
              {faq.a}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
