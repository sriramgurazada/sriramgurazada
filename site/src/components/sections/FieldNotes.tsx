"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { scene } from "@/lib/scene";
import { fieldNotes, fieldNotesIntro } from "@/data/content";

// Editorial rhythm: uneven spans so the grid never reads as a spec sheet.
const SPANS = [
  "sm:col-span-7 aspect-[16/10]",
  "sm:col-span-5 aspect-[4/5]",
  "sm:col-span-5 aspect-[4/5]",
  "sm:col-span-7 aspect-[16/10]",
  "sm:col-span-6 aspect-[3/2]",
  "sm:col-span-6 aspect-[3/2]",
];

export default function FieldNotes() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // The stage recedes here — this interlude is about the photographs.
      gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top 80%",
          end: "bottom top",
          scrub: true,
          // Only while genuinely on screen — see the note in Chapter.tsx.
          onUpdate: (self) => {
            if (!self.isActive) return;
            scene.exposure = 0.24;
            scene.reveal = 0;
            scene.intensity = 0.18;
          },
        },
      });

      gsap.fromTo(
        "[data-fn-head]",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-fn-head]", start: "top 85%" },
        }
      );

      // Each card wipes from photograph to line drawing as it crosses the view.
      gsap.utils.toArray<HTMLElement>("[data-note]").forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 88%" },
          }
        );

        gsap.fromTo(
          card,
          { "--wipe": "100%" },
          {
            "--wipe": "38%",
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 75%",
              end: "bottom 45%",
              scrub: 1,
            },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="field-notes"
      className="relative z-10 bg-ink/92 px-6 py-[18vh] backdrop-blur-sm sm:px-10"
    >
      <header className="mx-auto mb-16 max-w-6xl">
        <p data-fn-head className="hud mb-6">
          {fieldNotesIntro.index} / {fieldNotesIntro.label}
        </p>
        <h2
          data-fn-head
          className="font-display text-4xl leading-[1.05] tracking-tight text-bone sm:text-6xl"
        >
          {fieldNotesIntro.title}
        </h2>
        <p data-fn-head className="mt-4 text-sm text-bone/55 sm:text-base">
          {fieldNotesIntro.subtitle}
        </p>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-12">
        {fieldNotes.map((note, i) => (
          <figure
            key={note.index}
            data-note
            className={`group relative overflow-hidden rounded-sm border border-white/8 ${SPANS[i]}`}
            style={{ ["--wipe" as string]: "100%" }}
          >
            <Image
              src={note.plate}
              alt={note.caption}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            />

            {/* The same frame, reduced to its edges, revealed by the wipe. */}
            <div
              aria-hidden
              className="absolute inset-0 transition-opacity duration-500"
              style={{
                clipPath: "inset(0 0 0 var(--wipe))",
                filter: "url(#schematic)",
                mixBlendMode: "screen",
              }}
            >
              <Image
                src={note.plate}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            {/* The seam where photograph becomes diagram. */}
            <div
              aria-hidden
              className="absolute inset-y-0 w-px bg-[var(--accent)] opacity-70 blur-[0.5px]"
              style={{ left: "var(--wipe)" }}
            />

            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-90"
            />

            <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
              <div>
                <p className="hud mb-1.5 text-[0.55rem]">
                  {note.index} / {note.label}
                </p>
                <p className="max-w-md text-sm leading-snug text-bone/90">{note.caption}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
