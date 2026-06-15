"use client";

import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PreFooter from "../components/PreFooter";

const VALUES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    title: "Small team, massive impact",
    desc: "Every person here directly shapes real products used by real people. No bureaucracy, no middle managers, no permission culture.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
      </svg>
    ),
    title: "Fully remote & async-first",
    desc: "We work across time zones. You own your schedule — what matters is the quality of what you ship, not when you log on.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
    title: "Hard problems, modern tools",
    desc: "You'll work on challenging projects — AI systems, scalable platforms, complex UX — with the best tools, not mandated legacy stacks.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    title: "Merit over credentials",
    desc: "Degrees don't matter. Portfolios do. If you can demonstrate exceptional work, we want to talk — regardless of where you studied.",
  },
];

export default function CareersContent() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [jobPostingId, setJobPostingId] = useState("general");
  const [resume, setResume] = useState(null);
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const formRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetch("/api/jobs")
      .then((r) => r.json())
      .then((data) => {
        setJobs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching jobs:", err);
        setLoading(false);
      });
  }, []);

  const handleApplyClick = (jobId) => {
    setJobPostingId(jobId || "general");
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);

    if (!resume) {
      setError("Please upload your resume file.");
      setSubmitting(false);
      return;
    }

    const fd = new FormData();
    fd.append("name", name);
    fd.append("email", email);
    fd.append("phone", phone);
    fd.append("linkedin", linkedin);
    fd.append("coverLetter", coverLetter);
    fd.append("jobPostingId", jobPostingId);
    fd.append("resume", resume);

    try {
      const res = await fetch("/api/careers/apply", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setSuccess(true);
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setLinkedin("");
      setCoverLetter("");
      setJobPostingId("general");
      setResume(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="careers-hero">
        <div className="careers-container">
          <div className="careers-hero-label">Careers</div>
          <h1 className="careers-hero-title">
            Build things that matter.
            <br />
            <span className="careers-hero-accent">With people who ship.</span>
          </h1>
          <p className="careers-hero-sub">
            We&apos;re a lean, highly skilled team. We don&apos;t hire for headcount — we hire
            for craft. Every person we bring on raises the bar.
          </p>
        </div>
      </section>

      {/* Why Join */}
      <section className="careers-values">
        <div className="careers-container">
          <span className="careers-eyebrow">Why Projekts</span>
          <h2 className="careers-section-title">A place for people who actually care.</h2>
          <div className="careers-values-grid">
            {VALUES.map((v) => (
              <div key={v.title} className="careers-value-card">
                <div className="careers-value-icon">{v.icon}</div>
                <h3 className="careers-value-title">{v.title}</h3>
                <p className="careers-value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section className="careers-openings">
        <div className="careers-container">
          <span className="careers-eyebrow">Open Roles</span>
          
          {loading ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: "var(--muted)" }}>
              Loading opportunities...
            </div>
          ) : jobs.length === 0 ? (
            <div className="careers-empty-state-notice" style={{ marginBottom: "48px" }}>
              <div style={{
                padding: "40px",
                borderRadius: "20px",
                border: "1px dashed rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.01)",
                textAlign: "center"
              }}>
                <h3 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", marginBottom: "12px" }}>
                  No open positions at the moment
                </h3>
                <p style={{ color: "var(--silver)", maxWidth: "52ch", margin: "0 auto 24px", lineHeight: 1.6 }}>
                  We don&apos;t have any specific active openings right now. However, we are always on the look out for exceptional talent. If you want to show us your work, please use the form below to submit a spontaneous application!
                </p>
                <button onClick={() => handleApplyClick("general")} className="careers-apply-btn" style={{ cursor: "pointer", background: "#fff", color: "#000", fontWeight: 600 }}>
                  Show Us Your Work
                </button>
              </div>
            </div>
          ) : (
            <div className="careers-openings-list" style={{ marginBottom: "48px" }}>
              {jobs.map((role) => (
                <div key={role.id} className="careers-role-card">
                  <div className="careers-role-left">
                    <span className="careers-role-dept">{role.dept}</span>
                    <h3 className="careers-role-title">{role.title}</h3>
                    <p className="careers-role-desc" style={{ whiteSpace: "pre-wrap" }}>{role.desc}</p>
                  </div>
                  <div className="careers-role-right">
                    <span className="careers-role-type">{role.type}</span>
                    <button
                      onClick={() => handleApplyClick(role.id)}
                      className="careers-apply-btn"
                      style={{ cursor: "pointer", border: "1px solid rgba(255,255,255,0.12)" }}
                    >
                      Apply Now
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17L17 7"/><path d="M7 7h10v10"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Application Form Form Section */}
          <div ref={formRef} className="careers-spontaneous" style={{ scrollMarginTop: "120px" }}>
            <div className="careers-spontaneous-inner" style={{ flexDirection: "column", alignItems: "stretch", gap: "32px" }}>
              <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
                <h3 className="careers-spontaneous-title" style={{ fontSize: "1.75rem", marginBottom: "12px" }}>
                  Submit Your Application
                </h3>
                <p className="careers-spontaneous-desc" style={{ margin: "0 auto" }}>
                  Tell us who you are, what you&apos;ve built, and why you want to join Projekts.
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "680px", margin: "0 auto", width: "100%" }}>
                {success && (
                  <div style={{ padding: "16px 20px", borderRadius: "12px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#34d399", fontSize: "0.95rem", textAlign: "center" }}>
                    Application submitted successfully! We will review your portfolio and get back to you if there is a fit.
                  </div>
                )}
                {error && (
                  <div style={{ padding: "16px 20px", borderRadius: "12px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontSize: "0.95rem", textAlign: "center" }}>
                    {error}
                  </div>
                )}

                <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "0.85rem", color: "var(--silver)", fontWeight: 550 }}>Full Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Jane Doe"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: "8px", padding: "12px 16px", color: "#fff", outline: "none", fontSize: "0.9375rem" }}
                    />
                  </div>
                  <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "0.85rem", color: "var(--silver)", fontWeight: 550 }}>Email Address *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="jane@example.com"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: "8px", padding: "12px 16px", color: "#fff", outline: "none", fontSize: "0.9375rem" }}
                    />
                  </div>
                </div>

                <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "0.85rem", color: "var(--silver)", fontWeight: 550 }}>Phone Number (Optional)</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: "8px", padding: "12px 16px", color: "#fff", outline: "none", fontSize: "0.9375rem" }}
                    />
                  </div>
                  <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "0.85rem", color: "var(--silver)", fontWeight: 550 }}>LinkedIn / Portfolio Link (Optional)</label>
                    <input
                      type="url"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: "8px", padding: "12px 16px", color: "#fff", outline: "none", fontSize: "0.9375rem" }}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "0.85rem", color: "var(--silver)", fontWeight: 550 }}>Applying For *</label>
                  <select
                    value={jobPostingId}
                    onChange={(e) => setJobPostingId(e.target.value)}
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: "8px", padding: "12px 16px", color: "#fff", outline: "none", fontSize: "0.9375rem" }}
                  >
                    <option value="general" style={{ background: "#0a0a0f" }}>General Application (Spontaneous)</option>
                    {jobs.map((j) => (
                      <option key={j.id} value={j.id} style={{ background: "#0a0a0f" }}>
                        {j.title} ({j.dept})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "0.85rem", color: "var(--silver)", fontWeight: 550 }}>Cover Letter / Why Projekts? (Optional)</label>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    rows={4}
                    placeholder="Tell us about your biggest accomplishments and what you want to work on..."
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: "8px", padding: "12px 16px", color: "#fff", outline: "none", fontSize: "0.9375rem", resize: "vertical" }}
                  />
                </div>

                <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "0.85rem", color: "var(--silver)", fontWeight: 550 }}>Upload Resume * (PDF, Word, TXT - Max 10MB)</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.rtf"
                    onChange={handleFileChange}
                    required
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px dashed rgba(255,255,255,0.15)",
                      borderRadius: "8px",
                      padding: "16px",
                      color: "#fff",
                      fontSize: "0.875rem",
                      cursor: "pointer",
                      outline: "none"
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="careers-apply-btn"
                  style={{
                    cursor: "pointer",
                    background: "#fff",
                    color: "#000",
                    fontWeight: 700,
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "8px",
                    height: "48px",
                    borderRadius: "10px",
                    border: "none",
                    marginTop: "12px",
                    transition: "opacity 0.2s ease"
                  }}
                >
                  {submitting ? "Submitting Application..." : "Submit Application"}
                  {!submitting && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
                    </svg>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <PreFooter />
      <Footer />

      <style>{`
        .careers-hero {
          padding: 140px 0 80px;
          text-align: center;
        }
        .careers-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 clamp(20px, 4vw, 48px);
        }
        .careers-hero-label {
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
        .careers-hero-title {
          font-family: var(--font-display);
          font-size: clamp(2.4rem, 5.5vw, 4rem);
          font-weight: 800;
          line-height: 1.08;
          letter-spacing: -0.04em;
          color: #fff;
          margin-bottom: 20px;
        }
        .careers-hero-accent {
          background: linear-gradient(135deg, #fff 0%, #a8a8b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .careers-hero-sub {
          font-size: 1.05rem;
          color: var(--silver);
          line-height: 1.65;
          max-width: 52ch;
          margin: 0 auto;
        }
        .careers-eyebrow {
          display: block;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 14px;
        }
        .careers-section-title {
          font-family: var(--font-display);
          font-size: clamp(1.6rem, 3vw, 2.25rem);
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.03em;
          margin-bottom: clamp(32px, 5vw, 48px);
          line-height: 1.15;
        }
        .careers-values {
          padding: clamp(64px, 10vh, 100px) 0;
          border-top: 1px solid var(--border);
        }
        .careers-values-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        .careers-value-card {
          padding: 28px 24px;
          border: 1px solid var(--border);
          border-radius: 16px;
          background: rgba(255,255,255,0.02);
          transition: border-color 0.3s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .careers-value-card:hover {
          border-color: rgba(255,255,255,0.12);
          transform: translateY(-3px);
        }
        .careers-value-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border);
          border-radius: 10px;
          color: var(--silver);
          margin-bottom: 16px;
        }
        .careers-value-title {
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 10px;
          line-height: 1.3;
        }
        .careers-value-desc {
          font-size: 0.9375rem;
          color: var(--silver);
          line-height: 1.65;
        }
        .careers-openings {
          padding: clamp(64px, 10vh, 100px) 0;
          border-top: 1px solid var(--border);
        }
        .careers-openings-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .careers-role-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          padding: 28px 32px;
          border: 1px solid var(--border);
          border-radius: 16px;
          background: rgba(255,255,255,0.02);
          transition: border-color 0.3s ease;
        }
        .careers-role-card:hover { border-color: rgba(255,255,255,0.12); }
        .careers-role-left { flex: 1; }
        .careers-role-dept {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          display: block;
          margin-bottom: 8px;
        }
        .careers-role-title {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 8px;
          line-height: 1.3;
        }
        .careers-role-desc {
          font-size: 0.9rem;
          color: var(--silver);
          line-height: 1.6;
          max-width: 56ch;
        }
        .careers-role-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 16px;
          flex-shrink: 0;
        }
        .careers-role-type {
          font-size: 0.8rem;
          color: var(--muted);
          white-space: nowrap;
        }
        .careers-apply-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #fff;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          padding: 10px 20px;
          border-radius: 10px;
          transition: background 0.25s ease, gap 0.25s ease;
          white-space: nowrap;
        }
        .careers-apply-btn:hover {
          background: rgba(255,255,255,0.11);
          gap: 11px;
        }
        .careers-spontaneous {
          margin-top: 16px;
        }
        .careers-spontaneous-inner {
          padding: clamp(32px, 4vw, 48px);
          border: 1px solid var(--border);
          border-radius: 20px;
          background: rgba(255,255,255,0.015);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
        }
        .careers-spontaneous-title {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 8px;
        }
        .careers-spontaneous-desc {
          font-size: 0.9375rem;
          color: var(--silver);
          line-height: 1.6;
          max-width: 56ch;
        }
        @media (max-width: 768px) {
          .careers-values-grid { grid-template-columns: 1fr; }
          .careers-role-card { flex-direction: column; align-items: flex-start; }
          .careers-role-right { align-items: flex-start; }
          .careers-spontaneous-inner { flex-direction: column; }
          .form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
