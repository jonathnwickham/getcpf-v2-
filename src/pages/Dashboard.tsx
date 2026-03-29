import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ full_name: string | null; plan: string | null } | null>(null);
  const [hasApplication, setHasApplication] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
      return;
    }
    if (user) {
      // Fetch profile
      supabase.from("profiles").select("full_name, plan").eq("id", user.id).single()
        .then(({ data }) => setProfile(data));
      // Check for existing application
      supabase.from("applications").select("id").eq("user_id", user.id).limit(1)
        .then(({ data }) => setHasApplication(!!(data && data.length > 0)));
    }
  }, [user, loading, navigate]);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  );

  if (!user) return null;

  const firstName = profile?.full_name?.split(" ")[0] || user.email?.split("@")[0] || "there";

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-[960px] mx-auto px-6 py-8 flex items-center justify-between">
          <div>
            <a href="/" className="text-sm font-semibold opacity-70 hover:opacity-100 transition-opacity">← cpfeasy.ai</a>
            <h1 className="text-2xl font-extrabold mt-2">Hey {firstName} 👋</h1>
            <p className="opacity-80 text-sm mt-1">Your CPF journey dashboard</p>
          </div>
          <button onClick={signOut} className="bg-primary-foreground/15 hover:bg-primary-foreground/25 px-4 py-2 rounded-xl text-sm font-semibold transition-all">
            Sign out
          </button>
        </div>
      </div>

      <div className="max-w-[960px] mx-auto px-6 py-8 space-y-6">
        {/* Start or continue */}
        <section className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-bold text-lg mb-4">
            {hasApplication ? "Continue your application" : "Start your CPF application"}
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            {hasApplication
              ? "You have a saved application. Pick up where you left off."
              : "Fill in your details and we'll prepare everything you need to get your CPF."
            }
          </p>
          <button
            onClick={() => navigate("/get-started")}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all"
          >
            {hasApplication ? "Continue application →" : "Start application →"}
          </button>
        </section>

        {/* Share with a friend */}
        <section className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-bold text-lg mb-2">🔗 Know someone who needs a CPF?</h2>
          <p className="text-sm text-muted-foreground mb-4">Share this tool with friends coming to Brazil. It'll save them hours of confusion.</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText("https://getcpf.lovable.app");
              }}
              className="bg-secondary text-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-secondary/80 transition-all"
            >
              📋 Copy link
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent("Hey! If you're going to Brazil and need a CPF, this tool is amazing — it prepares everything for you: https://getcpf.lovable.app")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
            >
              💬 Share via WhatsApp
            </a>
            <a
              href={`mailto:?subject=${encodeURIComponent("Get your Brazilian CPF easily")}&body=${encodeURIComponent("Hey! Check out this tool for getting your Brazilian CPF. It handles all the paperwork and tells you exactly what to do: https://getcpf.lovable.app")}`}
              className="bg-secondary text-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-secondary/80 transition-all"
            >
              ✉️ Share via email
            </a>
          </div>
        </section>

        {/* Post-CPF checklist */}
        <PostCPFChecklist />
      </div>
    </div>
  );
};

const PostCPFChecklist = () => {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));

  const steps = [
    {
      id: "sim",
      icon: "📱",
      title: "Get a Brazilian SIM card",
      desc: "Go to any Claro, Vivo, or TIM store with your CPF and passport. Or use Airalo for an instant eSIM.",
      timing: "Do this first — you need data",
    },
    {
      id: "nubank",
      icon: "🏦",
      title: "Open a Nubank account",
      desc: "Download the Nubank app, enter your CPF and passport details. Approval takes minutes. You'll get Pix immediately.",
      timing: "Same day",
    },
    {
      id: "pix",
      icon: "💳",
      title: "Set up Pix",
      desc: "Inside your bank app, register your CPF or phone number as a Pix key. This is how everyone pays in Brazil — restaurants, shops, Uber, everything.",
      timing: "5 minutes after bank setup",
    },
    {
      id: "govbr",
      icon: "🏛️",
      title: "Register on Gov.br",
      desc: "Go to gov.br and create an account with your CPF. This is Brazil's digital ID portal — you'll need it for official services.",
      timing: "When you have time",
    },
    {
      id: "digital",
      icon: "📲",
      title: "Get your digital CPF card",
      desc: "Download the 'CPF Digital' from the Receita Federal app or access it via Gov.br. This replaces the paper document — show it on your phone anywhere.",
      timing: "After Gov.br registration",
      steps: [
        "Download the 'Receita Federal' app from App Store or Play Store",
        "Log in with your Gov.br account",
        "Go to 'CPF Digital' section",
        "Your digital CPF card will appear — screenshot it for quick access",
      ],
    },
    {
      id: "qr",
      icon: "🔢",
      title: "Save your CPF number securely",
      desc: "Store your CPF number in your phone's notes, password manager, and take a photo of the printed document. You'll need this number constantly.",
      timing: "Immediately",
    },
  ];

  return (
    <section className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-primary/5">
        <h2 className="font-bold text-lg">✅ After you get your CPF — do these next</h2>
        <p className="text-xs text-muted-foreground mt-1">Check each off as you go. This is the order most expats follow.</p>
      </div>
      <div className="p-4 space-y-2">
        {steps.map((step, i) => (
          <button
            key={step.id}
            onClick={() => toggle(step.id)}
            className={`w-full text-left rounded-xl p-4 transition-all ${
              completed[step.id] ? "bg-primary/5 border border-primary/15" : "bg-secondary hover:bg-secondary/80"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold border-2 transition-all ${
                completed[step.id] ? "bg-primary border-primary text-primary-foreground" : "border-border text-muted-foreground"
              }`}>
                {completed[step.id] ? "✓" : i + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{step.icon}</span>
                  <h3 className={`font-semibold text-sm ${completed[step.id] ? "line-through opacity-60" : ""}`}>{step.title}</h3>
                  <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded font-semibold">{step.timing}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{step.desc}</p>
                {step.steps && !completed[step.id] && (
                  <ol className="mt-2 space-y-1 text-xs text-muted-foreground list-decimal list-inside">
                    {step.steps.map((s, j) => <li key={j}>{s}</li>)}
                  </ol>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default Dashboard;
