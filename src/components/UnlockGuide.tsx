import { useState, useEffect } from "react";

type Difficulty = "Easy" | "Medium" | "Hard";

type UnlockItem = {
  id: string;
  title: string;
  difficulty: Difficulty;
  time: string;
  summary: string;
  steps: string[];
  tips: string[];
  link?: { label: string; url: string };
  note?: string;
};

type Category = {
  id: string;
  title: string;
  icon: string;
  items: UnlockItem[];
};

const CATEGORIES: Category[] = [
  {
    id: "banking", title: "Banking", icon: "🏦",
    items: [
      {
        id: "nubank", title: "Nubank", difficulty: "Easy", time: "10 minutes",
        summary: "Brazil's most popular digital bank. zero fees, instant Pix, and a debit/credit card.",
        steps: [
          "Download the Nubank app (iOS or Android)",
          "Tap 'Abrir conta' (Open account)",
          "Enter your CPF number",
          "Take a selfie and a photo of your passport bio page",
          "Wait 1–2 business days for approval",
          "Your card arrives by post in 7–10 days",
        ],
        tips: ["Use your Brazilian address for card delivery. If rejected, wait 30 days and try Inter."],
        link: { label: "Download Nubank", url: "https://nubank.com.br" },
      },
      {
        id: "inter", title: "Inter", difficulty: "Easy", time: "15 minutes",
        summary: "Great backup if Nubank doesn't approve you. Also fully digital.",
        steps: [
          "Download the Inter app",
          "Select 'Abrir conta' and enter your CPF",
          "Upload passport photo and take a selfie",
          "Wait for approval. usually 1–3 business days",
        ],
        tips: ["Inter has a good international transfer feature and multi-currency account."],
        link: { label: "Download Inter", url: "https://inter.co" },
      },
      {
        id: "c6", title: "C6 Bank", difficulty: "Easy", time: "15 minutes",
        summary: "Good for international transfers and multi-currency accounts.",
        steps: [
          "Download the C6 Bank app",
          "Create account with CPF and passport",
          "Verify identity via selfie",
          "Account typically approved within 24 hours",
        ],
        tips: ["C6 Global lets you hold USD and EUR. useful for receiving foreign income."],
        link: { label: "Download C6", url: "https://www.c6bank.com.br" },
      },
      {
        id: "traditional", title: "Traditional banks (Itaú, Bradesco, Santander)", difficulty: "Hard", time: "1–2 weeks",
        summary: "Usually requires proof of Brazilian income or a guarantor.",
        steps: [
          "Visit a branch with CPF, passport, proof of address, and proof of income",
          "Speak with a gerente (manager). they handle account openings",
          "Expect to provide additional documentation and possibly a guarantor",
          "Processing takes 1–2 weeks",
        ],
        tips: ["Not recommended as a first step for foreigners. Start with Nubank, then open a traditional account later if needed."],
        note: "Usually requires proof of Brazilian income or a guarantor. Not recommended as a first step.",
      },
    ],
  },
  {
    id: "sim", title: "SIM card", icon: "📱",
    items: [
      {
        id: "sim-plan", title: "Get a proper monthly plan", difficulty: "Easy", time: "30 minutes",
        summary: "With your CPF you can get a real postpaid plan instead of expensive prepaid.",
        steps: [
          "Go to any Vivo, Claro, TIM, or Oi store (found in any shopping mall)",
          "Bring your passport and CPF number",
          "Ask for a plano pós-pago (postpaid plan)",
          "They'll run a quick credit check. having a Nubank card improves approval",
          "SIM activates on the spot. you'll have a Brazilian number immediately",
        ],
        tips: [
          "Vivo has the best national coverage. Claro is strongest in São Paulo.",
          "Prepaid (pré-pago): R$15–30/month, limited data. Postpaid (pós-pago): R$50–100/month, much better value.",
        ],
        link: { label: "Get Airalo eSIM while you wait", url: "https://www.airalo.com" },
      },
    ],
  },
  {
    id: "housing", title: "Where to live", icon: "🏠",
    items: [
      {
        id: "quintoandar", title: "QuintoAndar", difficulty: "Medium", time: "1–3 days",
        summary: "The most foreigner-friendly rental platform. no guarantor needed.",
        steps: [
          "Create an account at quintoandar.com.br with your CPF",
          "Filter listings by 'sem fiador' (no guarantor)",
          "Apply. they check background and financials",
          "Sign the contract digitally",
        ],
        tips: ["Have your Nubank card active first. it strengthens your application."],
        link: { label: "Browse QuintoAndar", url: "https://www.quintoandar.com.br" },
      },
      {
        id: "airbnb-long", title: "Airbnb long-stay", difficulty: "Easy", time: "Immediate",
        summary: "Stays over 28 days often get significant discounts. Good bridge option.",
        steps: [
          "Search on Airbnb for stays of 28+ days",
          "Many hosts offer 30–50% monthly discounts",
          "Good option while searching for permanent housing",
        ],
        tips: ["Negotiate directly with hosts for even better monthly rates."],
        link: { label: "Browse Airbnb", url: "https://www.airbnb.com" },
      },
      {
        id: "seguro-fianca", title: "Seguro fiança (rental insurance)", difficulty: "Medium", time: "1 week",
        summary: "Replaces the need for a guarantor. Porto Seguro is the main provider.",
        steps: [
          "Contact Porto Seguro or another insurance provider",
          "They assess your financial profile",
          "Cost: roughly one month's rent per year",
          "Once approved, you can sign leases without a fiador (guarantor)",
        ],
        tips: ["This is the standard alternative to finding a Brazilian guarantor."],
        link: { label: "Get a quote from Porto Seguro", url: "https://www.portoseguro.com.br/seguro-fianca-locaticia" },
      },
    ],
  },
  {
    id: "transport", title: "Getting around", icon: "🚗",
    items: [
      {
        id: "ride-apps", title: "Uber and 99", difficulty: "Easy", time: "5 minutes",
        summary: "Add your Nubank card to the app. Done.",
        steps: [
          "Download Uber and 99 (both widely used in Brazil)",
          "Add your Nubank card as payment method",
          "99 is often 20–30% cheaper than Uber. compare prices",
        ],
        tips: ["Download inDrive too. you negotiate the price with the driver. Good for airport rides."],
        link: { label: "Download 99", url: "https://99app.com" },
      },
      {
        id: "driving-foreign", title: "Driving with a foreign licence", difficulty: "Easy", time: "Immediate",
        summary: "Valid for up to 180 days from entry. After that you need a Brazilian CNH.",
        steps: [
          "Your foreign licence + international driving permit (IDP) is valid for 180 days",
          "Get an IDP before travelling if you don't have one",
          "After 180 days, you must convert to a Brazilian CNH",
        ],
        tips: ["Keep your IDP and passport with you when driving. police may ask for both."],
      },
      {
        id: "cnh", title: "Converting to a Brazilian CNH", difficulty: "Hard", time: "2–4 months",
        summary: "Start early. most people underestimate the timeline.",
        steps: [
          "Get your licence translated by a sworn translator (tradutor juramentado)",
          "Take it to DETRAN in your state",
          "Pass a medical exam (exame médico)",
          "Pass a psychological exam (exame psicotécnico)",
          "Pay state fees. roughly R$800–1,200 depending on state",
          "Wait for processing. 2–4 months total",
        ],
        tips: ["Start this process as soon as you decide to stay long-term. DETRAN appointments can take weeks to schedule."],
      },
    ],
  },
  {
    id: "food", title: "Food and delivery", icon: "🍔",
    items: [
      {
        id: "ifood", title: "iFood", difficulty: "Easy", time: "5 minutes",
        summary: "Brazil's biggest delivery app. like Uber Eats but better here.",
        steps: [
          "Download iFood (iOS or Android)",
          "Create account with your CPF and Brazilian phone number",
          "Add your Nubank card as payment",
          "Order from thousands of restaurants",
        ],
        tips: ["iFood Club subscription gives free delivery. worth it if you order 4+ times a month. Check the coupons section before every order."],
        link: { label: "Download iFood", url: "https://www.ifood.com.br" },
      },
      {
        id: "rappi", title: "Rappi", difficulty: "Easy", time: "5 minutes",
        summary: "Good alternative. Also covers groceries and pharmacy delivery.",
        steps: [
          "Download Rappi and create account with CPF",
          "Add payment method",
          "Browse restaurants, groceries, and pharmacies",
        ],
        tips: ["Rappi sometimes has different restaurant coverage than iFood. worth having both."],
        link: { label: "Download Rappi", url: "https://www.rappi.com.br" },
      },
    ],
  },
  {
    id: "fitness", title: "Fitness & Gym", icon: "🏋️",
    items: [
      {
        id: "smartfit", title: "Smart Fit", difficulty: "Easy", time: "15 minutes",
        summary: "Brazil's biggest gym chain. Over 1,000 locations. CPF required for sign-up.",
        steps: [
          "Visit any Smart Fit location or download the Smart Fit app",
          "Choose your plan: Smart (R$99/mo, one gym), Black (R$149/mo, any gym), Black+ (R$179/mo, with guest privileges)",
          "Register with your CPF, passport, and Brazilian phone number",
          "Payment via credit card or Pix. no cash option",
          "Access with the app QR code or your registered CPF at the turnstile",
        ],
        tips: [
          "Black plan lets you use any Smart Fit in Brazil. great if you travel between cities.",
          "Annual plans are 20–30% cheaper but require commitment.",
          "Most gyms are 24/7 or open 6 AM to 11 PM.",
        ],
        link: { label: "Smart Fit plans", url: "https://www.smartfit.com.br" },
      },
      {
        id: "bluefit", title: "BlueFit", difficulty: "Easy", time: "15 minutes",
        summary: "Budget alternative. cheaper than Smart Fit with decent equipment.",
        steps: [
          "Find a BlueFit near you on their website",
          "Visit in person or sign up online with CPF",
          "Plans from R$59/month",
        ],
        tips: ["Good option if Smart Fit is too far. Equipment is basic but gets the job done."],
        link: { label: "BlueFit locations", url: "https://www.bluefit.com.br" },
      },
      {
        id: "gympass", title: "Wellhub (ex-Gympass)", difficulty: "Easy", time: "10 minutes",
        summary: "One membership, hundreds of gyms and studios. Like ClassPass for Brazil.",
        steps: [
          "Download the Wellhub app",
          "Create account with your CPF",
          "Choose a plan (from R$39/month)",
          "Check in at any partner gym using the app",
        ],
        tips: [
          "Some employers offer Wellhub as a benefit. Ask your company.",
          "Great for trying different gyms, yoga studios, CrossFit boxes, and pools.",
        ],
        link: { label: "Download Wellhub", url: "https://www.wellhub.com" },
      },
    ],
  },
  {
    id: "coworking", title: "Working & coworking", icon: "💻",
    items: [
      {
        id: "wework", title: "WeWork", difficulty: "Easy", time: "10 minutes",
        summary: "Available in SP, RJ, BH. Day passes or monthly. CPF required for membership.",
        steps: [
          "Visit wework.com.br or the WeWork app",
          "Book a day pass or tour a space",
          "Sign up with CPF and credit card",
        ],
        tips: ["Day passes start around R$80. Monthly hot desk from R$600. SP has the most locations."],
        link: { label: "WeWork Brazil", url: "https://www.wework.com.br" },
      },
      {
        id: "coworking-local", title: "Local coworking spaces", difficulty: "Easy", time: "15 minutes",
        summary: "Every major city has independent coworking spaces. Often cheaper and more social than WeWork.",
        steps: [
          "Search Google Maps for 'coworking' in your area",
          "Visit for a free trial day (most offer one)",
          "Sign up with CPF. Monthly plans from R$200–500",
        ],
        tips: [
          "In SP: check out Spaces (Av. Paulista), Civi-co, or Impact Hub.",
          "In Floripa: check Village coworking, Hashtag, or Vilaj.",
          "Ask about community events. the networking is often more valuable than the desk.",
        ],
      },
    ],
  },
  {
    id: "shopping", title: "Shopping", icon: "🛍️",
    items: [
      {
        id: "mercadolivre", title: "Mercado Livre", difficulty: "Easy", time: "10 minutes",
        summary: "Brazil's biggest marketplace. like eBay + Amazon combined.",
        steps: [
          "Create account at mercadolivre.com.br with your CPF",
          "Add payment method (Nubank card or Pix)",
          "Look for 'Full' listings for faster delivery",
          "Learn parcelamento. split purchases into up to 12 interest-free monthly installments",
        ],
        tips: ["Parcelamento is how most Brazilians buy everything. That R$1,200 item? Pay R$100/month for 12 months with zero interest. It's completely normal here."],
        link: { label: "Browse Mercado Livre", url: "https://www.mercadolivre.com.br" },
      },
      {
        id: "amazon-br", title: "Amazon Brazil", difficulty: "Easy", time: "10 minutes",
        summary: "Smaller selection than Mercado Livre but reliable for certain categories.",
        steps: [
          "Go to amazon.com.br and create account with CPF",
          "Add payment method",
          "Prime membership available for free delivery",
        ],
        tips: ["Amazon BR has a smaller catalogue than the US version but is growing fast."],
        link: { label: "Browse Amazon BR", url: "https://www.amazon.com.br" },
      },
    ],
  },
  {
    id: "health", title: "Healthcare", icon: "🏥",
    items: [
      {
        id: "health-insurance", title: "Private health insurance", difficulty: "Medium", time: "1–2 weeks",
        summary: "Plano de saúde. covers private hospitals and clinics.",
        steps: [
          "Get quotes from at least 3 providers (Unimed, Bradesco Saúde, SulAmérica, Amil)",
          "Check their hospital network (rede credenciada) for your city",
          "Sign up. requires CPF, passport, and Brazilian address",
          "Most plans activate within 24–48 hours for basic coverage",
        ],
        tips: [
          "Cost range: R$400–900/month for an individual depending on age and coverage.",
          "Unimed has the widest hospital network nationally.",
          "For stays under 6 months, travel insurance (SafetyWing) is cheaper and easier.",
        ],
        link: { label: "Get SafetyWing (short stays)", url: "https://safetywing.com" },
      },
    ],
  },
  {
    id: "government", title: "Government access", icon: "🏛️",
    items: [
      {
        id: "govbr", title: "Gov.br account", difficulty: "Medium", time: "20 minutes",
        summary: "Your digital government ID. unlocks dozens of public services.",
        steps: [
          "Go to gov.br or download the Gov.br app",
          "Click 'Crie sua conta' and enter your CPF",
          "Verify identity via your bank app (Nubank and Inter both support this. easiest method)",
          "Enable two-factor authentication",
        ],
        tips: ["Unlocks: digital signatures, tax returns, social security queries, driving licence services, voter registration."],
        link: { label: "Create Gov.br account", url: "https://www.gov.br" },
      },
      {
        id: "tax", title: "Tax return (IRPF)", difficulty: "Hard", time: "Varies",
        summary: "Required if you stay more than 183 days in a 12-month period.",
        steps: [
          "After 183 days, you become a Brazilian tax resident",
          "You must file an annual income tax return (IRPF)",
          "Download the IRPF program from Receita Federal's website",
          "Declare all worldwide income",
          "Filing deadline is usually April 30th each year",
        ],
        tips: ["Consult a Brazilian accountant (contador). tax rules for foreigners are complex. Don't try to figure this out alone."],
        note: "Only applies if you stay more than 183 days in a 12-month period.",
      },
    ],
  },
  {
    id: "finance", title: "Finance & transfers", icon: "💸",
    items: [
      {
        id: "pix", title: "Set up Pix", difficulty: "Easy", time: "5 minutes",
        summary: "Free instant payments. used absolutely everywhere in Brazil. This is the #1 thing you'll use daily.",
        steps: [
          "Open your bank app (Nubank, Inter, etc.)",
          "Go to the Pix section and register a Pix key (chave Pix)",
          "Register your CPF as your main key. this is what people will ask for",
          "You can also register your phone number or email as additional keys",
          "To pay: scan a QR code, enter a Pix key, or use 'Pix copia e cola' (copy and paste)",
          "To receive: share your QR code or tell them your CPF",
        ],
        tips: [
          "Pix has replaced cash in most of Brazil. Street vendors, restaurants, taxis, rent, splitting bills. everyone uses it.",
          "Pix is free for individuals. no fees, no limits, instant 24/7 including weekends and holidays.",
          "You can set daily Pix limits in your bank app for security (recommended: R$1,000–3,000).",
          "If someone asks for your 'chave' they mean your Pix key. Give them your CPF number.",
        ],
      },
      {
        id: "wise", title: "Wise (international transfers)", difficulty: "Easy", time: "15 minutes",
        summary: "Real exchange rate with minimal fees. essential for receiving income from abroad.",
        steps: [
          "Create or update your Wise account with your Brazilian CPF",
          "Add your Brazilian bank account as a withdrawal destination",
          "Send money at the mid-market rate with ~0.5–1% fee",
        ],
        tips: ["Banks charge 3–5% spread plus fees. Wise saves you hundreds per month if you're earning in USD/EUR."],
        link: { label: "Open Wise", url: "https://wise.com" },
      },
      {
        id: "investing", title: "Brazilian investment account", difficulty: "Medium", time: "30 minutes",
        summary: "Brazilian fixed income currently offers strong returns (10%+ annually).",
        steps: [
          "Download XP Investimentos, Rico, or BTG Pactual app",
          "Create account with CPF, passport, and proof of address",
          "Start with Tesouro Direto (government bonds) or CDB (bank certificates)",
          "Both are very safe and pay well above most foreign savings accounts",
        ],
        tips: ["Consult a Brazilian accountant before investing significant amounts. there are additional tax considerations for foreigners."],
        note: "Recommended for long-term stays. Investment income in Brazil is taxed.",
      },
    ],
  },
];

const ALL_ITEMS = CATEGORIES.flatMap((c) => c.items);
const EASY_ITEMS = ALL_ITEMS.filter((i) => i.difficulty === "Easy");

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  Easy: "bg-green-100 text-green-800",
  Medium: "bg-amber-100 text-amber-800",
  Hard: "bg-red-100 text-red-800",
};

const UnlockGuide = () => {
  const [completed, setCompleted] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem("cpf-unlock-completed");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch { return new Set(); }
  });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("cpf-unlock-completed", JSON.stringify([...completed]));
  }, [completed]);

  const toggleComplete = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const progress = Math.round((completed.size / ALL_ITEMS.length) * 100);
  const allEasyDone = EASY_ITEMS.every((i) => completed.has(i.id));
  const allDone = ALL_ITEMS.every((i) => completed.has(i.id));

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Affiliate disclosure */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs text-gray-500 text-center">
        Some links below are affiliate links. We may earn a commission at no extra cost to you.
      </div>
      {/* Header + progress */}
      <section className="bg-green-800/5 border border-green-800/15 rounded-3xl p-8 text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">🔓 You're in.</h2>
        <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
          Your CPF is active. Here's everything Brazil just unlocked for you.
        </p>
        <div className="mt-6 max-w-sm mx-auto">
          <div className="flex justify-between text-xs font-semibold mb-2">
            <span className="text-gray-500">{completed.size} of {ALL_ITEMS.length} completed</span>
            <span className="text-green-800">{progress}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-800 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </section>

      {/* Milestone messages */}
      {allDone && (
        <section className="bg-gradient-to-br from-green-800/10 via-green-800/5 to-transparent border border-green-800/15 rounded-2xl p-6 text-center">
          <div className="text-4xl mb-3">🎉🇧🇷</div>
          <h3 className="text-xl font-extrabold">That's everything. You're not a tourist anymore. 🇧🇷</h3>
          <p className="text-sm text-gray-500 mt-1">Every single item done. Welcome to Brazil. properly.</p>
        </section>
      )}
      {allEasyDone && !allDone && (
        <section className="bg-green-800/5 border border-green-800/15 rounded-2xl p-4 text-center">
          <p className="text-sm font-semibold">✅ You've nailed the essentials. You're set up in Brazil.</p>
          <p className="text-xs text-gray-500 mt-1">The hard part's behind you. Tackle the rest when you're ready.</p>
        </section>
      )}

      {/* Categories */}
      {CATEGORIES.map((category) => (
        <section key={category.id} className="space-y-2">
          <div className="flex items-center gap-2 px-1 mb-1">
            <span className="text-lg">{category.icon}</span>
            <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500">{category.title}</h3>
            <span className="text-[10px] text-gray-500 ml-auto">
              {category.items.filter((i) => completed.has(i.id)).length}/{category.items.length}
            </span>
          </div>
          {category.items.map((item) => {
            const isExpanded = expandedId === item.id;
            const isDone = completed.has(item.id);
            return (
              <div key={item.id} className={`bg-white border rounded-2xl overflow-hidden transition-all ${isDone ? "border-green-800/20" : "border-gray-100"}`}>
                <button
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="w-full flex items-center gap-3 p-4 text-left"
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleComplete(item.id); }}
                    className={`w-6 h-6 rounded-xl flex items-center justify-center shrink-0 border-2 transition-all ${
                      isDone ? "bg-green-800 border-green-800 text-white" : "border-gray-100 hover:border-green-800/50"
                    }`}
                  >
                    {isDone && <span className="text-xs font-bold">✓</span>}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className={`font-bold text-sm ${isDone ? "line-through opacity-60" : ""}`}>{item.title}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${DIFFICULTY_STYLES[item.difficulty]}`}>{item.difficulty}</span>
                      <span className="text-[10px] text-gray-500">⏱ {item.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{item.summary}</p>
                  </div>
                  <span className={`text-gray-500 transition-transform shrink-0 text-sm ${isExpanded ? "rotate-180" : ""}`}>▾</span>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-100 pt-4 animate-slide-in">
                    {item.note && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                        <p className="text-xs text-amber-800">⚠️ {item.note}</p>
                      </div>
                    )}
                    <div className="space-y-2 mb-4">
                      {item.steps.map((s, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="w-5 h-5 bg-green-800/10 text-green-800 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">{i + 1}</span>
                          <p className="text-sm leading-relaxed">{s}</p>
                        </div>
                      ))}
                    </div>
                    {item.tips.length > 0 && (
                      <div className="bg-gray-50 rounded-xl p-3 mb-4">
                        {item.tips.map((tip, i) => (
                          <p key={i} className="text-xs text-gray-500 mb-1 last:mb-0">
                            <span className="font-bold text-green-800">💡</span> {tip}
                          </p>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2 flex-wrap">
                      {item.link && (
                        <a
                          href={item.link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-green-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all group/ext"
                        >
                          {item.link.label} <span className="text-[10px] opacity-60 group-hover/ext:opacity-100 transition-opacity">↗ new tab</span>
                        </a>
                      )}
                      <button
                        onClick={() => toggleComplete(item.id)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          isDone ? "bg-gray-50 text-gray-900" : "bg-green-800/10 text-green-800 hover:bg-green-800/20"
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
        </section>
      ))}

      {/* Recommended affiliate tools */}
      <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold">🤝 Our recommended tools</h3>
          <p className="text-xs text-gray-500 mt-1">Handpicked services that actually help foreigners in Brazil. These are what we'd use ourselves.</p>
        </div>
        <div className="p-6 space-y-4">
          {[
            {
              icon: "💸", name: "Wise", category: "Send & Receive Money",
              desc: "Send money to and from Brazil at the real exchange rate with tiny fees. Way cheaper than bank wires or Western Union.",
              price: "From $0.50 per transfer",
              url: "https://wise.com/invite/",
              why: "Brazilian banks charge 3-5% spreads on currency. Wise gives the mid-market rate. essential for receiving income from abroad.",
            },
            {
              icon: "🏥", name: "SafetyWing", category: "Travel & Health Insurance",
              desc: "Insurance for nomads. Covers hospitals, clinics, and emergencies across Brazil. Month-to-month, cancel anytime.",
              price: "From $45/month",
              url: "https://safetywing.com/?referenceID=getcpf",
              why: "Brazil's public healthcare (SUS) is free but overcrowded. A private hospital visit can cost thousands.",
            },
            {
              icon: "📱", name: "Airalo", category: "eSIM / Mobile Data",
              desc: "Skip the carrier store. Get a Brazil eSIM in 2 minutes from your phone. works the moment you land.",
              price: "Data plans from $5",
              url: "https://www.airalo.com/?ref=getcpf",
              why: "You need a CPF to buy a physical SIM. Airalo lets you get data instantly while you sort everything else out.",
            },
            {
              icon: "🔒", name: "NordVPN", category: "VPN & Security",
              desc: "Access your home Netflix, banking apps, and streaming while in Brazil. Protects you on public WiFi too.",
              price: "From ~$3.50/month",
              url: "https://nordvpn.com/?ref=getcpf",
              why: "Many services block Brazilian IPs. NordVPN keeps your home apps working and your data safe.",
            },
            {
              icon: "🗣️", name: "Preply", category: "Learn Portuguese",
              desc: "1-on-1 video lessons with native Brazilian Portuguese tutors. Pick your teacher, schedule, and budget.",
              price: "From ~$10/hour",
              url: "https://www.preply.com/?pref=getcpf",
              why: "Even basic Portuguese changes how people treat you. A private tutor fast-tracks your confidence.",
            },
          ].map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gray-50/50 border border-gray-100 rounded-xl p-5 hover:border-green-800/30 hover:bg-green-800/5 transition-all group"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl mt-1 shrink-0">{p.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h4 className="font-bold text-sm">{p.name}</h4>
                    <span className="text-[10px] uppercase tracking-wider text-green-800 font-bold bg-green-800/10 px-2 py-0.5 rounded">{p.category}</span>
                    <span className="text-xs bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full font-medium text-gray-500">{p.price}</span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
                  <p className="text-xs text-green-800 font-semibold mt-2">✦ {p.why}</p>
                </div>
                <span className="text-gray-500 group-hover:text-green-800 transition-colors shrink-0 mt-1">↗</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <p className="text-[10px] text-gray-500 text-center mt-2">
        🤝 These are affiliate links. we may earn a small commission at no extra cost to you. We only recommend services we genuinely believe help foreigners in Brazil.
      </p>
    </div>
  );
};

export default UnlockGuide;
