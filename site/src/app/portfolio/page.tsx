import type { Metadata } from "next";
import SiteShell from "@/components/horizon/SiteShell";
import Hero from "@/components/horizon/sections/Hero";
import SelectedWork from "@/components/horizon/sections/SelectedWork";
import FieldNotes from "@/components/horizon/sections/FieldNotes";
import MyPath from "@/components/horizon/sections/MyPath";
import NextHorizon from "@/components/horizon/sections/NextHorizon";
import Contact from "@/components/horizon/sections/Contact";

export const metadata: Metadata = {
  title: "Portfolio",
};

export default function Portfolio() {
  return (
    <SiteShell>
      <Hero />
      <SelectedWork />
      <FieldNotes />
      <MyPath />
      <NextHorizon />
      <Contact />
    </SiteShell>
  );
}
