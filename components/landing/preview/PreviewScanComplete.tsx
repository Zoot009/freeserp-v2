"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { renderTemplate } from "@/lib/landing/template";
import type { PreviewDict } from "./PreviewDashboard";

/**
 * The "analysis complete" beat.
 *
 * Plays for a beat when the crawl finishes, BEFORE the unlock card rises: a
 * progress ring races to 100%, the number counts up beneath it, a checkmark pops
 * as it lands, and a light bar sweeps the whole dashboard body. It sells that a
 * real scan just finished — so the ask that follows lands on a completed result
 * rather than appearing out of nowhere.
 *
 * Purely presentational and self-contained. It anchors to the same relative
 * wrapper as the unlock card (see PreviewDashboard), covering the two-column
 * body. aria-hidden throughout: the live region in PreviewOverlay already
 * announces state to assistive tech, and this is decorative reinforcement.
 */

// Ring geometry — r=30 on a 72px box, so the 8px track clears the edges.
const R = 30;
const CIRC = 2 * Math.PI * R;
/** Ring fill duration; the count-up and sweep are paced to match. */
const FILL_MS = 850;

export default function PreviewScanComplete({
  domain,
  dict,
}: {
  domain: string;
  dict: PreviewDict;
}) {
  const reduce = useReducedMotion();
  const [pct, setPct] = useState(reduce ? 100 : 0);
  const done = pct >= 100;

  // Count the centred number up in lockstep with the ring. rAF rather than a
  // fixed-step interval so it tracks wall-clock even if the tab stutters, and it
  // stops the instant it reaches 100 so `done` flips the number to a checkmark.
  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    let start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / FILL_MS);
      setPct(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  return (
    <motion.div
      className="fsp-scan-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      aria-hidden
    >
      {/* Light bar crossing the whole body — the same idea as the table's own
          crawl sweep, scaled up to read as "scanning the dashboard". */}
      <span className="fsp-scan-sweep" aria-hidden>
        <i />
      </span>

      <motion.div
        className="fsp-scan-card"
        initial={{ opacity: 0, scale: 0.94, y: 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: -4 }}
        transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="fsp-scan-ring">
          <svg width={72} height={72} viewBox="0 0 72 72">
            {/* Track */}
            <circle cx={36} cy={36} r={R} className="track" />
            {/* Progress — drawn from 12 o'clock, filling clockwise. */}
            <motion.circle
              cx={36}
              cy={36}
              r={R}
              className={`prog${done ? " done" : ""}`}
              strokeDasharray={CIRC}
              initial={{ strokeDashoffset: reduce ? 0 : CIRC }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: reduce ? 0 : FILL_MS / 1000, ease: "easeInOut" }}
              transform="rotate(-90 36 36)"
            />
          </svg>

          {/* Number while filling, checkmark once it lands. */}
          <span className="fsp-scan-num">
            {done ? (
              <motion.svg
                width={26}
                height={26}
                viewBox="0 0 24 24"
                fill="none"
                initial={{ scale: reduce ? 1 : 0.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 520, damping: 18 }}
              >
                <path
                  d="M5 12.5L10 17.5L19 7"
                  stroke="currentColor"
                  strokeWidth={2.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            ) : (
              <span className="n">{pct}</span>
            )}
          </span>
        </span>

        <span className="fsp-scan-t">{dict.scanTitle}</span>
        <span className="fsp-scan-s">{renderTemplate(dict.scanSub, { domain })}</span>
      </motion.div>
    </motion.div>
  );
}
