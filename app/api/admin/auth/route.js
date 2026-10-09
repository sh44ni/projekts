import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET || "fallback-secret");

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const cleanEmail = (email || "").toLowerCase().trim();

    if (!cleanEmail || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    // Check whitelist status
    const whitelistEntry = await prisma.adminWhitelist.findUnique({
      where: { email: cleanEmail },
    });

    if (whitelistEntry && whitelistEntry.status === "revoked") {
      return NextResponse.json({ error: "Access revoked. Contact Super Admin." }, { status: 403 });
    }

    const user = await prisma.adminUser.findUnique({ where: { email: cleanEmail } });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Update last login
    await prisma.adminUser.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = await new SignJWT({
      sub: user.id,
      email: user.email,
      name: user.name || "Executive",
      role: user.role || "member",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(SECRET);

    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Auth error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.set("admin_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    return NextResponse.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
