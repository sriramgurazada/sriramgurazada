"use client";

import { useEffect, useRef } from "react";
import { registerFrame } from "@/lib/frame-scheduler";

/**
 * A photographic frame that may contain one small, isolated piece of movement.
 *
 * The contract, which the CSS in globals.css enforces rather than trusting each
 * effect to honour:
 *
 *  - the photograph is a plain <img> underneath, and it is what a visitor sees
 *    if the effect never starts, is paused, or is turned off entirely;
 *  - the effect is an additional layer marked [data-ambient], so it is
 *    decorative by construction and cannot move the photograph itself;
 *  - it only runs while this is the one frame the scheduler has chosen, the tab
 *    is visible, motion is Full, nothing is paused and no viewer is open.
 *
 * Effects live inside `effect`, which is hidden from assistive technology —
 * there is nothing in it that is not already in the photograph's alt text.
 */
export default function LivingFrame({
  children,
  effect,
  className = "",
}: {
  children: React.ReactNode;
  effect?: React.ReactNode;
  className?: string;
}) {
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = frame.current;
    if (!element || !effect) return;
    return registerFrame(element);
  }, [effect]);

  return (
    <div
      ref={frame}
      data-living-frame=""
      data-active="false"
      className={`relative overflow-hidden ${className}`}
    >
      {children}
      {effect && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {effect}
        </div>
      )}
    </div>
  );
}
