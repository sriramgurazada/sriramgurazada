"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { scene } from "@/lib/scene";
import { lenisRef } from "@/lib/lenis";

/**
 * Inertial scrolling is what sells the "shot on a crane" feel — every pin,
 * parallax and scrub in the page reads as weighted rather than snappy.
 * Lenis owns the scroll position and GSAP's ticker drives it, so both
 * systems advance on the same clock instead of drifting apart.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const lenis = new Lenis({
      duration: reduced ? 0 : 1.25,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !reduced,
      touchMultiplier: 1.6,
    });

    lenisRef.current = lenis;

    if (process.env.NODE_ENV !== "production") {
      (window as unknown as { __lenis: Lenis }).__lenis = lenis;
    }

    lenis.on("scroll", (e: { velocity: number; progress: number }) => {
      scene.progress = e.progress;
      // Normalise against a fast-but-plausible flick so the GPU sees 0..1.
      const v = Math.min(Math.abs(e.velocity) / 45, 1);
      scene.velocity += (v - scene.velocity) * 0.2;
      ScrollTrigger.update();
    });

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return null;
}
