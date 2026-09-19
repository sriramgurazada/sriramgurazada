"use client";

import { useState } from "react";
import Photo from "@/components/Photo";
import { largestPhoto } from "@/lib/photo-src";
import PhotoViewer from "@/components/horizon/PhotoViewer";
import { files, photos, type PhotoSlug } from "@/data/photos";

/**
 * The curated wall: six original photographs, three columns by two rows.
 *
 * Each frame is an anchor pointing straight at the full image file, and the
 * viewer is an enhancement layered over that. So the gallery works with no
 * JavaScript, works if the viewer fails, and gives a middle-click or a
 * right-click exactly what a visitor would expect it to.
 */
export default function PhotoWall({ slugs }: { slugs: PhotoSlug[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <ul className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {slugs.map((slug, index) => {
          const record = photos[slug];
          const file = files[slug];
          const landscape = file.width > file.height;

          return (
            <li key={slug}>
              <figure>
                <a
                  href={largestPhoto(slug)}
                  onClick={(event) => {
                    // Leave the modifier-click behaviours alone: a visitor
                    // opening this in a new tab wants the file, not the viewer.
                    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
                    event.preventDefault();
                    setOpen(index);
                  }}
                  className="group block overflow-hidden rounded-sm bg-depth/40"
                  aria-label={`Open ${record.label.toLowerCase()} at full size`}
                >
                  <Photo
                    slug={slug}
                    alt={record.alt}
                    // Three columns inside a 1600px shell, two on tablets, one
                    // on a phone. Getting this wrong is the difference between
                    // a 360px file and a 1400px one on a phone.
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
                    className={`w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] ${
                      landscape ? "aspect-4/3" : "aspect-3/4"
                    }`}
                  />
                </a>

                {/* Always visible. A caption that needs a hover is a caption
                    that does not exist on a touchscreen. */}
                <figcaption className="mt-3">
                  <p className="label flex items-center gap-2">
                    <span className="text-ivory">{String(index + 1).padStart(2, "0")}</span>
                    <span aria-hidden="true" className="text-contour/50">
                      /
                    </span>
                    <span>{record.label}</span>
                  </p>
                  <p className="mt-1.5 text-pretty">{record.caption}</p>
                  <p className="mt-1 text-meta text-muted">{record.place}</p>
                </figcaption>
              </figure>
            </li>
          );
        })}
      </ul>

      {open !== null && (
        <PhotoViewer
          slugs={slugs}
          index={open}
          onClose={() => setOpen(null)}
          onIndex={setOpen}
        />
      )}
    </>
  );
}
