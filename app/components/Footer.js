"use client";

import Image from "next/image";
import { useContact } from "./ContactPopup";

const NAV_COLS = [
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "#contact", isContact: true },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Web Development", href: "/services/web-development" },
      { label: "App Development", href: "/services/app-development" },
      { label: "AI Solutions", href: "/services/ai-solutions" },
      { label: "Digital Strategy", href: "/services/digital-strategy" },
    ],
  },
  {
    title: "Connect",
    links: [
      {
        label: "Facebook",
        href: "https://www.facebook.com/profile.php?id=61578025118254",
        external: true,
      },
      { label: "WhatsApp", href: "https://wa.me/923040260023", external: true },
    ],
  },
];

export default function Footer() {
  const { setOpen } = useContact();

  return (
    <footer className="footer" id="footer">
      {/* Grid floor background layer */}
      <div className="footer-terrain">
        <div className="floor-grid" />
        <div className="floor-horizon" />
      </div>

      {/* Footer content sits on top */}
      <div className="footer-content">
        <div className="footer-top">
          <div className="footer-brand">
            <Image
              src="/logofordarkbg.svg"
              alt="Projekts"
              width={130}
              height={30}
              style={{ objectFit: "contain", objectPosition: "left center" }}
            />
            <p className="footer-brand-desc">
              We design and build high-performance digital products that drive
              real growth.
            </p>
          </div>

          <div className="footer-nav">
            {NAV_COLS.map((col) => (
              <div key={col.title} className="footer-col">
                <h4 className="footer-col-title">{col.title}</h4>
                <ul className="footer-col-list">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.isContact ? (
                        <button
                          type="button"
                          className="footer-col-link footer-col-link--btn"
                          onClick={() => setOpen(true)}
                        >
                          {link.label}
                        </button>
                      ) : (
                        <a
                          href={link.href}
                          className="footer-col-link"
                          {...(link.external
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                        >
                          {link.label}
                        </a>
                      )}
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
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
