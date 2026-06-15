"use client";

import { useEffect, useState } from "react";

export default function AdminApplications() {
  const [apps, setApps] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState("all");
  const [jobFilter, setJobFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const [toasting, setToasting] = useState(null);

  // Fetch jobs for filter dropdown
  useEffect(() => {
    fetch("/api/admin/jobs")
      .then((r) => r.json())
      .then((data) => setJobs(Array.isArray(data) ? data : []));
  }, []);

  const fetchApps = () => {
    let url = "/api/admin/applications?";
    if (filter !== "all") {
      url += `read=${filter === "read"}&`;
    }
    if (jobFilter !== "all") {
      url += `jobId=${jobFilter}`;
    }
    fetch(url)
      .then((r) => r.json())
      .then((data) => setApps(Array.isArray(data) ? data : []));
  };

  useEffect(() => {
    fetchApps();
  }, [filter, jobFilter]);

  const toast = (msg) => {
    setToasting(msg);
    setTimeout(() => setToasting(null), 2500);
  };

  const toggleRead = async (id, current) => {
    await fetch("/api/admin/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read: !current }),
    });
    setApps((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: !current } : a))
    );
    toast(!current ? "Marked as read ✓" : "Marked as unread ✓");
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete application from "${name}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/applications?id=${id}`, {
      method: "DELETE",
    });
    toast("Application deleted");
    fetchApps();
  };

  return (
    <div className="adm-page">
      {toasting && <div className="adm-toast">{toasting}</div>}

      <div className="adm-page-header" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="adm-page-title">Applications</h1>
          <p className="adm-page-subtitle">{apps.length} candidate submissions</p>
        </div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {/* Status filter */}
          <div className="adm-filters">
            {["all", "unread", "read"].map((f) => (
              <button
                key={f}
                className={`adm-filter-btn ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Job Filter Dropdown */}
          <select
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
            className="adm-input"
            style={{
              width: "auto",
              background: "#1e1e28",
              borderColor: "rgba(255,255,255,0.12)",
              color: "#fff",
              padding: "0 16px",
              height: "38px",
              borderRadius: "8px",
              fontSize: "0.85rem",
            }}
          >
            <option value="all">All Roles</option>
            <option value="general">General Applications</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {apps.length === 0 ? (
        <div className="adm-empty-state">
          <p>No applications found.</p>
        </div>
      ) : (
        <div className="adm-submissions-list">
          {apps.map((a) => (
            <div key={a.id} className={`adm-sub-card ${a.read ? "" : "unread"}`}>
              <div
                className="adm-sub-header"
                onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                style={{ cursor: "pointer" }}
              >
                <div className="adm-sub-info">
                  <span className={`adm-sub-dot ${a.read ? "" : "active"}`} />
                  <div>
                    <strong className="adm-sub-name">{a.name}</strong>
                    <span className="adm-sub-email">{a.email}</span>
                  </div>
                </div>
                <div className="adm-sub-meta">
                  <span
                    className="adm-sub-tag"
                    style={{
                      background: a.jobPosting ? "rgba(59,130,246,0.1)" : "rgba(16,185,129,0.1)",
                      color: a.jobPosting ? "#60a5fa" : "#34d399",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    {a.jobPosting ? a.jobPosting.title : "General / Spontaneous"}
                  </span>
                  <span className="adm-sub-date">{new Date(a.createdAt).toLocaleDateString()}</span>
                  <svg
                    className={`adm-sub-chevron ${expanded === a.id ? "open" : ""}`}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </div>

              {expanded === a.id && (
                <div className="adm-sub-body" style={{ padding: "20px", borderTop: "1px solid var(--border)" }}>
                  <div className="adm-sub-details" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {a.phone && (
                      <div className="adm-sub-detail">
                        <strong>Phone:</strong> {a.phone}
                      </div>
                    )}
                    {a.linkedin && (
                      <div className="adm-sub-detail">
                        <strong>LinkedIn:</strong>{" "}
                        <a
                          href={a.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "#60a5fa", textDecoration: "underline" }}
                        >
                          {a.linkedin}
                        </a>
                      </div>
                    )}
                    <div className="adm-sub-detail">
                      <strong>Resume File:</strong>{" "}
                      <a
                        href={a.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="adm-btn-sm"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          background: "rgba(255,255,255,0.08)",
                          color: "#fff",
                          border: "1px solid rgba(255,255,255,0.15)",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          textDecoration: "none",
                          fontSize: "0.8rem",
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Download / View Resume
                      </a>
                    </div>
                    <div className="adm-sub-detail">
                      <strong>Cover Note / Letter:</strong>
                    </div>
                    <p
                      className="adm-sub-message"
                      style={{
                        whiteSpace: "pre-wrap",
                        background: "rgba(0,0,0,0.2)",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {a.coverLetter || "No cover note provided."}
                    </p>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                    <button
                      className="adm-sub-toggle"
                      onClick={() => toggleRead(a.id, a.read)}
                      style={{ cursor: "pointer" }}
                    >
                      {a.read ? "Mark as Unread" : "Mark as Read"}
                    </button>
                    <button
                      onClick={() => handleDelete(a.id, a.name)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#f87171",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                      }}
                    >
                      Delete Candidate
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style>{`
        .adm-toast {
          position: fixed;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(30, 30, 40, 0.95);
          border: 1px solid rgba(255,255,255,0.12);
          color: #fff;
          font-size: 0.875rem;
          padding: 12px 24px;
          border-radius: 10px;
          backdrop-filter: blur(12px);
          z-index: 9999;
          animation: adm-toast-in 0.25s ease;
        }
        @keyframes adm-toast-in {
          from { opacity: 0; transform: translateX(-50%) translateY(8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}
