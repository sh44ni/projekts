"use client";

import { useEffect, useState } from "react";

export default function TeamAccessPage() {
  const [users, setUsers] = useState([]);
  const [whitelist, setWhitelist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Invite form state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/team");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setWhitelist(data.whitelist || []);
      } else {
        const err = await res.json();
        setError(err.error || "Failed to load team data");
      }
    } catch (e) {
      setError("Network error while loading team data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;

    setActionLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(data.message || `Invitation successfully sent to ${inviteEmail}`);
        setInviteEmail("");
        loadData();
      } else {
        setError(data.error || "Failed to send invitation");
      }
    } catch (err) {
      setError("Failed to send invitation. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleResend = async (id, email) => {
    setActionLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/admin/team", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "resend" }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(data.message || `Invitation resent to ${email}`);
        loadData();
      } else {
        setError(data.error || "Failed to resend invitation");
      }
    } catch (e) {
      setError("Network error resending invitation");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRevoke = async (id, email) => {
    if (!confirm(`Are you sure you want to revoke access for ${email}?`)) return;

    setActionLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/admin/team?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(`Access revoked for ${email}`);
        loadData();
      } else {
        setError(data.error || "Failed to revoke access");
      }
    } catch (e) {
      setError("Network error revoking access");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestore = async (id, email) => {
    setActionLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/admin/team", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "restore" }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(`Access restored for ${email}`);
        loadData();
      } else {
        setError(data.error || "Failed to restore access");
      }
    } catch (e) {
      setError("Network error restoring access");
    } finally {
      setActionLoading(false);
    }
  };

  const activeCount = users.length;
  const pendingCount = whitelist.filter((w) => w.status === "pending").length;

  return (
    <div className="adm-page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 className="adm-page-title">Team & Access Control</h1>
          <p className="adm-page-subtitle">
            Manage authorized team accounts, roles, and automated on-brand email invitations.
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          style={{
            background: "var(--adm-surface-2)",
            border: "1px solid var(--adm-line-2)",
            color: "var(--adm-text-2)",
            padding: "8px 14px",
            borderRadius: 8,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          {loading ? "Refreshing..." : "↻ Refresh List"}
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: "14px 18px",
            marginBottom: 20,
            background: "rgba(239, 68, 68, 0.12)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: 10,
            color: "#fca5a5",
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            padding: "14px 18px",
            marginBottom: 20,
            background: "rgba(74, 222, 128, 0.12)",
            border: "1px solid rgba(74, 222, 128, 0.3)",
            borderRadius: 10,
            color: "#86efac",
            fontSize: 13,
          }}
        >
          {success}
        </div>
      )}

      {/* Stats Cards */}
      <div className="adm-stats-grid" style={{ marginBottom: 32 }}>
        <div className="adm-stat-card">
          <span className="adm-stat-label">Active Team Accounts</span>
          <span className="adm-stat-value">{activeCount}</span>
        </div>
        <div className="adm-stat-card">
          <span className="adm-stat-label">Pending Invitations</span>
          <span className="adm-stat-value" style={{ color: "#dfc19b" }}>
            {pendingCount}
          </span>
        </div>
        <div className="adm-stat-card">
          <span className="adm-stat-label">Founding Super Admin</span>
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--adm-text)",
              marginTop: 8,
              wordBreak: "break-all",
            }}
          >
            imzeeshankhann@gmail.com
          </span>
        </div>
        <div className="adm-stat-card">
          <span className="adm-stat-label">Verified Email Dispatch</span>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#4ade80",
              marginTop: 8,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
            support@projektsvision.com
          </span>
        </div>
      </div>

      {/* Invite Member Box */}
      <div
        style={{
          background: "linear-gradient(180deg, rgba(26, 26, 30, 0.8), rgba(17, 17, 19, 0.9))",
          border: "1px solid var(--adm-line-2)",
          borderRadius: 16,
          padding: 24,
          marginBottom: 36,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 18 }}>✉</span>
          <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: "var(--adm-text)" }}>
            Authorize & Invite Team Member
          </h2>
        </div>
        <p style={{ fontSize: 13, color: "var(--adm-text-3)", margin: "0 0 20px 0" }}>
          Whitelists the email address and dispatches an on-brand Projekts Vision invitation email via Resend with a secure account activation link.
        </p>

        <form onSubmit={handleInvite} style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
          <div style={{ flex: "1 1 300px" }}>
            <input
              type="email"
              placeholder="colleague@projektsvision.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              required
              style={{
                width: "100%",
                background: "var(--adm-surface)",
                border: "1px solid var(--adm-line-2)",
                borderRadius: 10,
                padding: "12px 16px",
                color: "#fff",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ width: 170 }}>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              style={{
                width: "100%",
                background: "var(--adm-surface)",
                border: "1px solid var(--adm-line-2)",
                borderRadius: 10,
                padding: "12px 14px",
                color: "#fff",
                fontSize: 13,
                outline: "none",
              }}
            >
              <option value="member">Team Member</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={actionLoading || !inviteEmail}
            className="adm-login-btn"
            style={{
              margin: 0,
              width: "auto",
              padding: "12px 24px",
              fontSize: 13,
              fontWeight: 600,
              background: "linear-gradient(135deg, #c5a880 0%, #dfc19b 100%)",
              color: "#07090e",
              borderRadius: 10,
              cursor: actionLoading ? "not-allowed" : "pointer",
            }}
          >
            {actionLoading ? "Dispatching..." : "Send Invitation"}
          </button>
        </form>
      </div>

      {/* Active Accounts Table */}
      <div className="adm-section" style={{ marginBottom: 36 }}>
        <h2 className="adm-section-title">Active Team Members ({users.length})</h2>
        {users.length === 0 ? (
          <p className="adm-empty">No active registered accounts yet. Create your account at /admin/register.</p>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Invoices Created</th>
                  <th>Last Login</th>
                  <th>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const initial = (u.name || u.email).charAt(0).toUpperCase();
                  const isSuper = u.role === "superadmin";
                  return (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: "50%",
                              background: isSuper
                                ? "linear-gradient(135deg, #c5a880, #dfc19b)"
                                : "linear-gradient(135deg, #38bdf8, #818cf8)",
                              color: "#07090e",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 700,
                              fontSize: 12,
                            }}
                          >
                            {initial}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: "var(--adm-text)" }}>{u.name || "Executive"}</div>
                            <div style={{ fontSize: 11, color: "var(--adm-text-3)" }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: 10,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            padding: "3px 8px",
                            borderRadius: 6,
                            fontWeight: 700,
                            background: isSuper
                              ? "rgba(197, 168, 128, 0.15)"
                              : u.role === "admin"
                              ? "rgba(56, 189, 248, 0.12)"
                              : "rgba(255, 255, 255, 0.05)",
                            color: isSuper ? "#dfc19b" : u.role === "admin" ? "#38bdf8" : "var(--adm-text-3)",
                            border: isSuper
                              ? "1px solid rgba(197, 168, 128, 0.3)"
                              : u.role === "admin"
                              ? "1px solid rgba(56, 189, 248, 0.25)"
                              : "1px solid var(--adm-line)",
                          }}
                        >
                          {isSuper ? "Super Admin" : u.role === "admin" ? "Admin" : "Member"}
                        </span>
                      </td>
                      <td>{u._count?.invoices || 0}</td>
                      <td>{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "Never"}</td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Whitelist & Pending Invitations Table */}
      <div className="adm-section">
        <h2 className="adm-section-title">Whitelist & Invitations ({whitelist.length})</h2>
        {whitelist.length === 0 ? (
          <p className="adm-empty">No whitelisted records found.</p>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Authorized Email</th>
                  <th>Assigned Role</th>
                  <th>Status</th>
                  <th>Invited By</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {whitelist.map((w) => {
                  const isPending = w.status === "pending";
                  const isRevoked = w.status === "revoked";
                  const isActive = w.status === "active";
                  const isSuper = w.email === "imzeeshankhann@gmail.com";

                  return (
                    <tr key={w.id}>
                      <td style={{ fontWeight: 600 }}>{w.email}</td>
                      <td>
                        <span style={{ textTransform: "capitalize", fontSize: 12 }}>
                          {w.role === "superadmin" ? "Super Admin" : w.role}
                        </span>
                      </td>
                      <td>
                        <span
                          className="adm-badge"
                          style={{
                            background: isActive
                              ? "rgba(74, 222, 128, 0.12)"
                              : isPending
                              ? "rgba(197, 168, 128, 0.15)"
                              : "rgba(239, 68, 68, 0.15)",
                            color: isActive ? "#4ade80" : isPending ? "#dfc19b" : "#f87171",
                            border: isActive
                              ? "1px solid rgba(74, 222, 128, 0.3)"
                              : isPending
                              ? "1px solid rgba(197, 168, 128, 0.3)"
                              : "1px solid rgba(239, 68, 68, 0.3)",
                            textTransform: "uppercase",
                            fontSize: 10,
                            letterSpacing: "0.08em",
                          }}
                        >
                          {w.status}
                        </span>
                      </td>
                      <td>{w.invitedBy?.name || "System Root"}</td>
                      <td>{new Date(w.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display: "flex", gap: 8 }}>
                          {isPending && (
                            <button
                              onClick={() => handleResend(w.id, w.email)}
                              disabled={actionLoading}
                              style={{
                                background: "none",
                                border: "1px solid var(--adm-line-2)",
                                color: "#dfc19b",
                                padding: "4px 10px",
                                borderRadius: 6,
                                fontSize: 11,
                                cursor: "pointer",
                              }}
                            >
                              Resend Invite
                            </button>
                          )}
                          {!isSuper && !isRevoked && (
                            <button
                              onClick={() => handleRevoke(w.id, w.email)}
                              disabled={actionLoading}
                              style={{
                                background: "none",
                                border: "1px solid rgba(239, 68, 68, 0.3)",
                                color: "#f87171",
                                padding: "4px 10px",
                                borderRadius: 6,
                                fontSize: 11,
                                cursor: "pointer",
                              }}
                            >
                              Revoke
                            </button>
                          )}
                          {!isSuper && isRevoked && (
                            <button
                              onClick={() => handleRestore(w.id, w.email)}
                              disabled={actionLoading}
                              style={{
                                background: "none",
                                border: "1px solid rgba(74, 222, 128, 0.3)",
                                color: "#4ade80",
                                padding: "4px 10px",
                                borderRadius: 6,
                                fontSize: 11,
                                cursor: "pointer",
                              }}
                            >
                              Restore
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
