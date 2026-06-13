"use client";

import { motion, useReducedMotion } from "framer-motion";

/* A single horizontal kintsugi seam that cracks gently across the width. */
const SEAM =
  "M 0 20 C 180 12, 300 28, 460 18 C 620 8, 700 30, 880 22 C 1040 15, 1160 30, 1320 18 C 1400 12, 1440 22, 1440 20";

export default function VeinDivider() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative mx-auto max-w-7xl px-6 lg:px-10" aria-hidden="true">
      <svg
        viewBox="0 0 1440 40"
        preserveAspectRatio="none"
        className="h-8 w-full overflow-visible"
      >
        <defs>
          <linearGradient id="seamGold" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#c6a75e" stopOpacity="0" />
            <stop offset="50%" stopColor="#e7cf8f" stopOpacity="1" />
            <stop offset="100%" stopColor="#c6a75e" stopOpacity="0" />
          </linearGradient>
          <filter id="seamGlow" x="-5%" y="-200%" width="110%" height="500%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        <motion.path
          d={SEAM}
          fill="none"
          stroke="url(#seamGold)"
          strokeWidth={3}
          filter="url(#seamGlow)"
          opacity={0.5}
          initial={reduceMotion ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.path
          d={SEAM}
          fill="none"
          stroke="url(#seamGold)"
          strokeWidth={1}
          initial={reduceMotion ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
    </div>
  );
}
