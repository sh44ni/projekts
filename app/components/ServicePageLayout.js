"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`svc-faq-item ${open ? "open" : ""}`} onClick={() => setOpen(!open)}>
      <div className="svc-faq-q">
        <span>{q}</span>
        <svg className="svc-faq-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14" /><path d="M5 12h14" />
        </svg>
      </div>
      <div className="svc-faq-a">
        <div className="svc-faq-a-inner">{a}</div>
      </div>
    </div>
  );
}

export default function ServicePageLayout({
  title,
  subtitle,
  description,
  features,
  process,
  techStack,
  faqs,
  ctaText,
}) {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="svc-page-hero">
        <div className="svc-page-hero-inner">
          <span className="svc-page-eyebrow">Our Services</span>
          <h1 className="svc-page-title">{title}</h1>
          <p className="svc-page-subtitle">{subtitle}</p>
          <div className="svc-page-hero-cta">
            <a href="#contact" className="btn-primary">
              <span>Get a Quote</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7" /><path d="M7 7h10v10" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="svc-page-section">
        <div className="svc-page-container">
          <div className="svc-page-desc-grid">
            <div className="svc-page-desc-left">
              <span className="svc-page-label">Overview</span>
              <h2 className="svc-page-heading">{description.heading}</h2>
            </div>
            <div className="svc-page-desc-right">
              {description.paragraphs.map((p, i) => (
                <p key={i} className="svc-page-text">{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="section-connector"><span className="connector-glow" /></div>

      {/* Features */}
      <section className="svc-page-section">
        <div className="svc-page-container">
          <span className="svc-page-label">What We Deliver</span>
          <h2 className="svc-page-heading svc-page-heading--center">{features.heading}</h2>
          <div className="svc-page-features-grid">
            {features.items.map((f, i) => (
              <div key={i} className="svc-page-feature">
                <span className="svc-page-feature-num">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="svc-page-feature-title">{f.title}</h3>
                <p className="svc-page-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-connector"><span className="connector-glow" /></div>

      {/* Process */}
      <section className="svc-page-section">
        <div className="svc-page-container">
          <span className="svc-page-label">Our Process</span>
          <h2 className="svc-page-heading">{process.heading}</h2>
          <div className="svc-page-process">
            {process.steps.map((step, i) => (
              <div key={i} className="svc-page-step">
                <div className="svc-page-step-num">{String(i + 1).padStart(2, "0")}</div>
                <div className="svc-page-step-content">
                  <h3 className="svc-page-step-title">{step.title}</h3>
                  <p className="svc-page-step-desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-connector"><span className="connector-glow" /></div>

      {/* Tech Stack */}
      <section className="svc-page-section">
        <div className="svc-page-container svc-page-container--center">
          <span className="svc-page-label">Tech Stack</span>
          <h2 className="svc-page-heading svc-page-heading--center">{techStack.heading}</h2>
          <div className="svc-page-tech-grid">
            {techStack.items.map((t, i) => (
              <div key={i} className="svc-page-tech">{t}</div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-connector"><span className="connector-glow" /></div>

      {/* FAQ */}
      <section className="svc-page-section">
        <div className="svc-page-container">
          <div className="svc-page-faq-grid">
            <div className="svc-page-faq-left">
              <span className="svc-page-label">FAQ</span>
              <h2 className="svc-page-heading">Frequently Asked Questions</h2>
            </div>
            <div className="svc-page-faq-right">
              {faqs.map((f, i) => (
                <FAQItem key={i} q={f.q} a={f.a} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="section-connector"><span className="connector-glow" /></div>

      {/* CTA */}
      <section className="prefooter">
        <div className="prefooter-inner">
          <span className="prefooter-eyebrow">Ready to start?</span>
          <h2 className="prefooter-heading">
            {ctaText || "Let's Build Something"}<br />
            <span className="prefooter-accent">Extraordinary.</span>
          </h2>
          <div className="prefooter-cta">
            <a href="#contact" className="btn-primary">
              <span>Start a Project</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7" /><path d="M7 7h10v10" />
              </svg>
            </a>
            <a href="#contact" className="btn-outline"><span>Book a Call</span></a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
