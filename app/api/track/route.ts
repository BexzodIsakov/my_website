import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Don't track in development
    if (process.env.NODE_ENV === "development") {
      return NextResponse.json({ success: true, skipped: true });
    }

    const data = await request.json();

    // Get country from Netlify headers
    const country = request.headers.get("x-country") || null;
    const city = request.headers.get("x-city") || null;

    // Add geo data to tracking
    const trackingData = {
      ...data,
      country: country,
      city: city, // Optional: you can also track city
    };

    // send to Supabase
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    if (!supabaseKey) {
      throw new Error("SUPABASE_ANON_KEY is not configured");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/pageviews`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify(trackingData),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to track pageview");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Failed to track pageview" },
      { status: 500 }
    );
  }
}
