import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin, unauthorized } from "@/lib/admin-auth";

export async function GET(req) {
  const admin = await verifyAdmin();
  if (!admin) return unauthorized();

  try {
    const { searchParams } = new URL(req.url);
    const view = searchParams.get("view"); // "all" or "my"
    const search = searchParams.get("search")?.trim();

    const isPrivileged = admin.role === "superadmin" || admin.role === "admin";
    const where = {};

    // Data isolation: only superadmin/admin can see "all" invoices, otherwise strictly scoped to creator
    if (view === "all" && isPrivileged) {
      // no user filter
    } else {
      where.createdById = admin.id;
    }

    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search, mode: "insensitive" } },
        { clientName: { contains: search, mode: "insensitive" } },
      ];
    }

    const invoices = await prisma.invoice.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
      take: 100,
    });

    return NextResponse.json({
      invoices: invoices.map((inv) => ({
        id: inv.id,
        invoice_id: inv.invoiceNumber,
        client_name: inv.clientName,
        client_address: inv.clientAddress,
        date: inv.date,
        due_date: inv.dueDate,
        currency: inv.currency,
        payment_method: inv.paymentMethod,
        check_no: inv.checkNo,
        payment_details: inv.paymentDetails,
        paid: inv.paid,
        show_seal: inv.showSeal,
        items: inv.items,
        subtotal: inv.subtotal,
        totalAmount: inv.totalAmount,
        notes: inv.notes,
        createdAt: inv.createdAt,
        createdBy: inv.createdBy,
        isOwner: inv.createdById === admin.id,
      })),
      userRole: admin.role,
      userId: admin.id,
    });
  } catch (error) {
    console.error("Invoices GET error:", error);
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}

export async function POST(req) {
  const admin = await verifyAdmin();
  if (!admin) return unauthorized();

  try {
    const body = await req.json();
    const {
      invoice_id,
      invoiceNumber,
      client_name,
      clientName,
      client_address,
      clientAddress,
      date,
      due_date,
      dueDate,
      currency = "$",
      payment_method,
      paymentMethod = "Check",
      check_no,
      checkNo,
      payment_details,
      paymentDetails,
      paid = false,
      show_seal = true,
      showSeal = true,
      items = [],
      subtotal = 0,
      totalAmount = 0,
      notes = "",
    } = body;

    const num = invoiceNumber || invoice_id || `PRJK${Math.floor(100 + Math.random() * 900)}`;
    const client = clientName || client_name || "Valued Client";

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: num,
        clientName: client,
        clientAddress: clientAddress || client_address || "",
        date: date || new Date().toLocaleDateString(),
        dueDate: dueDate || due_date || "",
        currency: currency || "$",
        paymentMethod: paymentMethod || payment_method || "Check",
        checkNo: checkNo || check_no || "",
        paymentDetails: paymentDetails || payment_details || "",
        paid: Boolean(paid),
        showSeal: Boolean(showSeal ?? show_seal),
        items: items,
        subtotal: Number(subtotal) || 0,
        totalAmount: Number(totalAmount) || 0,
        notes: notes || "",
        createdById: admin.id,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json({ success: true, invoice });
  } catch (error) {
    console.error("Invoices POST error:", error);
    return NextResponse.json({ error: "Failed to save invoice" }, { status: 500 });
  }
}
