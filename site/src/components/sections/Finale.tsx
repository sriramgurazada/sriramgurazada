"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { scene, setTheme } from "@/lib/scene";
import { FINALE_PLATE } from "@/lib/plates";
import { chapters, finaleTheme, identity } from "@/data/content";

const LINKS = [
  { label: "Email", value: identity.email, href: `mailto:${identity.email}` },
  { label: "LinkedIn", value: "gschandra123", href: identity.linkedin },
  { label: "GitHub", value: "sriramgurazada", href: identity.github },
];

export default function Finale() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Bring the stage back up for the closing plate.
      gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top 85%",
          end: "top 10%",
          scrub: true,
          onUpdate: (self) => {
            if (!self.isActive) return;
            scene.plateA = FINALE_PLATE - 1;
            scene.plateB = FINALE_PLATE;
            scene.plateMix = self.progress;
            scene.exposure = 0.2 + self.progress * 0.75;
            scene.intensity = 0.2 + self.progress * 0.6;
            scene.reveal = Math.sin(self.progress * Math.PI) * 0.45;
          },
          onEnter: () => setTheme(finaleTheme),
          onEnterBack: () => setTheme(finaleTheme),
          // Hand the grade back to the last chapter on the way up.
          onLeaveBack: () => setTheme(chapters[chapters.length - 1].theme),
          onLeave: () => {
            scene.plateA = FINALE_PLATE - 1;
            scene.plateB = FINALE_PLATE;
            scene.plateMix = 1;
            scene.exposure = 0.95;
          },
        },
      });

      gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            if (!self.isActive) return;
            scene.push = self.progress;
            scene.parallax = (self.progress - 0.5) * 1.1;
          },
        },
      });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top 60%",
            end: "center center",
            scrub: 1,
          },
        })
        .fromTo(
          "[data-finale-title]",
          { opacity: 0, yPercent: 40, filter: "blur(16px)" },
          { opacity: 1, yPercent: 0, filter: "blur(0px)", duration: 1.2, ease: "power3.out" }
        )
        .fromTo(
          "[data-finale-link]",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.14, ease: "power2.out" },
          "-=0.5"
        );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="contact" className="relative h-[200vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-between overflow-hidden px-6 py-[13vh] sm:px-10">
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/30 to-ink/90"
        />
        {/* The closing type all sits on the left, so weight the shadow there. */}
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-ink via-ink/70 to-transparent sm:w-[72%]"
        />

        <div className="hud relative flex items-center justify-between">
          <span>Epilogue</span>
          <span>End of five chapters</span>
        </div>

        <div className="relative flex flex-1 flex-col justify-center">
          <h2
            data-finale-title
            className="title-epic max-w-5xl text-[11vw] leading-[0.85] text-bone sm:text-[7vw]"
          >
            Let&apos;s build
            <br />
            something
            <br />
            <span className="text-[var(--accent)]">permanent.</span>
          </h2>

          <div className="mt-14 flex flex-wrap gap-x-8 gap-y-7 sm:gap-x-14">
            {LINKS.map((link) => (
              <a
                key={link.label}
                data-finale-link
                href={link.href}
                target={link.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noreferrer"
                className="group block"
              >
                <p className="hud mb-1.5 text-[0.55rem]">{link.label}</p>
                <p className="font-display text-base text-bone transition-colors group-hover:text-[var(--accent)] sm:text-xl">
                  {link.value}
                  <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                    ↗
                  </span>
                </p>
              </a>
            ))}
          </div>
        </div>

        <div className="hud relative flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
          {/* The full name is too wide for a phone footer; the short form
              carries the same signature. */}
          <span className="sm:hidden">{identity.shortName}</span>
          <span className="hidden sm:inline">{identity.name}</span>
          <span>Photographs by the author</span>
        </div>
      </div>
    </section>
  );
}
