import type { Theme } from "@/data/content";

type RGB = [number, number, number];

/**
 * Scroll runs at 60fps and drives GPU uniforms every frame. Routing that
 * through React state would re-render the tree on every tick, so scroll
 * writers mutate this module-level object and `useFrame` readers sample it.
 */
export const scene = {
  /** Overall document scroll progress, 0 to 1. */
  progress: 0,
  /** Smoothed absolute scroll velocity, roughly 0 to 1. */
  velocity: 0,
  /** Progress of the hero's letterbox-to-full-frame expansion, 0 to 1. */
  expansion: 0,
  /** How strongly the ember field burns, 0 to 1. */
  intensity: 0,
  /** Index of the chapter currently on screen, -1 before the first. */
  chapterIndex: -1,

  /** Outgoing and incoming plate indices, and the dissolve between them. */
  plateA: 0,
  plateB: 0,
  plateMix: 0,
  /** Photograph (0) to contour schematic (1). */
  reveal: 0,
  /** Slow push-in of the current plate, 0 to 1. */
  push: 0,
  /** Vertical drift of the current plate, roughly -1 to 1. */
  parallax: 0,
  /** Overall plate brightness; dropped under dense text. */
  exposure: 1,

  emberTarget: [1.0, 0.37, 0.12] as RGB,
  mistTarget: [0.18, 0.08, 0.04] as RGB,
  ember: [1.0, 0.37, 0.12] as RGB,
  mist: [0.18, 0.08, 0.04] as RGB,
};

export function setTheme(theme: Theme) {
  scene.emberTarget = [...theme.ember] as RGB;
  scene.mistTarget = [...theme.mist] as RGB;
  if (typeof document !== "undefined") {
    document.documentElement.style.setProperty("--accent", theme.accent);
  }
}

/** Frame-rate independent exponential smoothing. */
export function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

export function dampColor(current: RGB, target: RGB, lambda: number, dt: number) {
  for (let i = 0; i < 3; i++) {
    current[i] = damp(current[i], target[i], lambda, dt);
  }
}

/** Advances the smoothed colour values. Called once per frame by the VFX canvas. */
export function tickScene(dt: number) {
  dampColor(scene.ember, scene.emberTarget, 2.2, dt);
  dampColor(scene.mist, scene.mistTarget, 2.2, dt);
}
