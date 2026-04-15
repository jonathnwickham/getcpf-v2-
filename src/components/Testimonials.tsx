import founderPhoto from "@/assets/founder-jonathan.jpg";
import { Shield } from "lucide-react";

const Testimonials = () => {
  return (
    <section className="py-14 md:py-24 px-6 md:px-8 bg-gray-50">
      <div className="max-w-[700px] mx-auto">
        <div className="text-center mb-10">
          <div className="text-xs uppercase tracking-[3px] text-green-800 font-bold mb-4">Our guarantee</div>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tight">
            Zero risk. Full refund if it does not work.
          </h2>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-8 md:p-10 text-center">
          <img
            src={founderPhoto}
            alt="Jonathan Wickham, founder of GET CPF"
            className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-2 border-primary/20"
            style={{ objectPosition: "center 42%" }}
          />
          <div className="font-bold text-base mb-1">Jonathan Wickham</div>
          <div className="text-xs text-gray-500 mb-6">🇿🇦 South African · São Paulo</div>

          <blockquote className="text-sm text-gray-500 leading-relaxed italic max-w-[520px] mx-auto">
            "I built this because I needed it myself and could not find anything like it. If you follow the steps and still get rejected at the counter, I will refund you in full. No questions, no process, no waiting. That is my personal guarantee."
          </blockquote>

          <div className="flex items-center justify-center gap-2 mt-6 text-green-800">
            <Shield className="w-5 h-5" />
            <span className="text-sm font-semibold">Full refund guarantee, backed by the founder personally</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
