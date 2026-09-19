"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { scene } from "@/lib/scene";
import { rememberMode } from "@/components/horizon/MotionProvider";
import { chapters } from "@/data/raw";

/**
 * Raw mode's only interface.
 *
 * Deliberately almost nothing: a progress rule down the left edge, the current
 * chapter named at the top, and one way out. The chapter jump links this used to
 * carry are gone — the whole point of a reel is that it plays, and a rail of
 * shortcuts down the edge of the frame argues with that. The readable site is
 * where navigation belongs.
 */
export default function HUD() {
  const [active, setActive] = useState(-1);
  const rule = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      if (rule.current) {
        rule.current.style.transform = `scaleY(${scene.progress})`;
      }
      setActive((current) => (current === scene.chapterIndex ? current : scene.chapterIndex));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const chapter = chapters[active];

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-52 hidden h-screen w-px bg-white/10 sm:block"
      >
        <div
          ref={rule}
          className="h-full w-full origin-top bg-[var(--accent)]"
          style={{ transform: "scaleY(0)" }}
        />
      </div>

      {/* A readout, not a control. It reports where the reel is. */}
      <p
        aria-live="polite"
        className="hud pointer-events-none fixed top-5 left-1/2 z-52 hidden -translate-x-1/2 whitespace-nowrap sm:block"
      >
        {chapter ? (
          <>
            <span className="text-[var(--accent)]">{chapter.numeral}</span>
            <span className="mx-2 opacity-40">/</span>
            {chapter.title}
          </>
        ) : (
          "Prologue"
        )}
      </p>

      <Link
        href="/"
        onClick={() => rememberMode("tech")}
        className="hud fixed top-4 right-4 z-52 flex min-h-11 items-center rounded-full border border-white/15 px-4 text-bone/70 transition-colors duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)] sm:top-5 sm:right-6"
      >
        Switch to normal
      </Link>
    </>
  );
}
