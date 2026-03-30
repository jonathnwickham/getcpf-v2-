import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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

const Partners = () => {
  const [form, setForm] = useState({ name: "", email: "", business: "", city: "", why: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
          <Link to="/" className="text-lg font-bold tracking-tight">
            GET <span className="text-primary">CPF</span>
          </Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to homepage
          </Link>
        </div>
      </nav>

      {/* Hero / Mission */}
      <section className="py-20 px-6">
        <div className="max-w-[700px] mx-auto">
          <div className="text-xs uppercase tracking-[3px] text-primary font-bold mb-4">Partner with us</div>
          <h1 className="text-[clamp(2rem,5vw,3.2rem)] font-bold tracking-tight leading-[1.1]">
            We're making Brazil easier to arrive in.
          </h1>
          <p className="text-lg text-muted-foreground mt-6 leading-relaxed">One CPF at a time.</p>

          <div className="mt-12 space-y-6 text-[15px] text-muted-foreground leading-relaxed">
            <p>
              Brazil is one of the most welcoming countries in the world. But the bureaucracy does not always 
              match the warmth of the people. We are building the thing that changes that, starting with the CPF.
            </p>
            <p>
              If you work with foreigners in Brazil, whether you teach them Portuguese, help them find an apartment, 
              translate their documents, or pick them up from the airport, you already know the CPF question. 
              You have answered it dozens of times. Now there is a better answer to give them.
            </p>
          </div>
        </div>
      </section>

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
              { step: "3", title: "Earn on every referral", desc: "Every time someone you refer gets their CPF sorted through GET CPF, you earn a commission." },
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

      {/* Manifesto */}
      <section className="py-16 px-6 bg-card border-y border-border">
        <div className="max-w-[640px] mx-auto text-center">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Brazil deserves better</h2>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed text-left">
            <p>
              Brazil is extraordinary. The people, the food, the culture, the energy. There is nowhere else like it. 
              But arriving here as a foreigner is unnecessarily hard. Not because Brazilians are unwelcoming, the 
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
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">Your name</label>
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
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">Email</label>
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
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">Type of business</label>
                <input
                  type="text"
                  value={form.business}
                  onChange={(e) => setForm({ ...form, business: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Portuguese tutor, co-living, relocation agency..."
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="São Paulo"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">Why do you want to join?</label>
                <textarea
                  value={form.why}
                  onChange={(e) => setForm({ ...form, why: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  placeholder="Tell us a little about why this resonates with you..."
                />
              </div>
              <Button type="submit" disabled={submitting} className="w-full h-12 rounded-xl text-sm font-bold">
                {submitting ? "Submitting..." : "Apply to become a partner"}
              </Button>
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
