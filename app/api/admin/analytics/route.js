import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin, unauthorized } from "@/lib/admin-auth";

export async function GET(req) {
  const admin = await verifyAdmin();
  if (!admin) return unauthorized();

  const { searchParams } = new URL(req.url);
  const days = parseInt(searchParams.get("days") || "30", 10);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [totalViews, views, topPages, topReferrers, submissions] = await Promise.all([
    prisma.pageView.count({ where: { createdAt: { gte: since } } }),
    prisma.pageView.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true, path: true, referrer: true, userAgent: true, screen: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.$queryRawUnsafe(
      `SELECT path, COUNT(*)::int as count FROM "PageView" WHERE "createdAt" >= $1 GROUP BY path ORDER BY count DESC LIMIT 10`,
      since
    ),
    prisma.$queryRawUnsafe(
      `SELECT referrer, COUNT(*)::int as count FROM "PageView" WHERE "createdAt" >= $1 AND referrer != '' GROUP BY referrer ORDER BY count DESC LIMIT 10`,
      since
    ),
    prisma.contactSubmission.count({ where: { createdAt: { gte: since } } }),
  ]);

  // Group views by day
  const viewsByDay = {};
  const uniqueVisitors = new Set();
  const browsers = {};
  const devices = {};

  views.forEach((v) => {
    const day = v.createdAt.toISOString().split("T")[0];
    viewsByDay[day] = (viewsByDay[day] || 0) + 1;

    const ua = v.userAgent.toLowerCase();
    uniqueVisitors.add(ua + v.screen);

    if (ua.includes("chrome")) browsers.Chrome = (browsers.Chrome || 0) + 1;
    else if (ua.includes("firefox")) browsers.Firefox = (browsers.Firefox || 0) + 1;
    else if (ua.includes("safari")) browsers.Safari = (browsers.Safari || 0) + 1;
    else if (ua.includes("edge")) browsers.Edge = (browsers.Edge || 0) + 1;
    else browsers.Other = (browsers.Other || 0) + 1;

    if (ua.includes("mobile")) devices.Mobile = (devices.Mobile || 0) + 1;
    else if (ua.includes("tablet")) devices.Tablet = (devices.Tablet || 0) + 1;
    else devices.Desktop = (devices.Desktop || 0) + 1;
  });

  const timeline = Object.entries(viewsByDay)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return NextResponse.json({
    totalViews,
    uniqueVisitors: uniqueVisitors.size,
    submissions,
    topPages,
    topReferrers,
    timeline,
    browsers,
    devices,
    period: `${days} days`,
  });
}
