"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import KintsugiVeins from "./KintsugiVeins";

const WORD = ["C", "E", "T", "U", "S"];

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const lifted = useRef(false);

  // Lift the curtain and hand control back to the app.
  const lift = (fast = false) => {
    if (lifted.current) return;
    lifted.current = true;
    tl.current?.kill();
    gsap.to(root.current, {
      yPercent: -100,
      duration: fast ? 0.6 : 0.9,
      ease: "power4.inOut",
      onComplete,
    });
  };

  useGSAP(
    () => {
      const letters = root.current!.querySelectorAll("[data-letter]");
      const counter = { v: 0 };

      gsap.set(letters, { yPercent: 120, rotateX: -85, opacity: 0 });
      gsap.set(bar.current, { scaleX: 0, transformOrigin: "left center" });

      tl.current = gsap
        .timeline({ defaults: { ease: "power3.out" }, onComplete: () => lift() })
        .to(
          letters,
          { yPercent: 0, rotateX: 0, opacity: 1, stagger: 0.08, duration: 0.7 },
          0.15
        )
        .to(bar.current, { scaleX: 1, duration: 1.5, ease: "power1.inOut" }, 0.15)
        .to(
          counter,
          {
            v: 100,
            duration: 1.5,
            ease: "power1.inOut",
            onUpdate: () => {
              if (count.current)
                count.current.textContent = String(
                  Math.round(counter.v)
                ).padStart(2, "0");
            },
          },
          0.15
        )
        .to({}, { duration: 0.25 });
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      onClick={() => lift(true)}
      className="bg-velvet grain fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      role="status"
      aria-label="Loading Cetus Design"
    >
      <KintsugiVeins opacity={0.5} />

      <div className="relative z-10 flex flex-col items-center [perspective:800px]">
        <h1 className="flex font-serif text-6xl tracking-[0.15em] text-cream sm:text-8xl">
          {WORD.map((l, i) => (
            <span key={i} data-letter className="inline-block [transform-style:preserve-3d]">
              {l}
            </span>
          ))}
          <span data-letter className="inline-block text-gold">
            .
          </span>
        </h1>

        <p className="mt-6 text-[10px] uppercase tracking-[0.4em] text-cream/50">
          Interior Design Studio
        </p>

        {/* progress bar + counter */}
        <div className="mt-10 flex w-56 items-center gap-4">
          <span className="relative h-px flex-1 bg-cream/15">
            <span
              ref={bar}
              className="absolute inset-0 block bg-gradient-to-r from-gold to-gold-soft"
            />
          </span>
          <span ref={count} className="font-serif text-sm text-gold">
            00
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          lift(true);
        }}
        className="absolute bottom-8 right-8 z-10 text-xs uppercase tracking-[0.25em] text-cream/40 transition-colors hover:text-gold"
      >
        Skip
      </button>
    </div>
  );
}
