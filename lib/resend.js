// lib/resend.js - High-end On-Brand Email Service for Projekts Vision

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM_EMAIL || "Projekts Vision <support@projektsvision.com>";

export async function sendEmail({ to, subject, html, text }) {
  if (!RESEND_API_KEY) {
    console.error("[Resend] Missing RESEND_API_KEY environment variable");
    return { success: false, error: "Missing Resend API Key" };
  }

  try {
    const recipients = Array.isArray(to) ? to : [to];
    const payload = {
      from: RESEND_FROM,
      to: recipients,
      subject,
      html,
      text: text || html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
    };

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "User-Agent": "ProjektsVision/1.0",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("[Resend] API Error:", data);
      return { success: false, error: data.message || "Failed to send email" };
    }

    return { success: true, id: data.id };
  } catch (err) {
    console.error("[Resend] Network/Send exception:", err);
    return { success: false, error: err.message };
  }
}

/**
 * On-brand base layout wrapper for Projekts Vision emails
 */
function emailShell({ title, badge, content }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #07090e;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #e2e8f0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #07090e;
      padding: 40px 16px;
      box-sizing: border-box;
    }
    .container {
      max-width: 540px;
      margin: 0 auto;
      background: linear-gradient(180deg, #10141f 0%, #0c0f17 100%);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.03);
    }
    .header {
      padding: 32px 32px 24px 32px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .brand-title {
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #ffffff;
      margin: 0;
    }
    .brand-sub {
      font-size: 11px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #c5a880;
      margin-top: 4px;
    }
    .badge {
      display: inline-block;
      font-size: 10px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      padding: 4px 10px;
      background: rgba(197, 168, 128, 0.12);
      border: 1px solid rgba(197, 168, 128, 0.28);
      border-radius: 999px;
      color: #dfc19b;
      font-weight: 600;
    }
    .body {
      padding: 36px 32px;
    }
    .h1 {
      font-size: 22px;
      font-weight: 600;
      color: #ffffff;
      margin: 0 0 12px 0;
      letter-spacing: -0.01em;
    }
    .p {
      font-size: 14px;
      line-height: 1.65;
      color: #94a3b8;
      margin: 0 0 24px 0;
    }
    .code-box {
      background: #090c12;
      border: 1px solid rgba(197, 168, 128, 0.3);
      border-radius: 12px;
      padding: 24px 16px;
      text-align: center;
      margin: 28px 0;
    }
    .code-val {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 34px;
      font-weight: 700;
      letter-spacing: 0.32em;
      color: #ffffff;
      text-shadow: 0 0 20px rgba(197, 168, 128, 0.3);
      padding-left: 0.32em;
    }
    .btn-wrap {
      text-align: center;
      margin: 32px 0;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #c5a880 0%, #dfc19b 100%);
      color: #07090e !important;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 10px;
      box-shadow: 0 6px 20px -4px rgba(197, 168, 128, 0.35);
    }
    .note {
      font-size: 12px;
      line-height: 1.55;
      color: #64748b;
      padding: 16px;
      background: rgba(255, 255, 255, 0.02);
      border-radius: 8px;
      border-left: 2px solid #c5a880;
      margin-top: 24px;
    }
    .footer {
      padding: 24px 32px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      background: #090c13;
      text-align: center;
    }
    .footer-text {
      font-size: 11px;
      color: #475569;
      line-height: 1.6;
      margin: 0;
    }
    .footer-link {
      color: #94a3b8;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div>
          <h2 class="brand-title">Projekts Vision</h2>
          <div class="brand-sub">Control Deck · Enterprise Portal</div>
        </div>
        ${badge ? `<span class="badge">${badge}</span>` : ""}
      </div>
      <div class="body">
        ${content}
      </div>
      <div class="footer">
        <p class="footer-text">
          Projekts Vision LLC · Delaware · Zurich · Worldwide<br/>
          Secure Enterprise Infrastructure · <a href="https://projektsvision.com" class="footer-link">projektsvision.com</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Dispatch 6-digit OTP verification email
 */
export async function sendVerificationCodeEmail({ to, code, role = "superadmin" }) {
  const roleLabel = role === "superadmin" ? "Super Admin" : role === "admin" ? "Administrator" : "Team Member";
  const html = emailShell({
    title: "Projekts Vision Security Verification",
    badge: "Security Passcode",
    content: `
      <h1 class="h1">Activate Your ${roleLabel} Account</h1>
      <p class="p">
        A request has been initiated to set up your account on the <strong>Projekts Vision Control Deck</strong>. Use the 6-digit verification code below to authorize your registration:
      </p>
      <div class="code-box">
        <div class="code-val">${code}</div>
      </div>
      <p class="p" style="margin-bottom: 8px; font-size: 13px;">
        ⏱ <strong>This code is active for 15 minutes.</strong>
      </p>
      <div class="note">
        This security code was dispatched exclusively to <strong>${to}</strong>. If you did not initiate this registration request, please disregard this email.
      </div>
    `,
  });

  return sendEmail({
    to,
    subject: `Your Projekts Vision Control Deck Verification Code: ${code}`,
    html,
  });
}

/**
 * Dispatch Team Invitation email
 */
export async function sendInvitationEmail({ to, inviteUrl, code, role = "member", inviterName = "An Administrator" }) {
  const roleTitle = role === "superadmin" ? "Super Admin" : role === "admin" ? "Administrator" : "Team Member";
  const html = emailShell({
    title: "Invitation to Projekts Vision Control Deck",
    badge: "Official Invitation",
    content: `
      <h1 class="h1">You're Invited to Control Deck</h1>
      <p class="p">
        <strong>${inviterName}</strong> has authorized your access to the <strong>Projekts Vision Control Deck</strong> as a <strong>${roleTitle}</strong>.
      </p>
      <p class="p">
        Your email is now whitelisted. Click the button below to complete your profile, set your secure password, and access your individual workspace:
      </p>
      <div class="btn-wrap">
        <a href="${inviteUrl}" class="btn">Accept Invitation & Set Up Account</a>
      </div>
      ${
        code
          ? `
      <div class="code-box" style="padding: 16px; margin: 20px 0;">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #94a3b8; margin-bottom: 8px;">Registration Backup Code</div>
        <div class="code-val" style="font-size: 26px;">${code}</div>
      </div>`
          : ""
      }
      <div class="note">
        This invitation is restricted to <strong>${to}</strong>. You will be able to manage your own invoices, leads, and operational tools inside the platform.
      </div>
    `,
  });

  return sendEmail({
    to,
    subject: `Invitation: Join Projekts Vision Control Deck as ${roleTitle}`,
    html,
  });
}

/**
 * Dispatch Account Activated Confirmation email
 */
export async function sendWelcomeEmail({ to, name, role = "member" }) {
  const roleTitle = role === "superadmin" ? "Super Admin" : role === "admin" ? "Administrator" : "Team Member";
  const html = emailShell({
    title: "Account Activated - Projekts Vision Control Deck",
    badge: "Account Online",
    content: `
      <h1 class="h1">Welcome, ${name || "Executive"}</h1>
      <p class="p">
        Your <strong>${roleTitle}</strong> account on the Projekts Vision Control Deck has been successfully activated and is now online.
      </p>
      <p class="p">
        You now have access to your personal workspace, official branded invoice generator, customer relations hub, and project analytics.
      </p>
      <div class="btn-wrap">
        <a href="https://projektsvision.com/admin" class="btn">Access Control Deck</a>
      </div>
      <div class="note">
        For security, always verify that you are connecting via <strong>https://projektsvision.com/admin</strong>.
      </div>
    `,
  });

  return sendEmail({
    to,
    subject: `Account Activated: Projekts Vision Control Deck (${roleTitle})`,
    html,
  });
}
