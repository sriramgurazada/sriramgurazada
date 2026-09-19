import ChapterHeading from "@/components/horizon/ChapterHeading";
import Photo from "@/components/Photo";
import { nextHorizon } from "@/data/identity";
import { photos } from "@/data/photos";

/**
 * Chapter 06. The sunset silhouette, and three directions.
 *
 * The three cards are labelled as interests in the standfirst, because the
 * difference between "things I am interested in" and "services I offer" is the
 * whole honesty of the section.
 */
export default function NextHorizon() {
  return (
    <section id="next" className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0">
        <Photo
          slug="overlook"
          alt={photos.overlook.alt}
          sizes="100vw"
          className="h-full w-full object-cover"
          // The person and the weather sit on the right. Holding the crop left
          // of centre keeps them out of the heading, and leaves the dark ridge
          // under the three cards.
          position="28% 50%"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-basalt via-basalt/88 to-basalt/55"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-basalt/35" />

      <div className="shell relative">
        <ChapterHeading
          index="06"
          eyebrow="Next horizon"
          heading={nextHorizon.heading}
          standfirst={nextHorizon.standfirst}
        />

        <ul className="mt-14 grid gap-px overflow-hidden rounded-sm bg-white/10 sm:grid-cols-3">
          {nextHorizon.interests.map((interest) => (
            <li key={interest.title} className="bg-basalt/70 p-7 backdrop-blur-sm">
              <h3 className="text-title font-medium tracking-tight text-route">{interest.title}</h3>
              <p className="mt-3 text-muted text-pretty">{interest.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
