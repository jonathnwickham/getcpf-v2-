import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { BRAZILIAN_STATES, STATE_OFFICES, type OnboardingData, type OfficeInfo } from "@/lib/onboarding-data";
import officeVisitImg from "@/assets/office-visit.jpg";
import documentsReadyImg from "@/assets/documents-ready.jpg";
import cpfSuccessImg from "@/assets/cpf-success.jpg";

type Tab = "overview" | "office" | "documents" | "guide" | "phrases";

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

const ReadyPack = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<OnboardingData | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

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
  const offices = STATE_OFFICES[data.state] || [];
  const recommendedOffice = offices.find((o) => o.recommended) || offices[0];
  const alternativeOffices = offices.filter((o) => !o.recommended);
  const motherDisplay = data.noMotherName ? data.motherAlternative : data.motherName;

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "📋" },
    { id: "office", label: "Where to go", icon: "📍" },
    { id: "documents", label: "Documents", icon: "📄" },
    { id: "guide", label: "Day-of guide", icon: "🗓️" },
    { id: "phrases", label: "Portuguese", icon: "🇧🇷" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-[960px] mx-auto px-6 py-12 pt-16">
          <a href="/" className="text-sm font-semibold opacity-70 hover:opacity-100 transition-opacity">← cpfeasy.ai</a>
          <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary-foreground/15 px-3 py-1 rounded-full text-xs font-bold mb-3">
                ✓ Your pack is ready
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                CPF Application Dashboard
              </h1>
              <p className="mt-2 opacity-80 max-w-[440px]">
                Everything is prepared for you, {data.fullName.split(" ")[0]}. Follow the steps below.
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
            {tabs.map((tab) => (
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
          </div>
        </div>
      </div>

      <div className="max-w-[960px] mx-auto px-6 py-8">
        {activeTab === "overview" && (
          <OverviewTab data={data} motherDisplay={motherDisplay} stateName={stateName} recommendedOffice={recommendedOffice} />
        )}
        {activeTab === "office" && (
          <OfficeTab recommendedOffice={recommendedOffice} alternativeOffices={alternativeOffices} stateName={stateName} />
        )}
        {activeTab === "documents" && (
          <DocumentsTab data={data} motherDisplay={motherDisplay} />
        )}
        {activeTab === "guide" && (
          <GuideTab data={data} motherDisplay={motherDisplay} recommendedOffice={recommendedOffice} />
        )}
        {activeTab === "phrases" && (
          <PhrasesTab data={data} />
        )}
      </div>
    </div>
  );
};

// === OVERVIEW TAB ===
const OverviewTab = ({ data, motherDisplay, stateName, recommendedOffice }: {
  data: OnboardingData; motherDisplay: string; stateName: string; recommendedOffice?: OfficeInfo;
}) => (
  <div className="space-y-8 animate-slide-in">
    {/* Visual process timeline */}
    <section className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-secondary">
        <h2 className="font-bold">Your CPF journey — 3 simple steps</h2>
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
      <QuickAction icon="📍" title="View office details" desc="Address, phone, hours, tips" onClick={() => {}} />
      <QuickAction icon="📄" title="Document checklist" desc="What to print & bring" onClick={() => {}} />
      <QuickAction icon="🗓️" title="Day-of guide" desc="Step-by-step for the visit" onClick={() => {}} />
      <QuickAction icon="🇧🇷" title="Portuguese phrases" desc="What to say at the office" onClick={() => {}} />
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
  </div>
);

// === OFFICE TAB ===
const OfficeTab = ({ recommendedOffice, alternativeOffices, stateName }: {
  recommendedOffice?: OfficeInfo; alternativeOffices: OfficeInfo[]; stateName: string;
}) => (
  <div className="space-y-6 animate-slide-in">
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

        {/* How to get there */}
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
              <span><strong>Present your documents.</strong> Hand over your passport + copies, proof of address, and say you want a CPF (use the Portuguese script from the Phrases tab).</span>
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

    {alternativeOffices.length === 0 && (
      <div className="bg-secondary rounded-xl p-5 text-center">
        <p className="text-sm text-muted-foreground">This is the only Receita Federal office in {stateName}. No alternatives available.</p>
      </div>
    )}
  </div>
);

// === DOCUMENTS TAB ===
const DocumentsTab = ({ data, motherDisplay }: { data: OnboardingData; motherDisplay: string }) => (
  <div className="space-y-6 animate-slide-in">
    {/* Visual checklist */}
    <section className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-secondary">
        <h2 className="font-bold">Document checklist — bring all of these</h2>
        <p className="text-xs text-muted-foreground mt-1">Check each item off as you prepare. Missing one could mean a wasted trip.</p>
      </div>
      <div className="p-6 space-y-3">
        <DocCheck title="Original passport" desc="Not a copy — they need to see the original document. Bring the passport you used to enter Brazil." critical />
        <DocCheck title="Passport copy — photo page" desc="A clear colour photocopy of the page with your photo, name, and passport number. Colour preferred, must show all details clearly." critical />
        <DocCheck title="Passport copy — visa/entry stamp page" desc="Copy of the page showing your Brazilian entry stamp or visa. This proves your legal entry." critical />
        
        <div className="border-t border-border pt-3 mt-3">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Proof of address — bring ONE of the following</p>
          <DocCheck title="Hotel booking confirmation" desc="A printed or digital confirmation showing the hotel name, address, and your name. Most commonly accepted." />
          <DocCheck title="Airbnb rental confirmation" desc="Your Airbnb booking confirmation with the full address shown. Print it or show on your phone." />
          <DocCheck title="Rental contract" desc="If you're renting an apartment, bring a copy of the signed contract showing the address." />
          <DocCheck title="Utility bill with address" desc="An electricity, water, or internet bill in your name or your host's name, showing the Brazilian address." />
          <DocCheck title="Invitation letter from your host" desc="If staying with family, partner, or friends — a signed letter stating you reside at their address, with their name, CPF, address, and signature. Attach a copy of their ID." />
        </div>

        <div className="border-t border-border pt-3 mt-3">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Recommended extras</p>
          <DocCheck title="Printed CPF application form" desc="Some offices have you fill it on-site, but arriving with a printed copy speeds things up and avoids delays." />
          <DocCheck title="Birth certificate with apostille" desc="Not always required, but can speed things up. If you have an apostilled copy, bring it." />
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
        <a
          href="https://servicos.receita.fazenda.gov.br/Servicos/CPF/InscricaoCpfEstrangeiro/default.asp"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 bg-secondary rounded-xl p-4 hover:bg-secondary/80 transition-all group"
        >
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-2xl shrink-0">📄</div>
          <div className="flex-1">
            <h3 className="font-bold text-sm group-hover:text-primary transition-colors">Receita Federal — CPF Online Registration</h3>
            <p className="text-xs text-muted-foreground mt-0.5">servicos.receita.fazenda.gov.br</p>
          </div>
          <span className="text-primary font-semibold text-sm shrink-0">Open →</span>
        </a>

        {/* Pre-filled reference */}
        <div className="bg-secondary rounded-xl p-5">
          <h3 className="font-bold text-sm mb-3">Your data for the form fields</h3>
          <div className="bg-card rounded-lg p-4 font-mono text-xs space-y-2 border border-border">
            <FormFieldDisplay label="Nome Completo" value={data.fullName} />
            <FormFieldDisplay label="Nome da Mãe" value={motherDisplay} />
            {data.fatherName && <FormFieldDisplay label="Nome do Pai" value={data.fatherName} />}
            <FormFieldDisplay label="Tipo de Documento" value="Passaporte" />
            <FormFieldDisplay label="Número do Documento" value={data.passportNumber} />
            <FormFieldDisplay label="Nacionalidade" value={data.nationality} />
            <FormFieldDisplay label="Endereço" value={data.streetAddress} />
            <FormFieldDisplay label="Cidade / UF" value={`${data.city}, ${data.state}`} />
            <FormFieldDisplay label="E-mail" value={data.email} />
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            💡 Copy these values exactly as shown into the Portuguese form fields. "Nome da Mãe" means "Mother's name."
          </p>
        </div>
      </div>
    </section>
  </div>
);

// === GUIDE TAB ===
const GuideTab = ({ data, motherDisplay, recommendedOffice }: {
  data: OnboardingData; motherDisplay: string; recommendedOffice?: OfficeInfo;
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

    {/* Emergency card */}
    <section className="bg-destructive/5 border border-destructive/15 rounded-2xl p-6">
      <h3 className="font-bold flex items-center gap-2 text-destructive">⚠️ If something goes wrong</h3>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        <li><strong>They ask for documents you don't have:</strong> Ask "O que mais posso trazer?" (What else can I bring?) and come back another day.</li>
        <li><strong>They say you need an appointment:</strong> Some offices require scheduling. Ask for the website or phone number to book one.</li>
        <li><strong>Language barrier:</strong> Open Google Translate on your phone and type what you need. Most staff are patient and helpful.</li>
        <li><strong>Long wait:</strong> This is normal in Brazil. Bring a book or charged phone. Expected wait: {recommendedOffice?.waitTime || "30–60 min"}.</li>
      </ul>
    </section>
  </div>
);

// === PHRASES TAB ===
const PhrasesTab = ({ data }: { data: OnboardingData }) => (
  <div className="space-y-6 animate-slide-in">
    {/* Main script */}
    <section className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-secondary">
        <h2 className="font-bold">🎤 What to say — your script</h2>
        <p className="text-xs text-muted-foreground mt-1">Show this to the attendant on your phone, or read it out loud.</p>
      </div>
      <div className="p-6">
        <div className="bg-primary/5 border border-primary/15 rounded-xl p-6">
          <p className="text-base leading-relaxed font-medium">
            "Bom dia. Eu gostaria de fazer a inscrição no CPF, por favor. Meu nome é <strong>{data.fullName}</strong>, sou <strong>{data.nationality.toLowerCase()}</strong>, e estou no Brasil com meu passaporte número <strong>{data.passportNumber}</strong>. Aqui está meu formulário e meus documentos."
          </p>
        </div>
        <div className="mt-4 bg-secondary rounded-xl p-5">
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2">Translation</p>
          <p className="text-sm text-muted-foreground italic leading-relaxed">
            "Good morning. I would like to register for a CPF, please. My name is {data.fullName}, I am {data.nationality.toLowerCase()}, and I am in Brazil with my passport number {data.passportNumber}. Here is my form and my documents."
          </p>
        </div>
      </div>
    </section>

    {/* Essential phrases */}
    <section className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-secondary">
        <h2 className="font-bold">Essential phrases</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <PhraseCard pt="Inscrição no CPF" en="CPF Registration" category="At the desk" />
          <PhraseCard pt="Ficha para CPF, por favor" en="A ticket for CPF, please" category="At the entrance" />
          <PhraseCard pt="Passaporte" en="Passport" category="Documents" />
          <PhraseCard pt="Comprovante de endereço" en="Proof of address" category="Documents" />
          <PhraseCard pt="Certidão de nascimento" en="Birth certificate" category="Documents" />
          <PhraseCard pt="Formulário preenchido" en="Filled-out form" category="Documents" />
          <PhraseCard pt="Quanto tempo demora?" en="How long does it take?" category="Questions" />
          <PhraseCard pt="Preciso de mais algum documento?" en="Do I need any other document?" category="Questions" />
          <PhraseCard pt="Posso agendar um horário?" en="Can I schedule an appointment?" category="Questions" />
          <PhraseCard pt="Onde fica o banheiro?" en="Where is the bathroom?" category="Practical" />
          <PhraseCard pt="Não falo português muito bem" en="I don't speak Portuguese very well" category="Helpful" />
          <PhraseCard pt="Pode me ajudar, por favor?" en="Can you help me, please?" category="Helpful" />
          <PhraseCard pt="Obrigado / Obrigada" en="Thank you (male / female)" category="Polite" />
          <PhraseCard pt="Com licença" en="Excuse me" category="Polite" />
          <PhraseCard pt="Pode escrever, por favor?" en="Can you write it down, please?" category="Helpful" />
          <PhraseCard pt="Qual é o meu número do CPF?" en="What is my CPF number?" category="At the desk" />
        </div>
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
        <div className="bg-primary text-primary-foreground px-6 py-2 text-xs font-bold">⭐ Recommended — best for foreigners</div>
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
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
          >
            📍 Open in Google Maps
          </a>
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

const DocCheck = ({ title, desc, critical }: { title: string; desc: string; critical?: boolean }) => (
  <div className={`flex items-start gap-3 p-3 rounded-xl ${critical ? "bg-primary/5 border border-primary/10" : "bg-secondary"}`}>
    <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold border-2 ${
      critical ? "border-primary text-primary" : "border-border text-muted-foreground"
    }`}>
      {critical ? "!" : "○"}
    </div>
    <div>
      <h4 className="font-semibold text-sm">{title}</h4>
      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
    </div>
  </div>
);

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

const PhraseCard = ({ pt, en, category }: { pt: string; en: string; category: string }) => (
  <div className="bg-secondary rounded-lg p-3">
    <div className="text-[9px] uppercase tracking-wider text-primary font-bold mb-1">{category}</div>
    <div className="font-semibold text-sm">{pt}</div>
    <div className="text-xs text-muted-foreground mt-0.5">{en}</div>
  </div>
);

export default ReadyPack;
