import { Check, X } from "lucide-react";
import Logo from "@/components/Logo";

const beforeSteps = [
  "Googled for hours, found conflicting advice",
  "Went to the wrong office, turned away at the door",
  "Missing one document, told to come back next week",
];

const afterSteps = [
  "5-minute questionnaire, personalised pack ready",
  "Exact documents, right office, no surprises",
  "Walk in, walk out with your CPF number",
];

const unlockedItems = [
  { emoji: "🏦", label: "Bank account" },
  { emoji: "🍔", label: "iFood" },
  { emoji: "🏋️", label: "Gym" },
];

const Transformation = () => {
  return (
    <section className="py-24 sm:py-32 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">The difference is preparation</h2>
        </div>

        {/* Single glass container */}
        <div className="bg-white/80 backdrop-blur-xl rounded-xl overflow-hidden border border-gray-100 shadow-xl" style={{ borderTop: '1px solid rgba(255,255,255,0.5)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">

            {/* WITHOUT */}
            <div className="p-8 sm:p-10 lg:p-12">
              <div className="flex items-center gap-3 mb-1">
                <Logo className="h-7 opacity-30 grayscale" />
              </div>
              <h3 className="font-extrabold text-xl mb-1">Without GET CPF</h3>
              <p className="text-sm text-gray-400 mb-8">What most foreigners experience</p>

              {/* Rejected form */}
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-8 max-w-[240px]">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">CPF Form</div>
                <div className="space-y-1.5">
                  <div className="h-2 bg-red-200/60 rounded w-full" />
                  <div className="h-2 bg-red-200/60 rounded w-3/4" />
                  <div className="h-2 bg-red-200/60 rounded w-5/6" />
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-red-500 font-bold text-sm">✕</span>
                  <span className="text-[10px] text-red-500 font-bold tracking-wider uppercase">Rejected</span>
                </div>
              </div>

              <div className="space-y-5 mb-8">
                {beforeSteps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
                      <X className="w-3 h-3 text-red-400" />
                    </div>
                    <p className="text-[15px] text-gray-500">{step}</p>
                  </div>
                ))}
              </div>

              <p className="text-sm text-red-400 italic">2-3 trips. 1-2 weeks. A lot of stress.</p>
            </div>

            {/* WITH */}
            <div className="p-8 sm:p-10 lg:p-12">
              <div className="flex items-center gap-3 mb-1">
                <Logo className="h-7" />
              </div>
              <h3 className="font-extrabold text-xl text-green-800 mb-1">With GET CPF</h3>
              <p className="text-sm text-gray-400 mb-8">What our users experience</p>

              {/* Approved form + unlocked services */}
              <div className="flex items-start gap-3 mb-8">
                <div className="border border-gray-100 rounded-xl p-4 max-w-[180px] shrink-0">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">CPF Form</div>
                  <div className="space-y-1.5">
                    <div className="h-2 bg-gray-200 rounded w-full" />
                    <div className="h-2 bg-gray-200 rounded w-3/4" />
                    <div className="h-2 bg-gray-200 rounded w-5/6" />
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-green-800 font-bold text-sm">✓</span>
                    <span className="text-[10px] text-green-800 font-bold tracking-wider uppercase">Approved</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  {unlockedItems.map((item, i) => (
                    <div key={i} className="bg-white border border-gray-100 rounded-lg px-4 py-2 flex items-center gap-2.5 shadow-sm">
                      <span className="text-base">{item.emoji}</span>
                      <span className="text-sm font-medium flex-1">{item.label}</span>
                      <Check className="w-4 h-4 text-green-800" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-5 mb-8">
                {afterSteps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-800/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-800" />
                    </div>
                    <p className="text-[15px] text-gray-700">{step}</p>
                  </div>
                ))}
              </div>

              <p className="text-sm text-green-800 italic font-medium">1 trip. Same day. Done.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Transformation;
