import ChapterHeading from "@/components/horizon/ChapterHeading";
import LivingFrame from "@/components/horizon/LivingFrame";
import MistBand from "@/components/horizon/effects/MistBand";
import Photo from "@/components/Photo";
import PhotoWall from "@/components/horizon/PhotoWall";
import { photoWall, photos } from "@/data/photos";

/**
 * Chapter 03. The story wall, and then the photographs it came from.
 *
 * Two frames at the top: the wide composite study beside the tall waterwall.
 * They are deliberately not in the gallery below — one is assembled from two
 * photographs and says so, and mixing it into a documentary collection is
 * exactly the thing that makes a collection untrustworthy.
 */
export default function FieldNotes() {
  const composite = photos["composite-study"];
  const waterwall = photos["water-wall"];

  return (
    <section id="field-notes" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="shell">
        <ChapterHeading
          index="03"
          eyebrow="Field notes"
          heading="Every place leaves a pattern."
          standfirst="A few things I noticed along the way, and one of them assembled into something that was never there."
        />

        {/* The story wall. Wide beside tall, which is what makes it a wall and
            not two pictures. */}
        <div className="mt-14 grid gap-6 lg:grid-cols-[1.62fr_1fr] lg:items-stretch">
          <figure className="flex flex-col">
            <LivingFrame className="rounded-sm bg-depth/40" effect={<MistBand />}>
              <Photo
                slug="composite-study"
                alt={composite.alt}
                sizes="(min-width: 1024px) 60vw, 92vw"
                className="aspect-2/1 w-full object-cover lg:aspect-auto lg:h-full"
              />
            </LivingFrame>
            <figcaption className="mt-3">
              <p className="label flex flex-wrap items-center gap-2">
                <span className="text-ivory">01</span>
                <span aria-hidden="true" className="text-contour/50">
                  /
                </span>
                <span>Connections</span>
                {/* Stated on the image itself, not only in a data file. */}
                <span className="rounded-full border border-route/40 px-2 py-0.5 text-route">
                  Composite study
                </span>
              </p>
              <p className="mt-1.5 text-pretty">{composite.caption}</p>
              <p className="mt-1 text-meta text-muted">{composite.place}</p>
            </figcaption>
          </figure>

          <figure className="flex flex-col">
            <LivingFrame className="rounded-sm bg-depth/40">
              <Photo
                slug="water-wall"
                alt={waterwall.alt}
                sizes="(min-width: 1024px) 36vw, 92vw"
                className="aspect-3/4 w-full object-cover lg:aspect-auto lg:h-full"
              />
            </LivingFrame>
            <figcaption className="mt-3">
              <p className="label flex items-center gap-2">
                <span className="text-ivory">02</span>
                <span aria-hidden="true" className="text-contour/50">
                  /
                </span>
                <span>Flow</span>
              </p>
              <p className="mt-1.5 text-pretty">{waterwall.caption}</p>
              <p className="mt-1 text-meta text-muted">{waterwall.place}</p>
            </figcaption>
          </figure>
        </div>

        <div className="mt-24">
          <h3 className="text-chapter font-semibold tracking-tight">Through my lens.</h3>
          <p className="reading mt-3 text-lede text-muted text-pretty">
            Six photographs, unretouched and unassembled. Open one to see it at full size.
          </p>

          <div className="mt-10">
            <PhotoWall slugs={photoWall} />
          </div>
        </div>
      </div>
    </section>
  );
}
