import { useState } from "react";

const faqs = [
  { q: "What exactly do I get for $49?", a: "Everything you need to walk into a Receita Federal office and walk out with your CPF. A personalised Ready Pack with pre-filled forms, the right office for your state, a Portuguese cheat sheet so you know what to say, a document checklist, and a step-by-step day-of guide. Plus a rejection troubleshooter and a full 'Life in Brazil' guide for after you get your CPF." },
  { q: "Do you actually issue the CPF?", a: "No — only the Brazilian government does that. We make sure you show up with the right documents, at the right office, with everything filled in correctly. That's what the $49 covers: preparation that works first time." },
  { q: "Is it really free to get a CPF?", a: "Yes. The government charges nothing at Receita Federal offices. Some partner agencies (post offices, banks) charge a small R$7 fee. Our fee is for the preparation that saves you hours of research and avoids rejected applications." },
  { q: "How long does the whole thing take?", a: "The questionnaire takes about 5 minutes. Then you visit the office — most people walk out with their CPF number the same day, usually within an hour. If you can't go in person, the email method works too but takes 3–7 business days." },
  { q: "I'm not in Brazil yet — can I start now?", a: "Absolutely. Start the questionnaire now and have everything ready before you land. When you arrive, you just print your documents and visit the office. Some people even do it through their local Brazilian consulate before travelling." },
  { q: "Is my data safe?", a: "Your data is stored securely in your account so you can access your Ready Pack anytime. We use encryption at rest and in transit, and we never sell or share your personal information. See our Privacy Policy for full details." },
  { q: "What if I get rejected?", a: "We've built a full rejection troubleshooter into the app. Tell us what happened and we'll give you the exact fix — whether it's a mother's name abbreviation, a wrong proof of address, or an office that doesn't process foreigners. Most rejections have a one-visit fix." },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 px-8 max-w-[700px] mx-auto">
      <div className="text-xs uppercase tracking-[3px] text-primary font-bold mb-4">FAQ</div>
      <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tight">Things you're probably wondering</h2>
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
