import { NextResponse } from "next/server";

const GRAPH_API_BASE = "https://graph.facebook.com/v21.0";

export async function GET() {
  const userId = process.env.INSTAGRAM_USER_ID?.trim();
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();

  if (!userId || !accessToken) {
    return NextResponse.json(
      { error: "Instagram is not configured. Set INSTAGRAM_USER_ID and INSTAGRAM_ACCESS_TOKEN in .env" },
      { status: 503 },
    );
  }

  const fields = [
    "id",
    "username",
    "name",
    "biography",
    "website",
    "profile_picture_url",
    "followers_count",
    "follows_count",
    "media_count",
  ].join(",");

  const url = `${GRAPH_API_BASE}/${userId}?fields=${fields}&access_token=${accessToken}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error?.message ?? "Failed to fetch Instagram profile" },
        { status: res.status },
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Request failed" },
      { status: 500 },
    );
  }
}
