"use client";

import { motion, useReducedMotion } from "framer-motion";

/* Hand-authored organic branching veins (viewBox 1440 x 760). */
const VEINS = [
  "M -20 120 C 180 160, 300 80, 430 180 C 560 280, 540 420, 700 470 C 880 525, 1000 470, 1120 560 C 1240 650, 1340 620, 1460 700",
  "M 430 180 C 470 90, 560 60, 650 30",
  "M 700 470 C 700 560, 760 640, 720 740",
  "M 1120 560 C 1180 510, 1280 520, 1320 450",
  "M 1460 90 C 1280 130, 1200 60, 1080 170 C 980 260, 1010 360, 900 410",
  "M 1080 170 C 1120 110, 1100 50, 1160 -10",
  "M -20 520 C 140 500, 220 560, 320 540 C 430 520, 470 600, 600 600",
];

/* Gold dust — fixed coords so SSR and client render identically. */
const DUST = [
  [415, 175, 2.4], [690, 466, 2.8], [1118, 558, 2.2], [648, 33, 1.8],
  [722, 738, 2.1], [1318, 452, 1.6], [905, 408, 2.6], [322, 540, 2.0],
  [598, 600, 1.7], [262, 118, 1.4], [540, 300, 2.2], [980, 500, 1.9],
  [1200, 600, 1.5], [470, 120, 1.6], [1075, 175, 2.3], [360, 470, 1.8],
  [820, 520, 1.5], [1010, 360, 1.7], [150, 510, 1.4], [1260, 640, 2.0],
];

type Props = {
  className?: string;
  opacity?: number;
  /** Mirror horizontally for variety between sections. */
  flip?: boolean;
};

export default function KintsugiVeins({
  className = "",
  opacity = 0.5,
  flip = false,
}: Props) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ opacity, transform: flip ? "scaleX(-1)" : undefined }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 760"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        <defs>
          <linearGradient id="veinGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#9c7c3a" />
            <stop offset="50%" stopColor="#e7cf8f" />
            <stop offset="100%" stopColor="#c6a75e" />
          </linearGradient>
          <filter id="veinGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Soft bloom layer (thicker, blurred, low opacity) */}
        <motion.g
          filter="url(#veinGlow)"
          animate={reduceMotion ? undefined : { opacity: [0.45, 0.75, 0.45] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          {VEINS.map((d, i) => (
            <motion.path
              key={`glow-${i}`}
              d={d}
              fill="none"
              stroke="url(#veinGold)"
              strokeWidth={3.5}
              strokeLinecap="round"
              initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.5 }}
              viewport={{ once: true }}
              transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1], delay: i * 0.18 }}
            />
          ))}
        </motion.g>

        {/* Sharp thin veins */}
        {VEINS.map((d, i) => (
          <motion.path
            key={`vein-${i}`}
            d={d}
            fill="none"
            stroke="url(#veinGold)"
            strokeWidth={1.1}
            strokeLinecap="round"
            initial={reduceMotion ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1], delay: i * 0.18 }}
          />
        ))}

        {/* Gold dust speckle */}
        <g fill="#e7cf8f">
          {DUST.map(([cx, cy, r], i) => (
            <motion.circle
              key={`dust-${i}`}
              cx={cx}
              cy={cy}
              r={r}
              initial={reduceMotion ? false : { opacity: 0, scale: 0 }}
              whileInView={{ opacity: [0, 0.9, 0.55], scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 1 + (i % 8) * 0.12 }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
