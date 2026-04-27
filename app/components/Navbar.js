"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useContact } from "./ContactPopup";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { setOpen } = useContact();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`nav ${scrolled ? "scrolled" : ""}`} id="main-nav">
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
            className="mobile-menu-toggle"
            id="mobile-menu-toggle"
            aria-label="Toggle navigation menu"
          >
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
}
