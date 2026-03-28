import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BRAZILIAN_STATES, STATE_OFFICES, type OnboardingData } from "@/lib/onboarding-data";

const ReadyPack = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<OnboardingData | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("cpf-onboarding");
    if (!stored) {
      navigate("/get-started");
      return;
    }
    setData(JSON.parse(stored));
  }, [navigate]);

  if (!data) return null;

  const stateName = BRAZILIAN_STATES.find((s) => s.value === data.state)?.label || data.state;
  const office = STATE_OFFICES[data.state];
  const motherDisplay = data.noMotherName ? data.motherAlternative : data.motherName;
  const mapsUrl = office ? `https://www.google.com/maps/search/${encodeURIComponent(office.address)}` : "";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-[800px] mx-auto px-6 py-16 pt-20">
          <a href="/" className="text-sm font-bold opacity-80 hover:opacity-100 transition-opacity">← cpfeasy.ai</a>
          <div className="mt-8">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 px-3 py-1 rounded-full text-xs font-semibold mb-4">
              ✓ Ready Pack generated
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Your CPF Application Pack
            </h1>
            <p className="mt-3 opacity-80 max-w-[500px] leading-relaxed">
              Everything is prepared for you, {data.fullName.split(" ")[0]}. Follow the steps below and you'll have your CPF today.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-6 py-12 space-y-8">
        {/* Step 1: Your Information Summary */}
        <section className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-secondary">
            <h2 className="font-bold flex items-center gap-2">
              <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">1</span>
              Your application details
            </h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-muted-foreground mb-4">This is the information that goes on your CPF application form. Double-check everything is correct.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField label="Full Name (as on passport)" value={data.fullName} />
              <InfoField label="Mother's Full Name" value={motherDisplay} />
              {data.fatherName && <InfoField label="Father's Full Name" value={data.fatherName} />}
              <InfoField label="Passport Number" value={data.passportNumber} />
              <InfoField label="Nationality" value={data.nationality} />
              <InfoField label="State" value={`${data.state} — ${stateName}`} />
              <InfoField label="Street Address" value={data.streetAddress} />
              <InfoField label="City" value={data.city} />
            </div>
          </div>
        </section>

        {/* Step 2: Where to go */}
        {office && (
          <section className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-secondary">
              <h2 className="font-bold flex items-center gap-2">
                <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">2</span>
                Where to go
              </h2>
            </div>
            <div className="p-6">
              <div className="bg-primary/5 border border-primary/15 rounded-xl p-5 mb-4">
                <h3 className="font-bold text-lg">{office.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{office.address}</p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm">
                  <span className="text-muted-foreground">📞 {office.phone}</span>
                  <span className="text-muted-foreground">🕐 {office.hours}</span>
                </div>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
                >
                  📍 Open in Google Maps
                </a>
              </div>
              <div className="text-sm text-muted-foreground space-y-2">
                <p><strong>💡 Pro tip:</strong> Arrive early (before 9:00 AM). Lines can get long, especially in {stateName}. Bring all your documents in a clear folder.</p>
                <p><strong>⚡ Same-day CPF:</strong> Most people who go to a Receita Federal office in person receive their CPF number the same day or within 1-2 days.</p>
              </div>
            </div>
          </section>
        )}

        {/* Step 3: Documents to bring */}
        <section className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-secondary">
            <h2 className="font-bold flex items-center gap-2">
              <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">3</span>
              Documents to bring
            </h2>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              <CheckItem text="Original passport (not a copy)" />
              <CheckItem text="Copy of your passport (photo page + visa page)" />
              <CheckItem text="Proof of address in Brazil (hotel booking, rental contract, or utility bill)" />
              <CheckItem text="Birth certificate with apostille (if available — speeds things up)" />
              <CheckItem text="Printed CPF application form (download below)" />
            </ul>
          </div>
        </section>

        {/* Step 4: Download Forms */}
        <section className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-secondary">
            <h2 className="font-bold flex items-center gap-2">
              <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">4</span>
              Download your forms
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              Download and print these forms before going to the office. We've mapped your information to each field.
            </p>
            <DownloadCard
              title="CPF Application Form (Ficha Cadastral)"
              desc="The official Receita Federal form. We've indicated which fields to fill with your data."
              url="https://servicos.receita.fazenda.gov.br/Servicos/CPF/InscricaoCPF/default.asp"
              linkText="Open official form →"
            />
            <DownloadCard
              title="Form Field Guide"
              desc="A side-by-side guide showing exactly what to write in each Portuguese field using your information."
              isGenerated
            />

            <div className="bg-secondary rounded-xl p-5 mt-4">
              <h3 className="font-bold text-sm mb-2">📋 Pre-filled reference for the form</h3>
              <div className="bg-card rounded-lg p-4 font-mono text-xs space-y-1.5 text-muted-foreground border border-border">
                <p><strong className="text-foreground">Nome:</strong> {data.fullName}</p>
                <p><strong className="text-foreground">Nome da Mãe:</strong> {motherDisplay}</p>
                {data.fatherName && <p><strong className="text-foreground">Nome do Pai:</strong> {data.fatherName}</p>}
                <p><strong className="text-foreground">Documento:</strong> Passaporte — {data.passportNumber}</p>
                <p><strong className="text-foreground">Nacionalidade:</strong> {data.nationality}</p>
                <p><strong className="text-foreground">Endereço:</strong> {data.streetAddress}</p>
                <p><strong className="text-foreground">Cidade/UF:</strong> {data.city}, {data.state}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Step 5: What to say */}
        <section className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-secondary">
            <h2 className="font-bold flex items-center gap-2">
              <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">5</span>
              What to say at the office
            </h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-muted-foreground mb-4">
              Show this to the attendant or read it out. It explains exactly what you need:
            </p>
            <div className="bg-primary/5 border border-primary/15 rounded-xl p-5">
              <p className="text-sm leading-relaxed font-medium italic">
                "Bom dia / Boa tarde. Eu gostaria de fazer a inscrição no CPF, por favor. Meu nome é <strong>{data.fullName}</strong>, 
                sou {data.nationality.toLowerCase()}, e estou no Brasil com meu passaporte número <strong>{data.passportNumber}</strong>. 
                Aqui está meu formulário preenchido e meus documentos."
              </p>
              <div className="mt-4 pt-4 border-t border-primary/15">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Translation:</p>
                <p className="text-sm text-muted-foreground italic">
                  "Good morning / Good afternoon. I would like to register for a CPF, please. My name is {data.fullName}, 
                  I am {data.nationality.toLowerCase()}, and I am in Brazil with my passport number {data.passportNumber}. 
                  Here is my filled-out form and my documents."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Step 6: Portuguese Cheat Sheet */}
        <section className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-secondary">
            <h2 className="font-bold flex items-center gap-2">
              <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">6</span>
              Portuguese cheat sheet
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <PhraseCard pt="Inscrição no CPF" en="CPF Registration" />
              <PhraseCard pt="Passaporte" en="Passport" />
              <PhraseCard pt="Formulário preenchido" en="Filled-out form" />
              <PhraseCard pt="Comprovante de endereço" en="Proof of address" />
              <PhraseCard pt="Certidão de nascimento" en="Birth certificate" />
              <PhraseCard pt="Quanto tempo demora?" en="How long does it take?" />
              <PhraseCard pt="Preciso de mais algum documento?" en="Do I need any other documents?" />
              <PhraseCard pt="Obrigado / Obrigada" en="Thank you (m/f)" />
              <PhraseCard pt="Não falo português muito bem" en="I don't speak Portuguese very well" />
              <PhraseCard pt="Pode me ajudar, por favor?" en="Can you help me, please?" />
            </div>
          </div>
        </section>

        {/* After you get your CPF */}
        <section className="bg-primary/5 border border-primary/15 rounded-2xl p-6">
          <h2 className="font-bold text-lg mb-3">🎉 After you get your CPF</h2>
          <p className="text-sm text-muted-foreground mb-4">Once you have your CPF number, you can:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <NextStepCard icon="📱" title="Buy a SIM card" desc="Walk into any carrier store with your CPF and passport" />
            <NextStepCard icon="🏦" title="Open a bank account" desc="Nubank, Inter, C6 — most require only CPF + passport" />
            <NextStepCard icon="💳" title="Use Pix payments" desc="Brazil's instant payment system — free and universal" />
            <NextStepCard icon="🛒" title="Shop online" desc="Amazon Brazil, Mercado Livre, iFood, Rappi — all unlocked" />
          </div>
        </section>

        {/* CTA */}
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground mb-4">Need hands-on support? Upgrade to Concierge for WhatsApp assistance during your visit.</p>
          <a href="/#pricing" className="text-primary font-semibold text-sm hover:underline">View Concierge plan →</a>
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---

const InfoField = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-secondary rounded-lg p-3">
    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">{label}</div>
    <div className="font-semibold text-sm">{value}</div>
  </div>
);

const CheckItem = ({ text }: { text: string }) => (
  <li className="flex items-start gap-3 text-sm">
    <span className="w-5 h-5 bg-primary/10 text-primary rounded-md flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</span>
    {text}
  </li>
);

const DownloadCard = ({ title, desc, url, linkText, isGenerated }: { title: string; desc: string; url?: string; linkText?: string; isGenerated?: boolean }) => (
  <div className="bg-secondary rounded-xl p-5 flex items-start gap-4">
    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 text-lg">
      📄
    </div>
    <div className="flex-1">
      <h3 className="font-bold text-sm">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1">{desc}</p>
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary text-xs font-semibold mt-2 inline-block hover:underline">
          {linkText}
        </a>
      ) : isGenerated ? (
        <span className="text-primary text-xs font-semibold mt-2 inline-block">
          ↓ See pre-filled reference below
        </span>
      ) : null}
    </div>
  </div>
);

const PhraseCard = ({ pt, en }: { pt: string; en: string }) => (
  <div className="bg-secondary rounded-lg p-3">
    <div className="font-semibold text-sm">{pt}</div>
    <div className="text-xs text-muted-foreground mt-0.5">{en}</div>
  </div>
);

const NextStepCard = ({ icon, title, desc }: { icon: string; title: string; desc: string }) => (
  <div className="bg-card border border-border rounded-xl p-4">
    <div className="text-xl mb-2">{icon}</div>
    <h3 className="font-semibold text-sm">{title}</h3>
    <p className="text-xs text-muted-foreground mt-1">{desc}</p>
  </div>
);

export default ReadyPack;
