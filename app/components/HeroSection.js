"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useContact } from "./ContactPopup";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => (
    <div
      className="hero-canvas"
      style={{
        background: "radial-gradient(ellipse at 50% 45%, #151518 0%, #0a0a0a 70%)",
      }}
    />
  ),
});

export default function HeroSection() {
  const { setOpen } = useContact();

  return (
    <section className="hero" id="hero">
      {/* 3D Canvas — full-screen background */}
      <HeroScene />

      {/* Vignette overlay */}
      <div className="hero-vignette" />

      {/* Mobile fallback — static logo on gradient */}
      <div className="hero-mobile-fallback">
        <Image src="/favicon.svg" alt="" width={120} height={120} />
      </div>

      {/* HTML content overlay */}
      <div className="hero-overlay">
        <div className="hero-content">
          <h1 className="hero-headline" id="hero-title">
            We build web platforms, apps, and <span className="hero-highlight">AI systems</span> that run your business
          </h1>
          <p className="hero-subtitle" id="hero-description">
            Custom software for companies that need more than a template.
            Booking systems, client portals, mobile apps, and intelligent automation — built from scratch, built to scale.
          </p>
          <div className="hero-cta-row" id="hero-cta-group">
            <button
              className="btn-primary"
              id="btn-start-project"
              onClick={() => setOpen(true)}
            >
              <span>Get Started</span>
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
            <a href="#case-studies" className="btn-outline" id="btn-view-work">
              <span>View Our Work</span>
            </a>
          </div>
        </div>
      </div>

    </section>
  );
}
