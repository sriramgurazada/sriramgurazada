"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { scene, setTheme } from "@/lib/scene";
import { HERO_PLATE } from "@/lib/plates";
import { onStageReady } from "@/lib/boot";
import { identity, prologue, chapters } from "@/data/content";

const TITLE = identity.titleCard.split("");

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // The hero owns plate 0, the opening grade, and the matted frame.
      scene.plateA = HERO_PLATE;
      scene.plateB = HERO_PLATE;
      scene.plateMix = 0;
      scene.exposure = 1;
      scene.reveal = 0;
      scene.intensity = 0.45;
      scene.expansion = 0;
      setTheme(chapters[0].theme);

      // Entrance: the title is already on screen when the page is handed over,
      // so the landing state is the poster rather than an empty frame.
      const intro = gsap.timeline({ paused: true });
      intro
        .fromTo(
          "[data-title-char]",
          { opacity: 0, yPercent: 115, filter: "blur(22px)" },
          {
            opacity: 1,
            yPercent: 0,
            filter: "blur(0px)",
            duration: 1.5,
            stagger: 0.08,
            ease: "power3.out",
          }
        )
        .fromTo(
          "[data-hero-sub]",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power2.out" },
          "-=0.9"
        )
        .fromTo(
          "[data-hero-meta]",
          { opacity: 0 },
          { opacity: 1, duration: 0.9, stagger: 0.12 },
          "-=0.7"
        );

      const unsubscribe = onStageReady(() => intro.play());

      // Scroll: the matte retracts (see FilmOverlay, which reads
      // scene.expansion) and the title grows into the open frame.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: (self) => {
            if (!self.isActive) return;
            const p = self.progress;
            scene.expansion = p;
            scene.push = p;
            scene.exposure = 1;
            scene.intensity = 0.45 + p * 0.4;
            scene.parallax = p * 0.5;
            // A short schematic pass as the frame reaches full width.
            scene.reveal =
              p > 0.46 && p < 0.78 ? Math.sin(((p - 0.46) / 0.32) * Math.PI) * 0.6 : 0;
          },
          // Leave the frame fully open rather than stranded mid-retraction.
          onLeave: () => {
            scene.expansion = 1;
            scene.push = 1;
            scene.reveal = 0;
          },
          onLeaveBack: () => {
            scene.expansion = 0;
            scene.push = 0;
            scene.reveal = 0;
          },
        },
      });

      tl.to("[data-title-block]", { scale: 1.22, duration: 2.2, ease: "power2.out" }, 0)
        .to("[data-ratio-from]", { opacity: 0.25, duration: 0.4 }, 0.85)
        .fromTo(
          "[data-ratio-to]",
          { opacity: 0, x: -10 },
          { opacity: 1, x: 0, duration: 0.5 },
          0.85
        )
        .fromTo(
          "[data-prologue]",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          1.3
        )
        .to(
          "[data-hero-inner]",
          { opacity: 0, yPercent: -10, filter: "blur(10px)", duration: 1 },
          2.3
        );

      return unsubscribe;
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative h-[320vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-between overflow-hidden px-6 py-[13vh] sm:px-10">
        {/* The opening plate is the brightest in the reel, so the title needs
            its own pool of shadow to sit in. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-ink/70 via-transparent to-ink/75"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 45% at 50% 50%, rgba(4,4,4,0.62) 0%, rgba(4,4,4,0.28) 48%, transparent 72%)",
          }}
        />

        <div className="hud relative flex items-center justify-between gap-4">
          <span data-hero-meta>Prologue</span>
          <span className="flex items-center gap-2 sm:gap-3">
            <span data-ratio-from data-hero-meta>
              2.39 : 1
            </span>
            <span
              data-ratio-to
              className="whitespace-nowrap text-[var(--accent)]"
              style={{ opacity: 0 }}
            >
              1.43 : 1<span className="hidden sm:inline"> · Full Frame</span>
            </span>
          </span>
        </div>

        <div
          data-hero-inner
          className="relative z-10 flex flex-1 flex-col items-center justify-center text-center"
        >
          <div data-title-block className="flex flex-col items-center gap-5">
            <span data-hero-sub className="hud text-[0.55rem] sm:text-[0.65rem]">
              Devi Venkata Sai Sriram Chandra
            </span>

            {/* Sized so the title fills the frame at the *end* of the scroll,
                once the matte has retracted and the block has scaled up.
                Cinzel needs roughly 6.2em for these eight characters, so at
                rest it sits comfortably inside the 2.39:1 matte and grows
                into the open frame rather than through it. */}
            <h1 className="title-epic flex overflow-hidden text-[11vw] leading-[0.82] lg:text-[11.8vw]">
              {TITLE.map((char, i) => (
                <span key={`${char}-${i}`} data-title-char className="metal inline-block">
                  {char}
                </span>
              ))}
            </h1>

            <span data-hero-sub className="hud text-[0.55rem] sm:text-[0.65rem]">
              {identity.subtitle}
            </span>
          </div>

          <p
            data-prologue
            className="absolute bottom-0 max-w-xl text-balance font-display text-sm text-bone/60 opacity-0 sm:text-base"
          >
            {prologue.lines.join(" ")}
          </p>
        </div>

        <div className="hud relative flex items-center justify-between">
          <span data-hero-meta className="flex items-center gap-2">
            <span className="inline-block h-1 w-1 animate-pulse rounded-full bg-[var(--accent)]" />
            Scroll
          </span>
          <span data-hero-meta>Five chapters</span>
          <span data-hero-meta className="hidden sm:inline">
            {identity.location}
          </span>
        </div>
      </div>
    </section>
  );
}
