"use client";

import { useEffect, useRef, useState } from "react";
import { scene } from "@/lib/scene";
import { chapters } from "@/data/content";

/**
 * A permanent readout of where you are in the reel: a progress rule down the
 * left edge and the chapter numerals down the right.
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

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[52] hidden h-screen w-px bg-white/10 sm:block"
      >
        <div
          ref={rule}
          className="h-full w-full origin-top bg-[var(--accent)]"
          style={{ transform: "scaleY(0)" }}
        />
      </div>

      <nav
        aria-label="Chapters"
        className="fixed right-4 top-1/2 z-[52] hidden -translate-y-1/2 flex-col gap-4 sm:flex"
      >
        {chapters.map((chapter, i) => (
          <a
            key={chapter.id}
            href={`#${chapter.id}`}
            className="group flex items-center justify-end gap-3"
            title={chapter.title}
          >
            <span
              className={`hud text-[0.55rem] transition-all duration-500 ${
                active === i
                  ? "text-[var(--accent)] opacity-100"
                  : "opacity-0 group-hover:opacity-60"
              }`}
            >
              {chapter.title}
            </span>
            <span
              className={`block h-px transition-all duration-500 ${
                active === i ? "w-7 bg-[var(--accent)]" : "w-3 bg-white/30 group-hover:w-5"
              }`}
            />
          </a>
        ))}
      </nav>
    </>
  );
}
