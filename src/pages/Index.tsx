import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PainPoints from "@/components/PainPoints";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import TrustBar from "@/components/TrustBar";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import SignupModal from "@/components/SignupModal";

const Index = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="overflow-x-hidden">
      <Navbar onOpenModal={() => setModalOpen(true)} />
      <Hero onOpenModal={() => setModalOpen(true)} />
      <PainPoints />
      <HowItWorks />
      <Pricing onOpenModal={() => setModalOpen(true)} />
      <TrustBar />
      <FAQ />
      <FinalCTA onOpenModal={() => setModalOpen(true)} />
      <Footer />
      <SignupModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Index;
