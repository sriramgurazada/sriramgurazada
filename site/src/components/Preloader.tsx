"use client";

import { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";
import { gsap } from "@/lib/gsap";
import { lockScroll, unlockScroll } from "@/lib/lenis";
import { markStageReady } from "@/lib/boot";
import { identity } from "@/data/raw";

const MIN_DURATION = 1800; // Let the count actually read as a count.
const MAX_DURATION = 12000; // Never trap the visitor behind a stalled texture.

export default function Preloader() {
  const { progress, loaded, total } = useProgress();
  const [display, setDisplay] = useState(0);
  const [done, setDone] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
    lockScroll();
    const hardStop = setTimeout(() => setDone(true), MAX_DURATION);
    return () => clearTimeout(hardStop);
  }, []);

  // Ease the readout toward real progress so it never snaps to 100.
  useEffect(() => {
    let frame = 0;
    const tick = () => {
      setDisplay((current) => {
        const elapsed = Date.now() - startedAt.current;
        const timeCeiling = Math.min(elapsed / MIN_DURATION, 1) * 100;
        const realTarget = total > 0 ? progress : 0;
        const target = Math.min(realTarget, timeCeiling);
        const next = current + (target - current) * 0.08;
        if (next > 99.4 && target >= 99.9) {
          setDone(true);
          return 100;
        }
        return next;
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [progress, total]);

  useEffect(() => {
    if (bar.current) bar.current.style.transform = `scaleX(${display / 100})`;
  }, [display]);

  useEffect(() => {
    if (!done || !root.current) return;
    const el = root.current;
    const tl = gsap.timeline({
      onComplete: () => {
        unlockScroll();
        el.style.display = "none";
      },
    });
    tl.to(el.querySelectorAll("[data-fade]"), {
      opacity: 0,
      y: -14,
      duration: 0.5,
      stagger: 0.05,
      ease: "power2.in",
    })
      .to(el, { opacity: 0, duration: 0.8, ease: "power2.inOut" }, "-=0.2")
      .add(markStageReady, "-=0.5");
    return () => {
      tl.kill();
    };
  }, [done]);

  const shown = Math.min(99, Math.floor(display));
  const label = done ? "100" : String(shown).padStart(2, "0");

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink px-6 py-8 sm:px-10 sm:py-10"
    >
      <div data-fade className="hud flex items-center justify-between">
        <span>{identity.shortName}</span>
        <span className="hidden sm:inline">Los Angeles</span>
      </div>

      <div data-fade className="flex flex-col items-center gap-6">
        <span className="hud">Uploading plates</span>
        <div className="flex items-baseline gap-2 font-mono tabular-nums">
          <span className="text-[18vw] leading-none font-light text-bone sm:text-[12vw]">
            {label}
          </span>
          <span className="text-ash text-xl">%</span>
        </div>
        <div className="h-px w-56 overflow-hidden bg-white/12 sm:w-80">
          <div
            ref={bar}
            className="h-full w-full origin-left bg-[var(--accent)]"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>

      <div data-fade className="hud flex items-center justify-between">
        <span>
          {loaded} / {Math.max(total, 1)} frames
        </span>
        <span>Best with sound of your own choosing</span>
      </div>
    </div>
  );
}
