"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    fetch("/api/admin/analytics?days=30").then((r) => r.json()).then(setStats);
    fetch("/api/admin/submissions").then((r) => r.json()).then((d) => setSubs(Array.isArray(d) ? d : []));
  }, []);

  const unread = subs.filter((s) => !s.read).length;

  return (
    <div className="adm-page">
      <h1 className="adm-page-title">Dashboard</h1>
      <p className="adm-page-subtitle">Overview of the last 30 days</p>

      <div className="adm-stats-grid">
        <div className="adm-stat-card">
          <span className="adm-stat-label">Page Views</span>
          <span className="adm-stat-value">{stats?.totalViews ?? "—"}</span>
        </div>
        <div className="adm-stat-card">
          <span className="adm-stat-label">Unique Visitors</span>
          <span className="adm-stat-value">{stats?.uniqueVisitors ?? "—"}</span>
        </div>
        <div className="adm-stat-card">
          <span className="adm-stat-label">Inquiries</span>
          <span className="adm-stat-value">{stats?.submissions ?? "—"}</span>
        </div>
        <div className="adm-stat-card">
          <span className="adm-stat-label">Unread</span>
          <span className="adm-stat-value adm-stat-alert">{unread}</span>
        </div>
      </div>

      <div className="adm-section">
        <h2 className="adm-section-title">Recent Submissions</h2>
        {subs.length === 0 ? (
          <p className="adm-empty">No submissions yet.</p>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {subs.slice(0, 5).map((s) => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                    <td>{s.service || "—"}</td>
                    <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`adm-badge ${s.read ? "read" : "unread"}`}>
                        {s.read ? "Read" : "New"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
