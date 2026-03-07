import { NextRequest, NextResponse } from "next/server";

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

async function fetchChannelByVideoId(videoId: string, apiKey: string) {
  const res = await fetch(
    `${YOUTUBE_API_BASE}/videos?part=snippet&id=${videoId}&key=${apiKey}`,
  );
  const data = await res.json();
  return data?.items?.[0]?.snippet?.channelId ?? null;
}

async function fetchUploadsPlaylistId(channelId: string, apiKey: string) {
  const res = await fetch(
    `${YOUTUBE_API_BASE}/channels?part=contentDetails&id=${channelId}&key=${apiKey}`,
  );
  const data = await res.json();
  return data?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads ?? null;
}

function formatDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "";
  const [, h, m, s] = match;
  const parts: string[] = [];
  if (h && parseInt(h, 10) > 0) parts.push(h);
  parts.push((m ?? "0").padStart(parts.length ? 2 : 1, "0"));
  parts.push((s ?? "0").padStart(2, "0"));
  return parts.join(":");
}

async function fetchVideoStats(videoIds: string[], apiKey: string) {
  if (videoIds.length === 0) return new Map<string, { viewCount: number; likeCount: number; commentCount: number; duration: string }>();
  const ids = videoIds.join(",");
  const res = await fetch(
    `${YOUTUBE_API_BASE}/videos?part=statistics,contentDetails&id=${ids}&key=${apiKey}`,
  );
  const data = await res.json();
  const items = data?.items ?? [];
  const map = new Map<string, { viewCount: number; likeCount: number; commentCount: number; duration: string }>();
  for (const item of items) {
    const id = item.id;
    const stats = item.statistics ?? {};
    const content = item.contentDetails ?? {};
    map.set(id, {
      viewCount: parseInt(stats.viewCount ?? "0", 10),
      likeCount: parseInt(stats.likeCount ?? "0", 10),
      commentCount: parseInt(stats.commentCount ?? "0", 10),
      duration: formatDuration(content.duration ?? ""),
    });
  }
  return map;
}

async function fetchPlaylistVideos(
  playlistId: string,
  apiKey: string,
  maxResults = 50,
) {
  const res = await fetch(
    `${YOUTUBE_API_BASE}/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=${maxResults}&key=${apiKey}`,
  );
  const data = await res.json();
  const items = data?.items ?? [];

  type PlaylistVideo = { videoId: string; embedUrl: string; title: string; thumbnail: string; publishedAt: string };

  const videos: PlaylistVideo[] = items.map((item: { snippet?: { title?: string; publishedAt?: string; thumbnails?: { medium?: { url?: string }; default?: { url?: string } } }; contentDetails?: { videoId?: string } }) => {
    const videoId = item.contentDetails?.videoId ?? "";
    const snippet = item.snippet ?? {};
    const thumb = snippet.thumbnails?.medium?.url ?? snippet.thumbnails?.default?.url ?? "";
    return {
      videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      title: snippet.title ?? "",
      thumbnail: thumb,
      publishedAt: snippet.publishedAt ?? "",
    };
  });

  const videoIds = videos.map((v) => v.videoId);
  const statsMap = await fetchVideoStats(videoIds, apiKey);

  return videos.map((v) => {
    const stats = statsMap.get(v.videoId);
    return {
      ...v,
      viewCount: stats?.viewCount ?? 0,
      likeCount: stats?.likeCount ?? 0,
      commentCount: stats?.commentCount ?? 0,
      duration: stats?.duration ?? "",
    };
  });
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
  const channelIdParam = searchParams.get("channelId");
  const maxResults = Math.min(
    parseInt(searchParams.get("maxResults") ?? "50", 10),
    50,
  );

  let channelId: string | null = channelIdParam;

  if (!channelId && videoId) {
    channelId = await fetchChannelByVideoId(videoId, apiKey);
  }

  if (!channelId) {
    return NextResponse.json(
      { error: "Provide videoId or channelId" },
      { status: 400 },
    );
  }

  const playlistId = await fetchUploadsPlaylistId(channelId, apiKey);
  if (!playlistId) {
    return NextResponse.json(
      { error: "Could not find uploads playlist" },
      { status: 404 },
    );
  }

  const videos = await fetchPlaylistVideos(playlistId, apiKey, maxResults);

  return NextResponse.json({ videos });
}
