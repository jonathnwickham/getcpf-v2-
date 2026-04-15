import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";

const TermsOfService = () => (
  <div className="min-h-screen bg-background">
    <SEO title="Terms of Service, GET CPF" description="Terms and conditions for using GET CPF's Brazilian CPF preparation service." path="/terms" />
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-6 py-4">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <Link to="/"><Logo className="h-10" /></Link>
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back to home
        </Link>
      </div>
    </nav>

    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-extrabold tracking-tight mb-2">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-12">Last updated: 1 April 2026</p>

      <div className="prose prose-sm max-w-none space-y-8 text-foreground/90">

        {/* ── ACCEPTANCE ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">Acceptance of terms</h2>
          <p className="leading-relaxed">
            By accessing or using GET CPF ("we", "us", "our"), you agree to be bound by these Terms of Service and our{" "}
            <Link to="/privacy" className="text-primary hover:underline font-semibold">Privacy Policy</Link>.
            If you do not agree, do not use the service. These terms constitute a legally binding agreement between you and GET CPF.
          </p>
          <p className="leading-relaxed mt-3">
            GET CPF is operated by [Company Name] (Pty) Ltd (Registration No. XXXX/XXXXXX/XX), a company registered in the Republic of South Africa, with its registered address at [Address, City, Province, South Africa].
          </p>
        </section>

        {/* ── SERVICE DESCRIPTION ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">What this service is</h2>
          <p className="leading-relaxed">
            GET CPF is a <strong>document preparation service</strong>. We help foreigners prepare for the Brazilian CPF registration process. We do not guarantee CPF approval, we prepare your documents to maximise your chance of success.
          </p>
          <p className="leading-relaxed mt-3 font-semibold">
            We do not issue CPF numbers. Only the Brazilian Federal Revenue Service (Receita Federal) can do that. The CPF registration itself is free, our fee covers the preparation service.
          </p>
          <p className="leading-relaxed mt-3">
            GET CPF is not a law firm, accounting firm, or government agency. We do not provide legal, tax, or immigration advice. For specific legal questions, consult a qualified professional.
          </p>
        </section>

        {/* ── ELIGIBILITY ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">Eligibility</h2>
          <p className="leading-relaxed">
            You must be at least <strong>18 years of age</strong> to use GET CPF. By creating an account, you represent that you are 18 or older and have the legal capacity to enter into this agreement. If you are accessing GET CPF on behalf of another person (e.g. a minor applying for a CPF), you are responsible for ensuring compliance with these terms.
          </p>
        </section>

        {/* ── WHAT'S INCLUDED ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">What's included</h2>
          <p className="leading-relaxed mb-3">Your purchase grants you access to a personalised Ready Pack, which includes:</p>
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
          <p className="leading-relaxed mt-3">
            After 30 days, your dashboard access expires and all personal data and generated documents are permanently deleted in accordance with our{" "}
            <Link to="/privacy" className="text-primary hover:underline font-semibold">Privacy Policy</Link>.
          </p>
        </section>

        {/* ── PAYMENT ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">Payment and pricing</h2>
          <p className="leading-relaxed">
            The service fee is displayed on the pricing page at the time of purchase. All prices are in USD. Your bank or card provider may apply currency conversion fees, these are outside our control.
          </p>
          <p className="leading-relaxed mt-3">
            Payment is processed securely by Fanbasis. We never see or store your card details. Once payment is confirmed, you receive immediate access to your personalised Ready Pack.
          </p>
          <p className="leading-relaxed mt-3">
            Prices may change at any time, but changes do not affect purchases already completed.
          </p>
        </section>

        {/* ── REFUNDS ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">Refund policy</h2>
          <p className="leading-relaxed">
            If you follow our preparation steps and your CPF application is rejected by the Receita Federal, we will issue a <strong>full refund</strong>.
          </p>
          <p className="leading-relaxed mt-3">
            To request a refund, email{" "}
            <a href="mailto:support@getcpf.com" className="text-primary hover:underline font-semibold">support@getcpf.com</a>{" "}
            with:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm mt-2">
            <li>Your order details (email address and date of purchase)</li>
            <li>Evidence of rejection (email from Receita Federal, screenshot of rejection notice, or equivalent documentation)</li>
          </ul>
          <p className="leading-relaxed mt-3">
            Refunds are not available where the rejection resulted from inaccurate or incomplete information provided by you, or where you did not follow the preparation steps provided in your Ready Pack.
          </p>
          <p className="leading-relaxed mt-3">
            We aim to process all valid refund requests within 10 business days.
          </p>
        </section>

        {/* ── EU RIGHT OF WITHDRAWAL ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">Right of withdrawal (EU/EEA consumers)</h2>
          <p className="leading-relaxed">
            If you are a consumer in the EU/EEA, you have the right to withdraw from this contract within <strong>14 days</strong> of purchase without giving any reason, as provided by the Consumer Rights Directive (2011/83/EU).
          </p>
          <p className="leading-relaxed mt-3">
            However, by accessing your personalised Ready Pack immediately after payment, you expressly consent to the immediate delivery of digital content and acknowledge that you lose your right of withdrawal once the digital content has been fully delivered. This consent is captured at the point of purchase.
          </p>
          <p className="leading-relaxed mt-3">
            To exercise your right of withdrawal (before accessing the Ready Pack), email{" "}
            <a href="mailto:support@getcpf.com" className="text-primary hover:underline font-semibold">support@getcpf.com</a>.
          </p>
        </section>

        {/* ── BRAZILIAN CONSUMER RIGHTS ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">Consumer rights (Brazil)</h2>
          <p className="leading-relaxed">
            If you are a consumer in Brazil, you are entitled to the protections of the <strong>Código de Defesa do Consumidor</strong> (CDC, Law No. 8,078/1990), including the right to clear information about the service, protection against misleading practices, and the right to request cancellation. For distance purchases, you have the right to cancel within 7 days of purchase under CDC Article 49.
          </p>
        </section>

        {/* ── SOUTH AFRICAN CONSUMER RIGHTS ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">Consumer rights (South Africa)</h2>
          <p className="leading-relaxed">
            If you are a consumer in South Africa, you are entitled to the protections of the <strong>Consumer Protection Act</strong> (CPA, Act 68 of 2008), including the right to fair and honest dealing, the right to fair value and good quality service, and the right to a cooling-off period of 5 business days for transactions concluded as a result of direct marketing under Section 16 of the CPA. Nothing in these terms is intended to limit your rights under the CPA.
          </p>
        </section>

        {/* ── ACCOUNT ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">Your account</h2>
          <p className="leading-relaxed">
            You are responsible for maintaining the security of your account credentials and for all activity under your account. Notify us immediately at{" "}
            <a href="mailto:support@getcpf.com" className="text-primary hover:underline font-semibold">support@getcpf.com</a>{" "}
            if you suspect unauthorised access.
          </p>
          <p className="leading-relaxed mt-3">
            We may suspend or terminate your account if we reasonably believe you have violated these terms, provided false information, or used the service for fraudulent purposes. We will notify you by email before or at the time of suspension.
          </p>
        </section>

        {/* ── YOUR RESPONSIBILITIES ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">Your responsibilities</h2>
          <p className="leading-relaxed mb-3">By using GET CPF, you agree to:</p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li>Provide accurate, truthful information (including correct passport details, names, and personal data)</li>
            <li>Keep your account credentials secure</li>
            <li>Not share your Ready Pack with others</li>
            <li>Not use the service for any illegal purpose</li>
            <li>Not submit fraudulent, stolen, or falsified identity documents</li>
            <li>Not use the service to facilitate identity fraud or misrepresentation to any government authority</li>
            <li>Not attempt to reverse-engineer, copy, or redistribute the service</li>
          </ul>
        </section>

        {/* ── ACCURACY OF INFORMATION ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">Accuracy of your information</h2>
          <p className="leading-relaxed">
            GET CPF pre-fills official government forms based on information you provide. You are solely responsible for the accuracy and completeness of all information you submit. We are not liable for any rejection, delay, or other consequence resulting from inaccurate, incomplete, or misleading information provided by you.
          </p>
          <p className="leading-relaxed mt-3">
            We strongly recommend that you review all generated documents carefully before submitting them to the Receita Federal.
          </p>
        </section>

        {/* ── INTELLECTUAL PROPERTY ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">Intellectual property</h2>
          <p className="leading-relaxed">
            All content on GET CPF, including text, guides, templates, design, code, and branding, is owned by GET CPF and protected by copyright and intellectual property laws. Your purchase grants you a <strong>personal, non-transferable, non-exclusive licence</strong> to use the Ready Pack for your own CPF application. You may not resell, redistribute, or republish any part of the service.
          </p>
        </section>

        {/* ── DATA PROTECTION ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">Data protection</h2>
          <p className="leading-relaxed">
            We process your personal information in accordance with South Africa's Protection of Personal Information Act (POPIA), Brazil's Lei Geral de Proteção de Dados (LGPD), the EU General Data Protection Regulation (GDPR), and other applicable data protection laws. For full details on how we collect, store, and protect your data, see our{" "}
            <Link to="/privacy" className="text-primary hover:underline font-semibold">Privacy Policy</Link>.
          </p>
        </section>

        {/* ── LIMITATION OF LIABILITY ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">Limitation of liability</h2>
          <p className="leading-relaxed">
            GET CPF is a document preparation service, not a legal service. We are not lawyers. We do not provide legal advice. To the maximum extent permitted by applicable law:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm mt-2">
            <li>Our total liability for any claim arising from or related to the service is limited to the amount you paid for the service.</li>
            <li>We are not responsible for decisions made by the Receita Federal or any government agency.</li>
            <li>We are not liable for any rejection, delay, or consequence arising from inaccurate information you provided.</li>
            <li>We are not liable for indirect, incidental, special, consequential, or punitive damages.</li>
          </ul>
          <p className="leading-relaxed mt-3">
            Nothing in these terms excludes or limits liability that cannot be excluded under applicable law, including liability for fraud, death or personal injury caused by negligence, or any mandatory consumer protection rights under South African (CPA), Brazilian (CDC), EU, or other applicable law.
          </p>
        </section>

        {/* ── INDEMNIFICATION ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">Indemnification</h2>
          <p className="leading-relaxed">
            You agree to indemnify and hold harmless GET CPF from any claims, damages, or expenses (including reasonable legal fees) arising from your breach of these terms, your misuse of the service, your provision of false or misleading information, or your submission of fraudulent identity documents. This does not apply where prohibited by applicable consumer protection law.
          </p>
        </section>

        {/* ── AFFILIATES ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">Affiliate links</h2>
          <p className="leading-relaxed">
            Our partner recommendations include affiliate links. We may earn a small commission at no extra cost to you. See our{" "}
            <Link to="/affiliates" className="text-primary hover:underline font-semibold">Affiliate Disclosure</Link> for details.
          </p>
        </section>

        {/* ── DISPUTE RESOLUTION ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">Dispute resolution</h2>
          <p className="leading-relaxed">
            We encourage you to contact us first at{" "}
            <a href="mailto:support@getcpf.com" className="text-primary hover:underline font-semibold">support@getcpf.com</a>{" "}
            to resolve any dispute informally. Most issues can be resolved within a few business days.
          </p>
          <p className="leading-relaxed mt-3">
            If a dispute cannot be resolved informally, it shall be resolved through binding arbitration in accordance with the laws of the Republic of South Africa, unless you are a consumer entitled to bring proceedings in your local courts under mandatory consumer protection law (including the EU Consumer Rights Directive, Brazilian CDC, or South African CPA).
          </p>
          <p className="leading-relaxed mt-3">
            <strong>For US residents:</strong> You agree that any dispute will be resolved on an individual basis. You waive any right to participate in a class action or class arbitration, to the extent permitted by law.
          </p>
        </section>

        {/* ── GOVERNING LAW ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">Governing law</h2>
          <p className="leading-relaxed">
            These terms are governed by the laws of the <strong>Republic of South Africa</strong>. Where mandatory local consumer protection laws apply (including in the EU/EEA, Brazil, the United States, and South Africa), those laws take precedence to the extent of any conflict.
          </p>
        </section>

        {/* ── FORCE MAJEURE ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">Force majeure</h2>
          <p className="leading-relaxed">
            GET CPF is not liable for any delay or failure to perform resulting from causes outside our reasonable control, including but not limited to natural disasters, government actions, internet outages, or changes in Receita Federal procedures.
          </p>
        </section>

        {/* ── SEVERABILITY ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">Severability</h2>
          <p className="leading-relaxed">
            If any provision of these terms is found to be unenforceable or invalid by a court of competent jurisdiction, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will continue in full force and effect.
          </p>
        </section>

        {/* ── CHANGES ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">Changes to these terms</h2>
          <p className="leading-relaxed">
            We may update these terms from time to time. If we make material changes, we will update the date at the top of this page and notify you by email at least <strong>15 days</strong> before the changes take effect. Continued use of GET CPF after the updated terms take effect constitutes acceptance.
          </p>
        </section>

        {/* ── CONTACT ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">Contact</h2>
          <p className="leading-relaxed">
            Questions about these terms? Email{" "}
            <a href="mailto:support@getcpf.com" className="text-primary hover:underline font-semibold">support@getcpf.com</a>
          </p>
        </section>

        {/* ── RELATED ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">Related documents</h2>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li><Link to="/privacy" className="text-primary hover:underline font-semibold">Privacy Policy</Link></li>
            <li><Link to="/affiliates" className="text-primary hover:underline font-semibold">Affiliate Disclosure</Link></li>
          </ul>
        </section>

      </div>
    </main>
    <Footer />
  </div>
);

export default TermsOfService;