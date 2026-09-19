import Link from "next/link";
import Photo from "@/components/Photo";
import { art } from "@/data/artwork";
import { hero, identity } from "@/data/identity";

/**
 * Chapter 01. The grand overlook.
 *
 * Everything that matters is in the first paint: the name, the role, the
 * headline and both actions are server-rendered text over the illustration, so a
 * visitor can read who this is and get to the work before any script arrives.
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
            slug="horizon-vista"
            alt={art("horizon-vista").alt}
            priority
            sizes="100vw"
            className="h-full w-full object-cover"
            // The sun break and the figure are on the right. Holding the crop
            // right of centre keeps both in frame as the viewport narrows, and
            // leaves the dark rock on the left under the headline.
            position="62% 50%"
          />
        </div>

        {/* The illustration was built with its own darkness on the left, which is
            most of the job a scrim usually does. What is left is a light floor
            under the copy and a gentle wash from the left edge — both gone well
            before the sun break, so the part worth looking at keeps its own
            contrast instead of sitting under flat grey. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-basalt via-basalt/45 via-26% to-transparent to-62%"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-basalt/70 via-basalt/15 via-34% to-transparent to-56%"
        />

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
              href="/portfolio/work"
              className="inline-flex min-h-11 items-center rounded-full bg-route px-6 text-sm font-medium text-basalt transition-colors duration-200 hover:bg-ivory"
            >
              Explore my work
            </Link>
            <Link
              href="/portfolio#about"
              className="inline-flex min-h-11 items-center rounded-full border border-white/25 px-6 text-sm text-ivory transition-colors duration-200 hover:border-route hover:text-route"
            >
              About me
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
