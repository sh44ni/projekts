"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      const data = await res.json();
      setError(data.error || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="adm-login-page">
      <div className="adm-login-card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <span className="adm-login-mark" aria-hidden="true">P</span>
          <span
            style={{
              fontSize: 10,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding: "4px 10px",
              background: "rgba(197, 168, 128, 0.12)",
              border: "1px solid rgba(197, 168, 128, 0.28)",
              borderRadius: 999,
              color: "#dfc19b",
              fontWeight: 600,
            }}
          >
            Control Deck
          </span>
        </div>
        <h1 className="adm-login-title">Projekts Control Deck</h1>
        <p className="adm-login-subtitle">Sign in to access your individual workspace</p>
        {error && <div className="adm-login-error">{error}</div>}
        <form onSubmit={handleSubmit} className="adm-login-form">
          <div className="adm-login-field">
            <label>Authorized Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@projektsvision.com"
              required
            />
          </div>
          <div className="adm-login-field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="adm-login-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div
          style={{
            marginTop: 24,
            paddingTop: 18,
            borderTop: "1px solid var(--adm-line)",
            textAlign: "center",
            fontSize: 12,
            color: "var(--adm-text-3)",
          }}
        >
          Authorized team member?{" "}
          <Link
            href="/admin/register"
            style={{ color: "#dfc19b", textDecoration: "none", fontWeight: 600 }}
          >
            Activate your account →
          </Link>
        </div>
      </div>
    </div>
  );
}
