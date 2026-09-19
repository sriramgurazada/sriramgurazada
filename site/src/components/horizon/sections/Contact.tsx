import { contact, contactLinks, contactSection, identity } from "@/data/identity";

/**
 * Chapter 07. The banner.
 *
 * Only real destinations appear. There is no public résumé URL yet, so there is
 * no résumé button — a control that goes nowhere is worse than a control that is
 * absent, and the missing input is recorded in the README instead.
 */
export default function Contact() {
  return (
    <section id="contact" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="shell">
        <div className="relative overflow-hidden rounded-sm border border-white/10 bg-depth/25 px-6 py-14 sm:px-12 sm:py-20">
          {/* The route, one last time, across the top of the banner. */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-route to-transparent"
          />

          <p className="label">06 · Contact</p>
          <h2 className="mt-5 max-w-[24ch] text-chapter font-semibold tracking-tight text-balance">
            {contactSection.heading}
          </h2>
          <p className="reading mt-4 text-lede text-muted text-pretty">
            {contactSection.standfirst}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex min-h-11 items-center rounded-full bg-route px-6 text-sm font-medium text-basalt transition-colors duration-200 hover:bg-ivory"
            >
              Email me
            </a>
            <a
              href={contact.linkedin}
              className="inline-flex min-h-11 items-center rounded-full border border-white/25 px-6 text-sm text-ivory transition-colors duration-200 hover:border-route hover:text-route"
            >
              LinkedIn
            </a>
          </div>

          <dl className="mt-12 grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-4">
            <div>
              <dt className="label">Based in</dt>
              <dd className="mt-1.5">{identity.location}</dd>
            </div>
            {contactLinks.map((link) => (
              <div key={link.label}>
                <dt className="label">{link.label}</dt>
                <dd className="mt-1.5">
                  <a
                    href={link.href}
                    className="break-words text-route underline decoration-route/30 underline-offset-4 transition-colors duration-200 hover:decoration-route"
                  >
                    {link.value}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
