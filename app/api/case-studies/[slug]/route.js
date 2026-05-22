import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
  const { slug } = await params;

  const cs = await prisma.caseStudy.findUnique({
    where: { slug },
  });

  if (!cs || !cs.published) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(cs);
}
