import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { verifyAdmin, unauthorized, forbidden } from "@/lib/admin-auth";
import { sendInvitationEmail } from "@/lib/resend";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://projektsvision.com";

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) return unauthorized();

  if (admin.role !== "superadmin" && admin.role !== "admin") {
    return forbidden("Only administrators can view team access records");
  }

  try {
    const [users, whitelist] = await Promise.all([
      prisma.adminUser.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          lastLoginAt: true,
          createdAt: true,
          _count: {
            select: { invoices: true },
          },
        },
        orderBy: { createdAt: "asc" },
      }),
      prisma.adminWhitelist.findMany({
        include: {
          invitedBy: {
            select: { name: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({ users, whitelist });
  } catch (error) {
    console.error("Team GET error:", error);
    return NextResponse.json({ error: "Failed to fetch team records" }, { status: 500 });
  }
}

export async function POST(req) {
  const admin = await verifyAdmin();
  if (!admin) return unauthorized();

  if (admin.role !== "superadmin" && admin.role !== "admin") {
    return forbidden("Only administrators can invite new members");
  }

  try {
    const { email, role = "member" } = await req.json();
    const cleanEmail = (email || "").toLowerCase().trim();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    // Role safety: only superadmin can grant superadmin or admin role
    const assignedRole = admin.role === "superadmin" ? role : "member";

    // Generate secure invite token and 6-digit backup code
    const inviteToken = crypto.randomBytes(24).toString("hex");
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Upsert whitelist record
    const whitelistEntry = await prisma.adminWhitelist.upsert({
      where: { email: cleanEmail },
      update: {
        role: assignedRole,
        status: "pending",
        inviteToken,
        verificationCode: code,
        codeExpiresAt: expiresAt,
        invitedById: admin.id,
      },
      create: {
        email: cleanEmail,
        role: assignedRole,
        status: "pending",
        inviteToken,
        verificationCode: code,
        codeExpiresAt: expiresAt,
        invitedById: admin.id,
      },
    });

    // Send invitation email via Resend
    const inviteUrl = `${BASE_URL}/admin/register?token=${inviteToken}&email=${encodeURIComponent(cleanEmail)}`;
    const emailResult = await sendInvitationEmail({
      to: cleanEmail,
      inviteUrl,
      code,
      role: assignedRole,
      inviterName: admin.name || "Administrator",
    });

    return NextResponse.json({
      success: true,
      entry: whitelistEntry,
      emailSent: emailResult.success,
      emailError: emailResult.error || null,
      message: emailResult.success
        ? `Invitation successfully dispatched to ${cleanEmail}`
        : `Whitelisted ${cleanEmail}, but email delivery reported: ${emailResult.error}`,
    });
  } catch (error) {
    console.error("Team POST error:", error);
    return NextResponse.json({ error: "Failed to create team invitation" }, { status: 500 });
  }
}

export async function DELETE(req) {
  const admin = await verifyAdmin();
  if (!admin) return unauthorized();

  if (admin.role !== "superadmin" && admin.role !== "admin") {
    return forbidden("Only administrators can revoke access");
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const email = searchParams.get("email")?.toLowerCase().trim();

    if (!id && !email) {
      return NextResponse.json({ error: "ID or email is required" }, { status: 400 });
    }

    // Safety guard: Protect founding super admin
    const targetEmail = email || (await prisma.adminWhitelist.findUnique({ where: { id } }))?.email;
    if (targetEmail === "imzeeshankhann@gmail.com") {
      return NextResponse.json({ error: "The founding Super Admin cannot be revoked or deleted" }, { status: 403 });
    }

    // Mark whitelist as revoked
    if (id) {
      await prisma.adminWhitelist.update({
        where: { id },
        data: { status: "revoked" },
      });
    } else if (email) {
      await prisma.adminWhitelist.update({
        where: { email },
        data: { status: "revoked" },
      });
    }

    return NextResponse.json({ success: true, message: "Access has been revoked" });
  } catch (error) {
    console.error("Team DELETE error:", error);
    return NextResponse.json({ error: "Failed to revoke access" }, { status: 500 });
  }
}

export async function PATCH(req) {
  const admin = await verifyAdmin();
  if (!admin) return unauthorized();

  if (admin.role !== "superadmin" && admin.role !== "admin") {
    return forbidden("Only administrators can update access");
  }

  try {
    const { id, action, role } = await req.json();

    const entry = await prisma.adminWhitelist.findUnique({ where: { id } });
    if (!entry) {
      return NextResponse.json({ error: "Whitelist entry not found" }, { status: 404 });
    }

    if (entry.email === "imzeeshankhann@gmail.com" && admin.email !== "imzeeshankhann@gmail.com") {
      return NextResponse.json({ error: "Cannot modify the founding Super Admin" }, { status: 403 });
    }

    if (action === "resend") {
      const inviteToken = crypto.randomBytes(24).toString("hex");
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await prisma.adminWhitelist.update({
        where: { id },
        data: {
          inviteToken,
          verificationCode: code,
          codeExpiresAt: expiresAt,
          status: entry.status === "revoked" ? "pending" : entry.status,
        },
      });

      const inviteUrl = `${BASE_URL}/admin/register?token=${inviteToken}&email=${encodeURIComponent(entry.email)}`;
      const res = await sendInvitationEmail({
        to: entry.email,
        inviteUrl,
        code,
        role: entry.role,
        inviterName: admin.name || "Administrator",
      });

      return NextResponse.json({
        success: true,
        message: res.success ? `Invitation resent to ${entry.email}` : `Resend error: ${res.error}`,
      });
    }

    if (action === "restore") {
      await prisma.adminWhitelist.update({
        where: { id },
        data: { status: "active" },
      });
      return NextResponse.json({ success: true, message: "Access restored" });
    }

    if (role) {
      await prisma.adminWhitelist.update({
        where: { id },
        data: { role },
      });
      // Also update user if already registered
      await prisma.adminUser.updateMany({
        where: { email: entry.email },
        data: { role },
      });
      return NextResponse.json({ success: true, message: `Role updated to ${role}` });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Team PATCH error:", error);
    return NextResponse.json({ error: "Failed to update record" }, { status: 500 });
  }
}
