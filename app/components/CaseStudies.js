"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getCaseStudyImages } from "@/lib/caseStudyImages";
import CaseStudyImage from "./CaseStudyImage";

function extractYouTubeId(url) {
  const match = url.match(/(?:youtu\.be\/|v=)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : "";
}

function FeaturedCaseCard({ c }) {
  const [activeImg, setActiveImg] = useState(0);
  const images = getCaseStudyImages(c);
  const stats = Array.isArray(c.stats) ? c.stats : [];
  const href = `/case-studies/${c.slug || c.id}`;

  return (
    <div className="fc-card" id={`case-card-${c.slug || c.id}`}>
      {/* Left: text + stats */}
      <div className="fc-body">
        <div className="fc-top">
          {c.logo && (
            <div className="fc-logo-wrap">
              <Image
                src={c.logo}
                alt={c.client}
                width={110}
                height={36}
                style={{ objectFit: "contain", width: "auto", height: 32 }}
                unoptimized
              />
            </div>
          )}
          <span className="fc-badge">{c.category}</span>
        </div>

        <h3 className="fc-title">{c.title}</h3>
        <p className="fc-desc">{c.description}</p>

        {stats.length > 0 && (
          <div className="fc-stats">
            {stats.map((s) => (
              <div key={s.label} className="fc-stat">
                <span className="fc-stat-value">{s.value}</span>
                <span className="fc-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {c.tags?.length > 0 && (
          <div className="fc-tags">
            {c.tags.map((tag) => (
              <span key={tag} className="fc-tag">{tag}</span>
            ))}
          </div>
        )}

        <div className="fc-actions">
          <a href={href} className="fc-cta" id={`case-cta-${c.slug || c.id}`}>
            <span>View Full Case Study</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7" /><path d="M7 7h10v10" />
            </svg>
          </a>
        </div>
      </div>

      {/* Right: media */}
      <div className="fc-media">
        <div className="fc-media-hero">
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
              <CaseStudyImage
                sources={images}
                startIndex={activeImg}
                alt={`${c.client} screenshot`}
                fill
                style={{ objectFit: "cover", objectPosition: "top center" }}
                unoptimized
              />
            )
          ) : (
            <CaseStudyImage
              sources={images}
              startIndex={activeImg}
              alt={`${c.client} screenshot`}
              fill
              style={{ objectFit: "cover", objectPosition: "top center" }}
              unoptimized
            />
          )}
        </div>

        {images.length > 1 && (
          <div className="fc-thumbs">
            {images.slice(0, 4).map((_, i) => (
              <button
                key={i}
                className={`fc-thumb ${activeImg === i ? "active" : ""}`}
                onClick={() => setActiveImg(i)}
                aria-label={`View screenshot ${i + 1}`}
              >
                <CaseStudyImage
                  sources={images}
                  startIndex={i}
                  alt=""
                  width={200}
                  height={120}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  unoptimized
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CaseStudies() {
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all published cases, then pick featured or fall back to first
    fetch("/api/case-studies")
      .then((r) => r.json())
      .then((d) => {
        const arr = Array.isArray(d) ? d : [];
        const pick = arr.find((c) => c.featured) || arr[0] || null;
        setFeatured(pick);
      })
      .catch(() => setFeatured(null))
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

  // No published cases at all — hide section entirely
  if (!featured) return null;

  return (
    <section className="cases-section" id="case-studies">
      <div className="cases-header">
        <div className="cases-header-left">
          <span className="cases-eyebrow">Selected Work</span>
          <h2 className="cases-title">Featured Project</h2>
        </div>
        <p className="cases-header-desc">
          One project, told in full — from the problem we solved to the platform we built.
        </p>
      </div>

      <div className="cases-showcase">
        <FeaturedCaseCard c={featured} />
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
