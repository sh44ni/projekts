import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin, unauthorized } from "@/lib/admin-auth";

export async function GET(req, { params }) {
  const admin = await verifyAdmin();
  if (!admin) return unauthorized();

  try {
    const { id } = await params;
    const session = await prisma.chatSession.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Automatically mark read if unread
    if (session.unreadByAdmin) {
      await prisma.chatSession.update({
        where: { id },
        data: { unreadByAdmin: false },
      });
      session.unreadByAdmin = false;
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error("Admin CRM get session error:", error);
    return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  const admin = await verifyAdmin();
  if (!admin) return unauthorized();

  try {
    const { id } = await params;
    const body = await req.json();

    const allowedFields = [
      "leadStatus",
      "leadScore",
      "notes",
      "visitorName",
      "visitorEmail",
      "visitorPhone",
      "visitorCompany",
      "budget",
      "timeline",
      "projectScope",
      "unreadByAdmin",
    ];

    const data = {};
    for (const f of allowedFields) {
      if (body[f] !== undefined) {
        data[f] = body[f];
      }
    }

    const updated = await prisma.chatSession.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Admin CRM update error:", error);
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const admin = await verifyAdmin();
  if (!admin) return unauthorized();

  try {
    const { id } = await params;
    await prisma.chatSession.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin CRM delete error:", error);
    return NextResponse.json({ error: "Failed to delete session" }, { status: 500 });
  }
}
