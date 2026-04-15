import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
import FadeIn, { FadeInStagger, FadeInChild } from "@/components/FadeIn";

const cpfPills = [
  "🏦 Bank account", "📱 Phone plan", "🍔 iFood", "🏠 Rent an apartment",
  "💸 Pix payments", "🏋️ Gym", "🛍️ Mercado Livre", "🏥 Health insurance",
  "🚗 Uber / 99", "📦 Amazon BR",
];

const Index = () => {
  const navigate = useNavigate();

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

        {/* 2. Dark section. No CPF? Good luck. */}
        <FadeIn>
          <section className="bg-[#0a0f0a] text-white py-24 sm:py-32 px-5 sm:px-8 rounded-2xl mx-3 sm:mx-6 mb-3">
            <div className="max-w-4xl mx-auto text-center">
              <FadeIn delay={0.1}>
                <p className="text-xs uppercase tracking-[3px] text-green-400 font-bold mb-4">Why every foreigner needs one</p>
              </FadeIn>
              <FadeIn delay={0.2}>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">No CPF?<br />Good luck.</h2>
              </FadeIn>
              <FadeIn delay={0.3}>
                <p className="text-gray-400 mt-5 max-w-xl mx-auto leading-relaxed">
                  Whether you're here for two weeks or two years. Opening a bank account, ordering food, getting a SIM card, renting an apartment. It all starts with your CPF.
                </p>
              </FadeIn>
              <FadeInStagger className="flex flex-wrap justify-center gap-3 mt-10">
                {cpfPills.map((pill) => (
                  <FadeInChild key={pill}>
                    <span className="bg-white/[0.06] backdrop-blur-xl rounded-full px-5 py-2.5 text-sm text-gray-300 border border-white/10 hover-lift cursor-default inline-block">
                      {pill}
                    </span>
                  </FadeInChild>
                ))}
              </FadeInStagger>
            </div>
          </section>
        </FadeIn>

        {/* 3. Before / After */}
        <FadeIn>
          <Transformation />
        </FadeIn>

        {/* 4. CTA bridge */}
        <FadeIn>
          <MidCTA
            onOpenModal={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            text="Ready to skip the headache?"
            buttonText="See pricing"
          />
        </FadeIn>

        {/* 5. How It Works */}
        <FadeIn>
          <ProductPreview />
        </FadeIn>

        {/* 6. Pricing */}
        <FadeIn>
          <Pricing onOpenModal={handleOpenOnboarding} />
        </FadeIn>

        {/* 7. Founder + Trust */}
        <FadeIn>
          <TrustStack />
        </FadeIn>

        {/* 8. FAQ */}
        <FadeIn>
          <FAQ />
        </FadeIn>

        {/* 9. Final CTA */}
        <FadeIn>
          <FinalCTA onOpenModal={handleOpenOnboarding} />
        </FadeIn>
      </main>
      <Footer />
      <StickyMobileCTA />
    </div>
  );
};

export default Index;
