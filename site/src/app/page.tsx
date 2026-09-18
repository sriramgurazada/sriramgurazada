import dynamic from "next/dynamic";
import SmoothScroll from "@/components/SmoothScroll";
import FilmOverlay from "@/components/FilmOverlay";
import SchematicFilter from "@/components/SchematicFilter";
import HUD from "@/components/HUD";
import Preloader from "@/components/Preloader";
import Hero from "@/components/sections/Hero";
import Chapter from "@/components/sections/Chapter";
import FieldNotes from "@/components/sections/FieldNotes";
import Record from "@/components/sections/Record";
import Finale from "@/components/sections/Finale";
import { chapters } from "@/data/content";

// three.js has no business in the server bundle.
const VFXCanvas = dynamic(() => import("@/components/vfx/VFXCanvas"));

export default function Home() {
  return (
    <>
      <VFXCanvas />
      <SchematicFilter />
      <FilmOverlay />
      <HUD />
      <Preloader />

      <SmoothScroll />

      <main data-stage className="relative z-10">
        <Hero />

        {chapters.map((chapter, i) => (
          <Chapter key={chapter.id} chapter={chapter} index={i} />
        ))}

        <FieldNotes />
        <Record />
        <Finale />
      </main>
    </>
  );
}
