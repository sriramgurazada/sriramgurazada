import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { identity } from "@/data/identity";
import { BOOT_SCRIPT } from "@/lib/prefs";
import "./globals.css";

/**
 * One grotesk for the whole readable site. Raw mode loads its own display and
 * monospace faces from its own layout, so those bytes never reach a visitor who
 * does not go there.
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const title = `${identity.shortName} — ${identity.role}`;
const description =
  "Software engineer in Dallas. Search and retrieval, applied AI, and the systems " +
  "underneath them. Selected work, field notes and photography.";

export const metadata: Metadata = {
  title: { default: title, template: `%s — ${identity.shortName}` },
  description,
  applicationName: "HORIZON",
  authors: [{ name: identity.shortName }],
  openGraph: { title, description, type: "website", siteName: identity.shortName },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: "#080d12",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Resolves the motion preferences before the first paint. A reduced
            preference honoured after hydration was not honoured. */}
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
