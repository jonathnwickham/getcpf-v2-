import { useNavigate } from "react-router-dom";

const ProductPreview = () => {
  const navigate = useNavigate();

  return (
    <section id="how" className="py-24 sm:py-32 px-5 sm:px-8 bg-white rounded-2xl mx-3 sm:mx-6 mb-3">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Three steps. Five minutes.</h2>
          <p className="text-gray-500 mt-5 max-w-xl mx-auto leading-relaxed">
            You fill in one form. We organise the rest.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {[
            { num: "1", title: "Answer a few questions", desc: "Your nationality, visa type, which state you're in." },
            { num: "2", title: "Get your Ready Pack", desc: "Pre-filled forms, the right office, a Portuguese cheat sheet, all personalised." },
            { num: "3", title: "Walk in, walk out", desc: "Show up with everything correct. Get your CPF the same day." },
          ].map((step) => (
            <div key={step.num} className="bg-white/80 backdrop-blur-xl rounded-xl p-8 text-center border border-gray-100 hover-lift">
              <div className="text-4xl font-extrabold text-green-800 mb-4">{step.num}</div>
              <h3 className="font-bold text-base mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Feature callouts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            "AI checks your documents. Know before you go that everything is correct",
            "We tell you exactly where to go, what to say, and what to bring",
            "Every step translated into Portuguese. No surprises at the counter",
          ].map((text) => (
            <div key={text} className="bg-white/80 backdrop-blur-xl rounded-xl p-6 border border-gray-100 hover-lift">
              <span className="text-green-800 font-bold text-lg">✓</span>
              <p className="text-sm text-gray-700 mt-2">{text}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <button
            onClick={() => navigate("/pricing")}
            className="bg-green-800 text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-green-900 transition-all btn-press"
          >
            Get started · <s className="opacity-50">$49</s> $29
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductPreview;
