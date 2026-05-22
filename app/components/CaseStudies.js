"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

function CaseCard({ c, isReversed }) {
  const [activeImg, setActiveImg] = useState(0);
  const images = Array.isArray(c.gallery) && c.gallery.length > 0
    ? c.gallery
    : Array.isArray(c.images) && c.images.length > 0
    ? c.images
    : [c.coverImage || "https://picsum.photos/seed/placeholder/800/500"];
  const stats = Array.isArray(c.stats) ? c.stats : [];
  const href = `/case-studies/${c.slug || c.id}`;

  return (
    <div
      className={`case-card ${isReversed ? "case-card--reversed" : ""}`}
      id={`case-card-${c.slug || c.id}`}
    >
      {/* Text Content */}
      <div className="case-card-content">
        <div className="case-card-top">
          {c.logo && (
            <div className="case-card-logo-wrap">
              <Image
                src={c.logo}
                alt={c.client}
                width={100}
                height={36}
                style={{ objectFit: "contain" }}
              />
            </div>
          )}
          <span className="case-card-badge">{c.category}</span>
        </div>

        <h3 className="case-card-title">{c.title}</h3>
        <p className="case-card-desc">{c.description}</p>

        {/* Metrics */}
        {stats.length > 0 && (
          <div className="case-card-metrics">
            {stats.map((s) => (
              <div key={s.label} className="case-card-metric">
                <span className="case-card-metric-value">{s.value}</span>
                <span className="case-card-metric-label">{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        {c.tags?.length > 0 && (
          <div className="case-card-tags">
            {c.tags.map((tag) => (
              <span key={tag} className="case-card-tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <a href={href} className="case-card-cta" id={`case-cta-${c.slug || c.id}`}>
          <span>View Full Case Study</span>
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
        </a>
      </div>

      {/* Media Showcase */}
      <div className="case-card-media">
        <div className="case-media-hero">
          {c.videoUrl && activeImg === 0 ? (
            c.videoUrl.includes("youtube") || c.videoUrl.includes("youtu.be") ? (
              <iframe
                src={`https://www.youtube.com/embed/${extractYouTubeId(c.videoUrl)}`}
                style={{ width: "100%", height: "100%", border: "none" }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : c.videoUrl.match(/\.(mp4|webm|mov)/) ? (
              <video
                src={c.videoUrl}
                controls
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Image
                src={images[activeImg]}
                alt={`${c.client} screenshot ${activeImg + 1}`}
                width={800}
                height={500}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
                unoptimized
              />
            )
          ) : (
            <Image
              src={images[activeImg]}
              alt={`${c.client} screenshot ${activeImg + 1}`}
              width={800}
              height={500}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
              unoptimized
            />
          )}
        </div>
        <div className="case-media-thumbs">
          {images.map((img, i) => (
            <button
              key={i}
              className={`case-media-thumb ${activeImg === i ? "active" : ""}`}
              onClick={() => setActiveImg(i)}
              aria-label={`View screenshot ${i + 1}`}
            >
              <Image
                src={img}
                alt=""
                width={160}
                height={100}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
                unoptimized
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function extractYouTubeId(url) {
  const match = url.match(/(?:youtu\.be\/|v=)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : "";
}

export default function CaseStudies() {
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
      <section className="cases-section" id="case-studies">
        <div className="cases-header">
          <div className="cases-header-left">
            <span className="cases-eyebrow">Selected Work</span>
            <h2 className="cases-title">Case Studies</h2>
          </div>
        </div>
      </section>
    );
  }

  if (cases.length === 0) return null;

  return (
    <section className="cases-section" id="case-studies">
      <div className="cases-header">
        <div className="cases-header-left">
          <span className="cases-eyebrow">Selected Work</span>
          <h2 className="cases-title">Case Studies</h2>
        </div>
        <p className="cases-header-desc">
          Platforms we&apos;ve built for real businesses — from beauty booking to
          manpower operations.
        </p>
      </div>

      <div className="cases-showcase">
        {cases.map((c, i) => (
          <CaseCard key={c.id} c={c} isReversed={i % 2 !== 0} />
        ))}
      </div>

      {/* View all CTA */}
      <div className="cases-cta">
        <a href="/case-studies" className="btn-outline cases-btn" id="btn-view-all-cases">
          <span>View All Projects</span>
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
        </a>
      </div>
    </section>
  );
}
