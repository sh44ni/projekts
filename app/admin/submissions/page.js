"use client";

import { useEffect, useState } from "react";

export default function AdminSubmissions() {
  const [subs, setSubs] = useState([]);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const params = filter === "all" ? "" : `?read=${filter === "read"}`;
    fetch(`/api/admin/submissions${params}`).then((r) => r.json()).then((d) => setSubs(Array.isArray(d) ? d : []));
  }, [filter]);

  const toggleRead = async (id, current) => {
    await fetch("/api/admin/submissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read: !current }),
    });
    setSubs((prev) => prev.map((s) => (s.id === id ? { ...s, read: !current } : s)));
  };

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Submissions</h1>
          <p className="adm-page-subtitle">{subs.length} total inquiries</p>
        </div>
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
      </div>

      {subs.length === 0 ? (
        <div className="adm-empty-state">
          <p>No submissions found.</p>
        </div>
      ) : (
        <div className="adm-submissions-list">
          {subs.map((s) => (
            <div key={s.id} className={`adm-sub-card ${s.read ? "" : "unread"}`}>
              <div className="adm-sub-header" onClick={() => setExpanded(expanded === s.id ? null : s.id)}>
                <div className="adm-sub-info">
                  <span className={`adm-sub-dot ${s.read ? "" : "active"}`} />
                  <div>
                    <strong className="adm-sub-name">{s.name}</strong>
                    <span className="adm-sub-email">{s.email}</span>
                  </div>
                </div>
                <div className="adm-sub-meta">
                  {s.service && <span className="adm-sub-tag">{s.service}</span>}
                  <span className="adm-sub-date">{new Date(s.createdAt).toLocaleDateString()}</span>
                  <svg className={`adm-sub-chevron ${expanded === s.id ? "open" : ""}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
                </div>
              </div>
              {expanded === s.id && (
                <div className="adm-sub-body">
                  <div className="adm-sub-details">
                    <div className="adm-sub-detail"><strong>Budget:</strong> {s.budget || "Not specified"}</div>
                    <div className="adm-sub-detail"><strong>Message:</strong></div>
                    <p className="adm-sub-message">{s.message || "No message provided."}</p>
                  </div>
                  <button className="adm-sub-toggle" onClick={() => toggleRead(s.id, s.read)}>
                    {s.read ? "Mark as Unread" : "Mark as Read"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
