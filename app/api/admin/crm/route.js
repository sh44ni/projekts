import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin, unauthorized } from "@/lib/admin-auth";

export async function GET(req) {
  const admin = await verifyAdmin();
  if (!admin) return unauthorized();

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const unread = searchParams.get("unread");
    const search = searchParams.get("search");

    const where = {};
    if (status && status !== "all") {
      where.leadStatus = status;
    }
    if (unread === "true") {
      where.unreadByAdmin = true;
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { visitorName: { contains: q, mode: "insensitive" } },
        { visitorEmail: { contains: q, mode: "insensitive" } },
        { visitorCompany: { contains: q, mode: "insensitive" } },
        { projectScope: { contains: q, mode: "insensitive" } },
        { notes: { contains: q, mode: "insensitive" } },
      ];
    }

    // Parallel fetch: stats & sessions
    const [totalChats, capturedLeads, qualifiedDeals, unreadCount, sessions] = await Promise.all([
      prisma.chatSession.count(),
      prisma.chatSession.count({ where: { visitorEmail: { not: null } } }),
      prisma.chatSession.count({ where: { leadStatus: "qualified" } }),
      prisma.chatSession.count({ where: { unreadByAdmin: true } }),
      prisma.chatSession.findMany({
        where,
        orderBy: { lastMessageAt: "desc" },
        include: {
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          _count: { select: { messages: true } },
        },
        take: 100,
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalChats,
        capturedLeads,
        qualifiedDeals,
        unreadCount,
      },
      sessions: sessions.map((s) => ({
        id: s.id,
        sessionKey: s.sessionKey,
        visitorName: s.visitorName,
        visitorEmail: s.visitorEmail,
        visitorPhone: s.visitorPhone,
        visitorCompany: s.visitorCompany,
        leadStatus: s.leadStatus,
        leadScore: s.leadScore,
        budget: s.budget,
        timeline: s.timeline,
        projectScope: s.projectScope,
        notes: s.notes,
        unreadByAdmin: s.unreadByAdmin,
        lastMessageAt: s.lastMessageAt,
        createdAt: s.createdAt,
        messageCount: s._count.messages,
        lastMessage: s.messages[0] ? s.messages[0].content : null,
      })),
    });
  } catch (error) {
    console.error("Admin CRM list error:", error);
    return NextResponse.json({ error: "Failed to fetch CRM leads" }, { status: 500 });
  }
}
