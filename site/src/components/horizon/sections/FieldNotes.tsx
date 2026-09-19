import ChapterHeading from "@/components/horizon/ChapterHeading";
import Photo from "@/components/Photo";
import PhotoWall from "@/components/horizon/PhotoWall";
import { openingFrames, photo, photoWall } from "@/data/photos";

/**
 * Chapter 04. Two photographs at full weight, and then the wall.
 *
 * Everything in this section is a photograph the owner took. The illustrations
 * used elsewhere on the page are deliberately kept out: this is the one section
 * offering itself as a record of places that exist, and a made image filed among
 * them is what would put the rest in doubt.
 *
 * The wide frame beside the tall one is what makes this read as a wall rather
 * than as two pictures. Both are kept out of the gallery below so nothing
 * appears twice.
 */
export default function FieldNotes() {
  const wide = photo(openingFrames.wide);
  const tall = photo(openingFrames.tall);

  return (
    <section id="field-notes" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="shell">
        <ChapterHeading
          index="04"
          eyebrow="Field notes / the photography wall"
          heading="Every place leaves a pattern."
          standfirst="Photographs from the same years as the work. I notice structure — cables, contours, grids, flow — and it turns out to be the same instinct."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.62fr_1fr] lg:items-stretch">
          <Frame
            index="01"
            record={wide}
            sizes="(min-width: 1024px) 60vw, 92vw"
            className="aspect-2/1 w-full object-cover lg:aspect-auto lg:h-full"
            priority
          />
          <Frame
            index="02"
            record={tall}
            sizes="(min-width: 1024px) 36vw, 92vw"
            className="aspect-3/4 w-full object-cover lg:aspect-auto lg:h-full"
          />
        </div>

        <div className="mt-24">
          <h3 className="text-chapter font-semibold tracking-tight">Through my lens.</h3>
          <p className="reading mt-3 text-lede text-muted text-pretty">
            Six more, unretouched. Open one to see it at full size.
          </p>

          <div className="mt-10">
            <PhotoWall slugs={photoWall} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Frame({
  index,
  record,
  sizes,
  className,
  priority,
}: {
  index: string;
  record: ReturnType<typeof photo>;
  sizes: string;
  className: string;
  priority?: boolean;
}) {
  return (
    <figure className="flex flex-col">
      <div className="overflow-hidden rounded-sm bg-depth/40">
        <Photo
          slug={record.slug}
          alt={record.alt}
          sizes={sizes}
          className={className}
          priority={priority}
        />
      </div>
      <figcaption className="mt-3">
        <p className="label flex flex-wrap items-center gap-2">
          <span className="text-ivory">{index}</span>
          <span aria-hidden="true" className="text-contour/50">
            /
          </span>
          <span>{record.label}</span>
        </p>
        <p className="mt-1.5 text-pretty">{record.caption}</p>
        <p className="mt-1 text-meta text-muted">{record.place}</p>
      </figcaption>
    </figure>
  );
}
