"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminCaseStudies() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCases = () => {
    fetch("/api/admin/case-studies")
      .then((r) => r.json())
      .then((d) => setCases(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCases(); }, []);

  const togglePublish = async (id, published) => {
    await fetch(`/api/admin/case-studies/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !published }),
    });
    fetchCases();
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

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">Case Studies</h1>
          <p className="adm-page-subtitle">{cases.length} total</p>
        </div>
        <Link href="/admin/case-studies/new" className="adm-btn-primary">
          + Add Case Study
        </Link>
      </div>

      {cases.length === 0 ? (
        <div className="adm-empty-state">
          <p>No case studies yet. Create your first one.</p>
        </div>
      ) : (
        <div className="adm-cs-list">
          {cases.map((c, i) => (
            <div key={c.id} className={`adm-cs-row ${c.published ? "" : "draft"}`}>
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
    </div>
  );
}
