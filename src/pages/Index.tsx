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
import { useScrollReveal } from "@/hooks/useScrollReveal";

const cpfPills = [
  "🏦 Bank account", "📱 Phone plan", "🍔 iFood", "🏠 Rent an apartment",
  "💸 Pix payments", "🏋️ Gym", "🛍️ Mercado Livre", "🏥 Health insurance",
  "🚗 Uber / 99", "📦 Amazon BR",
];

const Index = () => {
  const navigate = useNavigate();
  useScrollReveal();

  const handleOpenOnboarding = () => {
    navigate("/pricing");
  };

  return (
    <div className="overflow-x-hidden bg-white">
      <SEO />
      <Navbar onOpenModal={handleOpenOnboarding} />
      <main id="main-content">
        {/* 1. Hero */}
        <Hero onOpenModal={handleOpenOnboarding} />

        {/* 2. Dark section — No CPF? Good luck. */}
        <section className="reveal-on-scroll bg-[#0a0f0a] text-white py-24 sm:py-32 px-5 sm:px-8 rounded-2xl mx-3 sm:mx-6 mb-3">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs uppercase tracking-[3px] text-green-400 font-bold mb-4">Why every foreigner needs one</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">No CPF?<br />Good luck.</h2>
            <p className="text-gray-400 mt-5 max-w-xl mx-auto leading-relaxed">
              Whether you're here for two weeks or two years. Opening a bank account, ordering food, getting a SIM card, renting an apartment. It all starts with your CPF.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-10">
              {cpfPills.map((pill, i) => (
                <span key={pill} className={`reveal-on-scroll delay-${Math.min(i % 3 + 1, 3) as 1 | 2 | 3} bg-white/[0.06] backdrop-blur-xl rounded-full px-5 py-2.5 text-sm text-gray-300 border border-white/10 hover-lift cursor-default`}>
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </section>


        {/* 4. Before / After */}
        <div className="reveal-on-scroll">
          <Transformation />
        </div>

        {/* 5. CTA bridge */}
        <div className="reveal-on-scroll">
          <MidCTA
            onOpenModal={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            text="Ready to skip the headache?"
            buttonText="See pricing"
          />
        </div>

        {/* 6. How It Works */}
        <div className="reveal-on-scroll">
          <ProductPreview />
        </div>

        {/* 7. Pricing */}
        <div className="reveal-on-scroll">
          <Pricing onOpenModal={handleOpenOnboarding} />
        </div>

        {/* 8. Founder + Trust */}
        <div className="reveal-on-scroll">
          <TrustStack />
        </div>

        {/* 9. FAQ */}
        <div className="reveal-on-scroll">
          <FAQ />
        </div>

        {/* 10. Final CTA */}
        <div className="reveal-on-scroll">
          <FinalCTA onOpenModal={handleOpenOnboarding} />
        </div>
      </main>
      <Footer />
      <StickyMobileCTA />
    </div>
  );
};

export default Index;
