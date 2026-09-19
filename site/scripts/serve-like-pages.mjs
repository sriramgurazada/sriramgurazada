/**
 * Serves `out/` the way GitHub Pages does, so the deployed site can be tested
 * before it is deployed.
 *
 *   node scripts/serve-like-pages.mjs [port] [base-path]
 *
 * Two behaviours matter and neither is what a plain static server does:
 *
 *  - the site lives under a base path, not at the domain root, so every URL a
 *    browser requests carries a prefix that is absent from the files on disk;
 *  - a request for a directory is served from its index.html, a request for an
 *    extensionless path falls back to `<path>.html`, and anything unresolvable
 *    gets 404.html with a 404 status.
 *
 * Getting either wrong locally is how a base-path or trailing-slash bug reaches
 * production: `next dev` runs with no prefix and resolves routes itself, so it
 * cannot reproduce this.
 */
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";

const port = Number(process.argv[2] ?? 4321);
const base = (process.argv[3] ?? "").replace(/\/$/, "");
const root = path.join(process.cwd(), "out");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
};

const isFile = async (candidate) => {
  try {
    return (await stat(candidate)).isFile() ? candidate : null;
  } catch {
    return null;
  }
};

const send = (response, status, file) => {
  response.writeHead(status, { "content-type": TYPES[path.extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(response);
};

createServer(async (request, response) => {
  const url = new URL(request.url, `http://localhost:${port}`);
  let pathname = decodeURIComponent(url.pathname);

  // Everything outside the base path is not part of this site at all, which is
  // exactly how Pages treats it.
  if (base) {
    if (pathname === base) {
      response.writeHead(301, { location: `${base}/` }).end();
      return;
    }
    if (!pathname.startsWith(`${base}/`)) {
      response.writeHead(404).end("Not found");
      return;
    }
    pathname = pathname.slice(base.length);
  }

  // Refuse to serve anything above the export, however it is spelled.
  const target = path.join(root, path.normalize(pathname));
  if (!target.startsWith(root)) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  const resolved =
    (await isFile(target)) ??
    (await isFile(path.join(target, "index.html"))) ??
    (await isFile(`${target.replace(/\/$/, "")}.html`));

  if (resolved) {
    send(response, 200, resolved);
    return;
  }

  // Pages redirects a bare path to its directory when the directory exists.
  if (!pathname.endsWith("/") && (await isFile(path.join(target, "index.html")))) {
    response.writeHead(301, { location: `${base}${pathname}/` }).end();
    return;
  }

  const notFound = await isFile(path.join(root, "404.html"));
  if (notFound) send(response, 404, notFound);
  else response.writeHead(404).end("Not found");
}).listen(port, () => {
  console.log(`Serving out/ like GitHub Pages at http://localhost:${port}${base}/`);
});
