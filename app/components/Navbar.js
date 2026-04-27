"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useContact } from "./ContactPopup";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { setOpen } = useContact();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className={`nav ${scrolled ? "scrolled" : ""} ${menuOpen ? "menu-open" : ""}`} id="main-nav">
        <div className="nav-inner">
          <a href="/" className="nav-logo" id="nav-logo" aria-label="Projekts Home">
            <Image
              src="/logofordarkbg.svg"
              alt="Projekts"
              width={120}
              height={28}
              priority
            />
          </a>

          <ul className="nav-links" id="nav-links">
            <li>
              <a href="/about" className="nav-link">About</a>
            </li>
            <li>
              <a href="/#services" className="nav-link">Services</a>
            </li>
            <li>
              <a href="/#case-studies" className="nav-link">Case Studies</a>
            </li>
          </ul>

          <div className="nav-actions">
            <button
              className="btn-nav"
              id="btn-contact-nav"
              onClick={() => setOpen(true)}
            >
              Get Started
            </button>
            <button
              className={`mobile-menu-toggle ${menuOpen ? "open" : ""}`}
              id="mobile-menu-toggle"
              aria-label="Toggle navigation menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile fullscreen menu */}
      <div className={`mobile-menu-overlay ${menuOpen ? "open" : ""}`} onClick={closeMenu}>
        <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
          <nav className="mobile-menu-nav">
            <a href="/about" className="mobile-menu-link" onClick={closeMenu}>About</a>
            <a href="/#services" className="mobile-menu-link" onClick={closeMenu}>Services</a>
            <a href="/#case-studies" className="mobile-menu-link" onClick={closeMenu}>Case Studies</a>
          </nav>
          <div className="mobile-menu-actions">
            <button
              className="mobile-menu-cta"
              onClick={() => { closeMenu(); setOpen(true); }}
            >
              Get Started
            </button>
            <a href="tel:+923040260023" className="mobile-menu-call">
              Call Us — 0304 026 0023
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
