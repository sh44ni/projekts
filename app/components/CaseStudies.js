"use client";

import { useState } from "react";
import Image from "next/image";

const CASES = [
  {
    num: "01",
    client: "Glitz & Glamour",
    logo: "/clients/glitzandglamour.svg",
    category: "Booking Platform",
    title: "End-to-end salon booking & loyalty platform with AI agent",
    metric: "+180%",
    metricLabel: "Online Bookings",
    tags: ["Next.js", "Node.js", "AI", "Apple Wallet"],
    href: "/case-studies/glitz-glamour",
  },
  {
    num: "02",
    client: "Sayma Manpower",
    logo: "/clients/sayma.svg",
    category: "Digital Transformation",
    title: "Complete digital backbone for an offline agency in Oman",
    metric: "2+ Yrs",
    metricLabel: "Partnership",
    tags: ["Next.js", "Mobile Apps", "Marketing"],
    href: "/case-studies/sayma-manpower",
  },
];

export default function CaseStudies() {
  const [activeIndex, setActiveIndex] = useState(-1);

  return (
    <section className="cases-section" id="case-studies">
      <div className="cases-header">
        <div className="cases-header-left">
          <span className="cases-eyebrow">Selected Work</span>
          <h2 className="cases-title">Case Studies</h2>
        </div>
        <p className="cases-header-desc">
          Platforms we&apos;ve built for real businesses — from beauty booking to manpower operations.
        </p>
      </div>

      <div className="cases-list">
        {CASES.map((c, i) => (
          <a
            key={c.num}
            href={c.href}
            className={`case-row ${activeIndex === i ? "active" : ""}`}
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(-1)}
            id={`case-row-${i}`}
          >
            {/* Hover accent line */}
            <div className="case-accent" />

            <div className="case-top">
              <span className="case-num">{c.num}</span>
              <h3 className="case-client">{c.client}</h3>
              <span className="case-category">{c.category}</span>
              <div className="case-metric-block">
                <span className="case-metric">{c.metric}</span>
                <span className="case-metric-label">{c.metricLabel}</span>
              </div>
              <svg className="case-arrow" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7" /><path d="M7 7h10v10" />
              </svg>
            </div>

            {/* Expandable detail row */}
            <div className="case-detail">
              <div className="case-detail-inner">
                <div className="case-detail-left">
                  <div className="case-logo-wrap">
                    <Image src={c.logo} alt={c.client} width={80} height={32} style={{ objectFit: "contain" }} />
                  </div>
                  <p className="case-desc">{c.title}</p>
                </div>
                <div className="case-tags">
                  {c.tags.map((tag) => (
                    <span key={tag} className="case-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* View all CTA */}
      <div className="cases-cta">
        <a href="#" className="btn-outline cases-btn" id="btn-view-all-cases">
          <span>View All Projects</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </section>
  );
}
