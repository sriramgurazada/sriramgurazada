/**
 * One-off asset pipeline: takes the original camera/phone files and emits
 * web-sized plates into public/photos.
 *
 * Run with:  node scripts/process-photos.mjs <source-dir>
 */
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// Source files are UUID-named; map each to a meaningful slug and a role.
// "plate" images are sampled as WebGL textures, so they need more resolution.
// "portrait" images are rendered as regular <img> elements in the DOM.
const MAP = {
  "01a0b673-a0b2": { name: "balloon-flame", role: "plate" },
  "01a0b673-a12b": { name: "emerald-lake", role: "plate" },
  "01a0b673-a1bc": { name: "golden-gate", role: "plate" },
  "01a0b673-a265": { name: "sf-wheel", role: "plate" },
  "01a0b673-a2df": { name: "water-wall", role: "plate" },
  "01a0b673-a380": { name: "wing-city-lights", role: "plate" },
  "01a0b673-a41d": { name: "antelope-canyon", role: "plate" },
  "01a0b673-a4d1": { name: "waterfall-hike", role: "plate" },
  "01a0b673-a578": { name: "chicago-river", role: "plate" },
  "01a0b673-a5be": { name: "usc-steps-of-troy", role: "portrait" },
  "01a0b673-a5d6": { name: "undergrad-computer-block", role: "portrait" },
  "01a0b673-a5ef": { name: "headshot", role: "portrait" },
  "01a0b673-a66e": { name: "hollywood-sign", role: "portrait" },
  "01a0b673-a693": { name: "usc-traveler", role: "portrait" },
  // 01a0b674-6e7c is the design reference screenshot, intentionally not shipped.
};

const SIZES = {
  plate: { width: 1800, quality: 80 },
  portrait: { width: 1200, quality: 82 },
};

const sourceDir = process.argv[2];
if (!sourceDir) {
  console.error("Usage: node scripts/process-photos.mjs <source-dir>");
  process.exit(1);
}

const outDir = path.join(process.cwd(), "public", "photos");
await mkdir(outDir, { recursive: true });

const files = await readdir(sourceDir);
const manifest = [];

for (const file of files) {
  const prefix = file.slice(0, 13);
  const entry = MAP[prefix];
  if (!entry) continue;

  const { width, quality } = SIZES[entry.role];
  const input = path.join(sourceDir, file);
  const output = path.join(outDir, `${entry.name}.jpg`);

  const image = sharp(input).rotate();
  const meta = await image.metadata();

  const info = await image
    .resize({ width, withoutEnlargement: true })
    .jpeg({ quality, mozjpeg: true, progressive: true })
    .toFile(output);

  manifest.push({
    name: entry.name,
    role: entry.role,
    width: info.width,
    height: info.height,
    kb: Math.round(info.size / 1024),
    source: `${meta.width}x${meta.height}`,
  });
}

manifest.sort((a, b) => a.name.localeCompare(b.name));
console.table(manifest);
const total = manifest.reduce((sum, m) => sum + m.kb, 0);
console.log(`\n${manifest.length} images, ${(total / 1024).toFixed(2)} MB total`);
