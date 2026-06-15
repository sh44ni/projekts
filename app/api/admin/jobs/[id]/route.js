import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin, unauthorized } from "@/lib/admin-auth";

export async function GET(req, { params }) {
  const admin = await verifyAdmin();
  if (!admin) return unauthorized();

  try {
    const { id } = params;
    const job = await prisma.jobPosting.findUnique({
      where: { id },
    });

    if (!job) {
      return NextResponse.json({ error: "Job posting not found" }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (err) {
    console.error("Admin get job error:", err);
    return NextResponse.json({ error: "Failed to get job posting" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  const admin = await verifyAdmin();
  if (!admin) return unauthorized();

  try {
    const { id } = params;
    const body = await req.json();

    const job = await prisma.jobPosting.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(job);
  } catch (err) {
    console.error("Admin update job error:", err);
    return NextResponse.json({ error: "Failed to update job posting" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const admin = await verifyAdmin();
  if (!admin) return unauthorized();

  try {
    const { id } = params;
    await prisma.jobPosting.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin delete job error:", err);
    return NextResponse.json({ error: "Failed to delete job posting" }, { status: 500 });
  }
}
