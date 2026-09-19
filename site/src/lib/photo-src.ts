import { files, type PhotoSlug } from "@/data/photos";
import { asset } from "@/lib/asset";

/** The path of the largest derivative, before the deployment prefix. */
export function largestPhotoPath(slug: PhotoSlug) {
  const { widths } = files[slug];
  return `/photos/${slug}-${widths[widths.length - 1]}.webp`;
}

/** The largest derivative, ready to use as a URL. */
export function largestPhoto(slug: PhotoSlug) {
  return asset(largestPhotoPath(slug));
}

/** Every WebP width of a photograph, as a srcset. */
export function photoSrcSet(slug: PhotoSlug) {
  return files[slug].widths.map((w) => `${asset(`/photos/${slug}-${w}.webp`)} ${w}w`).join(", ");
}

/** The single JPEG, for anything that cannot read WebP. */
export function photoFallback(slug: PhotoSlug) {
  return asset(`/photos/${slug}.jpg`);
}
