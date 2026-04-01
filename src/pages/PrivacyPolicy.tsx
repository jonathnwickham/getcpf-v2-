import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-background">
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-6 py-4">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <Link to="/"><Logo className="h-10" /></Link>
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back to home
        </Link>
      </div>
    </nav>

    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-extrabold tracking-tight mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-12">Last updated: 1 April 2026</p>

      <div className="prose prose-sm max-w-none space-y-8 text-foreground/90">
        <section>
          <h2 className="text-xl font-bold mb-3">Who we are</h2>
          <p className="leading-relaxed">
            GET CPF is a document preparation service that helps foreigners navigate the Brazilian CPF registration process. We are not affiliated with the Brazilian Government, Receita Federal, or any government agency.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">What data we collect</h2>
          <p className="leading-relaxed mb-3">We collect only what is strictly necessary to generate your personalised CPF application documents:</p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li><strong>Identity information:</strong> Full name, mother's name, father's name (optional), passport number, nationality, date of birth</li>
            <li><strong>Location information:</strong> Brazilian state, city, street address, and host details if staying with someone</li>
            <li><strong>Contact information:</strong> Email address</li>
            <li><strong>Account information:</strong> Encrypted password (we never see or store your plain-text password)</li>
            <li><strong>Payment information:</strong> Processed securely by Fanbasis — we never see or store your card details</li>
            <li><strong>Uploaded documents:</strong> Passport photo, selfie, and proof of address (if you choose to upload them)</li>
          </ul>
          <p className="leading-relaxed mt-3">Every data point we collect maps directly to a field required by the Receita Federal for CPF registration. We do not collect any data beyond what is necessary to deliver the service.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Why we collect it</h2>
          <p className="leading-relaxed">To generate personalised CPF application documents — specifically to pre-fill your official FCPF form, identify the correct Receita Federal office, personalise your document checklist and Portuguese phrases, and save your progress.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Legal basis for processing</h2>
          <p className="leading-relaxed mb-3">Under the LGPD (Lei Geral de Proteção de Dados), we process your data based on:</p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li><strong>Contractual necessity</strong> (LGPD Article 7, V / GDPR Article 6(1)(b)) — processing required to deliver the document preparation service you purchased</li>
            <li><strong>Consent</strong> — which you provide explicitly when you begin the onboarding questionnaire</li>
          </ul>
          <p className="leading-relaxed mt-3">You may withdraw consent at any time by emailing us. Withdrawal does not affect the lawfulness of processing carried out before withdrawal, and does not affect processing based on contractual necessity.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Data sharing with the Brazilian Receita Federal</h2>
          <p className="leading-relaxed">
            The purpose of GET CPF is to prepare your CPF application documents. By using our service, you acknowledge and consent to the fact that your personal data (full name, passport number, nationality, date of birth, mother's name, and address in Brazil) will be included in documents designed for submission to the <strong>Receita Federal do Brasil</strong> (Brazilian Federal Revenue Service). You — not GET CPF — submit these documents to the Receita Federal. We do not transmit your data to the government directly.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Third-party processors</h2>
          <p className="leading-relaxed mb-3">
            GET CPF is the <strong>Data Controller</strong>. We use the following third-party <strong>Data Processors</strong> to deliver the service:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li><strong>Supabase Inc.</strong> — database hosting, authentication, and file storage (SOC 2 Type II certified, data encrypted at rest and in transit)</li>
            <li><strong>Fanbasis</strong> — payment processing (we never see or store your card details)</li>
          </ul>
          <p className="leading-relaxed mt-3">We ensure that appropriate Data Processing Agreements (DPAs) are in place with each processor. We remain strictly liable for the security of your data regardless of which processor handles it.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">How we store and protect it</h2>
          <p className="leading-relaxed mb-3">
            Your data is encrypted and stored securely with row-level security — you can only access your own data. Specifically:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li>All data is transmitted over HTTPS (TLS 1.2+)</li>
            <li>Database access is restricted by Row Level Security (RLS) — each user can only access their own records</li>
            <li>Passwords are hashed using bcrypt</li>
            <li>Payment details are handled entirely by Fanbasis and never touch our servers</li>
            <li>Uploaded documents are stored in private, authenticated storage buckets</li>
            <li>Sensitive fields (e.g. passport numbers) are masked in the user interface</li>
            <li>All data is stored on encrypted infrastructure (AES-256 at rest)</li>
          </ul>
          <p className="leading-relaxed mt-3 font-semibold">We never sell, rent, or share your personal data with third parties for marketing or advertising purposes.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Data retention and automatic deletion</h2>
          <p className="leading-relaxed mb-3">We enforce strict retention limits to minimise the data we hold:</p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li><strong>Sensitive identity data</strong> (passport number, parent names, date of birth) is <strong>automatically and permanently deleted 30 days after account creation</strong>, regardless of whether a CPF was issued.</li>
            <li>Uploaded documents (passport photo, selfie, proof of address) are permanently deleted within 30 days of account creation, or immediately upon request.</li>
            <li>Your account profile (email, name) remains accessible until you request deletion.</li>
            <li>Accounts that never completed a payment are flagged for full deletion after 90 days.</li>
            <li>Anonymous, aggregated data (e.g. number of users per country) may be retained indefinitely.</li>
          </ul>
          <p className="leading-relaxed mt-3">You may request immediate deletion of all your data at any time by emailing us.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Cookies</h2>
          <p className="leading-relaxed">
            We use session cookies for authentication only. We do not use advertising cookies or third-party tracking cookies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Your rights</h2>
          <p className="leading-relaxed mb-3">
            Under the <strong>LGPD</strong> (Brazil), <strong>GDPR</strong> (EU), <strong>CCPA/CPRA</strong> (California), and <strong>POPIA</strong> (South Africa), you have the right to:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li><strong>Access</strong> — request a copy of all data we hold about you</li>
            <li><strong>Correction</strong> — ask us to fix any inaccurate information</li>
            <li><strong>Deletion</strong> — ask us to delete your account and all associated data</li>
            <li><strong>Portability</strong> — receive your data in a portable format (JSON export available in your dashboard)</li>
            <li><strong>Withdraw consent</strong> — at any time, for any reason</li>
            <li><strong>Limit use of sensitive personal information</strong> (CCPA) — your passport number is classified as Sensitive Personal Information under California law; we use it solely to prepare your CPF application</li>
          </ul>
          <p className="leading-relaxed mt-3">
            To exercise any of these rights, email us at{" "}
            <a href="mailto:support@getcpf.com" className="text-primary hover:underline font-semibold">support@getcpf.com</a>.
            We'll respond within 15 business days.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Data Protection Officer (Encarregado)</h2>
          <p className="leading-relaxed">
            As required by the LGPD, our designated Data Protection Officer (encarregado) can be contacted at:{" "}
            <a href="mailto:support@getcpf.com" className="text-primary hover:underline font-semibold">support@getcpf.com</a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">POPIA compliance (South Africa)</h2>
          <p className="leading-relaxed">
            GET CPF complies with South Africa's Protection of Personal Information Act (POPIA). We process personal information lawfully, collect only what is necessary, and take reasonable measures to protect it. If you believe your rights under POPIA have been infringed, contact the Information Regulator of South Africa at{" "}
            <a href="mailto:enquiries@inforegulator.org.za" className="text-primary hover:underline">enquiries@inforegulator.org.za</a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Data transfers</h2>
          <p className="leading-relaxed">
            Your data is stored on Supabase infrastructure (SOC 2 Type II certified). Data is processed in the United States. By using GET CPF, you consent to this transfer. We rely on the adequate security guarantees provided by Supabase's SOC 2 Type II certification, AES-256 encryption at rest, and TLS encryption in transit as a basis for international data transfer under LGPD Article 33 and GDPR Chapter V.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Data breach notification</h2>
          <p className="leading-relaxed">
            In the event of a data breach affecting your personal information, GET CPF will:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm mt-3">
            <li>Notify the <strong>ANPD</strong> (Brazilian Data Protection Authority) within <strong>3 business days</strong> of becoming aware of the breach, as required by Resolution CD/ANPD No. 15</li>
            <li>Notify relevant <strong>EU supervisory authorities</strong> within <strong>72 hours</strong>, as required by GDPR Article 33</li>
            <li>Notify <strong>affected users by email</strong> without undue delay</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Changes to this policy</h2>
          <p className="leading-relaxed">
            If we make significant changes, we'll update the date at the top and notify you by email.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Contact us</h2>
          <p className="leading-relaxed">
            Questions about your data? Email{" "}
            <a href="mailto:support@getcpf.com" className="text-primary hover:underline font-semibold">support@getcpf.com</a>
          </p>
        </section>
      </div>
    </main>
    <Footer />
  </div>
);

export default PrivacyPolicy;
