import ChapterHeading from "@/components/horizon/ChapterHeading";
import Photo from "@/components/Photo";
import { art } from "@/data/artwork";
import { pipeline } from "@/data/identity";

/**
 * Chapter 03. Three stages, kept short.
 *
 * It is an ordered list, and it is the list that carries the meaning. The
 * connecting rule, the nodes and the illustration behind them are all decorative
 * and all hidden from assistive technology.
 */
export default function Pipeline() {
  return (
    <section id="how" className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32">
      {/* The illustration sits behind the whole section at low opacity. Its own
          contour field is densest through the middle band, which is where the
          nodes are, so the two line up without either being aligned to the
          other. */}
      <div aria-hidden="true" className="absolute inset-0">
        <Photo
          slug="system-graph"
          alt=""
          sizes="100vw"
          className="h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-basalt via-basalt/35 to-basalt" />
      </div>

      <div className="shell relative">
        <ChapterHeading
          index="03"
          eyebrow="How it runs"
          heading={pipeline.heading}
          standfirst={pipeline.standfirst}
        />

        <ol className="relative mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {pipeline.stages.map((stage, index) => (
            <li key={stage.id} className="group relative">
              {/* The segment of route arriving at this node, drawn into the gap
                  on its left. Only at lg, where the column count is known to be
                  three: at narrower widths the grid rewraps and a rule computed
                  for three columns would dangle off a row edge. */}
              {index % 3 !== 0 && (
                <span
                  aria-hidden="true"
                  className="absolute top-[7px] right-full hidden h-px w-8 bg-gradient-to-r from-transparent to-route/40 lg:block"
                />
              )}

              <p className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="relative h-[7px] w-[7px] shrink-0 rounded-full bg-route"
                >
                  {/* The halo. It breathes only under a full-motion preference
                      with Pause off; see globals.css. The negative delay starts
                      each one part-way through the loop so the three do not pulse
                      in unison. */}
                  <span
                    data-node-halo
                    data-ambient
                    style={{ animationDelay: `${index * -0.75}s` }}
                    className="absolute -inset-[5px] rounded-full border border-route/30"
                  />
                </span>
                <span className="label text-ivory">
                  {String(index + 1).padStart(2, "0")} / {stage.name}
                </span>
              </p>

              <h3 className="mt-4 text-title font-medium tracking-tight text-balance">
                {stage.role}
              </h3>
              <p className="reading mt-2.5 text-muted text-pretty">{stage.detail}</p>
            </li>
          ))}
        </ol>

        <p className="mt-16 max-w-[52ch] text-meta text-muted">
          {art("system-graph").note}
        </p>
      </div>
    </section>
  );
}
