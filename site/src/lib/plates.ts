import { chapters, finalePlate, heroPlate } from "@/data/raw";
import { largestPhoto } from "@/lib/photo-src";

/**
 * Every photograph the WebGL stage can display, in narrative order. Sections
 * refer to plates by index so the shader only ever holds two textures at once.
 *
 * These resolve to the largest derivative of each photograph and are prefixed
 * for the deployment, because a THREE texture loader fetches them itself and so
 * gets none of the rewriting the framework does for its own URLs.
 */
export const plateList: string[] = [heroPlate, ...chapters.map((c) => c.plate), finalePlate].map(
  largestPhoto
);

export const HERO_PLATE = 0;
export const FINALE_PLATE = plateList.length - 1;

/** Chapter 0 lives at plate 1, because the hero occupies plate 0. */
export const chapterPlate = (chapterIndex: number) => chapterIndex + 1;
