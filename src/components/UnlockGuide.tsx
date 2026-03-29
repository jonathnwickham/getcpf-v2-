import { useState, useEffect } from "react";

type UnlockItem = {
  id: string;
  icon: string;
  title: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  time: string;
  summary: string;
  steps: string[];
  tip: string;
  link?: { label: string; url: string };
};

const UNLOCK_ITEMS: UnlockItem[] = [
  {
    id: "bank",
    icon: "🏦",
    title: "Open a bank account",
    category: "Finance",
    difficulty: "Easy",
    time: "15 min",
    summary: "Nubank is the easiest — fully digital, zero fees, accepts foreigners with CPF + passport.",
    steps: [
      "Download the Nubank app (iOS or Android).",
      "Select 'Criar conta' (Create account) and choose 'Estrangeiro' if prompted.",
      "Enter your CPF number, full name (as on passport), and email.",
      "Upload a photo of your passport (data page).",
      "Take a selfie for identity verification.",
      "Wait for approval — usually 1–3 business days, sometimes instant.",
      "Once approved, you'll have a digital account with Pix, debit card, and credit card access.",
    ],
    tip: "If Nubank rejects you (rare), try Inter or C6 Bank — both accept foreigners. Avoid traditional banks (Itaú, Bradesco) as they often require a guarantor or proof of income.",
    link: { label: "Download Nubank", url: "https://nubank.com.br" },
  },
  {
    id: "sim",
    icon: "📱",
    title: "Get a local SIM card",
    category: "Phone",
    difficulty: "Easy",
    time: "30 min",
    summary: "With your CPF, you can get a proper postpaid plan instead of expensive prepaid.",
    steps: [
      "Visit a Vivo, Claro, or TIM store (found in any shopping mall).",
      "Bring your CPF number, passport, and proof of address.",
      "Ask for a plano pós-pago (postpaid plan) — much better value than prepaid.",
      "Prepaid (pré-pago): R$15–30/month, limited data. Postpaid (pós-pago): R$50–100/month, unlimited data.",
      "Coverage varies by city: Vivo is best overall, Claro is strong in São Paulo, TIM has good prices.",
      "They'll activate your SIM on the spot. You'll have a Brazilian number immediately.",
    ],
    tip: "While waiting for your SIM, use Airalo for an instant eSIM with data. Once you have a local number, you can transfer your WhatsApp to it.",
    link: { label: "Get Airalo eSIM", url: "https://www.airalo.com" },
  },
  {
    id: "pix",
    icon: "⚡",
    title: "Set up Pix",
    category: "Payments",
    difficulty: "Easy",
    time: "5 min",
    summary: "Brazil's instant payment system — free, instant, and used absolutely everywhere.",
    steps: [
      "Open your bank app (Nubank, Inter, etc.).",
      "Go to the Pix section and register a Pix key (chave Pix).",
      "You can register your CPF, phone number, or email as a key — CPF is most common.",
      "That's it. You can now send and receive money instantly, 24/7, for free.",
      "To pay someone: scan their QR code or enter their Pix key.",
      "To receive: share your QR code or Pix key. Money arrives in seconds.",
    ],
    tip: "Pix has replaced cash in most of Brazil. Street vendors, restaurants, taxis — everyone uses it. It's the single most useful thing your CPF unlocks.",
  },
  {
    id: "accommodation",
    icon: "🏠",
    title: "Rent an apartment",
    category: "Housing",
    difficulty: "Hard",
    time: "1–2 weeks",
    summary: "Renting requires CPF plus either a guarantor (fiador) or rental insurance (seguro fiança).",
    steps: [
      "Most leases require a fiador (guarantor) — a Brazilian property owner who co-signs. Hard for foreigners to find.",
      "Alternative: seguro fiança (rental insurance) — you pay ~1 month's rent and the insurance company guarantees you. Much easier.",
      "QuintoAndar is the most foreigner-friendly platform — no fiador required, fully digital process.",
      "For Airbnb long-stays (30+ days), negotiate directly with hosts for monthly rates — typically 30–50% cheaper than nightly rates.",
      "Documents needed: CPF, passport, proof of income (bank statements or employment contract), and sometimes a credit check.",
      "Short-term: Facebook groups like 'Apartments for Rent [city name]' often have furnished rooms that are easier to access.",
    ],
    tip: "QuintoAndar is your best bet — they handle the guarantee and the process is 100% digital. Start searching 2–3 weeks before you need to move in.",
    link: { label: "Browse QuintoAndar", url: "https://www.quintoandar.com.br" },
  },
  {
    id: "transport",
    icon: "🚗",
    title: "Set up ride apps",
    category: "Transport",
    difficulty: "Easy",
    time: "10 min",
    summary: "Uber, 99, and inDrive all work better with a Brazilian account tied to your CPF.",
    steps: [
      "Update your Uber payment method to your Nubank card or Pix.",
      "Download 99 (Brazilian ride app) — often cheaper than Uber, especially for longer rides.",
      "Download inDrive — you negotiate the price with the driver. Good for airport rides.",
      "Add your Brazilian payment method to each app.",
      "For public transport: get a Bilhete Único (São Paulo) or equivalent city card. Some cities now accept Pix for transport.",
    ],
    tip: "99 is often 20–30% cheaper than Uber in Brazil. Use both apps and compare prices before booking.",
    link: { label: "Download 99", url: "https://99app.com" },
  },
  {
    id: "food",
    icon: "🍔",
    title: "Order food delivery",
    category: "Daily life",
    difficulty: "Easy",
    time: "10 min",
    summary: "iFood and Rappi both require CPF. Once set up, you have access to every restaurant.",
    steps: [
      "Download iFood (Brazil's biggest delivery app — like Uber Eats but better here).",
      "Create account with your CPF, email, and Brazilian phone number.",
      "Add your Nubank card or set up Pix payment.",
      "Rappi is the alternative — similar to iFood, sometimes has different restaurants.",
      "Both apps have grocery delivery too (Mercado section).",
    ],
    tip: "iFood has 'cupons' (coupons) that give you R$10–20 off. Check the app's coupon section before ordering — there's almost always a discount available.",
    link: { label: "Download iFood", url: "https://www.ifood.com.br" },
  },
  {
    id: "shopping",
    icon: "🛍️",
    title: "Shop online",
    category: "Shopping",
    difficulty: "Easy",
    time: "15 min",
    summary: "Mercado Livre, Amazon Brazil, and Shopee all need CPF for full access — including parcelamento (installments).",
    steps: [
      "Create a Mercado Livre account with your CPF — it's Brazil's biggest marketplace (like eBay + Amazon combined).",
      "Amazon Brazil (amazon.com.br) works with CPF and delivers to most addresses.",
      "Shopee Brazil has the cheapest prices for accessories, phone cases, and household items.",
      "Set up parcelamento: this lets you split purchases into up to 12 interest-free monthly installments on your credit card. It's how most Brazilians buy everything.",
      "Your Nubank credit card supports parcelamento automatically. Just select 'parcelar' at checkout.",
    ],
    tip: "Parcelamento is one of Brazil's best-kept secrets for foreigners. That R$1,200 item? Pay R$100/month for 12 months with zero interest. It's standard practice here.",
    link: { label: "Browse Mercado Livre", url: "https://www.mercadolivre.com.br" },
  },
  {
    id: "govbr",
    icon: "🏛️",
    title: "Create a Gov.br account",
    category: "Government",
    difficulty: "Medium",
    time: "20 min",
    summary: "Your digital government ID — unlocks tax returns, digital signatures, and dozens of public services.",
    steps: [
      "Go to gov.br or download the Gov.br app.",
      "Click 'Criar conta' and enter your CPF.",
      "Verify your identity via facial recognition (you'll need the app for this).",
      "Once verified, you'll have a 'selo de confiabilidade' (trust level) — Silver or Gold.",
      "With Gold level: access digital signature, tax returns (IRPF), social security (INSS), and more.",
      "To reach Gold: verify via your bank app (Nubank supports this) or a government office.",
    ],
    tip: "Even if you don't need government services now, create the account. If you ever need to file taxes or access any public service in Brazil, you'll need this.",
    link: { label: "Create Gov.br account", url: "https://www.gov.br" },
  },
  {
    id: "health",
    icon: "🏥",
    title: "Get health insurance",
    category: "Healthcare",
    difficulty: "Medium",
    time: "1–2 days",
    summary: "Private health insurance (plano de saúde) requires CPF. Major providers: Unimed, Bradesco Saúde, SulAmérica.",
    steps: [
      "Brazil has free public healthcare (SUS) but wait times can be long. Private insurance is recommended if you can afford it.",
      "Individual plans: R$200–600/month depending on age and coverage. Compare on sites like Plano de Saúde or Jera Saúde.",
      "Unimed is the largest cooperative — available nationwide with good hospital coverage.",
      "Bradesco Saúde and SulAmérica are premium options with wider networks.",
      "For short stays: SafetyWing or World Nomads travel insurance may be sufficient and cheaper.",
      "Apply with your CPF, passport, and proof of address. Most plans activate within 24–48 hours for basic coverage.",
    ],
    tip: "If you're staying less than 6 months, travel insurance (SafetyWing) is cheaper and easier. For longer stays, a local plano de saúde gives you access to Brazil's excellent private hospitals.",
    link: { label: "Get SafetyWing", url: "https://safetywing.com" },
  },
  {
    id: "driving",
    icon: "🚗",
    title: "Convert your driving licence",
    category: "Transport",
    difficulty: "Hard",
    time: "2–4 months",
    summary: "Converting a foreign licence to a Brazilian CNH requires CPF. Start early — it takes months.",
    steps: [
      "Your foreign licence is valid for 180 days after entering Brazil (with international driving permit).",
      "After 180 days, you need a CNH (Carteira Nacional de Habilitação).",
      "Go to the nearest DETRAN (traffic department) with: CPF, passport, valid foreign licence, proof of address.",
      "You'll need to take a medical exam (exame médico) and psychological exam — both done at DETRAN-approved clinics.",
      "Written test: 30 questions in Portuguese about Brazilian traffic laws. Study the CTB (Código de Trânsito Brasileiro).",
      "Practical driving test: if your country has an agreement with Brazil, you may be exempt. Check at DETRAN.",
      "Total cost: approximately R$500–1,000 for all exams and fees.",
    ],
    tip: "Start this process as soon as you decide to stay long-term. The biggest bottleneck is scheduling — DETRAN appointments can take weeks.",
  },
  {
    id: "investing",
    icon: "📈",
    title: "Open an investment account",
    category: "Finance",
    difficulty: "Medium",
    time: "30 min",
    summary: "Brazilian investment platforms (XP, Rico, BTG) require CPF. Access stocks, bonds, and high-yield savings.",
    steps: [
      "Brazilian savings rates are much higher than US/Europe — the Selic rate is currently around 10%+, meaning basic CDBs pay 10%+ annually.",
      "Download XP Investimentos, Rico, or BTG Pactual app.",
      "Create account with CPF, passport, and proof of address.",
      "Start with Tesouro Direto (government bonds) or CDB (bank certificates) — both are very safe and pay well.",
      "You can also buy Brazilian stocks (B3 exchange) and REITs (FIIs — Fundos Imobiliários).",
      "Tax note: investment income in Brazil is taxed. If you're a tax resident (183+ days), you'll need to declare it.",
    ],
    tip: "Even if you're just parking cash temporarily, a CDB paying 100% of CDI gives you ~10% annual return — much better than a savings account in most countries.",
  },
  {
    id: "wise",
    icon: "💸",
    title: "Set up international transfers",
    category: "Finance",
    difficulty: "Easy",
    time: "15 min",
    summary: "Wise gives you the real exchange rate with minimal fees — essential for receiving income from abroad.",
    steps: [
      "Create or update your Wise account with your Brazilian CPF.",
      "You can now receive money in BRL (Brazilian Real) directly.",
      "Set up a Brazilian bank account as a withdrawal destination.",
      "Compare: Wise charges ~0.5–1% fee at mid-market rate. Banks charge 3–5% spread plus fees.",
      "For regular transfers (freelancer income, etc.), set up recurring transfers to save time.",
    ],
    tip: "If you're earning in USD/EUR and spending in BRL, Wise will save you hundreds of dollars per month compared to bank transfers.",
    link: { label: "Open Wise", url: "https://wise.com" },
  },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-300",
  Medium: "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300",
  Hard: "bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-300",
};

const UnlockGuide = () => {
  const [completed, setCompleted] = useState<Set<string>>(() => {
    const stored = localStorage.getItem("cpf-unlock-completed");
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("cpf-unlock-completed", JSON.stringify([...completed]));
  }, [completed]);

  const toggleComplete = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const progress = Math.round((completed.size / UNLOCK_ITEMS.length) * 100);

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header with progress */}
      <section className="bg-primary/5 border border-primary/15 rounded-3xl p-8 text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">🔓 What your CPF unlocks</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
          Your CPF is your key to real life in Brazil. Work through this list and you'll be fully set up.
        </p>
        {/* Progress bar */}
        <div className="mt-6 max-w-xs mx-auto">
          <div className="flex justify-between text-xs font-semibold mb-2">
            <span className="text-muted-foreground">{completed.size} of {UNLOCK_ITEMS.length} completed</span>
            <span className="text-primary">{progress}%</span>
          </div>
          <div className="h-2.5 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </section>

      {/* Recommended order */}
      <section className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-bold text-sm mb-3">📋 Recommended order</h3>
        <div className="flex flex-wrap gap-2">
          {["bank", "sim", "pix", "food", "govbr"].map((id, i) => {
            const item = UNLOCK_ITEMS.find((u) => u.id === id)!;
            return (
              <span key={id} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                completed.has(id) ? "bg-primary/10 border-primary/20 text-primary line-through opacity-60" : "bg-secondary border-border"
              }`}>
                <span>{i + 1}.</span> {item.icon} {item.title}
              </span>
            );
          })}
        </div>
      </section>

      {/* Items */}
      <div className="space-y-3">
        {UNLOCK_ITEMS.map((item) => {
          const isExpanded = expandedId === item.id;
          const isDone = completed.has(item.id);

          return (
            <div key={item.id} className={`bg-card border rounded-2xl overflow-hidden transition-all ${isDone ? "border-primary/20 opacity-80" : "border-border"}`}>
              <button
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="w-full flex items-center gap-4 p-5 text-left"
              >
                <button
                  onClick={(e) => { e.stopPropagation(); toggleComplete(item.id); }}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border-2 transition-all ${
                    isDone ? "bg-primary border-primary text-primary-foreground" : "border-border hover:border-primary/50"
                  }`}
                >
                  {isDone && <span className="text-xs font-bold">✓</span>}
                </button>
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`font-bold text-sm ${isDone ? "line-through" : ""}`}>{item.title}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${DIFFICULTY_COLORS[item.difficulty]}`}>{item.difficulty}</span>
                    <span className="text-[10px] text-muted-foreground font-medium">⏱ {item.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.summary}</p>
                </div>
                <span className={`text-muted-foreground transition-transform shrink-0 ${isExpanded ? "rotate-180" : ""}`}>▾</span>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 border-t border-border pt-4 animate-slide-in">
                  <div className="space-y-2.5 mb-4">
                    {item.steps.map((s, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">{i + 1}</span>
                        <p className="text-sm leading-relaxed">{s}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-secondary rounded-xl p-3 mb-4">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-bold text-primary">💡 Pro tip:</span> {item.tip}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {item.link && (
                      <a
                        href={item.link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
                      >
                        {item.link.label} ↗
                      </a>
                    )}
                    <button
                      onClick={() => toggleComplete(item.id)}
                      className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isDone
                          ? "bg-secondary text-foreground hover:bg-secondary/80"
                          : "bg-primary/10 text-primary hover:bg-primary/20"
                      }`}
                    >
                      {isDone ? "Mark as not done" : "✓ Mark as done"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-muted-foreground text-center mt-2">
        Some links above are affiliate partnerships — we may earn a small commission at no extra cost to you. We only recommend services we genuinely believe help foreigners in Brazil.
      </p>
    </div>
  );
};

export default UnlockGuide;
