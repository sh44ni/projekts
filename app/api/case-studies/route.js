import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const cases = await prisma.caseStudy.findMany({
    where: { published: true },
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
      stats: true,
    },
  });

  return NextResponse.json(cases);
}
