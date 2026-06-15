"use client";

import "./admin.css";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: "◻", code: "01" },
  { label: "Case Studies", href: "/admin/case-studies", icon: "◆", code: "02" },
  { label: "Submissions", href: "/admin/submissions", icon: "✉", code: "03" },
  { label: "Jobs", href: "/admin/jobs", icon: "💼", code: "04" },
  { label: "Applications", href: "/admin/applications", icon: "📄", code: "05" },
  { label: "Analytics", href: "/admin/analytics", icon: "◈", code: "06" },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setReady(true);
      return;
    }
    fetch("/api/admin/submissions", { credentials: "include" }).then((r) => {
      if (r.status === 401) router.push("/admin/login");
      else setReady(true);
    });
  }, [pathname, router]);

  if (pathname === "/admin/login") return children;

  if (!ready) {
    return (
      <div className="adm-loading">
        <div className="adm-bg" aria-hidden="true" />
        <div className="adm-spinner" />
      </div>
    );
  }

  const activeIndex = NAV.findIndex(
    (n) => pathname === n.href || (n.href !== "/admin" && pathname.startsWith(n.href)),
  );

  return (
    <div className="adm-shell">
      <div className="adm-bg" aria-hidden="true" />
      <aside className="adm-sidebar">
        <div className="adm-sidebar-logo">
          <span className="adm-logo-mark" aria-hidden="true">P</span>
          <div className="adm-logo-text">
            <Link href="/">Projekts</Link>
            <span className="adm-sidebar-badge">Control Deck</span>
          </div>
        </div>

        <nav className="adm-sidebar-nav">
          <span
            className="adm-nav-indicator"
            aria-hidden="true"
            style={{
              transform: `translateY(${activeIndex >= 0 ? activeIndex * 46 : -100}px)`,
              opacity: activeIndex >= 0 ? 1 : 0,
            }}
          />
          {NAV.map((n) => {
            const active =
              pathname === n.href || (n.href !== "/admin" && pathname.startsWith(n.href));
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`adm-sidebar-link ${active ? "active" : ""}`}
              >
                <span className="adm-sidebar-icon">{n.icon}</span>
                <span className="adm-sidebar-label">{n.label}</span>
                <span className="adm-sidebar-code">{n.code}</span>
              </Link>
            );
          })}
        </nav>

        <div className="adm-sidebar-footer">
          <div className="adm-status">
            <span className="adm-status-dot" aria-hidden="true" />
            <span className="adm-status-text">All systems operational</span>
          </div>
          <Link href="/" className="adm-sidebar-link adm-sidebar-back">
            <span className="adm-sidebar-icon">←</span>
            <span className="adm-sidebar-label">Back to Site</span>
          </Link>
        </div>
      </aside>
      <main className="adm-main">{children}</main>
    </div>
  );
}
