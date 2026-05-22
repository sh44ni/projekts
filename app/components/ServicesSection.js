"use client";

const SERVICES = [
  {
    num: "01",
    title: "Web Development",
    desc: "Custom web platforms that actually run businesses booking systems, client portals, admin dashboards, and SEO-optimized marketing sites.",
    tags: ["Next.js", "React", "Node.js", "PostgreSQL", "Vercel"],
    href: "/services/web-development",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="14" y1="4" x2="10" y2="20" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "App Development",
    desc: "Mobile apps for iOS and Android staff management tools, client-facing booking apps, and internal operations platforms.",
    tags: ["React Native", "Expo", "Firebase", "Swift", "Flutter"],
    href: "/services/app-development",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12" y2="18.01" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "AI Integration",
    desc: "AI that replaces manual work booking agents trained on your business, chatbots that capture leads, and automation that saves hours.",
    tags: ["OpenAI", "LangChain", "Python", "Custom LLMs", "RAG"],
    href: "/services/ai-solutions",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2a4 4 0 0 1 4 4v1a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
        <path d="M16 15a4 4 0 0 1 4 4v1H4v-1a4 4 0 0 1 4-4" />
        <circle cx="12" cy="12" r="1" />
        <path d="M12 13v2" />
        <path d="M9 10l-2-1" />
        <path d="M15 10l2-1" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Digital Marketing",
    desc: "SEO, social media management, and content strategy that brings in clients not just followers. We measure enquiries, bookings, and revenue.",
    tags: ["SEO", "Social Media", "Content", "Analytics", "Google Ads"],
    href: "/services/digital-strategy",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
        <polyline points="6 14 12 4 18 10" />
      </svg>
    ),
  },
];

export default function ServicesSection() {
  return (
    <section className="svc-section" id="services">
      <div className="svc-header">
        <span className="svc-eyebrow">What We Do</span>
        <h2 className="svc-title">Our Services</h2>
        <p className="svc-subtitle">
          From custom web platforms to AI-powered automation we build the
          systems that run your business.
        </p>
      </div>

      <div className="svc-grid">
        {SERVICES.map((service) => (
          <a
            key={service.num}
            href={service.href}
            className="svc-card"
            id={`svc-card-${service.num}`}
          >
            <div className="svc-card-icon">{service.icon}</div>
            <span className="svc-card-num">{service.num}</span>
            <h3 className="svc-card-title">{service.title}</h3>
            <p className="svc-card-desc">{service.desc}</p>
            <div className="svc-card-tags">
              {service.tags.map((tag) => (
                <span key={tag} className="svc-card-tag">
                  {tag}
                </span>
              ))}
            </div>
            <span className="svc-card-link">
              <span>Explore Service</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
