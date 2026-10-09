"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useContact } from "./ContactPopup";

const TEAM = [
  {
    name: "Christian Lavelle",
    role: "Executive Leadership & Strategy",
    title: "Chief Executive Officer",
    avatar: "https://picsum.photos/seed/christian/200/200",
    skills: ["Strategic Vision", "Executive Leadership", "Product Direction", "Client Growth"],
  },
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


function FlagUS() {
  return (
    <svg viewBox="0 0 640 480" className="about-location-flag-svg" aria-label="United States Flag">
      <g fillRule="evenodd">
        <path fill="#bd3d44" d="M0 0h640v480H0z" />
        <path stroke="#fff" strokeWidth="37" d="M0 55.5h640M0 129.5h640M0 203.5h640M0 277.5h640M0 351.5h640M0 425.5h640" />
        <path fill="#192f5d" d="M0 0h260v259H0z" />
        <g fill="#fff">
          <circle cx="30" cy="28" r="7" /><circle cx="76" cy="28" r="7" /><circle cx="122" cy="28" r="7" /><circle cx="168" cy="28" r="7" /><circle cx="214" cy="28" r="7" />
          <circle cx="53" cy="56" r="7" /><circle cx="99" cy="56" r="7" /><circle cx="145" cy="56" r="7" /><circle cx="191" cy="56" r="7" />
          <circle cx="30" cy="84" r="7" /><circle cx="76" cy="84" r="7" /><circle cx="122" cy="84" r="7" /><circle cx="168" cy="84" r="7" /><circle cx="214" cy="84" r="7" />
          <circle cx="53" cy="112" r="7" /><circle cx="99" cy="112" r="7" /><circle cx="145" cy="112" r="7" /><circle cx="191" cy="112" r="7" />
          <circle cx="30" cy="140" r="7" /><circle cx="76" cy="140" r="7" /><circle cx="122" cy="140" r="7" /><circle cx="168" cy="140" r="7" /><circle cx="214" cy="140" r="7" />
          <circle cx="53" cy="168" r="7" /><circle cx="99" cy="168" r="7" /><circle cx="145" cy="168" r="7" /><circle cx="191" cy="168" r="7" />
          <circle cx="30" cy="196" r="7" /><circle cx="76" cy="196" r="7" /><circle cx="122" cy="196" r="7" /><circle cx="168" cy="196" r="7" /><circle cx="214" cy="196" r="7" />
          <circle cx="53" cy="224" r="7" /><circle cx="99" cy="224" r="7" /><circle cx="145" cy="224" r="7" /><circle cx="191" cy="224" r="7" />
        </g>
      </g>
    </svg>
  );
}

function FlagCH() {
  return (
    <svg viewBox="0 0 512 512" className="about-location-flag-svg" aria-label="Switzerland Flag">
      <path fill="#d52b1e" d="M0 0h512v512H0z" />
      <g fill="#fff">
        <path d="M196 96h120v320H196z" />
        <path d="M96 196h320v120H96z" />
      </g>
    </svg>
  );
}

function FlagOM() {
  return (
    <svg viewBox="0 0 640 480" className="about-location-flag-svg" aria-label="Oman Flag">
      <path fill="#fff" d="M0 0h640v160H0z" />
      <path fill="#db161b" d="M0 160h640v160H0z" />
      <path fill="#008000" d="M0 320h640v160H0z" />
      <path fill="#db161b" d="M0 0h200v480H0z" />
      <g fill="#fff" transform="translate(100, 80) scale(0.45)">
        <circle cx="0" cy="-30" r="14" />
        <path d="M-6 -15 h12 v40 h-12 z" />
        <path d="M-25 5 L25 45 M25 5 L-25 45" stroke="#fff" strokeWidth="8" />
        <path d="M-5 25 Q0 55 15 50 Q5 35 -5 25" fill="#fff" />
      </g>
    </svg>
  );
}

function FlagPK() {
  return (
    <svg viewBox="0 0 640 480" className="about-location-flag-svg" aria-label="Pakistan Flag">
      <path fill="#01411c" d="M0 0h640v480H0z" />
      <path fill="#fff" d="M0 0h160v480H0z" />
      <g fill="#fff" transform="translate(400, 240) rotate(-40)">
        <path d="M0,-95 A100,100 0 1,0 85,85 A90,90 0 1,1 0,-95 Z" />
        <polygon points="45,-45 52,-25 73,-25 56,-12 62,9 45,-3 28,9 34,-12 17,-25 38,-25" fill="#fff" transform="translate(15, -15) scale(1.1)" />
      </g>
    </svg>
  );
}

const LOCATIONS = [
  { city: "United States", FlagComponent: FlagUS, role: "North America Operations & Client Strategy" },
  { city: "Switzerland", FlagComponent: FlagCH, role: "European Client Engagements" },
  { city: "Oman", FlagComponent: FlagOM, role: "Middle East Operations & Client Services" },
  { city: "Pakistan", FlagComponent: FlagPK, role: "Engineering & Technology Delivery Center" },
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
            Engineering custom web platforms, mobile apps, and intelligent automation
            systems for businesses across the United States, backed by dedicated
            global delivery hubs.
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
                    <span className="about-location-flag"><loc.FlagComponent /></span>
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
