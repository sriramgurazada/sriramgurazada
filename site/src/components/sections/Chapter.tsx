"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { scene, setTheme } from "@/lib/scene";
import { chapterPlate } from "@/lib/plates";
import type { Chapter as ChapterType } from "@/data/content";

type Props = {
  chapter: ChapterType;
  index: number;
};

export default function Chapter({ chapter, index }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const plate = chapterPlate(index);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Dissolve the previous plate into this one on approach.
      gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top 90%",
          end: "top 20%",
          scrub: true,
          onUpdate: (self) => {
            scene.plateA = plate - 1;
            scene.plateB = plate;
            scene.plateMix = self.progress;
          },
          onEnter: () => setTheme(chapter.theme),
          onEnterBack: () => setTheme(chapter.theme),
        },
      });

      // Per-chapter camera behaviour across the pinned run.
      gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            const p = self.progress;
            scene.chapterIndex = index;
            scene.push = p;
            scene.parallax = (p - 0.5) * 1.4;
            scene.intensity = 0.3 + Math.sin(p * Math.PI) * 0.55;
            // The schematic pass peaks while the pattern caption is on screen,
            // then settles back to a readable photograph under the work list.
            scene.reveal =
              p < 0.18 ? 0 : p < 0.52 ? Math.sin(((p - 0.18) / 0.34) * Math.PI) * 0.92 : 0.12;
            // Dim the plate once the text panel takes over the frame.
            scene.exposure = p > 0.5 ? 0.62 : 1;
          },
        },
      });

      // Beat one — the era card.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "22% top",
            scrub: 1,
          },
        })
        .fromTo(
          "[data-era-line]",
          { opacity: 0, yPercent: 120 },
          { opacity: 1, yPercent: 0, duration: 1, stagger: 0.12, ease: "power3.out" }
        )
        .to({}, { duration: 0.6 })
        .to("[data-era-card]", {
          opacity: 0,
          yPercent: -18,
          filter: "blur(10px)",
          duration: 0.9,
          ease: "power2.in",
        });

      // Beat two — the pattern caption, timed to the schematic peak.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "24% top",
            end: "48% top",
            scrub: 1,
          },
        })
        .fromTo(
          "[data-plate-note]",
          { opacity: 0, y: 24, filter: "blur(12px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power2.out" }
        )
        .to({}, { duration: 1 })
        .to("[data-plate-note]", { opacity: 0, y: -20, duration: 0.8, ease: "power2.in" });

      // Beat three — the work.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "50% top",
            end: "bottom bottom",
            scrub: 1,
          },
        })
        .fromTo(
          "[data-work-panel]",
          { opacity: 0, x: 60 },
          { opacity: 1, x: 0, duration: 1, ease: "power3.out" }
        )
        .fromTo(
          "[data-work]",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.35, ease: "power2.out" },
          "-=0.6"
        )
        .fromTo(
          "[data-credit]",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 },
          "-=0.4"
        );
    }, root);

    return () => ctx.revert();
  }, [chapter, index, plate]);

  return (
    <section ref={root} id={chapter.id} className="relative h-[460vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Scrim: keeps type legible without flattening the photograph. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-ink/70 via-transparent to-ink/80"
        />

        <div className="relative flex h-full flex-col justify-between px-6 py-[13vh] sm:px-10">
          <div className="hud flex items-center justify-between">
            <span>
              Chapter {chapter.numeral} — {chapter.title}
            </span>
            <span className="hidden text-right sm:inline">{chapter.era}</span>
          </div>

          <div className="relative flex flex-1 items-center">
            {/* Beat one */}
            <div
              data-era-card
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
            >
              <div className="overflow-hidden">
                <p data-era-line className="hud mb-6">
                  {chapter.stamp}
                </p>
              </div>
              <div className="overflow-hidden">
                <h2
                  data-era-line
                  className="title-epic text-[17vw] leading-[0.82] text-bone sm:text-[13vw]"
                >
                  {chapter.title}
                </h2>
              </div>
              <div className="overflow-hidden">
                <p
                  data-era-line
                  className="mt-8 max-w-2xl text-balance text-sm leading-relaxed text-bone/70 sm:text-base"
                >
                  {chapter.logline}
                </p>
              </div>
            </div>

            {/* Beat two */}
            <div
              data-plate-note
              className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0"
            >
              <p className="max-w-3xl text-balance text-center font-mono text-base leading-relaxed tracking-tight text-bone sm:text-2xl">
                <span className="text-[var(--accent)]">/ </span>
                {chapter.plateNote}
              </p>
            </div>

            {/* Beat three */}
            <div
              data-work-panel
              className="ml-auto w-full max-w-xl opacity-0 sm:w-[55%]"
            >
              <div className="max-h-[62vh] space-y-7 overflow-hidden">
                {chapter.works.map((work) => (
                  <article key={work.title} data-work className="opacity-0">
                    <div className="mb-1.5 flex items-baseline justify-between gap-4">
                      <h3 className="font-display text-lg leading-tight text-bone sm:text-xl">
                        {work.title}
                      </h3>
                      <span className="hud shrink-0 text-[0.6rem]">{work.role}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-bone/65">{work.body}</p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                      {work.stack.map((tech) => (
                        <span key={tech} className="hud text-[0.55rem] tracking-[0.2em]">
                          {tech}
                        </span>
                      ))}
                      {work.href && (
                        <a
                          href={work.href}
                          target="_blank"
                          rel="noreferrer"
                          className="hud pointer-events-auto text-[0.55rem] tracking-[0.2em] text-[var(--accent)] underline decoration-from-font underline-offset-4 transition-opacity hover:opacity-70"
                        >
                          {work.hrefLabel} ↗
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-10 gap-y-2">
            {chapter.credits.map((credit) => (
              <div key={credit.label} data-credit className="opacity-0">
                <p className="hud text-[0.55rem]">{credit.label}</p>
                <p className="font-display text-base text-[var(--accent)] sm:text-lg">
                  {credit.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
