import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; 
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { BRAZILIAN_STATES, STATE_OFFICES, type OnboardingData, type OfficeInfo } from "@/lib/onboarding-data";
import officeVisitImg from "@/assets/office-visit.jpg";
import documentsReadyImg from "@/assets/documents-ready.jpg";
import cpfSuccessImg from "@/assets/cpf-success.jpg";
import DocumentScanner from "@/components/DocumentScanner";
import RejectionFlow from "@/components/RejectionFlow";
import UnlockGuide from "@/components/UnlockGuide";
import {
  applicationHasReadyPack,
  fetchLatestApplication,
  mapApplicationToOnboardingData,
  persistOnboardingData,
  readPersistedOnboardingData,
} from "@/lib/application-storage";

type Tab = "overview" | "office" | "documents" | "guide" | "phrases" | "partners" | "mycpf" | "rejected";

// Portuguese nationality translations for common nationalities
const NATIONALITY_PT: Record<string, string> = {
  "American": "americano(a)", "British": "britânico(a)", "Canadian": "canadense",
  "Australian": "australiano(a)", "South African": "sul-africano(a)", "Irish": "irlandês/irlandesa",
  "German": "alemão/alemã", "French": "francês/francesa", "Italian": "italiano(a)",
  "Spanish": "espanhol(a)", "Portuguese": "português/portuguesa", "Dutch": "holandês/holandesa",
  "Swedish": "sueco(a)", "Norwegian": "norueguês/norueguesa", "Danish": "dinamarquês/dinamarquesa",
  "Japanese": "japonês/japonesa", "Chinese": "chinês/chinesa", "South Korean": "sul-coreano(a)",
  "Indian": "indiano(a)", "Mexican": "mexicano(a)", "Argentine": "argentino(a)",
  "Chilean": "chileno(a)", "Colombian": "colombiano(a)", "Peruvian": "peruano(a)",
  "New Zealander": "neozelandês/neozelandesa", "Israeli": "israelense", "Polish": "polonês/polonesa",
  "Russian": "russo(a)", "Swiss": "suíço(a)", "Belgian": "belga", "Austrian": "austríaco(a)",
  "Nigerian": "nigeriano(a)", "Ghanaian": "ganês/ganesa", "Kenyan": "queniano(a)",
  "Uruguayan": "uruguaio(a)", "Paraguayan": "paraguaio(a)", "Venezuelan": "venezuelano(a)",
  "Filipino": "filipino(a)", "Thai": "tailandês/tailandesa", "Vietnamese": "vietnamita",
  "Turkish": "turco(a)", "Egyptian": "egípcio(a)", "Moroccan": "marroquino(a)",
};

const getNationalityPt = (nationality: string): string => {
  return NATIONALITY_PT[nationality] || nationality.toLowerCase();
};

// External link component — uses <a> tags which work inside iframes (window.open gets blocked)
const ExternalLink = ({ href, className, children, showHint = true }: { href: string; className?: string; children: React.ReactNode; showHint?: boolean }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={`${className || ""} group/ext`}>
    {children}
    {showHint && <span className="inline-flex items-center gap-1 ml-1.5 text-[10px] opacity-60 group-hover/ext:opacity-100 transition-opacity">↗ new tab</span>}
  </a>
);

const ReadyPack = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<OnboardingData | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  useEffect(() => {
    if (authLoading) return;

    const localData = readPersistedOnboardingData();
    if (localData) {
      setData(localData);
    }

    if (!user) {
      if (!localData) navigate("/get-started");
      return;
    }

    fetchLatestApplication(user.id)
      .then((application) => {
        if (application && applicationHasReadyPack(application)) {
          const mapped = mapApplicationToOnboardingData(application);
          setData(mapped);
          persistOnboardingData(mapped);
          return;
        }

        if (!localData) {
          navigate("/get-started");
        }
      })
      .catch(() => {
        if (!localData) navigate("/get-started");
      });
  }, [navigate, user, authLoading]);

  if (!data) return null;

  const stateName = BRAZILIAN_STATES.find((s) => s.value === data.state)?.label || data.state;
  const offices = STATE_OFFICES[data.state] || [];
  const recommendedOffice = offices.find((o) => o.recommended) || offices[0];
  const alternativeOffices = offices.filter((o) => !o.recommended);
  const motherDisplay = data.noMotherName ? data.motherAlternative : data.motherName;

  const allTabs: { id: Tab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "📋" },
    { id: "office", label: "Where to go", icon: "📍" },
    { id: "documents", label: "Documents", icon: "📄" },
    { id: "guide", label: "Day-of guide", icon: "🗓️" },
    { id: "phrases", label: "Portuguese", icon: "🇧🇷" },
    { id: "partners", label: "Life in Brazil", icon: "🔓" },
    { id: "mycpf", label: "My CPF", icon: "🎉" },
  ];

  const isOnMyCpf = activeTab === "mycpf";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-[960px] mx-auto px-6 py-12 pt-16">
          <div className="flex items-center justify-between">
            <a href="/" className="text-sm font-semibold opacity-70 hover:opacity-100 transition-opacity">← cpfeasy.ai</a>
            {user && (
              <button
                onClick={async () => { await supabase.auth.signOut(); navigate("/"); }}
                className="text-xs font-semibold opacity-70 hover:opacity-100 transition-opacity"
              >
                Sign out
              </button>
            )}
          </div>
          <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary-foreground/15 px-3 py-1 rounded-full text-xs font-bold mb-3">
                ✓ Your pack is ready
              </div>
              {user && (
                <div className="inline-flex items-center gap-2 bg-primary-foreground/10 px-3 py-1 rounded-full text-xs font-medium mb-3 ml-2">
                  ☁️ Progress saved to your account
                </div>
              )}
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                {isOnMyCpf ? "My CPF" : "Your Ready Pack"}
              </h1>
              <p className="mt-2 opacity-80 max-w-[440px]">
                {isOnMyCpf
                  ? `Your personal CPF space, ${data.fullName.split(" ")[0]}.`
                  : `Everything's ready, ${data.fullName.split(" ")[0]}. Follow these steps and you'll walk out with your CPF.`
                }
              </p>
            </div>
            <div className="flex gap-3">
              <div className="bg-primary-foreground/15 rounded-xl px-4 py-3 text-center">
                <div className="text-2xl font-bold">Same day</div>
                <div className="text-[10px] font-semibold opacity-70 uppercase">Expected CPF</div>
              </div>
              <div className="bg-primary-foreground/15 rounded-xl px-4 py-3 text-center">
                <div className="text-2xl font-bold">{stateName}</div>
                <div className="text-[10px] font-semibold opacity-70 uppercase">Your state</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-[960px] mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-2 -mx-6 px-6">
            {isOnMyCpf ? (
              <>
                <button
                  onClick={() => setActiveTab("overview")}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
                >
                  ← Open application guide
                </button>
                <div className="flex-1" />
                <button
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground shadow-sm"
                >
                  <span>🎉</span> My CPF
                </button>
              </>
            ) : (
              <>
                {allTabs.filter(t => t.id !== "mycpf").map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <span>{tab.icon}</span> {tab.label}
                  </button>
                ))}
                <div className="flex-1" />
                <button
                  onClick={() => setActiveTab("mycpf")}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap text-muted-foreground hover:bg-secondary hover:text-foreground transition-all border border-border"
                >
                  <span>🎉</span> My CPF
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[960px] mx-auto px-6 py-8">
        {activeTab === "mycpf" && (
          <MyCpfTab data={data} stateName={stateName} motherDisplay={motherDisplay} onOpenGuide={() => setActiveTab("overview")} onOpenLifeGuide={() => setActiveTab("partners")} />
        )}
        {activeTab === "overview" && (
          <OverviewTab data={data} motherDisplay={motherDisplay} stateName={stateName} recommendedOffice={recommendedOffice} setActiveTab={setActiveTab} />
        )}
        {activeTab === "office" && (
          <OfficeTab recommendedOffice={recommendedOffice} alternativeOffices={alternativeOffices} stateName={stateName} data={data} />
        )}
        {activeTab === "documents" && (
          <DocumentsTab data={data} motherDisplay={motherDisplay} />
        )}
        {activeTab === "guide" && (
          <GuideTab data={data} motherDisplay={motherDisplay} recommendedOffice={recommendedOffice} setActiveTab={setActiveTab} />
        )}
        {activeTab === "phrases" && (
          <PhrasesTab data={data} />
        )}
        {activeTab === "partners" && (
          <UnlockGuide />
        )}
        {activeTab === "rejected" && (
          <RejectionFlow onClose={() => setActiveTab("guide")} data={data} />
        )}
      </div>
    </div>
  );
};

// === MY CPF TAB ===
const MyCpfTab = ({ data, stateName, motherDisplay, onOpenGuide, onOpenLifeGuide }: {
  data: OnboardingData; stateName: string; motherDisplay: string; onOpenGuide: () => void; onOpenLifeGuide: () => void;
}) => {
  const [cpfNumber, setCpfNumber] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [cpfCopied, setCpfCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [animateCard, setAnimateCard] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("cpf-saved-number");
    if (stored) {
      setCpfNumber(stored);
      setTimeout(() => setAnimateCard(true), 300);
    }
    const storedPhoto = localStorage.getItem("cpf-saved-photo");
    if (storedPhoto) setPhotoPreview(storedPhoto);
  }, []);

  const formatCpf = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  };

  const handleSaveCpf = () => {
    if (cpfNumber.replace(/\D/g, "").length >= 11) {
      localStorage.setItem("cpf-saved-number", cpfNumber.replace(/\D/g, ""));
      setSaving(true);
      setTimeout(() => {
        setSaving(false);
        setAnimateCard(true);
      }, 1000);
    }
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPhotoPreview(result);
      localStorage.setItem("cpf-saved-photo", result);
    };
    reader.readAsDataURL(file);
  };

  const firstName = data.fullName.split(" ")[0];
  const hasCpf = cpfNumber.replace(/\D/g, "").length >= 11 && animateCard;

  // No CPF yet — waiting state
  if (!hasCpf) {
    return (
      <div className="space-y-8 animate-slide-in">
        <section className="bg-card border border-border rounded-3xl p-8 text-center">
          <div className="text-5xl mb-4">⏳</div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            We're waiting for you, {firstName}!
          </h1>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Once you've visited the office and received your CPF number, come back here and enter it below. This will be your safe place to keep it.
          </p>
        </section>

        <section className="bg-primary/5 border border-primary/15 rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-4">🔐 Enter your CPF number</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={formatCpf(cpfNumber)}
              onChange={(e) => setCpfNumber(e.target.value.replace(/\D/g, ""))}
              placeholder="000.000.000-00"
              className="w-full bg-card border border-border rounded-xl px-4 py-4 text-2xl font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-primary/30"
              maxLength={14}
            />
            <button
              onClick={handleSaveCpf}
              disabled={cpfNumber.replace(/\D/g, "").length < 11 || saving}
              className="w-full bg-primary text-primary-foreground px-4 py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? "⏳ Saving..." : "💾 Save my CPF number"}
            </button>
          </div>
          {/* Photo upload */}
          <div className="mt-4 pt-4 border-t border-primary/10">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">📸 Photo of your CPF printout</p>
            {photoPreview ? (
              <div className="space-y-2">
                <img src={photoPreview} alt="CPF printout" className="w-full max-w-xs rounded-xl border border-border" />
                <p className="text-xs text-primary font-semibold">✓ Photo saved</p>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 bg-card border-2 border-dashed border-border rounded-xl p-6 cursor-pointer hover:border-primary/30 transition-all">
                <span className="text-2xl">📷</span>
                <span className="text-sm font-semibold">Upload a photo of your CPF printout</span>
                <span className="text-xs text-muted-foreground">It'll be stored safely here so you always have a backup</span>
                <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} className="hidden" />
              </label>
            )}
          </div>
        </section>

        <button
          onClick={onOpenGuide}
          className="w-full bg-secondary text-foreground px-4 py-3 rounded-xl font-semibold text-sm hover:bg-secondary/80 transition-all"
        >
          📋 Open application guide — prepare for your visit →
        </button>
      </div>
    );
  }

  // CPF saved — celebration + animated card
  const slides = [
    {
      id: "card",
      title: "My CPF",
      content: (
        <div className="py-6">
          {/* Animated CPF Card */}
          <div className={`mx-auto max-w-sm transition-all duration-700 ${animateCard ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}>
            <div className="relative bg-gradient-to-br from-[hsl(var(--primary)/0.9)] via-[hsl(var(--primary)/0.7)] to-[hsl(var(--primary)/0.5)] rounded-2xl p-6 shadow-2xl shadow-primary/20 text-primary-foreground overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-2 right-2 text-[120px] font-bold leading-none">🇧🇷</div>
              </div>
              
              {/* Header */}
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[9px] uppercase tracking-[3px] opacity-70 font-bold">REPÚBLICA FEDERATIVA DO BRASIL</p>
                    <p className="text-[8px] uppercase tracking-[2px] opacity-50 mt-0.5">CADASTRO DE PESSOAS FÍSICAS</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center text-lg font-bold">
                    CPF
                  </div>
                </div>

                {/* CPF Number */}
                <div className="mb-6">
                  <p className="text-[9px] uppercase tracking-[2px] opacity-60 mb-1">Nº DO CPF</p>
                  <p className="text-3xl font-bold font-mono tracking-[4px]">{formatCpf(cpfNumber.replace(/\D/g, ""))}</p>
                </div>

                {/* Name */}
                <div className="mb-4">
                  <p className="text-[9px] uppercase tracking-[2px] opacity-60 mb-1">NOME</p>
                  <p className="text-sm font-bold uppercase tracking-wider">{data.fullName}</p>
                </div>

                {/* Bottom details */}
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[9px] uppercase tracking-[2px] opacity-60 mb-0.5">NASCIMENTO</p>
                    <p className="text-xs font-semibold">{data.nationality}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] uppercase tracking-[2px] opacity-60 mb-0.5">SITUAÇÃO</p>
                    <p className="text-xs font-bold">REGULAR ✓</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Copy button */}
          <div className="text-center mt-6">
            <button
              onClick={() => { navigator.clipboard.writeText(cpfNumber.replace(/\D/g, "")); setCpfCopied(true); setTimeout(() => setCpfCopied(false), 2000); }}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
            >
              {cpfCopied ? "✓ Text copied!" : "📋 Copy CPF number"}
            </button>
          </div>
        </div>
      ),
    },
    {
      id: "details",
      title: "My Details",
      content: (
        <div className="py-6 space-y-3">
          <InfoField label="Full Name" value={data.fullName} />
          <InfoField label="Passport" value={data.passportNumber} />
          <InfoField label="Nationality" value={`${data.nationality} / ${getNationalityPt(data.nationality)}`} />
          <InfoField label="Mother's Name" value={motherDisplay} />
          {data.fatherName && <InfoField label="Father's Name" value={data.fatherName} />}
          <InfoField label="Email" value={data.email} />
          <InfoField label="Address" value={`${data.streetAddress}, ${data.city}, ${data.state}`} />
        </div>
      ),
    },
    {
      id: "photo",
      title: "Document",
      content: (
        <div className="py-6 text-center space-y-4">
          {photoPreview ? (
            <div className="space-y-3">
              <img src={photoPreview} alt="CPF printout" className="max-w-sm mx-auto rounded-xl border border-border" />
              <p className="text-sm text-primary font-semibold">✓ Your CPF photo is stored here for quick access</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-muted-foreground text-sm">Add a photo of your CPF printout so this page becomes your full backup space.</div>
              <label className="inline-flex flex-col items-center gap-2 bg-secondary px-4 py-4 rounded-xl text-sm font-semibold cursor-pointer hover:bg-secondary/80">
                <span>📷 Upload photo of your CPF</span>
                <span className="text-xs text-muted-foreground font-medium">Keep it stored here so you can always find it again</span>
                <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} className="hidden" />
              </label>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-slide-in">
      {/* Celebration header */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/15 rounded-3xl p-8 text-center">
        <div className="text-5xl mb-4">🇧🇷</div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          You did it, {firstName}! 🇧🇷
        </h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-md mx-auto">
          Your CPF is live. Brazil just opened up for you.
        </p>
      </section>

      {/* Swipeable cards */}
      <section className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex border-b border-border">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => setActiveSlide(i)}
              className={`flex-1 py-3 text-xs font-bold transition-all ${
                activeSlide === i
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              {slide.title}
            </button>
          ))}
        </div>
        <div className="p-6">
          {slides[activeSlide].content}
        </div>
        <div className="flex justify-center gap-2 pb-4">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                activeSlide === i ? "bg-primary w-6" : "bg-border"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Quick reference */}
      <section className="bg-secondary rounded-2xl p-6">
        <h3 className="font-bold mb-2">Your safe space</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Come back anytime to find your CPF number, your details, and your CPF photo in one place. This is your personal reference space.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">My CPF</div>
            <div className="font-semibold text-sm">Your number, ready to copy</div>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">My details</div>
            <div className="font-semibold text-sm">Your submitted info, saved</div>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">My document</div>
            <div className="font-semibold text-sm">Your CPF photo stored here</div>
          </div>
        </div>
      </section>

      {/* What to do next — quick links to Life in Brazil */}
      <section className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-1">🚀 What to do next with your CPF</h3>
        <p className="text-sm text-muted-foreground mb-4">You've unlocked a whole new life in Brazil. Here are the first things to set up.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { icon: "🏦", title: "Open a bank", desc: "Nubank — fully digital, zero fees", difficulty: "Easy" },
            { icon: "📱", title: "Get a SIM card", desc: "Vivo, Claro, TIM, or eSIM", difficulty: "Easy" },
            { icon: "⚡", title: "Set up Pix", desc: "Free instant payments", difficulty: "Easy" },
            { icon: "🍔", title: "Food delivery", desc: "iFood, Rappi — order anything", difficulty: "Easy" },
            { icon: "🛍️", title: "Shop online", desc: "Mercado Livre, Amazon BR", difficulty: "Easy" },
            { icon: "🏠", title: "Rent a place", desc: "QuintoAndar, long-stay Airbnb", difficulty: "Medium" },
          ].map((item) => (
            <button
              key={item.title}
              onClick={() => onOpenLifeGuide()}
              className="bg-secondary hover:bg-primary/5 border border-border hover:border-primary/20 rounded-xl p-4 text-left transition-all group"
            >
              <div className="text-2xl mb-2">{item.icon}</div>
              <h4 className="font-bold text-sm">{item.title}</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
            </button>
          ))}
        </div>
        <button
          onClick={() => onOpenLifeGuide()}
          className="mt-4 w-full bg-primary text-primary-foreground px-4 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all"
        >
          🔓 See full guide — Life in Brazil →
        </button>
      </section>
    </div>
  );
};

// === OVERVIEW TAB ===
const OverviewTab = ({ data, motherDisplay, stateName, recommendedOffice, setActiveTab }: {
  data: OnboardingData; motherDisplay: string; stateName: string; recommendedOffice?: OfficeInfo; setActiveTab: (t: Tab) => void;
}) => (
  <div className="space-y-8 animate-slide-in">
    {/* Visual process timeline */}
    <section className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-secondary">
        <h2 className="font-bold">Your CPF journey — three steps and you're done</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:divide-x divide-border">
        <ProcessStep
          num={1}
          title="Prepare your documents"
          desc="Print your forms and gather your passport, proof of address, and copies."
          image={documentsReadyImg}
          status="ready"
        />
        <ProcessStep
          num={2}
          title="Visit the office"
          desc={`Go to ${recommendedOffice?.name || "Receita Federal"} with everything prepared.`}
          image={officeVisitImg}
          status="next"
        />
        <ProcessStep
          num={3}
          title="Get your CPF"
          desc="Walk out with your CPF number. Start using it immediately for SIM, bank, Pix."
          image={cpfSuccessImg}
          status="upcoming"
        />
      </div>
    </section>

    {/* Your submitted info */}
    <section className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-secondary flex items-center justify-between">
        <h2 className="font-bold">Your application details</h2>
        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md font-semibold">Verified ✓</span>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <InfoField label="Full Name" value={data.fullName} />
          <InfoField label="Mother's Name" value={motherDisplay} />
          {data.fatherName && <InfoField label="Father's Name" value={data.fatherName} />}
          <InfoField label="Passport" value={data.passportNumber} />
          <InfoField label="Nationality" value={`${data.nationality} (${getNationalityPt(data.nationality)})`} />
          <InfoField label="State" value={`${data.state} — ${stateName}`} />
          <InfoField label="Address" value={data.streetAddress} />
          <InfoField label="City" value={data.city} />
          <InfoField label="Email" value={data.email} />
        </div>
      </div>
    </section>

    {/* Quick actions */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <QuickAction icon="📍" title="View office details" desc="Address, phone, hours, tips" onClick={() => setActiveTab("office")} />
      <QuickAction icon="📄" title="Document checklist" desc="What to print & bring" onClick={() => setActiveTab("documents")} />
      <QuickAction icon="🗓️" title="Day-of guide" desc="Step-by-step for the visit" onClick={() => setActiveTab("guide")} />
      <QuickAction icon="🇧🇷" title="Portuguese phrases" desc="What to say at the office" onClick={() => setActiveTab("phrases")} />
    </div>

    {/* After CPF */}
    <section className="bg-primary/5 border border-primary/15 rounded-2xl p-6">
      <h2 className="font-bold text-lg mb-1">🎉 After you get your CPF</h2>
      <p className="text-sm text-muted-foreground mb-4">Once you have your CPF number, you can immediately:</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <AfterCard icon="📱" title="Buy a SIM" desc="Any carrier store" />
        <AfterCard icon="🏦" title="Open a bank" desc="Nubank, Inter, C6" />
        <AfterCard icon="💳" title="Use Pix" desc="Free instant payments" />
        <AfterCard icon="🛒" title="Shop online" desc="Amazon, Mercado Livre" />
      </div>
    </section>

    {/* CPF Storage */}
    <CpfStorageSection onCpfSaved={() => setActiveTab("mycpf")} data={data} />
  </div>
);

// === OFFICE TAB ===
const CITY_TIPS: Record<string, string> = {
  SP: "Go to CAC Bela Vista (Rua Avanhandava, 55). Multiple foreigners confirm fast processing (10-15 min). Avoid the Praça Ramos location — foreigners report being turned away.",
  SC: "Centro office confirmed foreigner-friendly.",
  RJ: "Main offices handle foreigners regularly.",
};

const OfficeTab = ({ recommendedOffice, alternativeOffices, stateName, data }: {
  recommendedOffice?: OfficeInfo; alternativeOffices: OfficeInfo[]; stateName: string; data: OnboardingData;
}) => {
  const [troubleOpen, setTroubleOpen] = useState<string | null>(null);
  const cityTip = CITY_TIPS[data.state] || "Walk-in should work. Arrive early.";

  return (
  <div className="space-y-6 animate-slide-in">
    {/* Walk-in is default */}
    <section className="bg-primary/5 border border-primary/15 rounded-2xl p-6">
      <h3 className="font-bold text-lg flex items-center gap-2">🚶 Walk-in is the default</h3>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        <li>• Most Receita Federal offices process CPF for foreigners <strong>without an appointment</strong></li>
        <li>• The online booking system requires a CPF to use (which you don't have yet) — so walk-in is the only option</li>
        <li>• Just go in, take a queue number at reception, and wait</li>
      </ul>
      <div className="mt-4 bg-card border border-border rounded-xl p-4">
        <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">⏰ Best times to visit</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2"><span className="text-primary">✓</span> Tuesday to Thursday, 8:00–10:00 AM</div>
          <div className="flex items-center gap-2"><span className="text-primary">✓</span> Arrive when the office opens</div>
          <div className="flex items-center gap-2"><span className="text-destructive">✕</span> Avoid Mondays & first week of month</div>
          <div className="flex items-center gap-2"><span className="text-destructive">✕</span> Avoid afternoons</div>
        </div>
      </div>
      <div className="mt-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-3">
        <p className="text-xs text-amber-800 dark:text-amber-200">
          <strong>The appointment catch-22:</strong> You may see an option to book online, but it requires a CPF — which you don't have yet. Don't worry about this. Walk-in works for CPF registration.
        </p>
      </div>
    </section>

    {/* City-specific tip */}
    <section className="bg-card border border-border rounded-2xl p-5">
      <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">📍 Tip for {stateName}</p>
      <p className="text-sm text-muted-foreground">{cityTip}</p>
    </section>

    {recommendedOffice && (
      <>
        <div className="text-xs uppercase tracking-[2px] text-primary font-bold">Recommended office</div>
        <OfficeCard office={recommendedOffice} isRecommended />

        {/* What to expect */}
        <section className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold mb-4">What to expect at this office</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ExpectCard icon="⏱️" title="Wait time" value={recommendedOffice.waitTime} />
            <ExpectCard icon="⭐" title="Rating" value={`${recommendedOffice.rating}/5 (${recommendedOffice.reviewCount} reviews)`} />
            <ExpectCard icon="🕐" title="Hours" value={recommendedOffice.hours} />
          </div>
          <div className="mt-4 bg-primary/5 border border-primary/10 rounded-xl p-4">
            <p className="text-sm font-semibold text-primary mb-1">💡 Pro tip from visitors</p>
            <p className="text-sm text-muted-foreground">{recommendedOffice.tip}</p>
          </div>
        </section>

        {/* Reviews section */}
        <ReviewsSection office={recommendedOffice} />

        {/* How to prepare */}
        <section className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-bold mb-3">How to prepare for this office</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-primary/10 text-primary rounded-md flex items-center justify-center shrink-0 text-xs font-bold">1</span>
              <span><strong>Arrive early.</strong> The office opens at {recommendedOffice.hours.split(",")[1]?.trim().split("–")[0] || "7:00"}. Be there 15–30 minutes before opening for the shortest wait.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-primary/10 text-primary rounded-md flex items-center justify-center shrink-0 text-xs font-bold">2</span>
              <span><strong>Take a number.</strong> When you enter, look for a ticket machine or ask the security guard "Ficha para CPF, por favor" (ticket for CPF, please).</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-primary/10 text-primary rounded-md flex items-center justify-center shrink-0 text-xs font-bold">3</span>
              <span><strong>Wait for your number.</strong> There will be screens showing the current number. When yours is called, go to the indicated window.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-primary/10 text-primary rounded-md flex items-center justify-center shrink-0 text-xs font-bold">4</span>
              <span><strong>Present your documents.</strong> Hand over your passport + copies, proof of address, and say you want a CPF.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-primary/10 text-primary rounded-md flex items-center justify-center shrink-0 text-xs font-bold">5</span>
              <span><strong>Receive your CPF.</strong> In most cases, you'll receive a printout with your CPF number right there. Keep this document safe!</span>
            </li>
          </ul>
        </section>
      </>
    )}

    {alternativeOffices.length > 0 && (
      <>
        <div className="text-xs uppercase tracking-[2px] text-muted-foreground font-bold mt-8">Alternative offices in {stateName}</div>
        <div className="space-y-4">
          {alternativeOffices.map((office, i) => (
            <OfficeCard key={i} office={office} />
          ))}
        </div>
      </>
    )}

    {/* Correios backup */}
    <section className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-6 py-3 border-b border-border bg-amber-50 dark:bg-amber-950/20 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 px-2.5 py-1 rounded-md text-xs font-bold">🟡 Alternative — R$7 fee</span>
        <h3 className="font-bold text-sm">Correios (Post Office)</h3>
      </div>
      <div className="p-6">
        <p className="text-sm text-muted-foreground mb-3">If Receita Federal is busy or redirects you, any Correios can process your CPF for R$7. Walk-in, no appointment needed.</p>
        <ExternalLink
          href={`https://www.google.com/maps/search/Correios+${encodeURIComponent(data.city + ", " + data.state + ", Brazil")}`}
          className="inline-flex items-center gap-2 bg-secondary text-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-secondary/80 transition-all"
        >
          📍 Find nearest Correios
        </ExternalLink>
        <div className="mt-4 bg-secondary rounded-xl p-4">
          <p className="text-xs text-muted-foreground">
            <strong>Note about banks:</strong> Some Banco do Brasil and Caixa branches can process CPF, but availability for foreigners is inconsistent. We recommend Receita Federal or Correios instead.
          </p>
        </div>
      </div>
    </section>

    {/* Troubleshooting */}
    <section className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-secondary">
        <h3 className="font-bold">🔧 Having trouble?</h3>
        <p className="text-xs text-muted-foreground mt-1">Common problems and what to do</p>
      </div>
      <div className="p-4 space-y-1">
        {[
          { q: "They said they can't do CPF here", a: "This sometimes happens at smaller branches. Go to a larger Receita Federal office, or try the nearest Correios (post office) instead." },
          { q: "They asked for an appointment", a: "CPF registration for foreigners is usually handled as a walk-in. Ask: 'Posso fazer a inscrição no CPF sem agendamento?' (Can I do CPF registration without an appointment?) If they insist, use the email method — your pre-written email is in the dashboard." },
          { q: "They asked for a document I don't have", a: "The only required documents are your passport and the signed FCPF form. Show them these. If they ask for a birth certificate, it's optional — explain that you have your mother's name on the form already." },
          { q: "They refused because I'm a foreigner", a: "Any foreigner can register for CPF — this is your legal right under IN RFB 2.172/2024. Try another Receita Federal office or the nearest Correios." },
          { q: "The system was offline", a: "This happens occasionally. Come back the next day, or use the email method. Your pre-written email is ready to send from your dashboard." },
          { q: "I sent the email but got no response", a: "Wait 7 business days. If no response, resend to the same address. If still nothing, try a different regional office email or go in person." },
        ].map(({ q, a }) => (
          <button
            key={q}
            onClick={() => setTroubleOpen(troubleOpen === q ? null : q)}
            className="w-full text-left"
          >
            <div className={`rounded-xl p-4 transition-all ${troubleOpen === q ? "bg-primary/5 border border-primary/10" : "hover:bg-secondary"}`}>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">"{q}"</p>
                <span className="text-muted-foreground text-xs shrink-0 ml-2">{troubleOpen === q ? "▲" : "▼"}</span>
              </div>
              {troubleOpen === q && (
                <p className="text-sm text-muted-foreground mt-2">{a}</p>
              )}
            </div>
          </button>
        ))}
      </div>
    </section>
  </div>
  );
};

// === REVIEWS SECTION ===
const ReviewsSection = ({ office }: { office: OfficeInfo }) => {
  const googleReviewsUrl = `https://www.google.com/maps/search/${encodeURIComponent(office.name + " " + office.address)}`;

  return (
    <section className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-secondary flex items-center justify-between">
        <div>
          <h3 className="font-bold">⭐ Google Maps reviews</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{office.reviewCount} reviews · {office.rating}/5 average on Google</p>
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className={`text-lg ${star <= Math.round(office.rating) ? "text-amber-400" : "text-border"}`}>★</span>
          ))}
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div className="bg-secondary rounded-xl p-5 text-center space-y-3">
          <div className="text-3xl">🗺️</div>
          <h4 className="font-bold">See what real visitors say</h4>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Read verified reviews from people who visited this office on Google Maps — including wait times, staff helpfulness, and tips.
          </p>
          <ExternalLink
            href={googleReviewsUrl}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
          >
            ⭐ Read {office.reviewCount} reviews on Google Maps →
          </ExternalLink>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-3">
          <p className="text-xs text-amber-800 dark:text-amber-200">
            <strong>💡 Pro tip:</strong> Search for "CPF" or "estrangeiro" in the reviews to find experiences from other foreigners who registered their CPF at this office.
          </p>
        </div>
      </div>
    </section>
  );
};

// === DOCUMENTS TAB ===
const DocumentsTab = ({ data, motherDisplay }: { data: OnboardingData; motherDisplay: string }) => {
  const [declarationCopied, setDeclarationCopied] = useState(false);
  const hasHost = data.stayingWithFriend && data.hostName.trim().length > 2;
  
  const MONTHS_PT = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  const declaration = hasHost ? (() => {
    const now = new Date();
    const hour = now.getHours();
    const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
    return `${greeting}!\n\nEspero que esteja tudo bem. Segue abaixo a declaração de residência conforme solicitado para o registro de CPF.\n\n---\n\nDECLARAÇÃO DE RESIDÊNCIA\n\nEu, ${data.hostName}, portador(a) do CPF nº ${data.hostCpf || "[CPF do anfitrião]"}, residente à ${data.hostAddress}, ${data.hostCity}, ${data.state}, declaro para os devidos fins que ${data.fullName}, portador(a) do passaporte nº ${data.passportNumber}, nacionalidade ${getNationalityPt(data.nationality)}, reside temporariamente em meu endereço acima mencionado.\n\nDeclaro ainda que me responsabilizo pela veracidade das informações aqui prestadas.\n\nPor ser verdade, firmo a presente declaração.\n\n${data.hostCity}, ${now.getDate()} de ${MONTHS_PT[now.getMonth()]} de ${now.getFullYear()}\n\n_______________________________\n${data.hostName}\nCPF: ${data.hostCpf || "[CPF do anfitrião]"}\n\n---\n\nMuito obrigado(a) pela ajuda!\nAtenciosamente,\n${data.fullName}`;
  })() : null;

  return (
  <div className="space-y-6 animate-slide-in">
    {/* Visual checklist */}
    <section className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-secondary">
        <h2 className="font-bold">Document checklist — bring all of these</h2>
        <p className="text-xs text-muted-foreground mt-1">Check each item off as you prepare. Missing one could mean a wasted trip.</p>
      </div>
      <div className="p-6 space-y-3">
        <DocCheck title="Original passport" desc="Not a copy — they need to see the original document. Bring the passport you used to enter Brazil." critical />
        <DocCheck title="Passport copy — photo page" desc="A clear colour photocopy of the page with your photo, name, and passport number. Colour preferred, must show all details clearly." critical uploadable />
        <DocCheck title="Passport copy — visa/entry stamp page" desc="Copy of the page showing your Brazilian entry stamp or visa. This proves your legal entry." critical uploadable />
        
        <div className="border-t border-border pt-3 mt-3">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Proof of address — bring ONE of the following</p>
          <DocCheck title="Hotel booking confirmation" desc="A printed or digital confirmation showing the hotel name, address, and your name. Most commonly accepted." uploadable />
          <DocCheck title="Airbnb rental confirmation" desc="Your Airbnb booking confirmation with the full address shown. Print it or show on your phone." uploadable />
          <DocCheck title="Rental contract" desc="If you're renting an apartment, bring a copy of the signed contract showing the address." uploadable />
          <DocCheck title="Utility bill with address" desc="An electricity, water, or internet bill in your name or your host's name, showing the Brazilian address." uploadable />
          <DocCheck title="Invitation letter from your host" desc="If staying with family, partner, or friends — a signed letter stating you reside at their address, with their name, CPF, address, and signature. Attach a copy of their ID." uploadable />
        </div>

        <div className="border-t border-border pt-3 mt-3">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Recommended extras</p>
          <DocCheck title="Printed CPF application form" desc="Some offices have you fill it on-site, but arriving with a printed copy speeds things up and avoids delays." uploadable />
          <DocCheck title="Birth certificate with apostille" desc="Not always required, but can speed things up. If you have an apostilled copy, bring it." uploadable />
          <DocCheck title="Pen" desc="Sounds silly, but bring your own pen. Not all offices provide them." />
        </div>
      </div>
    </section>

    {/* Photo tips */}
    <section className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-secondary">
        <h2 className="font-bold">📸 Passport copy tips — avoid rejection</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-primary/5 border border-primary/15 rounded-xl p-4">
            <h3 className="font-semibold text-sm text-primary mb-2">✓ Good copy</h3>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>• Clear, sharp, all text readable</li>
              <li>• Full page visible, no edges cut off</li>
              <li>• Color photocopy (preferred)</li>
              <li>• Flat — no creases or shadows</li>
            </ul>
          </div>
          <div className="bg-destructive/5 border border-destructive/15 rounded-xl p-4">
            <h3 className="font-semibold text-sm text-destructive mb-2">✕ Bad copy (will be rejected)</h3>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>• Blurry or low resolution photo</li>
              <li>• Edges of passport page cut off</li>
              <li>• Photo taken at an angle with glare</li>
              <li>• Black and white when color available</li>
            </ul>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4">💡 <strong>No printer?</strong> Most convenience stores (papelarias) and print shops in Brazil will make copies for R$0.50–R$1.00 per page. Just show them your passport and say "Xerox, por favor."</p>
      </div>
    </section>

    {/* Official form link */}
    <section className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-secondary">
        <h2 className="font-bold">📝 Official CPF application form</h2>
      </div>
      <div className="p-6 space-y-4">
        <ExternalLink
          href="https://servicos.receita.fazenda.gov.br/Servicos/CPF/InscricaoCpfEstrangeiro/default.asp"
          className="flex items-center gap-4 bg-secondary rounded-xl p-4 hover:bg-secondary/80 transition-all group w-full text-left"
        >
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-2xl shrink-0">📄</div>
          <div className="flex-1">
            <h3 className="font-bold text-sm group-hover:text-primary transition-colors">Receita Federal — CPF Online Registration</h3>
            <p className="text-xs text-muted-foreground mt-0.5">servicos.receita.fazenda.gov.br</p>
          </div>
          <span className="text-primary font-semibold text-sm shrink-0">Open →</span>
        </ExternalLink>

        {/* Pre-filled reference */}
        <div className="bg-secondary rounded-xl p-5">
          <h3 className="font-bold text-sm mb-3">Your data for the form fields</h3>
          <div className="bg-card rounded-lg p-4 font-mono text-xs space-y-2 border border-border">
            <FormFieldDisplay label="Nome Completo" value={data.fullName} />
            <FormFieldDisplay label="Nome da Mãe" value={motherDisplay} />
            {data.fatherName && <FormFieldDisplay label="Nome do Pai" value={data.fatherName} />}
            <FormFieldDisplay label="Tipo de Documento" value="Passaporte" />
            <FormFieldDisplay label="Número do Documento" value={data.passportNumber} />
            <FormFieldDisplay label="Nacionalidade" value={getNationalityPt(data.nationality)} />
            <FormFieldDisplay label="Endereço" value={data.streetAddress} />
            <FormFieldDisplay label="Cidade / UF" value={`${data.city}, ${data.state}`} />
            <FormFieldDisplay label="E-mail" value={data.email} />
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            💡 Copy these values exactly as shown into the Portuguese form fields. "Nome da Mãe" means "Mother's name."
          </p>
        </div>

        {/* Protocol clarification */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <h4 className="font-bold text-sm mb-2">⚠️ Important: About the message after submitting</h4>
          <p className="text-sm text-muted-foreground mb-2">
            After submitting the form, you'll see a message in Portuguese saying you need to go to a Receita Federal office. This appears for everyone. You have <strong>two options</strong>:
          </p>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li><strong>Go in person</strong> (recommended — faster, usually same-day)</li>
            <li><strong>Send everything by email</strong> (the email template is ready for you below)</li>
          </ol>
          <p className="text-xs text-muted-foreground mt-2">Both options work. In-person is faster. Email takes 3-7 business days.</p>
        </div>
      </div>
    </section>

    {/* Host declaration letter */}
    {hasHost && declaration && (
      <DeclarationSection declaration={declaration} declarationCopied={declarationCopied} setDeclarationCopied={setDeclarationCopied} data={data} />
    )}

    {/* Upload & compile all documents into one PDF */}
    <DocumentCompiler data={data} motherDisplay={motherDisplay} hasDeclaration={!!(hasHost && declaration)} declaration={declaration || ""} />

    {/* Email template to Receita Federal */}
    <EmailTemplateSection data={data} motherDisplay={motherDisplay} />

    {/* AI Document Scanner */}
    <DocumentScanner />
  </div>
  );
};

// === DECLARATION SECTION ===
const DeclarationSection = ({ declaration, declarationCopied, setDeclarationCopied, data }: {
  declaration: string; declarationCopied: boolean; setDeclarationCopied: (v: boolean) => void; data: OnboardingData;
}) => {
  const [savedToPack, setSavedToPack] = useState(false);

  const whatsappMsg = `Hi! I need your help with my CPF registration in Brazil 🇧🇷\n\nI've prepared a residency declaration letter that I need you to:\n1. Print the letter below\n2. Sign it at the bottom\n3. Give me a copy of your ID (RG or CNH)\n\nHere's the letter:\n\n${declaration}`;

  return (
    <section className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-primary/5 flex items-center justify-between">
        <h2 className="font-bold">📝 Host declaration letter</h2>
        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md font-semibold">Generated ✓</span>
      </div>
      <div className="p-6 space-y-4">
        <p className="text-sm text-muted-foreground">This letter is your proof of address. Send it to your host so they can print and sign it.</p>
        
        <div className="bg-secondary rounded-lg p-4">
          <pre className="text-xs font-mono whitespace-pre-wrap text-foreground leading-relaxed">{declaration}</pre>
        </div>

        {/* Two main action buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => { navigator.clipboard.writeText(declaration); setDeclarationCopied(true); setTimeout(() => setDeclarationCopied(false), 2500); }}
            className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
              declarationCopied ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-secondary/80"
            }`}
          >
            {declarationCopied ? "✓ Text copied!" : "📋 Copy letter text"}
          </button>
          <button
            onClick={() => {
              const blob = new Blob([declaration], { type: "text/plain" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url; a.download = "declaracao-residencia.txt"; a.click();
              URL.revokeObjectURL(url);
              setSavedToPack(true);
              setTimeout(() => setSavedToPack(false), 3000);
            }}
            className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
              savedToPack ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary hover:bg-primary/20"
            }`}
          >
            {savedToPack ? "✓ Saved!" : "💾 Save to my documents"}
          </button>
        </div>

        {/* Send to host via WhatsApp */}
        <ExternalLink
          href={`https://wa.me/?text=${encodeURIComponent(whatsappMsg)}`}
          className="w-full block text-center bg-[#25D366] text-white px-4 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-all"
        >
          💬 Send to your host via WhatsApp — get them to sign it
        </ExternalLink>

        {/* Detailed steps */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-5 space-y-3">
          <h4 className="font-bold text-sm text-amber-900 dark:text-amber-100">📋 What your host needs to do</h4>
          <ol className="text-sm text-amber-800 dark:text-amber-200 space-y-2.5 list-decimal list-inside">
            <li><strong>Check the details</strong> — make sure their name, CPF number, and address are correct</li>
            <li><strong>Print the letter</strong> — it needs to be on paper</li>
            <li><strong>Sign it</strong> — handwritten signature at the bottom, above their printed name</li>
            <li><strong>Make a copy of their ID</strong> — a photocopy of their RG or CNH (Brazilian ID document)</li>
            <li><strong>Give you both</strong> — the signed letter + their ID copy. These together = your proof of address</li>
          </ol>
        </div>

        <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
          <p className="text-sm text-muted-foreground">
            <strong>💡 Pro tip:</strong> Send it to your host now so they have time to prepare. You'll need both the signed letter and their ID copy on the day you visit the office.
          </p>
        </div>
      </div>
      <div className="pb-6" />
    </section>
  );
};

// === DOCUMENT COMPILER ===
type UploadedDoc = { name: string; label: string; file: File; preview?: string };

const DOCUMENT_SLOTS = [
  { id: "passport_photo", label: "Passport — photo page", required: true },
  { id: "passport_stamp", label: "Passport — visa/entry stamp", required: true },
  { id: "proof_address", label: "Proof of address", required: true },
  { id: "declaration", label: "Signed host declaration", required: false },
  { id: "cpf_form", label: "CPF application form", required: false },
  { id: "birth_cert", label: "Birth certificate (apostille)", required: false },
  { id: "extra1", label: "Extra document", required: false },
];

const DocumentCompiler = ({ data, motherDisplay, hasDeclaration, declaration }: {
  data: OnboardingData; motherDisplay: string; hasDeclaration: boolean; declaration: string;
}) => {
  const [uploads, setUploads] = useState<Record<string, UploadedDoc>>({});
  const [compiling, setCompiling] = useState(false);
  const [compiled, setCompiled] = useState(false);

  const handleUpload = (slotId: string, label: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined;
    setUploads(prev => ({ ...prev, [slotId]: { name: file.name, label, file, preview } }));
  };

  const removeUpload = (slotId: string) => {
    setUploads(prev => {
      const next = { ...prev };
      if (next[slotId]?.preview) URL.revokeObjectURL(next[slotId].preview!);
      delete next[slotId];
      return next;
    });
  };

  const uploadCount = Object.keys(uploads).length;
  const requiredSlots = DOCUMENT_SLOTS.filter(s => s.required);
  const requiredUploaded = requiredSlots.filter(s => uploads[s.id]).length;

  const handleCompile = async () => {
    setCompiling(true);
    try {
      const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");
      // Sanitize text for WinAnsi encoding (standard PDF fonts)
      const safe = (text: string) => text.replace(/[^\x20-\x7E\xA0-\xFF]/g, (ch) => {
        const map: Record<string, string> = { "\u2713": "[x]", "\u2714": "[x]", "\u2717": "[!]", "\u2718": "[!]", "\u2019": "'", "\u2018": "'", "\u201C": '"', "\u201D": '"', "\u2026": "...", "\u2014": "--", "\u2013": "-" };
        return map[ch] || "";
      });
      const mergedPdf = await PDFDocument.create();
      const font = await mergedPdf.embedFont(StandardFonts.Helvetica);
      const fontBold = await mergedPdf.embedFont(StandardFonts.HelveticaBold);

      // Cover page with personal details
      const coverPage = mergedPdf.addPage([595, 842]); // A4
      const { height } = coverPage.getSize();
      let y = height - 60;
      coverPage.drawText("CPF APPLICATION DOCUMENT PACK", { x: 50, y, font: fontBold, size: 18, color: rgb(0.1, 0.4, 0.2) });
      y -= 30;
      coverPage.drawText(safe(`Prepared for: ${data.fullName}`), { x: 50, y, font, size: 12 });
      y -= 18;
      coverPage.drawText(`Date: ${new Date().toLocaleDateString()}`, { x: 50, y, font, size: 10, color: rgb(0.4, 0.4, 0.4) });
      y -= 40;
      coverPage.drawText("PERSONAL DETAILS", { x: 50, y, font: fontBold, size: 14 });
      y -= 5;
      coverPage.drawLine({ start: { x: 50, y }, end: { x: 545, y }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
      y -= 22;
      const details = [
        ["Full Name", data.fullName],
        ["Mother's Name", motherDisplay],
        ...(data.fatherName ? [["Father's Name", data.fatherName]] : []),
        ["Passport", data.passportNumber],
        ["Nationality", data.nationality],
        ["Address", `${data.streetAddress}, ${data.city}, ${data.state}`],
        ["Email", data.email],
      ];
      for (const [label, value] of details) {
        coverPage.drawText(`${label}:`, { x: 50, y, font: fontBold, size: 10 });
        coverPage.drawText(safe(value), { x: 180, y, font, size: 10 });
        y -= 18;
      }
      y -= 20;
      coverPage.drawText("DOCUMENTS INCLUDED", { x: 50, y, font: fontBold, size: 14 });
      y -= 5;
      coverPage.drawLine({ start: { x: 50, y }, end: { x: 545, y }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
      y -= 22;
      Object.values(uploads).forEach((doc) => {
        coverPage.drawText(safe(`[x]  ${doc.label}: ${doc.name}`), { x: 50, y, font, size: 10 });
        y -= 18;
      });

      // Host declaration page if available
      if (hasDeclaration && declaration) {
        const declPage = mergedPdf.addPage([595, 842]);
        let dy = 842 - 60;
        declPage.drawText("HOST DECLARATION LETTER", { x: 50, y: dy, font: fontBold, size: 14, color: rgb(0.1, 0.4, 0.2) });
        dy -= 5;
        declPage.drawLine({ start: { x: 50, y: dy }, end: { x: 545, y: dy }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
        dy -= 22;
        const lines = declaration.split("\n");
        for (const line of lines) {
          if (dy < 60) { break; }
          declPage.drawText(safe(line.slice(0, 85)), { x: 50, y: dy, font, size: 10 });
          dy -= 16;
        }
      }

      // Merge each uploaded file
      for (const upload of Object.values(uploads)) {
        const arrayBuffer = await upload.file.arrayBuffer();

        if (upload.file.type === "application/pdf") {
          // Merge PDF pages
          try {
            const srcPdf = await PDFDocument.load(arrayBuffer);
            const copiedPages = await mergedPdf.copyPages(srcPdf, srcPdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
          } catch {
            // If PDF can't be loaded, add a placeholder page
            const errPage = mergedPdf.addPage([595, 842]);
            errPage.drawText(`Could not embed: ${upload.name}`, { x: 50, y: 780, font, size: 12, color: rgb(0.8, 0.2, 0.2) });
          }
        } else if (upload.file.type.startsWith("image/")) {
          // Embed image on a new page
          try {
            let img;
            if (upload.file.type === "image/png") {
              img = await mergedPdf.embedPng(arrayBuffer);
            } else {
              img = await mergedPdf.embedJpg(arrayBuffer);
            }
            const imgDims = img.scale(1);
            const maxW = 515;
            const maxH = 762;
            const scale = Math.min(maxW / imgDims.width, maxH / imgDims.height, 1);
            const w = imgDims.width * scale;
            const h = imgDims.height * scale;
            const imgPage = mergedPdf.addPage([595, 842]);
            imgPage.drawText(upload.label, { x: 50, y: 810, font: fontBold, size: 12, color: rgb(0.3, 0.3, 0.3) });
            imgPage.drawImage(img, { x: (595 - w) / 2, y: (802 - h) / 2 + 20, width: w, height: h });
          } catch {
            const errPage = mergedPdf.addPage([595, 842]);
            errPage.drawText(`Could not embed image: ${upload.name}`, { x: 50, y: 780, font, size: 12, color: rgb(0.8, 0.2, 0.2) });
          }
        }
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cpf-document-pack-${data.fullName.replace(/\s+/g, "-").toLowerCase()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF compilation failed:", err);
      alert("Something went wrong compiling your PDF. Please try again.");
    }
    setCompiling(false);
    setCompiled(true);
    setTimeout(() => setCompiled(false), 4000);
  };

  return (
    <section className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-secondary">
        <h2 className="font-bold">📦 Upload & compile your documents</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Upload each document here. When you're ready, compile everything into one organised pack.
        </p>
      </div>
      <div className="p-6 space-y-3">
        {/* Progress */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-muted-foreground">
            {uploadCount} of {DOCUMENT_SLOTS.length} uploaded
          </span>
          <span className="text-xs text-primary font-semibold">
            {requiredUploaded}/{requiredSlots.length} required ✓
          </span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2 mb-4">
          <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${(uploadCount / DOCUMENT_SLOTS.length) * 100}%` }} />
        </div>

        {/* Upload slots */}
        {DOCUMENT_SLOTS.map((slot) => {
          const uploaded = uploads[slot.id];
          return (
            <div key={slot.id} className={`rounded-xl p-4 transition-all ${uploaded ? "bg-primary/5 border border-primary/10" : "bg-secondary border border-transparent"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold border-2 ${
                    uploaded ? "border-primary bg-primary text-primary-foreground" : slot.required ? "border-primary text-primary" : "border-border text-muted-foreground"
                  }`}>
                    {uploaded ? "✓" : slot.required ? "!" : "○"}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{slot.label}</h4>
                    {uploaded ? (
                      <p className="text-xs text-primary font-semibold mt-0.5">📎 {uploaded.name}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-0.5">{slot.required ? "Required" : "Optional"}</p>
                    )}
                  </div>
                </div>
                <div>
                  {uploaded ? (
                    <div className="flex items-center gap-2">
                      {uploaded.preview && <img src={uploaded.preview} alt="" className="w-10 h-10 rounded-md object-cover border border-border" />}
                      <button onClick={() => removeUpload(slot.id)} className="text-xs text-destructive font-semibold hover:underline">Remove</button>
                    </div>
                  ) : (
                    <label className="inline-flex items-center gap-1.5 bg-card border border-border px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer hover:bg-primary/5 transition-all">
                      📤 Upload
                      <input type="file" accept="image/*,.pdf" onChange={(e) => handleUpload(slot.id, slot.label, e)} className="hidden" />
                    </label>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Compile button */}
        <div className="pt-4 border-t border-border mt-4">
          <button
            onClick={handleCompile}
            disabled={uploadCount === 0 || compiling}
            className={`w-full px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${
              compiled ? "bg-primary text-primary-foreground"
              : compiling ? "bg-primary/50 text-primary-foreground cursor-wait"
              : uploadCount > 0 ? "bg-primary text-primary-foreground hover:opacity-90"
              : "bg-secondary text-muted-foreground cursor-not-allowed"
            }`}
          >
            {compiled ? "✓ Document pack downloaded!" : compiling ? "⏳ Compiling your pack..." : `📦 Compile ${uploadCount} document${uploadCount !== 1 ? "s" : ""} into one pack`}
          </button>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Creates a single organised file with all your documents and details — everything for the office visit.
          </p>
        </div>
      </div>
    </section>
  );
};

// === GUIDE TAB ===
const GuideTab = ({ data, motherDisplay, recommendedOffice, setActiveTab }: {
  data: OnboardingData; motherDisplay: string; recommendedOffice?: OfficeInfo; setActiveTab: (t: Tab) => void;
}) => (
  <div className="space-y-6 animate-slide-in">
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="relative">
        <img src={officeVisitImg} alt="Office visit illustration" className="w-full h-48 object-cover" loading="lazy" width={800} height={512} />
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
        <div className="absolute bottom-4 left-6">
          <h2 className="text-xl font-bold">Your day-of guide</h2>
          <p className="text-sm text-muted-foreground">Follow this exact sequence and you'll walk out with your CPF.</p>
        </div>
      </div>
    </div>

    {/* Timeline */}
    <div className="space-y-4">
      <TimelineStep
        time="Day before"
        title="Prepare everything the night before"
        items={[
          "Print passport copies (photo page + visa/entry stamp page)",
          "Print proof of address (hotel booking, rental contract, etc.)",
          "Put everything in a clear folder or envelope",
          "Charge your phone — you might need Google Translate",
          "Set an alarm to arrive early",
        ]}
      />
      <TimelineStep
        time="Morning"
        title={`Arrive at ${recommendedOffice?.name || "the office"}`}
        items={[
          `Address: ${recommendedOffice?.address || "Check the Office tab"}`,
          `Be there by ${recommendedOffice?.hours.split(",")[1]?.trim().split("–")[0] || "7:00"} — before the doors open`,
          "Look for the entrance and security guard",
          "Ask: 'Ficha para CPF, por favor' (ticket for CPF please)",
          "Take a number and sit in the waiting area",
        ]}
      />
      <TimelineStep
        time="At the counter"
        title="Present your documents"
        items={[
          "When your number is called, go to the indicated window",
          "Hand over your passport (original)",
          "Hand over your passport copies",
          "Hand over your proof of address",
          `Say: 'Bom dia, gostaria de fazer a inscrição no CPF. Meu nome é ${data.fullName}.'`,
          "They may ask questions — use the Portuguese phrases from the Phrases tab",
        ]}
      />
      <TimelineStep
        time="After"
        title="Receive your CPF number"
        items={[
          "You'll receive a printout with your CPF number — THIS IS IMPORTANT",
          "Take a photo of it immediately as backup",
          "Save the number in your phone's notes app",
          "You can now buy a SIM card, open a bank account, use Pix",
          "Your CPF is active immediately — no waiting period for in-person registration",
        ]}
      />
    </div>

    {/* Got your CPF? Save it! */}
    <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/15 rounded-2xl p-6 text-center">
      <div className="text-4xl mb-3">🎉</div>
      <h3 className="text-xl font-bold">Got your CPF?</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-4">Save it in your personal CPF section — it's your safe space.</p>
      <button
        onClick={() => setActiveTab("mycpf")}
        className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all"
      >
        🔐 Go to my CPF section →
      </button>
    </section>

    {/* Got rejected? */}
    <section className="bg-card border border-destructive/20 rounded-2xl p-6 text-center">
      <div className="text-3xl mb-3">😟</div>
      <h3 className="text-lg font-bold">Got rejected?</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-4">It happens — and it's usually one small thing. We'll tell you exactly what to fix.</p>
      <button
        onClick={() => setActiveTab("rejected")}
        className="bg-secondary text-foreground px-6 py-3 rounded-xl font-semibold text-sm hover:bg-secondary/80 transition-all"
      >
        🔄 Fix my rejection →
      </button>
    </section>
  </div>
);

// === PHRASES TAB ===
const PhrasesTab = ({ data }: { data: OnboardingData }) => (
  <div className="space-y-6 animate-slide-in">
    <section className="bg-primary/5 border border-primary/15 rounded-2xl p-6">
      <h2 className="text-xl font-bold">🇧🇷 Portuguese phrases for the office</h2>
      <p className="text-sm text-muted-foreground mt-2">You probably won't need all of these, but they're here just in case. Tap any phrase to copy it — you can show it on your phone screen.</p>
    </section>

    {/* Arrival */}
    <section className="bg-card border border-border rounded-2xl p-6">
      <h3 className="font-bold mb-3">When you arrive</h3>
      <div className="space-y-2">
        <PhraseCard pt="Bom dia, gostaria de fazer a inscrição no CPF." en="Good morning, I'd like to register for a CPF." category="Arrival" />
        <PhraseCard pt="Sou estrangeiro(a). Preciso de CPF." en="I'm a foreigner. I need a CPF." category="Arrival" />
        <PhraseCard pt="Onde fica a fila para CPF?" en="Where is the queue for CPF?" category="Arrival" />
        <PhraseCard pt="Ficha para CPF, por favor." en="Ticket for CPF, please." category="Arrival" />
      </div>
    </section>

    {/* At the counter */}
    <section className="bg-card border border-border rounded-2xl p-6">
      <h3 className="font-bold mb-3">At the counter</h3>
      <div className="space-y-2">
        <PhraseCard pt={`Meu nome é ${data.fullName}.`} en={`My name is ${data.fullName}.`} category="Counter" />
        <PhraseCard pt="Aqui está meu passaporte e as cópias." en="Here's my passport and the copies." category="Counter" />
        <PhraseCard pt="Aqui está o comprovante de endereço." en="Here's my proof of address." category="Counter" />
        <PhraseCard pt="Posso preencher o formulário aqui?" en="Can I fill out the form here?" category="Counter" />
        <PhraseCard pt="Minha mãe se chama..." en="My mother's name is..." category="Counter" />
      </div>
    </section>

    {/* If there's a problem */}
    <section className="bg-card border border-border rounded-2xl p-6">
      <h3 className="font-bold mb-3">If there's a problem</h3>
      <div className="space-y-2">
        <PhraseCard pt="Posso fazer a inscrição sem agendamento?" en="Can I register without an appointment?" category="Problem" />
        <PhraseCard pt="Não tenho CPF ainda, por isso não consigo agendar." en="I don't have a CPF yet, that's why I can't book online." category="Problem" />
        <PhraseCard pt="Tem outro posto que pode fazer isso?" en="Is there another office that can do this?" category="Problem" />
        <PhraseCard pt="Pode me ajudar, por favor?" en="Can you help me, please?" category="Problem" />
      </div>
    </section>

    {/* Useful extras */}
    <section className="bg-card border border-border rounded-2xl p-6">
      <h3 className="font-bold mb-3">Useful extras</h3>
      <div className="space-y-2">
        <PhraseCard pt="Obrigado(a)!" en="Thank you!" category="General" />
        <PhraseCard pt="Não falo português muito bem." en="I don't speak Portuguese very well." category="General" />
        <PhraseCard pt="Pode repetir, por favor?" en="Can you repeat that, please?" category="General" />
        <PhraseCard pt="Onde fico a espera?" en="Where do I wait?" category="General" />
        <PhraseCard pt="Quanto tempo demora?" en="How long does it take?" category="General" />
      </div>
    </section>

    {/* Numbers */}
    <section className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-secondary">
        <h2 className="font-bold">Numbers you might hear</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {[
            ["0", "Zero"], ["1", "Um"], ["2", "Dois"], ["3", "Três"], ["4", "Quatro"],
            ["5", "Cinco"], ["6", "Seis"], ["7", "Sete"], ["8", "Oito"], ["9", "Nove"],
          ].map(([num, pt]) => (
            <div key={num} className="bg-secondary rounded-lg p-2.5 text-center">
              <div className="text-lg font-bold">{num}</div>
              <div className="text-xs text-muted-foreground">{pt}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

// === CPF STORAGE SECTION ===
const CpfStorageSection = ({ onCpfSaved, data }: { onCpfSaved: () => void; data: OnboardingData }) => {
  const [cpfNumber, setCpfNumber] = useState("");
  const [saved, setSaved] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("cpf-saved-number");
    if (stored) { setCpfNumber(stored); setSaved(true); }
    const storedPhoto = localStorage.getItem("cpf-saved-photo");
    if (storedPhoto) setPhotoPreview(storedPhoto);
  }, []);

  const handleSave = () => {
    if (cpfNumber.trim().length >= 11) {
      localStorage.setItem("cpf-saved-number", cpfNumber.trim());
      setSaved(true);
    }
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPhotoPreview(result);
      localStorage.setItem("cpf-saved-photo", result);
    };
    reader.readAsDataURL(file);
  };

  const formatCpf = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  };

  const firstName = data.fullName.split(" ")[0];

  return (
    <section className="bg-primary/5 border border-primary/15 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-primary/10">
        <h2 className="font-bold text-lg">🔐 Store your CPF number</h2>
        <p className="text-xs text-muted-foreground mt-1">Keep your CPF safe here. Take a photo of your printout or type the number manually.</p>
      </div>
      <div className="p-6 space-y-4">
        {saved && cpfNumber ? (
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-6 text-center">
              <div className="text-4xl mb-2">🎉</div>
              <p className="text-sm text-muted-foreground mb-1">Congratulations, {firstName}!</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-2">Your CPF number</p>
              <p className="text-3xl font-bold font-mono tracking-widest text-primary">{formatCpf(cpfNumber)}</p>
              <CopyButton text={cpfNumber.replace(/\D/g, "")} label="Copy CPF" className="mt-3" />
            </div>
            <button
              onClick={onCpfSaved}
              className="w-full bg-primary text-primary-foreground px-4 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all"
            >
              🎉 Go to my CPF section →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Enter your CPF number</label>
              <input
                type="text"
                value={formatCpf(cpfNumber)}
                onChange={(e) => setCpfNumber(e.target.value.replace(/\D/g, ""))}
                placeholder="000.000.000-00"
                className="mt-1 w-full bg-card border border-border rounded-xl px-4 py-3 text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/30"
                maxLength={14}
              />
            </div>
            <button
              onClick={handleSave}
              disabled={cpfNumber.replace(/\D/g, "").length < 11}
              className="w-full bg-primary text-primary-foreground px-4 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              💾 Save CPF number
            </button>
          </div>
        )}

        {/* Photo upload */}
        <div className="border-t border-border pt-4">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">📸 Photo of your CPF printout</p>
          {photoPreview ? (
            <div className="space-y-2">
              <img src={photoPreview} alt="CPF printout" className="w-full max-w-sm rounded-xl border border-border" />
              <p className="text-xs text-primary font-semibold">✓ Photo saved securely on this device</p>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center gap-2 bg-card border-2 border-dashed border-border rounded-xl p-6 cursor-pointer hover:border-primary/30 transition-all">
              <span className="text-2xl">📷</span>
              <span className="text-sm font-semibold">Upload a photo of your CPF printout</span>
              <span className="text-xs text-muted-foreground">Keep it stored here safely — you'll always have a backup</span>
              <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} className="hidden" />
            </label>
          )}
        </div>
      </div>
    </section>
  );
};

// === COPY BUTTON COMPONENT ===
const CopyButton = ({ text, label, className = "" }: { text: string; label: string; className?: string }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className={`inline-flex items-center gap-2 text-xs text-primary font-semibold hover:underline ${className}`}
    >
      {copied ? "✓ Text copied!" : `📋 ${label}`}
    </button>
  );
};

// === HELPER COMPONENTS ===

const ProcessStep = ({ num, title, desc, image, status }: {
  num: number; title: string; desc: string; image: string; status: "ready" | "next" | "upcoming";
}) => (
  <div className="p-5 relative">
    <img src={image} alt={title} className="w-full h-32 object-cover rounded-xl mb-4" loading="lazy" width={800} height={512} />
    <div className="flex items-center gap-2 mb-2">
      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
        status === "ready" ? "bg-primary text-primary-foreground" :
        status === "next" ? "bg-primary/20 text-primary" :
        "bg-secondary text-muted-foreground"
      }`}>{num}</span>
      <span className={`text-[10px] uppercase tracking-wider font-bold ${
        status === "ready" ? "text-primary" :
        status === "next" ? "text-primary/60" :
        "text-muted-foreground"
      }`}>
        {status === "ready" ? "✓ Ready" : status === "next" ? "Next step" : "Coming up"}
      </span>
    </div>
    <h3 className="font-semibold text-sm">{title}</h3>
    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{desc}</p>
  </div>
);

const InfoField = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-secondary rounded-lg p-3">
    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">{label}</div>
    <div className="font-semibold text-sm truncate">{value}</div>
  </div>
);

const QuickAction = ({ icon, title, desc, onClick }: { icon: string; title: string; desc: string; onClick: () => void }) => (
  <button onClick={onClick} className="bg-card border border-border rounded-xl p-4 text-left hover:border-primary/30 hover:shadow-sm transition-all group">
    <div className="text-xl mb-2">{icon}</div>
    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{title}</h3>
    <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
  </button>
);

const AfterCard = ({ icon, title, desc }: { icon: string; title: string; desc: string }) => (
  <div className="bg-card border border-border rounded-xl p-3 text-center">
    <div className="text-xl mb-1">{icon}</div>
    <h3 className="font-semibold text-xs">{title}</h3>
    <p className="text-[10px] text-muted-foreground">{desc}</p>
  </div>
);

const OfficeCard = ({ office, isRecommended }: { office: OfficeInfo; isRecommended?: boolean }) => {
  const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(office.address)}`;

  return (
    <div className={`bg-card border rounded-2xl overflow-hidden ${isRecommended ? "border-primary shadow-lg shadow-primary/5" : "border-border"}`}>
      {isRecommended && (
        <div className="bg-primary text-primary-foreground px-6 py-2 text-xs font-bold flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-primary-foreground"></span>
          🟢 Recommended — walk-in, free, same-day
        </div>
      )}
      <div className="p-6">
        <h3 className="font-bold text-lg">{office.name}</h3>
        <p className="text-sm text-muted-foreground mt-1">{office.address}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <ContactDetail icon="📞" label="Phone" value={office.phone} />
          <ContactDetail icon="📧" label="Email" value={office.email} isEmail />
          <ContactDetail icon="🕐" label="Hours" value={office.hours} />
          <ContactDetail icon="⏱️" label="Wait time" value={office.waitTime} />
        </div>
        <div className="flex items-center gap-2 mt-4 text-sm">
          <span className="text-primary font-bold">⭐ {office.rating}</span>
          <span className="text-muted-foreground">({office.reviewCount} reviews)</span>
        </div>
        <div className="flex gap-3 mt-4">
          <ExternalLink
            href={mapsUrl}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
          >
            📍 Open in Google Maps
          </ExternalLink>
          <a
            href={`tel:${office.phone.replace(/[^\d+]/g, "")}`}
            className="inline-flex items-center gap-2 border border-border text-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-secondary transition-all"
          >
            📞 Call
          </a>
        </div>
      </div>
    </div>
  );
};

const ContactDetail = ({ icon, label, value, isEmail }: { icon: string; label: string; value: string; isEmail?: boolean }) => (
  <div>
    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">{icon} {label}</div>
    {isEmail ? (
      <a href={`mailto:${value}`} className="text-xs text-primary font-medium hover:underline break-all">{value}</a>
    ) : (
      <div className="text-xs font-medium">{value}</div>
    )}
  </div>
);

const ExpectCard = ({ icon, title, value }: { icon: string; title: string; value: string }) => (
  <div className="bg-secondary rounded-xl p-4 text-center">
    <div className="text-xl mb-1">{icon}</div>
    <div className="text-xs text-muted-foreground font-semibold mb-0.5">{title}</div>
    <div className="text-sm font-bold">{value}</div>
  </div>
);

const DocCheck = ({ title, desc, critical, uploadable }: { title: string; desc: string; critical?: boolean; uploadable?: boolean }) => {
  const [checked, setChecked] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setChecked(true);
    }
  };

  return (
    <div
      onClick={() => !uploadable && setChecked(!checked)}
      className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${
        checked ? "bg-primary/5 border border-primary/10" : critical ? "bg-primary/5 border border-primary/10" : "bg-secondary"
      }`}
    >
      <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold border-2 transition-all ${
        checked ? "border-primary bg-primary text-primary-foreground" : critical ? "border-primary text-primary" : "border-border text-muted-foreground"
      }`}>
        {checked ? "✓" : critical ? "!" : "○"}
      </div>
      <div className="flex-1">
        <h4 className={`font-semibold text-sm ${checked ? "line-through opacity-60" : ""}`}>{title}</h4>
        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
        {uploadable && (
          <div className="mt-2">
            {fileName ? (
              <span className="text-xs text-primary font-semibold">📎 {fileName}</span>
            ) : (
              <label className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold cursor-pointer hover:underline">
                📤 Upload this document
                <input type="file" accept="image/*,.pdf" onChange={handleUpload} className="hidden" />
              </label>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const FormFieldDisplay = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-baseline gap-2">
    <span className="text-muted-foreground shrink-0 w-36">{label}:</span>
    <span className="text-foreground font-semibold">{value}</span>
  </div>
);

const TimelineStep = ({ time, title, items }: { time: string; title: string; items: string[] }) => (
  <div className="bg-card border border-border rounded-2xl p-6">
    <div className="flex items-center gap-3 mb-3">
      <span className="bg-primary/10 text-primary px-3 py-1 rounded-md text-xs font-bold uppercase">{time}</span>
      <h3 className="font-bold">{title}</h3>
    </div>
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
          <span className="w-5 h-5 bg-secondary rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-foreground">{i + 1}</span>
          {item}
        </li>
      ))}
    </ul>
  </div>
);

const PhraseCard = ({ pt, en, category }: { pt: string; en: string; category: string }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(pt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="bg-secondary rounded-lg p-3 group relative">
      <div className="text-[9px] uppercase tracking-wider text-primary font-bold mb-1">{category}</div>
      <div className="font-semibold text-sm font-mono">{pt}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{en}</div>
      <button
        onClick={copy}
        className="absolute top-2 right-2 bg-card border border-border px-2 py-1 rounded-md text-[10px] font-bold opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity hover:bg-primary hover:text-primary-foreground"
      >
        {copied ? "✓ Copied!" : "Copy"}
      </button>
    </div>
  );
};

// === PARTNERS TAB ===
const PARTNERS = [
  {
    icon: "🏥",
    name: "SafetyWing",
    category: "Health & Travel Insurance",
    desc: "The go-to insurance for digital nomads in Brazil. Covers hospitals, clinics, and emergencies across Latin America. Month-to-month, cancel anytime. From $45/month.",
    why: "Brazil's public healthcare (SUS) is free but crowded. Private hospitals can cost thousands. SafetyWing covers you without the bureaucracy.",
    cta: "Get covered →",
    url: "https://safetywing.com",
  },
  {
    icon: "📱",
    name: "Airalo",
    category: "SIM Card / eSIM",
    desc: "Skip the carrier store. Get a Brazil eSIM in 2 minutes from your phone — works the moment you land. Data plans from $5.",
    why: "You need a CPF to buy a physical SIM from Claro, Vivo, or TIM. With Airalo, you get data immediately while you sort your CPF out.",
    cta: "Get an eSIM →",
    url: "https://www.airalo.com",
  },
  {
    icon: "🏦",
    name: "Nubank",
    category: "Bank Account",
    desc: "Brazil's most popular digital bank. Zero fees, instant Pix payments, and a debit/credit card — all from the app. Apply with CPF + passport.",
    why: "Nubank is what everyone uses in Brazil. Fastest way to start using Pix — Brazil's free instant payment system used everywhere.",
    cta: "Open Nubank →",
    url: "https://nubank.com.br",
  },
  {
    icon: "💸",
    name: "Wise",
    category: "International Transfers",
    desc: "Send money to and from Brazil at the real exchange rate with minimal fees. Way cheaper than bank transfers or Western Union.",
    why: "Brazilian banks charge huge spreads on foreign currency. Wise gives you the mid-market rate. Essential for receiving income from abroad.",
    cta: "Try Wise →",
    url: "https://wise.com",
  },
  {
    icon: "🗣️",
    name: "iTalki",
    category: "Learn Portuguese",
    desc: "1-on-1 video lessons with native Brazilian Portuguese speakers. Even 5 lessons makes a massive difference at the Receita Federal office.",
    why: "Portuguese is different from Spanish. Even basic phrases will change how people treat you. R$30-60/hour for a private tutor.",
    cta: "Start learning →",
    url: "https://www.italki.com",
  },
];

const PartnersTab = () => (
  <div className="space-y-6 animate-slide-in">
    <section className="bg-primary/5 border border-primary/15 rounded-2xl p-6 text-center">
      <h2 className="text-2xl font-bold">🎉 Your CPF is ready — here's what it unlocks</h2>
      <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">Now that you have your CPF, these are the first things you can actually do with it in Brazil.</p>
    </section>

    <section className="bg-card border border-border rounded-2xl p-6">
      <h3 className="font-bold mb-4">What you can do now with your CPF</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <AfterCard icon="📱" title="Get a SIM card" desc="Claro, Vivo, TIM, Airalo" />
        <AfterCard icon="🏦" title="Open a bank account" desc="Nubank, Inter, C6" />
        <AfterCard icon="⚡" title="Use Pix" desc="Send and receive instantly" />
        <AfterCard icon="🛍️" title="Shop online" desc="Brazilian apps and stores" />
      </div>
    </section>

    <section className="bg-card border border-border rounded-2xl p-6">
      <h3 className="font-bold mb-4">Best next step after your CPF</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-secondary rounded-xl p-4">
          <div className="text-2xl mb-2">1️⃣</div>
          <h4 className="font-semibold text-sm mb-1">Open a bank account</h4>
          <p className="text-xs text-muted-foreground">This unlocks Pix, local payments, and makes life in Brazil much easier.</p>
        </div>
        <div className="bg-secondary rounded-xl p-4">
          <div className="text-2xl mb-2">2️⃣</div>
          <h4 className="font-semibold text-sm mb-1">Set up your phone</h4>
          <p className="text-xs text-muted-foreground">Use your CPF to get a local SIM or eSIM and start using Brazilian apps properly.</p>
        </div>
        <div className="bg-secondary rounded-xl p-4">
          <div className="text-2xl mb-2">3️⃣</div>
          <h4 className="font-semibold text-sm mb-1">Start using local services</h4>
          <p className="text-xs text-muted-foreground">Shopping, subscriptions, delivery apps, rentals, and more will now make much more sense.</p>
        </div>
      </div>
    </section>

    <div className="space-y-4">
      {PARTNERS.map((p) => (
        <div key={p.name} className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <span className="text-3xl mt-1">{p.icon}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold">{p.name}</h3>
                <span className="text-[10px] uppercase tracking-wider text-primary font-bold bg-primary/10 px-2 py-0.5 rounded">{p.category}</span>
              </div>
              <p className="text-sm text-foreground mb-2">{p.desc}</p>
              <p className="text-xs text-muted-foreground italic">💡 {p.why}</p>
              <ExternalLink
                href={p.url}
                className="mt-3 inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
              >
                {p.cta}
              </ExternalLink>
            </div>
          </div>
        </div>
      ))}
    </div>

    <p className="text-[10px] text-muted-foreground text-center mt-2">
      Some links above are affiliate partnerships — we may earn a small commission at no extra cost to you. We only recommend services we genuinely believe help foreigners in Brazil.
    </p>
  </div>
);

// === EMAIL TEMPLATE SECTION ===
const EmailTemplateSection = ({ data, motherDisplay }: { data: OnboardingData; motherDisplay: string }) => {
  const [copied, setCopied] = useState(false);
  const stateEmails: Record<string, string> = {
    SP: "atendimentorfb.08@rfb.gov.br",
    RJ: "atendimentorfb.07@rfb.gov.br",
    MG: "atendimentorfb.06@rfb.gov.br",
    RS: "atendimentorfb.10@rfb.gov.br",
    PR: "atendimentorfb.09@rfb.gov.br",
    SC: "atendimentorfb.09@rfb.gov.br",
    BA: "atendimentorfb.05@rfb.gov.br",
    PE: "atendimentorfb.04@rfb.gov.br",
    CE: "atendimentorfb.03@rfb.gov.br",
    DF: "atendimentorfb.01@rfb.gov.br",
  };
  const rfEmail = stateEmails[data.state] || "atendimentorfb.08@rfb.gov.br";

  const emailBody = `Prezados,

Meu nome é ${data.fullName}, sou ${getNationalityPt(data.nationality)}, portador(a) do passaporte nº ${data.passportNumber}.

Gostaria de solicitar a inscrição no Cadastro de Pessoas Físicas (CPF) conforme a Instrução Normativa RFB nº 2.172/2024.

Seguem os meus dados pessoais:

- Nome completo: ${data.fullName}
- Nome da mãe: ${motherDisplay}${data.fatherName ? `\n- Nome do pai: ${data.fatherName}` : ""}
- Número do passaporte: ${data.passportNumber}
- Nacionalidade: ${getNationalityPt(data.nationality)}
- Endereço no Brasil: ${data.streetAddress}, ${data.city}, ${data.state}
- E-mail: ${data.email}

Em anexo, envio os seguintes documentos:
1. Cópia do passaporte (página com foto e dados)
2. Cópia do passaporte (página com carimbo de entrada)
3. Comprovante de endereço no Brasil

Agradeço a atenção e fico no aguardo do retorno.

Atenciosamente,
${data.fullName}`;

  const subject = `Solicitação de Inscrição no CPF — ${data.fullName}`;
  const mailtoUrl = `mailto:${rfEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

  return (
    <section className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-secondary">
        <h2 className="font-bold">📧 Email template — backup method</h2>
        <p className="text-xs text-muted-foreground mt-1">If you can't go in person, send this email to Receita Federal. Takes 3–7 business days.</p>
      </div>
      <div className="p-6 space-y-4">
        <div className="bg-secondary rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
            <span className="font-bold">To:</span>
            <span className="font-mono text-primary">{rfEmail}</span>
          </div>
          <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
            <span className="font-bold">Subject:</span>
            <span className="font-mono">{subject}</span>
          </div>
          <pre className="text-xs font-mono whitespace-pre-wrap text-foreground leading-relaxed border-t border-border pt-3 mt-2">{emailBody}</pre>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { navigator.clipboard.writeText(emailBody); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            className="flex-1 min-w-[140px] bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-semibold text-xs hover:opacity-90 transition-all"
          >
            {copied ? "✓ Text copied!" : "📋 Copy entire email"}
          </button>
          <a
            href={mailtoUrl}
            className="flex-1 min-w-[140px] bg-secondary text-foreground px-4 py-2.5 rounded-lg font-semibold text-xs hover:bg-secondary/80 transition-all text-center"
          >
            📨 Open in email app
          </a>
        </div>
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-3">
          <p className="text-xs text-amber-800 dark:text-amber-200">
            <strong>Don't forget:</strong> Attach your passport copies and proof of address to the email. Without attachments, they can't process your request.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ReadyPack;
