import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
}

const SITE = "https://getcpf.com";
const DEFAULT_TITLE = "GET CPF. Get Your Brazilian CPF in Minutes";
const DEFAULT_DESC =
  "Get your Brazilian CPF number sorted in minutes. Personalised documents, the right office, and step-by-step guidance for foreigners.";
const DEFAULT_OG = `${SITE}/og-image.png`;

const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "GET CPF",
  "url": "https://getcpf.com",
  "logo": "https://getcpf.com/og-image.png",
  "description": "Helping foreigners get their Brazilian CPF number",
  "founder": { "@type": "Person", "name": "Jonathan Wickham" },
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "support@getcpf.com",
    "contactType": "customer service",
  },
};

const SEO = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESC,
  path = "/",
  ogImage = DEFAULT_OG,
  noIndex = false,
}: SEOProps) => {
  const canonical = `${SITE}${path}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@getcpf" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      <script type="application/ld+json">
        {JSON.stringify(ORG_SCHEMA)}
      </script>
    </Helmet>
  );
};

export default SEO;
