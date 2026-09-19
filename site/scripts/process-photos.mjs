/**
 * Asset pipeline: turns the original camera/phone files into the web
 * derivatives the site actually ships.
 *
 *   node scripts/process-photos.mjs <source-dir>
 *
 * The originals are never committed. Each photograph becomes a set of WebP
 * widths plus one JPEG of the same crop, so a <picture> can offer WebP to
 * everything current and fall back to JPEG for anything older. The widths are
 * chosen per role: a full-bleed hero needs far more pixels than a thumbnail in
 * a three-column wall, and shipping wall-sized files for the hero (or
 * hero-sized files for the wall) is how an image budget gets blown.
 */
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

/**
 * Source files arrive UUID-named. Each is keyed by the first 13 characters of
 * its filename, which is unique across the set. Where the same photograph was
 * supplied twice, this points at the higher-resolution copy.
 */
const SOURCES = {
  // Hero.
  b6ac1859: { slug: "overlook", role: "hero" },

  // The six-photo wall, in reading order.
  "85cd8021": { slug: "redwood-road", role: "wall" },
  "01a0b673-a12b": { slug: "emerald-lake", role: "wall" },
  "01a0b673-a0b2": { slug: "balloon-flame", role: "wall" },
  "01a0b673-a4d1": { slug: "waterfall-hike", role: "wall" },
  "116b90e2": { slug: "dallas-bridge", role: "wall" },
  "01a0b673-a380": { slug: "wing-city-lights", role: "wall" },

  // The story wall, which is displayed much larger than the wall thumbnails.
  "01a0b673-a2df": { slug: "water-wall", role: "feature" },

  // Chapter scenery.
  "5d8aa3db": { slug: "sunset-dock", role: "feature" },

  // People.
  "01a0b673-a5ef": { slug: "headshot", role: "portrait" },
  "01a0b673-a5be": { slug: "usc-steps-of-troy", role: "portrait" },
  "01a0b673-a693": { slug: "usc-traveler", role: "portrait" },
  "01a0b673-a5d6": { slug: "undergrad-computer-block", role: "portrait" },
  "37d4a5ba": { slug: "hollywood-sign", role: "portrait" },
  "20505e6c": { slug: "train-platform", role: "portrait" },
  "01a0b673-a578": { slug: "chicago-river", role: "portrait" },

  // Alternates. Not on the home page, but kept sized and ready.
  "8b3749a3": { slug: "la-skyline", role: "wall" },
  "7d58ab8a": { slug: "wind-turbine", role: "wall" },
  "01a0b673-a1bc": { slug: "golden-gate", role: "wall" },
  "01a0b673-a265": { slug: "sf-wheel", role: "wall" },
  "01a0b673-a41d": { slug: "antelope-canyon", role: "wall" },
};

/**
 * Long-edge widths per role. The fallback is the JPEG a browser without WebP
 * gets, and is deliberately not the largest size.
 */
const ROLES = {
  hero: { edges: [640, 1024, 1600, 2000], fallback: 1600 },
  feature: { edges: [560, 900, 1400], fallback: 1100 },
  wall: { edges: [480, 800, 1400], fallback: 1000 },
  portrait: { edges: [400, 720, 1100], fallback: 900 },
};

const WEBP = { quality: 78, effort: 5 };
const JPEG = { quality: 80, mozjpeg: true, progressive: true };

const sourceDir = process.argv[2];
if (!sourceDir) {
  console.error("Usage: node scripts/process-photos.mjs <source-dir>");
  process.exit(1);
}

const outDir = path.join(process.cwd(), "public", "photos");
await mkdir(outDir, { recursive: true });

/** Resolve the source file for every mapped key, so a typo fails loudly. */
const files = await readdir(sourceDir);
const resolved = new Map();
for (const [key, entry] of Object.entries(SOURCES)) {
  const match = files.find((file) => file.startsWith(key));
  if (!match) {
    console.error(`No source file found for ${key} (${entry.slug})`);
    process.exit(1);
  }
  resolved.set(entry.slug, { ...entry, file: path.join(sourceDir, match) });
}

const manifest = [];

/**
 * Emit one photograph at every width its role calls for.
 *
 * `load` returns a fresh sharp instance each time: sharp pipelines are
 * single-use, and re-reading the source per width keeps each resize working
 * from full resolution rather than from an already-downscaled buffer.
 */
async function emit(slug, role, load) {
  const { edges, fallback } = ROLES[role];
  const meta = await load().metadata();
  // .rotate() applies the EXIF orientation, and orientations 5-8 swap the
  // axes, so the stored dimensions are not the displayed ones.
  const swapped = meta.orientation >= 5;
  const srcW = swapped ? meta.height : meta.width;
  const srcH = swapped ? meta.width : meta.height;
  const portrait = srcH > srcW;
  const longEdge = Math.max(srcW, srcH);

  /** Never upscale: a 900 px original does not become a 1400 px derivative. */
  const longEdges = [...new Set(edges.map((e) => Math.min(e, longEdge)))].sort((a, b) => a - b);
  const sources = [];

  // Roles are specified by long edge so a portrait and a landscape photograph
  // at the same role carry comparable detail, but the files are *named* by
  // their width, because that is what a srcset descriptor has to state.
  for (const edge of longEdges) {
    const resize = portrait ? { height: edge } : { width: edge };
    const { data, info } = await load()
      .rotate()
      .resize({ ...resize, withoutEnlargement: true })
      .webp(WEBP)
      .toBuffer({ resolveWithObject: true });
    if (sources.some((s) => s.width === info.width)) continue;
    await writeFile(path.join(outDir, `${slug}-${info.width}.webp`), data);
    sources.push({ width: info.width, height: info.height, kb: info.size / 1024 });
  }

  const fallbackEdge = Math.min(fallback, longEdge);
  const fallbackResize = portrait ? { height: fallbackEdge } : { width: fallbackEdge };
  const jpeg = await load()
    .rotate()
    .resize({ ...fallbackResize, withoutEnlargement: true })
    .jpeg(JPEG)
    .toFile(path.join(outDir, `${slug}.jpg`));

  manifest.push({
    slug,
    role,
    // The intrinsic ratio the markup reserves space with. Taken from the
    // largest derivative so it matches what is actually served.
    width: sources.at(-1).width,
    height: sources.at(-1).height,
    widths: sources.map((s) => s.width),
    fallbackKb: Math.round(jpeg.size / 1024),
    largestKb: Math.round(sources.at(-1).kb),
    source: `${srcW}x${srcH}`,
  });
}

for (const [slug, entry] of resolved) {
  await emit(slug, entry.role, () => sharp(entry.file));
}

/**
 * The composite study: the Dallas bridge screened over the mountain lake.
 *
 * This is the one image on the site that is not a documentary photograph, and
 * it is labelled as such wherever it appears. Screen blending is what makes it
 * work: the bridge was shot against a night sky that is very nearly black, so
 * screening keeps the lit arch, cables and skyline and lets the mountains
 * through everywhere else, with no hand-cut mask.
 */
const COMPOSITE = { slug: "composite-study", width: 2000, height: 1000 };
{
  const mountains = await sharp(resolved.get("emerald-lake").file)
    .rotate()
    // Anchored to the bottom so the lake survives the crop to 2:1; it is the
    // surface the bridge needs to look like it is standing over.
    .resize({ width: COMPOSITE.width, height: COMPOSITE.height, fit: "cover", position: "bottom" })
    // The lake photograph is flat overcast daylight; the bridge is night. The
    // mountains have to be pulled down and cooled to sit in the same frame.
    .modulate({ brightness: 0.4, saturation: 0.5 })
    .tint("#46647c")
    .toBuffer();

  // The bridge photograph has a messy near foreground in its lower left —
  // grass, a bench, a streetlight — which screening would drop into the middle
  // of the lake. Trim to the part that is only arch, cables and skyline.
  const bridgeMeta = await sharp(resolved.get("dallas-bridge").file).rotate().metadata();
  const trimmed = await sharp(resolved.get("dallas-bridge").file)
    .rotate()
    .extract({
      left: Math.round(bridgeMeta.width * 0.17),
      top: 0,
      width: Math.round(bridgeMeta.width * 0.83),
      height: Math.round(bridgeMeta.height * 0.8),
    })
    // Fitted by height rather than cropped to the canvas, so the whole arch
    // survives.
    .resize({ height: COMPOSITE.height, fit: "inside" })
    .toBuffer({ resolveWithObject: true });

  const padLeft = COMPOSITE.width - trimmed.info.width;

  // Black is the identity under a screen blend, so padding with black leaves
  // the mountains untouched and confines the bridge to the right of the frame.
  // The night sky is near-black but not black, so the pad boundary would still
  // show as a faint vertical seam; multiplying by a gradient that reaches
  // black at the boundary dissolves it.
  const feather = Buffer.from(
    `<svg width="${COMPOSITE.width}" height="${COMPOSITE.height}">
       <linearGradient id="f" x1="0" x2="1" y1="0" y2="0">
         <stop offset="${(padLeft / COMPOSITE.width).toFixed(4)}" stop-color="#000"/>
         <stop offset="${((padLeft + 420) / COMPOSITE.width).toFixed(4)}" stop-color="#fff"/>
       </linearGradient>
       <rect width="100%" height="100%" fill="url(#f)"/>
     </svg>`
  );

  const bridge = await sharp(trimmed.data)
    .extend({ left: padLeft, background: "#000000" })
    .composite([{ input: feather, blend: "multiply" }])
    .modulate({ brightness: 1.1 })
    .toBuffer();

  const composed = sharp(mountains).composite([{ input: bridge, blend: "screen" }]);
  const buffer = await composed.jpeg({ quality: 95 }).toBuffer();
  await emit(COMPOSITE.slug, "feature", () => sharp(buffer));
}

manifest.sort((a, b) => a.slug.localeCompare(b.slug));

/**
 * The site imports these dimensions so every <img> can reserve its own space.
 * Generating the file means the numbers can never drift from the pixels.
 */
const generated = `/**
 * Generated by scripts/process-photos.mjs. Do not edit by hand.
 *
 * Intrinsic size of the largest derivative of each photograph, plus the widths
 * that exist on disk, so markup can reserve space and build a srcset without
 * guessing.
 */
export type PhotoFile = {
  width: number;
  height: number;
  widths: number[];
};

export const photoFiles = {
${manifest.map((m) => `  "${m.slug}": { width: ${m.width}, height: ${m.height}, widths: [${m.widths.join(", ")}] },`).join("\n")}
} as const satisfies Record<string, PhotoFile>;

export type PhotoSlug = keyof typeof photoFiles;
`;
await writeFile(path.join(process.cwd(), "src", "data", "photo-files.ts"), generated);

console.table(manifest);
const total = manifest.reduce((sum, m) => sum + m.fallbackKb + m.largestKb, 0);
console.log(`\n${manifest.length} photographs. Largest WebP + JPEG per photo: ${(total / 1024).toFixed(1)} MB`);
