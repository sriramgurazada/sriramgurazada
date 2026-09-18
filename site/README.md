# Portfolio

A scroll-driven portfolio built around one idea: a photograph and the pattern
hiding inside it, shown at the same time.

Every plate in the reel is one of the author's own photographs. As you scroll,
a shader re-renders each frame as a contour schematic — luminance isolines plus
a screen-space gradient that picks out cables, ridges and skylines — and wipes
between the two treatments along a noisy boundary. The result is a frame that
is part photograph and part diagram, which is also the argument the site is
making: bridge cables and mountain contours are the same curve solved twice.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

```bash
npm run build && npm start   # production
npm run lint                 # eslint
npx tsc --noEmit             # types
```

## How it is put together

The page is one continuous take. A single fixed WebGL canvas sits behind every
section and is re-graded as you scroll, rather than each section owning its own
canvas.

| Path | Role |
| --- | --- |
| `src/lib/scene.ts` | The stage state — plate indices, dissolve, reveal, exposure, grade. Plain module state, deliberately not React state. |
| `src/lib/plates.ts` | The ordered list of photographs the stage can display. |
| `src/components/vfx/PhotoStage.tsx` | The plate compositor: cover-fit, dissolve with a burning seam, and the contour schematic pass. |
| `src/components/vfx/MistPlane.tsx` | Volumetric haze and light rays over the plate. |
| `src/components/vfx/EmberField.tsx` | GPU particle field, driven by scroll velocity. |
| `src/components/sections/` | The narrative: hero, five chapters, field notes, record, finale. |
| `src/data/content.ts` | All copy and per-chapter theming, kept out of the components. |

### Things worth knowing before changing it

**Scroll drives a plain object, not state.** Sections write to `scene` from
GSAP `onUpdate` callbacks and the shaders read it inside `useFrame`. Nothing
re-renders. If you add a section that changes the stage, write to `scene` the
same way.

**Guard stage writes on `isActive`.** ScrollTrigger fires `onUpdate` during its
initial refresh, including for triggers far outside the viewport. Without the
guard, an off-screen section redresses the stage before the visitor has
scrolled anywhere. Pair the guard with `onLeave`/`onLeaveBack` so values settle
rather than stranding mid-curve at a section boundary.

**Write uniforms through the material.** react-three-fiber does not retain the
object passed as the `uniforms` prop — the material keeps its own copy. Take a
ref to the `<shaderMaterial>` and mutate `ref.current.uniforms`. Mutating the
object you passed in silently updates nothing.

**Colour management is bypassed.** The plate pass is 2D compositing, so
textures are `NoColorSpace` and sampled values are written straight out. Plates
also skip mipmaps: they are not power-of-two, and a NPOT texture with
mipmapping is incomplete on WebGL1 and samples as solid black.

`window.__scene` is exposed in development for tuning from the console.

## Photographs

`public/photos` is generated from the originals:

```bash
node scripts/process-photos.mjs <source-dir>
```

The script resizes, strips metadata and re-encodes. Plates get more resolution
than portraits because they are sampled as textures.

## Accessibility and fallbacks

Without WebGL the canvas is replaced by a graded CSS wash and the site reads as
an ordinary page. All copy lives in real DOM elements, so the content is
available to screen readers and to search engines regardless of what the GPU
does.
