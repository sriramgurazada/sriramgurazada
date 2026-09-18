/**
 * An SVG edge-detect filter, used to derive a line drawing from a photograph
 * in the DOM. The WebGL stage does the same thing in a shader; this is the
 * cheap equivalent for the images that live in normal page flow.
 */
export default function SchematicFilter() {
  return (
    <svg aria-hidden className="pointer-events-none absolute h-0 w-0" focusable="false">
      <defs>
        <filter id="schematic" colorInterpolationFilters="sRGB">
          <feColorMatrix type="saturate" values="0" result="grey" />
          {/* Laplacian kernel: keeps edges, discards flat regions. */}
          <feConvolveMatrix
            in="grey"
            order="3"
            kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1"
            divisor="1"
            bias="0"
            preserveAlpha="true"
            result="edges"
          />
          <feComponentTransfer in="edges" result="boosted">
            <feFuncR type="linear" slope="2.4" intercept="0" />
            <feFuncG type="linear" slope="2.4" intercept="0" />
            <feFuncB type="linear" slope="2.4" intercept="0" />
          </feComponentTransfer>
          {/* Tint the line work toward the page accent. */}
          <feColorMatrix
            in="boosted"
            type="matrix"
            values="1.0 0.35 0.10 0 0
                    0.45 0.30 0.12 0 0
                    0.15 0.12 0.20 0 0
                    0    0    0    1 0"
          />
        </filter>
      </defs>
    </svg>
  );
}
