import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin, unauthorized, forbidden } from "@/lib/admin-auth";

export async function DELETE(req, { params }) {
  const admin = await verifyAdmin();
  if (!admin) return unauthorized();

  try {
    const { id } = await params;
    const invoice = await prisma.invoice.findUnique({ where: { id } });
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const isOwner = invoice.createdById === admin.id;
    const isSuper = admin.role === "superadmin";

    if (!isOwner && !isSuper) {
      return forbidden("You can only delete invoices you created");
    }

    await prisma.invoice.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Invoice deleted" });
  } catch (error) {
    console.error("Invoice DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete invoice" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  const admin = await verifyAdmin();
  if (!admin) return unauthorized();

  try {
    const { id } = await params;
    const body = await req.json();

    const invoice = await prisma.invoice.findUnique({ where: { id } });
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const isOwner = invoice.createdById === admin.id;
    const isSuper = admin.role === "superadmin" || admin.role === "admin";

    if (!isOwner && !isSuper) {
      return forbidden("You do not have permission to update this invoice");
    }

    const updated = await prisma.invoice.update({
      where: { id },
      data: {
        ...(typeof body.paid === "boolean" && { paid: body.paid }),
        ...(body.notes !== undefined && { notes: body.notes }),
      },
    });

    return NextResponse.json({ success: true, invoice: updated });
  } catch (error) {
    console.error("Invoice PATCH error:", error);
    return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 });
  }
}
