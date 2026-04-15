import { useParams, Link, Navigate } from "react-router-dom";
import { useEffect } from "react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getGuideBySlug, guides } from "@/lib/guides-data";

const GuideDetail = () => {
  const { slug } = useParams();
  const guide = slug ? getGuideBySlug(slug) : undefined;

  // Inject FAQ + HowTo JSON-LD schema
  useEffect(() => {
    if (!guide) return;
    const faqItems = guide.sections
      .filter(s => s.heading !== "The fastest way to get this right first time")
      .map(s => ({
        "@type": "Question",
        name: s.heading,
        acceptedAnswer: {
          "@type": "Answer",
          text: s.content.replace(/\*\*/g, "").slice(0, 500),
        },
      }));

    const schemas: any[] = [];

    if (faqItems.length > 0) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems,
      });
    }

    if (guide.slug === "how-to-get-cpf-brazil-foreigner") {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "How to Get a CPF in Brazil as a Foreigner",
        description: guide.metaDescription,
        step: guide.sections
          .filter(s => s.heading !== "The fastest way to get this right first time")
          .map((s, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: s.heading,
            text: s.content.replace(/\*\*/g, "").slice(0, 300),
          })),
      });
    }

    const scriptEl = document.createElement("script");
    scriptEl.type = "application/ld+json";
    scriptEl.id = "guide-schema";
    scriptEl.textContent = JSON.stringify(schemas);
    document.head.appendChild(scriptEl);

    // SEO is handled by <SEO> component now

    return () => {
      const el = document.getElementById("guide-schema");
      if (el) el.remove();
    };
  }, [guide]);

  if (!guide) return <Navigate to="/guides" replace />;

  const otherGuides = guides.filter((g) => g.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <SEO title={`${guide.title}. GET CPF`} description={guide.metaDescription} path={`/guides/${guide.slug}`} />
      <Navbar />
      <article className="pt-32 pb-24 px-6">
        <div className="max-w-[700px] mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 min-h-[44px]">
            <Link to="/guides" className="hover:text-gray-900 transition-colors py-2 min-h-[44px] inline-flex items-center">Guides</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium line-clamp-1">{guide.category}</span>
          </nav>

          {/* Header */}
          <div className="mb-10">
            <span className="text-4xl">{guide.heroEmoji}</span>
            <h1 className="text-[clamp(1.6rem,4vw,2.4rem)] font-extrabold tracking-tight leading-tight mt-4">
              {guide.title}
            </h1>
            <div className="flex items-center gap-3 mt-4 text-[13px] text-gray-500">
              <span>Updated {guide.updatedDate}</span>
              <span>·</span>
              <span>{guide.readTime}</span>
            </div>
            {guide.attribution && (
              <div className="mt-4 inline-flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-[13px] text-gray-500">
                <span>✨</span>
                <span>{guide.attribution}</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-10">
            {guide.sections.map((section, i) => (
              <section key={i}>
                <h2 className="text-xl font-bold tracking-tight mb-3">{section.heading}</h2>
                <div className="text-sm text-gray-500 leading-relaxed whitespace-pre-line prose-strong:text-gray-900 prose-strong:font-semibold">
                  {section.content.split(/(<table[\s\S]*?<\/table>)/).map((chunk, ci) =>
                    chunk.startsWith("<table") ? (
                      <div
                        key={ci}
                        className="my-6 overflow-x-auto rounded-xl border border-gray-100 [&_table]:w-full [&_table]:text-sm [&_th]:bg-gray-50 [&_th]:px-4 [&_th]:py-2.5 [&_th]:text-left [&_th]:font-semibold [&_th]:text-gray-900 [&_td]:px-4 [&_td]:py-2.5 [&_td]:border-t [&_td]:border-gray-100 [&_td]:text-gray-500"
                        dangerouslySetInnerHTML={{ __html: chunk }}
                      />
                    ) : (
                      chunk.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
                        part.startsWith("**") && part.endsWith("**") ? (
                          <strong key={`${ci}-${j}`} className="text-gray-900 font-semibold">
                            {part.slice(2, -2)}
                          </strong>
                        ) : (
                          <span key={`${ci}-${j}`}>{part}</span>
                        )
                      )
                    )
                  )}
                </div>
              </section>
            ))}
          </div>

          {/* DIY vs Ready Pack comparison */}
          <div className="mt-16 bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="px-6 pt-6 pb-3">
              <p className="text-sm text-gray-500 text-center">
                You can absolutely do this yourself. Here is what that looks like compared to having us prepare everything.
              </p>
            </div>
            <div className="grid grid-cols-2">
              <div className="p-6 border-r border-t border-gray-100">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Do it yourself</div>
                <ul className="space-y-3">
                  {[
                    "Research which office accepts foreigners",
                    "Figure out proof of address requirements",
                    "Find and fill the correct form",
                    "Hope your mother's name format is right",
                    "Translate Portuguese instructions yourself",
                    "Wing it at the counter",
                    "If rejected, start over",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-gray-500 leading-relaxed">
                      <span className="text-gray-300 shrink-0 mt-0.5">○</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 bg-green-800/[0.03] border-t border-gray-100">
                <div className="text-xs font-bold uppercase tracking-wider text-green-800 mb-4">Ready Pack (<span className="line-through">$49</span> $29)</div>
                <ul className="space-y-3">
                  {[
                    "Correct office auto-selected for your city",
                    "Proof of address sorted for your situation",
                    "Forms pre-filled with your details",
                    "AI scanner catches name errors before you go",
                    "Portuguese cheat sheet for the counter",
                    "Know exactly what to say and do",
                    "If it doesn't work, full refund",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-gray-900 leading-relaxed">
                      <span className="text-green-800 font-bold shrink-0 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center py-8">
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 bg-green-800 text-white px-8 py-3.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-green-800/20"
            >
              Get My CPF Pack. <span className="line-through opacity-60">$49</span> $29 →
            </Link>
          </div>

          {/* CTA Block */}
          <div className="mt-16 bg-green-800/5 border border-green-800/20 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-extrabold tracking-tight mb-2">Ready to get your CPF?</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto leading-relaxed">
              We prepare everything for your specific situation. documents, office, phrases. so you walk in and walk out with your CPF.
            </p>
            <Link
              to="/pricing"
              className="inline-block bg-green-800 text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-green-800/20"
            >
              Get started. <span className="line-through opacity-60">$49</span> $29 →
            </Link>
            <p className="text-xs text-gray-500 mt-3">100% acceptance guarantee or your money back</p>
          </div>

          {/* More guides */}
          {otherGuides.length > 0 && (
            <div className="mt-16">
              <h3 className="text-lg font-bold mb-4">More guides</h3>
              <div className="space-y-3">
                {otherGuides.map((g) => (
                  <Link
                    key={g.slug}
                    to={`/guides/${g.slug}`}
                    className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl hover:border-green-800/30 transition-all group"
                  >
                    <span className="text-2xl">{g.heroEmoji}</span>
                    <div>
                      <h4 className="text-sm font-semibold group-hover:text-green-800 transition-colors">{g.title}</h4>
                      <p className="text-[13px] text-gray-500">{g.readTime}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
      <Footer />
    </div>
  );
};

export default GuideDetail;
