"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Clock, PackageCheck } from "lucide-react";
import { phases } from "@/lib/process";

const AUTOPLAY_MS = 6500;
const ease = [0.22, 1, 0.36, 1] as const;

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

/** The non-pinned slide deck — used on mobile and with reduced motion. */
export default function ProcessSlides() {
  const reduceMotion = useReducedMotion();
  const [[page, dir], setPage] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);
  const index = ((page % phases.length) + phases.length) % phases.length;
  const phase = phases[index];

  const paginate = useCallback((next: number) => {
    setPage(([p]) => [p + next, next]);
  }, []);

  const goTo = useCallback((target: number) => {
    setPage(([p]) => {
      const current = ((p % phases.length) + phases.length) % phases.length;
      return [p + (target - current), target > current ? 1 : -1];
    });
  }, []);

  useEffect(() => {
    if (paused || reduceMotion) return;
    const id = setTimeout(() => paginate(1), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [page, paused, reduceMotion, paginate]);

  function onDragEnd(_e: unknown, info: PanInfo) {
    if (info.offset.x < -80) paginate(1);
    else if (info.offset.x > 80) paginate(-1);
  }

  return (
    <div
      className="relative mt-12"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="mb-6 flex items-center justify-end gap-5">
        <span className="font-serif text-sm text-cream/60">
          <span className="text-gold">{phase.no}</span> / 0{phases.length}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => paginate(-1)}
            aria-label="Previous phase"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 text-cream transition-colors hover:border-gold hover:text-gold"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => paginate(1)}
            aria-label="Next phase"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 text-cream transition-colors hover:border-gold hover:text-gold"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-sm border border-gold/15 bg-ink">
        <AnimatePresence custom={dir} mode="wait">
          <motion.div
            key={page}
            custom={dir}
            variants={reduceMotion ? undefined : slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease }}
            drag={reduceMotion ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={onDragEnd}
            className="grid cursor-grab grid-cols-1 active:cursor-grabbing lg:grid-cols-2"
          >
            <div className="relative aspect-[16/11] overflow-hidden lg:aspect-auto lg:min-h-[26rem]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={phase.img}
                alt={phase.alt}
                className="h-full w-full select-none object-cover"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent lg:bg-gradient-to-r" />
              <span className="pointer-events-none absolute left-6 top-6 font-serif text-6xl text-cream/15 sm:text-7xl">
                {phase.no}
              </span>
            </div>

            <div className="flex flex-col justify-center gap-5 p-8 sm:p-12">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold">
                  <phase.icon size={20} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span className="text-xs uppercase tracking-[0.3em] text-gold">
                  {phase.kicker}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-cream/15 px-3 py-1 text-[11px] tracking-wide text-cream/65">
                  <Clock size={12} className="text-gold" aria-hidden="true" />
                  {phase.duration}
                </span>
              </div>
              <h3 className="font-serif text-3xl font-light text-cream sm:text-4xl">
                {phase.title}
              </h3>
              <p className="max-w-md text-sm leading-relaxed text-cream/70 sm:text-base">
                {phase.description}
              </p>
              <ul className="mt-2 space-y-3">
                {phase.steps.map((s) => (
                  <li key={s} className="flex items-center gap-3 text-sm text-cream/85">
                    <Check size={16} className="shrink-0 text-gold" aria-hidden="true" />
                    {s}
                  </li>
                ))}
              </ul>
              <p className="mt-1 flex items-start gap-2.5 border-l-2 border-gold/40 pl-3 text-sm text-cream/70">
                <PackageCheck size={16} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                <span>
                  <span className="text-cream/50">You receive: </span>
                  {phase.deliverable}
                </span>
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-7 flex items-center justify-center gap-3">
        {phases.map((p, i) => (
          <button
            key={p.no}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to phase ${p.no}: ${p.kicker}`}
            aria-current={i === index}
            className="h-2.5 rounded-full bg-cream/20 transition-all"
            style={{ width: i === index ? 40 : 10, background: i === index ? "var(--color-gold)" : undefined }}
          />
        ))}
      </div>
    </div>
  );
}
