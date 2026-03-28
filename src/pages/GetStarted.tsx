import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BRAZILIAN_STATES, INITIAL_DATA, type OnboardingData } from "@/lib/onboarding-data";
import { COUNTRIES } from "@/lib/countries-data";

const TOTAL_STEPS = 8;

const GetStarted = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(INITIAL_DATA);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  const update = useCallback((field: keyof OnboardingData, value: string | boolean) => {
    setData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const next = () => {
    setDirection("forward");
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
    } else {
      // Store data and navigate to ready-pack
      sessionStorage.setItem("cpf-onboarding", JSON.stringify(data));
      navigate("/ready-pack");
    }
  };

  const back = () => {
    if (step > 0) {
      setDirection("back");
      setStep((s) => s - 1);
    }
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 0: return true; // welcome
      case 1: return data.fullName.trim().length > 2;
      case 2: return data.noMotherName ? data.motherAlternative.trim().length > 0 : data.motherName.trim().length > 2;
      case 3: return true; // father is optional
      case 4: return data.passportNumber.trim().length > 4;
      case 5: return data.state !== "";
      case 6: return data.streetAddress.trim().length > 3 && data.city.trim().length > 1;
      case 7: return data.email.includes("@") && data.nationality.trim().length > 1;
      default: return true;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && canProceed()) {
      next();
    }
  };

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col" onKeyDown={handleKeyDown}>
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        <div className="flex items-center justify-between px-6 py-4">
          <a href="/" className="text-lg font-bold tracking-tight">
            cpf<span className="text-primary">easy</span>.ai
          </a>
          <span className="text-xs text-muted-foreground font-medium">
            Step {step + 1} of {TOTAL_STEPS}
          </span>
        </div>
        <div className="h-1 bg-border">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 pt-24 pb-12">
        <div
          key={step}
          className="max-w-[520px] w-full animate-slide-in"
        >
          {step === 0 && <WelcomeStep />}
          {step === 1 && <NameStep value={data.fullName} onChange={(v) => update("fullName", v)} />}
          {step === 2 && (
            <MotherStep
              value={data.motherName}
              onChange={(v) => update("motherName", v)}
              noMother={data.noMotherName}
              onToggleNoMother={(v) => update("noMotherName", v)}
              alternative={data.motherAlternative}
              onAlternativeChange={(v) => update("motherAlternative", v)}
            />
          )}
          {step === 3 && <FatherStep value={data.fatherName} onChange={(v) => update("fatherName", v)} />}
          {step === 4 && <PassportStep value={data.passportNumber} onChange={(v) => update("passportNumber", v)} />}
          {step === 5 && <StateStep value={data.state} onChange={(v) => update("state", v)} />}
          {step === 6 && (
            <AddressStep
              street={data.streetAddress}
              city={data.city}
              onStreetChange={(v) => update("streetAddress", v)}
              onCityChange={(v) => update("city", v)}
            />
          )}
          {step === 7 && (
            <ContactStep
              email={data.email}
              nationality={data.nationality}
              onEmailChange={(v) => update("email", v)}
              onNationalityChange={(v) => update("nationality", v)}
            />
          )}
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-6 py-4">
        <div className="max-w-[520px] mx-auto flex items-center justify-between">
          <button
            onClick={back}
            disabled={step === 0}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-0 disabled:pointer-events-none font-medium"
          >
            ← Back
          </button>
          <button
            onClick={next}
            disabled={!canProceed()}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-primary/20"
          >
            {step === TOTAL_STEPS - 1 ? "Generate my Ready Pack →" : step === 0 ? "Let's go →" : "Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Step Components ---

const WelcomeStep = () => (
  <div className="text-center">
    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">
      🇧🇷
    </div>
    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
      Let's get your <span className="text-primary font-serif italic">CPF</span> sorted
    </h1>
    <p className="text-muted-foreground leading-relaxed max-w-[420px] mx-auto">
      We'll ask you a few quick questions to prepare your personalized application pack. Everything you need to walk into a Receita Federal office and walk out with your CPF.
    </p>
    <div className="mt-8 grid grid-cols-3 gap-4 max-w-[360px] mx-auto">
      <div className="bg-secondary rounded-xl p-3 text-center">
        <div className="text-lg font-bold">~5 min</div>
        <div className="text-[10px] text-muted-foreground font-medium mt-0.5">To complete</div>
      </div>
      <div className="bg-secondary rounded-xl p-3 text-center">
        <div className="text-lg font-bold">100%</div>
        <div className="text-[10px] text-muted-foreground font-medium mt-0.5">Prepared</div>
      </div>
      <div className="bg-secondary rounded-xl p-3 text-center">
        <div className="text-lg font-bold">Same day</div>
        <div className="text-[10px] text-muted-foreground font-medium mt-0.5">CPF issued</div>
      </div>
    </div>
  </div>
);

const NameStep = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <div>
    <label className="text-xs uppercase tracking-[2px] text-primary font-bold mb-3 block">Step 1</label>
    <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">What's your full name?</h2>
    <p className="text-muted-foreground text-sm mb-8">Exactly as it appears on your passport — no abbreviations.</p>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="e.g. John Michael Smith"
      autoFocus
      className="w-full px-5 py-4 bg-card border border-border rounded-xl text-foreground text-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50"
    />
  </div>
);

const MotherStep = ({
  value, onChange, noMother, onToggleNoMother, alternative, onAlternativeChange,
}: {
  value: string; onChange: (v: string) => void;
  noMother: boolean; onToggleNoMother: (v: boolean) => void;
  alternative: string; onAlternativeChange: (v: string) => void;
}) => (
  <div>
    <label className="text-xs uppercase tracking-[2px] text-primary font-bold mb-3 block">Step 2</label>
    <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">What's your mother's full name?</h2>
    <p className="text-muted-foreground text-sm mb-8">
      No abbreviations. In Brazil, your identity is tied to your mother's name — this is required by the Receita Federal.
    </p>
    {!noMother ? (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Maria Antonia Smith"
        autoFocus
        className="w-full px-5 py-4 bg-card border border-border rounded-xl text-foreground text-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50"
      />
    ) : (
      <div>
        <p className="text-sm text-muted-foreground mb-3">
          If your mother's name is unavailable, you can use your father's name or legal guardian's name instead.
        </p>
        <input
          type="text"
          value={alternative}
          onChange={(e) => onAlternativeChange(e.target.value)}
          placeholder="Father's or guardian's full name"
          autoFocus
          className="w-full px-5 py-4 bg-card border border-border rounded-xl text-foreground text-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50"
        />
      </div>
    )}
    <label className="flex items-center gap-3 mt-4 cursor-pointer group">
      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${noMother ? "bg-primary border-primary" : "border-border group-hover:border-primary/50"}`}>
        {noMother && <span className="text-primary-foreground text-xs font-bold">✓</span>}
      </div>
      <input
        type="checkbox"
        checked={noMother}
        onChange={(e) => onToggleNoMother(e.target.checked)}
        className="sr-only"
      />
      <span className="text-sm text-muted-foreground">My mother's name is not available</span>
    </label>
  </div>
);

const FatherStep = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <div>
    <label className="text-xs uppercase tracking-[2px] text-primary font-bold mb-3 block">Step 3</label>
    <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">What's your father's full name?</h2>
    <p className="text-muted-foreground text-sm mb-8">
      Optional — you can skip this if you prefer. Some forms include it but it's not required.
    </p>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="e.g. Robert James Smith"
      autoFocus
      className="w-full px-5 py-4 bg-card border border-border rounded-xl text-foreground text-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50"
    />
    <p className="text-xs text-muted-foreground mt-3 italic">Press Continue to skip →</p>
  </div>
);

const PassportStep = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <div>
    <label className="text-xs uppercase tracking-[2px] text-primary font-bold mb-3 block">Step 4</label>
    <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">What's your passport number?</h2>
    <p className="text-muted-foreground text-sm mb-8">
      We'll use this to pre-fill the official CPF application form for you.
    </p>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value.toUpperCase())}
      placeholder="e.g. AB1234567"
      autoFocus
      className="w-full px-5 py-4 bg-card border border-border rounded-xl text-foreground text-lg font-mono outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50 tracking-wider"
    />
    <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
      <span>🔒</span> Your passport number is used only to prepare your forms and is never stored.
    </div>
  </div>
);

const StateStep = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <div>
    <label className="text-xs uppercase tracking-[2px] text-primary font-bold mb-3 block">Step 5</label>
    <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Which Brazilian state are you in?</h2>
    <p className="text-muted-foreground text-sm mb-8">
      We'll find the nearest Receita Federal office for your in-person visit.
    </p>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[320px] overflow-y-auto pr-2">
      {BRAZILIAN_STATES.map((s) => (
        <button
          key={s.value}
          onClick={() => onChange(s.value)}
          className={`px-4 py-3 rounded-xl text-sm font-medium text-left transition-all border ${
            value === s.value
              ? "bg-primary text-primary-foreground border-primary shadow-md"
              : "bg-card border-border hover:border-primary/30 hover:bg-primary/5"
          }`}
        >
          <span className="font-bold">{s.value}</span>{" "}
          <span className={value === s.value ? "text-primary-foreground/80" : "text-muted-foreground"}>{s.label}</span>
        </button>
      ))}
    </div>
  </div>
);

const AddressStep = ({
  street, city, onStreetChange, onCityChange,
}: {
  street: string; city: string; onStreetChange: (v: string) => void; onCityChange: (v: string) => void;
}) => (
  <div>
    <label className="text-xs uppercase tracking-[2px] text-primary font-bold mb-3 block">Step 6</label>
    <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">What's your address in Brazil?</h2>
    <p className="text-muted-foreground text-sm mb-8">
      The street address where you're staying. This goes on the application form.
    </p>
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-muted-foreground mb-2 block">Street address</label>
        <input
          type="text"
          value={street}
          onChange={(e) => onStreetChange(e.target.value)}
          placeholder="e.g. Rua Augusta, 1234 — Apt 501"
          autoFocus
          className="w-full px-5 py-4 bg-card border border-border rounded-xl text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-muted-foreground mb-2 block">City</label>
        <input
          type="text"
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          placeholder="e.g. São Paulo"
          className="w-full px-5 py-4 bg-card border border-border rounded-xl text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50"
        />
      </div>
    </div>
  </div>
);

const ContactStep = ({
  email, nationality, onEmailChange, onNationalityChange,
}: {
  email: string; nationality: string; onEmailChange: (v: string) => void; onNationalityChange: (v: string) => void;
}) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedCountry = COUNTRIES.find((c) => c.nationality === nationality || c.name === nationality);

  const filtered = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.nationality.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectCountry = (c: typeof COUNTRIES[0]) => {
    onNationalityChange(c.nationality);
    setSearch("");
    setIsOpen(false);
  };

  return (
    <div>
      <label className="text-xs uppercase tracking-[2px] text-primary font-bold mb-3 block">Final step</label>
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Almost done!</h2>
      <p className="text-muted-foreground text-sm mb-8">
        Your email for the Ready Pack download, and your nationality for the application.
      </p>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-2 block">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="you@example.com"
            autoFocus
            className="w-full px-5 py-4 bg-card border border-border rounded-xl text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50"
          />
        </div>
        <div ref={dropdownRef} className="relative">
          <label className="text-xs font-semibold text-muted-foreground mb-2 block">Nationality</label>
          {selectedCountry && !isOpen ? (
            <button
              type="button"
              onClick={() => { setIsOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
              className="w-full px-5 py-4 bg-card border border-border rounded-xl text-foreground text-left flex items-center gap-3 hover:border-primary/30 transition-all"
            >
              <span className="text-2xl">{selectedCountry.flag}</span>
              <span className="font-medium">{selectedCountry.name}</span>
              <span className="text-muted-foreground text-sm ml-auto">Change</span>
            </button>
          ) : (
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setIsOpen(true); }}
              onFocus={() => setIsOpen(true)}
              placeholder="Search country… e.g. South Africa"
              className="w-full px-5 py-4 bg-card border border-border rounded-xl text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50"
            />
          )}
          {isOpen && (
            <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl max-h-[240px] overflow-y-auto">
              {filtered.length === 0 && (
                <div className="px-5 py-4 text-sm text-muted-foreground">No countries found</div>
              )}
              {filtered.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => selectCountry(c)}
                  className="w-full px-5 py-3 flex items-center gap-3 hover:bg-primary/5 transition-colors text-left"
                >
                  <span className="text-xl">{c.flag}</span>
                  <span className="font-medium text-sm">{c.name}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{c.nationality}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
