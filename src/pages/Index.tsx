import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SocialProofBar from "@/components/SocialProofBar";
import PainPoints from "@/components/PainPoints";
import WhoIsThisFor from "@/components/WhoIsThisFor";
import HowItWorks from "@/components/HowItWorks";
import Transformation from "@/components/Transformation";
import ScamObjection from "@/components/ScamObjection";
import Pricing from "@/components/Pricing";
import TrustBar from "@/components/TrustBar";
import AfterCPF from "@/components/AfterCPF";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import ComingSoon from "@/components/ComingSoon";
import Footer from "@/components/Footer";

const Index = () => {
  const navigate = useNavigate();

  const handleOpenOnboarding = () => {
    navigate("/pricing");
  };

  // Service schema JSON-LD
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "GET CPF",
      "description": "CPF preparation service for foreigners in Brazil",
      "provider": {
        "@type": "Organization",
        "name": "GET CPF",
      },
      "areaServed": "BR",
      "offers": {
        "@type": "Offer",
        "price": "49",
        "priceCurrency": "USD",
      },
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);
    script.id = "service-schema";
    document.head.appendChild(script);
    return () => { document.getElementById("service-schema")?.remove(); };
  }, []);

  return (
    <div className="overflow-x-hidden">
      <Navbar onOpenModal={handleOpenOnboarding} />
      <Hero onOpenModal={handleOpenOnboarding} />
      <SocialProofBar />
      <PainPoints />
      {/* Mid-page CTA after pain is felt */}
      <MidCTA onOpenModal={handleOpenOnboarding} text="Stop stressing — get your CPF sorted today" buttonText="Get started →" />
      <WhoIsThisFor />
      <HowItWorks />
      <Transformation />
      {/* CTA after showing the transformation */}
      <MidCTA onOpenModal={handleOpenOnboarding} text="Ready to skip the headache?" buttonText="See pricing →" />
      <AfterCPF />
      <Testimonials />
      <TrustBar />
      <ScamObjection />
      <Pricing onOpenModal={handleOpenOnboarding} />
      {/* CTA after pricing for undecided visitors */}
      <FAQ />
      <FinalCTA onOpenModal={handleOpenOnboarding} />
      <ComingSoon />
      <Footer />
    </div>
  );
};

export default Index;
