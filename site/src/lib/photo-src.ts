import { assetFiles, type AssetSlug } from "@/data/photo-files";
import { asset } from "@/lib/asset";

export type { AssetSlug };

/**
 * Derivatives are addressed the same way whether the source was a photograph or
 * an illustration — both live in /photos and both carry the same widths. The
 * distinction between the two is a matter of meaning, not of URLs, so it is kept
 * in the data layer rather than repeated here.
 */

/** The path of the largest derivative, before the deployment prefix. */
export function largestPhotoPath(slug: AssetSlug) {
  const { widths } = assetFiles[slug];
  return `/photos/${slug}-${widths[widths.length - 1]}.webp`;
}

/** The largest derivative, ready to use as a URL. */
export function largestPhoto(slug: AssetSlug) {
  return asset(largestPhotoPath(slug));
}

/** Every WebP width, as a srcset. */
export function photoSrcSet(slug: AssetSlug) {
  return assetFiles[slug].widths.map((w) => `${asset(`/photos/${slug}-${w}.webp`)} ${w}w`).join(", ");
}

/** The single JPEG, for anything that cannot read WebP. */
export function photoFallback(slug: AssetSlug) {
  return asset(`/photos/${slug}.jpg`);
}
