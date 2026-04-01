import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { OnboardingData, OfficeInfo } from "@/lib/onboarding-data";
import { ProcessStep, InfoField, QuickAction, AfterCard, CopyButton, type Tab } from "./shared";
import officeVisitImg from "@/assets/office-visit.jpg";
import documentsReadyImg from "@/assets/documents-ready.jpg";
import cpfSuccessImg from "@/assets/cpf-success.jpg";

export const OverviewTab = ({ data, motherDisplay, stateName, recommendedOffice, setActiveTab }: {
  data: OnboardingData; motherDisplay: string; stateName: string; recommendedOffice?: OfficeInfo; setActiveTab: (t: Tab) => void;
}) => (
  <div className="space-y-8 animate-slide-in">
    <section className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-secondary">
        <h2 className="font-bold">Your CPF journey — three steps and you're done</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:divide-x divide-border">
        <ProcessStep num={1} title="Prepare your documents" desc="Print your forms and gather your passport, proof of address, and copies." image={documentsReadyImg} status="ready" />
        <ProcessStep num={2} title="Visit the office" desc={`Go to ${recommendedOffice?.name || "Receita Federal"} with everything prepared.`} image={officeVisitImg} status="next" />
        <ProcessStep num={3} title="Get your CPF" desc="Walk out with your CPF number. Start using it immediately for SIM, bank, Pix." image={cpfSuccessImg} status="upcoming" />
      </div>
    </section>

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
          <InfoField label="Nationality" value={data.nationality} />
          <InfoField label="State" value={`${data.state} — ${stateName}`} />
          <InfoField label="Address" value={data.streetAddress} />
          <InfoField label="City" value={data.city} />
          <InfoField label="Email" value={data.email} />
        </div>
      </div>
    </section>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <QuickAction icon="📍" title="View office details" desc="Address, phone, hours, tips" onClick={() => setActiveTab("office")} />
      <QuickAction icon="📄" title="Document checklist" desc="What to print & bring" onClick={() => setActiveTab("documents")} />
      <QuickAction icon="🗓️" title="Day-of guide" desc="Step-by-step for the visit" onClick={() => setActiveTab("guide")} />
      <QuickAction icon="🇧🇷" title="Portuguese phrases" desc="What to say at the office" onClick={() => setActiveTab("phrases")} />
    </div>

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

    <CpfStorageSection onCpfSaved={() => setActiveTab("mycpf")} data={data} />
  </div>
);

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
            <button onClick={onCpfSaved} className="w-full bg-primary text-primary-foreground px-4 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all">🎉 Go to my CPF section →</button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Enter your CPF number</label>
              <input type="text" value={formatCpf(cpfNumber)} onChange={(e) => setCpfNumber(e.target.value.replace(/\D/g, ""))} placeholder="000.000.000-00" className="mt-1 w-full bg-card border border-border rounded-xl px-4 py-3 text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/30" maxLength={14} />
            </div>
            <button onClick={handleSave} disabled={cpfNumber.replace(/\D/g, "").length < 11} className="w-full bg-primary text-primary-foreground px-4 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed">💾 Save CPF number</button>
          </div>
        )}

        <div className="border-t border-border pt-4">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">📸 Photo of your CPF printout</p>
          {photoPreview ? (
            <div className="space-y-2">
              <img src={photoPreview} alt="CPF printout" className="w-full max-w-sm rounded-xl border border-border" />
              <p className="text-xs text-primary font-semibold">✓ Photo saved securely on this device</p>
              <div className="flex gap-3">
                <label className="text-xs text-primary font-semibold hover:underline cursor-pointer">📷 Change photo<input type="file" accept="image/*" capture="environment" onChange={handlePhoto} className="hidden" /></label>
                <button onClick={() => { setPhotoPreview(null); localStorage.removeItem("cpf_photo"); }} className="text-xs text-destructive font-semibold hover:underline">Remove photo</button>
              </div>
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
