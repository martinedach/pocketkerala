import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Keep resolution anchored to this app so `@import "tailwindcss"` in globals.css
  // does not resolve from a parent directory (e.g. /home/martin) that lacks tailwind.
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
