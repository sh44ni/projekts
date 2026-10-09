import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { sendWelcomeEmail } from "@/lib/resend";

const SECRET = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET || "fallback-secret");

export async function POST(req) {
  try {
    const { email, code, token, name, password } = await req.json();
    const cleanEmail = (email || "").toLowerCase().trim();
    const cleanName = (name || "").trim();

    if (!cleanEmail || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 });
    }

    // 1. Look up whitelist record
    const whitelist = await prisma.adminWhitelist.findUnique({
      where: { email: cleanEmail },
    });

    if (!whitelist) {
      return NextResponse.json(
        { error: "Access Denied: Email address is not authorized on the whitelist." },
        { status: 403 }
      );
    }

    if (whitelist.status === "revoked") {
      return NextResponse.json(
        { error: "Access Denied: Your whitelist invitation has been revoked." },
        { status: 403 }
      );
    }

    // 2. Validate token or OTP code
    let isAuthorized = false;

    if (token && whitelist.inviteToken === token) {
      isAuthorized = true;
    } else if (code) {
      const cleanCode = code.toString().trim();
      const codeMatches = whitelist.verificationCode === cleanCode;
      const notExpired = whitelist.codeExpiresAt && new Date(whitelist.codeExpiresAt) > new Date();

      if (codeMatches && notExpired) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Invalid or expired verification code. Please request a new code." },
        { status: 400 }
      );
    }

    // 3. Ensure user does not already exist
    const existingUser = await prisma.adminUser.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please log in." },
        { status: 400 }
      );
    }

    // 4. Hash password and create user in database
    const passwordHash = await bcrypt.hash(password, 10);
    const assignedRole = whitelist.role || "member";

    const [newUser] = await prisma.$transaction([
      prisma.adminUser.create({
        data: {
          email: cleanEmail,
          name: cleanName || (assignedRole === "superadmin" ? "Super Admin" : "Team Member"),
          passwordHash,
          role: assignedRole,
          lastLoginAt: new Date(),
        },
      }),
      prisma.adminWhitelist.update({
        where: { email: cleanEmail },
        data: {
          status: "active",
          verificationCode: null,
          codeExpiresAt: null,
          inviteToken: null,
        },
      }),
    ]);

    // 5. Send welcome email via Resend (fire and log)
    sendWelcomeEmail({
      to: cleanEmail,
      name: newUser.name,
      role: newUser.role,
    }).catch((e) => console.error("[Register] Welcome email send error:", e));

    // 6. Sign JWT token and set auth cookie
    const jwtToken = await new SignJWT({
      sub: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(SECRET);

    const cookieStore = await cookies();
    cookieStore.set("admin_token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json({ error: "Failed to complete account registration" }, { status: 500 });
  }
}
