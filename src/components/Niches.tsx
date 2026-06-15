import {
  UtensilsCrossed,
  Coffee,
  Martini,
  Croissant,
  Home,
  Building2,
  Waves,
  Flame,
  type LucideIcon,
} from "lucide-react";
import SectionReveal from "./SectionReveal";

type Niche = { icon: LucideIcon; name: string; blurb: string };

type Domain = {
  id: string;
  kicker: string;
  title: string;
  lead: string;
  /** Large hero image for the domain. */
  main: { src: string; alt: string };
  /** Smaller overlapping inset image. */
  inset: { src: string; alt: string };
  niches: Niche[];
};

const domains: Domain[] = [
  {
    id: "hospitality",
    kicker: "Hospitality & Entertainment",
    title: "Rooms people come back for.",
    lead:
      "Restaurants, cafés, lounges and bakeries where the interior does the hospitality work — drawing guests in, setting the pace of a visit and turning a first impression into a habit.",
    main: {
      src: "/Business/IMG_1674.JPG",
      alt: "Fine-dining restaurant with blue-and-white tile arches, marble floors and velvet chairs",
    },
    inset: {
      src: "/Business/IMG_1704.JPG",
      alt: "Artisan patisserie with draped fabric ceiling, stone counter and warm gold lighting",
    },
    niches: [
      {
        icon: UtensilsCrossed,
        name: "Restaurants",
        blurb: "Fine-dining rooms and private dining built around atmosphere and flow.",
      },
      {
        icon: Coffee,
        name: "Cafés",
        blurb: "Daytime spaces that feel warm, photogenic and effortless to linger in.",
      },
      {
        icon: Martini,
        name: "Lounges & Bars",
        blurb: "Evening interiors with mood, texture and considered, layered light.",
      },
      {
        icon: Croissant,
        name: "Bakeries & Patisseries",
        blurb: "Counters and displays styled to make the product the hero.",
      },
    ],
  },
  {
    id: "residential",
    kicker: "Residential",
    title: "Homes that feel inevitable.",
    lead:
      "From concept to the final cushion — family homes, lofts, private wellness retreats and outdoor lounges designed around how you actually live, balanced in light, proportion and material.",
    main: {
      src: "/Residential/IMG_1683.JPG",
      alt: "Private wellness suite with a sunken spa pool, timber deck and a cinema screen",
    },
    inset: {
      src: "/Residential/IMG_1671.JPG",
      alt: "Living room shown half as a technical concept drawing and half as a finished render",
    },
    niches: [
      {
        icon: Home,
        name: "Family Homes",
        blurb: "Full-home interiors balancing comfort, character and everyday life.",
      },
      {
        icon: Building2,
        name: "Lofts & Apartments",
        blurb: "Open, vertical spaces zoned to live larger than their footprint.",
      },
      {
        icon: Waves,
        name: "Wellness & Spa",
        blurb: "Private spa, pool and bathing retreats centred on calm and escape.",
      },
      {
        icon: Flame,
        name: "Outdoor Lounges",
        blurb: "Courtyards and terraces that extend the home into the open air.",
      },
    ],
  },
];

function DomainBlock({ domain, flip }: { domain: Domain; flip: boolean }) {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
      {/* ---------- Image collage ---------- */}
      <SectionReveal
        className={`relative ${flip ? "lg:order-2" : "lg:order-1"}`}
      >
        <div className="relative overflow-hidden rounded-sm border border-gold/15 bg-ink">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={domain.main.src}
            alt={domain.main.alt}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="aspect-[4/5] w-full object-cover sm:aspect-[5/4] lg:aspect-[4/5]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/65 via-transparent to-transparent" />
        </div>

        {/* Overlapping inset photo with a gold-hairline frame */}
        <div
          className={`absolute -bottom-7 hidden w-2/5 overflow-hidden rounded-sm border border-gold/25 bg-ink shadow-[0_30px_60px_-30px_rgba(10,17,36,0.8)] sm:block ${
            flip ? "-left-6" : "-right-6"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={domain.inset.src}
            alt={domain.inset.alt}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="aspect-square w-full object-cover"
          />
        </div>
      </SectionReveal>

      {/* ---------- Copy + niche grid ---------- */}
      <SectionReveal
        delay={0.1}
        className={`flex flex-col ${flip ? "lg:order-1" : "lg:order-2"}`}
      >
        <p className="eyebrow">{domain.kicker}</p>
        <h3 className="mt-5 font-serif text-3xl font-normal leading-[1.12] text-beige sm:text-4xl">
          {domain.title}
        </h3>
        <p className="mt-5 max-w-md text-base leading-[1.75] text-beige-dim">
          {domain.lead}
        </p>

        <div className="hairline my-8 max-w-xs" />

        <dl className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
          {domain.niches.map((niche) => (
            <div key={niche.name} className="flex gap-4">
              <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/35 text-gold">
                <niche.icon size={18} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <div>
                <dt className="font-serif text-lg leading-snug text-beige">
                  {niche.name}
                </dt>
                <dd className="mt-1 text-sm leading-[1.6] text-beige-dim">
                  {niche.blurb}
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </SectionReveal>
    </div>
  );
}

export default function Niches() {
  return (
    <section id="niches" className="bg-ink relative overflow-hidden py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionReveal className="max-w-2xl">
          <p className="eyebrow">Where We Work</p>
          <h2 className="mt-6 font-serif text-4xl font-normal leading-[1.1] text-beige sm:text-5xl">
            Two worlds, one standard of craft.
          </h2>
          <p className="mt-6 text-base leading-[1.75] text-beige-dim">
            Whether it&apos;s a space that has to earn a living or a home that has
            to feel like one, we bring the same eye for proportion, light and
            material to every brief.
          </p>
        </SectionReveal>

        <div className="mt-20 space-y-28 lg:mt-24 lg:space-y-32">
          {domains.map((domain, i) => (
            <DomainBlock key={domain.id} domain={domain} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
