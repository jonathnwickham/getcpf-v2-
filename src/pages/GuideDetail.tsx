import { useParams, Link, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getGuideBySlug, guides } from "@/lib/guides-data";

const GuideDetail = () => {
  const { slug } = useParams();
  const guide = slug ? getGuideBySlug(slug) : undefined;

  if (!guide) return <Navigate to="/guides" replace />;

  const otherGuides = guides.filter((g) => g.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <article className="pt-32 pb-24 px-6">
        <div className="max-w-[700px] mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
            <Link to="/guides" className="hover:text-foreground transition-colors">Guides</Link>
            <span>/</span>
            <span className="text-foreground font-medium truncate">{guide.title}</span>
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
          </div>

          {/* Content */}
          <div className="space-y-10">
            {guide.sections.map((section, i) => (
              <section key={i}>
                <h2 className="text-xl font-bold tracking-tight mb-3">{section.heading}</h2>
                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line prose-strong:text-foreground prose-strong:font-semibold">
                  {section.content.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
                    part.startsWith("**") && part.endsWith("**") ? (
                      <strong key={j} className="text-foreground font-semibold">
                        {part.slice(2, -2)}
                      </strong>
                    ) : (
                      <span key={j}>{part}</span>
                    )
                  )}
                </div>
              </section>
            ))}
          </div>

          {/* DIY vs Ready Pack comparison */}
          <div className="mt-16 bg-card border border-border rounded-2xl overflow-hidden">
            <div className="grid grid-cols-2">
              <div className="p-6 border-r border-border">
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
              <div className="p-6 bg-primary/[0.03]">
                <div className="text-xs font-bold uppercase tracking-wider text-primary mb-4">Ready Pack ($49)</div>
                <ul className="space-y-3">
                  {[
                    "Correct office auto-selected for your state",
                    "Proof of address sorted for your situation",
                    "Forms pre-filled with your details",
                    "AI scanner catches name errors before you go",
                    "Portuguese cheat sheet for the counter",
                    "Know exactly what to say and do",
                    "Rejection troubleshooter if anything goes wrong",
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
              Get started, $49 →
            </Link>
            <p className="text-xs text-muted-foreground mt-3">
              🛡️ If you follow our steps and get rejected, full refund. No questions asked.
            </p>
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
