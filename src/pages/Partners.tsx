import { useState } from "react";
import SEO from "@/components/SEO";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FadeIn from "@/components/FadeIn";
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
<section className="py-10 md:py-12 px-6 bg-gray-50 border-y border-gray-100">
    <div className="max-w-[800px] mx-auto">
      <div className="text-xs uppercase tracking-[3px] text-green-800 font-medium mb-4 text-center">Beyond the commission</div>
      <h2 className="text-2xl font-semibold tracking-tight mb-4 text-center text-gray-900">What partners actually get</h2>
      <p className="text-sm text-gray-500 text-center mb-12 max-w-[500px] mx-auto">
        The commission gets you to listen. Here's what makes you stay.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {partnerBenefits.map((b) => (
          <div key={b.title} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <b.icon className="w-5 h-5 text-green-800 mb-3" />
            <h3 className="font-semibold text-sm mb-1 text-gray-900">{b.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{b.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FoundingPartnerSection = () => (
  <section className="py-12 md:py-16 px-6 bg-green-800/5 border-y border-green-800/15">
    <div className="max-w-[700px] mx-auto text-center">
      <div className="inline-flex items-center gap-2 bg-green-800/10 text-green-800 text-xs font-medium uppercase tracking-[2px] px-4 py-1.5 rounded-full mb-6">
        <Users className="w-3.5 h-3.5" />
        Limited to 20 spots
      </div>
      <h2 className="text-2xl font-semibold tracking-tight mb-4 text-gray-900">Founding Partners</h2>
      <p className="text-sm text-gray-500 leading-relaxed max-w-[520px] mx-auto mb-8">
        The first 20 partners get a permanent, higher commission rate, named placement on our website,
        first access to every new product we launch, and a direct line to us. After 20, the terms change.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
        {[
          { label: "20% commission", desc: "You earn 20% of every sale, locked in permanently" },
          { label: "Named on the site", desc: "Your name, logo, and one-line bio featured on the partners page" },
          { label: "First access", desc: "Digital nomad visa guide, CNH guide, RG guide. you promote it first" },
        ].map((item) => (
          <div key={item.label} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <div className="text-sm font-semibold mb-1 text-gray-900">{item.label}</div>
            <div className="text-xs text-gray-500 leading-relaxed">{item.desc}</div>
          </div>
        ))}
      </div>
      <a href="#join" className="inline-flex items-center gap-1 text-sm font-semibold text-green-800 mt-8 hover:underline py-2 min-h-[44px]">
        Apply for a founding spot <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  </section>
);

const Partners = () => {
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-white">
      <SEO title="Become a Partner. GET CPF" description="Join GET CPF's partner network. Earn 20% commission on every referral. Language schools, relocation agencies, and content creators welcome." path="/partners" />
      <Navbar onOpenModal={() => navigate("/pricing")} />

      {/* Hero / Mission */}
      <FadeIn>
      <section className="pt-28 pb-14 md:pt-32 md:pb-20 px-6">
        <div className="max-w-[700px] mx-auto">
          <div className="text-xs uppercase tracking-[3px] text-green-800 font-medium mb-4">Partner with us</div>
          <h1 className="text-[clamp(2rem,5vw,3.2rem)] font-semibold tracking-tight leading-[1.1] text-gray-900">
            We're making Brazil easier to arrive in.
          </h1>
          <p className="text-lg text-gray-500 mt-6 leading-relaxed">One CPF at a time.</p>
          <div className="mt-8 inline-flex items-center gap-3 bg-green-800/10 border border-green-800/20 rounded-xl px-5 py-3">
            <span className="text-2xl">💰</span>
            <div>
              <div className="text-sm font-semibold text-green-800">Earn 20% commission on every referral</div>
              <div className="text-xs text-gray-500">Paid monthly. No caps. No catches.</div>
            </div>
          </div>

          <div className="mt-12 space-y-6 text-[15px] text-gray-500 leading-relaxed">
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
      </FadeIn>

      {/* What partners actually get */}
      <PartnerBenefitsSection />

      {/* Founding partner tier */}
      <FoundingPartnerSection />

      {/* What partners are saying */}
      <section className="py-16 px-6 bg-gray-50 border-y border-gray-100">
        <div className="max-w-[900px] mx-auto">
          <div className="text-xs uppercase tracking-[3px] text-green-800 font-medium mb-8 text-center">What partners are saying</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {partnerQuotes.map((q) => (
              <div key={q.name} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                <p className="text-sm text-gray-900 leading-relaxed italic">"{q.quote}"</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-sm font-semibold text-gray-900">{q.name}</div>
                  <div className="text-xs text-gray-500">{q.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works for partners */}
      <section className="py-20 px-6">
        <div className="max-w-[700px] mx-auto">
          <h2 className="text-2xl font-semibold tracking-tight mb-8 text-gray-900">How it works</h2>
          <div className="space-y-6">
            {[
              { step: "1", title: "Join the network", desc: "Fill in the form below. We review every application personally." },
              { step: "2", title: "Get your referral link", desc: "We set you up with a unique link and promo code for your students, clients, or community." },
              { step: "3", title: "Earn 20% on every referral", desc: "Every time someone you refer gets their CPF sorted through GET CPF, you earn a commission. Paid monthly." },
            ].map((s) => (
              <div key={s.step} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-green-800 text-white flex items-center justify-center text-sm font-semibold shrink-0">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-900">{s.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{s.desc}</p>
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
            <div className="text-5xl font-semibold text-green-800">{cpfCount !== null ? cpfCount : "..."}</div>
            <p className="text-sm text-gray-500 mt-2">foreigners arrived in Brazil prepared</p>
          </div>

          <div className="text-xs uppercase tracking-[3px] text-green-800 font-medium mb-6 text-center">Cities we cover</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {cities.map((c) => (
              <div key={c.name} className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
                <div className="text-lg mb-1">{c.emoji}</div>
                <div className="text-sm font-semibold text-gray-900">{c.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">{c.state}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 text-center mt-4">
            GET CPF works for every Receita Federal office in Brazil. These are where most of our users go.
          </p>
        </div>
      </section>

      {/* Manifesto */}
      <section className="py-16 px-6 bg-white border-y border-gray-100">
        <div className="max-w-[640px] mx-auto text-center">
          <h2 className="text-2xl font-semibold tracking-tight mb-6 text-gray-900">Brazil deserves better</h2>
          <div className="space-y-4 text-sm text-gray-500 leading-relaxed text-left">
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
            <p className="text-gray-900 font-semibold">
              If you work with foreigners in Brazil and you share this belief, that arriving here should feel as
              warm as the country itself, we want to work with you.
            </p>
          </div>
        </div>
      </section>

      {/* Partner signup form */}
      <section className="py-20 px-6" id="join">
        <div className="max-w-[500px] mx-auto">
          <h2 className="text-2xl font-semibold tracking-tight mb-2 text-center text-gray-900">Join the partner network</h2>
          <p className="text-sm text-gray-500 text-center mb-8">
            Your students, clients, and customers get their CPF sorted. You earn a commission on every referral.
            And you become part of something that matters.
          </p>

          {submitted ? (
            <div className="bg-green-800/5 border border-green-800/15 rounded-xl p-8 text-center shadow-sm">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Application received</h3>
              <p className="text-sm text-gray-500">
                We review every application personally. You'll hear from us within a few days.
              </p>
              <Link to="/" className="inline-block mt-6 text-sm text-green-800 font-semibold hover:underline">
                ← Back to homepage
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium uppercase tracking-wider text-gray-500 block mb-1.5">Your name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-800/30 placeholder:text-gray-400"
                  placeholder="Ana Paula"
                />
              </div>
              <div>
                <label className="text-sm font-medium uppercase tracking-wider text-gray-500 block mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-800/30 placeholder:text-gray-400"
                  placeholder="ana@example.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium uppercase tracking-wider text-gray-500 block mb-1.5">Type of business</label>
                <input
                  type="text"
                  value={form.business}
                  onChange={(e) => setForm({ ...form, business: e.target.value })}
                  className="w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-800/30 placeholder:text-gray-400"
                  placeholder="Portuguese tutor, co-living, relocation agency..."
                />
              </div>
              <div>
                <label className="text-sm font-medium uppercase tracking-wider text-gray-500 block mb-1.5">City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-800/30 placeholder:text-gray-400"
                  placeholder="São Paulo"
                />
              </div>
              <div>
                <label className="text-sm font-medium uppercase tracking-wider text-gray-500 block mb-1.5">Why do you want to join?</label>
                <textarea
                  value={form.why}
                  onChange={(e) => setForm({ ...form, why: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-800/30 resize-none placeholder:text-gray-400"
                  placeholder="Tell us a little about why this resonates with you..."
                />
              </div>
              <Button type="submit" disabled={submitting} className="w-full h-12 rounded-xl text-sm font-semibold bg-green-800 hover:bg-green-900 text-white">
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </span>
                ) : "Apply to become a founding partner"}
              </Button>
              <p className="text-sm text-gray-500 text-center">
                Only {20} founding spots available. After that, the terms change.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100">
        <div className="max-w-[700px] mx-auto text-center">
          <p className="text-sm text-gray-500">
            © 2026 GET CPF. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Partners;
