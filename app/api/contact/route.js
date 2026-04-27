import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, service, budget, message } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email required" }, { status: 400 });
    }

    const submission = await prisma.contactSubmission.create({
      data: { name, email, service: service || "", budget: budget || "", message: message || "" },
    });

    return NextResponse.json({ success: true, id: submission.id });
  } catch (err) {
    console.error("Contact submit error:", err);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}
