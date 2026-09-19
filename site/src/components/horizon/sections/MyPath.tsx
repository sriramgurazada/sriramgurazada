import ChapterHeading from "@/components/horizon/ChapterHeading";
import Photo from "@/components/Photo";
import { about, capabilities, path } from "@/data/identity";
import { photos } from "@/data/photos";

/**
 * Chapter 04. The introduction, the portrait, and the route through the
 * milestones that actually changed something.
 *
 * Both text and portrait are completely still. This is the chapter where a
 * visitor is reading and looking at a face, and neither is improved by motion.
 */
export default function MyPath() {
  return (
    <section id="about" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="shell">
        <ChapterHeading index="04" eyebrow="My path" heading={about.heading} />

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="reading space-y-5 text-prose text-pretty">
              {about.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <dl className="mt-12 grid gap-8 sm:grid-cols-2">
              {capabilities.map((group) => (
                <div key={group.group}>
                  <dt className="label text-ivory">{group.group}</dt>
                  <dd className="mt-2 text-meta text-muted">{group.items.join(" · ")}</dd>
                </div>
              ))}
            </dl>
          </div>

          <figure className="lg:col-span-5">
            <Photo
              slug="headshot"
              alt={photos.headshot.alt}
              sizes="(min-width: 1024px) 34vw, 92vw"
              className="w-full rounded-sm object-cover"
            />
            <figcaption className="mt-3 text-meta text-muted">
              {photos.headshot.place}
            </figcaption>
          </figure>
        </div>

        {/* The milestones. The amber rule is the route again, this time running
            vertically; it is decorative, and the list stands without it. */}
        <ol className="relative mt-24 border-l border-white/10 pl-8 sm:pl-12">
          <span
            aria-hidden="true"
            className="absolute top-2 -left-px h-[calc(100%-1rem)] w-px bg-gradient-to-b from-route/70 via-route/25 to-transparent"
          />
          {path.map((milestone) => (
            <li key={`${milestone.year}-${milestone.place}`} className="relative pb-12 last:pb-0">
              <span
                aria-hidden="true"
                className="absolute top-2.5 -left-[calc(2rem+4px)] h-2 w-2 rounded-full bg-route sm:-left-[calc(3rem+4px)]"
              />
              <div className="grid gap-4 sm:grid-cols-[6rem_1fr] sm:gap-8">
                <p className="label text-ivory">{milestone.year}</p>
                <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-start">
                  <div>
                    <p className="text-title font-medium tracking-tight">{milestone.place}</p>
                    <p className="reading mt-1.5 text-muted text-pretty">{milestone.note}</p>
                  </div>
                  {milestone.photo && (
                    <Photo
                      slug={milestone.photo}
                      alt={photos[milestone.photo].alt}
                      sizes="(min-width: 640px) 180px, 92vw"
                      className="w-full rounded-sm object-cover sm:w-[180px]"
                    />
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
