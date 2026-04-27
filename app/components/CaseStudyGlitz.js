"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const STATS = [
  { value: "+180%", label: "Online Bookings" },
  { value: "0", label: "Manual DMs Required" },
  { value: "24/7", label: "Booking Availability" },
  { value: "100%", label: "Automated Notifications" },
];

const FEATURES = [
  {
    num: "01",
    title: "Booking System",
    desc: "Full calendar-based booking engine. Clients pick a service, choose an available time slot, and confirm — all without sending a single DM. Handles availability automatically based on staff schedules, service durations, and existing appointments.",
  },
  {
    num: "02",
    title: "Loyalty Card System",
    desc: "Digital loyalty cards with Apple Wallet and Google Wallet integration. Stamps update in real time. Clients carry their card on their phone and earn rewards automatically after hitting the threshold.",
  },
  {
    num: "03",
    title: "AI Booking Agent",
    desc: "Fully trained on the business — handles service enquiries, provides pricing, checks real-time availability, and captures bookings without any staff involvement. This replaced the Instagram DM workflow entirely.",
  },
  {
    num: "04",
    title: "SEO Website & Blog",
    desc: "Service pages, pricing, and a blog built to pull in organic traffic. Metadata structured for search engines. Not decorative — built to be a client acquisition tool.",
  },
  {
    num: "05",
    title: "SMS & Email Notifications",
    desc: "Automated at every stage — booking confirmation, reminders, post-appointment follow-ups with loyalty updates, and staff alerts. Both clients and team stay informed without manual effort.",
  },
  {
    num: "06",
    title: "Admin Dashboard",
    desc: "Full control for the owner — swap website photos, manage bookings, view client data, publish blogs, set discount codes, and read analytics. No developer needed for daily operations.",
  },
];

const ANALYTICS = [
  { metric: "Booking Volume & Trends", detail: "Daily, weekly, monthly counts with trendlines and period comparisons" },
  { metric: "Revenue by Service", detail: "Which services generate the most revenue — not just the most bookings" },
  { metric: "Loyalty Stamp Activity", detail: "Stamps issued, clients near rewards, and redemption rates" },
  { metric: "New vs. Returning Clients", detail: "Growth ratio showing whether the base is expanding or just retaining" },
  { metric: "Staff Utilization", detail: "How booked each team member is — drives scheduling decisions" },
  { metric: "Peak Booking Hours", detail: "When clients book and show up — informs staffing and promotions" },
  { metric: "Discount Code Performance", detail: "Usage rates, total value given, and return visit correlation" },
  { metric: "SMS & Email Engagement", detail: "Delivery rates, opens, and click-throughs across all notifications" },
];

const FLOW_STEPS = [
  { step: "Discovery", desc: "Client finds Glitz & Glamour through Google, social media, or a direct link and lands on the website." },
  { step: "Interaction", desc: "Browses services, checks pricing, and engages with the AI booking agent for questions." },
  { step: "Booking", desc: "Selects a service, picks a time slot, and confirms. No waiting for a reply." },
  { step: "Confirmation", desc: "Instant SMS and email with date, time, service, and location. Staff notified simultaneously." },
  { step: "Reminder", desc: "Automated SMS reminder before the appointment. This alone cut no-shows significantly." },
  { step: "Loyalty Stamp", desc: "After the appointment, a stamp is added to their digital wallet card automatically." },
  { step: "Repeat", desc: "The client is building toward a reward. They're in the system. The relationship is maintained without manual effort." },
];

export default function CaseStudyGlitz() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="cs-hero">
        <div className="cs-hero-inner">
          <div className="cs-hero-breadcrumb">
            <a href="/#case-studies">Case Studies</a>
            <span className="cs-hero-sep">/</span>
            <span>Glitz &amp; Glamour</span>
          </div>
          <div className="cs-hero-badge">Booking Platform</div>
          <h1 className="cs-hero-title">
            From Instagram DMs to a<br />
            <span className="cs-hero-accent">Fully Integrated Platform</span>
          </h1>
          <p className="cs-hero-subtitle">
            How we replaced manual bookings, paper loyalty cards, and guesswork analytics with a complete
            business operating system for a growing beauty brand.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="cs-stats">
        {STATS.map((s) => (
          <div key={s.label} className="cs-stat">
            <span className="cs-stat-value">{s.value}</span>
            <span className="cs-stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* The Problem */}
      <section className="cs-section">
        <div className="cs-container">
          <div className="cs-two-col">
            <div className="cs-col-label">
              <span className="cs-label">The Problem</span>
            </div>
            <div className="cs-col-content">
              <h2 className="cs-heading">Everything ran on Instagram DMs and memory</h2>
              <p className="cs-text">
                Glitz &amp; Glamour had a loyal client base and a growing reputation. But behind the scenes,
                the operation was held together with direct messages and a personal calendar.
              </p>
              <p className="cs-text">
                Every booking came through DMs. The owner would read the request, check her calendar,
                respond with available times, confirm, and hope the client showed up. There was no automated
                reminder. No confirmation email. No fallback if a message got buried under 40 others.
              </p>
              <p className="cs-text">
                Loyalty tracking was nonexistent. Repeat clients — the ones keeping the business alive —
                got no recognition beyond a friendly greeting. Revenue was tracked in a notebook. There was
                no visibility into peak hours, popular services, or client retention rates.
              </p>
              <p className="cs-text cs-text--muted">
                This isn&rsquo;t a criticism — it&rsquo;s how most small beauty businesses operate. But it creates a ceiling.
                You can&rsquo;t scale what you can&rsquo;t see, and you can&rsquo;t grow what you&rsquo;re manually holding together.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-connector"><span className="connector-glow" /></div>

      {/* The Solution */}
      <section className="cs-section">
        <div className="cs-container">
          <div className="cs-solution-header">
            <span className="cs-label">The Solution</span>
            <h2 className="cs-heading">A complete platform, not a template</h2>
            <p className="cs-text" style={{ maxWidth: 640 }}>
              We built a custom system on <strong>Next.js</strong> and <strong>Node.js</strong>, mobile-first throughout.
              Every screen, every interaction, every notification was built assuming the client is on their phone — because they are.
            </p>
          </div>
          <div className="cs-features-grid">
            {FEATURES.map((f) => (
              <div key={f.num} className="cs-feature">
                <span className="cs-feature-num">{f.num}</span>
                <h3 className="cs-feature-title">{f.title}</h3>
                <p className="cs-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-connector"><span className="connector-glow" /></div>

      {/* Booking Flow */}
      <section className="cs-section">
        <div className="cs-container">
          <div className="cs-two-col">
            <div className="cs-col-label">
              <span className="cs-label">The Flow</span>
              <h2 className="cs-heading">Client journey,<br />end to end</h2>
            </div>
            <div className="cs-col-content">
              <div className="cs-flow">
                {FLOW_STEPS.map((f, i) => (
                  <div key={f.step} className="cs-flow-step">
                    <div className="cs-flow-marker">
                      <span className="cs-flow-num">{String(i + 1).padStart(2, "0")}</span>
                      {i < FLOW_STEPS.length - 1 && <div className="cs-flow-line" />}
                    </div>
                    <div className="cs-flow-content">
                      <h3 className="cs-flow-title">{f.step}</h3>
                      <p className="cs-flow-desc">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-connector"><span className="connector-glow" /></div>

      {/* The Booking Agent */}
      <section className="cs-section">
        <div className="cs-container">
          <div className="cs-agent-block">
            <div className="cs-agent-left">
              <span className="cs-label">The Booking Agent</span>
              <h2 className="cs-heading">The feature that made the biggest operational difference</h2>
              <p className="cs-text">
                An AI assistant fully trained on Glitz &amp; Glamour&rsquo;s business. It knows every service,
                every price point, the team&rsquo;s availability, and the policies around cancellations, deposits,
                and special requests.
              </p>
            </div>
            <div className="cs-agent-right">
              <div className="cs-agent-card">
                <h4 className="cs-agent-card-title">What it handles</h4>
                <ul className="cs-agent-list">
                  <li>Answers service questions with full business context</li>
                  <li>Provides real-time pricing without menu digging</li>
                  <li>Checks availability and suggests open slots</li>
                  <li>Captures full bookings — service, time, client details</li>
                  <li>Handles enquiries about events, promotions, and gift cards</li>
                </ul>
              </div>
              <div className="cs-agent-card cs-agent-card--highlight">
                <h4 className="cs-agent-card-title">What it replaced</h4>
                <p className="cs-text" style={{ marginBottom: 0 }}>
                  The Instagram DM workflow. Every question that used to sit in an inbox waiting for a human
                  response now gets answered instantly. The agent doesn&rsquo;t sleep. It handles enquiries at
                  2 AM the same way it handles them at 2 PM.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-connector"><span className="connector-glow" /></div>

      {/* Analytics */}
      <section className="cs-section">
        <div className="cs-container">
          <div className="cs-analytics-header">
            <span className="cs-label">Analytics Dashboard</span>
            <h2 className="cs-heading">Every metric a business owner actually asks about</h2>
          </div>
          <div className="cs-analytics-grid">
            {ANALYTICS.map((a) => (
              <div key={a.metric} className="cs-analytics-item">
                <h4 className="cs-analytics-metric">{a.metric}</h4>
                <p className="cs-analytics-detail">{a.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-connector"><span className="connector-glow" /></div>

      {/* The Result */}
      <section className="cs-section">
        <div className="cs-container">
          <div className="cs-result">
            <span className="cs-label">The Result</span>
            <h2 className="cs-heading cs-heading--large">One platform. Everything connected.</h2>
            <div className="cs-result-grid">
              <div className="cs-result-item">
                <h4>Bookings run 24/7</h4>
                <p>Without anyone managing them manually. Clients book when it&rsquo;s convenient for them.</p>
              </div>
              <div className="cs-result-item">
                <h4>Loyalty drives repeat visits</h4>
                <p>Zero manual effort. Clients carry their card on their phone and know what they&rsquo;re working toward.</p>
              </div>
              <div className="cs-result-item">
                <h4>Full business visibility</h4>
                <p>Which services perform, which promotions work, whether the client base is growing. She had none of this before.</p>
              </div>
              <div className="cs-result-item">
                <h4>Self-service management</h4>
                <p>Photos, blogs, events, and promotions — all controlled from one panel without touching code.</p>
              </div>
            </div>
            <div className="cs-result-quote">
              <p>
                <strong>What was built:</strong> A complete business operating system — not just a website.<br />
                <strong>What it replaced:</strong> Instagram DMs, manual calendars, paper loyalty cards, and guesswork analytics.<br />
                <strong>What it delivered:</strong> A business that runs whether the owner is at her desk or not.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="prefooter">
        <div className="prefooter-inner">
          <span className="prefooter-eyebrow">Outgrown your tools?</span>
          <h2 className="prefooter-heading">
            Let&rsquo;s Build Your<br />
            <span className="prefooter-accent">Platform.</span>
          </h2>
          <div className="prefooter-cta">
            <a href="/#contact" className="btn-primary">
              <span>Start a Project</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7" /><path d="M7 7h10v10" />
              </svg>
            </a>
            <a href="/#contact" className="btn-outline"><span>Book a Call</span></a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
