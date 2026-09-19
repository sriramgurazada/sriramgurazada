import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteShell from "@/components/horizon/SiteShell";
import { nextProject, projectBySlug, projects } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(props: PageProps<"/portfolio/work/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const project = projectBySlug(slug);
  if (!project) return {};
  return { title: project.title, description: project.summary };
}

export default async function CaseStudy(props: PageProps<"/portfolio/work/[slug]">) {
  const { slug } = await props.params;
  const project = projectBySlug(slug);
  if (!project) notFound();

  const next = nextProject(project.slug);

  return (
    <SiteShell>
      <article className="shell pt-32 pb-24 sm:pt-40 sm:pb-32">
        <header>
          <Link
            href="/portfolio/work"
            className="label transition-colors duration-200 hover:text-ivory"
          >
            ← All work
          </Link>

          <h1 className="mt-6 max-w-[24ch] text-chapter font-semibold tracking-tight text-balance">
            {project.title}
          </h1>
          <p className="reading mt-4 text-lede text-muted text-pretty">{project.summary}</p>

          <dl className="mt-10 grid gap-6 border-y border-white/10 py-7 sm:grid-cols-4">
            <div>
              <dt className="label">Category</dt>
              <dd className="mt-1.5 text-meta">{project.category}</dd>
            </div>
            <div>
              <dt className="label">Status</dt>
              <dd className="mt-1.5 text-meta text-route">{project.status}</dd>
            </div>
            <div>
              <dt className="label">Role</dt>
              <dd className="mt-1.5 text-meta">{project.role}</dd>
            </div>
            <div>
              <dt className="label">Dates</dt>
              <dd className="mt-1.5 text-meta">{project.dates}</dd>
            </div>
          </dl>
        </header>

        {/* Where a case is thin because the work is not publishable, that is
            stated at the top rather than left for the reader to infer from a
            short page. */}
        {project.withheld && (
          <p className="reading mt-10 border-l-2 border-route/60 pl-5 text-muted text-pretty">
            {project.withheld}
          </p>
        )}

        <div className="reading mt-14 space-y-14">
          {project.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-title font-semibold tracking-tight">{section.heading}</h2>

              {section.body && (
                <div className="mt-4 space-y-4 text-prose text-pretty">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              )}

              {section.points && (
                <ul className="mt-5 space-y-5">
                  {section.points.map((point) => (
                    <li key={point.body} className="border-l border-white/10 pl-5">
                      {point.title && (
                        <p className="font-medium text-route">{point.title}</p>
                      )}
                      <p className={`text-pretty ${point.title ? "mt-1.5 text-muted" : ""}`}>
                        {point.body}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          {project.evidence && project.evidence.length > 0 && (
            <Notes heading="Evidence" items={project.evidence} />
          )}
          {project.limitations && project.limitations.length > 0 && (
            <Notes heading="Limitations" items={project.limitations} />
          )}
          {project.next && project.next.length > 0 && (
            <Notes heading="Next" items={project.next} />
          )}
        </div>

        {project.links && project.links.length > 0 && (
          <div className="reading mt-14 border-t border-white/10 pt-8">
            <h2 className="label">Links</h2>
            <ul className="mt-4 space-y-3">
              {project.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-prose text-route underline decoration-route/30 underline-offset-4 transition-colors duration-200 hover:decoration-route"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Every case ends with another case and a way to get in touch, so a
            reader who arrived on a deep link is never at a dead end. */}
        <nav aria-label="Continue" className="mt-24 grid gap-px overflow-hidden rounded-sm bg-white/10 sm:grid-cols-2">
          <Link href={`/portfolio/work/${next.slug}`} className="group bg-basalt p-7 sm:p-9">
            <p className="label">Next case</p>
            <p className="mt-3 text-title font-semibold tracking-tight transition-colors duration-200 group-hover:text-route">
              {next.title}
            </p>
            <p className="mt-2 max-w-[40ch] text-muted text-pretty">{next.summary}</p>
          </Link>
          <Link href="/portfolio#contact" className="group bg-basalt p-7 sm:p-9">
            <p className="label">Contact</p>
            <p className="mt-3 text-title font-semibold tracking-tight transition-colors duration-200 group-hover:text-route">
              Have a problem worth building for?
            </p>
            <p className="mt-2 max-w-[40ch] text-muted text-pretty">
              Then it is worth an email. Let’s talk.
            </p>
          </Link>
        </nav>
      </article>
    </SiteShell>
  );
}

function Notes({ heading, items }: { heading: string; items: string[] }) {
  return (
    <section>
      <h2 className="label">{heading}</h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="text-muted text-pretty">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
