# Portfolio

Two experiences over one set of content, and a switch between them.

**The landing page** is the cinematic reel. A single WebGL canvas sits behind
the whole page and re-grades each photograph into a contour schematic as you
scroll. It is a poor front door for someone who arrived to read, which is why
the header of that page is one action: take me to the portfolio.

**The portfolio**, at `/portfolio`, is the readable site. The opening frame is
an illustration built to the approved design — not a photograph — then three
selected cases, the six stages a question actually passes through, a wall of
photographs, and a contact banner.

The switch lives in the header and the footer. The choice is remembered like a
theme, and restored only on a later visit.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

```bash
npm run build      # static export into out/
npm run lint       # eslint
npx tsc --noEmit   # types
```

To preview the export the way GitHub Pages will serve it, including the
deployment prefix and trailing-slash resolution:

```bash
node scripts/serve-like-pages.mjs
```

## Layout

| Path | Role |
| --- | --- |
| `src/app/(reel)/page.tsx` | The landing page. The cinematic reel. |
| `src/app/portfolio/page.tsx` | The readable site. Seven sections, composed from `components/horizon/sections/`. |
| `src/app/portfolio/work/` | The case index and one page per case, generated from `data/projects.ts`. |
| `src/data/identity.ts` | Who, where, the contact destinations, and the six pipeline stages. Edited by hand; nothing else hard-codes any of it. |
| `src/data/projects.ts` | The cases. Every narrative section is optional, so a thin case is a short page rather than a page of empty headings. |
| `src/data/photos.ts` | Captions, alt text and provenance per photograph, over a generated file manifest. Photographs only. |
| `src/data/artwork.ts` | The three illustrations. Kept in their own file so a made image cannot be filed among documentary photographs. |
| `src/data/raw.ts` | Only what the reel needs: chapters, per-chapter theming, era stamps. |
| `src/lib/prefs.ts` | The inline boot script. Resolves motion, pause and mode before the first paint. |
| `src/lib/photo-src.ts` | Builds `srcset` and fallback URLs from the generated manifest. |

## Things worth knowing before changing it

**Preferences live on `<html>`, not in React.** `BOOT_SCRIPT` writes
`data-motion`, `data-paused` and `data-hidden` before anything renders, because
a reduced-motion preference applied after hydration is a preference that was
ignored for the second that mattered. CSS reads those attributes;
`MotionProvider` subscribes to them through `useSyncExternalStore` rather than
keeping a copy that would start out wrong.

**Photographs and illustrations do not share a list.** `photos.ts` is a record
of places somebody stood. `artwork.ts` is three images built to the design. Both
are fine to put on a page, but only one of them can be offered as evidence, so
they never share a type, a caption style or the photography wall. The pipeline
that sizes them writes two manifests into `photo-files.ts` for the same reason.

**The hero is one viewport.** An earlier version granted 140vh of extra height
on desktop for a photograph-to-diagram sequence. The height outlived the
sequence, which is how a visitor got a blank page between the headline and the
work. Do not put that travel back without also pinning `[data-hero-stage]`.

**`Photo` is a plain `<picture>`, deliberately.** A static export means
`images.unoptimized`, at which point `next/image` adds a client component and
its own base-path hazards while doing none of the work that would justify
either. Widths come from the generated manifest so every image reserves its own
space.

**In the reel, scroll drives a plain object.** Sections write to `scene` from
GSAP `onUpdate` callbacks and the shaders read it inside `useFrame`; nothing
re-renders. Guard those writes on `isActive`, because ScrollTrigger fires
`onUpdate` during its initial refresh for triggers far outside the viewport.
Write uniforms through a ref to the material — react-three-fiber keeps its own
copy of the object passed as the `uniforms` prop, so mutating yours updates
nothing.

## Photographs and artwork

`public/photos` is generated. The originals are never committed.

```bash
node scripts/process-photos.mjs <source-dir>
```

Each source becomes a set of WebP widths plus one JPEG of the same crop, sized
by the role it plays, and named by its actual width because that is what a
`srcset` descriptor states. The script also writes `src/data/photo-files.ts`, so
the dimensions in the markup can never drift from the pixels on disk.

Artwork arrives smaller than a retina hero, so the script resamples it up with
Lanczos before encoding. That would be indefensible for a photograph — there is
no sensor detail to recover. It is defensible here because these are smooth
gradients and fine linework, and the alternative is the browser doing a worse
job of the same scaling at display time.

## Accessibility

Content is real DOM in reading order, so the site works with the canvas, the
scroll effect and JavaScript in any state of absence. Skip-to-content is the
first focusable element. The photo wall degrades to plain links to full-size
images when the viewer cannot mount, the viewer traps focus and returns it to
the link that opened it, and every interactive target is at least 44px.

Motion has two independent controls in the header: **Reduced**, which follows the
operating system until told otherwise, and **Pause**, which freezes decorative
motion where it stands rather than reverting it. A hidden tab stops its loops,
which browsers do not do for CSS animations on their own.

## Known gaps

Things deliberately left, so they are not mistaken for oversights.

**Living frames are static.** The design called for five photographs where one
element moves and everything else stays locked — falling water, drifting mist,
a passing train. Doing that honestly needs assets that do not exist yet: per
photograph, a motion mask, a protected-foreground holdout and a flow map. The
original photograph is not a motion asset. A Live Photo and a video exist and
are the right starting point when this is picked up.

**Some copy needs the owner's eye.** Cases with `confirmed: false` in
`data/projects.ts` — shareholder analytics, enterprise search, Warranty Wala,
Temporal Nexus — are accurate as far as they go but have not been read back by
the person they are about. Photographs with `located: false` in `data/photos.ts`
carry a descriptive working place rather than a confirmed one.

**No résumé link.** `contact.resume` is null, so no résumé button renders rather
than a dead one.

**Internal work stays internal.** The shareholder analytics and enterprise
search cases have no screenshots, metrics or architecture, and say so in place.
They are context, not evidence, and should not be read as portfolio artefacts.

**The JavaScript floor is the framework.** About 172KB gzipped on every route is
the Next app-router baseline; the page code adds roughly 5KB to it. The reel is
far heavier, which is the price of three.js and is charged only to `/`.
