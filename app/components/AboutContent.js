"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const TEAM = [
  {
    name: "Zeeshan Khan",
    role: "Full-Stack Developer",
    title: "Head of Operations",
    initials: "ZK",
    skills: ["React", "Next.js", "Node.js", "AWS"],
    quote: "Code is poetry — when it ships on time.",
  },
  {
    name: "Umar Farooq",
    role: "Full-Stack Developer",
    title: "Co-Founder",
    initials: "UF",
    skills: ["React", "Python", "DevOps", "System Design"],
    quote: "Build it right, or build it twice.",
  },
  {
    name: "Bilal Ahmed",
    role: "Backend Dev & Digital Marketing",
    title: "Growth Lead",
    initials: "BA",
    skills: ["Node.js", "PostgreSQL", "SEO", "Analytics"],
    quote: "Data doesn't lie — listen to it.",
  },
  {
    name: "Malka Sanghroo",
    role: "UI/UX Designer",
    title: "Business Development Manager",
    initials: "MS",
    skills: ["Figma", "Branding", "User Research", "Strategy"],
    quote: "Design is how it works, not just how it looks.",
  },
];

const CLIENTS = [
  {
    name: "Glitz & Glamour",
    location: "United States",
    flag: "🇺🇸",
    desc: "Full-stack studio management platform with booking engine, AI chatbot, and contract automation.",
  },
  {
    name: "Saymamanpower",
    location: "Oman",
    flag: "🇴🇲",
    desc: "Enterprise workforce management system with recruitment pipelines and compliance tracking.",
  },
  {
    name: "Himalaya Security",
    location: "Pakistan",
    flag: "🇵🇰",
    desc: "Security operations platform with real-time guard tracking, incident reporting, and payroll integration.",
  },
  {
    name: "& Many More",
    location: "Switzerland · Pakistan · Global",
    flag: "🌍",
    desc: "Clients across fintech, healthcare, education, and e-commerce — from MVPs to enterprise-scale products.",
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
    desc: "We don't believe in perfection paralysis. We ship production-grade work in weeks — then iterate based on real data.",
  },
  {
    num: "02",
    title: "Radical Transparency",
    desc: "No surprises. Weekly demos, shared Slack channels, real-time project boards. You see everything we see.",
  },
  {
    num: "03",
    title: "Own the Outcome",
    desc: "We don't just write code and leave. We measure impact, track KPIs, and stay accountable for business results.",
  },
  {
    num: "04",
    title: "Global by Default",
    desc: "Operating across time zones has made us exceptional communicators. Async-first, always documented, always reachable.",
  },
];

export default function AboutContent() {
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
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
            We&apos;re a tight-knit crew of developers, designers, and strategists based in
            Pakistan and Oman — building digital products for clients across the US,
            Switzerland, and beyond.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="about-stats-bar about-animate" ref={statsRef}>
        {STATS.map((s) => (
          <div key={s.label} className="about-stat">
            <span className="about-stat-value">{s.value}</span>
            <span className="about-stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      <div className="section-connector"><span className="connector-glow" /></div>

      {/* Story */}
      <section className="about-section">
        <div className="about-container">
          <div className="about-story-grid">
            <div className="about-story-left about-animate">
              <span className="about-label">Our Story</span>
              <h2 className="about-heading">
                Born from freelancing.
                <br />Built for scale.
              </h2>
            </div>
            <div className="about-story-right about-animate">
              <p className="about-text">
                Projekts started the way most great things do — with a problem. We were freelancers
                frustrated by agencies that over-promised and under-delivered. So we built the agency
                we always wished existed: lean, technical, and obsessively focused on outcomes.
              </p>
              <p className="about-text">
                Today, we operate across Pakistan and Oman, serving clients from San Francisco to
                Zurich. Our size is our advantage — every project gets senior-level attention, direct
                communication with the people writing the code, and the agility of a startup.
              </p>
              <p className="about-text">
                We&apos;re not trying to be the biggest agency. We&apos;re trying to be the one you
                actually enjoy working with.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-connector"><span className="connector-glow" /></div>

      {/* Values */}
      <section className="about-section">
        <div className="about-container">
          <span className="about-label about-animate">How We Work</span>
          <h2 className="about-heading about-animate">Principles, not just processes.</h2>
          <div className="about-values-grid">
            {VALUES.map((v, i) => (
              <div key={v.num} className="about-value about-animate" style={{ transitionDelay: `${i * 100}ms` }}>
                <span className="about-value-num">{v.num}</span>
                <h3 className="about-value-title">{v.title}</h3>
                <p className="about-value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-connector"><span className="connector-glow" /></div>

      {/* Clients */}
      <section className="about-section">
        <div className="about-container">
          <span className="about-label about-animate">Global Clients</span>
          <h2 className="about-heading about-animate">
            Trusted across 4 countries.
          </h2>
          <div className="about-clients-grid">
            {CLIENTS.map((c, i) => (
              <div key={c.name} className="about-client about-animate" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="about-client-top">
                  <span className="about-client-flag">{c.flag}</span>
                  <div>
                    <h3 className="about-client-name">{c.name}</h3>
                    <span className="about-client-loc">{c.location}</span>
                  </div>
                </div>
                <p className="about-client-desc">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-connector"><span className="connector-glow" /></div>

      {/* Team */}
      <section className="about-section about-team-section">
        <div className="about-container about-container--center">
          <span className="about-label about-animate">The Team</span>
          <h2 className="about-heading about-heading--center about-animate">
            Small team. Senior talent. Zero fluff.
          </h2>
          <div className="about-team-grid">
            {TEAM.map((member, i) => (
              <div key={member.name} className="about-member about-animate" style={{ transitionDelay: `${i * 120}ms` }}>
                <div className="about-member-ring">
                  <div className="about-member-avatar">
                    <span>{member.initials}</span>
                  </div>
                </div>
                <h3 className="about-member-name">{member.name}</h3>
                <span className="about-member-role">{member.role}</span>
                <span className="about-member-title">{member.title}</span>
                <p className="about-member-quote">&ldquo;{member.quote}&rdquo;</p>
                <div className="about-member-skills">
                  {member.skills.map((s) => (
                    <span key={s} className="about-member-skill">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-connector"><span className="connector-glow" /></div>

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
            <a href="#contact" className="btn-primary">
              <span>Start a Conversation</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7" /><path d="M7 7h10v10" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
