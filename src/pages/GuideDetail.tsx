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

    document.title = `${guide.title} — GET CPF`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", guide.metaDescription);

    return () => {
      const el = document.getElementById("guide-schema");
      if (el) el.remove();
    };
  }, [guide]);

  if (!guide) return <Navigate to="/guides" replace />;

  const otherGuides = guides.filter((g) => g.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <article className="pt-32 pb-24 px-6">
        <div className="max-w-[700px] mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8 min-h-[44px]">
            <Link to="/guides" className="hover:text-foreground transition-colors py-2 min-h-[44px] inline-flex items-center">Guides</Link>
            <span>/</span>
            <span className="text-foreground font-medium line-clamp-1">{guide.category}</span>
          </nav>

          {/* Header */}
          <div className="mb-10">
            <span className="text-4xl">{guide.heroEmoji}</span>
            <h1 className="text-[clamp(1.6rem,4vw,2.4rem)] font-extrabold tracking-tight leading-tight mt-4">
              {guide.title}
            </h1>
            <div className="flex items-center gap-3 mt-4 text-xs text-muted-foreground">
              <span>Updated {guide.updatedDate}</span>
              <span>·</span>
              <span>{guide.readTime}</span>
            </div>
            {guide.attribution && (
              <div className="mt-4 inline-flex items-center gap-2 bg-muted/60 border border-border rounded-lg px-3 py-1.5 text-xs text-muted-foreground">
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
                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line prose-strong:text-foreground prose-strong:font-semibold">
                  {section.content.split(/(<table[\s\S]*?<\/table>)/).map((chunk, ci) =>
                    chunk.startsWith("<table") ? (
                      <div
                        key={ci}
                        className="my-6 overflow-x-auto rounded-xl border border-border [&_table]:w-full [&_table]:text-sm [&_th]:bg-muted/60 [&_th]:px-4 [&_th]:py-2.5 [&_th]:text-left [&_th]:font-semibold [&_th]:text-foreground [&_td]:px-4 [&_td]:py-2.5 [&_td]:border-t [&_td]:border-border [&_td]:text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: chunk }}
                      />
                    ) : (
                      chunk.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
                        part.startsWith("**") && part.endsWith("**") ? (
                          <strong key={`${ci}-${j}`} className="text-foreground font-semibold">
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
          <div className="mt-16 bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-6 pt-6 pb-3">
              <p className="text-sm text-muted-foreground text-center">
                You can absolutely do this yourself. Here is what that looks like compared to having us prepare everything.
              </p>
            </div>
            <div className="grid grid-cols-2">
              <div className="p-6 border-r border-t border-border">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Do it yourself</div>
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
                    <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                      <span className="text-muted-foreground/40 shrink-0 mt-0.5">○</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 bg-primary/[0.03] border-t border-border">
                <div className="text-xs font-bold uppercase tracking-wider text-primary mb-4">Ready Pack ($49)</div>
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
                    <li key={item} className="flex items-start gap-2 text-xs text-foreground leading-relaxed">
                      <span className="text-primary font-bold shrink-0 mt-0.5">✓</span>
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
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20"
            >
              Get my Ready Pack — $49 →
            </Link>
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
                    className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-all group"
                  >
                    <span className="text-2xl">{g.heroEmoji}</span>
                    <div>
                      <h4 className="text-sm font-semibold group-hover:text-primary transition-colors">{g.title}</h4>
                      <p className="text-xs text-muted-foreground">{g.readTime}</p>
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
