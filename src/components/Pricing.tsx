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
    price: "$29",
    originalPrice: "$49",
    description: "Everything automated. AI-powered, instant access.",
    highlighted: true,
    badge: "Available now",
    comingSoon: false,
    features: [
      "Show up with everything correct",
      "Know before you go that it will work",
      "Say exactly the right thing at the counter",
      "Proof of address sorted in two minutes",
      "Everything that comes next, mapped out",
      "If it doesn't work, you pay nothing",
    ],
    cta: "strikethrough",
  },
  {
    name: "Concierge",
    price: "$97",
    description: "Self-Service + real human support via WhatsApp.",
    highlighted: false,
    badge: "Coming soon",
    comingSoon: true,
    features: [
      "Everything in Self-Service",
      "WhatsApp messaging support",
      "Location-specific advice",
      "Help if something goes wrong",
      "Nationality & visa advice",
      "Response within hours",
    ],
    cta: "Join waitlist",
  },
  {
    name: "Full Assist",
    price: "$197",
    description: "Personal guide through every step until you have your CPF.",
    highlighted: false,
    badge: "Coming soon",
    comingSoon: true,
    features: [
      "Everything in Concierge",
      "Personal guide each step",
      "Document review",
      "Told exactly what to say",
      "Follow-up until confirmed",
      "Priority response",
    ],
    cta: "Join waitlist",
  },
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
    const { error } = await supabase.from("waitlist").insert({ email, plan: tierName } as any);
    if (error) {
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
      return;
    }
    setWaitlistSubmitted((s) => ({ ...s, [tierName]: true }));
    toast({ title: "You're on the list!", description: "We'll let you know the moment it's ready." });
  };

  return (
    <section id="pricing" className="py-24 sm:py-32 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-1.5 border border-gray-300 text-gray-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
          Beta is live · $29
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">One payment, done</h2>
        <p className="text-gray-500 mt-5 max-w-lg mx-auto text-sm leading-relaxed">
          The CPF costs R$7 at Correios or nothing at the Receita Federal. You're paying us <s className="opacity-50">$49</s> <span className="text-green-800 font-bold">$29</span> to make sure that when you go in, it works.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-14">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`bg-white rounded-xl p-8 text-left relative ${
                tier.highlighted
                  ? "border-2 border-green-800 animate-subtle-pulse"
                  : "border border-gray-100"
              }`}
            >
              {tier.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold ${
                  tier.comingSoon
                    ? "bg-gray-100 text-gray-500 border border-gray-200"
                    : "bg-green-800 text-white"
                }`}>
                  {tier.badge}
                </div>
              )}
              <div className="text-sm text-gray-500 font-semibold mb-2">{tier.name}</div>
              <div className="text-4xl font-extrabold tracking-tight">
                {tier.originalPrice && (
                  <span className="text-2xl line-through text-gray-300 mr-2">{tier.originalPrice}</span>
                )}
                {tier.price} <span className="text-base font-normal text-gray-400">USD</span>
              </div>
              <p className="text-sm text-gray-500 mt-3 mb-7 leading-relaxed">{tier.description}</p>
              <ul className={`mb-8 space-y-3 ${tier.comingSoon ? "opacity-50" : ""}`}>
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <span className="text-green-800 font-bold shrink-0 mt-0.5">✓</span> {f}
                  </li>
                ))}
              </ul>
              {tier.comingSoon ? (
                !waitlistSubmitted[tier.name] ? (
                  <form onSubmit={(e) => handleWaitlist(e, tier.name)} className="space-y-2">
                    <input
                      type="email"
                      value={waitlistEmail[tier.name] || ""}
                      onChange={(e) => setWaitlistEmail((s) => ({ ...s, [tier.name]: e.target.value }))}
                      required
                      placeholder="your@email.com"
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-800/20"
                    />
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-full font-semibold border border-gray-200 text-gray-600 hover:border-gray-300 transition-all btn-press"
                    >
                      Join waitlist
                    </button>
                  </form>
                ) : (
                  <div className="text-center text-sm text-green-800 font-semibold py-3.5">✓ On the waitlist</div>
                )
              ) : (
                <button
                  onClick={handleCTA}
                  className="w-full py-3.5 rounded-full font-semibold bg-green-800 text-white hover:bg-green-900 transition-all btn-press"
                >
                  Get started · <s className="opacity-50">$49</s> $29
                </button>
              )}
              {tier.highlighted && (
                <div className="flex items-center justify-center gap-5 mt-5 pt-4 border-t border-gray-100 text-xs text-gray-400">
                  <span>🔒 Secure</span>
                  <span>⏱ 5 min setup</span>
                  <span>👥 200+ served</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-400 mt-10">One payment, no subscriptions. You keep access forever.</p>
        <div className="flex items-center justify-center gap-2 mt-3 text-sm text-green-800 font-semibold">
          🛡️ Full refund if you follow our steps and get rejected.
        </div>
      </div>
    </section>
  );
};

export default Pricing;
