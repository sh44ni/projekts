import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendVerificationCodeEmail } from "@/lib/resend";

export async function POST(req) {
  try {
    const { email } = await req.json();
    const cleanEmail = (email || "").toLowerCase().trim();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      return NextResponse.json({ error: "A valid email address is required" }, { status: 400 });
    }

    // 1. Check if email is in whitelist
    const whitelist = await prisma.adminWhitelist.findUnique({
      where: { email: cleanEmail },
    });

    if (!whitelist) {
      return NextResponse.json(
        {
          error: "Access Denied: This email address is not authorized for the Projekts Vision Control Deck. Contact an administrator to request access.",
          notWhitelisted: true,
        },
        { status: 403 }
      );
    }

    if (whitelist.status === "revoked") {
      return NextResponse.json(
        { error: "Access Denied: Access for this email address has been revoked by an administrator." },
        { status: 403 }
      );
    }

    // 2. Check if already registered
    const existingUser = await prisma.adminUser.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "An account already exists for this email address. Please sign in to your dashboard.",
          alreadyRegistered: true,
        },
        { status: 400 }
      );
    }

    // 3. Generate 6-digit OTP code with 15 minute expiry
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.adminWhitelist.update({
      where: { email: cleanEmail },
      data: {
        verificationCode: code,
        codeExpiresAt,
      },
    });

    // 4. Send on-brand email via Resend
    const emailResult = await sendVerificationCodeEmail({
      to: cleanEmail,
      code,
      role: whitelist.role,
    });

    if (!emailResult.success) {
      console.error("[Verify Route] Failed to send email via Resend:", emailResult.error);
      return NextResponse.json(
        { error: `Failed to dispatch verification email: ${emailResult.error}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${cleanEmail}.`,
      role: whitelist.role,
    });
  } catch (err) {
    console.error("Verification error:", err);
    return NextResponse.json({ error: "Server error during verification request" }, { status: 500 });
  }
}
