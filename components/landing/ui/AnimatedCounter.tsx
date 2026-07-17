"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useInView, animate } from "framer-motion";

/**
 * Animates a numeric prefix within a label like "50M+", "190+", "2 min".
 * Splits the leading digits from the trailing unit/suffix so only the
 * number counts up, and the "M+" / " min" stays static.
 */
export function AnimatedCounter({ value }: { value: string }) {
  const { target, suffix, isInteger } = useMemo(() => {
    const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
    return {
      target: match ? parseFloat(match[1]) : null,
      suffix: match ? match[2] : "",
      isInteger: match ? Number.isInteger(parseFloat(match[1])) : true,
    };
  }, [value]);

  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(target === null ? value : "0");

  useEffect(() => {
    if (!inView || target === null) return;
    const controls = animate(0, target, {
      duration: 2,
      ease: "easeOut",
      onUpdate(v) {
        setDisplay(isInteger ? String(Math.round(v)) : v.toFixed(1));
      },
    });
    return () => controls.stop();
  }, [inView, target, isInteger]);

  if (target === null) {
    return <span>{value}</span>;
  }

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}
