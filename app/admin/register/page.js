"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState(1); // 1 = Enter Email, 2 = Verify Code & Set Password
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [notWhitelisted, setNotWhitelisted] = useState(false);

  useEffect(() => {
    const qEmail = searchParams.get("email");
    const qToken = searchParams.get("token");
    if (qEmail) setEmail(qEmail);
    if (qToken) {
      setToken(qToken);
      setStep(2); // If invite token in URL, skip directly to step 2
    }
  }, [searchParams]);

  // Step 1: Request Verification Code
  const handleRequestCode = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");
    setInfo("");
    setNotWhitelisted(false);

    try {
      const res = await fetch("/api/admin/register/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setInfo(data.message || `Verification code sent to ${email}`);
        setStep(2);
      } else {
        setError(data.error || "Failed to verify email");
        if (data.notWhitelisted) {
          setNotWhitelisted(true);
        }
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!token && (!code || code.length < 6)) {
      setError("Please enter the 6-digit verification code sent to your email");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          token,
          code,
          name,
          password,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setInfo("Account activated successfully! Redirecting to Control Deck...");
        setTimeout(() => {
          router.push("/admin");
        }, 1200);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Network error during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adm-login-page">
      <div className="adm-login-card" style={{ maxWidth: 440 }}>
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
            Authorized Access Only
          </span>
        </div>

        <h1 className="adm-login-title">Control Deck Setup</h1>
        <p className="adm-login-subtitle">
          {step === 1
            ? "Verify your authorized email address to begin"
            : "Complete your profile & set your secure credentials"}
        </p>

        {error && (
          <div
            className="adm-login-error"
            style={{
              background: notWhitelisted ? "rgba(239, 68, 68, 0.15)" : undefined,
              border: notWhitelisted ? "1px solid rgba(239, 68, 68, 0.4)" : undefined,
              lineHeight: 1.5,
            }}
          >
            {error}
          </div>
        )}

        {info && (
          <div
            style={{
              padding: "12px 16px",
              marginBottom: 20,
              background: "rgba(74, 222, 128, 0.1)",
              border: "1px solid rgba(74, 222, 128, 0.3)",
              borderRadius: 10,
              color: "#86efac",
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            {info}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleRequestCode} className="adm-login-form">
            <div className="adm-login-field">
              <label>Whitelisted Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="imzeeshankhann@gmail.com"
                required
                autoFocus
              />
              <span style={{ fontSize: 11, color: "var(--adm-text-4)", marginTop: 4 }}>
                Only pre-authorized team and executive emails are permitted.
              </span>
            </div>

            <button type="submit" className="adm-login-btn" disabled={loading}>
              {loading ? "Checking Whitelist & Sending Code..." : "Send Verification Code"}
            </button>

            <div style={{ textAlign: "center", marginTop: 18, fontSize: 12, color: "var(--adm-text-3)" }}>
              Already have an active account?{" "}
              <Link href="/admin/login" style={{ color: "#dfc19b", textDecoration: "none", fontWeight: 600 }}>
                Sign In →
              </Link>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleRegister} className="adm-login-form">
            <div className="adm-login-field">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label>Email Address</label>
                {!token && (
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setError("");
                      setInfo("");
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#dfc19b",
                      fontSize: 11,
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    Change Email
                  </button>
                )}
              </div>
              <input
                type="email"
                value={email}
                disabled
                style={{ opacity: 0.7, cursor: "not-allowed" }}
              />
            </div>

            {!token && (
              <div className="adm-login-field">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label>6-Digit Security Code</label>
                  <button
                    type="button"
                    onClick={handleRequestCode}
                    disabled={loading}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--adm-text-3)",
                      fontSize: 11,
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    Resend Code
                  </button>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  required
                  style={{
                    letterSpacing: "0.28em",
                    fontFamily: "monospace",
                    fontSize: 18,
                    fontWeight: 700,
                  }}
                  autoFocus
                />
              </div>
            )}

            <div className="adm-login-field">
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Zeeshan Khan"
                required
              />
            </div>

            <div className="adm-login-field">
              <label>Create Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                minLength={8}
              />
            </div>

            <div className="adm-login-field">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                minLength={8}
              />
            </div>

            <button type="submit" className="adm-login-btn" disabled={loading}>
              {loading ? "Activating Account..." : "Create Account & Sign In"}
            </button>

            <div style={{ textAlign: "center", marginTop: 18, fontSize: 12, color: "var(--adm-text-3)" }}>
              Already registered?{" "}
              <Link href="/admin/login" style={{ color: "#dfc19b", textDecoration: "none", fontWeight: 600 }}>
                Sign In →
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="adm-loading">
          <div className="adm-spinner" />
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
