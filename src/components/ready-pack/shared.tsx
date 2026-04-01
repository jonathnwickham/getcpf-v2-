import { useState } from "react";
import type { OnboardingData } from "@/lib/onboarding-data";

export type Tab = "overview" | "office" | "documents" | "guide" | "phrases" | "partners" | "mycpf" | "rejected";

export const NATIONALITY_PT: Record<string, string> = {
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

export const getNationalityPt = (nationality: string): string => {
  return NATIONALITY_PT[nationality] || nationality.toLowerCase();
};

export const ExternalLink = ({ href, className, children, showHint = true }: { href: string; className?: string; children: React.ReactNode; showHint?: boolean }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={`${className || ""} group/ext`}>
    {children}
    {showHint && <span className="inline-flex items-center gap-1 ml-1.5 text-[10px] opacity-60 group-hover/ext:opacity-100 transition-opacity">↗ new tab</span>}
  </a>
);

export const CopyButton = ({ text, label, className = "" }: { text: string; label: string; className?: string }) => {
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

export const InfoField = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-secondary rounded-lg p-3">
    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">{label}</div>
    <div className="font-semibold text-sm truncate">{value}</div>
  </div>
);

export const QuickAction = ({ icon, title, desc, onClick }: { icon: string; title: string; desc: string; onClick: () => void }) => (
  <button onClick={onClick} className="bg-card border border-border rounded-xl p-4 text-left hover:border-primary/30 hover:shadow-sm transition-all group">
    <div className="text-xl mb-2">{icon}</div>
    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{title}</h3>
    <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
  </button>
);

export const AfterCard = ({ icon, title, desc }: { icon: string; title: string; desc: string }) => (
  <div className="bg-card border border-border rounded-xl p-3 text-center">
    <div className="text-xl mb-1">{icon}</div>
    <h3 className="font-semibold text-xs">{title}</h3>
    <p className="text-[10px] text-muted-foreground">{desc}</p>
  </div>
);

export const ProcessStep = ({ num, title, desc, image, status }: {
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

export const ContactDetail = ({ icon, label, value, isEmail }: { icon: string; label: string; value: string; isEmail?: boolean }) => (
  <div>
    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">{icon} {label}</div>
    {isEmail ? (
      <a href={`mailto:${value}`} className="text-xs text-primary font-medium hover:underline break-all">{value}</a>
    ) : (
      <div className="text-xs font-medium">{value}</div>
    )}
  </div>
);

export const ExpectCard = ({ icon, title, value }: { icon: string; title: string; value: string }) => (
  <div className="bg-secondary rounded-xl p-4 text-center">
    <div className="text-xl mb-1">{icon}</div>
    <div className="text-xs text-muted-foreground font-semibold mb-0.5">{title}</div>
    <div className="text-sm font-bold">{value}</div>
  </div>
);

export const DocCheck = ({ title, desc, critical, uploadable }: { title: string; desc: string; critical?: boolean; uploadable?: boolean }) => {
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

export const FormFieldDisplay = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-baseline gap-2">
    <span className="text-muted-foreground shrink-0 w-36">{label}:</span>
    <span className="text-foreground font-semibold">{value}</span>
  </div>
);

export const TimelineStep = ({ time, title, items }: { time: string; title: string; items: string[] }) => (
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

export const PhraseCard = ({ pt, en, category }: { pt: string; en: string; category: string }) => {
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

export const OfficeCard = ({ office, isRecommended }: { office: any; isRecommended?: boolean }) => {
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
            className="inline-flex items-center gap-2 bg-secondary text-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-secondary/80 transition-all"
          >
            📞 Call
          </a>
        </div>
      </div>
    </div>
  );
};
