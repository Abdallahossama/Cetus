"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin gold bar at the very top that tracks page scroll progress. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-gold via-gold-soft to-gold"
      aria-hidden="true"
    />
  );
}
