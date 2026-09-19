import { Cinzel, JetBrains_Mono } from "next/font/google";

/**
 * The display and monospace faces exist only in the reel.
 *
 * Declaring them in a route group rather than in the root layout is what keeps
 * them off every other route: Next splits font CSS per route, so a visitor who
 * goes straight to the portfolio never downloads either face. The group also
 * lets the reel own `/` without its fonts and shell leaking into the rest of
 * the site, which a plain root layout could not do.
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

export default function ReelLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-raw-root is what globals.css keys the reel's page shell off, since
    // the <body> belongs to the root layout and cannot vary per route.
    <div data-raw-root className={`${cinzel.variable} ${mono.variable}`}>
      {children}
    </div>
  );
}
