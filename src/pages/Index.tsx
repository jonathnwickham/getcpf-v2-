import { useNavigate } from "react-router-dom";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Transformation from "@/components/Transformation";
import ProductPreview from "@/components/ProductPreview";
import Pricing from "@/components/Pricing";
import TrustStack from "@/components/TrustStack";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import MidCTA from "@/components/MidCTA";
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
        {/* CTA bridge after comparison */}
        <MidCTA onOpenModal={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} text="Ready to skip the headache?" buttonText="See pricing ↓" />
        {/* 3. How It Works (visual) */}
        <ProductPreview />
        {/* 4. Pricing */}
        <Pricing onOpenModal={handleOpenOnboarding} />
        {/* 5. Trust Stack (founder + guarantee) */}
        <TrustStack />
        {/* 6. FAQ */}
        <FAQ />
        {/* 7. Final CTA */}
        <FinalCTA onOpenModal={handleOpenOnboarding} />
      </main>
      <Footer />
      <StickyMobileCTA />
    </div>
  );
};

export default Index;
