"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useContact } from "./ContactPopup";

const TEAM = [
  {
    name: "Zeeshan Khan",
    role: "Full-Stack Developer",
    title: "Head of Operations",
    avatar: "https://picsum.photos/seed/zeeshan/200/200",
    skills: ["React", "Next.js", "Node.js", "AWS"],
  },
  {
    name: "Umar Farooq",
    role: "Full-Stack Developer",
    title: "Co-Founder",
    avatar: "https://picsum.photos/seed/umar/200/200",
    skills: ["React", "Python", "DevOps", "System Design"],
  },
  {
    name: "Bilal Ahmed",
    role: "Backend Dev & Digital Marketing",
    title: "Growth Lead",
    avatar: "https://picsum.photos/seed/bilal/200/200",
    skills: ["Node.js", "PostgreSQL", "SEO", "Analytics"],
  },
];

const STATS = [
  { value: "4+", label: "Years Experience" },
  { value: "30+", label: "Projects Delivered" },
  { value: "4", label: "Countries Served" },
  { value: "99%", label: "Client Retention" },
];

const VALUES = [
  {
    num: "01",
    title: "Ship Fast, Ship Right",
    desc: "Production-grade work in weeks, then iterate based on real data.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Radical Transparency",
    desc: "Weekly demos, shared channels, real-time project boards. You see everything.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Own the Outcome",
    desc: "We measure impact, track KPIs, and stay accountable for business results.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Global by Default",
    desc: "Async-first, always documented, always reachable across time zones.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
];

const LOCATIONS = [
  { city: "Pakistan", flag: "🇵🇰", role: "Engineering & Design HQ" },
  { city: "Oman", flag: "🇴🇲", role: "Operations & Client Services" },
  { city: "United States", flag: "🇺🇸", role: "Client Market" },
  { city: "Switzerland", flag: "🇨🇭", role: "Client Market" },
];

export default function AboutContent() {
  const { setOpen } = useContact();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 },
    );

    const els = document.querySelectorAll(".about-animate");
    els.forEach((el) => observer.observe(el));
    return () => els.forEach((el) => observer.unobserve(el));
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-inner">
          <span className="about-eyebrow">About Projekts</span>
          <h1 className="about-headline">
            A small team with
            <br />
            <span className="about-headline-accent">global ambition.</span>
          </h1>
          <p className="about-hero-desc">
            Developers, designers, and strategists based in Pakistan and Oman
            building digital products for clients across the US, Switzerland,
            and beyond.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="about-stats-bar about-animate">
        {STATS.map((s) => (
          <div key={s.label} className="about-stat">
            <span className="about-stat-value">{s.value}</span>
            <span className="about-stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      <div className="section-connector">
        <span className="connector-glow" />
      </div>

      {/* Story - visual split */}
      <section className="about-section">
        <div className="about-container">
          <div className="about-story-split about-animate">
            <div className="about-story-text">
              <span className="about-label">Our Story</span>
              <h2 className="about-heading">
                Born from freelancing.
                <br />
                Built for scale.
              </h2>
              <p className="about-text">
                Projekts started with a problem: agencies that over-promised and
                under-delivered. So we built the agency we wished existed: lean,
                technical, and focused on outcomes.
              </p>
              <p className="about-text">
                Today we serve clients from San Francisco to Zurich. Every
                project gets senior-level attention, direct access to the
                builders, and the speed of a startup.
              </p>
            </div>
            <div className="about-story-visual">
              <div className="about-story-card">
                <div className="about-story-card-icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <span className="about-story-card-label">Not the biggest</span>
                <p>The agency you actually enjoy working with.</p>
              </div>
              <div className="about-story-locations">
                {LOCATIONS.map((loc) => (
                  <div key={loc.city} className="about-location-row">
                    <span className="about-location-flag">{loc.flag}</span>
                    <div>
                      <span className="about-location-city">{loc.city}</span>
                      <span className="about-location-role">{loc.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-connector">
        <span className="connector-glow" />
      </div>

      {/* Values */}
      <section className="about-section">
        <div className="about-container">
          <div className="about-values-header about-animate">
            <span className="about-label">How We Work</span>
            <h2 className="about-heading">Principles, not processes.</h2>
          </div>
          <div className="about-values-grid">
            {VALUES.map((v, i) => (
              <div
                key={v.num}
                className="about-value about-animate"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="about-value-icon">{v.icon}</div>
                <h3 className="about-value-title">{v.title}</h3>
                <p className="about-value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-connector">
        <span className="connector-glow" />
      </div>

      {/* Team */}
      <section className="about-section about-team-section">
        <div className="about-container">
          <div className="about-team-header about-animate">
            <span className="about-label">The Team</span>
            <h2 className="about-heading">Small team. Senior talent.</h2>
          </div>
          <div className="about-team-grid">
            {TEAM.map((member, i) => (
              <div
                key={member.name}
                className="about-member about-animate"
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className="about-member-avatar">
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    width={88}
                    height={88}
                    style={{ objectFit: "cover", width: "100%", height: "100%" }}
                    unoptimized
                  />
                </div>
                <div className="about-member-info">
                  <h3 className="about-member-name">{member.name}</h3>
                  <span className="about-member-title">{member.title}</span>
                  <span className="about-member-role">{member.role}</span>
                </div>
                <div className="about-member-skills">
                  {member.skills.map((s) => (
                    <span key={s} className="about-member-skill">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-connector">
        <span className="connector-glow" />
      </div>

      {/* CTA */}
      <section className="prefooter">
        <div className="prefooter-inner">
          <span className="prefooter-eyebrow">Let&apos;s work together</span>
          <h2 className="prefooter-heading">
            Ready to meet your
            <br />
            <span className="prefooter-accent">next team?</span>
          </h2>
          <div className="prefooter-cta">
            <button
              className="btn-primary"
              id="btn-about-start"
              onClick={() => setOpen(true)}
            >
              <span>Start a Conversation</span>
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
          </div>
        </div>
      </section>
    </>
  );
}
