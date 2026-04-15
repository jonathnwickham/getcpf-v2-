import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import SEO from "@/components/SEO";
import { BRAZILIAN_STATES, INITIAL_DATA, type OnboardingData } from "@/lib/onboarding-data";
import { COUNTRIES } from "@/lib/countries-data";
import { getCitiesForState } from "@/lib/brazilian-cities";
import {
  applicationHasReadyPack,
  fetchLatestApplication,
  mapApplicationToOnboardingData,
  persistOnboardingData,
  readPersistedOnboardingData,
  saveLatestApplication,
  ONBOARDING_LOCAL_KEY,
  ONBOARDING_SESSION_KEY,
} from "@/lib/application-storage";

const TOTAL_STEPS = 8;

// Determine which step to resume at based on filled data
const getResumeStep = (d: OnboardingData): number => {
  // Walk forward through steps, return the first one that's incomplete
  const words = d.fullName.trim().split(/\s+/).filter(Boolean);
  if (words.length < 2) return 1; // name not filled
  if (!d.noMotherName && d.motherName.trim().length < 3) return 2;
  if (d.noMotherName && d.motherAlternative.trim().length === 0) return 2;
  // step 3 (father) is optional, skip
  if (!/^[A-Z0-9]{6,12}$/i.test(d.passportNumber.trim())) return 4;
  if (!d.state) return 5;
  if (d.streetAddress.trim().length < 4 || d.city.trim().length < 2) return 6;
  if (!d.email.includes("@") || d.nationality.trim().length < 2) return 7;
  return 7; // all filled, show last step to confirm
};

// Building screen — spinner morphs to checkmark then navigates
const BuildingScreen = ({ onDone }: { onDone: () => void }) => {
  const [phase, setPhase] = useState<"spinning" | "done">("spinning");

  useEffect(() => {
    const timer = setTimeout(() => setPhase("done"), 2200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase === "done") {
      const nav = setTimeout(onDone, 900);
      return () => clearTimeout(nav);
    }
  }, [phase, onDone]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <div className="relative w-16 h-16">
          {/* Spinner */}
          <motion.div
            className="absolute inset-0 rounded-full border-[3px] border-gray-100 border-t-green-800"
            animate={phase === "spinning" ? { rotate: 360 } : { rotate: 360, opacity: 0, scale: 0.5 }}
            transition={phase === "spinning"
              ? { rotate: { duration: 0.8, repeat: Infinity, ease: "linear" } }
              : { opacity: { duration: 0.3 }, scale: { duration: 0.3 } }
            }
          />
          {/* Checkmark */}
          {phase === "done" && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="w-16 h-16 bg-green-800 rounded-full flex items-center justify-center">
                <motion.svg
                  viewBox="0 0 24 24"
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <motion.path
                    d="M5 13l4 4L19 7"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  />
                </motion.svg>
              </div>
            </motion.div>
          )}
        </div>
        <motion.p
          className="text-sm font-medium text-gray-500"
          animate={phase === "done" ? { opacity: 0 } : { opacity: 1 }}
        >
          {phase === "spinning" ? "Building your Ready Pack..." : ""}
        </motion.p>
        {phase === "done" && (
          <motion.p
            className="text-sm font-semibold text-green-800"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Your pack is ready
          </motion.p>
        )}
      </div>
    </div>
  );
};

const GetStarted = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(INITIAL_DATA);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [forceFullName, setForceFullName] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [ready, setReady] = useState(false);
  const [building, setBuilding] = useState(false);

  const update = useCallback((field: keyof OnboardingData, value: string | boolean) => {
    setData((prev) => {
      const next = { ...prev, [field]: value };
      persistOnboardingData(next);
      return next;
    });
  }, []);

  // Focus the first interactive element when step changes (after animation)
  useEffect(() => {
    const timer = setTimeout(() => {
      const el = document.querySelector<HTMLElement>(
        '.max-w-\\[520px\\] input, .max-w-\\[520px\\] button[type="button"]'
      );
      el?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, [step]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      // Not logged in, start fresh, clear any stale test data
      localStorage.removeItem(ONBOARDING_LOCAL_KEY);
      sessionStorage.removeItem(ONBOARDING_SESSION_KEY);
      setData(INITIAL_DATA);
      setReady(true);
      return;
    }

    fetchLatestApplication(user.id)
      .then((application) => {
        if (application) {
          if (applicationHasReadyPack(application)) {
            navigate("/ready-pack", { replace: true });
            return;
          }

          const mapped = mapApplicationToOnboardingData(application);
          setData(mapped);
          persistOnboardingData(mapped);

          // Resume at the furthest incomplete step
          const resumeStep = getResumeStep(mapped);
          if (resumeStep > 0) {
            setStep(resumeStep);
            toast(`Welcome back, ${mapped.fullName.split(" ")[0] || ""}. Picking up where you left off.`);
          }
        } else {
          localStorage.removeItem(ONBOARDING_LOCAL_KEY);
          sessionStorage.removeItem(ONBOARDING_SESSION_KEY);
          setData(INITIAL_DATA);
        }

        setReady(true);
      })
      .catch(() => {
        setReady(true);
      });
  }, [user, authLoading, navigate]);

  if (building) {
    return <BuildingScreen onDone={() => navigate("/ready-pack")} />;
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-green-800 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Getting things ready...</p>
        </div>
      </div>
    );
  }

  const next = async () => {
    // Consent required on step 1 (first personal data entry)
    if (step === 1 && !consentChecked) {
      setConsentError(true);
      return;
    }

    setDirection("forward");
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);

      // Log consent on step 1 advance
      if (step === 1 && user) {
        try {
          await supabase.from("consent_log").insert({
            user_id: user.id,
            consent_text: "I consent to GET CPF processing my personal data, including passport details, parent names, and date of birth, to prepare my CPF application documents for submission to the Brazilian Receita Federal, in accordance with Brazil's Lei Geral de Proteção de Dados (LGPD, Lei 13.709/2018). I have read and agree to the Privacy Policy. Sensitive data (passport number) will be automatically and permanently deleted within 30 days of CPF issuance.",
            consent_version: "3.0",
            consent: true,
          });
        } catch {
        }
      }

      // Save progress to DB after every step so login redirect works
      if (user) {
        try {
          await saveLatestApplication(user.id, data, "draft");
        } catch {
        }
      }
      return;
    }

    persistOnboardingData(data);

    if (user) {
      try {
        await saveLatestApplication(user.id, data, "prepared");
        // Send "Ready Pack is ready" email (fails silently if template doesn't exist yet)
        supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "ready-pack-complete",
            recipientEmail: data.email || user.email,
            idempotencyKey: `ready-pack-${user.id}-${Date.now()}`,
            templateData: { name: data.fullName.split(" ")[0] || "there" },
          },
        }).catch(() => {}); // fire and forget
      } catch {
      }
    }

    setBuilding(true);
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
      case 1: {
        const words = data.fullName.trim().split(/\s+/).filter(Boolean);
        return words.length >= 2 || (forceFullName && data.fullName.trim().length > 2);
      }
      case 2: return data.noMotherName ? data.motherAlternative.trim().length > 0 : data.motherName.trim().length > 2;
      case 3: return true; // father is optional
      case 4: return /^[A-Z0-9]{6,12}$/i.test(data.passportNumber.trim());
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
    <div className="min-h-screen bg-white flex flex-col" onKeyDown={handleKeyDown}>
      <SEO
        title="Get Your CPF. GET CPF"
        description="Answer a few quick questions and we'll prepare everything you need to get your Brazilian CPF on the first visit."
        path="/get-started"
        noIndex={true}
      />
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100">
        <div className="flex items-center justify-between px-5 sm:px-8 h-16">
          <a href="/">
            <Logo className="h-10" />
          </a>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400 font-medium">
              {step + 1} of {TOTAL_STEPS}
            </span>
            <button
              onClick={async () => {
                try {
                  await supabase.auth.signOut();
                } catch {
                }
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = "/";
              }}
              className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
            >
              Sign out
            </button>
            <a href="/" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">
              ✕
            </a>
          </div>
        </div>
        {/* Progress bar — prominent, green */}
        <div className="h-1.5 bg-gray-100">
          <motion.div
            className="h-full bg-green-800 rounded-r-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </div>
      </div>

      {/* Content with slide transitions */}
      <div className="flex-1 flex items-start justify-center px-5 sm:px-8 pt-24 pb-32 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: direction === "forward" ? 60 : -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction === "forward" ? -60 : 60, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="max-w-[520px] w-full"
          >
          {step === 0 && <WelcomeStep />}
          {step === 1 && <NameStep value={data.fullName} onChange={(v) => update("fullName", v)} forceFullName={forceFullName} onForceFullName={setForceFullName} consentChecked={consentChecked} onConsentChange={(v) => { setConsentChecked(v); setConsentError(false); }} consentError={consentError} />}
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
              cep={data.cep}
              onCepChange={(v) => update("cep", v)}
              street={data.streetAddress}
              addressNumber={data.addressNumber}
              complement={data.complement}
              neighbourhood={data.neighbourhood}
              city={data.city}
              state={data.state}
              onStreetChange={(v) => update("streetAddress", v)}
              onNumberChange={(v) => update("addressNumber", v)}
              onComplementChange={(v) => update("complement", v)}
              onNeighbourhoodChange={(v) => update("neighbourhood", v)}
              onCityChange={(v) => update("city", v)}
              stayingWithFriend={data.stayingWithFriend}
              onToggleStaying={(v) => update("stayingWithFriend", v)}
              hostName={data.hostName}
              onHostNameChange={(v) => update("hostName", v)}
              hostCpf={data.hostCpf}
              onHostCpfChange={(v) => update("hostCpf", v)}
              hostAddress={data.hostAddress}
              onHostAddressChange={(v) => update("hostAddress", v)}
              hostCity={data.hostCity}
              onHostCityChange={(v) => update("hostCity", v)}
              guestName={data.fullName}
              passportNumber={data.passportNumber}
              nationality={data.nationality}
            />
          )}
          {step === 7 && (
            <ContactStep
              email={data.email}
              nationality={data.nationality}
              gender={data.gender}
              onEmailChange={(v) => update("email", v)}
              onNationalityChange={(v) => update("nationality", v)}
              onGenderChange={(v) => update("gender", v)}
            />
          )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 px-5 sm:px-8 py-4">
        <div className="max-w-[520px] mx-auto flex items-center justify-between">
          <button
            onClick={back}
            disabled={step === 0}
            className="text-sm text-gray-400 hover:text-gray-700 transition-colors disabled:opacity-0 disabled:pointer-events-none font-medium"
          >
            ← Back
          </button>
          <button
            onClick={next}
            disabled={!canProceed()}
            className="bg-green-800 text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-green-900 transition-all btn-press disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {step === TOTAL_STEPS - 1 ? "Build my Ready Pack →" : step === 0 ? "Let's go →" : "Got it, next step →"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Step Components ---

const WelcomeStep = () => {
  const [userCount, setUserCount] = useState<number | null>(null);
  useEffect(() => {
    supabase.from("applications").select("id", { count: "exact", head: true })
      .neq("status", "draft")
      .then(({ count }) => { if (count) setUserCount(count); });
  }, []);

  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-green-800/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">
        🇧🇷
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
        Let's get your <span className="text-green-800">CPF</span> sorted
      </h1>
      <p className="text-gray-500 leading-relaxed max-w-[420px] mx-auto">
        We'll ask a few quick questions, takes about 5 minutes. When you're done, you'll have everything you need to walk into the office and walk out with your CPF.
      </p>
      <div className="mt-8 grid grid-cols-3 gap-3 max-w-[360px] mx-auto">
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <div className="text-lg font-bold">~5 min</div>
          <div className="text-xs text-gray-400 mt-0.5">That's it</div>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <div className="text-lg font-bold">Same day</div>
          <div className="text-xs text-gray-400 mt-0.5">CPF in hand</div>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <div className="text-lg font-bold">{userCount ? `${userCount}+` : "50+"}</div>
          <div className="text-xs text-gray-400 mt-0.5">People served</div>
        </div>
      </div>
    </div>
  );
};

const NameStep = ({ value, onChange, forceFullName, onForceFullName, consentChecked, onConsentChange, consentError }: {
  value: string; onChange: (v: string) => void; forceFullName: boolean; onForceFullName: (v: boolean) => void;
  consentChecked: boolean; onConsentChange: (v: boolean) => void; consentError: boolean;
}) => {
  const words = value.trim().split(/\s+/).filter(Boolean);
  const isFullName = words.length >= 2;
  const showWarning = value.trim().length > 2 && !isFullName && !forceFullName;

  return (
    <div>
      <label className="text-xs uppercase tracking-[2px] text-green-800 font-bold mb-3 block">Step 1</label>
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">What's your full name?</h2>
      <p className="text-gray-500 text-sm mb-8">Exactly as it appears on your passport. No nicknames, the form needs to match.</p>
      <input
        type="text"
        value={value}
        onChange={(e) => { onChange(e.target.value); onForceFullName(false); }}
        placeholder="e.g. John Michael Smith"
        autoFocus
        autoComplete="name"
        className="w-full px-5 py-4 bg-white border border-gray-100 rounded-xl text-gray-900 text-lg outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/10 transition-all placeholder:text-gray-500/50"
      />
      {showWarning && (
        <div className="mt-3 bg-red-500/10 border border-destructive/20 rounded-xl p-4">
          <p className="text-sm font-semibold text-red-500 mb-1">⚠️ Looks like a single name</p>
          <p className="text-xs text-gray-500 mb-3">We need your full name (first + last) exactly as it appears on your passport. CPF applications with incomplete names get rejected.</p>
          <button
            type="button"
            onClick={() => onForceFullName(true)}
            className="text-xs font-semibold text-green-800 hover:underline"
          >
            This is my full legal name, continue anyway →
          </button>
        </div>
      )}

      {/* Consent checkbox */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 mt-0.5 ${
            consentChecked ? "bg-green-800 border-green-800" : consentError ? "border-destructive" : "border-gray-100 group-hover:border-green-800/50"
          }`}>
            {consentChecked && <span className="text-white text-xs font-bold">✓</span>}
          </div>
          <input
            type="checkbox"
            checked={consentChecked}
            onChange={(e) => onConsentChange(e.target.checked)}
            className="sr-only"
          />
          <span className="text-sm text-gray-500 leading-relaxed">
            I consent to GET CPF processing my personal data, including passport details, parent names, and date of birth, to prepare my CPF application documents for submission to the Brazilian Receita Federal, in accordance with Brazil's Lei Geral de Proteção de Dados (LGPD, Lei 13.709/2018). I have read and agree to the{" "}
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-green-800 hover:underline font-semibold">
              Privacy Policy
            </a>
            . Sensitive data (passport number) will be automatically and permanently deleted within 30 days of CPF issuance.
          </span>
        </label>
        {consentError && (
          <p className="text-xs text-red-500 font-semibold mt-2 ml-8">
            Please confirm you have read and agree to our Privacy Policy to continue.
          </p>
        )}
      </div>
    </div>
  );
};

const MotherStep = ({
  value, onChange, noMother, onToggleNoMother, alternative, onAlternativeChange,
}: {
  value: string; onChange: (v: string) => void;
  noMother: boolean; onToggleNoMother: (v: boolean) => void;
  alternative: string; onAlternativeChange: (v: string) => void;
}) => {
  // Detect initials/abbreviations like "M.", "J. Smith", single letters
  const hasAbbreviation = !noMother && value.trim().length > 0 && /\b[A-Z]\.?\s/i.test(value.trim());

  return (
    <div>
      <label className="text-xs uppercase tracking-[2px] text-green-800 font-bold mb-3 block">Step 2</label>
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">What's your mother's full name?</h2>
      <p className="text-gray-500 text-sm mb-8">
        No initials, no abbreviations, this is the #1 reason applications get rejected. We'll double-check it for you.
      </p>
      {!noMother ? (
        <>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g. Maria Antonia Smith"
            autoFocus
            className="w-full px-5 py-4 bg-white border border-gray-100 rounded-xl text-gray-900 text-lg outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/10 transition-all placeholder:text-gray-500/50"
          />
          {hasAbbreviation && (
            <div className="mt-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-3">
              <p className="text-xs text-amber-800 dark:text-amber-200 font-medium">
                ⚠️ Please enter your mother's full name with no abbreviations or initials. This is the most common CPF rejection reason and we check it automatically.
              </p>
            </div>
          )}
        </>
      ) : (
        <div>
          <p className="text-sm text-gray-500 mb-3">
            If your mother's name is unavailable, you can use your father's name or legal guardian's name instead.
          </p>
          <input
            type="text"
            value={alternative}
            onChange={(e) => onAlternativeChange(e.target.value)}
            placeholder="Father's or guardian's full name"
            autoFocus
            className="w-full px-5 py-4 bg-white border border-gray-100 rounded-xl text-gray-900 text-lg outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/10 transition-all placeholder:text-gray-500/50"
          />
        </div>
      )}
      <label className="flex items-center gap-3 mt-4 cursor-pointer group">
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${noMother ? "bg-green-800 border-green-800" : "border-gray-100 group-hover:border-green-800/50"}`}>
          {noMother && <span className="text-white text-xs font-bold">✓</span>}
        </div>
        <input
          type="checkbox"
          checked={noMother}
          onChange={(e) => onToggleNoMother(e.target.checked)}
          className="sr-only"
        />
        <span className="text-sm text-gray-500">My mother's name is not available</span>
      </label>
    </div>
  );
};

const FatherStep = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <div>
    <label className="text-xs uppercase tracking-[2px] text-green-800 font-bold mb-3 block">Step 3</label>
    <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">What's your father's full name?</h2>
    <p className="text-gray-500 text-sm mb-8">
      This one's optional, skip it if you'd rather not include it. Some forms have a space for it, but it's not required.
    </p>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="e.g. Robert James Smith"
      autoFocus
      className="w-full px-5 py-4 bg-white border border-gray-100 rounded-xl text-gray-900 text-lg outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/10 transition-all placeholder:text-gray-500/50"
    />
    <p className="text-xs text-gray-500 mt-3 italic">If you want to leave it out, just hit next</p>
  </div>
);

const PassportStep = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const trimmed = value.trim();
  const hasInput = trimmed.length > 0;
  const hasSpaces = /\s/.test(trimmed);
  const hasSpecialChars = /[^A-Z0-9]/i.test(trimmed);
  const tooShort = hasInput && trimmed.length < 6;
  const tooLong = trimmed.length > 12;
  const isValid = hasInput && /^[A-Z0-9]{6,12}$/i.test(trimmed);

  let errorMsg = "";
  if (hasInput && hasSpaces) errorMsg = "Passport numbers can't contain spaces.";
  else if (hasInput && hasSpecialChars) errorMsg = "Letters and numbers only, no special characters.";
  else if (tooShort) errorMsg = "Too short, passport numbers are at least 6 characters.";
  else if (tooLong) errorMsg = "Too long, passport numbers are at most 12 characters.";

  return (
    <div>
      <label className="text-xs uppercase tracking-[2px] text-green-800 font-bold mb-3 block">Step 4</label>
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">What's your passport number?</h2>
      <p className="text-gray-500 text-sm mb-8">
        We use this to pre-fill the official form for you, so you don't have to figure out which field goes where.
      </p>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase().replace(/\s/g, ""))}
        placeholder="e.g. AB1234567"
        autoFocus
        maxLength={12}
        className={`w-full px-5 py-4 bg-white border rounded-xl text-gray-900 text-lg font-mono outline-none focus:ring-2 transition-all placeholder:text-gray-500/50 tracking-wider ${
          hasInput && !isValid ? "border-destructive focus:border-destructive focus:ring-destructive/10" : "border-gray-100 focus:border-green-800 focus:ring-green-800/10"
        }`}
      />
      {errorMsg && (
        <p className="text-xs text-red-500 mt-2 font-medium">⚠️ {errorMsg}</p>
      )}
      {hasInput && isValid && (
        <p className="text-xs text-green-800 mt-2 font-medium">✓ Looks good</p>
      )}
      <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
        <span>🔒</span> Your passport number is used only to prepare your forms and is never stored after document generation.
      </div>
    </div>
  );
};

const StateStep = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <div>
    <label className="text-xs uppercase tracking-[2px] text-green-800 font-bold mb-3 block">Step 5</label>
    <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Which state are you in?</h2>
    <p className="text-gray-500 text-sm mb-8">
      This tells us which office to send you to, we'll find the best one nearby.
    </p>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[320px] overflow-y-auto pr-2">
      {BRAZILIAN_STATES.map((s) => (
        <button
          key={s.value}
          onClick={() => onChange(s.value)}
          className={`px-4 py-3 rounded-xl text-sm font-medium text-left transition-all border ${
            value === s.value
              ? "bg-green-800 text-white border-green-800 shadow-md"
              : "bg-white border-gray-100 hover:border-green-800/30 hover:bg-green-800/5"
          }`}
        >
          <span className="font-bold">{s.value}</span>{" "}
          <span className={value === s.value ? "text-white/80" : "text-gray-500"}>{s.label}</span>
        </button>
      ))}
    </div>
  </div>
);

const MONTHS_PT = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

const generateDeclaration = (hostName: string, hostCpf: string, hostAddress: string, hostCity: string, state: string, guestName: string, passportNumber: string, nationality: string) => {
  const now = new Date();
  const day = now.getDate();
  const month = MONTHS_PT[now.getMonth()];
  const year = now.getFullYear();
  return `DECLARAÇÃO DE RESIDÊNCIA

Eu, ${hostName}, portador(a) do CPF nº ${hostCpf || "[CPF do anfitrião]"}, residente à ${hostAddress}, ${hostCity}, ${state}, declaro para os devidos fins que ${guestName}, portador(a) do passaporte nº ${passportNumber}, nacionalidade ${nationality}, reside temporariamente em meu endereço acima mencionado.

Por ser verdade, firmo a presente declaração.

${hostCity}, ${day} de ${month} de ${year}

_______________________________
${hostName}
CPF: ${hostCpf || "[CPF do anfitrião]"}`;
};

const AddressStep = ({
  cep, onCepChange,
  street, addressNumber, complement, neighbourhood, city, state,
  onStreetChange, onNumberChange, onComplementChange, onNeighbourhoodChange, onCityChange,
  stayingWithFriend, onToggleStaying,
  hostName, onHostNameChange, hostCpf, onHostCpfChange,
  hostAddress, onHostAddressChange, hostCity, onHostCityChange,
  guestName, passportNumber, nationality,
}: {
  cep: string; onCepChange: (v: string) => void;
  street: string; addressNumber: string; complement: string; neighbourhood: string; city: string; state: string;
  onStreetChange: (v: string) => void; onNumberChange: (v: string) => void; onComplementChange: (v: string) => void; onNeighbourhoodChange: (v: string) => void; onCityChange: (v: string) => void;
  stayingWithFriend: boolean; onToggleStaying: (v: boolean) => void;
  hostName: string; onHostNameChange: (v: string) => void;
  hostCpf: string; onHostCpfChange: (v: string) => void;
  hostAddress: string; onHostAddressChange: (v: string) => void;
  hostCity: string; onHostCityChange: (v: string) => void;
  guestName: string; passportNumber: string; nationality: string;
}) => {
  const [citySearch, setCitySearch] = useState("");
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [showDeclaration, setShowDeclaration] = useState(false);
  const [hostCitySearch, setHostCitySearch] = useState("");
  const [isHostCityOpen, setIsHostCityOpen] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepStatus, setCepStatus] = useState<"idle" | "found" | "not_found">("idle");
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const cityInputRef = useRef<HTMLInputElement>(null);
  const hostCityDropdownRef = useRef<HTMLDivElement>(null);
  const hostCityInputRef = useRef<HTMLInputElement>(null);

  // CEP autofill via ViaCEP
  const handleCepChange = (raw: string) => {
    // Format: 12345-678
    const digits = raw.replace(/\D/g, "").slice(0, 8);
    const formatted = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
    onCepChange(formatted);
    setCepStatus("idle");

    if (digits.length === 8) {
      setCepLoading(true);
      fetch(`https://viacep.com.br/ws/${digits}/json/`)
        .then((r) => r.json())
        .then((result) => {
          if (result.erro) {
            setCepStatus("not_found");
          } else {
            if (result.logradouro) onStreetChange(result.logradouro);
            if (result.bairro) onNeighbourhoodChange(result.bairro);
            if (result.localidade) onCityChange(result.localidade);
            setCepStatus("found");
          }
        })
        .catch(() => setCepStatus("not_found"))
        .finally(() => setCepLoading(false));
    }
  };

  const cities = getCitiesForState(state);
  const selectedCity = city;
  const stripAccents = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const filteredCities = cities.filter((c) =>
    stripAccents(c).includes(stripAccents(citySearch))
  );
  const filteredHostCities = cities.filter((c) =>
    stripAccents(c).includes(stripAccents(hostCitySearch))
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target as Node)) {
        setIsCityOpen(false);
      }
      if (hostCityDropdownRef.current && !hostCityDropdownRef.current.contains(e.target as Node)) {
        setIsHostCityOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const declaration = generateDeclaration(hostName, hostCpf, hostAddress, hostCity, state, guestName, passportNumber, nationality);
  const canGenerate = hostName.trim().length > 2 && hostAddress.trim().length > 3;

  return (
    <div>
      <label className="text-xs uppercase tracking-[2px] text-green-800 font-bold mb-3 block">Step 6</label>
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Where are you staying?</h2>
      <p className="text-gray-500 text-sm mb-6">
        Your address in Brazil, this goes on the form. Hotel, Airbnb, friend's place, all fine.
      </p>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-2 block">CEP (postal code)</label>
          <div className="relative">
            <input
              type="text"
              value={cep}
              onChange={(e) => handleCepChange(e.target.value)}
              placeholder="e.g. 01310-100"
              autoFocus
              inputMode="numeric"
              autoComplete="postal-code"
              aria-label="CEP postal code"
              className="w-full px-5 py-4 bg-white border border-gray-100 rounded-xl text-gray-900 outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/10 transition-all placeholder:text-gray-500/50 font-mono"
            />
            {cepLoading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-green-800 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {cepStatus === "found" && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-800 text-sm font-bold">✓</div>
            )}
            {cepStatus === "not_found" && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 text-xs font-medium">CEP not found</div>
            )}
          </div>
          <p className="text-[11px] text-gray-400 mt-1.5">Enter your CEP to auto-fill the address below. Don't know it? Just fill in manually.</p>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-2 block">Street address</label>
          <input
            type="text"
            value={street}
            onChange={(e) => onStreetChange(e.target.value)}
            placeholder="e.g. Rua Augusta, 1234, Apt 501"
            autoComplete="street-address"
            className="w-full px-5 py-4 bg-white border border-gray-100 rounded-xl text-gray-900 outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/10 transition-all placeholder:text-gray-500/50"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-2 block">Number</label>
            <input
              type="text"
              value={addressNumber}
              onChange={(e) => onNumberChange(e.target.value)}
              placeholder="e.g. 1234"
              inputMode="numeric"
              autoComplete="address-line2"
              aria-label="Address number"
              className="w-full px-5 py-4 bg-white border border-gray-100 rounded-xl text-gray-900 outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/10 transition-all placeholder:text-gray-500/50"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-2 block">Apt / Room <span className="text-gray-300 font-normal">(optional)</span></label>
            <input
              type="text"
              value={complement}
              onChange={(e) => onComplementChange(e.target.value)}
              placeholder="e.g. Apt 501"
              autoComplete="address-line3"
              aria-label="Apartment or room number"
              className="w-full px-5 py-4 bg-white border border-gray-100 rounded-xl text-gray-900 outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/10 transition-all placeholder:text-gray-500/50"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-2 block">Neighbourhood</label>
          <input
            type="text"
            value={neighbourhood}
            onChange={(e) => onNeighbourhoodChange(e.target.value)}
            placeholder="e.g. Consolação"
            autoComplete="address-level3"
            className="w-full px-5 py-4 bg-white border border-gray-100 rounded-xl text-gray-900 outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/10 transition-all placeholder:text-gray-500/50"
          />
        </div>
        <div ref={cityDropdownRef} className="relative">
          <label className="text-xs font-semibold text-gray-500 mb-2 block">City</label>
          {selectedCity && !isCityOpen ? (
            <button
              type="button"
              onClick={() => { setIsCityOpen(true); setTimeout(() => cityInputRef.current?.focus(), 50); }}
              className="w-full px-5 py-4 bg-white border border-gray-100 rounded-xl text-gray-900 text-left flex items-center justify-between hover:border-green-800/30 transition-all"
            >
              <span className="font-medium">{selectedCity}</span>
              <span className="text-gray-500 text-sm">Change</span>
            </button>
          ) : (
            <input
              ref={cityInputRef}
              type="text"
              value={isCityOpen ? citySearch : city}
              onChange={(e) => {
                setCitySearch(e.target.value);
                setIsCityOpen(true);
                onCityChange(e.target.value);
              }}
              onFocus={() => setIsCityOpen(true)}
              placeholder="Search city… e.g. São Paulo"
              autoComplete="off"
              className="w-full px-5 py-4 bg-white border border-gray-100 rounded-xl text-gray-900 outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/10 transition-all placeholder:text-gray-500/50"
            />
          )}
          {isCityOpen && filteredCities.length > 0 && (
            <div className="absolute z-50 bottom-full left-0 right-0 mb-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-[240px] overflow-y-auto">
              {(citySearch ? filteredCities : filteredCities.slice(0, 20)).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => { onCityChange(c); setCitySearch(""); setIsCityOpen(false); }}
                  className="w-full px-5 py-3 hover:bg-green-800/5 transition-colors text-left text-sm font-medium"
                >
                  {c}
                </button>
              ))}
            </div>
          )}
          {isCityOpen && filteredCities.length === 0 && citySearch && (
            <div className="absolute z-50 bottom-full left-0 right-0 mb-2 bg-white border border-gray-100 rounded-xl shadow-xl p-4">
              <p className="text-sm text-gray-500">No match, your typed city will be used</p>
            </div>
          )}
        </div>

        {/* Staying with friend toggle */}
        <label className="flex items-center gap-3 mt-2 cursor-pointer group">
          <div
            role="switch"
            aria-checked={stayingWithFriend}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${stayingWithFriend ? "bg-green-800 border-green-800" : "border-gray-100 group-hover:border-green-800/50"}`}
          >
            {stayingWithFriend && <span className="text-white text-xs font-bold">✓</span>}
          </div>
          <input
            type="checkbox"
            checked={stayingWithFriend}
            onChange={(e) => onToggleStaying(e.target.checked)}
            className="sr-only"
          />
          <span className="text-sm text-gray-500">I'm staying with a friend or family (no formal address proof)</span>
        </label>

        {stayingWithFriend && (
          <div className="mt-3 bg-gray-50 rounded-xl p-5 space-y-3 animate-slide-in">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Host details, for the declaration letter</p>
            <input
              type="text"
              value={hostName}
              onChange={(e) => onHostNameChange(e.target.value)}
              placeholder="Host's full name"
              className="w-full px-4 py-3 bg-white border border-gray-100 rounded-lg text-gray-900 text-sm outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/10 transition-all placeholder:text-gray-500/50"
            />
            <input
              type="text"
              value={hostCpf}
              onChange={(e) => onHostCpfChange(e.target.value)}
              placeholder="Host's CPF number (if known)"
              className="w-full px-4 py-3 bg-white border border-gray-100 rounded-lg text-gray-900 text-sm font-mono outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/10 transition-all placeholder:text-gray-500/50"
            />
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-gray-500">Host's address</label>
                {street && !hostAddress && (
                  <button
                    type="button"
                    onClick={() => onHostAddressChange(street)}
                    className="text-[10px] text-green-800 font-bold hover:underline"
                  >
                    Use my address ↗
                  </button>
                )}
              </div>
              <input
                type="text"
                value={hostAddress}
                onChange={(e) => onHostAddressChange(e.target.value)}
                placeholder="Host's full address"
                className="w-full px-4 py-3 bg-white border border-gray-100 rounded-lg text-gray-900 text-sm outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/10 transition-all placeholder:text-gray-500/50"
              />
            </div>
            <div ref={hostCityDropdownRef} className="relative">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-gray-500">Host's city</label>
                {city && !hostCity && (
                  <button
                    type="button"
                    onClick={() => onHostCityChange(city)}
                    className="text-[10px] text-green-800 font-bold hover:underline"
                  >
                    Use my city ↗
                  </button>
                )}
              </div>
              {hostCity && !isHostCityOpen ? (
                <button
                  type="button"
                  onClick={() => { setIsHostCityOpen(true); setTimeout(() => hostCityInputRef.current?.focus(), 50); }}
                  className="w-full px-4 py-3 bg-white border border-gray-100 rounded-lg text-gray-900 text-sm text-left flex items-center justify-between hover:border-green-800/30 transition-all"
                >
                  <span className="font-medium">{hostCity}</span>
                  <span className="text-gray-500 text-xs">Change</span>
                </button>
              ) : (
                <input
                  ref={hostCityInputRef}
                  type="text"
                  value={isHostCityOpen ? hostCitySearch : hostCity}
                  onChange={(e) => {
                    setHostCitySearch(e.target.value);
                    setIsHostCityOpen(true);
                    onHostCityChange(e.target.value);
                  }}
                  onFocus={() => setIsHostCityOpen(true)}
                  placeholder="Search city…"
                  className="w-full px-4 py-3 bg-white border border-gray-100 rounded-lg text-gray-900 text-sm outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/10 transition-all placeholder:text-gray-500/50"
                />
              )}
              {isHostCityOpen && filteredHostCities.length > 0 && (
                <div className="absolute z-50 bottom-full left-0 right-0 mb-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-[200px] overflow-y-auto">
                  {(hostCitySearch ? filteredHostCities : filteredHostCities.slice(0, 20)).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => { onHostCityChange(c); setHostCitySearch(""); setIsHostCityOpen(false); }}
                      className="w-full px-4 py-2.5 hover:bg-green-800/5 transition-colors text-left text-sm"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {canGenerate && (
              <button
                type="button"
                onClick={() => setShowDeclaration(!showDeclaration)}
                className="w-full bg-green-800 text-white px-4 py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-all"
              >
                {showDeclaration ? "Hide declaration letter" : "📄 Generate host declaration letter"}
              </button>
            )}

            {showDeclaration && canGenerate && (
              <DeclarationPreview declaration={declaration} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const DeclarationPreview = ({ declaration }: { declaration: string }) => {
  const [copied, setCopied] = useState(false);
  const [savedToPack, setSavedToPack] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(declaration);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveToPack = () => {
    // Save to localStorage so it's available in the Ready Pack
    localStorage.setItem("cpf-host-declaration", declaration);
    setSavedToPack(true);
    setTimeout(() => setSavedToPack(false), 3000);
  };

  return (
    <div className="mt-3 space-y-4">
      <div className="bg-white border border-gray-100 rounded-lg p-4">
        <pre className="text-xs font-mono whitespace-pre-wrap text-gray-900 leading-relaxed">{declaration}</pre>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
            copied
              ? "bg-green-800 text-white"
              : "bg-gray-50 text-gray-900 hover:bg-gray-50/80"
          }`}
        >
          {copied ? "✓ Copied!" : "📋 Copy text"}
        </button>
        <button
          type="button"
          onClick={handleSaveToPack}
          className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
            savedToPack
              ? "bg-green-800 text-white"
              : "bg-green-800/10 text-green-800 hover:bg-green-800/20"
          }`}
        >
          {savedToPack ? "✓ Saved!" : "💾 Save to pack"}
        </button>
        <a
          href={`https://wa.me/?text=${encodeURIComponent("Hi! Can you please review and sign this declaration letter for my CPF application?\n\n" + declaration)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-3 rounded-xl font-semibold text-sm bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-all text-center"
        >
          Send via WhatsApp
        </a>
      </div>

      {/* Detailed instructions */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 space-y-3">
        <h4 className="font-bold text-sm text-amber-900 dark:text-amber-100">📋 What to do with this letter</h4>
        <ol className="text-xs text-amber-800 dark:text-amber-200 space-y-2 list-decimal list-inside">
          <li><strong>Send it to your host</strong>, copy the text or share via WhatsApp so they can review it</li>
          <li><strong>Your host prints it</strong>, they need to print the letter on paper</li>
          <li><strong>Your host signs it</strong>, a handwritten signature at the bottom, above their name</li>
          <li><strong>They give you a copy of their ID</strong>, a photocopy of their RG or CNH (Brazilian ID)</li>
          <li><strong>Bring both to the office</strong>, the signed letter + their ID copy = your proof of address</li>
        </ol>
      </div>

      <div className="bg-green-800/5 border border-green-800/10 rounded-xl p-4">
        <p className="text-xs text-gray-500">
          <strong>💡 Important:</strong> Make sure your host checks that their name, CPF, and address are correct in the letter before signing. If anything is wrong, update the fields above and regenerate it.
        </p>
      </div>

      <div className="pb-6" />
    </div>
  );
};

const ContactStep = ({
  email, nationality, gender, onEmailChange, onNationalityChange, onGenderChange,
}: {
  email: string; nationality: string; gender: string; onEmailChange: (v: string) => void; onNationalityChange: (v: string) => void; onGenderChange: (v: string) => void;
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
      <label className="text-xs uppercase tracking-[2px] text-green-800 font-bold mb-3 block">Last step</label>
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Almost there!</h2>
      <p className="text-gray-500 text-sm mb-8">
        Your email (for your Ready Pack) and your nationality (for the application form).
      </p>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-2 block">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="you@example.com"
            autoFocus
            autoComplete="email"
            className="w-full px-5 py-4 bg-white border border-gray-100 rounded-xl text-gray-900 outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/10 transition-all placeholder:text-gray-500/50"
          />
        </div>
        <div ref={dropdownRef} className="relative">
          <label className="text-xs font-semibold text-gray-500 mb-2 block">Nationality</label>
          {selectedCountry && !isOpen ? (
            <button
              type="button"
              onClick={() => { setIsOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
              className="w-full px-5 py-4 bg-white border border-gray-100 rounded-xl text-gray-900 text-left flex items-center gap-3 hover:border-green-800/30 transition-all"
            >
              <span className="text-2xl">{selectedCountry.flag}</span>
              <span className="font-medium">{selectedCountry.name}</span>
              <span className="text-gray-500 text-sm ml-auto">Change</span>
            </button>
          ) : (
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setIsOpen(true); }}
              onFocus={() => setIsOpen(true)}
              placeholder="Search country… e.g. South Africa"
              className="w-full px-5 py-4 bg-white border border-gray-100 rounded-xl text-gray-900 outline-none focus:border-green-800 focus:ring-2 focus:ring-green-800/10 transition-all placeholder:text-gray-500/50"
            />
          )}
          {isOpen && (
            <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-[240px] overflow-y-auto">
              {filtered.length === 0 && (
                <div className="px-5 py-4 text-sm text-gray-500">No countries found</div>
              )}
              {filtered.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => selectCountry(c)}
                  className="w-full px-5 py-3 flex items-center gap-3 hover:bg-green-800/5 transition-colors text-left"
                >
                  <span className="text-xl">{c.flag}</span>
                  <span className="font-medium text-sm">{c.name}</span>
                  <span className="text-xs text-gray-500 ml-auto">{c.nationality}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-2 block">Gender <span className="text-gray-300 font-normal">(for Portuguese grammar)</span></label>
          <div className="flex gap-2">
            {([
              { value: "m", label: "Male" },
              { value: "f", label: "Female" },
              { value: "unspecified", label: "Prefer not to say" },
            ] as const).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onGenderChange(opt.value)}
                className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                  gender === opt.value
                    ? "border-green-800 bg-green-800/5 text-green-800"
                    : "border-gray-100 text-gray-500 hover:border-gray-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
