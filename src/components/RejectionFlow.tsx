import { useState } from "react";
import { type OnboardingData } from "@/lib/onboarding-data";

type Location =
  | "online"
  | "correios"
  | "banco_brasil"
  | "caixa"
  | "receita"
  | "cartorio";

type Reason =
  | "document_rejected"
  | "form_error"
  | "come_back"
  | "wouldnt_process"
  | "online_nothing"
  | "dont_know";

type RootCause = "A" | "B" | "C" | "D" | "E" | "F" | "G";

const LOCATIONS: { id: Location; label: string; icon: string }[] = [
  { id: "online", label: "Online (Receita Federal website)", icon: "💻" },
  { id: "correios", label: "In person. Correios", icon: "📮" },
  { id: "banco_brasil", label: "In person. Banco do Brasil", icon: "🏦" },
  { id: "caixa", label: "In person. Caixa Econômica", icon: "🏛️" },
  { id: "receita", label: "In person. Receita Federal office", icon: "🏢" },
  { id: "cartorio", label: "In person. Cartório", icon: "📜" },
];

const REASONS: { id: Reason; label: string; icon: string }[] = [
  { id: "document_rejected", label: "My document was rejected", icon: "📄" },
  { id: "form_error", label: "My form had an error", icon: "📝" },
  { id: "come_back", label: "I was told to come back with something different", icon: "🔄" },
  { id: "wouldnt_process", label: "I showed up and they wouldn't process me", icon: "🚪" },
  { id: "online_nothing", label: "I applied online and nothing happened", icon: "⏳" },
  { id: "dont_know", label: "I don't know. they just said no", icon: "❓" },
];

// Eligible nationalities for online CPF
const ONLINE_ELIGIBLE = new Set([
  "Argentine", "Uruguayan", "Paraguayan", "Venezuelan", "Colombian",
  "Peruvian", "Chilean", "Bolivian", "Ecuadorian", "Guyanese", "Surinamese",
]);

function diagnose(location: Location, reason: Reason, nationality?: string): RootCause {
  if (reason === "wouldnt_process") return "D";
  if (reason === "come_back") return "C";
  if (reason === "online_nothing") {
    if (nationality && !ONLINE_ELIGIBLE.has(nationality)) return "E";
    return "F";
  }
  if (reason === "form_error") return "G";
  if (reason === "document_rejected" && location !== "online") return "B";
  if (reason === "dont_know") return "A"; // most common
  return "A";
}

const LOCATION_LABELS: Record<Location, string> = {
  online: "the Receita Federal website",
  correios: "Correios",
  banco_brasil: "Banco do Brasil",
  caixa: "Caixa Econômica",
  receita: "Receita Federal",
  cartorio: "Cartório",
};

// ─── Root cause diagnosis content ───

interface DiagnosisProps {
  cause: RootCause;
  location: Location;
  data: OnboardingData | null;
  motherNameOverride: string;
  onMotherNameChange: (v: string) => void;
  onGoToActionPlan: () => void;
}

const DiagnosisScreen = ({ cause, location, data, motherNameOverride, onMotherNameChange, onGoToActionPlan }: DiagnosisProps) => {
  const [checkedFields, setCheckedFields] = useState<Set<number>>(new Set());
  const toggleField = (i: number) => {
    setCheckedFields(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const locationLabel = LOCATION_LABELS[location];

  const content: Record<RootCause, React.ReactNode> = {
    A: (
      <div className="space-y-4">
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <h3 className="font-bold text-sm mb-1">Most common rejection reason</h3>
          <p className="text-sm text-muted-foreground">
            Your mother's name must be written exactly as it appears on her birth certificate. no initials, no abbreviations. "Maria J. Santos" or "M. João Santos" will be rejected.
          </p>
        </div>
        {data?.motherName && (
          <div className="bg-secondary rounded-xl p-4">
            <p className="text-xs text-muted-foreground font-semibold mb-1">Name you previously entered:</p>
            <p className="font-mono font-bold">{data.motherName}</p>
          </div>
        )}
        <div>
          <label className="text-sm font-semibold block mb-2">Enter her full name with no abbreviations:</label>
          <input
            type="text"
            value={motherNameOverride}
            onChange={(e) => onMotherNameChange(e.target.value)}
            placeholder="e.g. Maria Joana Santos de Oliveira"
            className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>
      </div>
    ),
    B: (
      <div className="space-y-4">
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <h3 className="font-bold text-sm mb-1">Original documents required</h3>
          <p className="text-sm text-muted-foreground">
            {locationLabel} requires original documents. Certified copies from a cartório are accepted at most locations.
          </p>
        </div>
        <div className="bg-secondary rounded-xl p-4 space-y-2">
          <h4 className="font-semibold text-sm">What is a cartório?</h4>
          <p className="text-xs text-muted-foreground">
            A cartório is a Brazilian notary office. they certify copies of documents as authentic. You can find one in virtually every neighbourhood.
          </p>
          <p className="text-xs font-semibold text-primary">💰 Cost: approximately R$30–50 per document</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <h4 className="font-semibold text-sm mb-2">📍 Find your nearest cartório</h4>
          <p className="text-xs text-muted-foreground mb-3">
            Search for "cartório" near {data?.city || "your city"} on Google Maps.
          </p>
          <a
            href={`https://www.google.com/maps/search/cartório+${encodeURIComponent(data?.city || "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
          >
            📍 Open in Google Maps
          </a>
        </div>
      </div>
    ),
    C: (
      <div className="space-y-4">
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <h3 className="font-bold text-sm mb-1">Proof of address rejected</h3>
          <p className="text-sm text-muted-foreground">Here's exactly what counts as valid proof of address:</p>
        </div>
        <div className="space-y-2">
          {[
            { icon: "📃", title: "Rental contract", desc: "With your name on it" },
            { icon: "💡", title: "Utility bill", desc: "Água, luz, or gás in your name" },
            { icon: "🏠", title: "Airbnb confirmation", desc: "Must show your full name AND the complete Brazilian address" },
            { icon: "✍️", title: "Declaração de residência", desc: "A signed letter from whoever you're staying with, notarised at a cartório" },
          ].map((doc) => (
            <div key={doc.title} className="bg-secondary rounded-xl p-3 flex items-start gap-3">
              <span className="text-lg">{doc.icon}</span>
              <div>
                <h4 className="font-semibold text-sm">{doc.title}</h4>
                <p className="text-xs text-muted-foreground">{doc.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-primary/5 border border-primary/15 rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-3">
            <strong>💡 Tip:</strong> The declaração de residência is your best option if you're staying with friends or in an Airbnb. Take it to any cartório to have it notarised. costs roughly R$30–50.
          </p>
          <p className="text-xs text-muted-foreground">
            Your Ready Pack can generate this letter for you. check the Documents tab.
          </p>
        </div>
      </div>
    ),
    D: (
      <div className="space-y-4">
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <h3 className="font-bold text-sm mb-1">This location doesn't process foreigners</h3>
          <p className="text-sm text-muted-foreground">
            Not every branch handles CPF applications for foreign nationals. You need a location that's verified to accept foreigners.
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <h4 className="font-semibold text-sm">✅ Verified foreigner-friendly offices near {data?.city || "you"}</h4>
          <p className="text-xs text-muted-foreground">
            Your Ready Pack's "Where to go" tab shows the recommended office for your state. one that's confirmed to process foreign CPF applications.
          </p>
          <div className="bg-primary/5 rounded-lg p-3">
            <p className="text-xs font-semibold">💡 Capital city Receita Federal offices almost always accept walk-ins for foreigners. Try the largest office in your state capital.</p>
          </div>
        </div>
      </div>
    ),
    E: (
      <div className="space-y-4">
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <h3 className="font-bold text-sm mb-1">Online process unavailable for your nationality</h3>
          <p className="text-sm text-muted-foreground">
            The online CPF process only works for nationals of specific countries (mainly Mercosul members). Based on your nationality ({data?.nationality || ""}), you need to apply in person.
          </p>
        </div>
        <div className="bg-primary/5 border border-primary/15 rounded-xl p-4">
          <p className="text-sm font-semibold mb-2">Good news: all your data is already saved</p>
          <p className="text-xs text-muted-foreground">
            You don't need to re-enter anything. Your Ready Pack has your personalised office recommendation, documents checklist, and day-of guide all ready to go.
          </p>
        </div>
      </div>
    ),
    F: (
      <div className="space-y-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-bold text-sm mb-3">Check your application status</h3>
          <div className="space-y-3">
            {[
              "Go to servicos.receita.fazenda.gov.br",
              "Click 'Consultar Situação Cadastral no CPF'",
              "Enter your CPF number or protocol number",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0 text-xs font-bold">{i + 1}</span>
                <p className="text-sm">{step}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-secondary rounded-xl p-4 space-y-2">
          <h4 className="font-semibold text-sm">What each status means:</h4>
          {[
            { status: "Regular", desc: "Your CPF is active. you're done! 🎉", color: "text-green-700 dark:text-green-400" },
            { status: "Pendente de regularização", desc: "Action needed. contact your nearest Receita Federal office", color: "text-amber-700 dark:text-amber-400" },
            { status: "Suspensa", desc: "Suspended. visit Receita Federal in person with your documents", color: "text-amber-700 dark:text-amber-400" },
            { status: "Cancelada", desc: "Cancelled. visit Receita Federal. This can usually be reactivated", color: "text-red-700 dark:text-red-400" },
          ].map((s) => (
            <div key={s.status} className="flex items-start gap-2">
              <span className={`text-xs font-bold ${s.color}`}>{s.status}:</span>
              <span className="text-xs text-muted-foreground">{s.desc}</span>
            </div>
          ))}
        </div>
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <h4 className="font-semibold text-sm mb-1">It's been more than 10 business days?</h4>
          <p className="text-xs text-muted-foreground">
            Don't wait any longer. Visit a Receita Federal office in person with your protocol number and all original documents. In-person processing is almost always same-day.
          </p>
        </div>
      </div>
    ),
    G: (
      <div className="space-y-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-bold text-sm mb-3">Common form errors. check each one:</h3>
          <div className="space-y-2">
            {[
              "Título Eleitoral field left blank? (must be blank for foreigners)",
              "CPF field left blank? (gets assigned. must not be pre-filled)",
              "Date of birth in DD/MM/YYYY format? (not MM/DD/YYYY)",
              "No missing accents on Portuguese name fields?",
              "Mother's name fully written out, no abbreviations?",
              "Logradouro = street name only, number goes in Número, apartment in Complemento?",
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => toggleField(i)}
                className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all ${
                  checkedFields.has(i) ? "bg-primary/5 border border-primary/10" : "bg-secondary"
                }`}
              >
                <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold border-2 transition-all ${
                  checkedFields.has(i) ? "border-primary bg-primary text-primary-foreground" : "border-border"
                }`}>
                  {checkedFields.has(i) ? "✓" : ""}
                </div>
                <span className={`text-sm ${checkedFields.has(i) ? "line-through opacity-60" : ""}`}>{item}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="bg-primary/5 border border-primary/15 rounded-xl p-4">
          <p className="text-xs text-muted-foreground">
            <strong>💡 Tip:</strong> Your Ready Pack pre-fills the form correctly. Compare your submitted form against the pre-filled version in your Documents tab.
          </p>
        </div>
      </div>
    ),
  };

  const CAUSE_TITLES: Record<RootCause, string> = {
    A: "Mother's name abbreviation",
    B: "Original documents required",
    C: "Proof of address issue",
    D: "Office doesn't process foreigners",
    E: "Online not available for your nationality",
    F: "Online application status",
    G: "Form field errors",
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="bg-primary/5 border border-primary/15 rounded-2xl p-6">
        <span className="text-xs font-bold text-primary uppercase tracking-wider">Diagnosis</span>
        <h2 className="text-xl font-extrabold mt-1">{CAUSE_TITLES[cause]}</h2>
      </div>
      {content[cause]}
      <button
        onClick={onGoToActionPlan}
        className="w-full bg-primary text-primary-foreground px-6 py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all"
      >
        See my action plan →
      </button>
    </div>
  );
};

// ─── Action plan ───

const ACTION_PLANS: Record<RootCause, { estimate: string; steps: string[] }> = {
  A: {
    estimate: "1 visit",
    steps: [
      "Download your corrected form from the Documents tab",
      "Print it. black and white is fine",
      "Return to the same office. no new appointment needed for resubmissions at most offices",
      "Bring: passport (original), corrected form, proof of address",
      "Explain you're correcting a previous submission",
    ],
  },
  B: {
    estimate: "1–2 days",
    steps: [
      "Visit a cartório near you to get certified copies (cópia autenticada)",
      "Bring the original documents. they'll create certified copies on the spot",
      "Cost: approximately R$30–50 per document",
      "Return to the office with both originals AND certified copies",
      "Bring: passport (original + certified copy), proof of address (original + certified copy)",
    ],
  },
  C: {
    estimate: "1–3 days",
    steps: [
      "Get one of the accepted proof of address documents listed above",
      "If using a declaração de residência: get it signed by your host and take it to a cartório for notarisation",
      "Print the document. bring the original if it's a contract or bill",
      "Return to the office with your corrected proof of address",
      "Bring: passport, original form, new proof of address",
    ],
  },
  D: {
    estimate: "1 visit at the right location",
    steps: [
      "Check your Ready Pack's 'Where to go' tab for verified foreigner-friendly offices",
      "Try the largest Receita Federal office in your state capital",
      "Arrive early. before 9 AM is ideal",
      "Bring all your original documents: passport, proof of address, any previous forms",
      "Ask for: 'Inscrição no CPF para estrangeiro, por favor'",
    ],
  },
  E: {
    estimate: "1 visit in person",
    steps: [
      "Your data is already saved. go to your Ready Pack's 'Where to go' tab",
      "Visit the recommended Receita Federal office for your state",
      "Bring: passport (original), proof of address, passport copies",
      "Your pre-filled form is ready in the Documents tab. download and print it",
      "You should get your CPF the same day",
    ],
  },
  F: {
    estimate: "3–10 business days (or same day in person)",
    steps: [
      "Check your status at servicos.receita.fazenda.gov.br",
      "If status shows 'Regular'. you're done, your CPF is active",
      "If status shows 'Pendente'. visit a Receita Federal office with your protocol number",
      "If it's been more than 10 business days. go in person, don't wait",
      "Bring: passport, protocol number, proof of address",
    ],
  },
  G: {
    estimate: "1 visit",
    steps: [
      "Review the form error checklist above and identify what was wrong",
      "Download the corrected form from your Ready Pack's Documents tab",
      "Print it. black and white is fine",
      "Return to the same office. resubmissions usually don't need a new appointment",
      "Bring: passport (original), corrected form, proof of address",
    ],
  },
};

// ─── Main component ───

const RejectionFlow = ({ onClose, data }: { onClose: () => void; data?: OnboardingData | null }) => {
  const [screen, setScreen] = useState<"triage" | "diagnosis" | "action">("triage");
  const [location, setLocation] = useState<Location | null>(null);
  const [reason, setReason] = useState<Reason | null>(null);
  const [motherNameOverride, setMotherNameOverride] = useState(data?.motherName || "");
  const [rootCause, setRootCause] = useState<RootCause | null>(null);

  const handleNext = () => {
    if (!location || !reason) return;
    const cause = diagnose(location, reason, data?.nationality);
    setRootCause(cause);
    setScreen("diagnosis");
  };

  if (screen === "action" && rootCause) {
    const plan = ACTION_PLANS[rootCause];
    return (
      <div className="space-y-6 animate-slide-in">
        <section className="bg-card border border-border rounded-3xl p-8">
          <button onClick={() => setScreen("diagnosis")} className="text-sm text-muted-foreground hover:text-foreground mb-4 font-medium">← Back to diagnosis</button>
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-lg text-xs font-bold">⏱ Estimated: {plan.estimate}</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Your action plan</h2>
          <p className="text-sm text-muted-foreground mt-1">Follow these steps exactly and you'll have your CPF.</p>
        </section>

        <section className="bg-card border border-border rounded-2xl p-6">
          <div className="space-y-4">
            {plan.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center shrink-0 text-sm font-bold">{i + 1}</span>
                <p className="text-sm leading-relaxed pt-1">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-primary text-primary-foreground px-4 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all"
          >
            Back to my guide →
          </button>
        </div>
      </div>
    );
  }

  if (screen === "diagnosis" && rootCause) {
    return (
      <div className="space-y-6 animate-slide-in">
        <section className="bg-card border border-border rounded-3xl p-8">
          <button onClick={() => setScreen("triage")} className="text-sm text-muted-foreground hover:text-foreground mb-4 font-medium">← Change answers</button>
          <h1 className="text-2xl font-extrabold tracking-tight">Here's what we found</h1>
        </section>
        <DiagnosisScreen
          cause={rootCause}
          location={location!}
          data={data || null}
          motherNameOverride={motherNameOverride}
          onMotherNameChange={setMotherNameOverride}
          onGoToActionPlan={() => setScreen("action")}
        />
      </div>
    );
  }

  // Screen 1: Triage
  return (
    <div className="space-y-6 animate-slide-in">
      <section className="bg-card border border-border rounded-3xl p-8">
        <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground mb-4 font-medium">← Back to guide</button>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Let's fix this.</h1>
        <p className="text-muted-foreground mt-2 max-w-lg">
          Most rejections come down to one small thing. Tell us what happened and we'll give you the exact next step. no guessing.
        </p>
      </section>

      {/* Question 1 */}
      <section className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-bold mb-4">Where did you apply?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {LOCATIONS.map((loc) => (
            <button
              key={loc.id}
              onClick={() => setLocation(loc.id)}
              className={`flex items-center gap-3 p-4 rounded-xl text-left transition-all border ${
                location === loc.id
                  ? "bg-primary/5 border-primary/30 ring-2 ring-primary/20"
                  : "bg-secondary border-border hover:border-primary/20"
              }`}
            >
              <span className="text-xl">{loc.icon}</span>
              <span className="text-sm font-medium">{loc.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Question 2 */}
      <section className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-bold mb-4">What reason were you given?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {REASONS.map((r) => (
            <button
              key={r.id}
              onClick={() => setReason(r.id)}
              className={`flex items-center gap-3 p-4 rounded-xl text-left transition-all border ${
                reason === r.id
                  ? "bg-primary/5 border-primary/30 ring-2 ring-primary/20"
                  : "bg-secondary border-border hover:border-primary/20"
              }`}
            >
              <span className="text-xl">{r.icon}</span>
              <span className="text-sm font-medium">{r.label}</span>
            </button>
          ))}
        </div>
      </section>

      <button
        onClick={handleNext}
        disabled={!location || !reason}
        className="w-full bg-primary text-primary-foreground px-6 py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next →
      </button>
    </div>
  );
};

export default RejectionFlow;
