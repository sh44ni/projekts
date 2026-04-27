"use client";

import { useContact } from "./ContactPopup";

export default function PreFooter() {
  const { setOpen } = useContact();

  return (
    <section className="prefooter" id="contact">
      <div className="prefooter-inner">
        <span className="prefooter-eyebrow">Ready to start?</span>
        <h2 className="prefooter-heading">
          Have a project in mind?
          <br />
          <span className="prefooter-accent">Let&apos;s talk.</span>
        </h2>
        <p className="prefooter-desc">
          Tell us what you need — a booking system, a mobile app, an AI integration, or a complete platform.
          We&apos;ll tell you exactly what it takes.
        </p>
        <div className="prefooter-cta">
          <button className="btn-primary" id="btn-prefooter-start" onClick={() => setOpen(true)}>
            <span>Start a Project</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7" /><path d="M7 7h10v10" />
            </svg>
          </button>
          <a href="tel:+923040260023" className="btn-outline" id="btn-prefooter-talk">
            <span>Call Us</span>
          </a>
        </div>
      </div>
    </section>
  );
}
