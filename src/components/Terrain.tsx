import type { CSSProperties } from "react";

type Variant = "hero" | "texture" | "divider";

type Props = {
  variant?: Variant;
  /** Target opacity 0.2–0.35 — it should whisper, not shout. */
  opacity?: number;
  /** Extra classes (positioning, mask, blend overrides). */
  className?: string;
};

/**
 * Signature gold topographic terrain. Renders one of the /public SVGs as a
 * non-interactive, screen-blended background that slowly draws in once.
 */
export default function Terrain({
  variant = "hero",
  opacity = 0.3,
  className = "",
}: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/terrain-${variant}.svg`}
      alt=""
      aria-hidden="true"
      style={{ "--terrain-opacity": opacity } as CSSProperties}
      className={`terrain-draw pointer-events-none absolute inset-0 h-full w-full object-cover mix-blend-screen ${className}`}
    />
  );
}
