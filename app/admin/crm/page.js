"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function AdminCrmPage() {
  const [stats, setStats] = useState({
    totalChats: 0,
    capturedLeads: 0,
    qualifiedDeals: 0,
    unreadCount: 0,
  });
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);

  const transcriptEndRef = useRef(null);

  // Load sessions list
  const loadSessions = async () => {
    setLoading(true);
    try {
      let q = [];
      if (filter === "unread") q.push("unread=true");
      else if (filter !== "all") q.push(`status=${filter}`);
      if (search.trim()) q.push(`search=${encodeURIComponent(search.trim())}`);

      const url = `/api/admin/crm${q.length ? "?" + q.join("&") : ""}`;
      const res = await fetch(url, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats || {});
        setSessions(data.sessions || []);

        // Default select the first session if none selected
        if (data.sessions?.length > 0 && !selectedId) {
          setSelectedId(data.sessions[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load CRM sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [filter]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      loadSessions();
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Load active session detail when selectedId changes
  useEffect(() => {
    if (!selectedId) {
      setActiveSession(null);
      return;
    }

    setLoadingDetail(true);
    fetch(`/api/admin/crm/${selectedId}`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) {
          setActiveSession(data);
          setNotes(data.notes || "");
          // Update sessions list to mark read
          setSessions((prev) =>
            prev.map((s) => (s.id === selectedId ? { ...s, unreadByAdmin: false } : s))
          );
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoadingDetail(false));
  }, [selectedId]);

  // Update lead status or score
  const updateSession = async (updates) => {
    if (!selectedId) return;
    try {
      const res = await fetch(`/api/admin/crm/${selectedId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated = await res.json();
        setActiveSession((prev) => ({ ...prev, ...updated }));
        setSessions((prev) =>
          prev.map((s) => (s.id === selectedId ? { ...s, ...updated } : s))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Save internal CRM notes
  const handleSaveNotes = async () => {
    if (!selectedId || savingNotes) return;
    setSavingNotes(true);
    try {
      await updateSession({ notes });
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2000);
    } finally {
      setSavingNotes(false);
    }
  };

  // Delete session
  const handleDeleteSession = async () => {
    if (!selectedId || !confirm("Are you sure you want to delete this chat session?")) return;
    try {
      const res = await fetch(`/api/admin/crm/${selectedId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        const remaining = sessions.filter((s) => s.id !== selectedId);
        setSessions(remaining);
        setSelectedId(remaining[0]?.id || null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return "#10b981"; // Emerald
    if (score >= 45) return "#f59e0b"; // Amber
    return "#64748b"; // Slate
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "qualified":
        return "adm-crm-badge-qualified";
      case "contacted":
        return "adm-crm-badge-contacted";
      case "won":
        return "adm-crm-badge-won";
      case "archived":
        return "adm-crm-badge-archived";
      default:
        return "adm-crm-badge-new";
    }
  };

  return (
    <div className="adm-page adm-crm-page">
      {/* Page Header & KPI Cards */}
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-title">AI Chat CRM & Leads</h1>
          <p className="adm-page-subtitle">
            Live client inquiries, qualified opportunities & AI sales consultation transcripts
          </p>
        </div>
        <div className="adm-crm-header-actions">
          <button className="adm-btn adm-btn-secondary" onClick={loadSessions}>
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="adm-crm-kpi-grid">
        <div className="adm-crm-kpi-card">
          <div className="adm-crm-kpi-label">Total Chats</div>
          <div className="adm-crm-kpi-value">{stats.totalChats || 0}</div>
          <div className="adm-crm-kpi-sub">All logged visitor sessions</div>
        </div>
        <div className="adm-crm-kpi-card">
          <div className="adm-crm-kpi-label">Captured Leads</div>
          <div className="adm-crm-kpi-value" style={{ color: "#38bdf8" }}>
            {stats.capturedLeads || 0}
          </div>
          <div className="adm-crm-kpi-sub">Provided name & email</div>
        </div>
        <div className="adm-crm-kpi-card">
          <div className="adm-crm-kpi-label">Qualified Opportunities</div>
          <div className="adm-crm-kpi-value" style={{ color: "#10b981" }}>
            {stats.qualifiedDeals || 0}
          </div>
          <div className="adm-crm-kpi-sub">High intent & budget declared</div>
        </div>
        <div className="adm-crm-kpi-card">
          <div className="adm-crm-kpi-label">Requires Attention</div>
          <div className="adm-crm-kpi-value" style={{ color: stats.unreadCount > 0 ? "#f87171" : "#94a3b8" }}>
            {stats.unreadCount || 0}
          </div>
          <div className="adm-crm-kpi-sub">Unread incoming chats</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="adm-crm-filter-bar">
        <div className="adm-filters">
          {[
            { id: "all", label: "All Leads" },
            { id: "unread", label: "Unread" },
            { id: "qualified", label: "Qualified" },
            { id: "new", label: "New" },
            { id: "contacted", label: "Contacted" },
            { id: "won", label: "Won" },
            { id: "archived", label: "Archived" },
          ].map((f) => (
            <button
              key={f.id}
              className={`adm-filter-btn ${filter === f.id ? "active" : ""}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="adm-crm-search-box">
          <input
            type="text"
            placeholder="Search leads, email, company, notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="adm-crm-search-clear" onClick={() => setSearch("")}>
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Split-Screen Workspace */}
      <div className="adm-crm-workspace">
        {/* Left Column: Sessions List */}
        <div className="adm-crm-inbox">
          {loading ? (
            <div className="adm-crm-loading">Loading leads...</div>
          ) : sessions.length === 0 ? (
            <div className="adm-empty-state">
              <p>No chat sessions match current criteria.</p>
            </div>
          ) : (
            <div className="adm-crm-list">
              {sessions.map((s) => {
                const isSelected = s.id === selectedId;
                const hasLead = !!s.visitorEmail;
                const displayName = s.visitorName || (s.visitorEmail ? s.visitorEmail.split("@")[0] : `Visitor #${s.sessionKey.slice(-5)}`);

                return (
                  <div
                    key={s.id}
                    className={`adm-crm-card ${isSelected ? "selected" : ""} ${s.unreadByAdmin ? "unread" : ""}`}
                    onClick={() => setSelectedId(s.id)}
                  >
                    <div className="adm-crm-card-header">
                      <div className="adm-crm-card-title-row">
                        {s.unreadByAdmin && <span className="adm-crm-dot" />}
                        <strong className="adm-crm-name">{displayName}</strong>
                        {s.visitorCompany && <span className="adm-crm-company">· {s.visitorCompany}</span>}
                      </div>
                      <span className="adm-crm-time">
                        {new Date(s.lastMessageAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                      </span>
                    </div>

                    {s.visitorEmail && <div className="adm-crm-email">{s.visitorEmail}</div>}

                    <div className="adm-crm-card-meta">
                      <span className={`adm-crm-badge ${getStatusBadgeClass(s.leadStatus)}`}>
                        {s.leadStatus.toUpperCase()}
                      </span>
                      {s.leadScore > 0 && (
                        <span
                          className="adm-crm-score-pill"
                          style={{
                            color: getScoreColor(s.leadScore),
                            borderColor: getScoreColor(s.leadScore),
                          }}
                        >
                          Score: {s.leadScore}
                        </span>
                      )}
                      {s.budget && <span className="adm-crm-budget-tag">{s.budget}</span>}
                    </div>

                    {s.lastMessage && (
                      <p className="adm-crm-snippet">
                        {s.lastMessage.length > 85 ? s.lastMessage.slice(0, 85) + "..." : s.lastMessage}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Lead Detail & Conversation Transcript */}
        <div className="adm-crm-detail">
          {loadingDetail ? (
            <div className="adm-crm-loading">Loading transcript...</div>
          ) : !activeSession ? (
            <div className="adm-empty-state">
              <p>Select a lead or conversation from the inbox to inspect details.</p>
            </div>
          ) : (
            <div className="adm-crm-detail-content">
              {/* Lead Action Header */}
              <div className="adm-crm-dossier-header">
                <div className="adm-crm-dossier-identity">
                  <div className="adm-crm-dossier-avatar">
                    {(activeSession.visitorName || activeSession.visitorEmail || "V").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="adm-crm-dossier-name">
                      {activeSession.visitorName || "Anonymous Visitor"}
                    </h2>
                    <div className="adm-crm-dossier-links">
                      {activeSession.visitorEmail ? (
                        <a href={`mailto:${activeSession.visitorEmail}`} className="adm-crm-link">
                          ✉ {activeSession.visitorEmail}
                        </a>
                      ) : (
                        <span className="adm-crm-dim">No email provided</span>
                      )}
                      {activeSession.visitorPhone && (
                        <a
                          href={`tel:${activeSession.visitorPhone}`}
                          className="adm-crm-link"
                        >
                          📞 {activeSession.visitorPhone}
                        </a>
                      )}
                      {activeSession.visitorCompany && (
                        <span className="adm-crm-dim">🏢 {activeSession.visitorCompany}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="adm-crm-dossier-controls">
                  <div className="adm-crm-control-item">
                    <label>Lead Status</label>
                    <select
                      value={activeSession.leadStatus}
                      onChange={(e) => updateSession({ leadStatus: e.target.value })}
                      className="adm-crm-select"
                    >
                      <option value="new">New</option>
                      <option value="qualified">Qualified</option>
                      <option value="contacted">Contacted</option>
                      <option value="proposal">Proposal Sent</option>
                      <option value="won">Won / Closed</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div className="adm-crm-control-item">
                    <label>Lead Score ({activeSession.leadScore}/100)</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={activeSession.leadScore || 10}
                      onChange={(e) => updateSession({ leadScore: parseInt(e.target.value, 10) })}
                      className="adm-crm-range"
                    />
                  </div>

                  <button
                    type="button"
                    className="adm-btn adm-btn-danger"
                    onClick={handleDeleteSession}
                    title="Delete this conversation"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Dossier Card: Project Scope & Specs */}
              <div className="adm-crm-brief-card">
                <h3 className="adm-crm-brief-title">Project Discovery Brief</h3>
                <div className="adm-crm-brief-grid">
                  <div>
                    <span className="adm-crm-brief-label">Budget:</span>
                    <span className="adm-crm-brief-value">{activeSession.budget || "Not specified"}</span>
                  </div>
                  <div>
                    <span className="adm-crm-brief-label">Target Timeline:</span>
                    <span className="adm-crm-brief-value">{activeSession.timeline || "Not specified"}</span>
                  </div>
                  <div>
                    <span className="adm-crm-brief-label">First Contact:</span>
                    <span className="adm-crm-brief-value">
                      {new Date(activeSession.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="adm-crm-brief-label">Source / IP:</span>
                    <span className="adm-crm-brief-value">
                      {activeSession.ipAddress ? `${activeSession.ipAddress}` : "Direct web"}
                    </span>
                  </div>
                </div>

                {activeSession.projectScope && (
                  <div className="adm-crm-scope-box">
                    <span className="adm-crm-brief-label">Project Scope / Summary:</span>
                    <p>{activeSession.projectScope}</p>
                  </div>
                )}
              </div>

              {/* Internal Notes */}
              <div className="adm-crm-notes-card">
                <div className="adm-crm-notes-header">
                  <h3>Internal Team Notes</h3>
                  <button
                    type="button"
                    className="adm-btn adm-btn-primary adm-btn-sm"
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                  >
                    {notesSaved ? "✓ Saved" : savingNotes ? "Saving..." : "Save Notes"}
                  </button>
                </div>
                <textarea
                  rows="3"
                  className="adm-crm-notes-textarea"
                  placeholder="Add notes from discovery calls, pricing discussions, or next action items..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Live Conversation Transcript */}
              <div className="adm-crm-transcript-card">
                <div className="adm-crm-transcript-header">
                  <h3>AI Conversation Transcript ({activeSession.messages?.length || 0} messages)</h3>
                </div>

                <div className="adm-crm-transcript-stream">
                  {(!activeSession.messages || activeSession.messages.length === 0) ? (
                    <div className="adm-empty-state">No messages logged for this session.</div>
                  ) : (
                    activeSession.messages.map((m) => {
                      if (m.sender === "tool") {
                        return (
                          <div key={m.id} className="adm-crm-msg-tool">
                            <span className="adm-crm-tool-tag">⚡ Tool Execution</span>
                            <strong>{m.toolName}</strong>
                            <pre>{JSON.stringify(m.toolArgs, null, 2)}</pre>
                          </div>
                        );
                      }

                      const isUser = m.sender === "user";
                      return (
                        <div
                          key={m.id}
                          className={`adm-crm-msg-row ${isUser ? "user" : "assistant"}`}
                        >
                          <div className="adm-crm-msg-badge">
                            {isUser ? "Visitor" : "Projekts AI"}
                          </div>
                          <div className="adm-crm-msg-bubble">
                            <p>{m.content}</p>
                            <span className="adm-crm-msg-timestamp">
                              {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={transcriptEndRef} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
