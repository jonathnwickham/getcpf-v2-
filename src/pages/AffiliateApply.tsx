import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const frequencyOptions = [
  "One-off post",
  "Multiple posts",
  "Monthly posts",
  "Weekly posts",
  "Daily posts",
];

const AffiliateApply = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    platform: "",
    why: "",
    posting_frequency: "",
    situation: "",
    motivation: "",
  });

  const update = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await supabase.from("affiliate_applications").insert(form as any);
    setLoading(false);
    setSubmitted(true);
    toast({ title: "Application received!", description: "We'll review it and get back to you soon." });
  };

  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <div className="min-h-screen bg-background pt-28 pb-16 px-6">
        <div className="max-w-[600px] mx-auto">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Become a GET CPF Affiliate</h1>
          <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
            We're selective about who we partner with, because the CPF process matters, and our users trust us.
            If you have an audience of expats, digital nomads, or people moving to Brazil, we'd love to hear from you.
          </p>

          {submitted ? (
            <div className="bg-card border border-border rounded-2xl p-10 text-center">
              <div className="text-4xl mb-4">🎉</div>
              <h2 className="text-xl font-bold mb-2">Application submitted</h2>
              <p className="text-sm text-muted-foreground">
                We'll review your application and reach out within a few days. Thanks for your interest!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold mb-1.5">Your name *</label>
                <input
                  required
                  maxLength={100}
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Jane Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold mb-1.5">Email *</label>
                <input
                  required
                  type="email"
                  maxLength={255}
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="you@email.com"
                />
              </div>

              {/* What they run */}
              <div>
                <label className="block text-sm font-semibold mb-1.5">What do you run? *</label>
                <p className="text-xs text-muted-foreground mb-1.5">Blog, YouTube channel, Instagram, podcast, newsletter, etc.</p>
                <input
                  required
                  maxLength={255}
                  value={form.platform}
                  onChange={(e) => update("platform", e.target.value)}
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. YouTube channel about expat life in Brazil"
                />
              </div>

              {/* Why */}
              <div>
                <label className="block text-sm font-semibold mb-1.5">Why do you want to be an affiliate? *</label>
                <textarea
                  required
                  maxLength={1000}
                  rows={3}
                  value={form.why}
                  onChange={(e) => update("why", e.target.value)}
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Tell us why you'd be a great fit..."
                />
              </div>

              {/* Posting frequency */}
              <div>
                <label className="block text-sm font-semibold mb-1.5">How often can you post? *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {frequencyOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => update("posting_frequency", opt)}
                      className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                        form.posting_frequency === opt
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-secondary text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Situation */}
              <div>
                <label className="block text-sm font-semibold mb-1.5">What's your situation?</label>
                <p className="text-xs text-muted-foreground mb-1.5">Are you based in Brazil? Digital nomad? Have you gone through the CPF process?</p>
                <textarea
                  maxLength={1000}
                  rows={3}
                  value={form.situation}
                  onChange={(e) => update("situation", e.target.value)}
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="e.g. I'm a digital nomad based in Florianópolis..."
                />
              </div>

              {/* Motivation */}
              <div>
                <label className="block text-sm font-semibold mb-1.5">Anything else you want us to know?</label>
                <textarea
                  maxLength={1000}
                  rows={2}
                  value={form.motivation}
                  onChange={(e) => update("motivation", e.target.value)}
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Audience size, links to your content, etc."
                />
              </div>

              <button
                type="submit"
                disabled={loading || !form.posting_frequency}
                className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit application →"}
              </button>

              <p className="text-xs text-muted-foreground text-center">
                We review every application personally. We'll get back to you within a few days.
              </p>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AffiliateApply;
