import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { path, referrer, screen } = body;

    await prisma.pageView.create({
      data: {
        path: path || "/",
        referrer: referrer || "",
        userAgent: req.headers.get("user-agent") || "",
        screen: screen || "",
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
