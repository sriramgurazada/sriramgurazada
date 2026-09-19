"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { scene, setTheme } from "@/lib/scene";
import { chapterPlate } from "@/lib/plates";
import type { Chapter as ChapterType, Credit, Work } from "@/data/raw";

type Props = {
  chapter: ChapterType;
  index: number;
};

/** Soft top and bottom edges for a work list long enough to scroll. */
const EDGE_FADE =
  "linear-gradient(to bottom, transparent 0, #000 7%, #000 93%, transparent 100%)";

/**
 * Splits a leading article off a chapter title so the card can set it above
 * the noun. Titles without one fall back to a single line.
 */
function splitTitle(title: string): [string, string] {
  const [first, ...rest] = title.split(" ");
  if (rest.length && /^(the|a|an)$/i.test(first)) return [first, rest.join(" ")];
  return ["", title];
}

/**
 * One piece of work. Rendered twice per chapter — once inside the pinned
 * frame for wide screens, once in normal flow for narrow ones — and hidden
 * by breakpoint, so only one copy is ever on screen.
 */
function WorkEntry({ work }: { work: Work }) {
  return (
    <article data-work className="opacity-0">
      <div className="mb-1.5 flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <h3 className="font-display text-lg leading-tight text-bone sm:text-xl">{work.title}</h3>
        <span className="hud shrink-0 text-[0.5rem] sm:text-[0.6rem]">{work.role}</span>
      </div>
      <p className="text-sm leading-relaxed text-bone/65">{work.body}</p>
      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
        {work.stack.map((tech) => (
          <span key={tech} className="hud text-[0.5rem] sm:text-[0.55rem]">
            {tech}
          </span>
        ))}
        {work.href && (
          <a
            href={work.href}
            target="_blank"
            rel="noreferrer"
            className="hud pointer-events-auto text-[0.5rem] text-[var(--accent)] underline decoration-from-font underline-offset-4 transition-opacity hover:opacity-70 sm:text-[0.55rem]"
          >
            {work.hrefLabel} ↗
          </a>
        )}
      </div>
    </article>
  );
}

function CreditEntry({ credit }: { credit: Credit }) {
  return (
    <div data-credit className="opacity-0">
      <p className="hud text-[0.5rem] sm:text-[0.55rem]">{credit.label}</p>
      <p className="font-display text-sm leading-tight text-[var(--accent)] sm:text-lg">
        {credit.value}
      </p>
    </div>
  );
}

export default function Chapter({ chapter, index }: Props) {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const flow = useRef<HTMLDivElement>(null);
  const window_ = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const plate = chapterPlate(index);
  // "The Gate" is set as a small "The" over a large "Gate".
  const [article, noun] = splitTitle(chapter.title);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Dissolve the previous plate into this one on approach.
      gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top 90%",
          end: "top 20%",
          scrub: true,
          // Guarded on isActive: ScrollTrigger also fires onUpdate during
          // refresh, and an off-screen section must not redress the stage.
          onUpdate: (self) => {
            if (!self.isActive) return;
            scene.plateA = plate - 1;
            scene.plateB = plate;
            scene.plateMix = self.progress;
          },
          onEnter: () => setTheme(chapter.theme),
          onEnterBack: () => setTheme(chapter.theme),
          // Pin the dissolve to a definite end state on the way past, so a fast
          // scroll cannot strand it part-way through.
          onLeave: () => {
            scene.plateA = plate - 1;
            scene.plateB = plate;
            scene.plateMix = 1;
          },
          onLeaveBack: () => {
            scene.plateA = plate - 1;
            scene.plateB = plate;
            scene.plateMix = 0;
          },
        },
      });

      const mm = gsap.matchMedia();

      mm.add(
        { isWide: "(min-width: 640px)", isNarrow: "(max-width: 639px)" },
        (context) => {
          const { isWide } = context.conditions as { isWide: boolean; isNarrow: boolean };

          // The frame is longer on wide screens because the work list rides
          // inside it; on narrow screens it ends after the pattern caption.
          // These are percentages of frame height, but only the portion past
          // one viewport actually scrubs, so the narrow values are pulled in
          // to keep both beats inside the shorter run.
          const eraEnd = isWide ? "22% top" : "26% top";
          const noteStart = isWide ? "24% top" : "30% top";
          const noteEnd = isWide ? "48% top" : "56% top";

          // Per-chapter camera behaviour across the pinned run.
          gsap.timeline({
            scrollTrigger: {
              trigger: frame.current,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
              onUpdate: (self) => {
                if (!self.isActive) return;
                const p = self.progress;
                scene.chapterIndex = index;
                scene.push = p;
                scene.parallax = (p - 0.5) * 1.4;
                scene.intensity = 0.3 + Math.sin(p * Math.PI) * 0.55;
                // The schematic pass peaks while the pattern caption is on
                // screen, then settles back to a readable photograph.
                scene.reveal =
                  p < 0.18 ? 0 : p < 0.52 ? Math.sin(((p - 0.18) / 0.34) * Math.PI) * 0.85 : 0.08;
                // Wide screens dim once the text panel takes over the frame.
                // Narrow screens have no panel here, so the plate stays open.
                scene.exposure = isWide && p > 0.5 ? 0.55 : 1;
              },
              // Settle on the end state when the guard above stops firing, so a
              // value cannot be stranded mid-curve at a section boundary.
              onLeave: () => {
                scene.reveal = 0.08;
                scene.exposure = isWide ? 0.55 : 1;
                scene.push = 1;
              },
              onLeaveBack: () => {
                scene.reveal = 0;
                scene.exposure = 1;
                scene.push = 0;
              },
            },
          });

          // Beat one — the era card.
          gsap
            .timeline({
              scrollTrigger: {
                trigger: frame.current,
                start: "top top",
                end: eraEnd,
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
                trigger: frame.current,
                start: noteStart,
                end: noteEnd,
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

          if (isWide) {
            // Beat three — the work, arriving over the second half of the
            // pinned run and then travelling through it. The panel is a
            // fixed window; the track behind it is as tall as the list needs
            // to be, and scrubs upward so nothing is ever cut off. The
            // distance is a function value so a resize recomputes it.
            const overflow = () => {
              const t = track.current;
              const w = window_.current;
              return t && w ? t.scrollHeight - w.clientHeight : 0;
            };

            const travel = () => {
              const over = overflow();
              // A few pixels past the end so the final entry clears the edge
              // rather than sitting flush against it.
              return over > 1 ? -(over + 14) : 0;
            };

            // Only a list long enough to travel gets soft edges, so that an
            // entry leaving the window dissolves instead of being sliced
            // through the middle of its letterforms. A list that already fits
            // would just have its first and last lines faded for no reason.
            const win = window_.current;
            if (win && overflow() > 1) {
              win.style.maskImage = EDGE_FADE;
              win.style.webkitMaskImage = EDGE_FADE;
            }

            gsap
              .timeline({
                scrollTrigger: {
                  trigger: frame.current,
                  start: "50% top",
                  end: "bottom bottom",
                  scrub: 1,
                  invalidateOnRefresh: true,
                },
              })
              .fromTo("[data-work-scrim]", { opacity: 0 }, { opacity: 1, duration: 1 }, 0)
              .fromTo(
                "[data-work-panel]",
                { opacity: 0, x: 60 },
                { opacity: 1, x: 0, duration: 1, ease: "power3.out" },
                0
              )
              .fromTo(
                "[data-work-panel] [data-work]",
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.18, ease: "power2.out" },
                0.4
              )
              .fromTo(
                "[data-credit-row] [data-credit]",
                { opacity: 0, y: 16 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 },
                1.2
              )
              .fromTo(
                "[data-work-track]",
                { y: 0 },
                { y: travel, ease: "none", duration: 3.2 },
                2.2
              )
              // A beat of stillness on the last entry before the pin releases.
              .to({}, { duration: 0.7 });

            return () => {
              if (!win) return;
              win.style.maskImage = "";
              win.style.webkitMaskImage = "";
            };
          } else {
            // Narrow screens read the work as a scrolling list, so each entry
            // gets its own trigger instead of one shared stagger.
            gsap.utils
              .toArray<HTMLElement>("[data-work-flow] [data-work], [data-work-flow] [data-credit]")
              .forEach((el) => {
                gsap.fromTo(
                  el,
                  { opacity: 0, y: 28 },
                  {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    ease: "power2.out",
                    scrollTrigger: { trigger: el, start: "top 88%" },
                  }
                );
              });

            // Pull the plate down behind the list so the type stays readable.
            gsap.timeline({
              scrollTrigger: {
                trigger: flow.current,
                start: "top 72%",
                end: "bottom top",
                scrub: true,
                onUpdate: (self) => {
                  if (!self.isActive) return;
                  scene.chapterIndex = index;
                  scene.exposure = 0.42;
                  scene.reveal = 0.05;
                  scene.intensity = 0.24;
                },
              },
            });
          }
        }
      );

      return () => mm.revert();
    }, root);

    return () => ctx.revert();
  }, [chapter, index, plate]);

  return (
    <section ref={root} id={chapter.id} className="relative">
      {/* The scrubbed frame. On wide screens it carries the whole chapter; on
          narrow ones it stops after the pattern caption, because four work
          entries cannot be read inside a single phone viewport. */}
      <div ref={frame} className="relative h-[260vh] sm:h-[460vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Scrims: keep type legible without flattening the photograph. The
              second one only arrives with the work panel, which sits over the
              busiest part of the schematic. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/30 to-ink/85"
          />
          <div
            data-work-scrim
            aria-hidden
            className="absolute inset-y-0 right-0 hidden w-[72%] bg-gradient-to-l from-ink via-ink/90 to-transparent opacity-0 sm:block"
          />

          <div className="relative flex h-full flex-col justify-between px-6 py-[13vh] sm:px-10">
            <div className="hud flex items-center justify-between gap-4">
              <span className="truncate">
                Chapter {chapter.numeral} — {chapter.title}
              </span>
              <span className="hidden shrink-0 text-right sm:inline">{chapter.era}</span>
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
                {/* Set as an article over a noun rather than one long line.
                    Otherwise "The Archive" wraps and "The Gate" does not, and
                    a run of title cards that break differently every time
                    reads as an accident. */}
                <h2 className="title-epic text-bone">
                  {article && (
                    <span className="block overflow-hidden">
                      <span
                        data-era-line
                        className="block text-[4.5vw] leading-none text-bone/50 sm:text-[2.6vw]"
                        style={{ letterSpacing: "0.34em", textIndent: "0.34em" }}
                      >
                        {article}
                      </span>
                    </span>
                  )}
                  <span className="block overflow-hidden">
                    <span
                      data-era-line
                      className="mt-2 block text-[16vw] leading-[0.84] sm:mt-3 sm:text-[16.5vw]"
                    >
                      {noun}
                    </span>
                  </span>
                </h2>
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

              {/* Beat three, wide screens only. The right margin keeps the
                  panel clear of the chapter rail pinned to the window edge. */}
              <div
                data-work-panel
                className="ml-auto hidden w-[55%] max-w-xl opacity-0 sm:mr-24 sm:block lg:mr-28"
              >
                <div ref={window_} className="max-h-[62vh] overflow-hidden">
                  <div ref={track} data-work-track className="space-y-7">
                    {chapter.works.map((work) => (
                      <WorkEntry key={work.title} work={work} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div data-credit-row className="hidden flex-wrap items-center gap-x-10 gap-y-2 sm:flex">
              {chapter.credits.map((credit) => (
                <CreditEntry key={credit.label} credit={credit} />
              ))}
            </div>

            {/* Narrow screens lose the credit row, so the era stamp and the
                cue to keep scrolling take its place. */}
            <div className="flex items-center justify-between gap-4 sm:hidden">
              <span className="hud">{chapter.era}</span>
              <span className="hud text-[var(--accent)]">The work ↓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Beat three, narrow screens: the work in normal flow, over a scrim
          thin enough to leave the plate visible behind it. */}
      <div
        ref={flow}
        data-work-flow
        className="relative z-10 bg-ink/85 px-6 pb-[12vh] pt-[9vh] backdrop-blur-sm sm:hidden"
      >
        <p className="hud mb-9">
          Chapter {chapter.numeral} — Selected Work
        </p>

        <div className="space-y-10">
          {chapter.works.map((work) => (
            <WorkEntry key={work.title} work={work} />
          ))}
        </div>

        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-white/10 pt-8">
          {chapter.credits.map((credit) => (
            <CreditEntry key={credit.label} credit={credit} />
          ))}
        </div>
      </div>
    </section>
  );
}
