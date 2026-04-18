import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-white">
    <SEO title="Privacy Policy. GET CPF" description="How GET CPF collects, uses, and protects your personal data during the CPF application process." path="/privacy" />
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <Link to="/"><Logo className="h-10" /></Link>
        <Link to="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
          ← Back to home
        </Link>
      </div>
    </nav>

    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-extrabold tracking-tight mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-4">Last updated: 1 April 2026</p>
      <div className="flex gap-3 mb-12">
        <a href="https://www.iubenda.com/privacy-policy/60979908" className="iubenda-white iubenda-noiframe iubenda-embed text-sm text-green-800 font-semibold hover:underline" title="Privacy Policy">View full Privacy Policy (iubenda)</a>
        <span className="text-gray-300">|</span>
        <a href="https://www.iubenda.com/privacy-policy/60979908/cookie-policy" className="iubenda-white iubenda-noiframe iubenda-embed text-sm text-green-800 font-semibold hover:underline" title="Cookie Policy">Cookie Policy</a>
      </div>

      <div className="prose prose-sm max-w-none space-y-8 text-gray-900/90">

        {/* ── 1. CONTROLLER IDENTITY ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">Who we are</h2>
          <p className="leading-relaxed">
            GET CPF is a document preparation service that helps foreigners navigate the Brazilian CPF registration process. We are <strong>not</strong> affiliated with the Brazilian Government, Receita Federal, or any government agency.
          </p>
          <p className="leading-relaxed mt-3">
            <strong>Data Controller:</strong> GET CPF, operated by Jonathan, based in São Paulo, SP, Brazil.<br />
            <strong>Contact email:</strong>{" "}
            <a href="mailto:support@getcpf.com" className="text-green-800 hover:underline font-semibold">support@getcpf.com</a><br />
            <strong>Website:</strong>{" "}
            <a href="https://getcpf.com" className="text-green-800 hover:underline">getcpf.com</a>
          </p>
        </section>

        {/* ── 2. SCOPE ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">Scope of this policy</h2>
          <p className="leading-relaxed">
            This Privacy Policy applies to all personal data collected through <strong>getcpf.com</strong> and its subdomains. It applies regardless of your country of residence. We comply with the following data protection frameworks:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm mt-3">
            <li><strong>LGPD</strong>. Lei Geral de Proteção de Dados (Brazil, Law No. 13,709/2018)</li>
            <li><strong>GDPR</strong>. General Data Protection Regulation (EU/EEA, Regulation 2016/679)</li>
            <li><strong>CCPA/CPRA</strong>. California Consumer Privacy Act and California Privacy Rights Act (United States)</li>
            <li><strong>POPIA</strong>. Protection of Personal Information Act (South Africa, Act 4 of 2013)</li>
          </ul>
        </section>

        {/* ── 3. DATA COLLECTION ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">What data we collect</h2>
          <p className="leading-relaxed mb-3">We collect only what is strictly necessary to generate your personalised CPF application documents:</p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li><strong>Identity information:</strong> Full name, mother's name, father's name (optional), passport number, nationality, date of birth</li>
            <li><strong>Location information:</strong> Brazilian state, city, street address, and host details if staying with someone</li>
            <li><strong>Contact information:</strong> Email address</li>
            <li><strong>Account information:</strong> Encrypted password (we never see or store your plain-text password)</li>
            <li><strong>Payment information:</strong> Processed securely by Fanbasis. we never see or store your card details</li>
            <li><strong>Uploaded documents:</strong> Passport photo, selfie, and proof of address (if you choose to upload them)</li>
          </ul>
          <p className="leading-relaxed mt-3">Every data point we collect maps directly to a field required by the Receita Federal for CPF registration. We do not collect any data beyond what is necessary to deliver the service.</p>
        </section>

        {/* ── 3b. CCPA CATEGORIES ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">Categories of personal information (CCPA)</h2>
          <p className="leading-relaxed mb-3">In the preceding 12 months, we have collected the following categories of personal information as defined by the CCPA:</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-100 rounded">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-2 border-b border-gray-100 font-semibold">Category</th>
                  <th className="text-left p-2 border-b border-gray-100 font-semibold">Collected</th>
                  <th className="text-left p-2 border-b border-gray-100 font-semibold">Sold/Shared</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="p-2 border-b border-gray-100">A. Identifiers (name, email, passport number)</td><td className="p-2 border-b border-gray-100">Yes</td><td className="p-2 border-b border-gray-100">No</td></tr>
                <tr><td className="p-2 border-b border-gray-100">B. Personal information (Cal. Civ. Code §1798.80)</td><td className="p-2 border-b border-gray-100">Yes</td><td className="p-2 border-b border-gray-100">No</td></tr>
                <tr><td className="p-2 border-b border-gray-100">D. Commercial information (purchase history)</td><td className="p-2 border-b border-gray-100">Yes</td><td className="p-2 border-b border-gray-100">No</td></tr>
                <tr><td className="p-2 border-b border-gray-100">F. Internet/network activity</td><td className="p-2 border-b border-gray-100">No</td><td className="p-2 border-b border-gray-100">No</td></tr>
                <tr><td className="p-2 border-b border-gray-100">I. Sensitive personal information (passport number)</td><td className="p-2 border-b border-gray-100">Yes</td><td className="p-2 border-b border-gray-100">No</td></tr>
              </tbody>
            </table>
          </div>
          <p className="leading-relaxed mt-3">We have <strong>not sold or shared</strong> any personal information in the preceding 12 months and have no intention to do so.</p>
        </section>

        {/* ── 4. PURPOSE ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">Why we collect it</h2>
          <p className="leading-relaxed">To generate personalised CPF application documents. specifically to pre-fill your official FCPF form, identify the correct Receita Federal office, personalise your document checklist and Portuguese phrases, and save your progress.</p>
        </section>

        {/* ── 5. LEGAL BASIS ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">Legal basis for processing</h2>
          <p className="leading-relaxed mb-3">We process your data based on:</p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li><strong>Contractual necessity</strong> (LGPD Article 7, V / GDPR Article 6(1)(b) / POPIA Section 11(1)(b)). processing required to deliver the document preparation service you purchased</li>
            <li><strong>Consent</strong> (LGPD Article 7, I / GDPR Article 6(1)(a) / POPIA Section 11(1)(a)). which you provide explicitly when you begin the onboarding questionnaire</li>
          </ul>
          <p className="leading-relaxed mt-3">You may withdraw consent at any time by emailing us. Withdrawal does not affect the lawfulness of processing carried out before withdrawal, and does not affect processing based on contractual necessity.</p>
        </section>

        {/* ── 6. RECEITA FEDERAL ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">Data sharing with the Brazilian Receita Federal</h2>
          <p className="leading-relaxed">
            The purpose of GET CPF is to prepare your CPF application documents. By using our service, you acknowledge and consent to the fact that your personal data (full name, passport number, nationality, date of birth, mother's name, and address in Brazil) will be included in documents designed for submission to the <strong>Receita Federal do Brasil</strong> (Brazilian Federal Revenue Service). You. not GET CPF. submit these documents to the Receita Federal. We do not transmit your data to the government directly.
          </p>
        </section>

        {/* ── 7. THIRD-PARTY PROCESSORS ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">Third-party processors</h2>
          <p className="leading-relaxed mb-3">
            GET CPF is the <strong>Data Controller</strong>. We use the following third-party <strong>Data Processors</strong> to deliver the service:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li><strong>Supabase Inc.</strong> (United States). database hosting, authentication, and file storage (SOC 2 Type II certified, data encrypted at rest and in transit)</li>
            <li><strong>Fanbasis</strong> (United States). payment processing (we never see or store your card details)</li>
          </ul>
          <p className="leading-relaxed mt-3">We ensure that appropriate Data Processing Agreements (DPAs) are in place with each processor. We remain strictly liable for the security of your data regardless of which processor handles it. No personal data is shared with any other third party.</p>
        </section>

        {/* ── 8. SECURITY ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">How we store and protect it</h2>
          <p className="leading-relaxed mb-3">
            Your data is encrypted and stored securely with row-level security. you can only access your own data. Specifically:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li>All data is transmitted over HTTPS (TLS 1.2+)</li>
            <li>Database access is restricted by Row Level Security (RLS). each user can only access their own records</li>
            <li>Passwords are hashed using bcrypt</li>
            <li>Payment details are handled entirely by Fanbasis and never touch our servers</li>
            <li>Uploaded documents are stored in private, authenticated storage buckets</li>
            <li>Sensitive fields (e.g. passport numbers) are masked in the user interface</li>
            <li>All data is stored on encrypted infrastructure (AES-256 at rest)</li>
          </ul>
          <p className="leading-relaxed mt-3 font-semibold">We never sell, rent, or share your personal data with third parties for marketing or advertising purposes.</p>
        </section>

        {/* ── 9. RETENTION ── */}
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

        {/* ── 10. COOKIES ── */}
        <section id="cookies">
          <h2 className="text-xl font-bold mb-3">Cookies and cookie policy</h2>
          <p className="leading-relaxed mb-3">
            GET CPF uses <strong>essential cookies only</strong>. We do not use tracking, advertising, or analytics cookies of any kind.
          </p>

          <h3 className="text-base font-semibold mt-4 mb-2">Cookies we set</h3>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li>
              <strong>Authentication token (Supabase)</strong>. a first-party cookie that keeps you signed in. Set by our authentication provider, Supabase. This is the only persistent cookie we use — it expires after <strong>7 days</strong>, or immediately when you log out.
            </li>
            <li>
              <strong>Session cookies</strong>. short-lived cookies used during your active session to maintain application state. These expire automatically when you close your browser.
            </li>
            <li>
              <strong>Cookie consent preference</strong>. remembers whether you accepted or declined cookies so we don't show the banner on every visit. Expires after 1 year.
            </li>
          </ul>

          <h3 className="text-base font-semibold mt-4 mb-2">What we do not use</h3>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li>No advertising or marketing cookies</li>
            <li>No third-party tracking cookies</li>
            <li>No analytics cookies (Google Analytics, Meta Pixel, or similar)</li>
            <li>No social media cookies</li>
          </ul>

          <h3 className="text-base font-semibold mt-4 mb-2">How to disable cookies</h3>
          <p className="leading-relaxed text-sm">
            You can disable or delete cookies in your browser settings at any time. Note that disabling the authentication cookie will prevent you from staying logged in. Instructions for common browsers: <a href="https://support.google.com/chrome/answer/95647" className="text-green-800 hover:underline" target="_blank" rel="noopener noreferrer">Chrome</a>, <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" className="text-green-800 hover:underline" target="_blank" rel="noopener noreferrer">Firefox</a>, <a href="https://support.apple.com/en-us/105082" className="text-green-800 hover:underline" target="_blank" rel="noopener noreferrer">Safari</a>.
          </p>

          <p className="leading-relaxed mt-3">
            Questions about our use of cookies? Email us at{" "}
            <a href="mailto:support@getcpf.com" className="text-green-800 hover:underline font-semibold">support@getcpf.com</a>.
          </p>
        </section>

        {/* ── 11. YOUR RIGHTS ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">Your rights</h2>
          <p className="leading-relaxed mb-3">
            Depending on your jurisdiction, you have the following rights regarding your personal data:
          </p>

          <h3 className="text-base font-semibold mt-4 mb-2">All users</h3>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li><strong>Access</strong>. request a copy of all data we hold about you</li>
            <li><strong>Correction</strong>. ask us to fix any inaccurate information</li>
            <li><strong>Deletion</strong>. ask us to delete your account and all associated data</li>
            <li><strong>Portability</strong>. receive your data in a portable format (JSON export available in your dashboard)</li>
            <li><strong>Withdraw consent</strong>. at any time, for any reason</li>
          </ul>

          <h3 className="text-base font-semibold mt-4 mb-2">Brazil (LGPD)</h3>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li>Right to confirmation of the existence of processing (Article 18, I)</li>
            <li>Right to anonymisation, blocking, or deletion of unnecessary data (Article 18, IV)</li>
            <li>Right to information about public and private entities with which data has been shared (Article 18, VII)</li>
            <li>Right to revoke consent (Article 18, IX)</li>
            <li>Right to petition the <strong>ANPD</strong> (Autoridade Nacional de Proteção de Dados). <a href="https://www.gov.br/anpd" className="text-green-800 hover:underline" target="_blank" rel="noopener noreferrer">gov.br/anpd</a></li>
          </ul>

          <h3 className="text-base font-semibold mt-4 mb-2">EU/EEA (GDPR)</h3>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li>Right to restriction of processing (Article 18)</li>
            <li>Right to object to processing (Article 21)</li>
            <li>Right not to be subject to automated decision-making (Article 22). GET CPF does not make automated decisions that produce legal effects concerning you</li>
            <li>Right to lodge a complaint with your national <strong>supervisory authority</strong>. see the <a href="https://www.edpb.europa.eu/about-edpb/about-edpb/members_en" className="text-green-800 hover:underline" target="_blank" rel="noopener noreferrer">EDPB member list</a></li>
          </ul>

          <h3 className="text-base font-semibold mt-4 mb-2">California (CCPA/CPRA)</h3>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li>Right to know what personal information is collected, used, and disclosed</li>
            <li>Right to delete personal information</li>
            <li>Right to opt out of the sale or sharing of personal information. we do not sell or share your data</li>
            <li>Right to limit the use of sensitive personal information. we use passport numbers solely to prepare your CPF application</li>
            <li>Right to non-discrimination for exercising your rights</li>
          </ul>

          <h3 className="text-base font-semibold mt-4 mb-2">South Africa (POPIA)</h3>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li>Right to be notified of data collection (Section 18)</li>
            <li>Right to request correction or deletion (Section 24)</li>
            <li>Right to object to processing (Section 11(3))</li>
            <li>Right to lodge a complaint with the <strong>Information Regulator</strong>. <a href="mailto:enquiries@inforegulator.org.za" className="text-green-800 hover:underline">enquiries@inforegulator.org.za</a></li>
          </ul>

          <p className="leading-relaxed mt-4">
            To exercise any of these rights, email us at{" "}
            <a href="mailto:support@getcpf.com" className="text-green-800 hover:underline font-semibold">support@getcpf.com</a>.
            We will respond within <strong>15 business days</strong> (or sooner where required by law).
          </p>
        </section>

        {/* ── 12. DO NOT SELL ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">Do Not Sell or Share My Personal Information</h2>
          <p className="leading-relaxed">
            GET CPF does <strong>not sell or share</strong> your personal information with third parties for advertising, marketing, or any other commercial purpose. This applies to all users, including California residents under the CCPA/CPRA. Because we do not sell data, there is no need to submit a "Do Not Sell" request. but you may contact us at any time at{" "}
            <a href="mailto:support@getcpf.com" className="text-green-800 hover:underline font-semibold">support@getcpf.com</a> to confirm this.
          </p>
        </section>

        {/* ── 13. AUTOMATED DECISIONS ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">Automated decision-making</h2>
          <p className="leading-relaxed">
            GET CPF does not use your personal data for automated decision-making or profiling that produces legal effects or similarly significantly affects you (GDPR Article 22, LGPD Article 20). Our AI document validation tool assists with document preparation but does not make decisions about your CPF eligibility.
          </p>
        </section>

        {/* ── 14. CHILDREN ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">Children's privacy</h2>
          <p className="leading-relaxed">
            GET CPF is not directed at children under 18. We do not knowingly collect personal data from minors. The CPF application process requires a valid passport, which is typically held by adults. If you believe a minor has provided us with personal data, please contact us immediately and we will delete it.
          </p>
        </section>

        {/* ── 15. DATA TRANSFERS ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">International data transfers</h2>
          <p className="leading-relaxed mb-3">
            Your data is processed and stored on infrastructure located in the <strong>United States</strong> (Supabase Inc., SOC 2 Type II certified). If you are located outside the United States, your data will be transferred internationally. We rely on the following safeguards:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li><strong>LGPD Article 33:</strong> Adequate security guarantees via SOC 2 Type II certification, AES-256 encryption at rest, and TLS encryption in transit</li>
            <li><strong>GDPR Chapter V:</strong> Standard Contractual Clauses (SCCs) incorporated into Supabase's Data Processing Agreement</li>
            <li><strong>POPIA Section 72:</strong> Adequate level of protection provided by the processor's binding commitments</li>
          </ul>
          <p className="leading-relaxed mt-3">By using GET CPF, you acknowledge and consent to this transfer.</p>
        </section>

        {/* ── 16. BREACH ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">Data breach notification</h2>
          <p className="leading-relaxed">
            In the event of a data breach affecting your personal information, GET CPF will:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-sm mt-3">
            <li>Notify the <strong>ANPD</strong> (Brazilian Data Protection Authority) within <strong>3 business days</strong> of becoming aware of the breach, as required by Resolution CD/ANPD No. 15</li>
            <li>Notify relevant <strong>EU supervisory authorities</strong> within <strong>72 hours</strong>, as required by GDPR Article 33</li>
            <li>Notify the <strong>Information Regulator of South Africa</strong> as soon as reasonably possible, as required by POPIA Section 22</li>
            <li>Notify <strong>affected users by email</strong> without undue delay</li>
          </ul>
        </section>

        {/* ── 17. CONTACT ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">Data protection contact</h2>
          <p className="leading-relaxed">
            For any questions, requests, or complaints related to your personal data. including LGPD, GDPR, CCPA, or POPIA enquiries. contact us at:{" "}
            <a href="mailto:support@getcpf.com" className="text-green-800 hover:underline font-semibold">support@getcpf.com</a>
          </p>
          <p className="leading-relaxed mt-3">
            If you are not satisfied with our response, you have the right to lodge a complaint with your local data protection authority (see "Your rights" above for links).
          </p>
        </section>

        {/* ── 18. CHANGES ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">Changes to this policy</h2>
          <p className="leading-relaxed">
            If we make significant changes, we'll update the date at the top and notify you by email. Continued use of GET CPF after the updated policy takes effect constitutes acceptance of the changes.
          </p>
        </section>

        {/* ── 19. RELATED DOCUMENTS ── */}
        <section>
          <h2 className="text-xl font-bold mb-3">Related documents</h2>
          <ul className="list-disc pl-6 space-y-1.5 text-sm">
            <li><Link to="/terms" className="text-green-800 hover:underline font-semibold">Terms of Service</Link></li>
            <li><Link to="/affiliates" className="text-green-800 hover:underline font-semibold">Affiliate Disclosure</Link></li>
          </ul>
        </section>

      </div>
    </main>
    <Footer />
  </div>
);

export default PrivacyPolicy;
