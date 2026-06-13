"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsDesktop, usePrefersReducedMotion } from "@/lib/useMediaQuery";
import SectionReveal from "./SectionReveal";

const projects = [
  {
    title: "Harbour Penthouse",
    tag: "Residential",
    img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80",
    alt: "Minimal penthouse living room with floor-to-ceiling windows",
  },
  {
    title: "Lumen Café",
    tag: "Hospitality",
    img: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?auto=format&fit=crop&w=1000&q=80",
    alt: "Warm café interior with timber seating and pendant lighting",
  },
  {
    title: "Atelier Offices",
    tag: "Workplace",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80",
    alt: "Bright open-plan office with neutral furniture and greenery",
  },
  {
    title: "Crescent Townhouse",
    tag: "Residential",
    img: "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1000&q=80",
    alt: "Elegant bedroom with layered textiles and soft lighting",
  },
  {
    title: "Maison Kitchen",
    tag: "Kitchen",
    img: "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=1000&q=80",
    alt: "Refined kitchen with marble surfaces and brass fittings",
  },
  {
    title: "Aria Residence",
    tag: "Residential",
    img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80",
    alt: "Sunlit living room with neutral sofa and timber accents",
  },
  {
    title: "Verde Suite",
    tag: "Hospitality",
    img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80",
    alt: "Boutique hotel suite with warm lighting and lush textures",
  },
  {
    title: "Nordic Bath",
    tag: "Bathroom",
    img: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1000&q=80",
    alt: "Serene stone bathroom with freestanding tub and soft daylight",
  },
  {
    title: "Solis Dining",
    tag: "Residential",
    img: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1000&q=80",
    alt: "Elegant dining room with sculptural lighting and art",
  },
];

type Project = (typeof projects)[number];

function Card({ p, className = "" }: { p: Project; className?: string }) {
  return (
    <article className={`group relative overflow-hidden rounded-sm bg-navy ${className}`}>
      <div className="h-full w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.img}
          alt={p.alt}
          loading="lazy"
          draggable={false}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <p className="text-[11px] uppercase tracking-[0.2em] text-gold">{p.tag}</p>
        <h3 className="mt-1 font-serif text-xl text-cream">{p.title}</h3>
      </div>
    </article>
  );
}

export default function Portfolio() {
  const desktop = useIsDesktop();
  const reduce = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);
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
      <section id="portfolio" ref={section} className="bg-ink py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionReveal className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.3em] text-gold">Selected Work</p>
              <h2 className="mt-5 font-serif text-4xl font-light leading-tight text-cream sm:text-5xl">
                A portfolio built on detail.
              </h2>
            </div>
            <a href="#contact" className="text-sm tracking-wide text-gold transition-colors hover:text-gold-soft">
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
      <div ref={pinWrap} className="flex h-dvh flex-col justify-center overflow-hidden">
        <div className="mx-auto flex w-full max-w-7xl items-end justify-between gap-6 px-6 pb-10 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Selected Work</p>
            <h2 className="mt-5 font-serif text-4xl font-light leading-tight text-cream sm:text-5xl">
              A portfolio built on detail.
            </h2>
          </div>
          <span className="hidden text-xs uppercase tracking-[0.25em] text-cream/40 lg:block">
            Scroll to explore →
          </span>
        </div>

        <div ref={track} className="flex gap-6 pl-6 lg:pl-10">
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
