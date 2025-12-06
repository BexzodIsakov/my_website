// app/api/analytics/route.js
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/pageviews?select=*`,
      {
        headers: {
          apikey: process.env.SUPABASE_ANON_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch analytics");
    }

    const data = await response.json();

    // Process data
    const totalViews = data.length;
    const uniqueVisitors = new Set(data.map((d) => d.visitor_id)).size;

    const today = new Date().toDateString();
    const todayViews = data.filter(
      (d) => new Date(d.timestamp).toDateString() === today
    ).length;

    // Top pages
    const pageCounts = {};
    data.forEach((d) => {
      pageCounts[d.page_url] = (pageCounts[d.page_url] || 0) + 1;
    });
    const topPages = Object.entries(pageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // Top referrers
    const referrerCounts = {};
    data.forEach((d) => {
      if (d.referrer) {
        try {
          const domain = new URL(d.referrer).hostname;
          referrerCounts[domain] = (referrerCounts[domain] || 0) + 1;
        } catch (e) {
          // Invalid URL, skip
        }
      }
    });
    const topReferrers = Object.entries(referrerCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return NextResponse.json({
      totalViews,
      uniqueVisitors,
      todayViews,
      topPages,
      topReferrers,
    });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
