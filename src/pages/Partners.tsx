import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCpfCount } from "@/hooks/use-cpf-count";
import { Star, Users, Gift, Megaphone, ArrowRight, Shield } from "lucide-react";

const partnerQuotes = [
  {
    quote: "My students ask me about CPFs every week. Now I just send them to GET CPF. They come back to the next lesson already sorted.",
    name: "Ana Paula",
    role: "Portuguese tutor, São Paulo",
  },
  {
    quote: "Every family we enrol needs a CPF before they can complete the paperwork. GET CPF solved that for us.",
    name: "Admissions coordinator",
    role: "International school, Rio",
  },
  {
    quote: "I used to spend 30 minutes explaining the CPF process to every new guest. Now I hand them a link.",
    name: "Community manager",
    role: "Co-living space, Florianópolis",
  },
];

const partnerBenefits = [
  {
    icon: Shield,
    title: "Credibility by association",
    desc: "Recommending GET CPF tells your students and clients 'I know how Brazil works.' It elevates your reputation at zero cost.",
  },
  {
    icon: Megaphone,
    title: "A confident answer to the CPF question",
    desc: "No more shrugging or saying 'go to the Receita Federal.' You have a specific, helpful answer every time.",
  },
  {
    icon: Star,
    title: "A badge for your marketing",
    desc: "'Official GET CPF Partner' on your Instagram bio or website differentiates you from everyone else in your space.",
  },
  {
    icon: Gift,
    title: "We send customers to you",
    desc: "In our post-CPF guide, we recommend our partners directly. Every foreigner who gets their CPF through us sees your name.",
  },
];

const PartnerBenefitsSection = () => (
<section className="py-10 md:py-12 px-6">
    <div className="max-w-[800px] mx-auto">
      <div className="text-xs uppercase tracking-[3px] text-primary font-bold mb-4 text-center">Beyond the commission</div>
      <h2 className="text-2xl font-bold tracking-tight mb-4 text-center">What partners actually get</h2>
      <p className="text-sm text-muted-foreground text-center mb-12 max-w-[500px] mx-auto">
        The commission gets you to listen. Here's what makes you stay.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {partnerBenefits.map((b) => (
          <div key={b.title} className="bg-card border border-border rounded-2xl p-6">
            <b.icon className="w-5 h-5 text-primary mb-3" />
            <h3 className="font-bold text-sm mb-1">{b.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FoundingPartnerSection = () => (
  <section className="py-12 md:py-16 px-6 bg-primary/5 border-y border-primary/15">
    <div className="max-w-[700px] mx-auto text-center">
      <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-bold uppercase tracking-[2px] px-4 py-1.5 rounded-full mb-6">
        <Users className="w-3.5 h-3.5" />
        Limited to 20 spots
      </div>
      <h2 className="text-2xl font-bold tracking-tight mb-4">Founding Partners</h2>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-[520px] mx-auto mb-8">
        The first 20 partners get a permanent, higher commission rate, named placement on our website, 
        first access to every new product we launch, and a direct line to us. After 20, the terms change.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
        {[
          { label: "20% commission", desc: "You earn 20% of every sale — that's $9.80 per referral, locked in permanently" },
          { label: "Named on the site", desc: "Your name, logo, and one-line bio featured on the partners page" },
          { label: "First access", desc: "Digital nomad visa guide, CNH guide, RG guide — you promote it first" },
        ].map((item) => (
          <div key={item.label} className="bg-background border border-border rounded-xl p-4">
            <div className="text-sm font-bold mb-1">{item.label}</div>
            <div className="text-xs text-muted-foreground leading-relaxed">{item.desc}</div>
          </div>
        ))}
      </div>
      <a href="#join" className="inline-flex items-center gap-1 text-sm font-bold text-primary mt-8 hover:underline">
        Apply for a founding spot <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  </section>
);

const Partners = () => {
  const [form, setForm] = useState({ name: "", email: "", business: "", city: "", why: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const cpfCount = useCpfCount();

  const cities = [
    { name: "São Paulo", state: "SP", emoji: "🏙️" },
    { name: "Rio de Janeiro", state: "RJ", emoji: "🏖️" },
    { name: "Florianópolis", state: "SC", emoji: "🌊" },
    { name: "Curitiba", state: "PR", emoji: "🌲" },
    { name: "Salvador", state: "BA", emoji: "🎭" },
    { name: "Recife", state: "PE", emoji: "🌴" },
    { name: "Brasília", state: "DF", emoji: "🏛️" },
    { name: "Belo Horizonte", state: "MG", emoji: "⛰️" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    setSubmitting(true);

    const { error } = await supabase.from("affiliate_applications").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      platform: form.business.trim() || null,
      situation: form.city.trim() || null,
      motivation: form.why.trim() || null,
    });

    setSubmitting(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
    } else {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-[900px] mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/"><Logo className="h-10" /></Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to homepage
          </Link>
        </div>
      </nav>

      {/* Hero / Mission */}
      <section className="py-14 md:py-20 px-6">
        <div className="max-w-[700px] mx-auto">
          <div className="text-xs uppercase tracking-[3px] text-primary font-bold mb-4">Partner with us</div>
          <h1 className="text-[clamp(2rem,5vw,3.2rem)] font-bold tracking-tight leading-[1.1]">
            We're making Brazil easier to arrive in.
          </h1>
          <p className="text-lg text-muted-foreground mt-6 leading-relaxed">One CPF at a time.</p>
          <div className="mt-8 inline-flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-xl px-5 py-3">
            <span className="text-2xl">💰</span>
            <div>
              <div className="text-sm font-bold text-primary">Earn 20% commission — $9.80 per referral</div>
              <div className="text-xs text-muted-foreground">Paid monthly. No caps. No catches.</div>
            </div>
          </div>

          <div className="mt-12 space-y-6 text-[15px] text-muted-foreground leading-relaxed">
             <p>
               Brazil is one of the most welcoming countries in the world. But the systems can be confusing 
               for someone who is not from here. We are building the thing that changes that, starting with the CPF.
             </p>
            <p>
              If you work with foreigners in Brazil, whether you teach them Portuguese, help them find an apartment, 
              translate their documents, or pick them up from the airport, you already know the CPF question. 
              You have answered it dozens of times. Now there is a better answer to give them.
            </p>
          </div>
        </div>
      </section>

      {/* What partners actually get */}
      <PartnerBenefitsSection />

      {/* Founding partner tier */}
      <FoundingPartnerSection />

      {/* What partners are saying */}
      <section className="py-16 px-6 bg-secondary border-y border-border">
        <div className="max-w-[900px] mx-auto">
          <div className="text-xs uppercase tracking-[3px] text-primary font-bold mb-8 text-center">What partners are saying</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {partnerQuotes.map((q) => (
              <div key={q.name} className="bg-card border border-border rounded-2xl p-6">
                <p className="text-sm text-foreground leading-relaxed italic">"{q.quote}"</p>
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="text-sm font-bold">{q.name}</div>
                  <div className="text-xs text-muted-foreground">{q.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works for partners */}
      <section className="py-20 px-6">
        <div className="max-w-[700px] mx-auto">
          <h2 className="text-2xl font-bold tracking-tight mb-8">How it works</h2>
          <div className="space-y-6">
            {[
              { step: "1", title: "Join the network", desc: "Fill in the form below. We review every application personally." },
              { step: "2", title: "Get your referral link", desc: "We set you up with a unique link and promo code for your students, clients, or community." },
              { step: "3", title: "Earn 20% on every referral", desc: "Every time someone you refer gets their CPF sorted through GET CPF, you earn $9.80. Paid monthly." },
            ].map((s) => (
              <div key={s.step} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-bold text-sm">{s.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live counter + Cities */}
      <section className="py-16 px-6">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-16">
            <div className="text-5xl font-extrabold text-primary">{cpfCount !== null ? cpfCount : "..."}</div>
            <p className="text-sm text-muted-foreground mt-2">foreigners arrived in Brazil prepared</p>
          </div>

          <div className="text-xs uppercase tracking-[3px] text-primary font-bold mb-6 text-center">Cities we cover</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {cities.map((c) => (
              <div key={c.name} className="bg-card border border-border rounded-xl p-4 text-center">
                <div className="text-lg mb-1">{c.emoji}</div>
                <div className="text-sm font-bold">{c.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{c.state}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-4">
            GET CPF works for every Receita Federal office in Brazil. These are where most of our users go.
          </p>
        </div>
      </section>

      {/* Manifesto */}
      <section className="py-16 px-6 bg-card border-y border-border">
        <div className="max-w-[640px] mx-auto text-center">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Brazil deserves better</h2>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed text-left">
             <p>
               Brazil is extraordinary. The people, the food, the culture, the energy. There is nowhere else like it. 
               But arriving here as a foreigner can be confusing. Not because Brazilians are unwelcoming, the 
               opposite is true. But because the systems were not built with outsiders in mind.
             </p>
            <p>
              The CPF is the front door to Brazilian life. It unlocks banking, housing, food delivery, phone plans, 
              everything. And for most foreigners it takes a full day of confusion, wrong offices, rejected forms, 
              and borrowed CPF numbers from strangers.
            </p>
            <p>
              That is not good enough for a country this good.
            </p>
            <p>
              GET CPF exists because Brazil deserves to be as easy to arrive in as it is beautiful to live in. 
              We started with the CPF because it is the first thing every foreigner needs. We are not stopping there.
            </p>
            <p className="text-foreground font-semibold">
              If you work with foreigners in Brazil and you share this belief, that arriving here should feel as 
              warm as the country itself, we want to work with you.
            </p>
          </div>
        </div>
      </section>

      {/* Partner signup form */}
      <section className="py-20 px-6" id="join">
        <div className="max-w-[500px] mx-auto">
          <h2 className="text-2xl font-bold tracking-tight mb-2 text-center">Join the partner network</h2>
          <p className="text-sm text-muted-foreground text-center mb-8">
            Your students, clients, and customers get their CPF sorted. You earn a commission on every referral. 
            And you become part of something that matters.
          </p>

          {submitted ? (
            <div className="bg-primary/5 border border-primary/15 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="font-bold text-lg mb-2">Application received</h3>
              <p className="text-sm text-muted-foreground">
                We review every application personally. You'll hear from us within a few days.
              </p>
              <Link to="/" className="inline-block mt-6 text-sm text-primary font-semibold hover:underline">
                ← Back to homepage
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">Your name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Ana Paula"
                />
              </div>
              <div>
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="ana@example.com"
                />
              </div>
              <div>
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">Type of business</label>
                <input
                  type="text"
                  value={form.business}
                  onChange={(e) => setForm({ ...form, business: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Portuguese tutor, co-living, relocation agency..."
                />
              </div>
              <div>
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="São Paulo"
                />
              </div>
              <div>
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">Why do you want to join?</label>
                <textarea
                  value={form.why}
                  onChange={(e) => setForm({ ...form, why: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  placeholder="Tell us a little about why this resonates with you..."
                />
              </div>
              <Button type="submit" disabled={submitting} className="w-full h-12 rounded-xl text-sm font-bold">
                {submitting ? "Submitting..." : "Apply to become a founding partner"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Only {20} founding spots available. After that, the terms change.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-[700px] mx-auto text-center">
          <p className="text-xs text-muted-foreground">
            © 2026 GET CPF. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Partners;
