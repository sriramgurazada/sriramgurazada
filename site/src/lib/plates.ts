import { chapters, finalePlate, heroPlate } from "@/data/content";

/**
 * Every photograph the WebGL stage can display, in narrative order. Sections
 * refer to plates by index so the shader only ever holds two textures at once.
 */
export const plateList: string[] = [
  heroPlate,
  ...chapters.map((c) => c.plate),
  finalePlate,
];

export const HERO_PLATE = 0;
export const FINALE_PLATE = plateList.length - 1;

/** Chapter 0 lives at plate 1, because the hero occupies plate 0. */
export const chapterPlate = (chapterIndex: number) => chapterIndex + 1;
