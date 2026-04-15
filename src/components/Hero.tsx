import { useNavigate } from "react-router-dom";
import nubank from "@/assets/logos/nubank.png";
import ifood from "@/assets/logos/ifood.png";
import mercadolivre from "@/assets/logos/mercadolivre.png";
import rappi from "@/assets/logos/rappi.png";
import vivo from "@/assets/logos/vivo.png";
import quintoandar from "@/assets/logos/quintoandar.png";
import amazon from "@/assets/logos/amazon.png";
import correios from "@/assets/logos/correios.png";

interface HeroProps {
  onOpenModal?: () => void;
}

const logos = [
  { src: nubank, alt: "Nubank" },
  { src: ifood, alt: "iFood" },
  { src: mercadolivre, alt: "Mercado Livre" },
  { src: rappi, alt: "Rappi" },
  { src: vivo, alt: "Vivo" },
  { src: quintoandar, alt: "QuintoAndar" },
  { src: amazon, alt: "Amazon" },
  { src: correios, alt: "Correios" },
];

const Hero = ({ onOpenModal }: HeroProps) => {
  const navigate = useNavigate();

  const handleCTA = () => {
    if (onOpenModal) onOpenModal();
    else navigate("/pricing");
  };

  return (
    <>
      {/* Hero — clean, one message */}
      <section className="pt-32 sm:pt-40 pb-20 sm:pb-24 px-5 sm:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 border border-gray-300 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 bg-green-800 rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Beta is live</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-[4.5rem] font-extrabold leading-[1.02] tracking-tight">
            Get your Brazilian <span className="text-green-800">CPF</span> without the headache
          </h1>

          <p className="text-lg text-gray-500 mt-6 leading-relaxed max-w-lg mx-auto">
            Everything foreigners in Brazil need to get their CPF on the first try. Five minutes of preparation. One visit. Done.
          </p>

          <div className="mt-8">
            <button
              onClick={handleCTA}
              className="bg-green-800 text-white px-9 py-4 rounded-full font-semibold text-lg hover:bg-green-900 transition-all btn-press hover-glow inline-flex items-center justify-center gap-2"
            >
              Get started · <s className="opacity-50">$49</s> $29
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </button>
            <p className="text-sm text-gray-400 mt-3">No Portuguese required. Money-back guarantee.</p>
          </div>

          {/* Brand logos — indirect credibility */}
          <div className="mt-12">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-5">Your CPF unlocks</p>
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 opacity-60 hover:opacity-100 transition-opacity duration-500">
              {logos.map((logo) => (
                <img key={logo.alt} src={logo.src} alt={logo.alt} className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats + Product mockup — below the fold */}
      <section className="py-16 px-5 sm:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-12 sm:gap-20 mb-16">
            <div className="text-center">
              <div className="text-2xl font-extrabold tracking-tight">5 min</div>
              <div className="text-xs text-gray-400 mt-1">Setup time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold tracking-tight">R$7</div>
              <div className="text-xs text-gray-400 mt-1">At Correios</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold tracking-tight">Same day</div>
              <div className="text-xs text-gray-400 mt-1">When you go in</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold tracking-tight">50+</div>
              <div className="text-xs text-gray-400 mt-1">Nationalities</div>
            </div>
          </div>

          {/* Product mockup in laptop frame */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-900 rounded-xl p-1.5" style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.12)' }}>
              <div className="bg-gray-800 rounded-t-lg px-4 py-2.5 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-600" />
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-600" />
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-600" />
                </div>
                <div className="flex-1 bg-gray-700 rounded px-3 py-1 text-[10px] text-gray-400 text-center mx-8">getcpf.com/ready-pack</div>
              </div>
              <div className="bg-white rounded-b-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="font-bold text-sm">Your Ready Pack</div>
                  <span className="text-[10px] bg-green-800 text-white px-2 py-0.5 rounded-full font-semibold">75% complete</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { icon: "📋", title: "Pre-filled forms", sub: "Ready" },
                    { icon: "📍", title: "Nearest office", sub: "CAC Bela Vista" },
                    { icon: "🗣️", title: "What to say", sub: "Portuguese" },
                    { icon: "✅", title: "Doc checklist", sub: "3 of 4" },
                  ].map((item) => (
                    <div key={item.title} className="border border-gray-100 rounded-lg p-3 text-center">
                      <div className="text-lg mb-1">{item.icon}</div>
                      <div className="text-[10px] font-semibold leading-tight">{item.title}</div>
                      <div className="text-[9px] text-gray-400">{item.sub}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-800 rounded-full w-3/4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
