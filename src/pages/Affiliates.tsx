import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Affiliates = () => (
  <div className="overflow-x-hidden">
    <SEO title="Affiliate Disclosure — GET CPF" description="GET CPF affiliate disclosure and partnership transparency information." path="/affiliates" />
    <Navbar />
    <div className="min-h-screen bg-background pt-28 pb-16 px-6">
      <div className="max-w-[700px] mx-auto">
        <h1 className="text-3xl font-extrabold mb-6">Affiliate Disclosure</h1>
        <div className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-muted-foreground">
          <p className="text-foreground font-medium">Last updated: 29 March 2026</p>

          <p>
            GET CPF participates in affiliate programmes with select partners whose services
            we believe genuinely help foreigners living in or moving to Brazil.
          </p>

          <h2 className="text-foreground text-lg font-bold mt-8">What this means</h2>
          <p>
            Some links on this website — particularly in the <strong>Life in Brazil</strong> and{" "}
            <strong>Partners</strong> sections of your Ready Pack — are affiliate links. If you
            click on one and sign up for the recommended service, we may receive a small commission
            at no extra cost to you.
          </p>

          <h2 className="text-foreground text-lg font-bold mt-8">Our commitment</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>We only recommend services we have personally used or thoroughly vetted.</li>
            <li>Affiliate partnerships never influence our recommendations. If a service isn't good, we don't list it — regardless of commission.</li>
            <li>The price you pay is always the same whether you use our link or go directly.</li>
          </ul>

          <h2 className="text-foreground text-lg font-bold mt-8">Current partners</h2>
          <p>Our affiliate partners currently include services for international money transfers, travel insurance, eSIMs, language learning, and VPNs.</p>

          <h2 className="text-foreground text-lg font-bold mt-8">Questions?</h2>
          <p>
            If you have any questions about our affiliate relationships, contact us at{" "}
            <a href="mailto:jonathan@getcpf.com" className="text-primary hover:underline font-semibold">
              jonathan@getcpf.com
            </a>.
          </p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default Affiliates;
