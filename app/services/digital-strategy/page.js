import ServicePageLayout from "../../components/ServicePageLayout";

export const metadata = {
  title: "Digital Strategy & Consulting — Projekts | Growth-Driven Strategy",
  description:
    "Projekts provides data-driven digital strategy, UX audits, SEO optimization, and technical consulting to align technology with your business goals.",
  openGraph: {
    title: "Digital Strategy & Consulting — Projekts",
    description: "Data-driven strategy that turns technology into competitive advantage.",
  },
};

const DATA = {
  title: "Digital Strategy",
  subtitle:
    "Data-driven growth plans, UX audits, and technical consulting that align your technology investments with measurable business outcomes.",
  description: {
    heading: "Strategy that pays for itself.",
    paragraphs: [
      "Technology without strategy is just expensive experimentation. We help you cut through the noise — identifying the highest-impact opportunities, eliminating waste, and building a technical roadmap that directly maps to revenue growth.",
      "Our strategy engagements have helped startups find product-market fit, enterprises modernize legacy systems, and growth-stage companies scale without breaking. Every recommendation is backed by data, benchmarked against industry standards, and tied to measurable KPIs.",
    ],
  },
  features: {
    heading: "Clarity, direction, and measurable impact.",
    items: [
      { title: "Technical Audits", desc: "Comprehensive analysis of your codebase, infrastructure, security posture, and technical debt — with a prioritized remediation plan." },
      { title: "UX Research & Audits", desc: "User interviews, heuristic evaluations, heatmap analysis, and conversion funnel optimization to maximize engagement." },
      { title: "SEO & Content Strategy", desc: "Technical SEO audits, keyword research, content calendars, and structured data implementation for organic growth." },
      { title: "Digital Transformation", desc: "Legacy system modernization roadmaps, cloud migration strategies, and phased implementation plans." },
      { title: "Growth Engineering", desc: "A/B testing frameworks, analytics architecture, funnel optimization, and data-driven experimentation programs." },
      { title: "CTO-as-a-Service", desc: "Part-time technical leadership for startups — architecture decisions, team hiring, vendor evaluation, and technology governance." },
    ],
  },
  process: {
    heading: "From insight to execution in 4 phases.",
    steps: [
      { title: "Stakeholder Interviews", desc: "Deep conversations with leadership, product teams, and end users to understand goals, constraints, and organizational dynamics." },
      { title: "Data Collection & Analysis", desc: "Analytics audit, competitive benchmarking, user research, and technical assessment to establish a factual baseline." },
      { title: "Strategy Development", desc: "A comprehensive roadmap with prioritized initiatives, resource requirements, timelines, and expected ROI for each workstream." },
      { title: "Execution Support", desc: "Hands-on implementation support, vendor management, team coaching, and monthly progress reviews against defined KPIs." },
    ],
  },
  techStack: {
    heading: "Tools we recommend and implement.",
    items: ["Google Analytics 4", "Mixpanel", "Hotjar", "Ahrefs", "Semrush", "Figma", "Notion", "Linear", "Amplitude", "Segment", "LaunchDarkly", "Datadog", "Cloudflare", "Webflow", "HubSpot", "Zapier"],
  },
  faqs: [
    { q: "What's included in a strategy engagement?", a: "A typical engagement includes stakeholder interviews, competitive analysis, technical audit, user research, and a comprehensive strategy document with a prioritized roadmap." },
    { q: "How long does a strategy project take?", a: "Most strategy engagements take 4-8 weeks. Focused audits (SEO, UX, technical) can be completed in 2-3 weeks." },
    { q: "Can you also execute the strategy?", a: "Absolutely. Most clients engage us for both strategy and execution. We can build in-house, manage vendors, or augment your existing team." },
    { q: "What if we already have a tech team?", a: "We work alongside your team — providing strategic direction, architecture guidance, and specialized expertise without replacing anyone." },
    { q: "How do you measure success?", a: "Every strategy includes defined KPIs tied to business outcomes — revenue, conversion rates, engagement metrics, operational efficiency. We track progress monthly." },
    { q: "Is this just a PowerPoint deck?", a: "No. Every deliverable is actionable — detailed implementation specs, wireframes, technical architectures, and prioritized backlogs. We build strategies that ship." },
  ],
  ctaText: "Ready to Accelerate Your",
};

export default function DigitalStrategyPage() {
  return <ServicePageLayout {...DATA} />;
}
