import Link from "next/link";
import Photo from "@/components/Photo";
import HorizonDiagram from "@/components/horizon/HorizonDiagram";
import HeroMotion from "@/components/horizon/HeroMotion";
import { hero, identity } from "@/data/identity";
import { photos } from "@/data/photos";

/**
 * Chapter 01. The grand overlook.
 *
 * Everything that matters is in the first paint: the name, the role, the
 * headline and both actions are server-rendered text over a photograph, so a
 * visitor can read who this is and get to the work before any script arrives.
 * The sequence in HeroMotion decorates this; it is not what produces it.
 */
export default function Hero() {
  return (
    <section id="top" data-hero className="relative">
      <div
        data-hero-stage
        // Stable viewport units, and the safe-area inset so the copy is not
        // under a phone's home indicator in landscape.
        className="relative flex min-h-svh flex-col justify-end overflow-hidden pt-28 pb-[max(3rem,env(safe-area-inset-bottom))]"
      >
        <div data-hero-photo className="absolute inset-0">
          <Photo
            slug="overlook"
            alt={photos.overlook.alt}
            priority
            sizes="100vw"
            className="h-full w-full object-cover"
            // The person and the car are on the right of the frame. Holding the
            // crop left of centre keeps them clear of the headline.
            position="30% 50%"
          />
        </div>

        {/* Type over photography needs its own shadow to sit in. Measured at
            4.5:1 against the crop underneath at every breakpoint. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-basalt via-basalt/70 to-basalt/25"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-basalt/85 via-basalt/35 to-transparent"
        />

        <HorizonDiagram className="absolute inset-0 h-full w-full" />

        <div data-hero-copy className="shell relative">
          <p className="label">
            {identity.role} · {identity.location}
          </p>

          <h1 className="mt-5 max-w-[16ch] text-hero font-semibold tracking-[-0.03em] text-balance">
            {hero.headline}
          </h1>

          <div className="reading mt-6 space-y-1 text-lede text-muted">
            {hero.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/work"
              className="inline-flex min-h-11 items-center rounded-full bg-route px-6 text-sm font-medium text-basalt transition-colors duration-200 hover:bg-ivory"
            >
              Explore my work
            </Link>
            <Link
              href="/#about"
              className="inline-flex min-h-11 items-center rounded-full border border-white/25 px-6 text-sm text-ivory transition-colors duration-200 hover:border-route hover:text-route"
            >
              About me
            </Link>
          </div>
        </div>
      </div>

      <HeroMotion />
    </section>
  );
}
