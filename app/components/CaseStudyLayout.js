"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useContact } from "./ContactPopup";
import {
  getCaseStudyImages,
  getSectionImages,
  getImageSources,
} from "@/lib/caseStudyImages";
import CaseStudyImage from "./CaseStudyImage";
import "./case-study-detail.css";

export default function CaseStudyLayout({ project }) {
  const gallery = getCaseStudyImages(project);
  const screenshotSections = (Array.isArray(project.screenshotSections)
    ? project.screenshotSections
    : []
  ).map((section) => ({
    ...section,
    images: getSectionImages(section),
  }));
  const [activeImg, setActiveImg] = useState(0);
  const { setOpen } = useContact();

  return (
    <>
      <Navbar />

      <main className="csd-page">
        <section className="csd-hero">
          <div className="csd-hero-inner">
            <div className="csd-breadcrumb">
              <a href="/case-studies">Case Studies</a>
              <span>/</span>
              <span>{project.client}</span>
            </div>

            <div className="csd-hero-grid">
              <div className="csd-hero-text">
                <span className="csd-badge">{project.category}</span>
                <h1 className="csd-hero-title">{project.headline}</h1>
                <p className="csd-hero-subtitle">{project.subtitle}</p>

                <div className="csd-hero-stats">
                  {project.stats.map((s) => (
                    <div key={s.label} className="csd-hero-stat">
                      <span className="csd-hero-stat-value">{s.value}</span>
                      <span className="csd-hero-stat-label">{s.label}</span>
                    </div>
                  ))}
                </div>

                <div className="csd-tech-stack">
                  {project.tech.map((t) => (
                    <span key={t} className="csd-tech-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="csd-hero-media">
                {project.videoUrl && (
                  <div className="csd-hero-video">
                    {project.videoUrl.includes("youtube") ||
                    project.videoUrl.includes("youtu.be") ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${(project.videoUrl.match(/(?:youtu\.be\/|v=)([a-zA-Z0-9_-]{11})/) || [])[1] || ""}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          border: "none",
                          borderRadius: 12,
                        }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : project.videoUrl.includes("vimeo") ? (
                      <iframe
                        src={`https://player.vimeo.com/video/${(project.videoUrl.match(/vimeo\.com\/(\d+)/) || [])[1] || ""}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          border: "none",
                          borderRadius: 12,
                        }}
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={project.videoUrl}
                        controls
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: 12,
                        }}
                      />
                    )}
                  </div>
                )}

                <div className="csd-hero-image" style={{ position: "relative" }}>
                  <CaseStudyImage
                    sources={gallery}
                    startIndex={activeImg}
                    alt={`${project.client} screenshot`}
                    fill
                    style={{
                      objectFit: "cover",
                      objectPosition: "top center",
                    }}
                    unoptimized
                  />
                </div>

                {gallery.length > 1 && (
                  <div className="csd-hero-thumbs">
                    {gallery.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`csd-thumb ${activeImg === i ? "active" : ""}`}
                        onClick={() => setActiveImg(i)}
                        aria-label={`View screenshot ${i + 1}`}
                      >
                        <CaseStudyImage
                          sources={gallery}
                          startIndex={i}
                          alt=""
                          width={320}
                          height={200}
                          style={{
                            objectFit: "cover",
                            width: "100%",
                            height: "100%",
                          }}
                          unoptimized
                        />
                      </button>
                    ))}
                  </div>
                )}

                {project.logo && (
                  <div className="csd-hero-logo">
                    <Image
                      src={project.logo}
                      alt={project.client}
                      width={180}
                      height={36}
                      style={{ objectFit: "contain", width: "auto", height: 36 }}
                      unoptimized
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="csd-overview">
          <div className="csd-container">
            <div className="csd-overview-band">
              <div className="csd-overview-grid">
                <div className="csd-overview-card">
                  <span className="csd-overview-label">The Challenge</span>
                  <p>{project.challenge}</p>
                </div>
                <div className="csd-overview-divider" aria-hidden="true" />
                <div className="csd-overview-card">
                  <span className="csd-overview-label">Our Solution</span>
                  <p>{project.solution}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="csd-features">
          <div className="csd-container">
            <div className="csd-section-header">
              <span className="csd-section-eyebrow">What We Built</span>
              <h2 className="csd-section-title">Key Features</h2>
            </div>
            <div className="csd-features-grid">
              {project.features.map((f, i) => (
                <div key={i} className="csd-feature-card">
                  <span className="csd-feature-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="csd-feature-title">{f.title}</h3>
                  <p className="csd-feature-desc">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {screenshotSections.map(
          (section, i) =>
            section.images.length > 0 && (
              <section
                key={i}
                className={`csd-deep-dive ${i % 2 === 1 ? "csd-deep-dive--alt" : ""}`}
              >
                <div className="csd-container">
                  <div className="csd-media-block">
                    <div className="csd-media-block-header">
                      <span className="csd-section-eyebrow">{section.label}</span>
                      <h3 className="csd-media-block-title">{section.title}</h3>
                      {section.desc && (
                        <p className="csd-media-block-desc">{section.desc}</p>
                      )}
                    </div>
                    <div className="csd-media-block-images">
                      {section.images.map((img, j) => (
                        <div key={j} className="csd-media-block-img">
                          <CaseStudyImage
                            sources={getImageSources(img, project)}
                            alt={`${section.title} screenshot ${j + 1}`}
                            width={1200}
                            height={750}
                            style={{
                              objectFit: "cover",
                              width: "100%",
                              height: "auto",
                            }}
                            unoptimized
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            ),
        )}

        <section className="csd-results">
          <div className="csd-container">
            <div className="csd-section-header" style={{ textAlign: "center" }}>
              <span className="csd-section-eyebrow">The Outcome</span>
              <h2 className="csd-section-title">Results</h2>
            </div>
            <div className="csd-results-grid">
              {project.results.map((r, i) => (
                <div key={i} className="csd-result-card">
                  <h4>{r.title}</h4>
                  <p>{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="prefooter">
          <div className="prefooter-inner">
            <span className="prefooter-eyebrow">
              {project.ctaEyebrow || "Ready to start?"}
            </span>
            <h2 className="prefooter-heading">
              {project.ctaHeading || "Have a project in mind?"}
              <br />
              <span className="prefooter-accent">
                {project.ctaAccent || "Let's talk."}
              </span>
            </h2>
            <div className="prefooter-cta">
              <button
                className="btn-primary"
                id="btn-cs-start"
                onClick={() => setOpen(true)}
              >
                <span>Start a Project</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </button>
              <a href="tel:+923040260023" className="btn-outline" id="btn-cs-call">
                <span>Call Us</span>
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
