import { Link } from "react-router-dom";

const TermsOfService = () => (
  <div className="min-h-screen bg-background">
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-6 py-4">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-lg font-bold tracking-tight">
          cpf<span className="text-primary">easy</span>.ai
        </Link>
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back to home
        </Link>
      </div>
    </nav>

    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-extrabold tracking-tight mb-2">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-12">Last updated: 29 March 2026</p>

      <div className="prose prose-sm max-w-none space-y-8 text-foreground/90">
        <section>
          <h2 className="text-xl font-bold mb-3">What this service is</h2>
          <p className="leading-relaxed">
            CPF Easy AI is a private consulting and document preparation service. We help foreigners prepare for the Brazilian CPF (Cadastro de Pessoas Físicas) registration process by providing personalised guidance, pre-filled forms, and step-by-step instructions.
          </p>
          <p className="leading-relaxed mt-3 font-semibold">
            We do not issue CPF numbers. Only the Brazilian Federal Revenue Service (Receita Federal) can do that. The CPF registration itself is free — our fee covers the preparation service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">What you're paying for</h2>
          <p className="leading-relaxed mb-3">When you pay $49 for the Self-Service plan, you receive:</p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li>A personalised Ready Pack with pre-filled application guidance</li>
            <li>The correct Receita Federal office for your location</li>
            <li>A document checklist tailored to your situation</li>
            <li>A Portuguese cheat sheet with exactly what to say</li>
            <li>A step-by-step day-of guide</li>
            <li>A rejection troubleshooter</li>
            <li>A post-CPF life-in-Brazil guide</li>
            <li>Lifetime access to your Ready Pack</li>
          </ul>
          <p className="leading-relaxed mt-3">
            You are paying for guidance and preparation — not for a CPF number itself.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">No guarantee of outcome</h2>
          <p className="leading-relaxed">
            While we do everything we can to make sure your application succeeds first time, we cannot guarantee that the Receita Federal will approve your CPF application. Their decision depends on factors outside our control, including document authenticity, eligibility requirements, and individual office procedures.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Refund policy</h2>
          <p className="leading-relaxed mb-3">
            We want you to feel confident about this purchase:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li><strong>Before accessing your Ready Pack:</strong> Full refund, no questions asked. Email us within 7 days of purchase.</li>
            <li><strong>After accessing your Ready Pack:</strong> If you followed our instructions exactly and were still rejected, email us with details and we'll either fix the issue for free or refund you in full.</li>
            <li><strong>Not eligible for refund:</strong> If you simply changed your mind after viewing the Ready Pack, or if your rejection was due to information you provided incorrectly.</li>
          </ul>
          <p className="leading-relaxed mt-3">
            To request a refund, email <a href="mailto:support@cpfeasy.ai" className="text-primary hover:underline">support@cpfeasy.ai</a> with your account email and the reason. We process refunds within 5–10 business days.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Your responsibilities</h2>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li>Provide accurate, truthful information — especially your passport number and mother's name</li>
            <li>Keep your account credentials secure</li>
            <li>Not share your Ready Pack with others (it's personalised to you)</li>
            <li>Not use the service for any illegal purpose</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Affiliate links and partner recommendations</h2>
          <p className="leading-relaxed">
            Our "Life in Brazil" guide and partner recommendations include links to third-party services like Nubank, Wise, SafetyWing, Airalo, and others. Some of these links may be affiliate links, meaning we may earn a small commission if you sign up through them. This doesn't cost you anything extra — we only recommend services we genuinely believe are useful for foreigners in Brazil. These are third-party services and we are not responsible for their products, policies, or actions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Intellectual property</h2>
          <p className="leading-relaxed">
            All content, design, and code on this site is owned by CPF Easy AI. You may not copy, reproduce, or redistribute any part of the service without written permission. Your personal Ready Pack is licensed for your personal use only.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Limitation of liability</h2>
          <p className="leading-relaxed">
            To the maximum extent permitted by law, CPF Easy AI shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service. Our total liability is limited to the amount you paid for the service ($49). We are not responsible for decisions made by the Receita Federal, delays in CPF processing, or any losses arising from the CPF application process.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Termination</h2>
          <p className="leading-relaxed">
            You can delete your account at any time by emailing <a href="mailto:support@cpfeasy.ai" className="text-primary hover:underline">support@cpfeasy.ai</a>. We reserve the right to suspend or terminate accounts that violate these terms or use the service fraudulently.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Governing law</h2>
          <p className="leading-relaxed">
            These terms are governed by the laws of the Federative Republic of Brazil. Any disputes shall be resolved in the courts of São Paulo, SP, Brazil.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Changes to these terms</h2>
          <p className="leading-relaxed">
            We may update these terms from time to time. If we make material changes, we'll notify you by email. Continued use of the service after changes constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Contact</h2>
          <p className="leading-relaxed">
            Questions? Email <a href="mailto:support@cpfeasy.ai" className="text-primary hover:underline">support@cpfeasy.ai</a>
          </p>
        </section>
      </div>
    </main>
  </div>
);

export default TermsOfService;
