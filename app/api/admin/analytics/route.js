import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin, unauthorized } from "@/lib/admin-auth";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function calcChange(curr, prev) {
  if (prev === null || prev === undefined || prev === 0) return null;
  return +((( curr - prev) / prev) * 100).toFixed(1);
}

function detectMedium(source) {
  const social = ["instagram", "facebook", "twitter", "linkedin", "tiktok", "youtube", "whatsapp", "t.co"];
  const search = ["google", "bing", "yahoo", "duckduckgo", "yandex", "baidu"];
  if (social.some((s) => source.includes(s))) return "social";
  if (search.some((s) => source.includes(s))) return "organic";
  return "referral";
}

function parseReferrer(referrerStr) {
  try {
    const url = new URL(
      referrerStr.startsWith("http") ? referrerStr : `https://${referrerStr}`
    );
    const source =
      url.searchParams.get("utm_source") ||
      url.hostname.replace("www.", "");
    const medium =
      url.searchParams.get("utm_medium") || detectMedium(source);
    const campaign = url.searchParams.get("utm_campaign") || "(none)";
    return { source, medium, campaign };
  } catch {
    return null;
  }
}

function toDateStr(val) {
  if (val instanceof Date) return val.toISOString().split("T")[0];
  return String(val).split("T")[0];
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function GET(req) {
  const admin = await verifyAdmin();
  if (!admin) return unauthorized();

  const { searchParams } = new URL(req.url);
  const days = parseInt(searchParams.get("days") || "30", 10);

  const now = new Date();
  const since = new Date(now.getTime() - days * 86400000);
  const prevSince = new Date(since.getTime() - days * 86400000);

  // ── Parallel DB fetches ──────────────────────────────────────────────────

  const [
    viewsCurrent,
    viewsPrevRaw,
    topPagesRaw,
    referrersRaw,
    submissionsCurrent,
    submissionsPrev,
    publishedCaseStudies,
  ] = await Promise.all([
    // All page views in current period (full rows for processing)
    prisma.pageView.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true, path: true, referrer: true, userAgent: true, screen: true },
      orderBy: { createdAt: "asc" },
    }),

    // Previous period — only fingerprint fields needed
    prisma.pageView.findMany({
      where: { createdAt: { gte: prevSince, lt: since } },
      select: { userAgent: true, screen: true },
    }),

    // Top pages (excluding /admin/*) sorted by count
    prisma.$queryRawUnsafe(
      `SELECT path, COUNT(*)::int AS views
       FROM "PageView"
       WHERE "createdAt" >= $1 AND path NOT LIKE '/admin%'
       GROUP BY path ORDER BY views DESC LIMIT 10`,
      since
    ),

    // Referrers with count
    prisma.$queryRawUnsafe(
      `SELECT referrer, COUNT(*)::int AS count
       FROM "PageView"
       WHERE "createdAt" >= $1
         AND referrer != ''
         AND referrer NOT LIKE '%localhost%'
         AND referrer NOT LIKE '%127.0.0.1%'
       GROUP BY referrer ORDER BY count DESC LIMIT 30`,
      since
    ),

    prisma.contactSubmission.count({ where: { createdAt: { gte: since } } }),
    prisma.contactSubmission.count({ where: { createdAt: { gte: prevSince, lt: since } } }),

    prisma.caseStudy.findMany({
      where: { published: true },
      select: { slug: true, client: true, title: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  // ── Fingerprint processing ───────────────────────────────────────────────

  const prevFingerprints = new Set(
    viewsPrevRaw.map((v) => v.userAgent + v.screen)
  );
  const currentFingerprints = new Set();
  viewsCurrent.forEach((v) => currentFingerprints.add(v.userAgent + v.screen));

  const totalViews = viewsCurrent.length;
  const uniqueVisitors = currentFingerprints.size;
  const prevUniqueVisitors = new Set(viewsPrevRaw.map((v) => v.userAgent + v.screen)).size;
  const prevTotalViews = viewsPrevRaw.length;

  // Bounce rate: % of daily-fingerprint "sessions" that touched only 1 page
  const sessionMap = {};
  viewsCurrent.forEach((v) => {
    const fp = v.userAgent + v.screen;
    const day = v.createdAt.toISOString().split("T")[0];
    const key = `${fp}-${day}`;
    sessionMap[key] = (sessionMap[key] || 0) + 1;
  });
  const sessionCounts = Object.values(sessionMap);
  const bounceSessions = sessionCounts.filter((c) => c === 1).length;
  const bounceRate =
    sessionCounts.length > 0
      ? Math.round((bounceSessions / sessionCounts.length) * 100)
      : 0;

  // Multi-page sessions (engaged)
  const engagedSessions = sessionCounts.filter((c) => c > 1).length;

  const conversionRate =
    uniqueVisitors > 0
      ? +((submissionsCurrent / uniqueVisitors) * 100).toFixed(2)
      : 0;
  const prevConversionRate =
    prevUniqueVisitors > 0
      ? +((submissionsPrev / prevUniqueVisitors) * 100).toFixed(2)
      : 0;

  // ── Metrics ──────────────────────────────────────────────────────────────

  const metrics = [
    {
      id: "views",
      label: "Total Views",
      value: totalViews,
      change: calcChange(totalViews, prevTotalViews),
      format: "number",
    },
    {
      id: "visitors",
      label: "Unique Visitors",
      value: uniqueVisitors,
      change: calcChange(uniqueVisitors, prevUniqueVisitors),
      format: "number",
    },
    {
      id: "duration",
      label: "Avg Session",
      value: null, // requires frontend session timing — not tracked yet
      change: null,
      format: "duration",
    },
    {
      id: "bounce",
      label: "Bounce Rate",
      value: bounceRate,
      change: null, // prev period bounce not computed (expensive)
      format: "percent",
      invertColor: true,
    },
    {
      id: "inquiries",
      label: "Inquiries",
      value: submissionsCurrent,
      change: calcChange(submissionsCurrent, submissionsPrev),
      format: "number",
    },
    {
      id: "conversion",
      label: "Conv. Rate",
      value: conversionRate,
      change: calcChange(conversionRate, prevConversionRate),
      format: "percent",
    },
  ];

  // ── Timeline with new / returning ────────────────────────────────────────

  const viewsByDay = {};
  viewsCurrent.forEach((v) => {
    const day = v.createdAt.toISOString().split("T")[0];
    const d = new Date(day);
    const label = `${d.getMonth() + 1}/${d.getDate()}`;
    const fp = v.userAgent + v.screen;

    if (!viewsByDay[day]) {
      viewsByDay[day] = { date: day, label, new: 0, returning: 0, annotation: null };
    }
    if (prevFingerprints.has(fp)) {
      viewsByDay[day].returning++;
    } else {
      viewsByDay[day].new++;
    }
  });

  const timeline = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(since.getTime() + i * 86400000);
    const dateStr = d.toISOString().split("T")[0];
    const label = `${d.getMonth() + 1}/${d.getDate()}`;
    timeline.push(
      viewsByDay[dateStr] || { date: dateStr, label, new: 0, returning: 0, annotation: null }
    );
  }

  // ── Top pages ────────────────────────────────────────────────────────────

  const topPages = topPagesRaw.map((p) => ({
    path: p.path,
    views: p.views,
    avgTime: null,       // requires frontend timing instrumentation
    entryRate: null,
    exitRate: null,
    scrollDepth: null,   // requires scroll depth tracking
  }));

  // ── Top referrers ────────────────────────────────────────────────────────

  const referrerAccum = {};
  referrersRaw.forEach((r) => {
    const parsed = parseReferrer(r.referrer);
    if (!parsed) return;
    const key = `${parsed.source}|${parsed.medium}|${parsed.campaign}`;
    referrerAccum[key] = (referrerAccum[key] || 0) + r.count;
  });

  const topReferrers = Object.entries(referrerAccum)
    .map(([key, visits]) => {
      const [source, medium, campaign] = key.split("|");
      return { source, medium, campaign, visits };
    })
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 8);

  // ── Case study performance + sparklines ──────────────────────────────────

  const sparklineStart = new Date(now.getTime() - 13 * 86400000);

  const caseStudies = await Promise.all(
    publishedCaseStudies.map(async (cs) => {
      const slugPath = `/case-studies/${cs.slug}`;

      const csViews = viewsCurrent.filter(
        (v) => v.path === slugPath || v.path === `${slugPath}/`
      ).length;

      // 14-day daily sparkline
      const sparkRows = await prisma.$queryRawUnsafe(
        `SELECT DATE("createdAt") AS day, COUNT(*)::int AS v
         FROM "PageView"
         WHERE (path = $1 OR path = $2)
           AND "createdAt" >= $3
         GROUP BY DATE("createdAt")
         ORDER BY day ASC`,
        slugPath,
        `${slugPath}/`,
        sparklineStart
      );

      const sparkMap = {};
      sparkRows.forEach((row) => {
        sparkMap[toDateStr(row.day)] = row.v;
      });

      const sparkline = [];
      for (let i = 13; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 86400000);
        sparkline.push({ v: sparkMap[d.toISOString().split("T")[0]] || 0 });
      }

      return {
        name: cs.client || cs.title,
        slug: cs.slug,
        views: csViews,
        avgTime: null,       // requires frontend timing
        conversionRate: null, // requires session attribution
        sparkline,
      };
    })
  );

  // ── Case study impact (views ranking) ────────────────────────────────────

  const caseStudyImpact = caseStudies
    .filter((cs) => cs.views > 0)
    .map((cs) => ({
      name: cs.name,
      views: cs.views,
      inquiries: null, // attribution needs session tracking
      ratio: null,
    }))
    .sort((a, b) => b.views - a.views);

  // ── Inquiry funnel (from tracked signals) ────────────────────────────────

  const inquiryFunnel = [
    { label: "Page Views", value: totalViews },
    { label: "Multi-page Sessions", value: engagedSessions },
    { label: "Unique Visitors", value: uniqueVisitors },
    { label: "Submitted Form", value: submissionsCurrent },
  ];

  // ── Response ─────────────────────────────────────────────────────────────

  return NextResponse.json({
    metrics,
    funnel: {
      views: totalViews,
      engagedSessions,
      inquiries: submissionsCurrent,
    },
    timeline,
    topPages,
    topReferrers,
    caseStudies,
    geography: [], // requires IP geolocation — not tracked yet
    inquiryFunnel,
    caseStudyImpact,
    period: days,
  });
}
