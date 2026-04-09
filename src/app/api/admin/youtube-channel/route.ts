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

function channelFromListItem(item: {
  id?: string;
  snippet?: { title?: string; description?: string; thumbnails?: { medium?: { url?: string }; default?: { url?: string } } };
  statistics?: { subscriberCount?: string; videoCount?: string; viewCount?: string };
} | undefined) {
  if (!item?.id) return null;

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

async function fetchChannelStats(channelId: string, apiKey: string) {
  const res = await fetch(
    `${YOUTUBE_API_BASE}/channels?part=snippet,statistics&id=${encodeURIComponent(channelId)}&key=${apiKey}`,
  );
  const data = await res.json();
  return channelFromListItem(data?.items?.[0]);
}

async function fetchChannelStatsByHandle(handle: string, apiKey: string) {
  const clean = handle.trim().replace(/^@/, "");
  if (!clean) return null;

  const res = await fetch(
    `${YOUTUBE_API_BASE}/channels?part=snippet,statistics&forHandle=${encodeURIComponent(clean)}&key=${apiKey}`,
  );
  const data = await res.json();
  return channelFromListItem(data?.items?.[0]);
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
  const handle = searchParams.get("handle");

  if (handle) {
    const channel = await fetchChannelStatsByHandle(handle, apiKey);
    if (!channel) {
      return NextResponse.json(
        { error: "Channel not found for handle" },
        { status: 404 },
      );
    }
    return NextResponse.json(channel);
  }

  let resolvedChannelId: string | null = channelId;

  if (!resolvedChannelId && videoId) {
    resolvedChannelId = await fetchChannelByVideoId(videoId, apiKey);
  }

  if (!resolvedChannelId) {
    return NextResponse.json(
      { error: "Provide videoId, channelId, or handle" },
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
