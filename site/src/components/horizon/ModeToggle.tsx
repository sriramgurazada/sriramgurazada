"use client";

import Link from "next/link";
import { rememberMode } from "@/components/horizon/MotionProvider";

/**
 * Switches between the two experiences.
 *
 * The URL is the state — `/` is the readable site, `/raw` is the cinematic one
 * — so this is a pair of links rather than a stateful widget, and it keeps
 * working with no JavaScript at all. The click handler only records the choice,
 * so that a visitor who prefers raw mode lands there next time.
 */
export default function ModeToggle({
  current,
  className = "",
}: {
  current: "tech" | "raw";
  className?: string;
}) {
  return (
    <div
      className={`inline-flex items-center rounded-full border border-white/15 p-0.5 ${className}`}
      // A two-item group of links, not a radio group: describing it as one
      // would promise keyboard semantics that links do not have.
      aria-label="Site mode"
      role="group"
    >
      <Item href="/" label="Normal" mode="tech" active={current === "tech"} />
      <Item href="/raw" label="Raw" mode="raw" active={current === "raw"} />
    </div>
  );
}

function Item({
  href,
  label,
  mode,
  active,
}: {
  href: string;
  label: string;
  mode: "tech" | "raw";
  active: boolean;
}) {
  if (active) {
    return (
      <span
        aria-current="page"
        className="rounded-full bg-route/15 px-3 py-1.5 text-[0.6875rem] tracking-[0.14em] uppercase text-route"
      >
        {label}
      </span>
    );
  }

  return (
    <Link
      href={href}
      onClick={() => rememberMode(mode)}
      className="rounded-full px-3 py-1.5 text-[0.6875rem] tracking-[0.14em] uppercase text-muted transition-colors duration-200 hover:text-ivory"
    >
      {label}
    </Link>
  );
}
