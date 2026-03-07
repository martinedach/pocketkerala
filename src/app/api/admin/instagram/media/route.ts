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
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "25", 10), 50);
  const after = searchParams.get("after") ?? "";

  const fields = [
    "id",
    "media_type",
    "media_url",
    "permalink",
    "thumbnail_url",
    "caption",
    "timestamp",
    "like_count",
    "comments_count",
  ].join(",");

  let url = `${GRAPH_API_BASE}/${userId}/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`;
  if (after) url += `&after=${after}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error?.message ?? "Failed to fetch media" },
        { status: res.status },
      );
    }

    return NextResponse.json({
      data: data.data ?? [],
      paging: data.paging ?? {},
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Request failed" },
      { status: 500 },
    );
  }
}
