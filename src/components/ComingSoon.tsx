import { Link } from "react-router-dom";

const upcoming = [
  { emoji: "🛂", title: "Digital Nomad Visa", desc: "Step-by-step guide to Brazil's digital nomad visa. Requirements, documents, and where to apply." },
  { emoji: "📚", title: "Student Visa", desc: "Everything you need to get a student visa for Brazilian universities, from enrollment letters to consulate appointments." },
  { emoji: "⏳", title: "Visa Extensions", desc: "How to extend your tourist visa without leaving the country. Polícia Federal process, documents, and timelines." },
  { emoji: "🪪", title: "RG (Identity Card)", desc: "Once you have residency, you'll need an RG. We'll walk you through the full process." },
  { emoji: "🏥", title: "SUS (Public Healthcare)", desc: "How to register for Brazil's free public health system. For foreigners and Brazilians alike." },
  { emoji: "🚗", title: "CNH (Driver's Licence)", desc: "Convert your foreign licence or get a Brazilian one from scratch. Every step, every document." },
  { emoji: "📄", title: "CTPS (Work Card)", desc: "Need to work formally in Brazil? We'll guide you through getting your digital work card." },
  { emoji: "🏦", title: "Opening a Bank Account", desc: "Which banks accept foreigners, what documents you need, and how to get approved on the first try." },
];

const ComingSoon = () => (
  <section className="py-24 px-8 bg-card border-t border-border">
    <div className="max-w-[900px] mx-auto">
      <div className="text-xs uppercase tracking-[3px] text-primary font-bold mb-4">Coming soon</div>
      <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tight">
        CPF is just the beginning
      </h2>
      <p className="text-muted-foreground mt-4 max-w-[600px] text-sm leading-relaxed">
        We're building the one place anyone in Brazil goes to sort out documents, visas, and bureaucracy. Whether you're a foreigner navigating the system for the first time or a Brazilian who's tired of jumping through hoops. Here's what's next.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
        {upcoming.map((item) => (
          <div
            key={item.title}
            className="bg-secondary border border-border rounded-2xl p-6 opacity-80 hover:opacity-100 transition-all"
          >
            <div className="text-3xl mb-3">{item.emoji}</div>
            <h3 className="font-bold text-base mb-1.5">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Affiliate CTA */}
      <div className="mt-16 bg-secondary border border-border rounded-2xl p-8 md:p-10 text-center">
        <div className="text-3xl mb-3">🤝</div>
        <h3 className="font-bold text-xl mb-2">Help us spread the word</h3>
        <p className="text-sm text-muted-foreground max-w-[500px] mx-auto leading-relaxed mb-6">
          Run a blog, YouTube channel, or community for expats and travellers in Brazil? 
          We're looking for affiliates who genuinely care about helping foreigners navigate the system.
        </p>
        <Link
          to="/affiliates/apply"
          className="inline-block bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-md shadow-primary/20"
        >
          Apply to become an affiliate →
        </Link>
        <p className="text-xs text-muted-foreground mt-3">
          We review every application personally. Earn commission on every referral.
        </p>
      </div>
    </div>
  </section>
);

export default ComingSoon;
