import type { NextConfig } from "next";

/**
 * GitHub Pages serves this repository from /sriramgurazada rather than the
 * domain root, so the whole site has to be built aware of that prefix. It is
 * read from the environment rather than hard-coded so `npm run dev` and any
 * root-domain host still work with no prefix at all.
 */
// A root deployment reports its prefix as "/", which is not a valid basePath.
const raw = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const basePath = raw === "/" ? "" : raw.replace(/\/$/, "");

const nextConfig: NextConfig = {
  // The site is entirely static: no server, no revalidation, no route
  // handlers. Exporting it means Pages can host it directly.
  output: "export",
  basePath,
  /**
   * Without this, a route exports as `work.html`, which GitHub Pages serves at
   * `/work` but not at `/work/` — so every trailing-slash URL 404s, including
   * anything a visitor types, shares or gets from a redirect. Emitting
   * `work/index.html` instead makes both spellings work, because Pages resolves
   * a directory to its index and redirects the bare path to it.
   */
  trailingSlash: true,
  images: {
    // The photographs are pre-sized by scripts/process-photos.mjs. Next's
    // optimizer needs a server, which a static export does not have.
    unoptimized: true,
  },
};

export default nextConfig;
