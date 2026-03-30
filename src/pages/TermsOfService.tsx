import { Link } from "react-router-dom";
import Footer from "@/components/Footer";

const TermsOfService = () => (
  <div className="min-h-screen bg-background">
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-6 py-4">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-lg font-bold tracking-tight">
          GET <span className="text-primary">CPF</span>
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
            GET CPF ("we", "us", "our") is a document preparation service. We help foreigners prepare for the Brazilian CPF registration process. We do not guarantee CPF approval — we prepare your documents to maximise your chance of success.
          </p>
          <p className="leading-relaxed mt-3 font-semibold">
            We do not issue CPF numbers. Only the Brazilian Federal Revenue Service (Receita Federal) can do that. The CPF registration itself is free — our fee covers the preparation service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">What $49 includes</h2>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li>Personalised FCPF form pre-filled with your details</li>
            <li>Document checklist tailored to your situation</li>
            <li>Office finder for the correct Receita Federal location</li>
            <li>Step-by-step day-of guide</li>
            <li>Portuguese phrases guide personalised to your name</li>
            <li>AI document validation</li>
            <li>30 days of dashboard access</li>
            <li>Rejection troubleshooter</li>
            <li>Life in Brazil guide with partner recommendations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Refund policy</h2>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li><strong>Before accessing your Ready Pack:</strong> Full refund within 7 days, no questions asked.</li>
            <li><strong>After accessing your Ready Pack:</strong> If your application is rejected due to an error in our document preparation, we will prepare corrected documents at no additional charge.</li>
            <li><strong>No cash refunds</strong> once documents have been generated.</li>
          </ul>
          <p className="leading-relaxed mt-3">
            To request a refund, email{" "}
            <a href="mailto:jonathan@telosmedia.co" className="text-primary hover:underline font-semibold">jonathan@telosmedia.co</a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Limitation of liability</h2>
          <p className="leading-relaxed">
            GET CPF is a document preparation service, not a legal service. We are not lawyers. We do not provide legal advice. Our total liability is limited to the amount you paid ($49). We are not responsible for decisions made by the Receita Federal or any government agency.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Your responsibilities</h2>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li>Provide accurate, truthful information</li>
            <li>Keep your account credentials secure</li>
            <li>Not share your Ready Pack with others</li>
            <li>Not use the service for any illegal purpose</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Affiliate links</h2>
          <p className="leading-relaxed">
            Our partner recommendations include affiliate links. We may earn a small commission at no extra cost to you. See our{" "}
            <Link to="/affiliates" className="text-primary hover:underline font-semibold">Affiliate Disclosure</Link> for details.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Governing law</h2>
          <p className="leading-relaxed">
            These terms are governed by the laws of Brazil. For consumers in South Africa, mandatory provisions of POPIA and the Consumer Protection Act apply.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Contact</h2>
          <p className="leading-relaxed">
            Questions? Email{" "}
            <a href="mailto:jonathan@telosmedia.co" className="text-primary hover:underline font-semibold">jonathan@telosmedia.co</a>
          </p>
        </section>
      </div>
    </main>
    <Footer />
  </div>
);

export default TermsOfService;