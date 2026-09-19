import Link from "next/link";
import ChapterHeading from "@/components/horizon/ChapterHeading";
import { featuredProjects } from "@/data/projects";

/**
 * Chapter 02. Three cases as large typographic rows.
 *
 * The amber rule down the left is the route's continuation: the line that
 * crossed the photograph above ends at a node per project, and these are those
 * nodes. It is decorative, so it is hidden from assistive technology; the rows
 * are an ordered list either way.
 */
export default function SelectedWork() {
  return (
    <section id="work" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="shell">
        <ChapterHeading
          index="02"
          eyebrow="Selected work"
          heading="Ideas made useful."
          standfirst="Three of them. The rest are on the work page, including the ones that are only interesting to me."
        />

        <ol className="mt-14 border-t border-white/10">
          {featuredProjects.map((project, index) => (
            <li key={project.slug} className="group relative border-b border-white/10">
              <Link
                href={`/portfolio/work/${project.slug}`}
                className="grid gap-4 py-8 sm:py-10 lg:grid-cols-12 lg:items-baseline lg:gap-8"
              >
                {/* The node on the route. */}
                <span
                  aria-hidden="true"
                  className="absolute top-8 -left-4 hidden h-1.5 w-1.5 rounded-full bg-route opacity-40 transition-opacity duration-200 group-hover:opacity-100 lg:block"
                />

                <div className="lg:col-span-1">
                  <span className="label text-ivory">{String(index + 1).padStart(2, "0")}</span>
                </div>

                <div className="lg:col-span-6">
                  <h3 className="text-title font-semibold tracking-tight transition-colors duration-200 group-hover:text-route">
                    {project.title}
                  </h3>
                  <p className="mt-2 max-w-[42ch] text-muted text-pretty">{project.summary}</p>
                </div>

                <div className="lg:col-span-3">
                  <p className="label">{project.category}</p>
                  <p className="mt-1 text-meta text-route">{project.status}</p>
                </div>

                <div className="lg:col-span-2 lg:text-right">
                  <span className="text-meta text-muted transition-colors duration-200 group-hover:text-route">
                    Read the case →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ol>

        <Link
          href="/portfolio/work"
          className="mt-10 inline-flex min-h-11 items-center text-route underline decoration-route/30 underline-offset-4 transition-colors duration-200 hover:decoration-route"
        >
          All work, including the smaller things
        </Link>
      </div>
    </section>
  );
}
