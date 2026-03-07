import { NextRequest, NextResponse } from "next/server";

const GRAPH_API_BASE = "https://graph.facebook.com/v21.0";

export async function GET(request: NextRequest) {
  const userId = process.env.INSTAGRAM_USER_ID?.trim();
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();

  if (!userId || !accessToken) {
    return NextResponse.json(
      { error: "Instagram is not configured" },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(request.url);
  const metric = searchParams.get("metric") ?? "impressions,reach,profile_views";
  const period = searchParams.get("period") ?? "day";

  const url = `${GRAPH_API_BASE}/${userId}/insights?metric=${metric}&period=${period}&access_token=${accessToken}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error?.message ?? "Failed to fetch insights" },
        { status: res.status },
      );
    }

    return NextResponse.json({ data: data.data ?? [] });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Request failed" },
      { status: 500 },
    );
  }
}
