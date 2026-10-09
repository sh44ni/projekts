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
  { label: "CRM & Leads", href: "/admin/crm", icon: "⚡", code: "07" },
  { label: "Invoices", href: "/admin/invoices", icon: "📋", code: "08" },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (pathname === "/admin/login" || pathname === "/admin/register") {
      setReady(true);
      return;
    }
    fetch("/api/admin/me", { credentials: "include" })
      .then((r) => {
        if (r.status === 401 || r.status === 403) {
          router.push("/admin/login");
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data?.user) {
          setCurrentUser(data.user);
          setReady(true);
        } else {
          router.push("/admin/login");
        }
      })
      .catch(() => {
        router.push("/admin/login");
      });
  }, [pathname, router]);

  if (pathname === "/admin/login" || pathname === "/admin/register") {
    return children;
  }

  if (!ready) {
    return (
      <div className="adm-loading">
        <div className="adm-bg" aria-hidden="true" />
        <div className="adm-spinner" />
      </div>
    );
  }

  const isPrivileged = currentUser?.role === "superadmin" || currentUser?.role === "admin";
  const navItems = [
    ...NAV,
    ...(isPrivileged
      ? [{ label: "Team & Access", href: "/admin/team", icon: "👥", code: "09" }]
      : []),
  ];

  const activeIndex = navItems.findIndex(
    (n) => pathname === n.href || (n.href !== "/admin" && pathname.startsWith(n.href)),
  );

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch (e) {}
    router.push("/admin/login");
  };

  const userInitial = (currentUser?.name || currentUser?.email || "U").charAt(0).toUpperCase();
  const roleLabel =
    currentUser?.role === "superadmin"
      ? "Super Admin"
      : currentUser?.role === "admin"
      ? "Admin"
      : "Member";

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
          {navItems.map((n) => {
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

        <div className="adm-sidebar-footer" style={{ borderTop: "1px solid var(--adm-line)" }}>
          {currentUser && (
            <div
              style={{
                padding: "12px 14px",
                marginBottom: 10,
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid var(--adm-line)",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background:
                    currentUser.role === "superadmin"
                      ? "linear-gradient(135deg, #c5a880, #dfc19b)"
                      : "linear-gradient(135deg, #38bdf8, #818cf8)",
                  color: "#07090e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 13,
                  flexShrink: 0,
                }}
              >
                {userInitial}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--adm-text)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={currentUser.name}
                >
                  {currentUser.name || "Executive"}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "var(--adm-text-3)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={currentUser.email}
                >
                  {currentUser.email}
                </div>
              </div>
              <span
                style={{
                  fontSize: 9,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "2px 6px",
                  borderRadius: 4,
                  fontWeight: 700,
                  background:
                    currentUser.role === "superadmin"
                      ? "rgba(197, 168, 128, 0.15)"
                      : "rgba(56, 189, 248, 0.12)",
                  color:
                    currentUser.role === "superadmin" ? "#dfc19b" : "#38bdf8",
                  border:
                    currentUser.role === "superadmin"
                      ? "1px solid rgba(197, 168, 128, 0.3)"
                      : "1px solid rgba(56, 189, 248, 0.25)",
                }}
              >
                {roleLabel}
              </span>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link
              href="/"
              style={{
                fontSize: 12,
                color: "var(--adm-text-3)",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>←</span>
              <span>Site</span>
            </Link>

            <button
              onClick={handleLogout}
              style={{
                background: "none",
                border: "none",
                color: "#f87171",
                fontSize: 12,
                cursor: "pointer",
                padding: "4px 8px",
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontWeight: 500,
              }}
              title="Sign Out of Control Deck"
            >
              <span>⏻</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
      <main className="adm-main">{children}</main>
    </div>
  );
}
