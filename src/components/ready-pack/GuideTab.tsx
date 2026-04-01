import type { OnboardingData, OfficeInfo } from "@/lib/onboarding-data";
import { TimelineStep, type Tab } from "./shared";
import officeVisitImg from "@/assets/office-visit.jpg";

export const GuideTab = ({ data, motherDisplay, recommendedOffice, setActiveTab }: {
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

    <div className="space-y-4">
      <TimelineStep time="Day before" title="Prepare everything the night before" items={[
        "Print passport copies (photo page + visa/entry stamp page)",
        "Print proof of address (hotel booking, rental contract, etc.)",
        "Put everything in a clear folder or envelope",
        "Charge your phone — you might need Google Translate",
        "Set an alarm to arrive early",
      ]} />
      <TimelineStep time="Morning" title={`Arrive at ${recommendedOffice?.name || "the office"}`} items={[
        `Address: ${recommendedOffice?.address || "Check the Office tab"}`,
        `Be there by ${recommendedOffice?.hours.split(",")[1]?.trim().split("–")[0] || "7:00"} — before the doors open`,
        "Look for the entrance and security guard",
        "Ask: 'Ficha para CPF, por favor' (ticket for CPF please)",
        "Take a number and sit in the waiting area",
      ]} />
      <TimelineStep time="At the counter" title="Present your documents" items={[
        "When your number is called, go to the indicated window",
        "Hand over your passport (original)",
        "Hand over your passport copies",
        "Hand over your proof of address",
        `Say: 'Bom dia, gostaria de fazer a inscrição no CPF. Meu nome é ${data.fullName}.'`,
        "They may ask questions — use the Portuguese phrases from the Phrases tab",
      ]} />
      <TimelineStep time="After" title="Receive your CPF number" items={[
        "You'll receive a printout with your CPF number — THIS IS IMPORTANT",
        "Take a photo of it immediately as backup",
        "Save the number in your phone's notes app",
        "You can now buy a SIM card, open a bank account, use Pix",
        "Your CPF is active immediately — no waiting period for in-person registration",
      ]} />
    </div>

    <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/15 rounded-2xl p-6 text-center">
      <div className="text-4xl mb-3">🎉</div>
      <h3 className="text-xl font-bold">Got your CPF?</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-4">Save it in your personal CPF section — it's your safe space.</p>
      <button onClick={() => setActiveTab("mycpf")} className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all">🔐 Go to my CPF section →</button>
    </section>

    <section className="bg-card border border-destructive/20 rounded-2xl p-6 text-center">
      <div className="text-3xl mb-3">😟</div>
      <h3 className="text-lg font-bold">Got rejected?</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-4">It happens — and it's usually one small thing. We'll tell you exactly what to fix.</p>
      <button onClick={() => setActiveTab("rejected")} className="bg-secondary text-foreground px-6 py-3 rounded-xl font-semibold text-sm hover:bg-secondary/80 transition-all">🔄 Fix my rejection →</button>
    </section>
  </div>
);
