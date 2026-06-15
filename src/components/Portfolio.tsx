"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsDesktop, usePrefersReducedMotion } from "@/lib/useMediaQuery";
import SectionReveal from "./SectionReveal";
import Terrain from "./Terrain";

const projects = [
  {
    title: "Azure Mediterranean",
    tag: "Restaurant",
    img: "/Business/IMG_1674.JPG",
    alt: "Fine-dining restaurant with blue-and-white tile arches, marble floors and velvet chairs",
  },
  {
    title: "Maison Café",
    tag: "Café",
    img: "/Business/IMG_1703.JPG",
    alt: "Minimalist café in warm plaster tones with timber tables and a tasselled chandelier",
  },
  {
    title: "Lumière Patisserie",
    tag: "Bakery",
    img: "/Business/IMG_1704.JPG",
    alt: "Artisan patisserie with a draped fabric ceiling, stone counter and warm gold lighting",
  },
  {
    title: "Belle Époque Lounge",
    tag: "Lounge",
    img: "/Business/IMG_1705.JPG",
    alt: "Dramatic rooftop lounge with magenta arches, patterned walls and city views",
  },
  {
    title: "Botanica Private Dining",
    tag: "Restaurant",
    img: "/Business/IMG_1679.JPG",
    alt: "Intimate private dining room with a folk-art mural, rattan pendants and tan chairs",
  },
  {
    title: "Verbena Tea Room",
    tag: "Café",
    img: "/Business/IMG_1708.JPG",
    alt: "Playful pastel tea room in pink and mint with checkerboard floor and lush plants",
  },
  {
    title: "Concept Residence",
    tag: "Residential",
    img: "/Residential/IMG_1671.JPG",
    alt: "Living room shown half as a technical concept drawing and half as a finished render",
  },
  {
    title: "Aqua Wellness Suite",
    tag: "Wellness",
    img: "/Residential/IMG_1683.JPG",
    alt: "Private wellness suite with a sunken spa pool, timber deck and a cinema screen",
  },
  {
    title: "Foundry Loft",
    tag: "Loft",
    img: "/Residential/IMG_1685.JPG",
    alt: "Industrial double-height loft with a mezzanine, exposed brick and a teal modular sofa",
  },
  {
    title: "Courtyard Lounge",
    tag: "Outdoor",
    img: "/Residential/IMG_1693.JPG",
    alt: "Whitewashed courtyard lounge with a sunken firepit, floor cushions and tropical planting",
  },
];

type Project = (typeof projects)[number];

function Card({ p, className = "" }: { p: Project; className?: string }) {
  return (
    <article
      className={`group relative overflow-hidden rounded-sm border border-gold/10 bg-navy transition-all duration-500 hover:border-gold/35 hover:shadow-[0_34px_70px_-34px_rgba(0,0,0,0.85)] ${className}`}
    >
      <div className="h-full w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.img}
          alt={p.alt}
          loading="lazy"
          draggable={false}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/15 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <p className="font-cinzel text-[10px] uppercase tracking-[0.22em] text-gold-lite">
          {p.tag}
        </p>
        <h3 className="mt-1.5 font-serif text-2xl text-beige">{p.title}</h3>
      </div>
    </article>
  );
}

export default function Portfolio() {
  const desktop = useIsDesktop();
  const reduce = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);
  // SSR-safe client mount guard — intentional one-shot state set on mount.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  const horizontal = mounted && desktop && !reduce;

  const section = useRef<HTMLElement>(null);
  const pinWrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!horizontal || !track.current) return;
      const distance = () =>
        Math.max(0, track.current!.scrollWidth - window.innerWidth + 80);

      gsap.to(track.current, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => "+=" + distance(),
          pin: pinWrap.current,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // Refresh once images have had a chance to load (affects scrollWidth).
      window.setTimeout(() => ScrollTrigger.refresh(), 400);
    },
    { scope: section, dependencies: [horizontal] }
  );

  /* -------- Fallback: vertical grid (mobile / reduced motion) -------- */
  if (!horizontal) {
    return (
      <section id="portfolio" ref={section} className="relative overflow-hidden bg-ink py-24 lg:py-32">
        <Terrain
          variant="texture"
          opacity={0.5}
          className="[mask-image:linear-gradient(to_top,black_70%,transparent_100%)]"
        />
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
          <SectionReveal className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="eyebrow">Visualised</p>
              <h2 className="mt-5 font-serif text-4xl font-normal leading-tight text-beige sm:text-5xl">
                Every interior, down to the detail.
              </h2>
            </div>
            <a
              href="#contact"
              className="font-cinzel text-[11px] uppercase tracking-[0.18em] text-gold transition-colors hover:text-gold-lite"
            >
              Start your project →
            </a>
          </SectionReveal>

          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
              <SectionReveal key={p.title} as="div" delay={(i % 3) * 0.08}>
                <Card p={p} className="aspect-[4/5]" />
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* -------- Horizontal scroll gallery (desktop) -------- */
  return (
    <section id="portfolio" ref={section} className="relative bg-ink">
      <div ref={pinWrap} className="relative flex h-dvh flex-col justify-center overflow-hidden">
        <Terrain
          variant="texture"
          opacity={0.5}
          className="[mask-image:linear-gradient(to_top,black_70%,transparent_100%)]"
        />
        <div className="relative z-10 mx-auto flex w-full max-w-7xl items-end justify-between gap-6 px-6 pb-10 lg:px-10">
          <div className="max-w-2xl">
            <p className="eyebrow">Visualised</p>
            <h2 className="mt-5 font-serif text-4xl font-normal leading-tight text-beige sm:text-5xl">
              Every interior, down to the detail.
            </h2>
          </div>
          <span className="font-cinzel hidden text-[11px] uppercase tracking-[0.2em] text-beige/45 lg:block">
            Scroll to explore →
          </span>
        </div>

        <div ref={track} className="relative z-10 flex gap-6 pl-6 lg:pl-10">
          {projects.map((p) => (
            <Card key={p.title} p={p} className="h-[58vh] w-[78vw] shrink-0 sm:w-[30rem]" />
          ))}
          {/* trailing spacer so the last card can clear the edge */}
          <div className="w-6 shrink-0 lg:w-10" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
