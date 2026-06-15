import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PreFooter from "../components/PreFooter";

export const metadata = {
  title: "Blog | Projekts — Insights on Web, AI & Digital Growth",
  description:
    "Thoughts on web development, AI, mobile apps, and building digital products that scale. From the Projekts team.",
};

const POSTS = [
  {
    slug: "why-your-website-is-costing-you-clients",
    category: "Web Development",
    title: "Why Your Website Is Costing You Clients (And How to Fix It)",
    excerpt:
      "Most business websites fail silently. Slow load times, unclear value props, and weak CTAs drain conversions every day. Here's a practical audit checklist.",
    date: "Jun 10, 2025",
    readTime: "6 min read",
    featured: true,
  },
  {
    slug: "building-ai-that-actually-ships",
    category: "AI Solutions",
    title: "Building AI That Actually Ships: From Prototype to Production",
    excerpt:
      "90% of AI projects never reach production. The gap between a flashy demo and a deployed, monitored, reliable AI system is enormous. We explain how to close it.",
    date: "May 28, 2025",
    readTime: "9 min read",
    featured: false,
  },
  {
    slug: "react-native-vs-flutter-2025",
    category: "App Development",
    title: "React Native vs Flutter in 2025: An Honest Comparison",
    excerpt:
      "We've shipped apps in both. Here's what we actually think — performance benchmarks, developer experience, ecosystem maturity, and where each one wins.",
    date: "May 15, 2025",
    readTime: "7 min read",
    featured: false,
  },
  {
    slug: "the-roi-of-digital-strategy",
    category: "Digital Strategy",
    title: "The ROI of Digital Strategy: How to Justify the Investment",
    excerpt:
      "Strategy feels intangible until you see the numbers. We break down how to measure the impact of a well-executed digital transformation engagement.",
    date: "Apr 30, 2025",
    readTime: "5 min read",
    featured: false,
  },
  {
    slug: "nextjs-app-router-production",
    category: "Web Development",
    title: "Next.js App Router in Production: Lessons from Real Projects",
    excerpt:
      "We've migrated several large codebases to the App Router. Here are the gotchas, wins, and patterns we've settled on after months of production use.",
    date: "Apr 18, 2025",
    readTime: "8 min read",
    featured: false,
  },
  {
    slug: "llm-integration-patterns",
    category: "AI Solutions",
    title: "5 LLM Integration Patterns Every Developer Should Know",
    excerpt:
      "Beyond the basic API call — RAG, tool use, structured outputs, multi-step chains, and guardrails. The patterns that separate toy projects from real products.",
    date: "Apr 5, 2025",
    readTime: "11 min read",
    featured: false,
  },
];

const CATEGORY_COLORS = {
  "Web Development": { bg: "rgba(99,102,241,0.12)", text: "rgba(165,168,255,0.9)", border: "rgba(99,102,241,0.25)" },
  "AI Solutions": { bg: "rgba(16,185,129,0.1)", text: "rgba(110,231,183,0.9)", border: "rgba(16,185,129,0.22)" },
  "App Development": { bg: "rgba(245,158,11,0.1)", text: "rgba(253,211,133,0.9)", border: "rgba(245,158,11,0.22)" },
  "Digital Strategy": { bg: "rgba(236,72,153,0.1)", text: "rgba(249,168,212,0.9)", border: "rgba(236,72,153,0.22)" },
};

export default function BlogPage() {
  const featured = POSTS.find((p) => p.featured);
  const rest = POSTS.filter((p) => !p.featured);

  return (
    <main>
      <Navbar />

      <section className="blog-hero">
        <div className="blog-container">
          <div className="blog-hero-label">The Projekts Blog</div>
          <h1 className="blog-hero-title">
            Insights on building
            <br />
            <span className="blog-hero-accent">digital products that scale.</span>
          </h1>
          <p className="blog-hero-sub">
            Practical thoughts on web, AI, mobile, and strategy — from a team that ships.
          </p>
        </div>
      </section>

      {featured && (
        <section className="blog-featured-section">
          <div className="blog-container">
            <span className="blog-section-eyebrow">Featured</span>
            <article className="blog-featured-card">
              <div className="blog-featured-body">
                <div
                  className="blog-cat-pill"
                  style={{
                    background: CATEGORY_COLORS[featured.category]?.bg,
                    color: CATEGORY_COLORS[featured.category]?.text,
                    border: `1px solid ${CATEGORY_COLORS[featured.category]?.border}`,
                  }}
                >
                  {featured.category}
                </div>
                <h2 className="blog-featured-title">{featured.title}</h2>
                <p className="blog-featured-excerpt">{featured.excerpt}</p>
                <div className="blog-meta">
                  <span>{featured.date}</span>
                  <span className="blog-meta-dot" />
                  <span>{featured.readTime}</span>
                </div>
                <a href="#" className="blog-read-link">
                  Read Article
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7" /><path d="M7 7h10v10" />
                  </svg>
                </a>
              </div>
              <div className="blog-featured-visual">
                <div className="blog-featured-placeholder">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>
                  </svg>
                </div>
              </div>
            </article>
          </div>
        </section>
      )}

      <section className="blog-grid-section">
        <div className="blog-container">
          <span className="blog-section-eyebrow">All Articles</span>
          <div className="blog-grid">
            {rest.map((post) => {
              const col = CATEGORY_COLORS[post.category] || CATEGORY_COLORS["Web Development"];
              return (
                <article key={post.slug} className="blog-card">
                  <div className="blog-card-top">
                    <div
                      className="blog-cat-pill"
                      style={{ background: col.bg, color: col.text, border: `1px solid ${col.border}` }}
                    >
                      {post.category}
                    </div>
                  </div>
                  <h3 className="blog-card-title">{post.title}</h3>
                  <p className="blog-card-excerpt">{post.excerpt}</p>
                  <div className="blog-card-footer">
                    <div className="blog-meta">
                      <span>{post.date}</span>
                      <span className="blog-meta-dot" />
                      <span>{post.readTime}</span>
                    </div>
                    <a href="#" className="blog-card-link">
                      Read
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17L17 7" /><path d="M7 7h10v10" />
                      </svg>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <PreFooter />
      <Footer />

      <style>{`
        .blog-hero {
          padding: 140px 0 72px;
          text-align: center;
        }
        .blog-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 clamp(20px, 4vw, 48px);
        }
        .blog-hero-label {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--muted);
          border: 1px solid var(--border);
          padding: 6px 16px;
          border-radius: 999px;
          margin-bottom: 28px;
        }
        .blog-hero-title {
          font-family: var(--font-display);
          font-size: clamp(2.4rem, 5.5vw, 4rem);
          font-weight: 800;
          line-height: 1.08;
          letter-spacing: -0.04em;
          color: #fff;
          margin-bottom: 20px;
        }
        .blog-hero-accent {
          background: linear-gradient(135deg, #fff 0%, #a8a8b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .blog-hero-sub {
          font-size: 1.05rem;
          color: var(--silver);
          line-height: 1.6;
          max-width: 52ch;
          margin: 0 auto;
        }
        .blog-section-eyebrow {
          display: block;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 20px;
        }
        .blog-featured-section {
          padding: 0 0 64px;
          border-top: 1px solid var(--border);
        }
        .blog-featured-section .blog-container {
          padding-top: 56px;
        }
        .blog-featured-card {
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 0;
          border: 1px solid var(--border);
          border-radius: 20px;
          overflow: hidden;
          background: rgba(255,255,255,0.02);
          transition: border-color 0.3s ease;
        }
        .blog-featured-card:hover {
          border-color: rgba(255,255,255,0.12);
        }
        .blog-featured-body {
          padding: clamp(32px, 4vw, 52px);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .blog-cat-pill {
          display: inline-flex;
          align-items: center;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 5px 13px;
          border-radius: 999px;
          width: fit-content;
        }
        .blog-featured-title {
          font-family: var(--font-display);
          font-size: clamp(1.5rem, 2.5vw, 2rem);
          font-weight: 800;
          color: #fff;
          line-height: 1.2;
          letter-spacing: -0.02em;
          margin: 0;
        }
        .blog-featured-excerpt {
          font-size: 1rem;
          color: var(--silver);
          line-height: 1.65;
          max-width: 60ch;
          margin: 0;
        }
        .blog-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8125rem;
          color: var(--muted);
        }
        .blog-meta-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: var(--muted);
        }
        .blog-read-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #fff;
          margin-top: 8px;
          transition: gap 0.25s ease;
        }
        .blog-read-link:hover { gap: 10px; }
        .blog-featured-visual {
          background: rgba(255,255,255,0.02);
          border-left: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 280px;
        }
        .blog-featured-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .blog-grid-section {
          padding: 0 0 48px;
          border-top: 1px solid var(--border);
        }
        .blog-grid-section .blog-container {
          padding-top: 56px;
        }
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .blog-card {
          display: flex;
          flex-direction: column;
          padding: 28px 24px;
          border: 1px solid var(--border);
          border-radius: 16px;
          background: rgba(255,255,255,0.02);
          transition: border-color 0.3s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .blog-card:hover {
          border-color: rgba(255,255,255,0.12);
          transform: translateY(-3px);
        }
        .blog-card-top { margin-bottom: 14px; }
        .blog-card-title {
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 700;
          color: #fff;
          line-height: 1.35;
          letter-spacing: -0.01em;
          margin-bottom: 12px;
        }
        .blog-card-excerpt {
          font-size: 0.9rem;
          color: var(--silver);
          line-height: 1.65;
          flex: 1;
          margin-bottom: 20px;
        }
        .blog-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border-top: 1px solid var(--border);
          padding-top: 16px;
          margin-top: auto;
        }
        .blog-card-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--silver);
          white-space: nowrap;
          transition: color 0.25s ease, gap 0.25s ease;
        }
        .blog-card-link:hover { color: #fff; gap: 8px; }
        @media (max-width: 1024px) {
          .blog-featured-card { grid-template-columns: 1fr; }
          .blog-featured-visual { display: none; }
          .blog-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .blog-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}
