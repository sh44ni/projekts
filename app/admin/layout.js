"use client";

import "./admin.css";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: "◻" },
  { label: "Submissions", href: "/admin/submissions", icon: "✉" },
  { label: "Analytics", href: "/admin/analytics", icon: "◈" },
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
        <div className="adm-spinner" />
      </div>
    );
  }

  return (
    <div className="adm-shell">
      <aside className="adm-sidebar">
        <div className="adm-sidebar-logo">
          <Link href="/">Projekts</Link>
          <span className="adm-sidebar-badge">Admin</span>
        </div>
        <nav className="adm-sidebar-nav">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`adm-sidebar-link ${pathname === n.href ? "active" : ""}`}
            >
              <span className="adm-sidebar-icon">{n.icon}</span>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="adm-sidebar-footer">
          <Link href="/" className="adm-sidebar-link">← Back to Site</Link>
        </div>
      </aside>
      <main className="adm-main">{children}</main>
    </div>
  );
}
