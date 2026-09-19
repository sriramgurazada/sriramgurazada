"use client";

import { useMotion } from "@/components/horizon/MotionProvider";

/**
 * The two motion controls the site is required to expose.
 *
 * They are separate on purpose, because they answer different questions.
 * Reduced is "do not show me this kind of thing at all" and swaps in the
 * static composition. Pause is "stop, I am reading" and freezes whatever is
 * currently on screen. Collapsing them into one switch would lose one of the
 * two behaviours.
 */
export default function MotionControls({ className = "" }: { className?: string }) {
  const { motion, paused, setMotion, togglePaused } = useMotion();
  const reduced = motion === "reduced";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={togglePaused}
        // The button's own label already says what it does, so the state is
        // announced rather than duplicated into an aria-label.
        aria-pressed={paused}
        className="min-h-11 rounded-full border border-white/15 px-4 text-[0.6875rem] tracking-[0.14em] uppercase text-muted transition-colors duration-200 hover:border-route/60 hover:text-ivory aria-pressed:border-route/60 aria-pressed:text-route sm:min-h-0 sm:py-2"
      >
        {paused ? "Resume motion" : "Pause motion"}
      </button>

      <button
        type="button"
        onClick={() => setMotion(reduced ? "full" : "reduced")}
        aria-pressed={reduced}
        className="min-h-11 rounded-full border border-white/15 px-4 text-[0.6875rem] tracking-[0.14em] uppercase text-muted transition-colors duration-200 hover:border-route/60 hover:text-ivory aria-pressed:border-route/60 aria-pressed:text-route sm:min-h-0 sm:py-2"
      >
        Motion: {reduced ? "Reduced" : "Full"}
      </button>
    </div>
  );
}
