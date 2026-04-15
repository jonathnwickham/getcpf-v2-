import { useEffect } from "react";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { guides } from "@/lib/guides-data";

const categoryColors: Record<string, string> = {
  "Getting started": "bg-green-800/10 text-green-800",
  "City guides": "bg-blue-500/10 text-blue-600",
  "Troubleshooting": "bg-amber-500/10 text-amber-600",
  "Reviews": "bg-emerald-500/10 text-emerald-600",
};

const Guides = () => {
  return (
    <div className="min-h-screen bg-white">
      <SEO title="CPF Guides for Foreigners. GET CPF" description="Free guides on getting your Brazilian CPF as a foreigner. Step-by-step instructions, city-specific tips, and troubleshooting." path="/guides" />
      <Navbar />
      <main className="pt-24 md:pt-32 pb-16 md:pb-24 px-6">
        <div className="max-w-[800px] mx-auto">
          <h1 className="text-[clamp(2rem,5vw,3rem)] font-extrabold tracking-tight">
            CPF Guides
          </h1>
          <p className="text-gray-500 mt-3 text-base leading-relaxed max-w-[560px]">
            Everything you need to know about getting your Brazilian CPF. Written by someone who's been through it.
          </p>

          <div className="mt-12 space-y-4">
            {guides.map((guide) => (
              <Link
                key={guide.slug}
                to={`/guides/${guide.slug}`}
                className="block bg-white border border-gray-100 rounded-xl p-6 hover:border-green-800/30 hover:shadow-md hover:shadow-green-800/5 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl shrink-0">{guide.heroEmoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`text-[13px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${categoryColors[guide.category] || "bg-gray-50 text-gray-500"}`}>
                        {guide.category}
                      </span>
                      <span className="text-[13px] text-gray-500">{guide.readTime}</span>
                    </div>
                    <h2 className="text-base font-bold text-gray-900 group-hover:text-green-800 transition-colors leading-snug">
                      {guide.title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1.5 leading-relaxed line-clamp-2">
                      {guide.metaDescription}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-16 text-center bg-green-800/5 border border-green-800/10 rounded-2xl p-8">
            <p className="text-sm text-gray-500 mb-1">Done reading?</p>
            <h3 className="text-xl font-bold">Ready to get your CPF?</h3>
            <p className="text-sm text-gray-500 mt-2 mb-6 max-w-[400px] mx-auto">
              We prepare everything so your office visit works first time. 5 minutes of setup, one visit, done.
            </p>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 bg-green-800 text-white px-8 py-3.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-green-800/20"
            >
              Get started, <span className="line-through opacity-60">$49</span> $29 →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Guides;
