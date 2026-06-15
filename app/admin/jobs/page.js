"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasting, setToasting] = useState(null);

  const fetchJobs = () =>
    fetch("/api/admin/jobs")
      .then((r) => r.json())
      .then((d) => setJobs(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));

  useEffect(() => {
    fetchJobs();
  }, []);

  const toast = (msg) => {
    setToasting(msg);
    setTimeout(() => setToasting(null), 2500);
  };

  const togglePublish = async (id, published) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, published: !published } : j))
    );
    toast(published ? "Position unposted" : "Position posted live");

    await fetch(`/api/admin/jobs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !published }),
    });
    fetchJobs();
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete job posting "${title}"? This will also disconnect existing applications.`)) return;
    await fetch(`/api/admin/jobs/${id}`, { method: "DELETE" });
    toast("Job posting deleted");
    fetchJobs();
  };

  if (loading) {
    return (
      <div className="adm-page">
        <h1 className="adm-page-title">Job Postings</h1>
        <p className="adm-page-subtitle">Loading...</p>
      </div>
    );
  }

  return (
    <div className="adm-page">
      {toasting && <div className="adm-toast">{toasting}</div>}

      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Job Postings</h1>
          <p className="adm-page-subtitle">{jobs.length} total roles</p>
        </div>
        <Link href="/admin/jobs/new" className="adm-btn-primary">
          + Add Job Posting
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="adm-empty-state">
          <p>No job postings yet. Create your first one to hire.</p>
        </div>
      ) : (
        <div className="adm-cs-list">
          {jobs.map((j) => (
            <div
              key={j.id}
              className={`adm-cs-row ${j.published ? "" : "draft"}`}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px" }}
            >
              <div className="adm-cs-info" style={{ flex: 1 }}>
                <span className="adm-cs-client" style={{ fontSize: "1.1rem", fontWeight: 600, color: "#fff" }}>{j.title}</span>
                <span className="adm-cs-category" style={{ fontSize: "0.8rem", opacity: 0.7, marginTop: "4px" }}>
                  {j.dept} · {j.type}
                </span>
              </div>

              <div className="adm-cs-actions" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button
                  onClick={() => togglePublish(j.id, j.published)}
                  className={`adm-badge ${j.published ? "published" : "draft"}`}
                  style={{ border: "none", cursor: "pointer", outline: "none" }}
                >
                  {j.published ? "Live / Posted" : "Draft / Unposted"}
                </button>
                <Link
                  href={`/admin/jobs/${j.id}`}
                  className="adm-cs-edit"
                  style={{ textDecoration: "none" }}
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(j.id, j.title)}
                  className="adm-cs-delete"
                  style={{ border: "none", cursor: "pointer", background: "none" }}
                >
                  Delete
                </button>
              </div>
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
