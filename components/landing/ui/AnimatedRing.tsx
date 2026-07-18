"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "framer-motion";

/** Shared 1 → target % animation, triggered once the ref scrolls into view. */
function useAnimatedPercent(pct: string) {
  const target = parseInt(pct) || 0;
  const start = Math.min(1, target);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(start);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(start, target, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate(v) {
        setDisplay(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [inView, target, start]);

  return { ref, display };
}

/**
 * Radial conic-gradient meter that animates its fill (and the % label inside
 * it) from 1 up to the target value once scrolled into view — mirrors
 * AnimatedCounter's useInView + animate pattern for the number-counter cards.
 */
export function AnimatedRing({
  pct,
  color,
  children,
}: {
  pct: string;
  color: string;
  children?: React.ReactNode;
}) {
  const { ref, display } = useAnimatedPercent(pct);

  return (
    <div
      ref={ref}
      className="mx-auto flex h-26 w-26 items-center justify-center rounded-full sm:h-32.5 sm:w-32.5"
      style={{
        background: `conic-gradient(${color} 0 ${display / 100}turn, #e6e9f2 ${display / 100}turn 1turn)`,
      }}
    >
      <div className="flex h-19 w-19 flex-col items-center justify-center rounded-full bg-white sm:h-24 sm:w-24">
        <span className="text-[20px] font-extrabold text-[#0b1020] sm:text-[26px]">
          {display}%
        </span>
        {children}
      </div>
    </div>
  );
}

/**
 * Compact version used by the thematic breakdown cards — a small ring with a
 * plain white center hole, and the animated % rendered as a sibling label
 * rather than inside the ring.
 */
export function AnimatedMiniRing({ pct, color }: { pct: string; color: string }) {
  const { ref, display } = useAnimatedPercent(pct);

  return (
    <>
      <div
        ref={ref}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full sm:h-8.5 sm:w-8.5"
        style={{
          background: `conic-gradient(${color} 0 ${display / 100}turn, #e6e9f2 ${display / 100}turn 1turn)`,
        }}
      >
        <div className="h-4.5 w-4.5 rounded-full bg-white sm:h-5.5 sm:w-5.5" />
      </div>
      <span className="text-sm font-extrabold text-[#0b1020] sm:text-[17px]">{display}%</span>
    </>
  );
}
