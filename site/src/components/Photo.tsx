import { assetFiles, type AssetSlug } from "@/data/photo-files";
import { photoFallback, photoSrcSet } from "@/lib/photo-src";

type Props = {
  slug: AssetSlug;
  alt: string;
  /**
   * The `sizes` attribute. Required, because a wrong one is the difference
   * between a 360px file and a 1400px file on a phone, and there is no sane
   * default for a layout this varied.
   */
  sizes: string;
  className?: string;
  /** Only the hero should set this. Everything else lazy-loads. */
  priority?: boolean;
  /** `object-position`, for crops where the subject is not in the middle. */
  position?: string;
};

/**
 * A photograph or an illustration, as a plain <picture>.
 *
 * Every photograph is pre-derived by scripts/process-photos.mjs, so there is no
 * optimizer to run and nothing to negotiate at request time: WebP for anything
 * from the last five years, one JPEG for everything else. `width` and `height`
 * come from the generated manifest, so each image reserves its own space and
 * contributes nothing to layout shift.
 *
 * This deliberately avoids next/image. With `images.unoptimized` — which a
 * static export requires — next/image adds a client component and its own
 * base-path hazards while doing none of the work that would justify either.
 */
export default function Photo({ slug, alt, sizes, className, priority, position }: Props) {
  const file = assetFiles[slug];

  return (
    // display:contents, so <picture> does nothing to the layout and the <img>
    // behaves as a direct child of whatever contains it. That matters because
    // some of these images are absolutely positioned to fill a frame, and an
    // inline wrapper in between would silently break that.
    <picture className="contents">
      <source type="image/webp" srcSet={photoSrcSet(slug)} sizes={sizes} />
      <img
        src={photoFallback(slug)}
        alt={alt}
        width={file.width}
        height={file.height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        className={className}
        style={position ? { objectPosition: position } : undefined}
      />
    </picture>
  );
}
