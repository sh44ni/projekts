"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewJobPosting() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [type, setType] = useState("Full-time · Remote");
  const [dept, setDept] = useState("Engineering");
  const [desc, setDesc] = useState("");
  const [published, setPublished] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/jobs", {
        method: "POST",
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

  return (
    <div className="adm-page">
      <h1 className="adm-page-title">New Job Posting</h1>
      <p className="adm-page-subtitle">Publish a new career opportunity</p>

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
              {saving ? "Saving..." : "Create"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
