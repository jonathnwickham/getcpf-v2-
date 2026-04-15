import { useState, useEffect } from "react";

const faqs = [
  { q: "What exactly do I get for $29?", a: "Everything you need to walk into a Receita Federal office and walk out with your CPF. A personalised Ready Pack with pre-filled forms, the right office for your state, a Portuguese cheat sheet, a document checklist, a step-by-step day-of guide, a rejection troubleshooter, and a full \"Life in Brazil\" guide." },
  { q: "Why should I pay $29 when CPF registration is free?", a: "The CPF itself is free (or R$7 at Correios). We charge for the preparation. About one in five foreigners gets rejected because of a wrong office, a name formatting issue, or an invalid proof of address. The $29 covers pre-filled forms, the correct office, a Portuguese cheat sheet, and a document checker. So you go once, and it works." },
  { q: "Does this work for my nationality?", a: "GET CPF works for foreigners from over 50 countries. We personalise your Ready Pack based on your nationality and visa type. If you have a valid passport and are in Brazil or planning to visit, you can get a CPF." },
  { q: "What if I get rejected?", a: "We've built a rejection troubleshooter. Most rejections have a one-visit fix. And if you followed our steps and still got rejected, full refund, no questions." },
  { q: "Is my data safe?", a: "Yes. Every row is locked to your account. Sensitive info like your passport number is permanently deleted within 48 hours. We never sell or share your information." },
];

const FAQ = () => {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set([0, 1]));

  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": { "@type": "Answer", "text": faq.a },
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
    <section id="faq" className="py-24 sm:py-32 px-5 sm:px-8 bg-white rounded-2xl mx-3 sm:mx-6 mb-3">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Things you're probably wondering</h2>
        <div className="mt-12 divide-y divide-gray-100">
          {faqs.map((faq, i) => (
            <div key={i} className="py-6">
              <button
                className="w-full flex justify-between items-center text-left font-semibold text-gray-900 min-h-[48px]"
                onClick={() => setOpenIndices(prev => { const next = new Set(prev); if (next.has(i)) next.delete(i); else next.add(i); return next; })}
              >
                {faq.q}
                <span className={`text-lg text-gray-400 transition-transform shrink-0 ml-4 ${openIndices.has(i) ? "rotate-45 text-green-800" : ""}`}>
                  +
                </span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 text-sm text-gray-500 leading-relaxed ${openIndices.has(i) ? "max-h-[400px] pt-4" : "max-h-0"}`}>
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
