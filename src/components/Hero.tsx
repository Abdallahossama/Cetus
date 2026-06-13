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
  type Variants,
  type MotionValue,
} from "framer-motion";
import { ArrowDown } from "lucide-react";
import KintsugiVeins from "./KintsugiVeins";
import SceneBoundary from "./SceneBoundary";
import { useIntro } from "./IntroProvider";
import { useMediaQuery } from "@/lib/useMediaQuery";

// Real-time 3D is client-only and lazy — keeps initial paint light.
const Scene = dynamic(() => import("./three/Scene"), { ssr: false });

const LUXURY_IMG =
  "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1100&q=80";

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
  useEffect(() => setMounted(true), []);
  // Keep WebGL off the smallest phones for performance.
  const allowCanvas = useMediaQuery("(min-width: 768px)");
  // Drag-to-rotate only with a real pointer (so touch scroll isn't trapped).
  const pointerFine = useMediaQuery("(pointer: fine)");

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
  const badgeX = useSpring(useTransform(mx, [-0.5, 0.5], [20, -20]), cfg);
  const badgeY = useSpring(useTransform(my, [-0.5, 0.5], [16, -16]), cfg);

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

  const show3D = mounted && !reduceMotion && allowCanvas;

  return (
    <section
      id="top"
      ref={sectionRef}
      className="bg-velvet grain relative flex min-h-dvh items-center overflow-hidden pt-28 pb-16 lg:pt-20"
    >
      {/* Background photo on the left, gradient-fading into the velvet bg on the right */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-45"
          style={{
            backgroundImage: `url(${LUXURY_IMG})`,
            maskImage:
              "linear-gradient(to right, black 0%, black 30%, transparent 68%)",
            WebkitMaskImage:
              "linear-gradient(to right, black 0%, black 30%, transparent 68%)",
          }}
        />
        {/* Tint for legibility + blend into navy */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-navy/40" />
      </div>

      <KintsugiVeins opacity={0.45} />
      <div className="pointer-events-none absolute left-[55%] top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/12 blur-[130px]" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-6 lg:px-10">
        {/* ---------- Copy ---------- */}
        <motion.div style={reduceMotion ? undefined : { y: contentY, opacity: contentOpacity }}>
          <motion.div variants={container} initial="hidden" animate={done ? "show" : "hidden"}>
            <motion.p variants={item} className="mb-6 text-xs uppercase tracking-[0.35em] text-gold">
              Interior Design Studio
            </motion.p>
            <motion.h1
              variants={item}
              className="font-serif text-[2.6rem] font-light leading-[1.08] text-cream sm:text-6xl lg:text-7xl"
            >
              Spaces designed to be
              <span className="italic text-gold"> lived in</span>.
            </motion.h1>
            <motion.p
              variants={item}
              className="mt-7 max-w-md text-base leading-relaxed text-cream/75 sm:text-lg"
            >
              Cetus Design shapes refined residential and commercial interiors —
              guiding every project from first conversation to final styling.
            </motion.p>
            <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="rounded-full bg-gold px-7 py-3.5 text-sm font-medium text-navy transition-colors hover:bg-gold-soft"
              >
                Book a Consultation
              </a>
              <a
                href="#portfolio"
                className="rounded-full border border-cream/25 px-7 py-3.5 text-sm font-medium text-cream transition-colors hover:border-gold hover:text-gold"
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
          className="relative mx-auto aspect-[4/5] w-full max-w-sm sm:max-w-md lg:aspect-[4/3] lg:max-w-none"
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

          {/* Floating experience badge */}
          <motion.div
            style={reduceMotion ? undefined : { x: badgeX, y: badgeY }}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: done ? 1 : 0, y: done ? 0 : -12 }}
            transition={{ duration: 0.8, ease, delay: 0.5 }}
            className="absolute right-2 top-4 z-20 hidden sm:block lg:right-4"
          >
            <div className="relative overflow-hidden rounded-lg border border-gold/30 bg-gradient-to-br from-navy/95 to-ink/90 px-3 py-2 shadow-[0_16px_36px_-18px_rgba(0,0,0,0.95),0_0_26px_-12px_rgba(198,167,94,0.45)] backdrop-blur-xl">
              {/* Soft gold glow in the corner */}
              <div className="pointer-events-none absolute -right-5 -top-5 h-12 w-12 rounded-full bg-gold/25 blur-xl" />
              {/* Top hairline accent */}
              <div className="pointer-events-none absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

              <div className="relative flex items-center gap-2">
                <div className="flex items-baseline">
                  <span className="font-serif text-2xl leading-none text-gold [text-shadow:0_2px_14px_rgba(198,167,94,0.45)]">
                    12
                  </span>
                  <span className="font-serif text-sm leading-none text-gold/75">+</span>
                </div>
                <span className="h-6 w-px bg-gradient-to-b from-transparent via-gold/55 to-transparent" />
                <div className="leading-tight">
                  <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-cream">
                    Years of
                  </p>
                  <p className="text-[9px] uppercase tracking-[0.18em] text-cream/55">
                    crafting interiors
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

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
        className="overflow-hidden rounded-sm border border-gold/30 bg-navy/60 p-1 shadow-[0_24px_50px_-28px_rgba(0,0,0,0.85)] backdrop-blur-[1px]"
      >
        <div className="relative overflow-hidden rounded-[1px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={frame.src} alt={frame.alt} className="aspect-[4/5] w-full object-cover opacity-75" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/45 via-transparent to-gold/5" />
        </div>
      </motion.div>
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
