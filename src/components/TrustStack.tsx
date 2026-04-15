import founderPhoto from "@/assets/founder-jonathan.jpg";

const trustBadges = [
  { icon: "🔒", text: "Your data stays private" },
  { icon: "📋", text: "Official government rules" },
  { icon: "🌍", text: "Works wherever you are" },
];

const TrustStack = () => (
  <section className="py-24 sm:py-32 px-5 sm:px-8 bg-[#0a0f0a] text-white rounded-2xl mx-3 sm:mx-6 mb-3">
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-center text-white mb-16">
        Zero risk. Full refund<br />if it doesn't work.
      </h2>

      <div className="bg-white/[0.06] backdrop-blur-xl rounded-xl p-8 sm:p-10 border border-white/10">
        <div className="flex flex-col md:flex-row items-start gap-8">
          <img
            src={founderPhoto}
            alt="Jonathan Wickham, founder of GET CPF"
            className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover shrink-0 border-2 border-white/20 mx-auto md:mx-0"
            style={{ objectPosition: "center 30%" }}
          />
          <div>
            <blockquote className="text-[15px] text-gray-400 leading-relaxed space-y-4">
              <p>"I come back to Brazil multiple times a year for my girlfriend, and I love it here. But every time I need something, a bank account, Pix, a SIM card, I hit the same wall. You need a CPF. My Portuguese is getting there, but it's not enough. Not for government forms, not for figuring out which office to go to and what to bring.</p>
              <p className="text-white font-medium">After getting it wrong more than once, I wrote everything down and turned it into this. The language is already hard enough. Your CPF shouldn't be."</p>
            </blockquote>
            <p className="mt-5 text-sm font-semibold text-white">🇿🇦 Jonathan Wickham · São Paulo</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-10 md:gap-14 flex-wrap mt-14 pt-10 border-t border-white/10">
        {trustBadges.map((item) => (
          <div key={item.text} className="flex items-center gap-2 text-sm text-gray-400">
            <span className="text-lg">{item.icon}</span> {item.text}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustStack;
