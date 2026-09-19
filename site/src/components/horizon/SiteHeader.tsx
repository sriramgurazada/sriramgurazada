"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import MotionControls from "@/components/horizon/MotionControls";
import ModeToggle from "@/components/horizon/ModeToggle";
import { identity } from "@/data/identity";

const NAV = [
  { label: "Work", href: "/portfolio/work" },
  { label: "How it runs", href: "/portfolio#how" },
  { label: "Field notes", href: "/portfolio#field-notes" },
  { label: "About", href: "/portfolio#about" },
  { label: "Contact", href: "/portfolio#contact" },
];

/**
 * Site navigation.
 *
 * Renders as real links from the first paint, so Work and Contact are reachable
 * before any script runs. On phones the same links move into a labelled
 * disclosure, which traps focus while it is open and hands focus back to the
 * button on close.
 */
export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  /** Escape closes, and focus returns to the control that opened it. */
  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        button.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;

      // Containment. Without this, tabbing walks out of the open menu and into
      // the page behind it, which is still there and still focusable.
      const focusable = panel.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    panel.current?.querySelector<HTMLElement>("a[href]")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* A gradient rather than a solid bar: the header sits over photography,
          and a bar would cut a hard line across every hero. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-basalt/95 via-basalt/70 to-transparent" />

      <div className="shell relative flex items-center justify-between gap-4 py-4 sm:py-5">
        <Link
          href="/portfolio"
          className="text-[0.9375rem] font-medium tracking-tight text-ivory transition-colors duration-200 hover:text-route"
        >
          {identity.shortName}
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[0.8125rem] text-muted transition-colors duration-200 hover:text-ivory"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <MotionControls />
          <ModeToggle current="portfolio" />
        </div>

        <button
          ref={button}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="site-menu"
          className="flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-white/15 px-4 text-[0.6875rem] tracking-[0.14em] uppercase text-muted lg:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <div
          id="site-menu"
          ref={panel}
          className="relative border-y border-white/10 bg-basalt/98 backdrop-blur-sm lg:hidden"
        >
          <nav aria-label="Main" className="shell flex flex-col py-2">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center border-b border-white/5 text-lede text-ivory last:border-0"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="shell flex flex-wrap items-center gap-3 pb-5">
            <MotionControls />
            <ModeToggle current="portfolio" />
          </div>
        </div>
      )}
    </header>
  );
}
