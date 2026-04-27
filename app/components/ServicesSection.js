"use client";

import { useState, useEffect, useRef } from "react";

const SERVICES = [
  {
    num: "01",
    title: "Web",
    accent: "Development",
    desc: "Custom web platforms that actually run businesses — booking systems, client portals, admin dashboards, and SEO-optimized marketing sites.",
    detail: "Not page builders. We write the code, design the database, and build exactly what your business needs. Salon booking engines, manpower management systems, contract platforms — whatever it takes.",
    tags: ["Next.js", "React", "Node.js", "PostgreSQL", "Vercel"],
    href: "/services/web-development",
    highlights: ["Custom Built", "SEO Optimized", "Mobile-First"],
    visual: "grid",
  },
  {
    num: "02",
    title: "App",
    accent: "Development",
    desc: "Mobile apps for iOS and Android — staff management tools, client-facing booking apps, and internal operations platforms.",
    detail: "Cross-platform builds with React Native for speed, or native when performance demands it. We handle design, development, testing, and App Store submission.",
    tags: ["React Native", "Expo", "Firebase", "Swift", "Flutter"],
    href: "/services/app-development",
    highlights: ["iOS + Android", "Real-Time Sync", "Offline Support"],
    visual: "device",
  },
  {
    num: "03",
    title: "AI",
    accent: "Integration",
    desc: "AI that replaces manual work — booking agents trained on your business, chatbots that capture leads, and automation that actually saves hours.",
    detail: "We've built AI booking agents that replaced entire DM workflows, chatbots handling employer enquiries 24/7, and content systems that manage themselves. Practical AI, not demos.",
    tags: ["OpenAI", "LangChain", "Python", "Custom LLMs", "RAG"],
    href: "/services/ai-solutions",
    highlights: ["24/7 Automation", "Business-Trained", "Production-Ready"],
    visual: "neural",
  },
  {
    num: "04",
    title: "Digital",
    accent: "Marketing",
    desc: "SEO, social media management, and content strategy that brings in clients — not just followers.",
    detail: "Two years of social media marketing for Sayma Manpower. SEO-optimized websites that rank and convert. We measure what matters: enquiries, bookings, and revenue — not impressions.",
    tags: ["SEO", "Social Media", "Content", "Analytics", "Google Ads"],
    href: "/services/digital-strategy",
    highlights: ["Lead Generation", "Organic Growth", "Measurable ROI"],
    visual: "chart",
  },
];

export default function ServicesSection() {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight;
      const viewportH = window.innerHeight;
      const scrolled = -rect.top;
      const scrollableHeight = sectionHeight - viewportH;
      const rawProgress = Math.max(0, Math.min(1, scrolled / scrollableHeight));
      const idx = Math.min(
        SERVICES.length - 1,
        Math.floor(rawProgress * SERVICES.length)
      );
      setActiveIndex(idx);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="svc-scroll" id="services" ref={sectionRef}>
      <div className="svc-sticky">
        <div className="svc-layout">

          {/* Left — Content */}
          <div className="svc-left-col">
            {SERVICES.map((service, i) => (
              <div
                key={service.num}
                className={`svc-panel ${i === activeIndex ? "active" : ""}`}
              >
                <span className="svc-panel-num">{service.num}</span>
                <h2 className="svc-panel-title">
                  {service.title}<span className="svc-panel-accent">{service.accent}</span>
                </h2>
                <p className="svc-panel-desc">{service.desc}</p>
                <p className="svc-panel-detail">{service.detail}</p>
                <div className="svc-panel-tags">
                  {service.tags.map((tag) => (
                    <span key={tag} className="svc-panel-tag">{tag}</span>
                  ))}
                </div>
                <a href={service.href} className="svc-panel-link">
                  <span>Explore Service</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            ))}
          </div>

          {/* Right — Animated visual */}
          <div className="svc-right-col">
            {SERVICES.map((service, i) => (
              <div
                key={service.num}
                className={`svc-visual ${i === activeIndex ? "active" : ""}`}
              >
                <div className={`svc-art svc-art--${service.visual}`}>
                  {/* Orbiting rings */}
                  <div className="svc-orbit svc-orbit--1" />
                  <div className="svc-orbit svc-orbit--2" />
                  <div className="svc-orbit svc-orbit--3" />

                  {/* Inner shape */}
                  <div className="svc-art-core" />

                  {/* Floating nodes */}
                  <span className="svc-node svc-node--1" />
                  <span className="svc-node svc-node--2" />
                  <span className="svc-node svc-node--3" />
                  <span className="svc-node svc-node--4" />
                </div>

                {/* Highlights positioned around visual */}
                <div className="svc-visual-highlights">
                  {service.highlights.map((h, hi) => (
                    <div
                      key={h}
                      className="svc-vis-highlight"
                      style={{ "--hi-delay": `${hi * 0.12}s` }}
                    >
                      <span className="svc-vis-highlight-line" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
