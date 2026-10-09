import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin, unauthorized } from "@/lib/admin-auth";

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) return unauthorized();

  try {
    const user = await prisma.adminUser.findUnique({
      where: { id: admin.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        lastLoginAt: true,
        createdAt: true,
        _count: {
          select: {
            invoices: true,
          },
        },
      },
    });

    if (!user) {
      return unauthorized();
    }

    // Check whitelist status
    const whitelist = await prisma.adminWhitelist.findUnique({
      where: { email: user.email },
    });

    if (whitelist && whitelist.status === "revoked") {
      return NextResponse.json({ error: "Access revoked" }, { status: 403 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name || "Executive",
        role: user.role,
        avatar: user.avatar,
        lastLoginAt: user.lastLoginAt,
        invoicesCount: user._count.invoices,
      },
    });
  } catch (error) {
    console.error("Admin /me error:", error);
    return NextResponse.json({ error: "Failed to load user profile" }, { status: 500 });
  }
}
