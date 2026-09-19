import Link from "next/link";
import ChapterHeading from "@/components/horizon/ChapterHeading";
import Photo from "@/components/Photo";
import { art } from "@/data/artwork";
import { featuredProjects } from "@/data/projects";

/**
 * Chapter 02. Three cases beside the route that connects them.
 *
 * The illustration is the section's one piece of art direction and carries no
 * information, so it is hidden from assistive technology and dropped entirely
 * below lg, where there is no column to put it in and it would only push the
 * work further down the page.
 */
export default function SelectedWork() {
  return (
    <section id="work" className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32">
      {/* Bleeds off the right edge, so the terrain reads as continuing past the
          frame rather than as a picture placed in a box. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] lg:block"
      >
        <Photo
          slug="contour-ridge"
          alt=""
          sizes="46vw"
          className="h-full w-full object-cover opacity-90"
          position="78% 42%"
        />
        {/* A short fade into the copy on the left, and nothing else. The last
            version washed the ridge out so thoroughly that the illustration
            might as well not have been there. */}
        <div className="absolute inset-0 bg-gradient-to-r from-basalt via-basalt/40 via-22% to-transparent to-48%" />
      </div>

      <div className="shell relative">
        <div className="lg:max-w-[52%]">
          <ChapterHeading
            index="02"
            eyebrow="Selected work"
            heading="Ideas made useful."
            standfirst="Search, automation and systems that serve people. Three of them here; the rest are on the work page, including the ones that are only interesting to me."
          />

          <ol className="mt-14 border-t border-white/10">
            {featuredProjects.map((project, index) => (
              <li key={project.slug} className="group relative border-b border-white/10">
                <Link
                  href={`/portfolio/work/${project.slug}`}
                  className="grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 py-7 sm:py-8"
                >
                  {/* The node on the route. */}
                  <span
                    aria-hidden="true"
                    className="absolute top-9 -left-4 hidden h-1.5 w-1.5 rounded-full bg-route opacity-40 transition-opacity duration-200 group-hover:opacity-100 lg:block"
                  />

                  <span className="text-title font-semibold text-route/80 transition-colors duration-200 group-hover:text-route">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <h3 className="text-title font-semibold tracking-tight transition-colors duration-200 group-hover:text-route">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-meta text-muted">
                      {project.category} · <span className="text-route/90">{project.status}</span>
                    </p>
                    <p className="mt-2.5 max-w-[46ch] text-muted text-pretty">{project.summary}</p>
                    <span className="mt-3 inline-block text-meta text-muted underline decoration-white/20 underline-offset-4 transition-colors duration-200 group-hover:text-route group-hover:decoration-route/50">
                      View case study →
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

          <p className="mt-10 text-meta text-muted lg:mt-14">{art("contour-ridge").note}</p>
        </div>
      </div>
    </section>
  );
}
