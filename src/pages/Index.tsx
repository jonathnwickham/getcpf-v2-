import { useNavigate } from "react-router-dom";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PainPoints from "@/components/PainPoints";
import MidCTA from "@/components/MidCTA";
import Transformation from "@/components/Transformation";
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
        <Hero onOpenModal={handleOpenOnboarding} />
        <PainPoints />
        <MidCTA onOpenModal={handleOpenOnboarding} text="Five minutes of prep. One visit. Done." buttonText="Get started →" />
        <Transformation />
        <ProductPreview />
        <WhoIsThisFor />
        <MidCTA onOpenModal={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} text="Ready to skip the headache?" buttonText="See pricing ↓" />
        <Pricing onOpenModal={handleOpenOnboarding} />
        <TrustStack />
        <FAQ />
        <FinalCTA onOpenModal={handleOpenOnboarding} />
      </main>
      <Footer />
      <StickyMobileCTA />
    </div>
  );
};

export default Index;
