import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin, unauthorized } from "@/lib/admin-auth";

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) return unauthorized();

  const cases = await prisma.caseStudy.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(cases);
}

export async function POST(req) {
  const admin = await verifyAdmin();
  if (!admin) return unauthorized();

  try {
    const data = await req.json();

    // Auto-generate slug if not provided
    if (!data.slug) {
      data.slug = data.client
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }

    // Get next sort order
    const last = await prisma.caseStudy.findFirst({
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });
    data.sortOrder = (last?.sortOrder ?? -1) + 1;

    const caseStudy = await prisma.caseStudy.create({ data });
    return NextResponse.json(caseStudy, { status: 201 });
  } catch (err) {
    console.error("Create case study error:", err);
    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "A case study with this slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
