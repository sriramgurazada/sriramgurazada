import type { Metadata, Viewport } from "next";
import { Cinzel, Inter, JetBrains_Mono } from "next/font/google";
import { identity } from "@/data/content";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono-hud",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${identity.shortName} — ${identity.subtitle}`,
  description:
    "Identity and access engineering, applied AI, and cloud infrastructure. A cinematic portfolio in five chapters.",
  openGraph: {
    title: `${identity.shortName} — ${identity.subtitle}`,
    description:
      "Identity and access engineering, applied AI, and cloud infrastructure. A cinematic portfolio in five chapters.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#040404",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cinzel.variable} ${inter.variable} ${mono.variable}`}>
      <body className="bg-ink text-bone antialiased">{children}</body>
    </html>
  );
}
