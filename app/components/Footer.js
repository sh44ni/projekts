"use client";

import Image from "next/image";

const NAV_COLS = [
  {
    title: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#blog" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Web Development", href: "#services" },
      { label: "App Development", href: "#services" },
      { label: "AI Solutions", href: "#services" },
      { label: "Digital Strategy", href: "#services" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Twitter / X", href: "#" },
      { label: "LinkedIn", href: "#" },
      { label: "Instagram", href: "#" },
      { label: "GitHub", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="footer" id="footer">
      {/* Grid floor — background layer */}
      <div className="footer-terrain">
        <div className="floor-grid" />
        <div className="floor-horizon" />
      </div>

      {/* Footer content — sits on top */}
      <div className="footer-content">
        <div className="footer-top">
          <div className="footer-brand">
            <Image
              src="/logofordarkbg.svg"
              alt="Projekts"
              width={130}
              height={30}
              style={{ objectFit: "contain" }}
            />
            <p className="footer-brand-desc">
              We design and build high-performance digital products that drive real growth.
            </p>
          </div>

          <div className="footer-nav">
            {NAV_COLS.map((col) => (
              <div key={col.title} className="footer-col">
                <h4 className="footer-col-title">{col.title}</h4>
                <ul className="footer-col-list">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="footer-col-link">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-copy">
            © {new Date().getFullYear()} Projekts. All rights reserved.
          </span>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
