import { useState } from "react";

type RejectionReason =
  | "mother_name"
  | "photocopy"
  | "wrong_address"
  | "passport_issue"
  | "online_nationality"
  | "form_errors"
  | "appointment"
  | "other";

const REJECTION_REASONS: { id: RejectionReason; label: string; icon: string }[] = [
  { id: "mother_name", label: "Mother's name was abbreviated or wrong", icon: "👩" },
  { id: "photocopy", label: "Document was a photocopy, not original", icon: "📄" },
  { id: "wrong_address", label: "Proof of address wasn't accepted", icon: "🏠" },
  { id: "passport_issue", label: "Passport wasn't accepted or recognised", icon: "🛂" },
  { id: "online_nationality", label: "Applied online but it didn't work", icon: "💻" },
  { id: "form_errors", label: "Errors on the form", icon: "📝" },
  { id: "appointment", label: "Turned away — no appointment or wrong office", icon: "🚪" },
  { id: "other", label: "Something else / not sure", icon: "❓" },
];

const FIXES: Record<RejectionReason, { title: string; urgency: string; steps: string[]; tip: string }> = {
  mother_name: {
    title: "Fix: Mother's name abbreviation",
    urgency: "Easy fix — same day",
    steps: [
      "Write your mother's FULL legal name with no abbreviations. Not 'Maria J. Santos' — write 'Maria Joana Santos'.",
      "Check your passport or birth certificate for the exact spelling.",
      "If your mother's name contains accents or special characters, include them exactly as written.",
      "Go back to the same office (or any Receita Federal) with the corrected form.",
      "You don't need a new appointment — just explain you're correcting a previous submission.",
    ],
    tip: "This is the #1 rejection reason. Brazilian bureaucracy requires full names with zero abbreviations — no initials, no shortened versions.",
  },
  photocopy: {
    title: "Fix: Original documents required",
    urgency: "Medium — may need to gather documents",
    steps: [
      "Check which document was rejected — passport copy, proof of address, or both.",
      "Most Receita Federal offices require the ORIGINAL passport (not a copy) for inspection, plus a photocopy they keep on file.",
      "For proof of address: bring the original utility bill, rental contract, or bank statement. Photocopies of these are usually not accepted alone.",
      "If your office requires a certified copy (cópia autenticada), visit any cartório (notary) — they certify copies for ~R$5–10 per page.",
      "Return to the office with originals + copies. You can go the same day if you have everything.",
    ],
    tip: "Always bring both the original AND a photocopy of every document. The officer inspects the original and keeps the copy.",
  },
  wrong_address: {
    title: "Fix: Proof of address",
    urgency: "Medium — depends on your situation",
    steps: [
      "Hotel bookings alone are often NOT accepted. You need a document showing a Brazilian residential address.",
      "Accepted options: rental contract (contrato de aluguel), utility bill in your name (conta de luz, água, internet), bank statement with Brazilian address.",
      "Staying with someone? Ask your host to write a Declaração de Residência — a signed letter saying you live at their address. Some offices require this notarised at a cartório (R$15–30).",
      "Airbnb works IF the confirmation shows your full name AND the complete Brazilian address (not just 'São Paulo').",
      "Long-stay Airbnb: ask the host to provide a utility bill + a signed declaration.",
      "Return to the office with the correct proof. No new appointment needed.",
    ],
    tip: "The declaração de residência (host declaration) is your best option if you're staying with friends or in an Airbnb. Your Ready Pack can generate one for you — check the Documents tab.",
  },
  passport_issue: {
    title: "Fix: Passport not recognised",
    urgency: "Harder — may need consular help",
    steps: [
      "If your passport is damaged (torn pages, water damage, faded photo), you may need a replacement from your country's consulate in Brazil.",
      "Some older passport formats aren't easily read by the system. Bring a backup ID if you have one (national ID card, driver's licence).",
      "For certain nationalities, the officer may not recognise the document format. Politely ask to speak to a supervisor — they handle foreign documents more regularly.",
      "If your passport is expiring soon (< 6 months), some offices may refuse it. Check if your country's consulate can issue an emergency travel document.",
      "Try a larger Receita Federal office in a bigger city — they process more foreign applications and are more familiar with unusual passport formats.",
    ],
    tip: "This is rare but stressful. Larger offices in São Paulo, Rio, and Brasília handle foreigners daily and are much more accommodating.",
  },
  online_nationality: {
    title: "Fix: Online application didn't work",
    urgency: "Easy — just go in person",
    steps: [
      "The online CPF process only works reliably for citizens of Mercosul countries (Argentina, Uruguay, Paraguay, etc.) and a few others.",
      "If you applied online and got a protocol number but nothing happened after 7+ days, the application likely stalled.",
      "Don't wait any longer — go to a Receita Federal office in person. It's faster and more reliable.",
      "Bring your protocol number (if you have one) plus all original documents.",
      "Tell the officer you already tried online — they can look up your protocol and either complete it or start fresh.",
      "In-person processing is usually same-day. You'll walk out with your CPF number.",
    ],
    tip: "The online process is unreliable for most foreigners. In-person is almost always faster — often same-day vs. weeks of waiting.",
  },
  form_errors: {
    title: "Fix: Form errors",
    urgency: "Easy fix — same day",
    steps: [
      "Common form mistakes: leaving 'Título Eleitoral' filled in (it should be BLANK for foreigners), wrong date format (use DD/MM/YYYY, not MM/DD/YYYY).",
      "Name fields must match your passport EXACTLY — including middle names, accents, and hyphens.",
      "Nationality field: use the Portuguese version. Your Ready Pack shows you the correct translation.",
      "If unsure which field caused the error, ask the officer to point it out — then correct it on the spot.",
      "You can usually fix form errors right there at the counter and resubmit immediately.",
    ],
    tip: "Your Ready Pack pre-fills the form correctly. If you filled it manually, compare it against the pre-filled version in your Documents tab.",
  },
  appointment: {
    title: "Fix: Wrong office or no appointment",
    urgency: "Easy — try again tomorrow",
    steps: [
      "Not all offices process CPFs for foreigners. Smaller offices may only handle Brazilian citizens.",
      "Check your Ready Pack's 'Where to go' tab — it shows offices confirmed to accept foreign CPF applications in your state.",
      "Some offices require appointments (agendamento) through the Receita Federal website. Your Ready Pack tells you if yours does.",
      "If you were turned away, try a larger office. Capital city offices almost always accept walk-ins for foreigners.",
      "Arrive early (before 9 AM). Offices get busier throughout the day and some stop accepting new requests after a certain time.",
      "Bring a printed copy of your scheduled appointment if you booked one online.",
    ],
    tip: "Your Ready Pack recommends offices that are confirmed foreigner-friendly. Check the 'Where to go' tab for the right one.",
  },
  other: {
    title: "Troubleshooting: Unknown rejection",
    urgency: "Varies — let's figure it out",
    steps: [
      "Try to remember exactly what the officer said. Even a few Portuguese words can help identify the issue.",
      "Common phrases: 'falta documento' (missing document), 'nome errado' (wrong name), 'precisa original' (need original), 'precisa agendamento' (need appointment).",
      "If you received any paper or printout from the office, keep it — it usually has a code or reason that explains the rejection.",
      "Try a different, larger office. Sometimes the issue is the specific officer or location, not your documents.",
      "If you're stuck, your Ready Pack's Portuguese phrases tab has phrases for exactly this situation — 'O que preciso corrigir?' (What do I need to fix?).",
      "Consider bringing a Portuguese-speaking friend or using Google Translate's conversation mode at the counter.",
    ],
    tip: "Don't give up after one rejection. Most people who were rejected get their CPF on the second try — you just need to know what to fix.",
  },
};

const RejectionFlow = ({ onClose }: { onClose: () => void }) => {
  const [step, setStep] = useState<"where" | "reason" | "fix">("where");
  const [office, setOffice] = useState("");
  const [reason, setReason] = useState<RejectionReason | null>(null);

  const fix = reason ? FIXES[reason] : null;

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <section className="bg-card border border-border rounded-3xl p-8">
        <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground mb-4 font-medium">← Back to guide</button>
        <div className="text-4xl mb-4">🔄</div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Got rejected? Let's fix it.</h1>
        <p className="text-muted-foreground mt-2 max-w-lg">
          Don't stress — most rejections have a simple fix. Answer two questions and we'll tell you exactly what to do tomorrow morning.
        </p>
      </section>

      {/* Step 1: Where */}
      {(step === "where" || step === "reason" || step === "fix") && (
        <section className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">1</span>
            <h3 className="font-bold">Where did you apply?</h3>
            {step !== "where" && <span className="text-xs text-primary font-semibold ml-auto">✓ {office}</span>}
          </div>
          {step === "where" && (
            <div className="space-y-3">
              <input
                type="text"
                value={office}
                onChange={(e) => setOffice(e.target.value)}
                placeholder="e.g. Receita Federal — Consolação, São Paulo"
                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50"
              />
              <button
                onClick={() => office.trim() && setStep("reason")}
                disabled={!office.trim()}
                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-40"
              >
                Continue →
              </button>
            </div>
          )}
        </section>
      )}

      {/* Step 2: Reason */}
      {(step === "reason" || step === "fix") && (
        <section className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">2</span>
            <h3 className="font-bold">What reason were you given?</h3>
            {step === "fix" && reason && (
              <span className="text-xs text-primary font-semibold ml-auto">✓ Selected</span>
            )}
          </div>
          {step === "reason" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {REJECTION_REASONS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => { setReason(r.id); setStep("fix"); }}
                  className="flex items-center gap-3 bg-secondary hover:bg-primary/5 hover:border-primary/20 border border-border rounded-xl p-4 text-left transition-all"
                >
                  <span className="text-xl">{r.icon}</span>
                  <span className="text-sm font-medium">{r.label}</span>
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Step 3: Fix */}
      {step === "fix" && fix && (
        <section className="bg-primary/5 border border-primary/15 rounded-2xl p-6 animate-slide-in">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-lg text-xs font-bold">{fix.urgency}</span>
          </div>
          <h2 className="text-xl font-extrabold mb-4">{fix.title}</h2>
          <div className="space-y-3">
            {fix.steps.map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">{i + 1}</span>
                <p className="text-sm text-foreground leading-relaxed">{s}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground">
              <span className="font-bold text-primary">💡 Pro tip:</span> {fix.tip}
            </p>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => { setStep("reason"); setReason(null); }}
              className="bg-secondary text-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-secondary/80 transition-all"
            >
              ← Different reason
            </button>
            <button
              onClick={onClose}
              className="bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
            >
              Back to my guide →
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default RejectionFlow;
