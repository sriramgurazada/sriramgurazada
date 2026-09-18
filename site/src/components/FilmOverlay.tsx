"use client";

import { useEffect, useRef } from "react";
import { scene } from "@/lib/scene";

const BAR_VH = 11;

/**
 * Everything between the viewer and the picture: matte bars, grain and a
 * vignette.
 *
 * The bars are driven straight from `scene.expansion` on a frame loop rather
 * than by a GSAP tween. The matte is the first thing on screen, so its state
 * has to be correct on the very first frame and survive re-mounts — deriving
 * it from the scene each frame makes that unconditional.
 */
export default function FilmOverlay() {
  const top = useRef<HTMLDivElement>(null);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      // Ease-in-out so the frame opens with weight rather than linearly.
      const t = Math.min(Math.max(scene.expansion, 0), 1);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const height = `${(1 - eased) * BAR_VH}vh`;
      if (top.current) top.current.style.height = height;
      if (bottom.current) bottom.current.style.height = height;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      <div
        ref={top}
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-50 bg-ink"
        style={{ height: `${BAR_VH}vh` }}
      />
      <div
        ref={bottom}
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 bg-ink"
        style={{ height: `${BAR_VH}vh` }}
      />
      <div aria-hidden className="vignette" />
      <div aria-hidden className="grain" />
    </>
  );
}
