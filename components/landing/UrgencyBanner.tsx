"use client";

import { useEffect, useState } from "react";
import { getPublicStats } from "@/lib/landing/stats";
import { renderTemplate } from "@/lib/landing/template";

type UrgencyDict = {
  countdownLabel: string;
  momentumLine: string;
  momentumFallback: string;
};

function msUntilNextUtcMonth(): number {
  const now = new Date();
  const next = Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0);
  return Math.max(0, next - now.getTime());
}

function formatCountdown(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Slim always-visible banner above Header (which is a scroll-triggered fixed
 * overlay, invisible for the first 400px — folding urgency into it would hide it
 * on load). Countdown is deliberately neutral (no claimed deadline/consequence,
 * since no real backend mechanic resets monthly) — persuasion comes from the
 * genuinely live momentum stat beside it, not an invented offer. SSR/first paint
 * show only the static momentum fallback; the ticking countdown and live number
 * are a post-mount enhancement, so there's no hydration mismatch.
 */
export default function UrgencyBanner({ dict }: { dict: UrgencyDict }) {
  const [mounted, setMounted] = useState(false);
  const [countdown, setCountdown] = useState("");
  const [liveCount, setLiveCount] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setCountdown(formatCountdown(msUntilNextUtcMonth()));
    const tick = setInterval(() => setCountdown(formatCountdown(msUntilNextUtcMonth())), 1000);

    let cancelled = false;
    getPublicStats().then((stats) => {
      if (!cancelled && stats) setLiveCount(stats.checksLast24h.toLocaleString());
    });

    return () => {
      cancelled = true;
      clearInterval(tick);
    };
  }, []);

  const momentumText = renderTemplate(dict.momentumLine, { count: liveCount ?? dict.momentumFallback });

  return (
    <div className="relative z-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-[#0b1020] px-4 py-2 text-center text-xs font-semibold text-white sm:text-[13px]">
      <span>{momentumText}</span>
      {mounted && (
        <>
          <span aria-hidden className="text-white/30">
            ·
          </span>
          <span className="tabular-nums text-mint">
            {dict.countdownLabel} {countdown}
          </span>
        </>
      )}
    </div>
  );
}
