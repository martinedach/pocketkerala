import { NextRequest, NextResponse } from "next/server";

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

export async function GET(request: NextRequest) {
  const apiKey = process.env.YOUTUBE_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { error: "YOUTUBE_API_KEY is not configured" },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get("videoId");
  if (!videoId) {
    return NextResponse.json(
      { error: "Provide videoId" },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(
      `${YOUTUBE_API_BASE}/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`,
    );
    const data = await res.json();
    const item = data?.items?.[0];

    if (!item) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 },
      );
    }

    const snippet = item.snippet ?? {};
    const stats = item.statistics ?? {};

    return NextResponse.json({
      videoId: item.id,
      title: snippet.title ?? "",
      thumbnail: snippet.thumbnails?.medium?.url ?? snippet.thumbnails?.default?.url ?? "",
      channelTitle: snippet.channelTitle ?? "",
      publishedAt: snippet.publishedAt ?? "",
      viewCount: parseInt(stats.viewCount ?? "0", 10),
      likeCount: parseInt(stats.likeCount ?? "0", 10),
      commentCount: parseInt(stats.commentCount ?? "0", 10),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Request failed" },
      { status: 500 },
    );
  }
}
