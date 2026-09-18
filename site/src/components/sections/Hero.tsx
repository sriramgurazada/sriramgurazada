"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { scene, setTheme } from "@/lib/scene";
import { HERO_PLATE } from "@/lib/plates";
import { identity, prologue, chapters } from "@/data/content";

const TITLE = identity.titleCard.split("");

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // The hero owns plate 0 and the opening grade.
      scene.plateA = HERO_PLATE;
      scene.plateB = HERO_PLATE;
      scene.plateMix = 0;
      setTheme(chapters[0].theme);

      const matte = { value: 1 };
      const setMatte = (v: number) =>
        document.documentElement.style.setProperty("--letterbox", String(v));
      setMatte(1);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          onUpdate: (self) => {
            scene.expansion = self.progress;
            scene.push = self.progress;
            scene.intensity = 0.35 + self.progress * 0.5;
            // A brief schematic pass right as the frame opens up.
            const p = self.progress;
            scene.reveal = p > 0.42 && p < 0.72 ? Math.sin(((p - 0.42) / 0.3) * Math.PI) * 0.55 : 0;
          },
        },
      });

      // Beat one: the prologue, still matted.
      tl.to("[data-prologue-line]", {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.8,
        ease: "power2.out",
      })
        .to("[data-prologue-line]", { opacity: 0, duration: 0.6, ease: "power2.in" }, ">0.4")

        // Beat two: the matte retracts and the title takes the whole frame.
        // Deliberately abrupt — the frame opening is the point, not a detail.
        .to(
          matte,
          {
            value: 0,
            duration: 1.4,
            ease: "power3.inOut",
            onUpdate: () => setMatte(matte.value),
          },
          "expand"
        )
        .fromTo(
          "[data-title-char]",
          { opacity: 0, yPercent: 60, filter: "blur(18px)" },
          {
            opacity: 1,
            yPercent: 0,
            filter: "blur(0px)",
            duration: 1.1,
            stagger: 0.06,
            ease: "power3.out",
          },
          "expand"
        )
        .fromTo(
          "[data-title-block]",
          { scale: 0.72 },
          { scale: 1, duration: 1.6, ease: "power3.out" },
          "expand"
        )
        .fromTo(
          "[data-ratio-to]",
          { opacity: 0, x: -8 },
          { opacity: 1, x: 0, duration: 0.5 },
          "expand+=0.9"
        )
        .to("[data-ratio-from]", { opacity: 0.3, duration: 0.5 }, "expand+=0.9")

        // Beat three: hold, then hand over to chapter one.
        .fromTo(
          "[data-hero-meta]",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 },
          ">-0.4"
        )
        .to({}, { duration: 1 });

      return () => {
        setMatte(0);
      };
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative h-[360vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-between overflow-hidden px-6 py-[13vh] sm:px-10">
        <div className="hud flex items-center justify-between">
          <span>Prologue</span>
          <span className="flex items-center gap-3">
            <span data-ratio-from>2.39 : 1</span>
            <span data-ratio-to className="text-[var(--accent)]" style={{ opacity: 0 }}>
              1.43 : 1 · Full Frame
            </span>
          </span>
        </div>

        <div className="relative flex flex-1 flex-col items-center justify-center text-center">
          {/* The prologue sits in the matted frame and clears before the title. */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            {prologue.lines.map((line) => (
              <p
                key={line}
                data-prologue-line
                className="font-display text-xl tracking-wide text-bone/80 opacity-0 sm:text-3xl"
                style={{ transform: "translateY(18px)" }}
              >
                {line}
              </p>
            ))}
          </div>

          <div data-title-block className="relative flex flex-col items-center gap-5">
            <span className="hud text-[0.55rem] sm:text-[0.65rem]">
              Devi Venkata Sai Sriram Chandra
            </span>
            <h1 className="title-epic metal flex text-[19vw] leading-[0.8] sm:text-[15vw]">
              {TITLE.map((char, i) => (
                <span key={`${char}-${i}`} data-title-char className="inline-block">
                  {char}
                </span>
              ))}
            </h1>
            <span className="hud text-[0.55rem] sm:text-[0.65rem]">{identity.subtitle}</span>
          </div>
        </div>

        <div className="hud flex items-center justify-between">
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
