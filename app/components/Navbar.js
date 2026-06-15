"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useContact } from "./ContactPopup";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });
  const navLinksRef = useRef(null);
  const { setOpen } = useContact();

  const moveIndicator = (e) => {
    const list = navLinksRef.current;
    if (!list) return;
    const rect = list.getBoundingClientRect();
    const target = e.currentTarget.getBoundingClientRect();
    setIndicator({
      left: target.left - rect.left,
      width: target.width,
      opacity: 1,
    });
  };

  const hideIndicator = () => setIndicator((i) => ({ ...i, opacity: 0 }));

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
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav
        className={`nav ${scrolled ? "scrolled" : ""} ${menuOpen ? "menu-open" : ""}`}
        id="main-nav"
      >
        <div className="nav-inner">
          <a
            href="/"
            className="nav-logo"
            id="nav-logo"
            aria-label="Projekts Home"
          >
            <Image
              src="/logofordarkbg.svg"
              alt="Projekts"
              width={120}
              height={28}
              priority
            />
          </a>

          <ul
            className="nav-links"
            id="nav-links"
            ref={navLinksRef}
            onMouseLeave={hideIndicator}
          >
            <span
              className="nav-indicator"
              aria-hidden="true"
              style={{
                left: `${indicator.left}px`,
                width: `${indicator.width}px`,
                opacity: indicator.opacity,
              }}
            />
            <li>
              <a href="/about" className="nav-link" onMouseEnter={moveIndicator}>
                About
              </a>
            </li>
            <li>
              <a href="/#services" className="nav-link" onMouseEnter={moveIndicator}>
                Services
              </a>
            </li>
            <li>
              <a href="/case-studies" className="nav-link" onMouseEnter={moveIndicator}>
                Case Studies
              </a>
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
      <div
        className={`mobile-menu-overlay ${menuOpen ? "open" : ""}`}
        onClick={closeMenu}
      >
        <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
          <nav className="mobile-menu-nav">
            <a href="/about" className="mobile-menu-link" onClick={closeMenu}>
              About
            </a>
            <a
              href="/#services"
              className="mobile-menu-link"
              onClick={closeMenu}
            >
              Services
            </a>
            <a
              href="/case-studies"
              className="mobile-menu-link"
              onClick={closeMenu}
            >
              Case Studies
            </a>
          </nav>
          <div className="mobile-menu-actions">
            <button
              className="mobile-menu-cta"
              onClick={() => {
                closeMenu();
                setOpen(true);
              }}
            >
              Get Started
            </button>
            <a href="tel:+923040260023" className="mobile-menu-call">
              Call Us 0304 026 0023
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
