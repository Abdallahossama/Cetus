"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useReducedMotion,
  useInView,
  type Variants,
  type MotionValue,
} from "framer-motion";
import { ArrowDown } from "lucide-react";
import Terrain from "./Terrain";
import SceneBoundary from "./SceneBoundary";
import { useIntro } from "./IntroProvider";
import { useMediaQuery } from "@/lib/useMediaQuery";

// Real-time 3D is client-only and lazy — keeps initial paint light.
const Scene = dynamic(() => import("./three/Scene"), { ssr: false });

const LUXURY_IMG =
  "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1100&q=80";

// Floating credential badges that hover around the 3D room.
const STAT_BADGES = [
  {
    value: "12",
    suffix: "+",
    line1: "Years of",
    line2: "crafting interiors",
    className: "right-1 top-3 lg:right-3",
    depth: 22,
    delay: 0.5,
  },
  {
    value: "180",
    line1: "Projects",
    line2: "delivered",
    className: "left-0 top-[30%] lg:-left-3",
    depth: 32,
    delay: 0.62,
  },
  {
    value: "98",
    suffix: "%",
    line1: "Client",
    line2: "satisfaction",
    className: "left-0 top-[64%] lg:-left-2",
    depth: 24,
    delay: 0.74,
  },
  {
    value: "9",
    line1: "Design",
    line2: "awards",
    className: "bottom-5 right-3 lg:right-6",
    depth: 16,
    delay: 0.86,
  },
] as const;

// Gallery-wall photos that float as a framed backdrop behind the 3D room.
// `depth` drives how strongly each reacts to the cursor — bigger = closer.
const BACKDROP_FRAMES = [
  {
    src: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=520&q=70",
    alt: "Minimal living room with floor-to-ceiling windows",
    className: "left-[-1%] top-[4%] w-[26%] rotate-[-7deg]",
    depth: 26,
    delay: 0.2,
  },
  {
    src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=520&q=70",
    alt: "Elegant living room with sofa and warm lighting",
    className: "right-[4%] top-[12%] w-[22%] rotate-[6deg]",
    depth: 16,
    delay: 0.32,
  },
  {
    src: "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=520&q=70",
    alt: "Elegant bedroom with layered textiles and soft lighting",
    className: "bottom-[6%] left-[12%] w-[24%] rotate-[4deg]",
    depth: 21,
    delay: 0.44,
  },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { done } = useIntro();
  const [mounted, setMounted] = useState(false);
  // SSR-safe client mount guard — intentional one-shot state set on mount.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  // Drag-to-rotate only with a real pointer (so touch scroll isn't trapped).
  const pointerFine = useMediaQuery("(pointer: fine)");
  // Phones run the 3D in a lighter, smaller, low-power mode.
  const isMobile = useMediaQuery("(max-width: 767px)");
  // Pause the WebGL render loop once the hero scrolls out of view.
  const heroInView = useInView(sectionRef, { amount: 0.15 });

  /* Scroll-driven parallax */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const visualY = useTransform(scrollYProgress, [0, 1], [0, 110]);

  /* Mouse parallax for the floating photo + badges */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const cfg = { stiffness: 150, damping: 18, mass: 0.4 };
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), cfg);
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), cfg);

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    if (reduceMotion) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }
  function resetMouse() {
    mx.set(0);
    my.set(0);
  }

  // Show the interactive 3D room on every screen (the static photo is only a
  // fallback for reduced-motion users). On touch devices it gently auto-spins.
  const show3D = mounted && !reduceMotion;

  return (
    <section
      id="top"
      ref={sectionRef}
      className="bg-velvet grain relative flex min-h-dvh items-center overflow-hidden pt-28 pb-16 lg:pt-20"
    >
      {/* Faint room photo on the left, dissolving into the navy field */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{
            backgroundImage: `url(${LUXURY_IMG})`,
            maskImage:
              "linear-gradient(to right, black 0%, black 24%, transparent 58%)",
            WebkitMaskImage:
              "linear-gradient(to right, black 0%, black 24%, transparent 58%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/30" />
      </div>

      {/* Signature gold terrain — clustered lower-right, faded away from copy */}
      <Terrain
        variant="hero"
        opacity={0.32}
        className="[mask-image:linear-gradient(to_top,black_30%,transparent_85%)]"
      />
      {/* Soft royal glow behind the visual */}
      <div className="pointer-events-none absolute left-[58%] top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-royal/30 blur-[140px]" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-6 lg:px-10">
        {/* ---------- Copy ---------- */}
        <motion.div style={reduceMotion ? undefined : { y: contentY, opacity: contentOpacity }}>
          <motion.div variants={container} initial="hidden" animate={done ? "show" : "hidden"}>
            <motion.p variants={item} className="eyebrow mb-7">
              Interior Design Studio
            </motion.p>
            <motion.h1
              variants={item}
              className="font-serif text-[3.1rem] font-normal leading-[1.05] text-beige sm:text-7xl lg:text-[clamp(3.5rem,7vw,6rem)]"
            >
              Spaces designed
              <br className="hidden sm:block" /> to be{" "}
              <span className="text-foil italic">
                lived in
                <span aria-hidden="true" className="ml-2 align-super text-[0.45em] text-gold-lite">
                  ✦
                </span>
              </span>
            </motion.h1>
            <motion.p
              variants={item}
              className="mt-8 max-w-md text-base leading-[1.75] text-beige-dim sm:text-lg"
            >
              Cetus Design shapes refined residential and commercial interiors —
              guiding every project from first conversation to final styling.
            </motion.p>
            <motion.div variants={item} className="mt-11 flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="btn-foil font-cinzel px-7 py-3.5 text-[12px] uppercase tracking-[0.18em]"
              >
                Book a Consultation
              </a>
              <a
                href="#portfolio"
                className="btn-outline font-cinzel px-7 py-3.5 text-[12px] uppercase tracking-[0.18em]"
              >
                View Our Work
              </a>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ---------- Interior vignette (3D) + luxury photo ---------- */}
        <motion.div
          style={reduceMotion ? undefined : { y: visualY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: done ? 1 : 0 }}
          transition={{ duration: 1, ease, delay: 0.1 }}
          className="relative mx-auto aspect-square w-full max-w-[15rem] sm:aspect-[4/5] sm:max-w-md lg:aspect-[4/3] lg:max-w-none"
          onMouseMove={handleMouse}
          onMouseLeave={resetMouse}
        >
          {/* Framed gallery-wall backdrop — floats behind the 3D room */}
          {show3D && (
            <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
              {BACKDROP_FRAMES.map((f, i) => (
                <BackdropFrame key={i} frame={f} mx={mx} my={my} reduceMotion={!!reduceMotion} />
              ))}
            </div>
          )}

          {/* WebGL interior vignette (≥768px) */}
          <div className="absolute inset-0 z-[1]">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/20 blur-3xl" />
            {show3D && (
              <SceneBoundary fallback={null}>
                <Scene
                  controls={pointerFine}
                  lite={isMobile}
                  active={heroInView}
                  className={pointerFine ? "cursor-grab active:cursor-grabbing" : undefined}
                />
              </SceneBoundary>
            )}
          </div>

          {/* Luxury photo — only when the 3D room is NOT shown (phones / reduced motion),
              so it never covers the dollhouse room. */}
          {!show3D && (
            <div className="absolute inset-0 [perspective:1000px]">
              <motion.div
                style={reduceMotion ? undefined : { rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
                className="relative h-full w-full overflow-hidden rounded-sm border border-gold/25 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.8)]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={LUXURY_IMG}
                  alt="A luxurious modern living room with warm lighting and brass accents"
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-navy/40 via-transparent to-gold/10" />
              </motion.div>
            </div>
          )}

          {/* Floating credential badges */}
          {STAT_BADGES.map((badge) => (
            <StatBadge
              key={badge.line2}
              badge={badge}
              mx={mx}
              my={my}
              reduceMotion={!!reduceMotion}
              show={done}
            />
          ))}

          {/* Animated arrow pointing at the 3D room */}
          {show3D && (
            <div className="pointer-events-none absolute bottom-4 left-0 z-10 hidden -rotate-[6deg] lg:block">
              <AnimatedArrow className="h-16 w-28" />
            </div>
          )}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <a
        href="#about"
        aria-label="Scroll to content"
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-cream/50 transition-colors hover:text-gold lg:flex"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={16} />
        </motion.span>
      </a>
    </section>
  );
}

/** A gold-framed photo in the gallery-wall backdrop: floats, tilts to the cursor for depth. */
function BackdropFrame({
  frame,
  mx,
  my,
  reduceMotion,
}: {
  frame: (typeof BACKDROP_FRAMES)[number];
  mx: MotionValue<number>;
  my: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const cfg = { stiffness: 120, damping: 20, mass: 0.5 };
  const x = useSpring(useTransform(mx, [-0.5, 0.5], [-frame.depth, frame.depth]), cfg);
  const y = useSpring(useTransform(my, [-0.5, 0.5], [-frame.depth * 0.8, frame.depth * 0.8]), cfg);

  return (
    <motion.div
      style={reduceMotion ? undefined : { x, y }}
      initial={{ opacity: 0, scale: 0.92, y: 24 }}
      animate={{ opacity: 0.62, scale: 1, y: 0 }}
      transition={{ duration: 1.1, ease, delay: frame.delay }}
      className={`absolute ${frame.className}`}
    >
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: frame.delay }}
        className="overflow-hidden rounded-sm border border-gold/25 bg-navy-2/80 p-1.5 shadow-[0_24px_50px_-28px_rgba(0,0,0,0.8)] backdrop-blur-[1px]"
      >
        <div className="relative overflow-hidden rounded-[1px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={frame.src} alt={frame.alt} className="aspect-[4/5] w-full object-cover opacity-80" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
        </div>
      </motion.div>
    </motion.div>
  );
}

/** A small premium credential badge that floats and parallaxes around the 3D room. */
function StatBadge({
  badge,
  mx,
  my,
  reduceMotion,
  show,
}: {
  badge: (typeof STAT_BADGES)[number];
  mx: MotionValue<number>;
  my: MotionValue<number>;
  reduceMotion: boolean;
  show: boolean;
}) {
  const cfg = { stiffness: 150, damping: 18, mass: 0.4 };
  const x = useSpring(useTransform(mx, [-0.5, 0.5], [badge.depth, -badge.depth]), cfg);
  const y = useSpring(useTransform(my, [-0.5, 0.5], [badge.depth * 0.8, -badge.depth * 0.8]), cfg);

  return (
    <motion.div
      style={reduceMotion ? undefined : { x, y }}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : -12 }}
      transition={{ duration: 0.8, ease, delay: badge.delay }}
      className={`absolute z-20 ${badge.className}`}
    >
      <div className="relative overflow-hidden rounded-md border border-gold/25 bg-navy-2/85 px-1.5 py-1 shadow-[0_18px_38px_-20px_rgba(0,0,0,0.75)] backdrop-blur-xl sm:rounded-lg sm:px-3 sm:py-2">
        {/* Soft gold glow in the corner */}
        <div className="pointer-events-none absolute -right-4 -top-4 h-9 w-9 rounded-full bg-gold/20 blur-lg sm:-right-5 sm:-top-5 sm:h-12 sm:w-12 sm:blur-xl" />
        {/* Top hairline accent */}
        <div className="pointer-events-none absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

        <div className="relative flex items-center gap-1.5 sm:gap-2">
          <div className="flex items-baseline">
            <span className="text-foil font-serif text-base leading-none sm:text-2xl">
              {badge.value}
            </span>
            {"suffix" in badge && badge.suffix && (
              <span className="font-serif text-[10px] leading-none text-gold/70 sm:text-sm">
                {badge.suffix}
              </span>
            )}
          </div>
          <span className="h-4 w-px bg-gradient-to-b from-transparent via-gold/45 to-transparent sm:h-6" />
          <div className="leading-tight">
            <p className="font-cinzel text-[7px] uppercase tracking-[0.16em] text-beige sm:text-[9px] sm:tracking-[0.18em]">
              {badge.line1}
            </p>
            <p className="text-[7px] uppercase tracking-[0.16em] text-beige-dim sm:text-[9px] sm:tracking-[0.18em]">
              {badge.line2}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/** A cool, looping gold arrow that draws itself and bobs — points at the 3D room. */
function AnimatedArrow({ className }: { className?: string }) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 130 80" fill="none" className="h-full w-full overflow-visible">
        <motion.path
          d="M6 64 C 28 30, 72 18, 118 24"
          stroke="#c6a75e"
          strokeWidth={2.5}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1] }}
          transition={{
            duration: 1.5,
            ease: [0.22, 1, 0.36, 1],
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: 0.5,
          }}
        />
        <motion.path
          d="M102 12 L120 24 L104 38"
          stroke="#c6a75e"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1], opacity: [0, 1, 1] }}
          transition={{
            duration: 0.7,
            delay: 1,
            ease: "easeOut",
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: 1.3,
          }}
        />
      </svg>
    </motion.div>
  );
}
