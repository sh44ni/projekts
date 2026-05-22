import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin, unauthorized } from "@/lib/admin-auth";
import { unlink } from "fs/promises";
import { join } from "path";

export async function GET(req, { params }) {
  const admin = await verifyAdmin();
  if (!admin) return unauthorized();

  const { id } = await params;
  const cs = await prisma.caseStudy.findUnique({ where: { id } });
  if (!cs) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(cs);
}

export async function PATCH(req, { params }) {
  const admin = await verifyAdmin();
  if (!admin) return unauthorized();

  const { id } = await params;
  const data = await req.json();

  // Prevent overwriting id/createdAt
  delete data.id;
  delete data.createdAt;

  try {
    const updated = await prisma.caseStudy.update({
      where: { id },
      data,
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Update case study error:", err);
    if (err.code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const admin = await verifyAdmin();
  if (!admin) return unauthorized();

  const { id } = await params;

  try {
    const cs = await prisma.caseStudy.findUnique({ where: { id } });
    if (!cs) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Clean up uploaded files
    const uploadsDir = join(process.cwd(), "public");
    const filesToClean = [];

    if (cs.coverImage?.startsWith("/uploads/")) filesToClean.push(cs.coverImage);
    if (cs.logo?.startsWith("/uploads/")) filesToClean.push(cs.logo);
    if (cs.videoUrl?.startsWith("/uploads/")) filesToClean.push(cs.videoUrl);

    const gallery = Array.isArray(cs.gallery) ? cs.gallery : [];
    gallery.forEach((url) => {
      if (typeof url === "string" && url.startsWith("/uploads/")) filesToClean.push(url);
    });

    const sections = Array.isArray(cs.sections) ? cs.sections : [];
    sections.forEach((s) => {
      if (Array.isArray(s.images)) {
        s.images.forEach((url) => {
          if (typeof url === "string" && url.startsWith("/uploads/")) filesToClean.push(url);
        });
      }
    });

    // Delete files (non-blocking, don't fail if file missing)
    await Promise.allSettled(
      filesToClean.map((f) => unlink(join(uploadsDir, f)))
    );

    await prisma.caseStudy.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete case study error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
