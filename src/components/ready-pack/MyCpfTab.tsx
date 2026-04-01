import { useState, useEffect } from "react";
import type { OnboardingData } from "@/lib/onboarding-data";
import { InfoField } from "./shared";

export const MyCpfTab = ({ data, stateName, motherDisplay, onOpenGuide, onOpenLifeGuide }: {
  data: OnboardingData; stateName: string; motherDisplay: string; onOpenGuide: () => void; onOpenLifeGuide: () => void;
}) => {
  const [cpfNumber, setCpfNumber] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [cpfCopied, setCpfCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [animateCard, setAnimateCard] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [cpfError, setCpfError] = useState("");

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

  const validateCpf = (digits: string): boolean => {
    if (digits.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(digits)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
    let remainder = (sum * 10) % 11;
    if (remainder === 10) remainder = 0;
    if (remainder !== parseInt(digits[9])) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10) remainder = 0;
    return remainder === parseInt(digits[10]);
  };

  const handleSaveCpf = () => {
    const digits = cpfNumber.replace(/\D/g, "");
    if (digits.length !== 11) { setCpfError("CPF must be exactly 11 digits"); return; }
    if (!validateCpf(digits)) { setCpfError("This doesn't look like a valid CPF number. Double-check and try again."); return; }
    setCpfError("");
    localStorage.setItem("cpf-saved-number", digits);
    setSaving(true);
    setTimeout(() => { setSaving(false); setAnimateCard(true); }, 1000);
  };

  const handleDeleteCpf = () => {
    localStorage.removeItem("cpf-saved-number");
    localStorage.removeItem("cpf-saved-photo");
    setCpfNumber("");
    setPhotoPreview(null);
    setAnimateCard(false);
    setShowDeleteConfirm(false);
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

  if (!hasCpf) {
    return (
      <div className="space-y-8 animate-slide-in">
        <section className="bg-card border border-border rounded-3xl p-8 text-center">
          <div className="text-5xl mb-4">🇧🇷</div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">You're one step away, {firstName}.</h1>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">Once you visit the office and get your CPF number, come back here and save it below. This becomes your personal CPF space.</p>
        </section>

        <section className="bg-primary/5 border border-primary/15 rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-2">🔐 Got your CPF? Enter it here.</h3>
          <p className="text-sm text-muted-foreground mb-4">We'll store it safely and show you everything you can do next.</p>
          <div className="space-y-3">
            <input type="text" value={formatCpf(cpfNumber)} onChange={(e) => setCpfNumber(e.target.value.replace(/\D/g, ""))} placeholder="000.000.000-00" className="w-full bg-card border border-border rounded-xl px-4 py-4 text-2xl font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-primary/30" maxLength={14} />
            <button onClick={handleSaveCpf} disabled={cpfNumber.replace(/\D/g, "").length < 11 || saving} className="w-full bg-primary text-primary-foreground px-4 py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              {saving ? "⏳ Saving..." : "💾 Save my CPF number"}
            </button>
            {cpfError && <p className="text-xs text-destructive font-semibold mt-1">{cpfError}</p>}
          </div>
          <div className="mt-4 pt-4 border-t border-primary/10">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">📸 Photo of your CPF printout</p>
            {photoPreview ? (
              <div className="space-y-2">
                <img src={photoPreview} alt="CPF printout" className="w-full max-w-xs rounded-xl border border-border" />
                <p className="text-xs text-primary font-semibold">✓ Photo saved</p>
                <button onClick={() => { setPhotoPreview(null); localStorage.removeItem("cpf-saved-photo"); }} className="text-xs text-destructive font-semibold hover:underline">Remove photo</button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 bg-card border-2 border-dashed border-border rounded-xl p-6 cursor-pointer hover:border-primary/30 transition-all">
                <span className="text-2xl">📷</span>
                <span className="text-sm font-semibold">Upload a photo of your CPF printout</span>
                <span className="text-xs text-muted-foreground">Keep a backup here so you always have it</span>
                <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} className="hidden" />
              </label>
            )}
          </div>
        </section>

        <section className="bg-secondary rounded-2xl p-6 text-center">
          <h3 className="font-bold text-base mb-1">Haven't visited the office yet?</h3>
          <p className="text-sm text-muted-foreground mb-4">Your application guide has everything you need to walk in prepared.</p>
          <button onClick={onOpenGuide} className="bg-card text-foreground border border-border px-6 py-3 rounded-xl font-semibold text-sm hover:bg-card/80 transition-all">📋 Open application guide →</button>
        </section>
      </div>
    );
  }

  const slides = [
    {
      id: "card",
      title: "My CPF",
      content: (
        <div className="py-6">
          <div className={`mx-auto max-w-sm transition-all duration-700 ${animateCard ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}>
            <div className="relative bg-gradient-to-br from-[hsl(var(--primary)/0.9)] via-[hsl(var(--primary)/0.7)] to-[hsl(var(--primary)/0.5)] rounded-2xl p-6 shadow-2xl shadow-primary/20 text-primary-foreground overflow-hidden">
              <div className="absolute inset-0 opacity-10"><div className="absolute top-2 right-2 text-[120px] font-bold leading-none">🇧🇷</div></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[9px] uppercase tracking-[3px] opacity-70 font-bold">REPÚBLICA FEDERATIVA DO BRASIL</p>
                    <p className="text-[8px] uppercase tracking-[2px] opacity-50 mt-0.5">CADASTRO DE PESSOAS FÍSICAS</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center text-lg font-bold">CPF</div>
                </div>
                <div className="mb-6">
                  <p className="text-[9px] uppercase tracking-[2px] opacity-60 mb-1">Nº DO CPF</p>
                  <p className="text-3xl font-bold font-mono tracking-[4px]">{formatCpf(cpfNumber.replace(/\D/g, ""))}</p>
                </div>
                <div className="mb-4">
                  <p className="text-[9px] uppercase tracking-[2px] opacity-60 mb-1">NOME</p>
                  <p className="text-sm font-bold uppercase tracking-wider">{data.fullName}</p>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[9px] uppercase tracking-[2px] opacity-60 mb-0.5">NASCIMENTO</p>
                    <p className="text-xs font-semibold">{data.nationality}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] uppercase tracking-[2px] opacity-60 mb-0.5">STATUS</p>
                    <p className="text-xs font-bold">SAVED ✓</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-6 flex items-center justify-center gap-3 flex-wrap">
            <button onClick={() => { navigator.clipboard.writeText(cpfNumber.replace(/\D/g, "")); setCpfCopied(true); setTimeout(() => setCpfCopied(false), 2000); }} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all">
              {cpfCopied ? "✓ Text copied!" : "📋 Copy CPF number"}
            </button>
            <button onClick={() => { setAnimateCard(false); setCpfNumber(""); localStorage.removeItem("cpf-saved-number"); }} className="inline-flex items-center gap-2 bg-secondary text-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-secondary/80 transition-all">✏️ Edit</button>
            <button onClick={() => setShowDeleteConfirm(true)} className="inline-flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-destructive/20 transition-all">🗑️ Delete</button>
          </div>
          {showDeleteConfirm && (
            <div className="mt-4 bg-destructive/5 border border-destructive/20 rounded-xl p-4 text-center space-y-3">
              <p className="text-sm font-semibold text-destructive">Are you sure you want to delete your saved CPF number?</p>
              <p className="text-xs text-muted-foreground">This will remove your CPF number and photo from this device. Your CPF itself is not affected.</p>
              <div className="flex justify-center gap-3">
                <button onClick={handleDeleteCpf} className="bg-destructive text-destructive-foreground px-5 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition-all">Yes, delete it</button>
                <button onClick={() => setShowDeleteConfirm(false)} className="bg-secondary text-foreground px-5 py-2 rounded-xl text-sm font-semibold hover:bg-secondary/80 transition-all">Cancel</button>
              </div>
            </div>
          )}
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
          <InfoField label="Nationality" value={data.nationality} />
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
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/15 rounded-3xl p-8 text-center">
        <div className="text-5xl mb-4">🇧🇷</div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">You did it, {firstName}! 🇧🇷</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-md mx-auto">Your CPF is live. Brazil just opened up for you.</p>
      </section>

      <section className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex border-b border-border">
          {slides.map((slide, i) => (
            <button key={slide.id} onClick={() => setActiveSlide(i)} className={`flex-1 py-3 text-xs font-bold transition-all ${activeSlide === i ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}>
              {slide.title}
            </button>
          ))}
        </div>
        <div className="p-6">{slides[activeSlide].content}</div>
        <div className="flex justify-center gap-2 pb-4">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setActiveSlide(i)} className={`w-2 h-2 rounded-full transition-all ${activeSlide === i ? "bg-primary w-6" : "bg-border"}`} />
          ))}
        </div>
      </section>

      <section className="bg-secondary rounded-2xl p-6">
        <h3 className="font-bold mb-2">Your safe space</h3>
        <p className="text-sm text-muted-foreground mb-4">Come back anytime to find your CPF number, your details, and your CPF photo in one place.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <div className="bg-card rounded-xl p-4 border border-border"><div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">My CPF</div><div className="font-semibold text-sm">Your number, ready to copy</div></div>
          <div className="bg-card rounded-xl p-4 border border-border"><div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">My details</div><div className="font-semibold text-sm">Your submitted info, saved</div></div>
          <div className="bg-card rounded-xl p-4 border border-border"><div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">My document</div><div className="font-semibold text-sm">Your CPF photo stored here</div></div>
        </div>
      </section>

      <section className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-1">🚀 What to do next with your CPF</h3>
        <p className="text-sm text-muted-foreground mb-4">Now that you're official, here are the first things to set up.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: "📱", title: "Get a SIM card", desc: "Walk into any Claro, Vivo, or TIM store with your CPF and passport. Takes 10 minutes." },
            { icon: "🏦", title: "Open a bank account", desc: "Download Nubank, Inter, or C6 Bank. Sign up with your CPF — most approve within minutes." },
            { icon: "💳", title: "Activate Pix", desc: "Once your bank account is open, set up Pix for free instant transfers anywhere in Brazil." },
            { icon: "🛒", title: "Shop & subscribe", desc: "Use your CPF on Amazon.com.br, Mercado Livre, iFood, and any Brazilian service." },
          ].map((item) => (
            <div key={item.title} className="bg-secondary rounded-xl p-4">
              <div className="text-xl mb-2">{item.icon}</div>
              <h4 className="font-semibold text-sm">{item.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
        <button onClick={onOpenLifeGuide} className="mt-4 w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all">🔓 See all recommendations →</button>
      </section>
    </div>
  );
};
