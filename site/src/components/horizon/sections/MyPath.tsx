import ChapterHeading from "@/components/horizon/ChapterHeading";
import Photo from "@/components/Photo";
import { about, capabilities, portraits } from "@/data/identity";
import { photos } from "@/data/photos";

/**
 * Chapter 05. The person behind the work.
 *
 * Three photographs and some prose, in place of the year-by-year timeline this
 * used to be. Everything here is completely still: this is the chapter where a
 * visitor is reading and looking at a face, and neither is improved by motion.
 */
export default function MyPath() {
  return (
    <section id="about" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="shell">
        <ChapterHeading
          index="05"
          eyebrow="My path / the person behind the work"
          heading={about.heading}
        />

        {/* The three frames, equal width and equal height on desktop so they read
            as one row rather than three cards. Each caption is numbered, which is
            the same device the work rows and the pipeline use. */}
        <ol className="mt-14 grid gap-6 sm:grid-cols-3 sm:gap-5">
          {portraits.map((frame, index) => (
            <li key={frame.photo}>
              <figure>
                <div className="overflow-hidden rounded-sm bg-white/[0.03]">
                  <Photo
                    slug={frame.photo}
                    alt={photos[frame.photo].alt}
                    sizes="(min-width: 640px) 31vw, 92vw"
                    className="aspect-4/5 w-full object-cover"
                  />
                </div>
                <figcaption className="mt-4">
                  <p className="label">
                    <span className="text-route">{String(index + 1).padStart(2, "0")}</span>
                    <span className="text-muted"> / {frame.label}</span>
                  </p>
                  <p className="mt-2 text-meta text-muted text-pretty">{frame.caption}</p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>

        <div className="mt-20 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="reading space-y-5 text-prose text-pretty">
              {about.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <dl className="grid gap-8 sm:grid-cols-2 lg:col-span-5 lg:content-start">
            {capabilities.map((group) => (
              <div key={group.group}>
                <dt className="label text-ivory">{group.group}</dt>
                <dd className="mt-2 text-meta text-muted">{group.items.join(" · ")}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
