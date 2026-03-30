import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PainPoints from "@/components/PainPoints";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import TrustBar from "@/components/TrustBar";
import AfterCPF from "@/components/AfterCPF";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
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
      <PainPoints />
      <HowItWorks />
      <Pricing onOpenModal={handleOpenOnboarding} />
      <AfterCPF />
      <Testimonials />
      <TrustBar />
      <FAQ />
      <FinalCTA onOpenModal={handleOpenOnboarding} />
      <Footer />
    </div>
  );
};

export default Index;
