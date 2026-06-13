"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { Check } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { phases } from "@/lib/process";
import { useIsDesktop, usePrefersReducedMotion } from "@/lib/useMediaQuery";
import KintsugiVeins from "./KintsugiVeins";
import ProcessSlides from "./ProcessSlides";

function Header() {
  return (
    <div className="max-w-2xl">
      <p className="text-xs uppercase tracking-[0.3em] text-gold">How We Work</p>
      <h2 className="mt-5 font-serif text-3xl font-light leading-tight text-cream sm:text-4xl lg:text-5xl">
        Three phases, one seamless journey.
      </h2>
    </div>
  );
}

export default function Process() {
  const desktop = useIsDesktop();
  const reduce = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const pinned = mounted && desktop && !reduce;

  const section = useRef<HTMLElement>(null);
  const pinWrap = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!pinned) return;
      const blocks = gsap.utils.toArray<HTMLElement>("[data-phase]");
      const imgs = gsap.utils.toArray<HTMLElement>("[data-img]");

      gsap.set(blocks.slice(1), { autoAlpha: 0, y: 60 });
      gsap.set(imgs.slice(1), { autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "+=2600",
          pin: pinWrap.current,
          scrub: 1,
          onUpdate: (self) => {
            const i = Math.min(
              phases.length - 1,
              Math.floor(self.progress * phases.length)
            );
            if (counter.current) counter.current.textContent = phases[i].no;
            if (bar.current)
              bar.current.style.transform = `scaleY(${self.progress})`;
          },
        },
      });

      // Continuous slow zoom across the whole sequence (Ken Burns).
      tl.fromTo("[data-kb]", { scale: 1.14 }, { scale: 1, ease: "none", duration: 3 }, 0)
        // copy crossfade
        .to(blocks[0], { autoAlpha: 0, y: -60, duration: 0.5 }, 0.85)
        .fromTo(blocks[1], { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.95)
        .to(blocks[1], { autoAlpha: 0, y: -60, duration: 0.5 }, 1.85)
        .fromTo(blocks[2], { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 1.95)
        // image crossfade
        .to(imgs[0], { autoAlpha: 0, duration: 0.6 }, 0.8)
        .to(imgs[1], { autoAlpha: 1, duration: 0.6 }, 0.8)
        .to(imgs[1], { autoAlpha: 0, duration: 0.6 }, 1.8)
        .to(imgs[2], { autoAlpha: 1, duration: 0.6 }, 1.8)
        .to({}, { duration: 0.5 }, 2.5);

      ScrollTrigger.refresh();
    },
    { scope: section, dependencies: [pinned] }
  );

  /* -------- Fallback: slide deck (mobile / reduced motion) -------- */
  if (!pinned) {
    return (
      <section
        id="process"
        ref={section}
        className="bg-velvet grain relative overflow-hidden py-20 sm:py-24 lg:py-32"
      >
        <KintsugiVeins opacity={0.18} flip />
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
          <Header />
          <ProcessSlides />
        </div>
      </section>
    );
  }

  /* -------- Pinned image scroll sequence (desktop) -------- */
  return (
    <section id="process" ref={section} className="relative">
      <div
        ref={pinWrap}
        className="bg-velvet grain relative h-dvh w-full overflow-hidden"
      >
        <KintsugiVeins opacity={0.16} flip />

        {/* Progress rail */}
        <div className="absolute left-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex">
          <span ref={counter} className="font-serif text-sm text-gold">
            01
          </span>
          <span className="relative h-40 w-px bg-cream/15">
            <span
              ref={bar}
              className="absolute inset-x-0 top-0 block h-full origin-top bg-gold"
              style={{ transform: "scaleY(0)" }}
            />
          </span>
          <span className="font-serif text-xs text-cream/40">0{phases.length}</span>
        </div>

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col px-6 lg:px-16">
          <header className="pt-24 lg:pt-28">
            <Header />
          </header>

          <div className="relative grid flex-1 items-center gap-10 lg:grid-cols-2">
            {/* Phase copy (crossfaded by scroll) */}
            <div className="relative min-h-[22rem] order-2 lg:order-1">
              {phases.map((phase, i) => (
                <div
                  key={phase.no}
                  data-phase
                  className={`absolute inset-0 flex flex-col justify-center gap-5 ${
                    i === 0 ? "" : "opacity-0"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold">
                      <phase.icon size={20} strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <span className="text-xs uppercase tracking-[0.3em] text-gold">
                      {phase.no} · {phase.kicker}
                    </span>
                  </div>
                  <h3 className="font-serif text-3xl font-light text-cream sm:text-4xl">
                    {phase.title}
                  </h3>
                  <p className="max-w-md text-sm leading-relaxed text-cream/70 sm:text-base">
                    {phase.description}
                  </p>
                  <ul className="mt-1 space-y-3">
                    {phase.steps.map((s) => (
                      <li key={s} className="flex items-center gap-3 text-sm text-cream/85">
                        <Check size={16} className="shrink-0 text-gold" aria-hidden="true" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Crossfading room photos */}
            <div className="relative order-1 h-[42vh] w-full overflow-hidden rounded-sm border border-gold/15 lg:order-2 lg:h-[58vh]">
              {phases.map((phase, i) => (
                <div
                  key={phase.no}
                  data-img
                  className={`absolute inset-0 ${i === 0 ? "" : "opacity-0"}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    data-kb
                    src={phase.img}
                    alt={phase.alt}
                    className="h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                  <span className="pointer-events-none absolute left-5 top-5 font-serif text-5xl text-cream/20 sm:text-6xl">
                    {phase.no}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
