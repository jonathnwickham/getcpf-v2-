import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchLatestApplication,
  applicationHasReadyPack,
  mapApplicationToOnboardingData,
  persistOnboardingData,
} from "@/lib/application-storage";

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ full_name: string | null; plan: string | null } | null>(null);
  const [application, setApplication] = useState<any>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    Promise.all([
      supabase.from("profiles").select("full_name, plan").eq("id", user.id).single(),
      fetchLatestApplication(user.id),
    ]).then(([profileRes, app]) => {
      setProfile(profileRes.data);
      setApplication(app);
      setChecking(false);

      if (!app) {
        navigate("/get-started");
        return;
      }

      if (applicationHasReadyPack(app)) {
        // Persist to local so ReadyPack can load it
        const mapped = mapApplicationToOnboardingData(app);
        persistOnboardingData(mapped);
        navigate("/ready-pack");
        return;
      }

      // Draft — go to onboarding
      navigate("/get-started");
    });
  }, [user, loading, navigate]);

  if (loading || checking) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Getting your stuff ready...</div>
    </div>
  );

  if (!user || !application) return null;

  const firstName = profile?.full_name?.split(" ")[0] || user.email?.split("@")[0] || "there";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-[960px] mx-auto px-6 py-8 flex items-center justify-between">
          <div>
            <a href="/" className="text-sm font-semibold opacity-70 hover:opacity-100 transition-opacity">← GET CPF</a>
            <h1 className="text-2xl font-extrabold mt-2">Hey {firstName} 👋</h1>
            <p className="opacity-80 text-sm mt-1">Here's where you left off</p>
          </div>
          <button onClick={signOut} className="bg-primary-foreground/15 hover:bg-primary-foreground/25 px-4 py-2 rounded-xl text-sm font-semibold transition-all">
            Sign out
          </button>
        </div>
      </div>

      <div className="max-w-[960px] mx-auto px-6 py-8 space-y-8">
        {/* Application summary */}
        <section className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-lg">📋</div>
            <div>
              <h2 className="font-bold text-lg">Your CPF application</h2>
              <p className="text-xs text-muted-foreground">
                Status: <span className="text-primary font-semibold capitalize">{application.status}</span>
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            {application.full_name && <InfoField label="Full name" value={application.full_name} />}
            {application.nationality && <InfoField label="Nationality" value={application.nationality} />}
            {application.passport_number && <InfoField label="Passport" value={application.passport_number} />}
            {application.state_name && <InfoField label="State" value={application.state_name} />}
            {application.city && <InfoField label="City" value={application.city} />}
            {application.email && <InfoField label="Email" value={application.email} />}
          </div>
          {application.cpf_number && (
            <div className="mt-6 bg-primary/5 border border-primary/15 rounded-xl p-4">
              <div className="text-xs text-primary font-bold uppercase tracking-wider mb-1">🎉 Your CPF Number</div>
              <div className="text-2xl font-extrabold font-mono tracking-wide">{application.cpf_number}</div>
            </div>
          )}
          <div className="mt-4">
            <button
              onClick={() => navigate("/ready-pack")}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all"
            >
              Open my Ready Pack →
            </button>
          </div>
        </section>

        {/* Partners */}
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-extrabold">What to do next with your CPF</h2>
            <p className="text-sm text-muted-foreground mt-1">The most useful things to set up right after getting your CPF, each one is tried and tested by people who've done exactly this.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PARTNERS.map((p) => (
              <PartnerCard key={p.name} partner={p} />
            ))}
          </div>
        </section>

        {/* Share */}
        <section className="bg-card border border-border rounded-2xl p-6 text-center">
          <h2 className="font-bold text-lg mb-2">Know someone heading to Brazil?</h2>
          <p className="text-sm text-muted-foreground mb-4">Send them this, they'll thank you later.</p>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => navigator.clipboard.writeText("https://getcpf.lovable.app")}
              className="bg-secondary text-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-secondary/80 transition-all"
            >
              📋 Copy link
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent("If you're going to Brazil and need a CPF, this tool prepares everything for you: https://getcpf.lovable.app")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[hsl(142,70%,49%)] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
            >
              💬 WhatsApp
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

const InfoField = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-0.5">{label}</div>
    <div className="font-semibold text-foreground">{value}</div>
  </div>
);

const PARTNERS = [
  {
    icon: "📱",
    name: "Airalo",
    category: "eSIM / Data",
    summary: "Get a Brazil eSIM in 2 minutes, works the moment you land.",
    detail: "You need a CPF to buy a physical SIM from Claro, Vivo, or TIM. With Airalo you get data immediately while sorting your CPF. Plans from $5. No store visit needed, install directly from your phone.",
    tip: "Most popular choice: the 5GB / 30-day Brazil plan. Enough for maps, Uber, and messaging.",
    url: "https://www.airalo.com",
  },
  {
    icon: "🏦",
    name: "Nubank",
    category: "Bank Account",
    summary: "Brazil's #1 digital bank. Zero fees, instant Pix, debit & credit card.",
    detail: "Download the Nubank app, enter your CPF + passport, get approved in minutes. Nubank is what most Brazilians use. You get Pix (Brazil's free instant payment system) immediately. Use it at restaurants, shops, Uber, everything.",
    tip: "Nubank is the fastest way to get Pix. Most expats open this on the same day they get their CPF.",
    url: "https://nubank.com.br",
  },
  {
    icon: "💸",
    name: "Wise",
    category: "International Transfers",
    summary: "Send money to/from Brazil at the real exchange rate. Way cheaper than banks.",
    detail: "Brazilian banks charge huge spreads on foreign currency. Wise gives you the mid-market rate with minimal fees. Essential if you receive income from abroad or need to move money between countries. Connect it to your Nubank for instant BRL deposits.",
    tip: "Set up a BRL balance in Wise and connect your Nubank account for seamless transfers.",
    url: "https://wise.com",
  },
  {
    icon: "🏥",
    name: "SafetyWing",
    category: "Health & Travel Insurance",
    summary: "Month-to-month health coverage for nomads in Brazil. From $45/month.",
    detail: "Brazil's public healthcare (SUS) is free but crowded and Portuguese-only. Private hospitals can cost thousands without insurance. SafetyWing covers hospitals, clinics, and emergencies across Latin America. Cancel anytime, no long contracts.",
    tip: "Covers COVID, emergency dental, and adventure sports. Most digital nomads in Brazil use this.",
    url: "https://safetywing.com",
  },
  {
    icon: "🗣️",
    name: "iTalki",
    category: "Learn Portuguese",
    summary: "1-on-1 video lessons with native Brazilian Portuguese speakers.",
    detail: "Even 5 lessons makes a massive difference, at the Receita Federal office, at restaurants, with landlords. Brazilian Portuguese is different from European Portuguese and very different from Spanish. R$30-60/hour for a private tutor.",
    tip: "Book a few lessons before your office visit. Learn numbers, greetings, and how to say 'I'm here for my CPF'.",
    url: "https://www.italki.com",
  },
  {
    icon: "🏛️",
    name: "Gov.br",
    category: "Digital Government ID",
    summary: "Brazil's digital ID portal — needed for official services.",
    detail: "Register at gov.br with your CPF to access government services online. You can download your digital CPF card from the Receita Federal app after registering. This replaces the paper document — show it on your phone anywhere.",
    tip: "After registering, download the 'Receita Federal' app and go to 'CPF Digital' to get your digital card.",
    url: "https://www.gov.br",
  },
];

const PartnerCard = ({ partner }: { partner: typeof PARTNERS[0] }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden transition-all">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-5 flex items-start gap-4 hover:bg-secondary/30 transition-colors"
      >
        <span className="text-3xl mt-0.5">{partner.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-sm">{partner.name}</h3>
            <span className="text-[9px] uppercase tracking-wider text-primary font-bold bg-primary/10 px-2 py-0.5 rounded">{partner.category}</span>
          </div>
          <p className="text-xs text-muted-foreground">{partner.summary}</p>
        </div>
        <span className={`text-muted-foreground transition-transform shrink-0 mt-1 ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && (
        <div className="px-5 pb-5 pt-0 border-t border-border">
          <p className="text-sm text-foreground mt-4 leading-relaxed">{partner.detail}</p>
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 mt-3">
            <p className="text-xs text-primary font-medium">💡 {partner.tip}</p>
          </div>
            <a
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all group/ext"
            >
              Visit {partner.name} <span className="text-[10px] opacity-60 group-hover/ext:opacity-100 transition-opacity">↗ opens in new tab</span>
            </a>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
