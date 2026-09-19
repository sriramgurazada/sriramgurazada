# Portfolio

Two experiences over one set of content, and a switch between them.

**The default** is a readable, typographic site: a hero photograph that resolves
into the line drawing hiding inside it, three selected cases, a path, a wall of
photographs and a contact banner. It is meant for somebody who arrived to find
out what I have built and would like to find that out.

**The reel**, at `/raw`, is the cinematic version. A single WebGL canvas sits
behind the whole page and re-grades each photograph into a contour schematic as
you scroll, wiping between the two treatments along a burning seam. It makes the
argument the site is about — bridge cables and mountain contours are the same
curve solved twice — and it is a poor front door, which is why it is no longer
the front door.

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

## Layout

| Path | Role |
| --- | --- |
| `src/app/page.tsx` | The default experience. Six sections, composed from `components/horizon/sections/`. |
| `src/app/work/` | The case index and one page per case, generated from `data/projects.ts`. |
| `src/app/raw/` | The reel, and the only route that loads three.js or the display fonts. |
| `src/data/identity.ts` | Who, where, and the contact destinations. Edited by hand; nothing else hard-codes any of it. |
| `src/data/projects.ts` | The cases. Every narrative section is optional, so a thin case is a short page rather than a page of empty headings. |
| `src/data/photos.ts` | Captions, alt text and provenance per photograph, over a generated file manifest. |
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

**The hero effect is gated on layout, not on a media query.** CSS grants the
hero section its extra height only on eligible desktops, and `HeroMotion` simply
checks whether there is travel to scrub against. The two can never disagree, and
where the effect is not wanted there is no mystery scrolling to explain. gsap is
imported only after that check passes, so phones and reduced-motion visitors
never download it.

**Only one ambient effect runs at a time.** `frame-scheduler.ts` watches the
`LivingFrame`s with one IntersectionObserver and activates the most visible one.
Opening the photo viewer sets `data-viewer="open"`, which pauses all of them —
scenery competing with the photograph somebody just asked to look at is the
wrong priority.

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

## Photographs

`public/photos` is generated. The originals are never committed.

```bash
node scripts/process-photos.mjs <source-dir>
```

Each photograph becomes a set of WebP widths plus one JPEG of the same crop,
sized by the role it plays, and named by its actual width because that is what a
`srcset` descriptor states. The script also writes `src/data/photo-files.ts`, so
the dimensions in the markup can never drift from the pixels on disk.

`composite-study` is assembled by the same script from two of the photographs.
It is the only image here that is not documentary, and it is labelled as a
composite everywhere it appears.

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
original photograph is not a motion asset. Only the mist band over the composite
study is animated, because it is a synthetic gradient rather than a claim about
the photograph underneath. A Live Photo and a video exist and are the right
starting point when this is picked up.

**Some copy needs the owner's eye.** Cases with `confirmed: false` in
`data/projects.ts` — enterprise search, Warranty Wala, Temporal Nexus — are
accurate as far as they go but have not been read back by the person they are
about. Photographs with `located: false` in `data/photos.ts` carry a descriptive
working place rather than a confirmed one.

**No résumé link.** `contact.resume` is null, so no résumé button renders rather
than a dead one.

**Internal work stays internal.** The enterprise search case has no
screenshots, metrics or architecture, and says so in place. It is context, not
evidence, and should not be read as a portfolio artefact.

**The JavaScript floor is the framework.** About 172KB gzipped on every route is
the Next app-router baseline; the page code adds roughly 5KB to it. The reel is
far heavier, which is the price of three.js and is charged only to `/raw`.
