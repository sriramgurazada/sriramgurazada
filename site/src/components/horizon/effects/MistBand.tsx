/**
 * The one living-frame effect in this release: a narrow band of mist drifting at
 * lake level in the composite study.
 *
 * It is a soft added layer, not a displacement of the photograph, which is what
 * makes it safe to ship without the production motion assets. Nothing in the
 * frame can deform, because nothing in the frame is being sampled — the
 * mountains, the arch, the cables and the route are untouched pixels underneath.
 *
 * The falling-water effects the design calls for are a different problem and
 * are not here. Each of those needs a motion-region mask, a protected-foreground
 * holdout and a flow map per breakpoint, none of which exist yet; see the README.
 */
export default function MistBand() {
  return (
    <>
      <div data-ambient className="mist-band mist-band--low" />
      <div data-ambient className="mist-band mist-band--high" />
    </>
  );
}
