import SiteShell from "@/components/horizon/SiteShell";
import Hero from "@/components/horizon/sections/Hero";
import SelectedWork from "@/components/horizon/sections/SelectedWork";
import FieldNotes from "@/components/horizon/sections/FieldNotes";
import MyPath from "@/components/horizon/sections/MyPath";
import NextHorizon from "@/components/horizon/sections/NextHorizon";
import Contact from "@/components/horizon/sections/Contact";
import { asset } from "@/lib/asset";
import { restoreModeScript } from "@/lib/prefs";

export default function Home() {
  return (
    <>
      {/* Only on this document: sends a visitor who previously chose raw mode
          back to it, the way a site restores a theme. A first-time visitor has
          no preference, so this does nothing — which is also what a crawler
          sees, since it never runs. */}
      <script dangerouslySetInnerHTML={{ __html: restoreModeScript(asset("/raw/")) }} />

      <SiteShell>
        <Hero />
        <SelectedWork />
        <FieldNotes />
        <MyPath />
        <NextHorizon />
        <Contact />
      </SiteShell>
    </>
  );
}
