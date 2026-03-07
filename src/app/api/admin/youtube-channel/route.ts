import { NextRequest, NextResponse } from "next/server";

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

async function fetchChannelByVideoId(videoId: string, apiKey: string) {
  const res = await fetch(
    `${YOUTUBE_API_BASE}/videos?part=snippet&id=${videoId}&key=${apiKey}`,
  );
  const data = await res.json();
  const channelId = data?.items?.[0]?.snippet?.channelId;
  return channelId ?? null;
}

async function fetchChannelStats(channelId: string, apiKey: string) {
  const res = await fetch(
    `${YOUTUBE_API_BASE}/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`,
  );
  const data = await res.json();
  const item = data?.items?.[0];
  if (!item) return null;

  const snippet = item.snippet ?? {};
  const stats = item.statistics ?? {};

  return {
    channelId: item.id,
    title: snippet.title ?? "",
    description: snippet.description ?? "",
    thumbnail: snippet.thumbnails?.medium?.url ?? snippet.thumbnails?.default?.url ?? "",
    subscriberCount: parseInt(stats.subscriberCount ?? "0", 10),
    videoCount: parseInt(stats.videoCount ?? "0", 10),
    viewCount: parseInt(stats.viewCount ?? "0", 10),
    channelUrl: `https://www.youtube.com/channel/${item.id}`,
    embedBaseUrl: `https://www.youtube.com/embed/`,
  };
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "YOUTUBE_API_KEY is not configured" },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get("videoId");
  const channelId = searchParams.get("channelId");

  let resolvedChannelId: string | null = channelId;

  if (!resolvedChannelId && videoId) {
    resolvedChannelId = await fetchChannelByVideoId(videoId, apiKey);
  }

  if (!resolvedChannelId) {
    return NextResponse.json(
      { error: "Provide videoId or channelId" },
      { status: 400 },
    );
  }

  const channel = await fetchChannelStats(resolvedChannelId, apiKey);
  if (!channel) {
    return NextResponse.json(
      { error: "Channel not found" },
      { status: 404 },
    );
  }

  return NextResponse.json(channel);
}
