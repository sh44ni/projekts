"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function CaseStudyListContent() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/case-studies")
      .then((r) => r.json())
      .then((d) => setCases(Array.isArray(d) ? d : []))
      .catch(() => setCases([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="cs-listing-grid-section">
        <div className="cs-listing-grid">
          {[1, 2].map((i) => (
            <div key={i} className="cs-listing-card" style={{ opacity: 0.3 }}>
              <div className="cs-listing-card-image" style={{ background: "rgba(255,255,255,0.04)", aspectRatio: "3/2" }} />
              <div className="cs-listing-card-body">
                <div style={{ height: 16, background: "rgba(255,255,255,0.06)", borderRadius: 8, width: "60%", marginBottom: 12 }} />
                <div style={{ height: 12, background: "rgba(255,255,255,0.04)", borderRadius: 6, width: "80%" }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (cases.length === 0) {
    return (
      <section className="cs-listing-grid-section">
        <p style={{ color: "#888", textAlign: "center", padding: "40px 0" }}>
          No case studies published yet.
        </p>
      </section>
    );
  }

  return (
    <section className="cs-listing-grid-section">
      <div className="cs-listing-grid">
        {cases.map((c) => (
          <Link
            key={c.id}
            href={`/case-studies/${c.slug}`}
            className="cs-listing-card"
            id={`cs-listing-${c.slug}`}
          >
            <div className="cs-listing-card-image">
              <Image
                src={c.coverImage || (Array.isArray(c.gallery) && c.gallery[0]) || "https://picsum.photos/seed/placeholder/600/400"}
                alt={c.client}
                width={600}
                height={400}
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                }}
                unoptimized
              />
            </div>
            <div className="cs-listing-card-body">
              <div className="cs-listing-card-top">
                <span className="cs-listing-card-badge">{c.category}</span>
                {c.metric && (
                  <div className="cs-listing-card-metric">
                    <span className="cs-listing-card-metric-value">
                      {c.metric}
                    </span>
                    <span className="cs-listing-card-metric-label">
                      {c.metricLabel}
                    </span>
                  </div>
                )}
              </div>
              <h2 className="cs-listing-card-client">{c.client}</h2>
              <p className="cs-listing-card-title">{c.title}</p>
              {c.tags?.length > 0 && (
                <div className="cs-listing-card-tags">
                  {c.tags.map((tag) => (
                    <span key={tag} className="cs-listing-card-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <span className="cs-listing-card-link">
                <span>View Case Study</span>
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
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
