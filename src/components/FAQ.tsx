import { useState } from "react";

const faqs = [
  { q: "What exactly do I get for $79?", a: "A personalized AI consultation that determines your exact CPF application path, plus a downloadable Ready Pack PDF containing: a form field guide with your data mapped to each Portuguese field, the correct regional email address, a pre-written Portuguese email template, a document checklist, and if you're doing it in-person, the nearest recommended office with tips. It's everything you need to submit a successful application on the first try." },
  { q: "Do you actually issue the CPF?", a: "No. Only the Brazilian Federal Revenue Service (Receita Federal) can issue a CPF. We provide AI-powered guidance and document preparation to make sure your application is complete, accurate, and submitted to the right place. The CPF itself is free — our fee covers the consultation and preparation service." },
  { q: "Is it really free to get a CPF?", a: "Yes. The Brazilian government charges nothing for CPF registration at Receita Federal offices or consulates. Partner agencies (banks, post offices) charge a small R$7 (~$1.50) convenience fee. Our service fee is for the AI-powered guidance that ensures your application succeeds — not for the CPF number itself." },
  { q: "How long does it take to get my CPF after submitting?", a: "If you use the email method, typically 3-7 business days. If you go to a Receita Federal office in person, you can often get it the same day or within 1-2 days. Our Ready Pack tells you the fastest option based on your specific location and situation." },
  { q: "I'm not in Brazil yet. Can I still get a CPF?", a: "Yes. You can apply through a Brazilian consulate or embassy in your country, or via email to the Receita Federal. We recommend doing this before you travel — it means you'll have your CPF ready when you land, so you can immediately buy a SIM card, use Pix, and access all services." },
  { q: "What about my personal data?", a: "We collect only what's needed to generate your Ready Pack (name, nationality, location). Sensitive data like passport numbers and parent names are used solely to create your personalized documents and are not stored after your session. We never sell or share your information." },
  { q: "What if my application gets rejected?", a: "Our AI validates your documents and information before you submit, catching the most common rejection reasons (blurry photos, name mismatches, wrong email address). If you do get rejected, our Ready Pack includes troubleshooting guidance, and Concierge plan users get direct support to resolve the issue." },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 px-8 max-w-[700px] mx-auto">
      <div className="text-xs uppercase tracking-[3px] text-primary font-semibold mb-4">FAQ</div>
      <div className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tight">Common questions</div>
      <div className="mt-8">
        {faqs.map((faq, i) => (
          <div key={i} className="border-b border-foreground/[0.06] py-5">
            <button
              className="w-full flex justify-between items-center text-left font-semibold"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              {faq.q}
              <span className={`text-lg text-text-tertiary transition-transform ${openIndex === i ? "rotate-45 text-primary" : ""}`}>
                +
              </span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 text-sm text-text-secondary leading-relaxed ${openIndex === i ? "max-h-[300px] pt-3" : "max-h-0"}`}>
              {faq.a}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
