import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Clock, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PricingProps {
  onOpenModal?: () => void;
}

const tiers = [
  {
    name: "Self-Service",
    price: "$49",
    description: "Everything automated. AI-powered, instant access.",
    highlighted: true,
    badge: "Available now",
    comingSoon: false,
    features: [
      "Pre-filled forms, office finder & document checklist",
      "AI document scanner — checks before you go",
      "Portuguese cheat sheet for the office visit",
      "Host declaration letter generator",
      "Post-CPF setup guide (bank, SIM, Pix)",
      "If you follow our steps and get rejected, we'll refund you in full",
    ],
    cta: "Get started, $49",
  },
  {
    name: "Concierge",
    price: "$97",
    description: "Everything in Self-Service plus real human support via WhatsApp.",
    highlighted: false,
    badge: "Coming soon",
    comingSoon: true,
    features: [
      "Everything in Self-Service",
      "WhatsApp / in-app messaging support",
      "Location-specific advice for your office",
      "Help troubleshooting if something goes wrong",
      "Advice specific to your nationality & visa",
      "Response within a few hours (Brazil time)",
    ],
    cta: "Join waitlist",
  },
  {
    name: "Full Assist",
    price: "$197",
    description: "A real person guides you through every single step until you have your CPF.",
    highlighted: false,
    badge: "Coming soon",
    comingSoon: true,
    features: [
      "Everything in Concierge",
      "Personal guide through each step",
      "Document review before submission",
      "Told exactly what to say at the office",
      "Follow-up until CPF is confirmed",
      "Priority response time",
    ],
    cta: "Join waitlist",
  },
];

const trustSignals = [
  { icon: Lock, label: "Secure payment" },
  { icon: Clock, label: "5 min setup" },
  { icon: Users, label: "200+ served" },
];

const Pricing = ({ onOpenModal }: PricingProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [waitlistEmail, setWaitlistEmail] = useState<Record<string, string>>({});
  const [waitlistSubmitted, setWaitlistSubmitted] = useState<Record<string, boolean>>({});

  const handleCTA = () => {
    if (onOpenModal) onOpenModal();
    else navigate("/pricing");
  };

  const handleWaitlist = async (e: React.FormEvent, tierName: string) => {
    e.preventDefault();
    const email = waitlistEmail[tierName]?.trim();
    if (!email) return;
    await supabase.from("waitlist").insert({ email, plan: tierName } as any);
    setWaitlistSubmitted((s) => ({ ...s, [tierName]: true }));
    toast({ title: "You're on the list!", description: "We'll let you know the moment it's ready." });
  };

  return (
    <section id="pricing" className="py-24 px-8 text-center bg-secondary">
      <div className="text-xs uppercase tracking-[3px] text-primary font-bold mb-4">Pricing</div>
      <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tight mx-auto">One payment, done</h2>
      <p className="text-muted-foreground mt-4 mx-auto max-w-[560px] text-sm leading-relaxed">
        The CPF costs R$7 at Correios or nothing at the Receita Federal. Either way, you're paying us $49 to make sure you don't waste a full day getting it wrong.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1000px] mx-auto mt-12">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`bg-card rounded-2xl p-8 text-left relative ${
              tier.highlighted
                ? "border-2 border-primary shadow-lg shadow-primary/5"
                : "border border-border"
            }`}
          >
            {tier.badge && (
              <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold ${
                tier.comingSoon
                  ? "bg-muted text-muted-foreground border border-border"
                  : "bg-primary text-primary-foreground"
              }`}>
                {tier.badge}
              </div>
            )}
            <div className="text-sm text-muted-foreground font-semibold mb-2">{tier.name}</div>
            <div className="text-4xl font-extrabold tracking-tight">
              {tier.price} <span className="text-base font-normal text-muted-foreground">USD</span>
            </div>
            <div className="text-sm text-muted-foreground mt-3 mb-6 leading-relaxed">{tier.description}</div>
            <ul className={`mb-8 space-y-2.5 ${tier.comingSoon ? "opacity-60" : ""}`}>
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                  <span className="text-primary font-bold shrink-0 mt-0.5">✓</span> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={tier.comingSoon ? undefined : handleCTA}
              disabled={tier.comingSoon}
              className={`w-full py-3.5 rounded-xl font-semibold transition-all ${
                tier.comingSoon
                  ? "border border-border text-muted-foreground cursor-not-allowed opacity-60"
                  : tier.highlighted
                    ? "bg-primary text-primary-foreground hover:opacity-90 shadow-md shadow-primary/20"
                    : "border border-border text-foreground hover:bg-secondary"
              }`}
            >
              {tier.cta} {tier.comingSoon ? "" : "→"}
            </button>
            {/* Trust signals, only on highlighted tier */}
            {tier.highlighted && (
              <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border">
                {trustSignals.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Icon className="w-3.5 h-3.5" />
                      {s.label}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-8 max-w-[500px] mx-auto">
        One payment, no subscriptions. You keep access to your Ready Pack forever.
      </p>
      <div className="flex items-center justify-center gap-2 mt-4 text-sm text-primary font-semibold">
        <span>🛡️</span>
        If you follow our steps and get rejected, we'll refund you in full. No questions asked.
      </div>
    </section>
  );
};

export default Pricing;
