/**
 * The line drawing that sits over the opening photograph.
 *
 * Three families of line, and the point of the chapter is that they turn out to
 * be the same drawing: ridge contours read across the photograph, an arch and
 * its cable fan echo those contours on the right, and one amber route crosses
 * from the bottom-left corner up to the top of the arch, touching a node for
 * each of the three selected projects on the way.
 *
 * At rest — no script, reduced motion, a phone — this is the finished diagram at
 * a low resting opacity. The desktop sequence in HeroMotion animates *into* this
 * state rather than out of nothing, so the static render is the destination and
 * never a half-drawn frame.
 */

/** Ridge contours. Long, nearly horizontal, deliberately unremarkable. */
const RIDGES = [
  "M-20 524 C 200 466 360 420 540 436 S 880 384 1080 346 S 1300 318 1460 334",
  "M-20 596 C 240 536 380 496 560 516 S 900 466 1100 426 S 1320 401 1460 416",
  "M-20 658 C 260 606 420 571 620 582 S 980 541 1180 508 S 1350 491 1460 501",
  "M-20 718 C 280 682 460 654 660 662 S 1020 628 1220 602 S 1370 588 1460 596",
];

/** The arch, and the deck it lands on. */
const ARCH = "M 902 690 C 902 306 1012 152 1090 152 C 1168 152 1278 306 1278 690";
const DECK = "M 828 690 H 1400";

/** The cable fan, from the top of the arch down to the deck. */
const CABLES = Array.from({ length: 13 }, (_, i) => {
  const x = 872 + i * 42;
  return `M 1090 158 L ${x} 686`;
});

/**
 * The route. Its two endpoints are fixed points of the whole sequence: it
 * always enters at the bottom-left and always terminates at the top of the
 * arch, whatever else is happening.
 */
const ROUTE =
  "M -20 724 C 170 706 296 656 466 614 C 636 572 758 482 898 410 C 998 358 1058 252 1090 158";

/** Where the three selected projects sit on the route. */
const NODES = [
  { x: 466, y: 614 },
  { x: 898, y: 410 },
  { x: 1090, y: 158 },
];

export default function HorizonDiagram({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 810"
      // The diagram is drawn to match the photograph behind it, which is
      // cover-cropped, so this has to crop the same way rather than letterbox.
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={className}
      // Strokes keep their width when the viewBox is scaled, so the route stays
      // the one fine line it is meant to be at every viewport size.
      vectorEffect="non-scaling-stroke"
    >
      <g data-diagram-contours opacity="0.34" fill="none" strokeLinecap="round">
        <g stroke="var(--color-contour)" strokeWidth="1">
          {RIDGES.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        <g stroke="var(--color-contour)" strokeWidth="0.75" opacity="0.72">
          {CABLES.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        <path d={ARCH} stroke="var(--color-ivory)" strokeWidth="1.25" opacity="0.5" />
        <path d={DECK} stroke="var(--color-contour)" strokeWidth="1" />
      </g>

      <g data-diagram-route fill="none">
        <path
          data-route-path
          d={ROUTE}
          stroke="var(--color-route)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {NODES.map((node) => (
          <circle
            key={`${node.x}-${node.y}`}
            data-route-node
            cx={node.x}
            cy={node.y}
            r="3.5"
            fill="var(--color-basalt)"
            stroke="var(--color-route)"
            strokeWidth="1.5"
          />
        ))}
      </g>
    </svg>
  );
}
