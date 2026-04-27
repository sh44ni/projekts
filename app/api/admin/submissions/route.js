import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin, unauthorized } from "@/lib/admin-auth";

export async function GET(req) {
  const admin = await verifyAdmin();
  if (!admin) return unauthorized();

  const { searchParams } = new URL(req.url);
  const read = searchParams.get("read");
  const service = searchParams.get("service");

  const where = {};
  if (read === "true") where.read = true;
  if (read === "false") where.read = false;
  if (service) where.service = service;

  const submissions = await prisma.contactSubmission.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(submissions);
}

export async function PATCH(req) {
  const admin = await verifyAdmin();
  if (!admin) return unauthorized();

  const { id, read } = await req.json();
  const updated = await prisma.contactSubmission.update({
    where: { id },
    data: { read },
  });

  return NextResponse.json(updated);
}
