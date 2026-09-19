"use client";

import { useEffect, useRef } from "react";
import { useMotion } from "@/components/horizon/MotionProvider";

/** The part of a ScrollTrigger the Pause control needs, without importing gsap. */
type Pausable = { disable: (revert: boolean) => void; enable: (reset: boolean) => void };

/**
 * The one signature transformation: the photographic overlook resolving into
 * the line drawing that was hiding in it.
 *
 * It is scrubbed against scroll, and the travel it is scrubbed against is the
 * hero section's extra height, which CSS grants only to eligible desktops. That
 * has a useful consequence: where the effect is not wanted there is no extra
 * scrolling to explain, and this component finds nothing to animate over and
 * leaves the static composition alone. Nothing here decides eligibility.
 *
 * Progress bands follow the specification exactly:
 *
 *   0.00–0.20  hold the horizon
 *   0.20–0.45  trace the route, introduce contours
 *   0.45–0.70  crossfade into the contours
 *   0.70–0.90  settle, and hand over to the work rows arriving underneath
 *   0.90–1.00  release into ordinary reading
 */
export default function HeroMotion() {
  const { motion, paused } = useMotion();
  const trigger = useRef<Pausable | null>(null);

  useEffect(() => {
    if (motion === "reduced") return;

    const section = document.querySelector<HTMLElement>("[data-hero]");
    const stage = document.querySelector<HTMLElement>("[data-hero-stage]");
    if (!section || !stage) return;

    // Eligibility is already decided by the section's height, so this only has
    // to notice whether there is any travel to scrub against. Checking the
    // layout rather than re-testing the media queries means the two can never
    // disagree — and doing it before the import below is what keeps gsap off
    // phones and off any machine asking for reduced motion.
    if (section.offsetHeight - stage.offsetHeight < window.innerHeight * 0.5) return;

    let revert: (() => void) | undefined;
    let cancelled = false;

    void import("@/lib/gsap").then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;

      const context = gsap.context(() => {
        const route = section.querySelector<SVGPathElement>("[data-route-path]");
        const length = route?.getTotalLength() ?? 0;

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            // The specification allows at most 0.15s of smoothing. Direct
            // progress with a touch of catch-up, not eased animation.
            scrub: 0.15,
            invalidateOnRefresh: true,
          },
        });

        // 0.00–0.70 · Hold. The scale ceiling is 1.035 and this reaches exactly
        // that, slowly, so the horizon reads as held rather than as pushing in.
        timeline.fromTo("[data-hero-photo]", { scale: 1 }, { scale: 1.035, duration: 0.7 }, 0);

        // 0.00–0.45 · Depth separation. 24px total between the copy and the
        // photograph behind it, which is the top of the allowed 8–24px range and
        // the most that still reads as one composition.
        timeline
          .fromTo("[data-hero-copy]", { y: 0 }, { y: -16, duration: 0.45 }, 0)
          .fromTo("[data-hero-photo]", { y: 0 }, { y: 8, duration: 0.45 }, 0);

        // 0.20–0.45 · The route traces itself, and the contours arrive behind it.
        if (route && length > 0) {
          timeline.fromTo(
            route,
            { strokeDasharray: length, strokeDashoffset: length },
            { strokeDashoffset: 0, duration: 0.25 },
            0.2
          );
        }
        timeline
          .fromTo("[data-diagram-contours]", { opacity: 0 }, { opacity: 0.34, duration: 0.25 }, 0.2)
          .fromTo(
            "[data-route-node]",
            { opacity: 0, scale: 0.4 },
            { opacity: 1, scale: 1, duration: 0.2, stagger: 0.06 },
            0.3
          );

        // 0.45–0.70 · The crossfade. The photograph recedes and the contours
        // become the drawing, with the route's endpoints untouched throughout.
        timeline
          .to("[data-diagram-contours]", { opacity: 0.92, duration: 0.25 }, 0.45)
          .to("[data-hero-photo]", { opacity: 0.3, duration: 0.25 }, 0.45);

        // 0.70–0.90 · Settle, then step aside for the work rows scrolling up
        // underneath. The copy leaves; the route stays, because it continues
        // beside those rows.
        timeline
          .to("[data-diagram-contours]", { opacity: 0.5, duration: 0.2 }, 0.7)
          .to("[data-hero-copy]", { opacity: 0, y: -48, duration: 0.2 }, 0.7)
          .to("[data-hero-stage]", { opacity: 0, duration: 0.1 }, 0.9);

        trigger.current = timeline.scrollTrigger ?? null;
        // The import resolves after the Pause effect below has already run, so
        // the attribute — which is where the preference actually lives — is read
        // once more here to catch a visitor who arrived with motion paused.
        if (document.documentElement.dataset.paused === "true") trigger.current?.disable(false);
      }, section);

      /**
       * Bounds are measured from laid-out pixels, and the layout is not final
       * until the web font has swapped in and the hero photograph has decoded.
       * Without this the sequence is scrubbed against a stale section height and
       * finishes early.
       */
      const refresh = () => ScrollTrigger.refresh();
      void document.fonts?.ready.then(refresh);
      const images = Array.from(section.querySelectorAll("img"));
      void Promise.all(images.map((image) => image.decode().catch(() => undefined))).then(refresh);

      revert = () => context.revert();
    });

    return () => {
      cancelled = true;
      trigger.current = null;
      revert?.();
    };
  }, [motion]);

  /**
   * Pause freezes the composition where it is rather than reverting it, which
   * is the difference between the Pause control and the Reduced preference.
   * Disabling without reverting leaves every animated value exactly as the
   * visitor last saw it.
   */
  useEffect(() => {
    if (!trigger.current) return;
    if (paused) trigger.current.disable(false);
    else trigger.current.enable(false);
  }, [paused]);

  return null;
}
