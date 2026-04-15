import founderPhoto from "@/assets/founder-jonathan.jpg";

const personas = [
  {
    emoji: "💻",
    title: "Digital nomads",
    desc: "Working remotely from Brazil? You need a CPF to open a bank account, get a local SIM, and sign up for coworking spaces.",
  },
  {
    emoji: "🏠",
    title: "Expats settling in",
    desc: "Renting an apartment, setting up utilities, getting health insurance. None of it works without a CPF.",
  },
  {
    emoji: "✈️",
    title: "Moving for work",
    desc: "Your employer needs your CPF for payroll. HR won't wait while you figure out the bureaucracy.",
  },
  {
    emoji: "❤️",
    title: "Partners & spouses",
    desc: "Moved for love? A CPF lets you build a life here. Joint accounts, car insurance, even a gym membership.",
  },
  {
    emoji: "🎓",
    title: "Students",
    desc: "Brazilian universities require a CPF for enrollment. Get it sorted before classes start, not during.",
  },
  {
    emoji: "🏖️",
    title: "Travellers & visitors",
    desc: "Even on a tourist visa, a CPF lets you buy a local SIM, use Pix, order on iFood, and skip gringo prices.",
  },
];

const WhoIsThisFor = () => (
  <section className="py-24 px-8 bg-gray-50">
    <div className="max-w-[1100px] mx-auto">
      <div className="text-xs uppercase tracking-[3px] text-green-800 font-bold mb-4">Who is this for</div>
      <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tight">
        If you're a foreigner in Brazil, this is for you
      </h2>
      <p className="text-gray-500 mt-4 max-w-[560px] text-sm leading-relaxed">
        It doesn't matter why you're here. If you need a CPF and don't want to waste a day figuring it out, we've got you.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
        {personas.map((p) => (
          <div
            key={p.title}
            className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-green-800/30 hover:shadow-md transition-all"
          >
            <div className="text-3xl mb-3">{p.emoji}</div>
            <h3 className="font-bold text-base mb-1.5">{p.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>

      {/* Founder story */}
      <div className="mt-16 bg-white border border-gray-100 rounded-2xl p-8 md:p-10">
        <div className="flex items-start gap-4 mb-5">
          <img
            src={founderPhoto}
            alt="Jonathan Wickham, founder of GET CPF"
            className="w-14 h-14 rounded-full object-cover shrink-0 border-2 border-primary/20" style={{ objectPosition: "center 42%" }}
          />
          <div>
            <div className="text-xs uppercase tracking-[2px] text-green-800 font-bold mb-1">Founder Story</div>
            <h3 className="font-bold text-base">Why I built this</h3>
            <p className="text-xs text-gray-500">Jonathan Wickham · 🇿🇦 South African</p>
          </div>
        </div>
        <div className="space-y-4 text-sm text-gray-500 leading-relaxed">
          <p>
            I fell in love with Brazil, met my girlfriend, and now I come back as often as I can.
          </p>
          <p>
            When I needed my CPF I spent days jumping between government sites, Reddit threads, and AI tools
            that each gave me half the answer but none of the context. I had to piece it all together myself
            and I still nearly got it wrong.
          </p>
          <p>
            So I documented every step, built it into a tool, and got my CPF on my first try using what I'd created.
          </p>
          <p>
            That was the test. If it worked for me, it would work for anyone. So I cleaned it up, priced it fairly, and put it out there.
          </p>
          <p className="text-gray-900 font-medium">
            Now you get the version I wish I had.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default WhoIsThisFor;
