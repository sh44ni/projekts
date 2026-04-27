"use client";

import { useRef, useEffect, useState } from "react";

const PILLARS = [
  {
    num: "01",
    title: "Custom, Not Templates",
    desc: "Every project is built from scratch around how your business actually works. No page builders, no plugins that break.",
  },
  {
    num: "02",
    title: "AI That Does Real Work",
    desc: "Chatbots trained on your business, booking agents that replace manual workflows, predictive analytics — not gimmicks.",
  },
  {
    num: "03",
    title: "One Team, Start to Finish",
    desc: "Design, development, deployment, and ongoing support. You talk to the people building your product, not a project manager.",
  },
  {
    num: "04",
    title: "We Ship, Then Improve",
    desc: "Working software in weeks, not months. We iterate based on real usage data, not assumptions.",
  },
];

const STATS = [
  { value: "15+", label: "Projects Shipped" },
  { value: "4", label: "Countries Served" },
  { value: "2+", label: "Years Running" },
  { value: "24/7", label: "Client Support" },
];

function AnimatedStat({ value, inView }) {
  return (
    <span className={`why-stat-value ${inView ? "visible" : ""}`}>
      {value}
    </span>
  );
}

export default function WhyChooseUs() {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="why-section" id="why" ref={sectionRef}>
      <div className="why-inner">
        {/* Left — bold statement */}
        <div className="why-statement-col">
          <span className="why-eyebrow">Why Projekts</span>
          <h2 className="why-statement">
            We don&apos;t hand you a website and disappear.
            <span className="why-statement-accent"> We build systems that run your operations.</span>
          </h2>
        </div>

        {/* Right — value pillars */}
        <div className="why-pillars-col">
          {PILLARS.map((p, i) => (
            <div
              key={p.num}
              className={`why-pillar ${inView ? "visible" : ""}`}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <span className="why-pillar-num">{p.num}</span>
              <div className="why-pillar-text">
                <h3 className="why-pillar-title">{p.title}</h3>
                <p className="why-pillar-desc">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="why-stats">
        {STATS.map((s) => (
          <div key={s.label} className="why-stat">
            <AnimatedStat value={s.value} inView={inView} />
            <span className="why-stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
