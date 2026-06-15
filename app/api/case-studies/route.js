import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    let featuredOnly = false;
    try {
      const { searchParams } = new URL(req.url);
      featuredOnly = searchParams.get("featured") === "true";
    } catch {
      // URL parse failed — ignore, treat as no filter
    }

    const where = featuredOnly
      ? { published: true, featured: true }
      : { published: true };

    const cases = await prisma.caseStudy.findMany({
      where,
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        slug: true,
        client: true,
        logo: true,
        category: true,
        title: true,
        description: true,
        coverImage: true,
        metric: true,
        metricLabel: true,
        tags: true,
        videoUrl: true,
        gallery: true,
        sections: true,
        stats: true,
        featured: true,
      },
    });

    return NextResponse.json(cases);
  } catch (err) {
    console.error("GET /api/case-studies error:", err);
    return NextResponse.json([], { status: 500 });
  }
}
