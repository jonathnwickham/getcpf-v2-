import { useNavigate } from "react-router-dom";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Transformation from "@/components/Transformation";
import MidCTA from "@/components/MidCTA";
import JourneySteps from "@/components/JourneySteps";
import PainPoints from "@/components/PainPoints";
import ProductPreview from "@/components/ProductPreview";
import WhoIsThisFor from "@/components/WhoIsThisFor";
import Pricing from "@/components/Pricing";
import TrustStack from "@/components/TrustStack";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";

const Index = () => {
  const navigate = useNavigate();

  const handleOpenOnboarding = () => {
    navigate("/pricing");
  };

  return (
    <div className="overflow-x-hidden">
      <SEO />
      <Navbar onOpenModal={handleOpenOnboarding} />
      <main id="main-content">
        {/* 1. Hero */}
        <Hero onOpenModal={handleOpenOnboarding} />
        {/* 2. With/Without Comparison */}
        <Transformation />
        {/* 3. 4-step journey (standalone) */}
        <JourneySteps />
        {/* 4. Problem cards */}
        <PainPoints />
        <MidCTA onOpenModal={handleOpenOnboarding} text="Five minutes of prep. One visit. Done." buttonText="Get started →" />
        {/* 5. How It Works (visual) */}
        <ProductPreview />
        {/* 6. Who Is This For */}
        <WhoIsThisFor />
        <MidCTA onOpenModal={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} text="Ready to skip the headache?" buttonText="See pricing ↓" />
        {/* 7. Pricing */}
        <Pricing onOpenModal={handleOpenOnboarding} />
        {/* 8. Trust Stack */}
        <TrustStack />
        {/* 9. FAQ */}
        <FAQ />
        {/* 10. Final CTA */}
        <FinalCTA onOpenModal={handleOpenOnboarding} />
      </main>
      <Footer />
      <StickyMobileCTA />
    </div>
  );
};

export default Index;
