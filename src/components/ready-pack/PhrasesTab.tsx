import type { OnboardingData } from "@/lib/onboarding-data";
import { PhraseCard, ExternalLink } from "./shared";

export const PhrasesTab = ({ data }: { data: OnboardingData }) => (
  <div className="space-y-6 animate-slide-in">
    <section className="bg-primary/5 border border-primary/15 rounded-2xl p-6">
      <h2 className="text-xl font-bold">🇧🇷 Portuguese phrases for the office</h2>
      <p className="text-sm text-muted-foreground mt-2">You probably won't need all of these, but they're here just in case. Tap any phrase to copy it. you can show it on your phone screen.</p>
    </section>

    <section className="bg-card border border-border rounded-2xl p-6">
      <h3 className="font-bold mb-3">When you arrive</h3>
      <div className="space-y-2">
        <PhraseCard pt="Bom dia, gostaria de fazer a inscrição no CPF." en="Good morning, I'd like to register for a CPF." category="Arrival" />
        <PhraseCard pt="Sou estrangeiro(a). Preciso de CPF." en="I'm a foreigner. I need a CPF." category="Arrival" />
        <PhraseCard pt="Onde fica a fila para CPF?" en="Where is the queue for CPF?" category="Arrival" />
        <PhraseCard pt="Ficha para CPF, por favor." en="Ticket for CPF, please." category="Arrival" />
      </div>
    </section>

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

    <section className="bg-card border border-border rounded-2xl p-6">
      <h3 className="font-bold mb-3">If there's a problem</h3>
      <div className="space-y-2">
        <PhraseCard pt="Posso fazer a inscrição sem agendamento?" en="Can I register without an appointment?" category="Problem" />
        <PhraseCard pt="Não tenho CPF ainda, por isso não consigo agendar." en="I don't have a CPF yet, that's why I can't book online." category="Problem" />
        <PhraseCard pt="Tem outro posto que pode fazer isso?" en="Is there another office that can do this?" category="Problem" />
        <PhraseCard pt="Pode me ajudar, por favor?" en="Can you help me, please?" category="Problem" />
      </div>
    </section>

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

    <section className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-secondary">
        <h2 className="font-bold">📚 Want to actually learn Portuguese?</h2>
        <p className="text-xs text-muted-foreground mt-1">Even a few lessons before your visit makes a huge difference. These are our top picks.</p>
      </div>
      <div className="p-6 space-y-4">
        {[
          { name: "Preply", desc: "1-on-1 video lessons with native Brazilian Portuguese tutors. Pick your teacher, schedule, and budget.", price: "From ~$10/hour", why: "Best for: Getting conversation-ready fast with a real tutor", url: "https://www.preply.com/?pref=MTc3NDcwMDcwMw==&sc=portuguese" },
          { name: "Babbel", desc: "Structured app-based courses with speech recognition. Great for learning on the go.", price: "From ~$7/month", why: "Best for: Self-paced daily practice on your phone", url: "https://try.babbel.com/affiliate-evergreen-prices/?bsc=engmag&btp=default&utm_medium=affiliate" },
          { name: "italki", desc: "Find affordable community tutors or professional teachers for Brazilian Portuguese.", price: "From ~$6/hour", why: "Best for: Budget-friendly 1-on-1 practice sessions", url: "https://www.italki.com/en/teachers/portuguese?ref=getcpf" },
        ].map((platform) => (
          <a key={platform.name} href={platform.url} target="_blank" rel="noopener noreferrer" className="block bg-secondary/50 border border-border rounded-xl p-5 hover:border-primary/30 hover:bg-primary/5 transition-all group">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-sm">{platform.name}</h3>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{platform.price}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{platform.desc}</p>
                <p className="text-xs text-primary font-semibold mt-2">✦ {platform.why}</p>
              </div>
              <span className="text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1">↗</span>
            </div>
          </a>
        ))}
        <p className="text-xs text-muted-foreground text-center pt-2">🤝 These are affiliate links. we may earn a small commission at no extra cost to you.</p>
      </div>
    </section>
  </div>
);
