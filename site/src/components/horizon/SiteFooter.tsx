import Link from "next/link";
import ModeToggle from "@/components/horizon/ModeToggle";
import { contactLinks, identity } from "@/data/identity";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 py-12">
      <div className="shell flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-title">{identity.shortName}</p>
          <p className="mt-2 text-meta text-muted">
            {identity.role} · {identity.location}
          </p>
          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
            {contactLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-meta text-route underline decoration-route/30 underline-offset-4 transition-colors duration-200 hover:decoration-route"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-start gap-4 sm:items-end">
          <ModeToggle current="tech" />
          <div className="flex flex-col gap-1 sm:text-right">
            <Link href="/work" className="label transition-colors duration-200 hover:text-ivory">
              All work
            </Link>
            {/* Scoped deliberately. The studio portrait is somebody else's
                work, so the authorship claim covers only the gallery. */}
            <p className="label">The Field notes photographs are my own</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
