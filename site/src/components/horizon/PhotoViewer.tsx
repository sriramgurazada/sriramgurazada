"use client";

import { useCallback, useEffect, useRef } from "react";
import { largestPhoto } from "@/lib/photo-src";
import { files, photo, type PhotoSlug } from "@/data/photos";

type Props = {
  slugs: PhotoSlug[];
  index: number;
  onClose: () => void;
  onIndex: (next: number) => void;
};

/**
 * Opens one photograph at its full still size.
 *
 * While it is open, `data-viewer="open"` on the document root pauses every
 * ambient effect on the page behind it. Scenery competing with the photograph
 * somebody just asked to look at is the wrong priority.
 */
export default function PhotoViewer({ slugs, index, onClose, onIndex }: Props) {
  const dialog = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  /** The element to hand focus back to when this closes. */
  const opener = useRef<HTMLElement | null>(null);

  const slug = slugs[index];
  const record = photo(slug);
  const file = files[slug];

  const step = useCallback(
    (delta: number) => onIndex((index + delta + slugs.length) % slugs.length),
    [index, onIndex, slugs.length]
  );

  useEffect(() => {
    opener.current = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    root.dataset.viewer = "open";

    // Locking the body rather than the root: the root is where the pause
    // attributes live, and overflow there would also stop the page underneath
    // from being restored to the same place on close.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    closeButton.current?.focus();

    return () => {
      delete root.dataset.viewer;
      document.body.style.overflow = previousOverflow;
      opener.current?.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = dialog.current?.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]");
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, step]);

  return (
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label={`Photograph ${index + 1} of ${slugs.length}`}
      className="fixed inset-0 z-100 flex flex-col bg-basalt/97 backdrop-blur-sm"
    >
      <div className="shell flex items-center justify-between gap-4 py-4">
        <p className="label">
          {index + 1} / {slugs.length}
        </p>
        <button
          ref={closeButton}
          type="button"
          onClick={onClose}
          className="min-h-11 min-w-11 rounded-full border border-white/20 px-5 text-[0.6875rem] tracking-[0.14em] uppercase text-muted transition-colors duration-200 hover:border-route hover:text-route"
        >
          Close
        </button>
      </div>

      {/* The still original, unconstrained by the wall's crop. Only the largest
          derivative is fetched here — the wall has already shown a small one, so
          a srcset would only invite the browser to reuse it. */}
      <div className="flex min-h-0 flex-1 items-center justify-center px-4">
        {/* eslint-disable-next-line @next/next/no-img-element -- every derivative
            is generated ahead of time by scripts/process-photos.mjs, and a static
            export runs next/image unoptimized anyway. */}
        <img
          src={largestPhoto(slug)}
          alt={record.alt}
          width={file.width}
          height={file.height}
          className="max-h-full w-auto max-w-full object-contain"
        />
      </div>

      <div className="shell flex flex-col gap-4 py-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="reading">
          <p className="label">{record.label}</p>
          {record.caption && <p className="mt-1 text-lede text-pretty">{record.caption}</p>}
          <p className="mt-1 text-meta text-muted">
            {record.place}
            {record.credit && ` · ${record.credit}`}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => step(-1)}
            className="min-h-11 rounded-full border border-white/20 px-5 text-[0.6875rem] tracking-[0.14em] uppercase text-muted transition-colors duration-200 hover:border-route hover:text-route"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            className="min-h-11 rounded-full border border-white/20 px-5 text-[0.6875rem] tracking-[0.14em] uppercase text-muted transition-colors duration-200 hover:border-route hover:text-route"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
