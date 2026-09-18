/**
 * Resolves a path in `public/` against the deployment's base path.
 *
 * Next applies `basePath` to the URLs it emits itself, such as script and
 * style tags, but not to these two cases:
 *
 *  - anything loaded by hand, like a plate handed to a THREE texture loader;
 *  - `next/image` sources when `images.unoptimized` is set, because the
 *    rewrite happens in the optimizer that setting turns off.
 *
 * Both are all over this site, and both fail as a 404 that is easy to miss
 * locally, since local development runs with no prefix at all.
 *
 * Inlined at build time, so this costs nothing at runtime.
 */
const RAW = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
// Normalised the same way as next.config.ts: a root deployment reports "/",
// which would otherwise produce doubled slashes.
const BASE = RAW === "/" ? "" : RAW.replace(/\/$/, "");

export function asset(path: string) {
  return `${BASE}${path}`;
}
