import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin, unauthorized } from "@/lib/admin-auth";
import { unlink } from "fs/promises";
import { join } from "path";

export async function GET(req) {
  const admin = await verifyAdmin();
  if (!admin) return unauthorized();

  try {
    const { searchParams } = new URL(req.url);
    const read = searchParams.get("read");
    const jobId = searchParams.get("jobId");

    const where = {};
    if (read === "true") where.read = true;
    if (read === "false") where.read = false;
    if (jobId) {
      if (jobId === "general") {
        where.jobPostingId = null;
      } else {
        where.jobPostingId = jobId;
      }
    }

    const applications = await prisma.jobApplication.findMany({
      where,
      include: {
        jobPosting: {
          select: {
            title: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(applications);
  } catch (err) {
    console.error("Admin fetch applications error:", err);
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}

export async function PATCH(req) {
  const admin = await verifyAdmin();
  if (!admin) return unauthorized();

  try {
    const { id, read } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Application ID required" }, { status: 400 });
    }

    const updated = await prisma.jobApplication.update({
      where: { id },
      data: { read },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Admin update application error:", err);
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
  }
}

export async function DELETE(req) {
  const admin = await verifyAdmin();
  if (!admin) return unauthorized();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Application ID required" }, { status: 400 });
    }

    const app = await prisma.jobApplication.findUnique({
      where: { id },
    });

    if (!app) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Try deleting the resume file if it exists
    if (app.resumeUrl) {
      try {
        const filepath = join(process.cwd(), "public", app.resumeUrl);
        await unlink(filepath);
      } catch (fileErr) {
        console.warn("Could not delete resume file:", fileErr);
      }
    }

    await prisma.jobApplication.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin delete application error:", err);
    return NextResponse.json({ error: "Failed to delete application" }, { status: 500 });
  }
}
