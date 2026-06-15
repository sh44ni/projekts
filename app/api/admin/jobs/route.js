import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin, unauthorized } from "@/lib/admin-auth";

export async function GET(req) {
  const admin = await verifyAdmin();
  if (!admin) return unauthorized();

  try {
    const jobs = await prisma.jobPosting.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(jobs);
  } catch (err) {
    console.error("Admin fetch jobs error:", err);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(req) {
  const admin = await verifyAdmin();
  if (!admin) return unauthorized();

  try {
    const body = await req.json();
    const { title, type, dept, desc, published } = body;

    if (!title || !type || !dept || !desc) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const job = await prisma.jobPosting.create({
      data: {
        title,
        type,
        dept,
        desc,
        published: published !== undefined ? published : true,
      },
    });

    return NextResponse.json(job);
  } catch (err) {
    console.error("Admin create job error:", err);
    return NextResponse.json({ error: "Failed to create job posting" }, { status: 500 });
  }
}
