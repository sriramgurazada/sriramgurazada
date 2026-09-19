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
 *
 * Nothing here alters what was photographed. Resize, rotate and re-encode only:
 * no compositing, no colour grading, no assembling one picture out of two.
 */
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

/**
 * Source files arrive UUID-named. Each is keyed by the first 13 characters of
 * its filename, which is unique across the set.
 *
 * Several photographs were supplied twice, once at full camera resolution and
 * once downscaled to about 1536px on the long edge. These keys point at the
 * full-resolution copy in every case where one exists, which is what decides
 * whether a photograph can hold a large frame without going soft. The ones with
 * no full-resolution copy are noted, and are given roles that do not ask for
 * more pixels than they have.
 */
const SOURCES = {
  // Hero. Only ever supplied as a 2000px panorama, so the hero widths stop
  // there rather than inventing pixels that were never captured.
  b6ac1859: { slug: "overlook", role: "hero" },

  // The two frames opening Field notes, shown far larger than anything in the
  // wall. Both are full-resolution originals, which is the reason these two were
  // chosen for the job.
  "01a0b673-a1bc": { slug: "golden-gate", role: "feature" },
  "01a0b673-a2df": { slug: "water-wall", role: "feature" },

  // The six-photo wall, in reading order.
  "85cd8021": { slug: "redwood-road", role: "wall" }, // 1536px only
  "01a0b673-a12b": { slug: "emerald-lake", role: "wall" },
  "01a0b673-a0b2": { slug: "balloon-flame", role: "wall" },
  "01a0b673-a4d1": { slug: "waterfall-hike", role: "wall" },
  "116b90e2": { slug: "dallas-bridge", role: "wall" }, // 1536px only
  "01a0b673-a380": { slug: "wing-city-lights", role: "wall" },

  // Chapter scenery.
  "5d8aa3db": { slug: "sunset-dock", role: "feature" }, // 1536px only

  // People.
  "01a0b673-a5ef": { slug: "headshot", role: "portrait" },
  "01a0b673-a5be": { slug: "usc-steps-of-troy", role: "portrait" },
  "01a0b673-a693": { slug: "usc-traveler", role: "portrait" },
  "01a0b673-a5d6": { slug: "undergrad-computer-block", role: "portrait" },
  "01a0b673-a66e": { slug: "hollywood-sign", role: "portrait" },
  "20505e6c": { slug: "train-platform", role: "portrait" }, // 1536px only
  "01a0b673-a578": { slug: "chicago-river", role: "portrait" },

  // Alternates. Not on the portfolio, but kept sized and ready.
  "7d58ab8a": { slug: "wind-turbine", role: "wall" }, // 1536px only
  "8b3749a3": { slug: "la-skyline", role: "wall" }, // 1536px only
  "01a0b673-a265": { slug: "sf-wheel", role: "wall" },
  "01a0b673-a41d": { slug: "antelope-canyon", role: "wall" },
};

/**
 * Long-edge widths per role, and the quality each is encoded at. The fallback is
 * the JPEG a browser without WebP gets, and is deliberately not the largest
 * size.
 *
 * Quality is set per role rather than globally because the roles are not viewed
 * the same way. The hero fills the window and the two opening frames are shown
 * large enough to study, so both are encoded well above the point where WebP
 * starts smearing cloud gradients and cable detail. A wall thumbnail is a third
 * of a column wide and does not need it.
 *
 * The largest hero width is for a retina desktop, which asks for roughly twice
 * its CSS width: capping at 2000 left the photograph visibly soft on exactly the
 * screens most likely to be looking at it.
 */
const ROLES = {
  hero: { edges: [640, 1024, 1600, 2048, 2560], fallback: 1600, quality: 84 },
  feature: { edges: [560, 900, 1400, 1800], fallback: 1200, quality: 84 },
  wall: { edges: [480, 800, 1400], fallback: 1000, quality: 80 },
  portrait: { edges: [400, 720, 1100], fallback: 900, quality: 80 },
};

// effort 6 buys a smaller file at the same quality. It costs encode time in a
// script that runs by hand, which is the cheapest currency available.
const WEBP = { effort: 6 };
const JPEG = { mozjpeg: true, progressive: true };

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
  const { edges, fallback, quality } = ROLES[role];
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
      .webp({ ...WEBP, quality })
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
    .jpeg({ ...JPEG, quality })
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
