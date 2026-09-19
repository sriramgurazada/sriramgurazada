"use client";

import { useLayoutEffect, useRef } from "react";
import Photo from "@/components/Photo";
import { gsap } from "@/lib/gsap";
import { scene } from "@/lib/scene";
import { photos } from "@/data/photos";
import { capabilities, identity, pipeline } from "@/data/identity";
import { aboutCopy } from "@/data/raw";

export default function Record() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top 80%",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            if (!self.isActive) return;
            scene.exposure = 0.2;
            scene.reveal = 0;
            scene.intensity = 0.22;
          },
        },
      });

      gsap.fromTo(
        "[data-record-reveal]",
        { opacity: 0, y: 44 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 70%" },
        }
      );

      gsap.utils.toArray<HTMLElement>("[data-record-row]").forEach((row) => {
        gsap.fromTo(
          row,
          { opacity: 0, x: -28 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: { trigger: row, start: "top 88%" },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="record"
      className="relative z-10 bg-ink/94 px-6 py-[18vh] backdrop-blur-sm sm:px-10"
    >
      <div className="mx-auto max-w-6xl">
        <p data-record-reveal className="hud mb-6">
          IV / The Record
        </p>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div data-record-reveal className="lg:col-span-5">
            <div className="relative aspect-[3/4] overflow-hidden rounded-sm border border-white/10">
              <Photo
                slug="headshot"
                alt={photos.headshot.alt}
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="hud text-[0.55rem]">{identity.location}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <h2
              data-record-reveal
              className="font-display text-3xl leading-[1.1] tracking-tight text-bone sm:text-5xl"
            >
              The work is mostly invisible.
            </h2>
            <div className="mt-7 space-y-5">
              {aboutCopy.map((para) => (
                <p
                  key={para}
                  data-record-reveal
                  className="max-w-2xl text-sm leading-relaxed text-bone/65 sm:text-base"
                >
                  {para}
                </p>
              ))}
            </div>

            <div data-record-reveal className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {capabilities.map((group) => (
                <div key={group.group}>
                  <p className="hud mb-2.5 text-[0.55rem]">{group.group}</p>
                  <ul className="space-y-1">
                    {group.items.map((item) => (
                      <li key={item} className="text-xs text-bone/55">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* The stages, where a list of years used to be. The years said where
            this happened; these say what it is, which is the part worth the
            space. Same content as the portfolio's chapter 03, in this mode's
            idiom: one row each, no illustration, nothing to click. */}
        <div className="mt-24 border-t border-white/10">
          {pipeline.stages.map((stage, index) => (
            <div
              key={stage.id}
              data-record-row
              className="grid grid-cols-12 items-baseline gap-4 border-b border-white/10 py-6"
            >
              <span className="col-span-3 font-display text-xl text-[var(--accent)] sm:col-span-2 sm:text-2xl">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="hud col-span-9 text-[0.6rem] sm:col-span-3">{stage.name}</span>
              <p className="col-span-12 text-sm text-bone/65 sm:col-span-7">{stage.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
