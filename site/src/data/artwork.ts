import type { ArtSlug } from "@/data/photo-files";

export type { ArtSlug };

/**
 * Illustrations, built to the approved design.
 *
 * These are deliberately not in photos.ts. A photograph is a record of a place
 * somebody stood; an illustration is a made thing. Both are fine to put on a
 * page, but only one of them can be offered as evidence, so the two never share
 * a list, a type or a caption style. The photography wall draws from photos.ts
 * only, and every illustration carries a `note` explaining what it depicts so
 * nothing here can be mistaken for somewhere real.
 */
export type Art = {
  slug: ArtSlug;
  /** Describes the image for anyone who cannot see it. */
  alt: string;
  /** What it depicts, and that it was made rather than photographed. */
  note: string;
};

export const artwork = {
  "horizon-vista": {
    slug: "horizon-vista",
    alt:
      "Illustration of a mountain overlook at golden hour. Storm cloud fills the sky, " +
      "sunlight breaks through onto a distant valley, and a single glowing amber trail " +
      "winds from the dark rocky foreground up into the light. A small figure stands " +
      "in silhouette on the right.",
    note: "Illustration. Built for the site rather than photographed.",
  },

  "contour-ridge": {
    slug: "contour-ridge",
    alt:
      "Illustration of a snow-covered ridge above a dark lake, half photographic and " +
      "half survey map: the terrain dissolves into thousands of fine topographic " +
      "contour lines, with a glowing amber route climbing it past five lit waypoints.",
    note: "Illustration. Terrain drawn as contour lines, with a route and its waypoints.",
  },

  "system-graph": {
    slug: "system-graph",
    alt:
      "Illustration of a distributed system drawn in the language of a survey map: a " +
      "field of fine contour lines with a graph of glowing amber nodes above it, " +
      "connected by paths that branch and rejoin from left to right.",
    note: "Illustration. A pipeline drawn as terrain.",
  },
} as const satisfies Record<ArtSlug, Art>;

export function art(slug: ArtSlug): Art {
  return artwork[slug];
}
