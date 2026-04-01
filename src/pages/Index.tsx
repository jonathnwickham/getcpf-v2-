import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SocialProofBar from "@/components/SocialProofBar";
import PainPoints from "@/components/PainPoints";
import WhoIsThisFor from "@/components/WhoIsThisFor";
import HowItWorks from "@/components/HowItWorks";
import ProductPreview from "@/components/ProductPreview";
import Transformation from "@/components/Transformation";

import Pricing from "@/components/Pricing";
import TrustBar from "@/components/TrustBar";
import AfterCPF from "@/components/AfterCPF";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import MidCTA from "@/components/MidCTA";

import Footer from "@/components/Footer";

const Index = () => {
  const navigate = useNavigate();

  const handleOpenOnboarding = () => {
    navigate("/pricing");
  };

  return (
    <div className="overflow-x-hidden">
      <Navbar onOpenModal={handleOpenOnboarding} />
      <Hero onOpenModal={handleOpenOnboarding} />
      <SocialProofBar />
      <PainPoints />
      {/* Mid-page CTA after pain is felt */}
      <MidCTA onOpenModal={handleOpenOnboarding} text="Five minutes of prep. One visit. Done." buttonText="Get started →" />
      <WhoIsThisFor />
      <HowItWorks />
      <ProductPreview />
      <Transformation />
      {/* CTA after showing the transformation */}
      <MidCTA onOpenModal={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} text="Ready to skip the headache?" buttonText="See pricing ↓" />
      <AfterCPF />
      <Testimonials />
      <TrustBar />
      
      <Pricing onOpenModal={handleOpenOnboarding} />
      {/* CTA after pricing for undecided visitors */}
      <FAQ />
      <FinalCTA onOpenModal={handleOpenOnboarding} />
      
      <Footer />
    </div>
  );
};

export default Index;
