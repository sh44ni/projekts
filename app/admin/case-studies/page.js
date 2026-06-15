"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminCaseStudies() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasting, setToasting] = useState(null);

  const fetchCases = () =>
    fetch("/api/admin/case-studies")
      .then((r) => r.json())
      .then((d) => setCases(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));

  useEffect(() => { fetchCases(); }, []);

  const toast = (msg) => {
    setToasting(msg);
    setTimeout(() => setToasting(null), 2500);
  };

  const togglePublish = async (id, published) => {
    // Optimistic update
    setCases((prev) =>
      prev.map((c) => (c.id === id ? { ...c, published: !published } : c))
    );
    await fetch(`/api/admin/case-studies/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !published }),
    });
    fetchCases();
  };

  const setFeatured = async (id) => {
    // Optimistic update — reflect immediately in UI
    setCases((prev) =>
      prev.map((c) => ({ ...c, featured: c.id === id }))
    );
    toast("Homepage spotlight updated ✓");

    // Persist to DB: unset all, then set chosen
    await Promise.all(
      cases.map((c) =>
        fetch(`/api/admin/case-studies/${c.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ featured: c.id === id }),
        })
      )
    );
    // Confirm with fresh data
    await fetchCases();
  };

  const handleDelete = async (id, client) => {
    if (!confirm(`Delete "${client}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/case-studies/${id}`, { method: "DELETE" });
    fetchCases();
  };

  const moveOrder = async (id, direction) => {
    const idx = cases.findIndex((c) => c.id === id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= cases.length) return;

    await Promise.all([
      fetch(`/api/admin/case-studies/${cases[idx].id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: cases[swapIdx].sortOrder }),
      }),
      fetch(`/api/admin/case-studies/${cases[swapIdx].id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: cases[idx].sortOrder }),
      }),
    ]);
    fetchCases();
  };

  if (loading) {
    return (
      <div className="adm-page">
        <h1 className="adm-page-title">Case Studies</h1>
        <p className="adm-page-subtitle">Loading...</p>
      </div>
    );
  }

  const featuredId = cases.find((c) => c.featured)?.id;

  return (
    <div className="adm-page">
      {/* Toast */}
      {toasting && (
        <div className="adm-toast">{toasting}</div>
      )}

      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Case Studies</h1>
          <p className="adm-page-subtitle">{cases.length} total · 1 shown on homepage</p>
        </div>
        <Link href="/admin/case-studies/new" className="adm-btn-primary">
          + Add Case Study
        </Link>
      </div>

      {/* Featured banner */}
      <div className="adm-featured-banner">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <span>
          {featuredId
            ? <>Homepage spotlight: <strong>{cases.find((c) => c.id === featuredId)?.client}</strong>. Click ⭐ on any row to change it.</>
            : <>No homepage spotlight set. Click ⭐ on a case study to feature it on the homepage.</>
          }
        </span>
      </div>

      {cases.length === 0 ? (
        <div className="adm-empty-state">
          <p>No case studies yet. Create your first one.</p>
        </div>
      ) : (
        <div className="adm-cs-list">
          {cases.map((c, i) => (
            <div
              key={c.id}
              className={`adm-cs-row ${c.published ? "" : "draft"} ${c.featured ? "adm-cs-row--featured" : ""}`}
            >
              <div className="adm-cs-order">
                <button
                  onClick={() => moveOrder(c.id, "up")}
                  disabled={i === 0}
                  className="adm-cs-arrow"
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveOrder(c.id, "down")}
                  disabled={i === cases.length - 1}
                  className="adm-cs-arrow"
                  title="Move down"
                >
                  ↓
                </button>
              </div>

              <div className="adm-cs-info">
                <span className="adm-cs-client">{c.client}</span>
                <span className="adm-cs-category">{c.category}</span>
              </div>

              <div className="adm-cs-slug">/{c.slug}</div>

              <div className="adm-cs-actions">
                {/* Featured toggle */}
                <button
                  onClick={() => setFeatured(c.id)}
                  className={`adm-cs-featured-btn ${c.featured ? "is-featured" : ""}`}
                  title={c.featured ? "Currently on homepage" : "Set as homepage spotlight"}
                >
                  {c.featured ? "⭐ Featured" : "☆ Feature"}
                </button>

                <button
                  onClick={() => togglePublish(c.id, c.published)}
                  className={`adm-badge ${c.published ? "published" : "draft"}`}
                >
                  {c.published ? "Published" : "Draft"}
                </button>
                <Link
                  href={`/admin/case-studies/${c.id}`}
                  className="adm-cs-edit"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(c.id, c.client)}
                  className="adm-cs-delete"
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
        .adm-featured-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 18px;
          border: 1px solid rgba(250,204,21,0.2);
          border-radius: 10px;
          background: rgba(250,204,21,0.06);
          color: rgba(250,204,21,0.85);
          font-size: 0.875rem;
          margin-bottom: 20px;
        }
        .adm-featured-banner strong {
          color: rgba(250,204,21,1);
          font-weight: 600;
        }
        .adm-cs-row--featured {
          border-color: rgba(250,204,21,0.25) !important;
          background: rgba(250,204,21,0.04) !important;
        }
        .adm-cs-featured-btn {
          font-size: 0.8rem;
          font-weight: 500;
          padding: 5px 12px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          background: transparent;
          color: rgba(255,255,255,0.45);
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .adm-cs-featured-btn:hover {
          border-color: rgba(250,204,21,0.4);
          color: rgba(250,204,21,0.9);
          background: rgba(250,204,21,0.08);
        }
        .adm-cs-featured-btn.is-featured {
          border-color: rgba(250,204,21,0.5);
          color: rgba(250,204,21,1);
          background: rgba(250,204,21,0.1);
        }
      `}</style>
    </div>
  );
}
