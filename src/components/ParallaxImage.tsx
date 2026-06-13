"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

type Props = {
  src: string;
  alt: string;
  className?: string;
  /** How far the image drifts within its frame, in px. */
  amount?: number;
};

/** Image that gently parallaxes within its frame as the page scrolls. */
export default function ParallaxImage({
  src,
  alt,
  className = "",
  amount = 60,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-amount, amount]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={reduceMotion ? undefined : { y }}
        className="absolute inset-0 h-[calc(100%+8rem)] w-full -translate-y-16 object-cover"
      />
    </div>
  );
}
