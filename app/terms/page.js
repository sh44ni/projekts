import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "Terms of Service | Projekts",
  description:
    "Terms and conditions governing use of Projekts services and website.",
};

const LAST_UPDATED = "June 1, 2025";

export default function TermsPage() {
  return (
    <main>
      <Navbar />

      <section className="legal-hero">
        <div className="legal-container">
          <span className="legal-eyebrow">Legal</span>
          <h1 className="legal-title">Terms of Service</h1>
          <p className="legal-date">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      <section className="legal-body">
        <div className="legal-container legal-content">
          <div className="legal-section">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Projekts website (projekts.co) or engaging Projekts for
              services, you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;). If you do not
              agree, please do not use the Site or our services.
            </p>
          </div>

          <div className="legal-section">
            <h2>2. Services</h2>
            <p>
              Projekts provides custom software development, mobile application development,
              AI solutions, and digital strategy consulting services. The specific scope, timeline,
              deliverables, and fees for any engagement are defined in a separate written agreement
              (Statement of Work or Project Agreement) executed between Projekts and the client.
            </p>
          </div>

          <div className="legal-section">
            <h2>3. Intellectual Property</h2>
            <p>
              Upon full payment of all fees, Projekts assigns to the client all rights, title, and
              interest in custom code, designs, and deliverables produced specifically for that
              client under a project agreement.
            </p>
            <p>
              Projekts retains ownership of any pre-existing tools, frameworks, libraries,
              methodologies, and general-purpose code (&ldquo;Background IP&rdquo;) used in delivery.
              Clients receive a perpetual, non-exclusive licence to use Background IP as incorporated
              into their deliverables.
            </p>
            <p>
              All content on the Projekts website — including text, graphics, and brand assets —
              is the property of Projekts and may not be reproduced without written permission.
            </p>
          </div>

          <div className="legal-section">
            <h2>4. Payment Terms</h2>
            <p>
              Payment schedules are defined in individual project agreements. Generally, projects
              require a deposit before work commences, with milestone or completion payments
              thereafter. Overdue invoices may attract a late fee of 2% per month.
            </p>
            <p>
              Projekts reserves the right to suspend work on any project with outstanding
              invoices older than 14 days.
            </p>
          </div>

          <div className="legal-section">
            <h2>5. Confidentiality</h2>
            <p>
              Both parties agree to keep confidential any proprietary information disclosed during
              the engagement and not to disclose it to third parties without prior written consent,
              unless required by law.
            </p>
          </div>

          <div className="legal-section">
            <h2>6. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Projekts&apos; total liability for any claim
              arising from our services shall not exceed the total fees paid by the client in the
              three months preceding the claim.
            </p>
            <p>
              Projekts is not liable for indirect, incidental, consequential, or punitive damages,
              including loss of profits or data, even if advised of the possibility of such damages.
            </p>
          </div>

          <div className="legal-section">
            <h2>7. Warranties & Disclaimers</h2>
            <p>
              Projekts warrants that services will be performed with reasonable skill and care.
              The Site and all content are provided &ldquo;as is&rdquo; without warranties of any kind,
              express or implied, including merchantability or fitness for a particular purpose.
            </p>
          </div>

          <div className="legal-section">
            <h2>8. Termination</h2>
            <p>
              Either party may terminate a project agreement with 14 days&apos; written notice.
              The client is responsible for all fees for work completed up to the termination date.
              Projekts will deliver all completed work upon receipt of outstanding payments.
            </p>
          </div>

          <div className="legal-section">
            <h2>9. Governing Law</h2>
            <p>
              These Terms are governed by the laws of Pakistan. Any disputes shall first be
              attempted through good-faith negotiation, and if unresolved, submitted to the
              appropriate courts in Karachi, Pakistan.
            </p>
          </div>

          <div className="legal-section">
            <h2>10. Changes to Terms</h2>
            <p>
              We may revise these Terms at any time. The current version is always posted at
              projekts.co/terms. Continued use of the Site or services after changes constitutes
              acceptance of the updated Terms.
            </p>
          </div>

          <div className="legal-section">
            <h2>11. Contact</h2>
            <p>
              Questions about these Terms? Email us at{" "}
              <a href="mailto:hello@projekts.co">hello@projekts.co</a>.
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
