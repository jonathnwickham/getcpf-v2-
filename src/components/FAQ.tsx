import { useState, useEffect } from "react";

const faqs = [
  { q: "What exactly do I get for $29?", a: "Everything you need to walk into a Receita Federal office and walk out with your CPF. A personalised Ready Pack with pre-filled forms, the right office for your state, a Portuguese cheat sheet so you know what to say, a document checklist, and a step-by-step day-of guide. Plus a rejection troubleshooter and a full 'Life in Brazil' guide for after you get your CPF." },
  { q: "Why should I pay $29 when CPF registration is free?", a: "You're right — the CPF itself is free at the Receita Federal (or R$7 at Correios). We don't charge for the CPF. We charge for the preparation that makes your visit work first time. About one in five foreigners gets rejected on their first attempt because of a wrong office, a name formatting issue, or an invalid proof of address. Each failed visit costs you half a day. The $29 beta price covers pre-filled forms, the correct office for your city, a Portuguese cheat sheet, and a document checker — so you go once, and it works. If it doesn't, we refund you." },
  { q: "Does this work for my nationality?", a: "GET CPF works for foreigners from over 50 countries. The preparation varies by nationality and visa type, which is why we ask for your nationality during signup and personalise your Ready Pack accordingly. If you have a valid passport and are in Brazil or planning to visit, you can get a CPF." },
  { q: "What if I get rejected?", a: "We've built a full rejection troubleshooter into the app. Tell us what happened and we'll give you the exact fix, whether it's a mother's name abbreviation, a wrong proof of address, or an office that doesn't process foreigners. Most rejections have a one-visit fix." },
  { q: "Is my data safe?", a: "Yes. Only you can access your own data — every row in the database is locked to your account. Sensitive information like your passport number is automatically and permanently deleted within 48 hours of your CPF being delivered. Every consent action is logged immutably. You can download or delete all of your data at any time from your dashboard. We never sell or share your personal information." },
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
              className="w-full flex justify-between items-center text-left font-semibold text-foreground min-h-[48px] py-3"
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
