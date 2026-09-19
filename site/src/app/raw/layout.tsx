import type { Metadata } from "next";
import { Cinzel, JetBrains_Mono } from "next/font/google";
import { identity } from "@/data/identity";

/**
 * The display and monospace faces exist only in raw mode.
 *
 * Declaring them here rather than in the root layout is what keeps them out of
 * every other route: Next splits font CSS per route, so a visitor who never
 * opens raw mode never downloads either face. That is most of the initial
 * JavaScript and font budget for the readable site.
 */
const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono-hud",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Raw mode",
  description: `The same work as a five-chapter reel. ${identity.shortName}, in full frame.`,
};

export default function RawLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-raw-root is what globals.css keys the raw page shell off, since the
    // <body> belongs to the root layout and cannot vary per route.
    <div data-raw-root className={`${cinzel.variable} ${mono.variable}`}>
      {children}
    </div>
  );
}
