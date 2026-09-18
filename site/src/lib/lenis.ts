import type Lenis from "lenis";

/**
 * Shared handle on the scroll instance so the preloader can hold the page
 * still while plates upload, then release it.
 */
export const lenisRef: { current: Lenis | null } = { current: null };

export function lockScroll() {
  lenisRef.current?.stop();
  document.documentElement.style.overflow = "hidden";
}

export function unlockScroll() {
  document.documentElement.style.overflow = "";
  lenisRef.current?.start();
}
