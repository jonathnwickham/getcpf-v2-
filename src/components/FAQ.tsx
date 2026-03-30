import { useState, useEffect } from "react";

const faqs = [
  { q: "What exactly do I get for $49?", a: "Everything you need to walk into a Receita Federal office and walk out with your CPF. A personalised Ready Pack with pre-filled forms, the right office for your state, a Portuguese cheat sheet so you know what to say, a document checklist, and a step-by-step day-of guide. Plus a rejection troubleshooter and a full 'Life in Brazil' guide for after you get your CPF." },
  { q: "Do you actually issue the CPF?", a: "No, only the Brazilian government does that. We make sure you show up with the right documents, at the right office, with everything filled in correctly. That's what the $49 covers: preparation that works first time." },
  { q: "Is it really free to get a CPF?", a: "The CPF itself costs R$7 at Correios or nothing at the Receita Federal office. Either way, under $2 USD. You're paying us $49 to make sure that when you go in, it works." },
  { q: "How long does the whole thing take?", a: "The questionnaire takes about 5 minutes. Then you visit the office. Most people walk out with their CPF number the same day, usually within an hour. If you can't go in person, the email method works too but takes 3 to 7 business days." },
  { q: "I'm not in Brazil yet. Can I start now?", a: "Yes. Start the questionnaire now and have everything ready before you land. When you arrive, you just print your documents and visit the office. Some people even do it through their local Brazilian consulate before travelling." },
  { q: "Is my data safe?", a: "Your data is stored securely in your account so you can access your Ready Pack anytime. We use encryption at rest and in transit, and we never sell or share your personal information. See our Privacy Policy for full details." },
  { q: "What if I get rejected?", a: "We've built a full rejection troubleshooter into the app. Tell us what happened and we'll give you the exact fix, whether it's a mother's name abbreviation, a wrong proof of address, or an office that doesn't process foreigners. Most rejections have a one-visit fix." },
  { q: "What do you do with my passport and personal documents?", a: "Your documents are used only to prepare your CPF application. We use encryption to protect sensitive fields. All personal data is permanently deleted from our systems within 30 days, or immediately if you request it. We never sell or share your data with anyone. You can read our full Privacy Policy for details." },
  { q: "How does the money-back guarantee actually work?", a: "Simple. If you follow our preparation steps exactly, bring the documents we specify, go to the office we recommend, use the form we generate, and your CPF application is still rejected, email support@getcpf.com. We will refund your $49 within 24 hours. No forms. No questions." },
  { q: "Does this work for my nationality?", a: "GET CPF works for foreigners from over 50 countries. The preparation varies by nationality and visa type, which is why we ask for your nationality during signup and personalise your Ready Pack accordingly. If you have a valid passport and are in Brazil or planning to visit, you can get a CPF." },
];

const FAQ = () => {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set([0, 1]));

  // Inject FAQ JSON-LD schema
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a,
        },
      })),
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);
    script.id = "faq-schema";
    document.head.appendChild(script);
    return () => { document.getElementById("faq-schema")?.remove(); };
  }, []);

  return (
    <section id="faq" className="py-24 px-8 max-w-[700px] mx-auto">
      <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tight">Things you're probably wondering</h2>
      <div className="mt-8">
        {faqs.map((faq, i) => (
          <div key={i} className="border-b border-border py-5">
            <button
              className="w-full flex justify-between items-center text-left font-semibold text-foreground"
              onClick={() => setOpenIndices(prev => { const next = new Set(prev); if (next.has(i)) next.delete(i); else next.add(i); return next; })}
            >
              {faq.q}
              <span className={`text-lg text-muted-foreground transition-transform shrink-0 ml-4 ${openIndices.has(i) ? "rotate-45 text-primary" : ""}`}>
                +
              </span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 text-sm text-muted-foreground leading-relaxed ${openIndices.has(i) ? "max-h-[300px] pt-3" : "max-h-0"}`}>
              {faq.a}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
