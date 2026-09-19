import { photoFiles, type PhotoSlug } from "@/data/photo-files";

export type { PhotoSlug };

/**
 * Every photograph here is one of the owner's own, as taken. Nothing is
 * assembled, composited or generated, which is why there is no `kind` to check:
 * one assembled image mixed into a documentary collection is exactly what makes
 * the whole collection untrustworthy.
 */
export type Photo = {
  slug: PhotoSlug;
  /** Describes the picture for anyone who cannot see it. */
  alt: string;
  /** Short all-caps label above the caption. */
  label: string;
  /** One observational line. Not a travel memory. */
  caption: string;
  /**
   * A descriptive working label for where this was taken. `located` marks
   * whether the owner has confirmed it; unconfirmed places are listed in the
   * README rather than presented as fact.
   */
  place: string;
  located: boolean;
  /** Set only where the photograph is somebody else's work. */
  credit?: string;
};

/** Intrinsic dimensions and the widths that exist on disk. */
export const files = photoFiles;

export const photos = {
  overlook: {
    slug: "overlook",
    label: "Overlook",
    caption: "You get above the weather and it turns out the weather has edges.",
    alt:
      "A person stands at the edge of a high mountain pullout beside a parked car, " +
      "photographing a vast bank of cloud and falling rain lit from behind by the sun.",
    place: "Mountain overlook, Colorado",
    located: false,
  },

  "redwood-road": {
    slug: "redwood-road",
    label: "Depth",
    caption: "A vanishing point you can actually drive into.",
    alt:
      "A two-lane road curving away between very tall redwoods, with pale daylight " +
      "breaking through the canopy at the far end of the tunnel of trees.",
    place: "Redwood highway, Northern California",
    located: false,
  },

  "emerald-lake": {
    slug: "emerald-lake",
    label: "Contour",
    caption: "Every ridge here is a load path that happened to win.",
    alt:
      "A snow-covered cirque of grey rock rising steeply above a dark, partly frozen " +
      "alpine lake under flat cloud.",
    place: "Alpine lake, Rocky Mountains",
    located: false,
  },

  "balloon-flame": {
    slug: "balloon-flame",
    label: "Ignition",
    caption: "Nothing rises without something burning underneath it.",
    alt:
      "A hot-air balloon inflating against a night sky, its burner throwing a long " +
      "flame up into the orange and yellow envelope.",
    place: "Balloon launch at dusk",
    located: false,
  },

  "waterfall-hike": {
    slug: "waterfall-hike",
    label: "Scale",
    caption: "A person, for scale. Always worth including.",
    alt:
      "A hiker with a pack and walking poles standing on wet rock at the foot of a " +
      "waterfall, framed by overhanging branches.",
    place: "Canyon waterfall, Southern California",
    located: false,
  },

  "dallas-bridge": {
    slug: "dallas-bridge",
    label: "Connections",
    caption: "Cables, fanned out. The same curve solved sixty times over.",
    alt:
      "The lit arch and fanned cables of a cable-stayed bridge at night, with a city " +
      "skyline and a full moon behind it.",
    place: "Cable-stayed bridge, Dallas",
    located: false,
  },

  "wing-city-lights": {
    slug: "wing-city-lights",
    label: "Grid",
    caption: "Every city is a graph, if you get far enough above it.",
    alt:
      "A city's street grid glowing orange at night, seen from an aircraft window past " +
      "a red wingtip.",
    place: "City at night, from the air",
    located: false,
  },

  "water-wall": {
    slug: "water-wall",
    label: "Flow",
    caption: "Water moves. The frame stays still.",
    alt:
      "A curved concrete wall with water falling down its full height. The circular " +
      "opening at the top shows blue sky and cloud, and a few people stand at its base.",
    place: "Water wall",
    located: false,
  },

  "sunset-dock": {
    slug: "sunset-dock",
    label: "Next",
    caption: "The good part is that there is always more of it.",
    alt:
      "A person jumping with arms and legs spread at the end of a lake dock, " +
      "silhouetted against a low orange sun that lays a column of light across the water.",
    place: "Lake at sunset",
    located: false,
  },

  headshot: {
    slug: "headshot",
    label: "Portrait",
    caption: "",
    alt:
      "Studio portrait of Sriram Gurazada in a dark suit and open white shirt against a " +
      "grey backdrop.",
    place: "Studio",
    located: true,
  },

  "usc-steps-of-troy": {
    slug: "usc-steps-of-troy",
    label: "USC",
    caption: "",
    alt:
      "Sriram Gurazada in a suit and a USC Class of 2025 stole, standing on the Steps " +
      "of Troy.",
    place: "University of Southern California, Los Angeles",
    located: true,
  },

  "usc-traveler": {
    slug: "usc-traveler",
    label: "USC",
    caption: "",
    alt:
      "Sriram Gurazada in a suit and USC stole, seated beside the bronze statue of the " +
      "USC mascot on campus.",
    place: "University of Southern California, Los Angeles",
    located: true,
  },

  "undergrad-computer-block": {
    slug: "undergrad-computer-block",
    label: "Where it started",
    caption: "",
    alt:
      "Sriram Gurazada in a graduation cap and gown standing under a sign reading " +
      "Computer Block, with other graduates behind him.",
    place: "Undergraduate graduation, India",
    located: false,
  },

  "hollywood-sign": {
    slug: "hollywood-sign",
    label: "Los Angeles",
    caption: "",
    alt: "Sriram Gurazada standing on a hillside trail with the Hollywood sign behind him.",
    place: "Los Angeles, California",
    located: true,
  },

  "train-platform": {
    slug: "train-platform",
    label: "Transit",
    caption: "Everything in the frame is still except the one thing that is not.",
    alt:
      "A person standing on a downtown platform at night while a train passes behind " +
      "them, the lit carriages smeared into a long blue streak.",
    place: "Downtown transit platform",
    located: false,
  },

  "chicago-river": {
    slug: "chicago-river",
    label: "Chicago",
    caption: "",
    alt:
      "A person leaning on the rail of a boat on the Chicago River at night, with lit " +
      "towers and a bridge behind them.",
    place: "Chicago River, Illinois",
    located: false,
  },

  "la-skyline": {
    slug: "la-skyline",
    label: "Downtown",
    caption: "Two million decisions, lit from the inside.",
    alt: "The downtown Los Angeles skyline at night, its towers lit against a black sky.",
    place: "Los Angeles, California",
    located: false,
  },

  "wind-turbine": {
    slug: "wind-turbine",
    label: "Torque",
    caption: "Three blades, and nothing else to hide behind.",
    alt:
      "A single white wind turbine standing over a ploughed field under a bright blue " +
      "sky with scattered cloud.",
    place: "Wind farm, Texas panhandle",
    located: false,
  },

  "golden-gate": {
    slug: "golden-gate",
    label: "Suspension",
    caption: "The cables are doing all the work and none of the talking.",
    alt:
      "The Golden Gate Bridge at dusk, seen from the eastern side with the headlands " +
      "and the bay behind it.",
    place: "San Francisco, California",
    located: true,
  },

  "sf-wheel": {
    slug: "sf-wheel",
    label: "Waterfront",
    caption: "A lit wheel, and a pier full of sea lions ignoring it.",
    alt:
      "A lit Ferris wheel on the San Francisco waterfront at dusk, with sea lions " +
      "hauled out on floating docks in the foreground.",
    place: "San Francisco, California",
    located: true,
  },

  "antelope-canyon": {
    slug: "antelope-canyon",
    label: "Strata",
    caption: "Time, stored as layers, readable by anyone who stops to look.",
    alt:
      "Curved orange sandstone walls inside a slot canyon, with a bright opening of sky " +
      "above the layered rock.",
    place: "Slot canyon, Arizona",
    located: false,
  },
} as const satisfies Record<PhotoSlug, Photo>;

export function photo(slug: PhotoSlug): Photo {
  return photos[slug];
}

/**
 * The curated wall: six original photographs, three columns by two rows on
 * desktop. Deliberately finite — this is a selection, not an archive.
 */
export const photoWall: PhotoSlug[] = [
  "redwood-road",
  "emerald-lake",
  "balloon-flame",
  "waterfall-hike",
  "dallas-bridge",
  "wing-city-lights",
];

/**
 * The two frames that open the section, shown far larger than the wall below:
 * one wide, one tall. Kept out of the wall so the section does not show the same
 * photograph twice.
 */
export const openingFrames = { wide: "golden-gate", tall: "water-wall" } as const;
