import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/horizon/SiteShell";
import { alsoBuilt, projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Search and retrieval, applied AI, platform engineering and published research. " +
    "Case studies, and the smaller things that did not need one.",
};

export default function WorkIndex() {
  return (
    <SiteShell>
      <div className="shell pt-32 pb-24 sm:pt-40 sm:pb-32">
        <p className="label">Work</p>
        <h1 className="mt-4 max-w-[20ch] text-chapter font-semibold tracking-tight text-balance">
          Ideas made useful.
        </h1>
        <p className="reading mt-4 text-lede text-muted text-pretty">
          Everything below is real. Where a project is internal or unreleased, the page says so
          rather than inventing something to show you.
        </p>

        <ol className="mt-16 border-t border-white/10">
          {projects.map((project, index) => (
            <li key={project.slug} className="group border-b border-white/10">
              <Link
                href={`/work/${project.slug}`}
                className="grid gap-3 py-8 lg:grid-cols-12 lg:items-baseline lg:gap-8"
              >
                <span className="label text-ivory lg:col-span-1">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="lg:col-span-6">
                  <h2 className="text-title font-semibold tracking-tight transition-colors duration-200 group-hover:text-route">
                    {project.title}
                  </h2>
                  <p className="mt-2 max-w-[48ch] text-muted text-pretty">{project.summary}</p>
                </div>

                <div className="lg:col-span-3">
                  <p className="label">{project.category}</p>
                  <p className="mt-1 text-meta text-route">{project.status}</p>
                </div>

                <div className="lg:col-span-2 lg:text-right">
                  <p className="text-meta text-muted">{project.dates}</p>
                </div>
              </Link>
            </li>
          ))}
        </ol>

        <section className="mt-24">
          <h2 className="text-chapter font-semibold tracking-tight">Also built.</h2>
          <p className="reading mt-3 text-lede text-muted text-pretty">
            Smaller, finished, and linked. Not stretched into case studies they cannot support.
          </p>

          <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {alsoBuilt.map((item) => (
              <li key={item.title}>
                <h3 className="text-title font-medium tracking-tight">
                  <a
                    href={item.href}
                    className="text-route underline decoration-route/30 underline-offset-4 transition-colors duration-200 hover:decoration-route"
                  >
                    {item.title}
                  </a>
                </h3>
                <p className="mt-2 max-w-[48ch] text-muted text-pretty">{item.body}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </SiteShell>
  );
}
