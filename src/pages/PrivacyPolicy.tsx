import { Link } from "react-router-dom";

const PrivacyPolicy = () => (
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
      <h1 className="text-3xl font-extrabold tracking-tight mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-12">Last updated: 29 March 2026</p>

      <div className="prose prose-sm max-w-none space-y-8 text-foreground/90">
        <section>
          <h2 className="text-xl font-bold mb-3">Who we are</h2>
          <p className="leading-relaxed">
            GET CPF ("we", "us", "our") is a private consulting service that helps foreigners navigate the Brazilian CPF registration process. We are not affiliated with the Brazilian Government, Receita Federal, or any government agency.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">What data we collect</h2>
          <p className="leading-relaxed mb-3">We collect only what's needed to generate your personalised Ready Pack:</p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li><strong>Identity information:</strong> Full name, mother's name, father's name (optional), passport number, nationality, date of birth</li>
            <li><strong>Location information:</strong> Brazilian state, city, street address, and host details if staying with someone</li>
            <li><strong>Contact information:</strong> Email address</li>
            <li><strong>Account information:</strong> Encrypted password (we never see or store your plain-text password)</li>
            <li><strong>Payment information:</strong> Processed securely by our payment provider — we never see or store your card details</li>
            <li><strong>Uploaded documents:</strong> Passport photo, selfie, and proof of address (if you choose to upload them)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Why we collect it</h2>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li>To pre-fill your official CPF application form (FCPF) so you don't have to</li>
            <li>To identify the correct Receita Federal office for your location</li>
            <li>To personalise your document checklist, Portuguese phrases, and day-of guide</li>
            <li>To save your progress so you can come back anytime</li>
            <li>To send you your Ready Pack and account-related emails</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">How we store and protect it</h2>
          <p className="leading-relaxed mb-3">
            Your data is stored securely using industry-standard infrastructure with encryption at rest and in transit. Specifically:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li>All data is transmitted over HTTPS (TLS 1.2+)</li>
            <li>Database access is restricted by row-level security — you can only access your own data</li>
            <li>Passwords are hashed using bcrypt — we cannot read them</li>
            <li>Payment details are handled entirely by our payment processor and never touch our servers</li>
            <li>Uploaded documents are stored in private, authenticated storage buckets</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Who we share it with</h2>
          <p className="leading-relaxed mb-3">
            We do not sell, rent, or trade your personal data. We share data only with:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li><strong>Our infrastructure provider</strong> (for hosting and database services)</li>
            <li><strong>Our payment processor</strong> (to process your payment securely)</li>
            <li><strong>You</strong> — in the form of your downloaded Ready Pack documents</li>
          </ul>
          <p className="leading-relaxed mt-3">
            We never share your passport number, mother's name, or any personal details with third parties for marketing or any other purpose.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Cookies and analytics</h2>
          <p className="leading-relaxed">
            We use essential cookies only — to keep you logged in and save your session. We do not use advertising cookies or third-party trackers. We may use anonymous analytics to understand how people use the app so we can make it better.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Your rights</h2>
          <p className="leading-relaxed mb-3">
            Under the LGPD (Brazil's data protection law), POPIA (South Africa's data protection law), GDPR (if you're in the EU), and other applicable privacy laws, you have the right to:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li><strong>Access</strong> — request a copy of all data we hold about you</li>
            <li><strong>Correction</strong> — ask us to fix any inaccurate information</li>
            <li><strong>Deletion</strong> — ask us to delete your account and all associated data</li>
            <li><strong>Portability</strong> — receive your data in a portable format</li>
            <li><strong>Withdraw consent</strong> — at any time, for any reason</li>
          </ul>
          <p className="leading-relaxed mt-3">
            To exercise any of these rights, email us at <a href="mailto:privacy@getcpf.com" className="text-primary hover:underline">privacy@getcpf.com</a>. We'll respond within 15 business days.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">POPIA compliance (South Africa)</h2>
          <p className="leading-relaxed mb-3">
            GET CPF complies with South Africa's Protection of Personal Information Act (POPIA). As a South African company processing personal information, we adhere to the following principles:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li>We process personal information lawfully, for a legitimate and specific purpose</li>
            <li>We collect only information that is adequate, relevant, and not excessive</li>
            <li>We take reasonable technical and organisational measures to protect your data</li>
            <li>We do not retain personal information longer than necessary</li>
          </ul>
          <p className="leading-relaxed mt-3">
            If you believe your rights under POPIA have been infringed, you have the right to lodge a complaint with the Information Regulator of South Africa:
          </p>
          <ul className="list-none pl-6 space-y-1 text-sm mt-2">
            <li>📧 Email: <a href="mailto:enquiries@inforegulator.org.za" className="text-primary hover:underline">enquiries@inforegulator.org.za</a></li>
            <li>🌐 Website: <a href="https://inforegulator.org.za" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">inforegulator.org.za</a></li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Data retention</h2>
          <p className="leading-relaxed">
            We keep your data for as long as your account is active. If you delete your account, we remove all personal data within 30 days. Anonymous, aggregated data (like "X users completed the flow this month") may be retained indefinitely.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Children</h2>
          <p className="leading-relaxed">
            This service is not intended for anyone under 18. We do not knowingly collect data from minors.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Changes to this policy</h2>
          <p className="leading-relaxed">
            If we make significant changes, we'll update the date at the top and notify you by email. Your continued use of the service after changes means you accept the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Contact us</h2>
          <p className="leading-relaxed">
            Questions about your data? Email <a href="mailto:privacy@getcpf.com" className="text-primary hover:underline">privacy@getcpf.com</a>
          </p>
        </section>
      </div>
    </main>
  </div>
);

export default PrivacyPolicy;