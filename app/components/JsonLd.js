export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://projektsvision.com/#organization",
        "name": "Projekts Vision",
        "legalName": "Projekts Vision Private Limited",
        "founder": {
          "@type": "Person",
          "name": "Christian Lavelle",
          "jobTitle": "Chief Executive Officer"
        },
        "url": "https://projektsvision.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://projektsvision.com/favicon.svg",
          "caption": "Projekts Vision Logo",
        },
        "description":
          "Full-cycle custom software development, web platforms, mobile apps, and enterprise AI engineering for high-growth businesses across the United States.",
        "areaServed": [
          {
            "@type": "Country",
            "name": "United States",
          },
          {
            "@type": "Country",
            "name": "Switzerland",
          },
          {
            "@type": "Country",
            "name": "Oman",
          },
          {
            "@type": "Country",
            "name": "Pakistan",
          },
        ],
        "knowsAbout": [
          "Custom Web Development",
          "Next.js Development",
          "React Native Mobile Apps",
          "Enterprise AI Solutions",
          "Machine Learning & LLM Integration",
          "Cloud Architecture & DevOps",
          "API Engineering",
        ],
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "email": "info@projektsvision.com",
            "contactType": "sales",
            "areaServed": "US",
            "availableLanguage": ["en"],
          },
          {
            "@type": "ContactPoint",
            "email": "support@projektsvision.com",
            "contactType": "customer support",
            "areaServed": "US",
            "availableLanguage": ["en"],
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://projektsvision.com/#website",
        "url": "https://projektsvision.com",
        "name": "Projekts Vision",
        "publisher": {
          "@id": "https://projektsvision.com/#organization",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
