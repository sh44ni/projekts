"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const STATS = [
  { value: "2+", label: "Years of Partnership" },
  { value: "100%", label: "Digital Contract Management" },
  { value: "24/7", label: "Online Lead Capture" },
  { value: "3", label: "Staff App Roles" },
];

const FEATURES = [
  {
    num: "01",
    title: "SEO-Optimized Website",
    desc: "A professional, search-optimized website built to rank for employer searches in Oman. Service pages, clear pricing structure, and trust signals designed for a market where credibility is everything.",
  },
  {
    num: "02",
    title: "Built-In Chatbot",
    desc: "Handles initial employer enquiries, answers common questions about the hiring process, visa requirements, and availability — and captures lead details without anyone needing to be at a desk.",
  },
  {
    num: "03",
    title: "Staff Mobile Apps",
    desc: "Separate app access for trainers, translators, and management. Each role sees only what they need. Progress logging, assignment management, and full visibility for the agency — no more WhatsApp coordination.",
  },
  {
    num: "04",
    title: "Accounting System",
    desc: "Tracks employer payments, staff costs, agency fees, and outstanding balances. Clean financial records with full history — replacing the spreadsheet and notebook system entirely.",
  },
  {
    num: "05",
    title: "Contract Management",
    desc: "Contracts created, managed, and stored digitally. Generate employer contracts, track status, set expiry reminders, and maintain a complete audit trail. No lost paperwork.",
  },
  {
    num: "06",
    title: "Social Media Marketing",
    desc: "Two years of consistent content, posting, and audience growth. Built the agency's digital presence from zero, generated employer enquiries, and established trust in a competitive market.",
  },
];

const STAFF_ROLES = [
  {
    role: "Trainers",
    what: "Log training progress for housemaids, track completion status, flag issues, and report readiness. Management sees every update without asking.",
  },
  {
    role: "Translators",
    what: "Manage translation assignments, track which contracts or communications need translation, mark completions, and handle scheduling — all from their phone.",
  },
  {
    role: "Management",
    what: "Full visibility across all staff activity. See trainer progress, translator workload, pending tasks, and operational bottlenecks in one dashboard.",
  },
];

const MARKETING_RESULTS = [
  { metric: "Content Strategy", detail: "Consistent posting schedule across platforms with content tailored to employer concerns — reliability, process transparency, and professionalism" },
  { metric: "Audience Growth", detail: "Built a following of employers and referral sources in Oman from zero, creating a pipeline that feeds directly into the website" },
  { metric: "Lead Generation", detail: "Social posts drive traffic to the website where the chatbot captures enquiries — connecting offline reputation with online conversion" },
  { metric: "Brand Trust", detail: "In a market where reputation is the primary buying factor, two years of consistent presence established Sayma as a visible and credible agency" },
];

export default function CaseStudySayma() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="cs-hero">
        <div className="cs-hero-inner">
          <div className="cs-hero-breadcrumb">
            <a href="/#case-studies">Case Studies</a>
            <span className="cs-hero-sep">/</span>
            <span>Sayma Manpower</span>
          </div>
          <div className="cs-hero-badge">Digital Transformation</div>
          <h1 className="cs-hero-title">
            Taking an Offline Agency<br />
            <span className="cs-hero-accent">Fully Digital</span>
          </h1>
          <p className="cs-hero-subtitle">
            How we built a complete digital backbone for a traditional housemaid supply agency in Oman —
            website, staff apps, contracts, accounting, and two years of marketing that built the pipeline from scratch.
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

      {/* The Business */}
      <section className="cs-section">
        <div className="cs-container">
          <div className="cs-two-col">
            <div className="cs-col-label">
              <span className="cs-label">The Business</span>
            </div>
            <div className="cs-col-content">
              <h2 className="cs-heading">A housemaid supply agency operating entirely offline</h2>
              <p className="cs-text">
                Sayma Manpower connects employers in Oman with domestic staff. It&rsquo;s a service business
                built on trust, personal relationships, and word of mouth. The agency handles everything —
                sourcing, training, contracts, visa coordination, and placement.
              </p>
              <p className="cs-text">
                Before we started, the entire operation ran on paper and phone calls. Contracts were
                physical documents. Training records lived in notebooks. Translators coordinated over
                WhatsApp. Accounting was a spreadsheet that sometimes got updated.
              </p>
              <p className="cs-text">
                There was no website. No way for employers searching online to find them.
                No system to manage the moving parts of an agency that coordinates across multiple
                staff roles, languages, and timelines. The business worked — but it worked hard for every client,
                and there was no infrastructure to grow beyond what one person could hold in their head.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-connector"><span className="connector-glow" /></div>

      {/* The Problem */}
      <section className="cs-section">
        <div className="cs-container">
          <div className="cs-two-col">
            <div className="cs-col-label">
              <span className="cs-label">The Problem</span>
            </div>
            <div className="cs-col-content">
              <h2 className="cs-heading">Everything was manual, disconnected, and invisible</h2>
              <p className="cs-text">
                <strong>No online presence.</strong> Employers looking for housemaid services in Oman had no way
                to find Sayma through search. The agency relied entirely on personal referrals and existing
                relationships. That works — until your competitors show up on Google.
              </p>
              <p className="cs-text">
                <strong>No staff coordination system.</strong> Trainers, translators, and management had no shared
                platform. Updates happened over phone calls and group chats. Information got lost, repeated,
                or delayed. Nobody had a clear picture of where things stood.
              </p>
              <p className="cs-text">
                <strong>No contract management.</strong> Contracts were paper documents. Finding a specific contract
                meant digging through files. Tracking expiry dates meant remembering — or forgetting.
              </p>
              <p className="cs-text">
                <strong>No accounting structure.</strong> Payments, costs, and balances were tracked manually.
                Financial visibility was limited to whoever was doing the tracking, and only if they were up to date.
              </p>
              <p className="cs-text cs-text--muted">
                The agency didn&rsquo;t need to become a tech company. It needed tools that worked the way
                the business already worked — just without the paper, the guesswork, and the information gaps.
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
            <h2 className="cs-heading">A digital backbone for an offline business</h2>
            <p className="cs-text" style={{ maxWidth: 640 }}>
              We didn&rsquo;t try to change how Sayma operates. We built systems around how the business
              actually works — then removed the friction.
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

      {/* Staff Apps Deep Dive */}
      <section className="cs-section">
        <div className="cs-container">
          <div className="cs-agent-block">
            <div className="cs-agent-left">
              <span className="cs-label">Staff Mobile Apps</span>
              <h2 className="cs-heading">Built for how the team actually works</h2>
              <p className="cs-text">
                The agency has different staff doing different jobs in different locations. A centralized
                dashboard doesn&rsquo;t work when a trainer is at a training facility and a translator is at an
                embassy. Each role needed their own view — with management seeing everything.
              </p>
            </div>
            <div className="cs-agent-right">
              {STAFF_ROLES.map((r) => (
                <div key={r.role} className="cs-agent-card">
                  <h4 className="cs-agent-card-title">{r.role}</h4>
                  <p className="cs-text" style={{ marginBottom: 0 }}>{r.what}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="section-connector"><span className="connector-glow" /></div>

      {/* Contract & Accounting */}
      <section className="cs-section">
        <div className="cs-container">
          <div className="cs-two-col">
            <div className="cs-col-label">
              <span className="cs-label">Operations</span>
              <h2 className="cs-heading">Contracts and accounting, cleaned up</h2>
            </div>
            <div className="cs-col-content">
              <h3 className="cs-flow-title" style={{ marginBottom: 16 }}>Contract Management</h3>
              <p className="cs-text">
                Every contract is now created, stored, and managed digitally. The agency generates contracts
                for each employer placement, tracks whether they&rsquo;re pending, signed, active, or expired,
                and sets automatic reminders before renewal dates. There&rsquo;s a full searchable history —
                no more filing cabinets, no more lost documents.
              </p>
              <p className="cs-text" style={{ marginBottom: 32 }}>
                When a contract needs attention — expiring soon, payment overdue, missing signature — the
                system surfaces it. The agency doesn&rsquo;t need to remember. The system remembers.
              </p>

              <h3 className="cs-flow-title" style={{ marginBottom: 16 }}>Accounting System</h3>
              <p className="cs-text">
                Payments from employers, costs for staff, agency fees, and outstanding balances are all tracked
                in one system. Every transaction has a record. Every balance is current. The agency can see
                exactly what&rsquo;s owed, what&rsquo;s been paid, and what&rsquo;s outstanding — without opening a spreadsheet.
              </p>
              <p className="cs-text">
                This isn&rsquo;t enterprise accounting software. It&rsquo;s built specifically for how a manpower
                agency handles money — employer deposits, placement fees, staff payouts, and the agency&rsquo;s
                cut. Simple, clear, and accurate.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-connector"><span className="connector-glow" /></div>

      {/* Marketing */}
      <section className="cs-section">
        <div className="cs-container">
          <div className="cs-analytics-header">
            <span className="cs-label">Social Media Marketing</span>
            <h2 className="cs-heading">Two years of building presence in a traditional market</h2>
            <p className="cs-text" style={{ maxWidth: 640 }}>
              In the manpower industry in Oman, trust is the product. Employers need to believe the agency
              is reliable before they make a call. Two years of consistent social media presence built that trust
              from zero.
            </p>
          </div>
          <div className="cs-analytics-grid">
            {MARKETING_RESULTS.map((a) => (
              <div key={a.metric} className="cs-analytics-item">
                <h4 className="cs-analytics-metric">{a.metric}</h4>
                <p className="cs-analytics-detail">{a.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-connector"><span className="connector-glow" /></div>

      {/* The Website */}
      <section className="cs-section">
        <div className="cs-container">
          <div className="cs-two-col">
            <div className="cs-col-label">
              <span className="cs-label">The Website</span>
            </div>
            <div className="cs-col-content">
              <h2 className="cs-heading">The front door the agency never had</h2>
              <p className="cs-text">
                Before the website, the only way to find Sayma Manpower was through someone who already
                knew them. Now, employers searching for housemaid services in Oman find the agency on Google.
              </p>
              <p className="cs-text">
                The site is built for search — structured metadata, service-specific pages, and content
                designed around the terms employers actually search for. It&rsquo;s not a brochure. It&rsquo;s a lead generation tool.
              </p>
              <p className="cs-text">
                The chatbot sits on every page. When an employer has a question — about the process,
                availability, pricing, or requirements — the bot handles it immediately. It captures their
                details, answers what it can, and passes qualified leads to the team. This runs at midnight
                the same as it runs at noon.
              </p>
              <p className="cs-text cs-text--muted">
                For an agency that previously had zero digital presence, the website became the single
                biggest source of new employer enquiries within the first year.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-connector"><span className="connector-glow" /></div>

      {/* The Result */}
      <section className="cs-section">
        <div className="cs-container">
          <div className="cs-result">
            <span className="cs-label">The Result</span>
            <h2 className="cs-heading cs-heading--large">A fully operational digital backbone</h2>
            <div className="cs-result-grid">
              <div className="cs-result-item">
                <h4>Employers find them online</h4>
                <p>SEO-optimized website with a chatbot that captures leads 24/7. No more relying solely on word of mouth.</p>
              </div>
              <div className="cs-result-item">
                <h4>Staff work from their phones</h4>
                <p>Trainers, translators, and management each have their own app access. Updates happen in real time, not over group chats.</p>
              </div>
              <div className="cs-result-item">
                <h4>Contracts are clean and traceable</h4>
                <p>Every contract is digital, searchable, and tracked. Expiry reminders, status tracking, and full history — no paper.</p>
              </div>
              <div className="cs-result-item">
                <h4>Accounts are in order</h4>
                <p>Payments, costs, and balances tracked in one system. Clean records that don&rsquo;t depend on a spreadsheet being current.</p>
              </div>
            </div>
            <div className="cs-result-quote">
              <p>
                <strong>What was built:</strong> A complete digital infrastructure for a traditional service agency — website, staff apps, contract management, accounting, and marketing.<br />
                <strong>What it replaced:</strong> Paper contracts, WhatsApp coordination, manual accounting, and zero online visibility.<br />
                <strong>What it delivered:</strong> An agency that operates with structure, visibility, and a growing pipeline — without changing how the business fundamentally works.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="prefooter">
        <div className="prefooter-inner">
          <span className="prefooter-eyebrow">Running on paper?</span>
          <h2 className="prefooter-heading">
            Let&rsquo;s Build Your<br />
            <span className="prefooter-accent">Digital Backbone.</span>
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
