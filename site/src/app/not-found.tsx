import Link from "next/link";
import SiteShell from "@/components/horizon/SiteShell";

export const metadata = { title: "Not found" };

export default function NotFound() {
  return (
    <SiteShell>
      <div className="shell flex min-h-svh flex-col justify-center pt-32 pb-24">
        <p className="label">404</p>
        <h1 className="mt-4 max-w-[20ch] text-chapter font-semibold tracking-tight text-balance">
          Nothing here. Which is itself a kind of answer.
        </h1>
        <p className="reading mt-4 text-lede text-muted text-pretty">
          That address does not exist. The work, the photographs and a way to get in touch all do.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/portfolio"
            className="inline-flex min-h-11 items-center rounded-full bg-route px-6 text-sm font-medium text-basalt transition-colors duration-200 hover:bg-ivory"
          >
            Portfolio
          </Link>
          <Link
            href="/portfolio/work"
            className="inline-flex min-h-11 items-center rounded-full border border-white/25 px-6 text-sm text-ivory transition-colors duration-200 hover:border-route hover:text-route"
          >
            All work
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-full border border-white/25 px-6 text-sm text-ivory transition-colors duration-200 hover:border-route hover:text-route"
          >
            The reel
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}
