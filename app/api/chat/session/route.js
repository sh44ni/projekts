import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionKey = searchParams.get("sessionKey");

    if (!sessionKey) {
      return NextResponse.json({ messages: [] });
    }

    const session = await prisma.chatSession.findUnique({
      where: { sessionKey },
      include: {
        messages: {
          where: {
            sender: { in: ["user", "assistant"] },
          },
          orderBy: { createdAt: "asc" },
          take: 50,
        },
      },
    });

    if (!session) {
      return NextResponse.json({ messages: [], leadCaptured: false });
    }

    return NextResponse.json({
      sessionKey: session.sessionKey,
      leadCaptured: session.leadStatus === "qualified" || !!session.visitorEmail,
      visitorName: session.visitorName,
      messages: session.messages.map((m) => ({
        id: m.id,
        sender: m.sender,
        content: m.content,
        createdAt: m.createdAt,
      })),
    });
  } catch (error) {
    console.error("Session lookup error:", error);
    return NextResponse.json({ error: "Failed to load session" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionKey = searchParams.get("sessionKey");

    if (sessionKey) {
      // Rather than deleting the CRM record (which loses analytics), we simply generate a new key on the client.
      // But if explicitly requested:
      await prisma.chatMessage.deleteMany({
        where: { session: { sessionKey } },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Session reset error:", error);
    return NextResponse.json({ error: "Failed to reset session" }, { status: 500 });
  }
}
