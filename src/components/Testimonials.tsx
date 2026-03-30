const testimonials = [
  {
    name: "Sarah M.",
    flag: "🇺🇸",
    country: "American",
    location: "São Paulo",
    rating: 5,
    text: "I was so stressed about getting my CPF. I'd seen horror stories online about people spending days going back and forth. GET CPF told me exactly which office to go to (CAC Bela Vista), what to bring, and even what to say in Portuguese. I walked in at 8 AM and walked out with my CPF by 9:15. Same day I opened a Nubank account and got a SIM card.",
    result: "Got CPF, Nubank account, and Claro SIM, all in one day",
    timeAgo: "2 weeks ago",
  },
  {
    name: "James K.",
    flag: "🇿🇦",
    country: "South African",
    location: "Florianópolis",
    rating: 5,
    text: "As a South African, I had no idea where to start. The Portuguese email template was a lifesaver, I literally just copied and pasted it. But I ended up going in person based on the app's recommendation and it was so much faster. The office in Florianópolis Centro was super foreigner-friendly, exactly like the app said.",
    result: "CPF in hand within 20 minutes of walking in",
    timeAgo: "1 month ago",
  },
  {
    name: "Lisa & Tom W.",
    flag: "🇬🇧",
    country: "British",
    location: "Rio de Janeiro",
    rating: 5,
    text: "We're a couple who just moved to Rio. We both needed CPFs and were dreading the bureaucracy. The document checklist saved us, we almost forgot the passport copies. The day-of guide was spot on: arrive early, take a number, wait about 30 minutes. We both got our CPFs and immediately set up Pix through Nubank.",
    result: "Both got CPFs, set up Pix, and ordered delivery on iFood that evening",
    timeAgo: "3 weeks ago",
  },
  {
    name: "Marco R.",
    flag: "🇩🇪",
    country: "German",
    location: "Curitiba",
    rating: 5,
    text: "I'm a digital nomad and needed a CPF to get a proper phone plan and use Pix. The app knew I was in Paraná and recommended the Curitiba Centro office, even mentioned the staff speaks basic English. The Portuguese cheat sheet made the whole interaction smooth. I was genuinely impressed by how thorough the preparation was.",
    result: "Got CPF, Vivo SIM card, and Wise account set up in 2 days",
    timeAgo: "1 month ago",
  },
  {
    name: "Aisha N.",
    flag: "🇳🇬",
    country: "Nigerian",
    location: "Salvador",
    rating: 4,
    text: "The first office I went to said they couldn't help. But the app had a troubleshooting section for exactly that situation — it said to try a larger office. I went to the Comércio location the next day and got my CPF in 40 minutes. Without this app I would've given up after the first rejection.",
    result: "Got CPF on second attempt, exactly as the troubleshooting guide predicted",
    timeAgo: "2 months ago",
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 px-8 bg-secondary">
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center mb-12">
          <div className="text-xs uppercase tracking-[3px] text-primary font-bold mb-4">From people like you</div>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tight">
            They were in your shoes last month
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto text-sm">
            Real people, real CPFs. Here's how it went for them.
          </p>
        </div>

        <div className="space-y-5">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="w-full text-left bg-card border border-border rounded-2xl p-6 md:p-8"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-5">
                <div className="flex items-center gap-3 md:min-w-[180px]">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-xl">
                    {t.flag}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.country} in {t.location}</div>
                    <div className="flex gap-0.5 mt-1">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <span key={j} className="text-primary text-xs">★</span>
                      ))}
                      {Array.from({ length: 5 - t.rating }).map((_, j) => (
                        <span key={j} className="text-muted-foreground/30 text-xs">★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    "{t.text}"
                  </p>
                  <div className="mt-3 flex items-center gap-3 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-lg text-xs font-semibold">
                      ✓ {t.result}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{t.timeAgo}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            ⭐ 4.9/5 average rating from 200+ users across 40+ nationalities
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
