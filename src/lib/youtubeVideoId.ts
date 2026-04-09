/**
 * Extract a YouTube video id from common URL shapes (watch, embed, shorts, live, youtu.be, nocookie).
 */
export function getYoutubeVideoId(url: string | null | undefined): string | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    const u = new URL(trimmed);
    const host = u.hostname.toLowerCase().replace(/^m\./, "");
    const isYoutube =
      host === "youtu.be" ||
      host.endsWith("youtube.com") ||
      host.endsWith("youtube-nocookie.com");
    if (!isYoutube) return null;

    if (u.pathname.includes("/embed/")) {
      const id = u.pathname.split("/embed/")[1]?.split("/")[0]?.split("?")[0];
      return id && id.length > 0 ? id : null;
    }
    if (u.pathname.includes("/shorts/")) {
      const id = u.pathname.split("/shorts/")[1]?.split("/")[0]?.split("?")[0];
      return id && id.length > 0 ? id : null;
    }
    if (u.pathname.includes("/live/")) {
      const id = u.pathname.split("/live/")[1]?.split("/")[0]?.split("?")[0];
      return id && id.length > 0 ? id : null;
    }
    if (u.searchParams.has("v")) {
      return u.searchParams.get("v");
    }
    if (host === "youtu.be") {
      const id = u.pathname.slice(1).split("/")[0]?.split("?")[0];
      return id && id.length > 0 ? id : null;
    }
  } catch {
    return null;
  }
  return null;
}
