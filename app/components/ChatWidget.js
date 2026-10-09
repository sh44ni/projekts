"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionKey, setSessionKey] = useState("");
  const [showCallout, setShowCallout] = useState(false);
  const [showLeadCard, setShowLeadCard] = useState(false);
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    project_summary: "",
    budget: "$20k - $50k",
  });
  const [leadSubmitting, setLeadSubmitting] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize sessionKey from localStorage
  useEffect(() => {
    let key = localStorage.getItem("pv_chat_session_key");
    if (!key) {
      key = "pv_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      localStorage.setItem("pv_chat_session_key", key);
    }
    setSessionKey(key);

    // Subtle gentle callout after 6 seconds if not dismissed previously
    const dismissed = sessionStorage.getItem("pv_chat_callout_dismissed");
    if (!dismissed) {
      const timer = setTimeout(() => setShowCallout(true), 6000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Fetch past messages when sessionKey is set
  useEffect(() => {
    if (!sessionKey) return;
    fetch(`/api/chat/session?sessionKey=${encodeURIComponent(sessionKey)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages);
        } else {
          // Default initial greeting
          setMessages([
            {
              id: "init",
              sender: "assistant",
              content:
                "Hello! I'm the Projekts Vision AI Advisor. Whether you're exploring custom web applications, mobile platforms, enterprise AI solutions, or need an architectural estimate, I'm here to help. What are you building?",
            },
          ]);
        }
      })
      .catch(() => {
        setMessages([
          {
            id: "init",
            sender: "assistant",
            content:
              "Hello! I'm the Projekts Vision AI Advisor. How can we help bring your software or AI project to life today?",
          },
        ]);
      });
  }, [sessionKey]);

  // Auto scroll to bottom of messages
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open, loading, showLeadCard]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setShowCallout(false);
      sessionStorage.setItem("pv_chat_callout_dismissed", "1");
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  const handleSend = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    setInput("");
    const userMsg = {
      id: "u_" + Date.now(),
      sender: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionKey,
          message: text,
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: "a_" + Date.now(),
            sender: "assistant",
            content: data.reply,
            createdAt: new Date().toISOString(),
          },
        ]);
      } else {
        throw new Error(data.error || "Failed to get response");
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: "err_" + Date.now(),
          sender: "assistant",
          content:
            "I encountered a momentary connection issue. You can also reach our engineering team directly at [support@projektsvision.com](mailto:support@projektsvision.com) or [info@projektsvision.com](mailto:info@projektsvision.com) or continue chatting here in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.email || leadSubmitting) return;

    setLeadSubmitting(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionKey,
          leadData: leadForm,
        }),
      });

      const data = await res.json();
      setShowLeadCard(false);
      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: "lead_" + Date.now(),
            sender: "assistant",
            content: data.reply,
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLeadSubmitting(false);
    }
  };

  const handleResetChat = () => {
    const newKey = "pv_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem("pv_chat_session_key", newKey);
    setSessionKey(newKey);
    setShowLeadCard(false);
    setMessages([
      {
        id: "init_new",
        sender: "assistant",
        content:
          "Starting a fresh session. What questions can I answer about our software engineering, AI pipelines, or past client work?",
      },
    ]);
  };

  const formatMessage = (content) => {
    if (!content) return "";
    // Parse simple markdown links [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }
      const label = match[1];
      const href = match[2];
      const isExternal = href.startsWith("http") || href.startsWith("mailto:");
      parts.push(
        isExternal ? (
          <a
            key={match.index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="pv-chat-link"
          >
            {label}
          </a>
        ) : (
          <Link key={match.index} href={href} className="pv-chat-link" onClick={() => setOpen(false)}>
            {label}
          </Link>
        )
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return parts;
  };

  const SUGGESTED_CHIPS = [
    { label: "⚡ Web & AI Services", query: "What are your core web development and AI services?" },
    { label: "💰 Pricing & Scope", query: "What is your typical project pricing and timeline?" },
    { label: "🏆 Past Work", query: "Can you share recent client case studies and metrics?" },
    { label: "📅 Book Consultation", query: "I would like to book an architectural consultation with your team." },
  ];

  return (
    <div className="pv-chat-widget">
      {/* Gentle Non-Annoying Callout Pill */}
      {!open && showCallout && (
        <div className="pv-chat-callout">
          <button
            type="button"
            className="pv-chat-callout-body"
            onClick={() => setOpen(true)}
            aria-label="Open AI Advisor"
          >
            <span className="pv-chat-callout-dot" />
            <span className="pv-chat-callout-text">
              Have a project in mind? <strong>Chat with our AI Advisor</strong>
            </span>
          </button>
          <button
            type="button"
            className="pv-chat-callout-close"
            onClick={() => {
              setShowCallout(false);
              sessionStorage.setItem("pv_chat_callout_dismissed", "1");
            }}
            aria-label="Dismiss message"
          >
            ✕
          </button>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        type="button"
        className={`pv-chat-trigger ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close chat" : "Chat with AI Advisor"}
      >
        <span className="pv-chat-trigger-icon">
          {open ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <circle cx="9" cy="10" r="1" fill="currentColor" />
              <circle cx="12" cy="10" r="1" fill="currentColor" />
              <circle cx="15" cy="10" r="1" fill="currentColor" />
            </svg>
          )}
        </span>
        {!open && <span className="pv-chat-status-pulse" />}
      </button>

      {/* Expandable Chat Window */}
      {open && (
        <div className="pv-chat-window" role="dialog" aria-label="Projekts Vision AI Assistant">
          {/* Header */}
          <div className="pv-chat-header">
            <div className="pv-chat-header-info">
              <div className="pv-chat-avatar">
                <span className="pv-chat-avatar-text">P</span>
                <span className="pv-chat-avatar-status" />
              </div>
              <div>
                <div className="pv-chat-title">
                  Projekts Vision AI
                  <span className="pv-chat-badge">Online</span>
                </div>
                <div className="pv-chat-subtitle">Technical Solutions & Architecture</div>
              </div>
            </div>
            <div className="pv-chat-header-actions">
              <button
                type="button"
                className="pv-chat-action-btn"
                onClick={handleResetChat}
                title="Start new conversation"
                aria-label="New chat"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
                  <path d="M3 21v-5h5" />
                </svg>
              </button>
              <button
                type="button"
                className="pv-chat-action-btn"
                onClick={() => setOpen(false)}
                title="Close chat"
                aria-label="Close"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Quick Suggestions Chips */}
          <div className="pv-chat-chips">
            {SUGGESTED_CHIPS.map((c) => (
              <button
                key={c.label}
                type="button"
                className="pv-chat-chip"
                onClick={() => handleSend(c.query)}
              >
                {c.label}
              </button>
            ))}
            {!showLeadCard && (
              <button
                type="button"
                className="pv-chat-chip pv-chat-chip-accent"
                onClick={() => setShowLeadCard(true)}
              >
                ✍️ Send Project Brief
              </button>
            )}
          </div>

          {/* Message List */}
          <div className="pv-chat-body">
            {messages.map((m) => (
              <div key={m.id} className={`pv-chat-msg pv-chat-msg-${m.sender}`}>
                {m.sender === "assistant" && (
                  <div className="pv-chat-msg-avatar" aria-hidden="true">
                    P
                  </div>
                )}
                <div className="pv-chat-msg-bubble">
                  <div className="pv-chat-msg-text">{formatMessage(m.content)}</div>
                </div>
              </div>
            ))}

            {/* In-Chat Lead Card */}
            {showLeadCard && (
              <div className="pv-chat-lead-card">
                <div className="pv-chat-lead-header">
                  <div>
                    <strong>Direct Project Brief</strong>
                    <p>Sent directly to Christian Lavelle & Senior Architects</p>
                  </div>
                  <button
                    type="button"
                    className="pv-chat-lead-close"
                    onClick={() => setShowLeadCard(false)}
                  >
                    ✕
                  </button>
                </div>
                <form onSubmit={handleLeadSubmit} className="pv-chat-lead-form">
                  <div className="pv-chat-lead-row">
                    <input
                      type="text"
                      placeholder="Your Name *"
                      value={leadForm.name}
                      onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                      required
                    />
                    <input
                      type="email"
                      placeholder="Work Email *"
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="pv-chat-lead-row">
                    <input
                      type="tel"
                      placeholder="Phone Number (optional)"
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                    />
                    <select
                      value={leadForm.budget}
                      onChange={(e) => setLeadForm({ ...leadForm, budget: e.target.value })}
                    >
                      <option value="$5k - $15k">$5k - $15k (MVP / Prototype)</option>
                      <option value="$20k - $50k">$20k - $50k (Custom Platform)</option>
                      <option value="$50k+">$50k+ (Enterprise / Scaled AI)</option>
                      <option value="Discuss on call">Discuss on call</option>
                    </select>
                  </div>
                  <textarea
                    rows="2"
                    placeholder="Briefly describe your project or technical requirements *"
                    value={leadForm.project_summary}
                    onChange={(e) => setLeadForm({ ...leadForm, project_summary: e.target.value })}
                    required
                  />
                  <button
                    type="submit"
                    className="pv-chat-lead-submit"
                    disabled={leadSubmitting}
                  >
                    {leadSubmitting ? "Submitting Brief..." : "Submit to Engineering Leads →"}
                  </button>
                </form>
              </div>
            )}

            {/* Typing indicator */}
            {loading && (
              <div className="pv-chat-msg pv-chat-msg-assistant">
                <div className="pv-chat-msg-avatar" aria-hidden="true">
                  P
                </div>
                <div className="pv-chat-msg-bubble pv-chat-typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Bar */}
          <form
            className="pv-chat-footer"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              ref={inputRef}
              type="text"
              className="pv-chat-input"
              placeholder="Ask a question or describe your project..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="pv-chat-send"
              disabled={!input.trim() || loading}
              aria-label="Send message"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
          <div className="pv-chat-subnote">
            <span>Powered by Projekts Vision AI · Senior solutions advisory</span>
          </div>
        </div>
      )}
    </div>
  );
}
