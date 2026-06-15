"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditJobPosting() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [dept, setDept] = useState("Engineering");
  const [desc, setDesc] = useState("");
  const [published, setPublished] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/jobs/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load job posting");
        return r.json();
      })
      .then((data) => {
        setTitle(data.title);
        setType(data.type);
        setDept(data.dept);
        setDesc(data.desc);
        setPublished(data.published);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/jobs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, type, dept, desc, published }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Save failed");
        setSaving(false);
        return;
      }

      router.push("/admin/jobs");
    } catch (err) {
      setError("Network error");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="adm-page">
        <h1 className="adm-page-title">Edit Job Posting</h1>
        <p className="adm-page-subtitle">Loading...</p>
      </div>
    );
  }

  return (
    <div className="adm-page">
      <h1 className="adm-page-title">Edit Job Posting</h1>
      <p className="adm-page-subtitle">Modify job opening details</p>

      <form onSubmit={handleSubmit} className="adm-cs-form" style={{ marginTop: 24 }}>
        {error && (
          <div className="adm-login-error" style={{ color: "#ef4444", marginBottom: 16 }}>
            {error}
          </div>
        )}

        <fieldset className="adm-fieldset">
          <legend>Job Details</legend>

          <div className="adm-form-row">
            <label className="adm-form-group">
              <span className="adm-form-label">Job Title *</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="adm-input"
                placeholder="e.g. Full-Stack Developer"
                required
              />
            </label>
            <label className="adm-form-group">
              <span className="adm-form-label">Department *</span>
              <select
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                className="adm-input"
                style={{ background: "#0f0f15", color: "#fff" }}
                required
              >
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Product">Product</option>
                <option value="Growth">Growth</option>
                <option value="Operations">Operations</option>
              </select>
            </label>
          </div>

          <div className="adm-form-row">
            <label className="adm-form-group">
              <span className="adm-form-label">Type & Location *</span>
              <input
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="adm-input"
                placeholder="e.g. Full-time · Remote"
                required
              />
            </label>
          </div>

          <label className="adm-form-group">
            <span className="adm-form-label">Job Description *</span>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="adm-input adm-textarea"
              rows={8}
              placeholder="Outline the responsibilities, requirements, and what they will do..."
              required
            />
          </label>
        </fieldset>

        <div className="adm-form-actions">
          <label className="adm-form-toggle">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            <span>Published (posted live)</span>
          </label>

          <div className="adm-form-actions-right">
            <button
              type="button"
              onClick={() => router.push("/admin/jobs")}
              className="adm-btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="adm-btn-primary"
            >
              {saving ? "Saving..." : "Update"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
