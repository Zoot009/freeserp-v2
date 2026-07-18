"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useInView, animate } from "framer-motion";

/**
 * Animates the numeric run within a label like "50M+", "190+", "2 min",
 * "+100%", or "^336%". Splits any leading non-digit prefix (+, ^, currency
 * signs, ...) and trailing unit/suffix from the digits so only the number
 * counts up, while prefix/suffix stay static. Labels with no digits at all
 * (e.g. "Millions") render unchanged, un-animated.
 */
export function AnimatedCounter({ value }: { value: string }) {
  const { prefix, target, suffix, isInteger } = useMemo(() => {
    const match = value.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
    return {
      prefix: match ? match[1] : "",
      target: match ? parseFloat(match[2]) : null,
      suffix: match ? match[3] : "",
      isInteger: match ? Number.isInteger(parseFloat(match[2])) : true,
    };
  }, [value]);

  const start = target === null ? 0 : Math.min(1, target);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(target === null ? value : String(start));

  useEffect(() => {
    if (!inView || target === null) return;
    const controls = animate(start, target, {
      duration: 2,
      ease: "easeOut",
      onUpdate(v) {
        setDisplay(isInteger ? String(Math.round(v)) : v.toFixed(1));
      },
    });
    return () => controls.stop();
  }, [inView, target, isInteger, start]);

  if (target === null) {
    return <span>{value}</span>;
  }

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
