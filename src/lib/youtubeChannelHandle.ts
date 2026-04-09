/**
 * Accepts a handle like "PocketKerala", "@PocketKerala", or a channel URL
 * e.g. https://www.youtube.com/@PocketKerala
 */
export function parseYoutubeChannelHandle(input: string): string | null {
  const t = input.trim();
  if (!t) return null;

  if (t.startsWith("http://") || t.startsWith("https://")) {
    try {
      const u = new URL(t);
      const host = u.hostname.toLowerCase();
      if (!host.endsWith("youtube.com") && !host.endsWith("youtube-nocookie.com")) {
        return null;
      }
      const seg = u.pathname.split("/").filter(Boolean)[0];
      if (seg?.startsWith("@")) {
        return seg.slice(1) || null;
      }
      return null;
    } catch {
      return null;
    }
  }

  return t.replace(/^@/, "") || null;
}
