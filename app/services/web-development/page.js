import ServicePageLayout from "../../components/ServicePageLayout";

export const metadata = {
  title: "Web Development Services — Projekts | Custom Web Apps & Platforms",
  description:
    "Projekts builds high-performance web applications, e-commerce platforms, and custom SaaS solutions using React, Next.js, and Node.js. Get a free consultation.",
  openGraph: {
    title: "Web Development Services — Projekts",
    description: "Custom web applications built for scale, speed, and conversion.",
  },
};

const DATA = {
  title: "Web Development",
  subtitle:
    "High-performance web applications, e-commerce platforms, and bespoke digital experiences — engineered for scale and built for conversion.",
  description: {
    heading: "Websites that work as hard as you do.",
    paragraphs: [
      "We don't build brochure sites. We engineer performant, accessible, and conversion-optimized web platforms that become the backbone of your digital operations. Every project starts with deep strategic alignment — understanding your users, your funnels, and your growth targets.",
      "From custom CMS-powered marketing sites to full-stack SaaS dashboards, our development process is transparent, iterative, and laser-focused on measurable outcomes. We ship production-grade code with CI/CD pipelines, automated testing, and infrastructure-as-code from day one.",
    ],
  },
  features: {
    heading: "Everything you need. Nothing you don't.",
    items: [
      { title: "Custom Web Applications", desc: "Full-stack applications with real-time features, authentication, role-based access, and third-party integrations." },
      { title: "E-Commerce Platforms", desc: "Headless commerce solutions with Shopify, Stripe, and custom checkout flows optimized for conversion." },
      { title: "Progressive Web Apps", desc: "Offline-capable, installable web apps with native-like performance and push notifications." },
      { title: "CMS & Content Platforms", desc: "Custom content management systems with intuitive admin panels, WYSIWYG editors, and multi-language support." },
      { title: "Performance Optimization", desc: "Core Web Vitals audits, lazy loading, image optimization, CDN setup, and sub-second load times." },
      { title: "API Development", desc: "RESTful and GraphQL APIs with comprehensive documentation, rate limiting, and webhook integrations." },
    ],
  },
  process: {
    heading: "From concept to production in weeks, not months.",
    steps: [
      { title: "Discovery & Strategy", desc: "We audit your current stack, map user journeys, and define technical requirements with clear success metrics." },
      { title: "Architecture & Design", desc: "Database modeling, system design, component libraries, and interactive prototypes — all validated before code begins." },
      { title: "Sprint Development", desc: "Two-week sprints with weekly demos. You see progress in real-time and can course-correct instantly." },
      { title: "QA & Launch", desc: "Automated testing, performance benchmarks, security audits, and a zero-downtime deployment to production." },
      { title: "Post-Launch Support", desc: "Monitoring, analytics integration, bug fixes, and iterative improvements based on real user data." },
    ],
  },
  techStack: {
    heading: "Modern tools. Battle-tested reliability.",
    items: ["React", "Next.js", "Node.js", "TypeScript", "PostgreSQL", "MongoDB", "Redis", "AWS", "Vercel", "Docker", "GraphQL", "Prisma", "Tailwind CSS", "Stripe", "Auth0", "GitHub Actions"],
  },
  faqs: [
    { q: "How long does a typical web project take?", a: "Most projects take 6-12 weeks from kickoff to launch, depending on scope. We'll provide a detailed timeline during discovery." },
    { q: "Do you work with existing codebases?", a: "Absolutely. We frequently take over, refactor, and scale existing projects. We'll audit your code first and provide an honest assessment." },
    { q: "What's your pricing model?", a: "We offer both fixed-price projects and retainer-based engagements. Most web projects start at $15,000. We'll scope everything transparently before any commitment." },
    { q: "Do you handle hosting and deployment?", a: "Yes. We set up production infrastructure on AWS, Vercel, or your preferred provider with CI/CD, monitoring, and auto-scaling." },
    { q: "Will I own the code?", a: "100%. You own all source code, assets, and intellectual property. Full transfer on project completion." },
    { q: "Can you integrate with our existing tools?", a: "Yes — CRMs, ERPs, payment processors, analytics platforms, marketing tools. We've integrated with hundreds of third-party services." },
  ],
  ctaText: "Ready to Build Your",
};

export default function WebDevelopmentPage() {
  return <ServicePageLayout {...DATA} />;
}
