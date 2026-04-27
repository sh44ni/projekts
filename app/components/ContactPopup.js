"use client";

import { useState, useRef, useEffect, createContext, useContext } from "react";

const ContactContext = createContext();

export function useContact() {
  return useContext(ContactContext);
}

export function ContactProvider({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <ContactContext.Provider value={{ open, setOpen }}>
      {children}
      <ContactPopup open={open} onClose={() => setOpen(false)} />
    </ContactContext.Provider>
  );
}

const SERVICE_OPTIONS = [
  "Web Development",
  "App Development",
  "AI Integration",
  "Digital Marketing",
  "Full Platform Build",
  "Other",
];

const BUDGET_OPTIONS = [
  "Under $2,000",
  "$2,000 – $5,000",
  "$5,000 – $15,000",
  "$15,000+",
  "Let's discuss",
];

function CustomSelect({ label, options, value, onChange, id }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`cp-select ${isOpen ? "open" : ""}`} ref={ref}>
      <label className="cp-label">{label}</label>
      <button
        type="button"
        className="cp-select-trigger"
        onClick={() => setIsOpen(!isOpen)}
        id={id}
      >
        <span className={value ? "cp-select-value" : "cp-select-placeholder"}>
          {value || `Select ${label.toLowerCase()}`}
        </span>
        <svg
          className="cp-select-chevron"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div className="cp-select-dropdown">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            className={`cp-select-option ${opt === value ? "selected" : ""}`}
            onClick={() => {
              onChange(opt);
              setIsOpen(false);
            }}
          >
            {opt}
            {opt === value && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function ContactPopup({ open, onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    service: "",
    budget: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setForm({ name: "", email: "", service: "", budget: "", message: "" });
        onClose();
      }, 3000);
    } catch {
      alert("Failed to submit. Please try again.");
    }
  };

  if (!open) return null;

  return (
    <div
      className="cp-overlay"
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="cp-modal">
        {/* Close button */}
        <button className="cp-close" onClick={onClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18" /><path d="M6 6l12 12" />
          </svg>
        </button>

        {submitted ? (
          <div className="cp-success">
            <div className="cp-success-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3 className="cp-success-title">We&rsquo;ll be in touch</h3>
            <p className="cp-success-text">
              Expect a reply within 24 hours. If it&rsquo;s urgent, call us directly.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="cp-header">
              <span className="cp-eyebrow">Get in Touch</span>
              <h2 className="cp-title">Tell us about your project</h2>
              <p className="cp-subtitle">
                Fill in the details below and we&rsquo;ll get back to you within 24 hours.
              </p>
            </div>

            {/* Quick actions */}
            <div className="cp-quick-actions">
              <a href="tel:+923040260023" className="cp-action-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
                <span>Call Us</span>
              </a>
              <a href="https://wa.me/923040260023" target="_blank" rel="noopener noreferrer" className="cp-action-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>WhatsApp</span>
              </a>
            </div>

            <div className="cp-divider">
              <span>or send us a message</span>
            </div>

            {/* Form */}
            <form className="cp-form" onSubmit={handleSubmit}>
              <div className="cp-row">
                <div className="cp-field">
                  <label className="cp-label" htmlFor="cp-name">Name</label>
                  <input
                    id="cp-name"
                    type="text"
                    className="cp-input"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="cp-field">
                  <label className="cp-label" htmlFor="cp-email">Email</label>
                  <input
                    id="cp-email"
                    type="email"
                    className="cp-input"
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="cp-row">
                <CustomSelect
                  label="Service Needed"
                  options={SERVICE_OPTIONS}
                  value={form.service}
                  onChange={(v) => setForm({ ...form, service: v })}
                  id="cp-service"
                />
                <CustomSelect
                  label="Budget Range"
                  options={BUDGET_OPTIONS}
                  value={form.budget}
                  onChange={(v) => setForm({ ...form, budget: v })}
                  id="cp-budget"
                />
              </div>

              <div className="cp-field">
                <label className="cp-label" htmlFor="cp-message">Tell us more</label>
                <textarea
                  id="cp-message"
                  className="cp-textarea"
                  placeholder="Brief description of your project..."
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>

              <button type="submit" className="cp-submit">
                <span>Send Inquiry</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
