"use client";

/**
 * Everything that sits between the viewer and the picture: matte bars, grain
 * and a vignette. The bar height is driven by `--letterbox` (1 = fully
 * matted, 0 = full frame), which the hero animates as you scroll.
 */
export default function FilmOverlay() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-50 bg-ink"
        style={{ height: "calc(var(--letterbox, 1) * 11vh)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 bg-ink"
        style={{ height: "calc(var(--letterbox, 1) * 11vh)" }}
      />
      <div aria-hidden className="vignette" />
      <div aria-hidden className="grain" />
    </>
  );
}
