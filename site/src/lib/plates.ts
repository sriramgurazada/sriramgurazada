import { chapters, finalePlate, heroPlate } from "@/data/content";
import { asset } from "@/lib/asset";

/**
 * Every photograph the WebGL stage can display, in narrative order. Sections
 * refer to plates by index so the shader only ever holds two textures at once.
 *
 * These are resolved through `asset` because they are handed to a THREE
 * texture loader rather than to `next/image`, which would apply the base path
 * itself. The same files referenced from `content.ts` by DOM components are
 * deliberately left raw for that reason.
 */
export const plateList: string[] = [
  heroPlate,
  ...chapters.map((c) => c.plate),
  finalePlate,
].map(asset);

export const HERO_PLATE = 0;
export const FINALE_PLATE = plateList.length - 1;

/** Chapter 0 lives at plate 1, because the hero occupies plate 0. */
export const chapterPlate = (chapterIndex: number) => chapterIndex + 1;
