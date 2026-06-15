import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "Privacy Policy | Projekts",
  description:
    "How Projekts collects, uses, and protects your personal information.",
};

const LAST_UPDATED = "June 1, 2025";

export default function PrivacyPolicyPage() {
  return (
    <main>
      <Navbar />

      <section className="legal-hero">
        <div className="legal-container">
          <span className="legal-eyebrow">Legal</span>
          <h1 className="legal-title">Privacy Policy</h1>
          <p className="legal-date">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      <section className="legal-body">
        <div className="legal-container legal-content">
          <div className="legal-section">
            <h2>1. Introduction</h2>
            <p>
              Projekts (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) operates the website at projekts.co (the &ldquo;Site&rdquo;). This
              Privacy Policy explains how we collect, use, disclose, and safeguard your information
              when you visit our Site or engage us for services. Please read it carefully.
            </p>
          </div>

          <div className="legal-section">
            <h2>2. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul>
              <li>
                <strong>Contact information</strong> — name, email address, phone number, and
                company name when you submit an inquiry or contact form.
              </li>
              <li>
                <strong>Project details</strong> — information you voluntarily share about your
                project scope, requirements, or business when engaging with us.
              </li>
              <li>
                <strong>Usage data</strong> — pages visited, time spent on pages, referring URLs,
                and browser/device type, collected via Google Analytics.
              </li>
              <li>
                <strong>Communication records</strong> — emails, messages, and call notes from
                our conversations with you.
              </li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>3. How We Use Your Information</h2>
            <p>We use collected information to:</p>
            <ul>
              <li>Respond to your inquiries and provide project proposals</li>
              <li>Deliver contracted services and manage client projects</li>
              <li>Send transactional communications related to your engagement</li>
              <li>Improve our website content and user experience</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p>
              We do not sell, rent, or trade your personal information to third parties for
              marketing purposes.
            </p>
          </div>

          <div className="legal-section">
            <h2>4. Cookies & Analytics</h2>
            <p>
              We use Google Analytics to understand how visitors interact with our Site. Google
              Analytics uses cookies — small text files stored on your device — to collect usage
              data. You can opt out via the{" "}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Analytics Opt-out Browser Add-on
              </a>
              .
            </p>
          </div>

          <div className="legal-section">
            <h2>5. Data Retention</h2>
            <p>
              We retain personal information for as long as necessary to fulfill the purposes
              outlined in this policy, unless a longer retention period is required by law. Client
              project data is retained for a minimum of 3 years following project completion.
            </p>
          </div>

          <div className="legal-section">
            <h2>6. Data Security</h2>
            <p>
              We implement appropriate technical and organisational measures to protect your
              personal information. However, no method of transmission over the internet is 100%
              secure, and we cannot guarantee absolute security.
            </p>
          </div>

          <div className="legal-section">
            <h2>7. Third-Party Links</h2>
            <p>
              Our Site may contain links to third-party websites. We are not responsible for the
              privacy practices of those sites and encourage you to review their policies.
            </p>
          </div>

          <div className="legal-section">
            <h2>8. Your Rights</h2>
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul>
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to or restrict processing of your data</li>
            </ul>
            <p>
              To exercise these rights, contact us at{" "}
              <a href="mailto:hello@projekts.co">hello@projekts.co</a>.
            </p>
          </div>

          <div className="legal-section">
            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this
              page with an updated revision date. Continued use of the Site after changes
              constitutes acceptance.
            </p>
          </div>

          <div className="legal-section">
            <h2>10. Contact</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:hello@projekts.co">hello@projekts.co</a> or via WhatsApp at{" "}
              <a href="https://wa.me/923040260023">+92 304 026 0023</a>.
            </p>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        .legal-hero {
          padding: 140px 0 56px;
        }
        .legal-container {
          max-width: 780px;
          margin: 0 auto;
          padding: 0 clamp(20px, 4vw, 48px);
        }
        .legal-eyebrow {
          display: block;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 14px;
        }
        .legal-title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.03em;
          line-height: 1.1;
          margin-bottom: 12px;
        }
        .legal-date {
          font-size: 0.875rem;
          color: var(--muted);
        }
        .legal-body {
          padding-bottom: clamp(64px, 10vh, 100px);
          border-top: 1px solid var(--border);
        }
        .legal-content {
          padding-top: 56px;
        }
        .legal-section {
          margin-bottom: 40px;
          padding-bottom: 40px;
          border-bottom: 1px solid var(--border);
        }
        .legal-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }
        .legal-section h2 {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 14px;
          letter-spacing: -0.01em;
        }
        .legal-section p {
          font-size: 0.9375rem;
          color: var(--silver);
          line-height: 1.75;
          margin-bottom: 12px;
        }
        .legal-section p:last-child { margin-bottom: 0; }
        .legal-section ul {
          margin: 12px 0 12px 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .legal-section li {
          font-size: 0.9375rem;
          color: var(--silver);
          line-height: 1.7;
        }
        .legal-section a {
          color: rgba(200,200,255,0.85);
          text-decoration: underline;
          text-underline-offset: 3px;
          transition: color 0.2s ease;
        }
        .legal-section a:hover { color: #fff; }
        strong { color: rgba(255,255,255,0.85); font-weight: 600; }
      `}</style>
    </main>
  );
}
