"use client";

/**
 * Google & Bing rank tracker, as a try-it card.
 *
 * Mirrors the real product: exclusive position bands (Top 3, 4–10, 11–20,
 * 21–100, Unranked) from position-tracking-card.tsx, day-over-day and 7-day
 * deltas (rankings/deltas.ts d1/d7), engine + device tracked separately, depth
 * 100. All numbers are fixed example data.
 */

import { useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Monitor, Smartphone } from "lucide-react";

const C = {
  blue: "#0454ff",
  ink: "#0b0d12",
  muted: "#6d6d6d",
  border: "#eaeaea",
  soft: "#f5f6f8",
  green: "#16a34a",
  red: "#dc2626",
  amber: "#f5a623",
};
const FOCUS =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#0454ff] focus-visible:ring-offset-2";

type Engine = "google" | "bing";
type Device = "desktop" | "mobile";
type Combo = `${Engine}-${Device}`;
type Pos = number | null;

const DAYS = 30;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Fixed calendar so server and client render the same labels. */
const DATES = Array.from({ length: DAYS }, (_, i) => {
  const d = new Date(Date.UTC(2026, 8, 3 - (DAYS - 1 - i)));
  return `${String(d.getUTCDate()).padStart(2, "0")} ${MONTHS[d.getUTCMonth()]}`;
});

function mulberry32(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** 30 daily positions drifting from `start` to `end`; null = not in the top 100. */
function history(seed: string, start: Pos, end: Pos): Pos[] {
  const r = mulberry32(hash(seed));
  if (start == null && end == null) return Array<Pos>(DAYS).fill(null);
  const from = start ?? 96;
  const to = end ?? 97;
  const dropDay = end == null ? 21 + Math.floor(r() * 5) : DAYS;
  const appearDay = start == null ? 8 + Math.floor(r() * 5) : 0;
  return Array.from({ length: DAYS }, (_, i) => {
    if (i < appearDay || i >= dropDay) return null;
    if (i === DAYS - 1) return to;
    const t = i / (DAYS - 1);
    const base = from + (to - from) * (t * t * (3 - 2 * t));
    const jitter = (r() - 0.5) * Math.max(1.6, base / 8);
    return Math.max(1, Math.round(base + jitter));
  });
}

type KwSpec = { kw: string; vol: number; pos: Record<Combo, [Pos, Pos]> };

const SPECS: KwSpec[] = [
  { kw: "waterproof rain jacket", vol: 40500, pos: { "google-desktop": [14, 3], "google-mobile": [16, 5], "bing-desktop": [9, 2], "bing-mobile": [11, 2] } },
  { kw: "best hiking boots", vol: 33100, pos: { "google-desktop": [8, 6], "google-mobile": [7, 9], "bing-desktop": [5, 4], "bing-mobile": [6, 5] } },
  { kw: "ultralight tent", vol: 12100, pos: { "google-desktop": [22, 12], "google-mobile": [25, 15], "bing-desktop": [18, 8], "bing-mobile": [20, 11] } },
  { kw: "merino base layer", vol: 9900, pos: { "google-desktop": [4, 2], "google-mobile": [5, 3], "bing-desktop": [3, 1], "bing-mobile": [4, 3] } },
  { kw: "down jacket women", vol: 27100, pos: { "google-desktop": [31, 18], "google-mobile": [35, 24], "bing-desktop": [26, 14], "bing-mobile": [29, 19] } },
  { kw: "trail running shoes", vol: 49500, pos: { "google-desktop": [58, 44], "google-mobile": [64, 52], "bing-desktop": [41, 33], "bing-mobile": [47, 38] } },
  { kw: "camping stove review", vol: 6600, pos: { "google-desktop": [88, null], "google-mobile": [null, null], "bing-desktop": [72, 61], "bing-mobile": [null, 84] } },
  { kw: "gore-tex jacket sale", vol: 8100, pos: { "google-desktop": [12, 9], "google-mobile": [10, 11], "bing-desktop": [15, 7], "bing-mobile": [13, 10] } },
];

const DATA: Record<Combo, { kw: string; vol: number; hist: Pos[] }[]> = Object.fromEntries(
  (["google-desktop", "google-mobile", "bing-desktop", "bing-mobile"] as Combo[]).map((combo) => [
    combo,
    SPECS.map((s) => ({ kw: s.kw, vol: s.vol, hist: history(`${s.kw}|${combo}`, ...s.pos[combo]) })),
  ]),
) as Record<Combo, { kw: string; vol: number; hist: Pos[] }[]>;

const BANDS = [
  { label: "Top 3", color: C.green, test: (p: Pos) => p != null && p <= 3 },
  { label: "4–10", color: C.blue, test: (p: Pos) => p != null && p > 3 && p <= 10 },
  { label: "11–20", color: C.amber, test: (p: Pos) => p != null && p > 10 && p <= 20 },
  { label: "21–100", color: "#9aa1ad", test: (p: Pos) => p != null && p > 20 },
  { label: "Unranked", color: "#d9dce1", test: (p: Pos) => p == null },
];

/** Positive = moved up. Null when either side is unranked. */
function delta(h: Pos[], back: number): number | null {
  const now = h[DAYS - 1];
  const then = h[DAYS - 1 - back];
  return now == null || then == null ? null : then - now;
}

function Delta({ v }: { v: number | null }) {
  if (v == null || v === 0)
    return <span style={{ color: C.muted }}>—</span>;
  const up = v > 0;
  return (
    <span
      className="inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[12px] font-semibold tabular-nums"
      style={{ color: up ? C.green : C.red, background: up ? "#e8f6ee" : "#fdecec" }}
      aria-label={`${up ? "up" : "down"} ${Math.abs(v)}`}
    >
      {up ? "▲" : "▼"} {Math.abs(v)}
    </span>
  );
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { v: T; label: string; icon?: ReactNode }[];
  onChange: (v: T) => void;
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex rounded-full p-1" style={{ background: C.soft }}>
      {options.map((o) => {
        const on = o.v === value;
        return (
          <button
            key={o.v}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o.v)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${FOCUS}`}
            style={{ background: on ? "#fff" : "transparent", color: on ? C.ink : C.muted, boxShadow: on ? "0 1px 2px rgba(0,0,0,.08)" : "none" }}
          >
            {o.icon}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function RankTrackerDemo() {
  const reduce = useReducedMotion();
  const [engine, setEngine] = useState<Engine>("google");
  const [device, setDevice] = useState<Device>("desktop");
  const [sel, setSel] = useState(0);
  const [hover, setHover] = useState<number | null>(null);

  const combo: Combo = `${engine}-${device}`;
  const rows = DATA[combo];
  const row = rows[sel];
  const hist = row.hist;
  const current = hist[DAYS - 1];
  const bandCounts = BANDS.map((b) => rows.filter((r) => b.test(r.hist[DAYS - 1])).length);

  // Chart scale: rank 1 at the top, worst rank in range at the bottom.
  const ranked = hist.filter((p): p is number => p != null);
  const lo = ranked.length ? Math.max(1, Math.min(...ranked) - 1) : 1;
  const hi = ranked.length ? Math.max(...ranked) + 1 : 100;
  const x = (i: number) => (i / (DAYS - 1)) * 100;
  const y = (p: number) => ((p - lo) / Math.max(1, hi - lo)) * 100;

  // One path per run of consecutive ranked days, so drop-outs show as gaps.
  const segments: number[][] = [];
  hist.forEach((p, i) => {
    if (p == null) return;
    const last = segments[segments.length - 1];
    if (last && last[last.length - 1] === i - 1) last.push(i);
    else segments.push([i]);
  });
  const line = (seg: number[]) => seg.map((i, k) => `${k ? "L" : "M"}${x(i)},${y(hist[i] as number)}`).join(" ");
  const area = (seg: number[]) => `${line(seg)} L${x(seg[seg.length - 1])},100 L${x(seg[0])},100 Z`;

  const active = hover ?? DAYS - 1;
  const activePos = hist[active];
  const prevPos = active > 0 ? hist[active - 1] : null;
  const dayDelta = activePos != null && prevPos != null ? prevPos - activePos : null;
  const markerY = activePos != null ? y(activePos) : 100;
  const tipAlign = x(active) < 18 ? "0%" : x(active) > 82 ? "-100%" : "-50%";

  const onPointer = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const i = Math.round(((e.clientX - r.left) / r.width) * (DAYS - 1));
    setHover(Math.min(DAYS - 1, Math.max(0, i)));
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const cur = hover ?? DAYS - 1;
    const next =
      e.key === "ArrowLeft" ? cur - 1 : e.key === "ArrowRight" ? cur + 1 : e.key === "Home" ? 0 : e.key === "End" ? DAYS - 1 : null;
    if (next == null) return;
    e.preventDefault();
    setHover(Math.min(DAYS - 1, Math.max(0, next)));
  };

  const fade = reduce ? { duration: 0 } : { duration: 0.3, ease: "easeOut" as const };
  const engineLabel = engine === "google" ? "Google" : "Bing";
  const deviceLabel = device === "desktop" ? "Desktop" : "Mobile";

  return (
    <div
      className="@container w-full min-w-0"
      style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 20, padding: "clamp(16px, 3vw, 24px)", color: C.ink, boxSizing: "border-box" }}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Segmented<Engine>
            label="Search engine"
            value={engine}
            onChange={(v) => { setEngine(v); setHover(null); }}
            options={[{ v: "google", label: "Google" }, { v: "bing", label: "Bing" }]}
          />
          <Segmented<Device>
            label="Device"
            value={device}
            onChange={(v) => { setDevice(v); setHover(null); }}
            options={[
              { v: "desktop", label: "Desktop", icon: <Monitor size={14} aria-hidden /> },
              { v: "mobile", label: "Mobile", icon: <Smartphone size={14} aria-hidden /> },
            ]}
          />
        </div>
        <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide" style={{ background: "#eef3ff", color: C.blue }}>
          Example data
        </span>
      </div>

      <div className="mt-5 grid gap-5 @3xl:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
        {/* Keyword table */}
        <div className="min-w-0 overflow-hidden rounded-2xl" style={{ border: `1px solid ${C.border}` }}>
          <div
            className="grid grid-cols-[minmax(0,1fr)_56px_48px_48px] gap-2 px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide"
            style={{ background: C.soft, color: C.muted }}
          >
            <span>Keyword</span>
            <span className="text-right">Position</span>
            <span className="text-right">1d</span>
            <span className="text-right">7d</span>
          </div>
          <ul>
            {rows.map((r, i) => {
              const p = r.hist[DAYS - 1];
              const on = i === sel;
              return (
                <li key={r.kw} style={{ borderTop: `1px solid ${C.border}` }}>
                  <button
                    type="button"
                    aria-pressed={on}
                    aria-label={`${r.kw}, position ${p ?? "unranked"}. Show position history`}
                    onClick={() => { setSel(i); setHover(null); }}
                    className={`grid w-full grid-cols-[minmax(0,1fr)_56px_48px_48px] items-center gap-2 px-3 py-2.5 text-left transition-colors hover:bg-[#f5f6f8] ${FOCUS} focus-visible:ring-inset focus-visible:ring-offset-0`}
                    style={{ background: on ? "#eef3ff" : undefined, boxShadow: on ? `inset 3px 0 0 ${C.blue}` : undefined }}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[14px] font-medium">{r.kw}</span>
                      <span className="block text-[12px]" style={{ color: C.muted }}>
                        {r.vol.toLocaleString("en-US")} /mo
                      </span>
                    </span>
                    <span className="text-right text-[14px] font-semibold tabular-nums" style={{ color: p == null ? C.muted : p <= 3 ? C.green : C.ink }}>
                      {p == null ? "—" : `#${p}`}
                    </span>
                    <span className="text-right"><Delta v={delta(r.hist, 1)} /></span>
                    <span className="text-right"><Delta v={delta(r.hist, 7)} /></span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* History chart */}
        <div className="min-w-0 rounded-2xl p-4" style={{ border: `1px solid ${C.border}` }}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate text-[15px] font-semibold">{row.kw}</div>
              <div className="text-[12px]" style={{ color: C.muted }}>
                United States · {deviceLabel} · {engineLabel} · position history, 30 days
              </div>
            </div>
            <div className="text-right">
              <div className="text-[26px] font-bold leading-none tabular-nums" style={{ color: current == null ? C.muted : C.blue }}>
                {current == null ? "Unranked" : `#${current}`}
              </div>
              <div className="mt-1 text-[12px]" style={{ color: C.muted }}>
                7-day <Delta v={delta(hist, 7)} />
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <div className="flex w-8 shrink-0 flex-col justify-between py-0 text-right text-[11px] tabular-nums" style={{ color: C.muted, height: 180 }} aria-hidden>
              <span>#{lo}</span>
              <span>#{Math.round((lo + hi) / 2)}</span>
              <span>#{hi}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div
                role="slider"
                tabIndex={0}
                aria-label={`Position history for ${row.kw}. Use arrow keys to move between days.`}
                aria-valuemin={1}
                aria-valuemax={DAYS}
                aria-valuenow={active + 1}
                aria-valuetext={`${DATES[active]}: ${activePos == null ? "not in the top 100" : `position ${activePos}`}`}
                onPointerMove={onPointer}
                onPointerDown={onPointer}
                onPointerLeave={() => setHover(null)}
                onKeyDown={onKey}
                onBlur={() => setHover(null)}
                className={`relative w-full cursor-crosshair touch-none rounded-md ${FOCUS}`}
                style={{ height: 180 }}
              >
                {[0, 50, 100].map((g) => (
                  <div key={g} className="absolute left-0 right-0" style={{ top: `${g}%`, borderTop: `1px dashed ${C.border}` }} aria-hidden />
                ))}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.svg
                    key={`${combo}-${sel}`}
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    className="absolute inset-0 h-full w-full overflow-visible"
                    initial={{ opacity: 0, y: reduce ? 0 : 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={fade}
                    aria-hidden
                  >
                    {segments.map((seg) => (
                      <path key={`a${seg[0]}`} d={area(seg)} fill={C.blue} fillOpacity={0.08} />
                    ))}
                    {segments.map((seg) => (
                      <path key={`l${seg[0]}`} d={line(seg)} fill="none" stroke={C.blue} strokeWidth={2} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
                    ))}
                  </motion.svg>
                </AnimatePresence>
                {segments.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-center text-[13px]" style={{ color: C.muted }}>
                    Not in the top 100 on any day in the last 30
                  </div>
                )}
                {hover != null && (
                  <div className="pointer-events-none absolute bottom-0 top-0" style={{ left: `${x(active)}%`, borderLeft: `1px solid ${C.border}` }} aria-hidden />
                )}
                {activePos != null && (
                  <motion.div
                    className="pointer-events-none absolute h-3 w-3 rounded-full"
                    style={{ background: "#fff", border: `2.5px solid ${C.blue}`, x: "-50%", y: "-50%" }}
                    initial={false}
                    animate={{ left: `${x(active)}%`, top: `${markerY}%` }}
                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 40 }}
                    aria-hidden
                  />
                )}
                {hover != null && (
                  <div
                    className="pointer-events-none absolute z-10 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[12px] shadow-md"
                    style={{
                      left: `${x(active)}%`,
                      top: `${markerY}%`,
                      transform: markerY < 35 ? `translate(${tipAlign}, 14px)` : `translate(${tipAlign}, calc(-100% - 10px))`,
                      background: C.ink,
                      color: "#fff",
                    }}
                    aria-hidden
                  >
                    <div style={{ opacity: 0.7 }}>{DATES[active]}</div>
                    <div className="font-semibold">
                      {activePos == null ? "Not in the top 100" : `Position #${activePos}`}
                      {dayDelta != null && dayDelta !== 0 && (
                        <span style={{ color: dayDelta > 0 ? "#4ade80" : "#f87171", marginLeft: 6 }}>
                          {dayDelta > 0 ? "▲" : "▼"} {Math.abs(dayDelta)}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-2 flex justify-between text-[11px]" style={{ color: C.muted }} aria-hidden>
                <span>{DATES[0]}</span>
                <span>{DATES[Math.floor(DAYS / 2)]}</span>
                <span>{DATES[DAYS - 1]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Position bands */}
      <div className="mt-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-[13px] font-semibold">Keywords by position band</span>
          <span className="text-[12px]" style={{ color: C.muted }}>
            {bandCounts.join(" + ")} = {rows.length} keywords
          </span>
        </div>
        <div className="mt-2 flex h-2.5 w-full overflow-hidden rounded-full" style={{ background: C.soft }} aria-hidden>
          {BANDS.map((b, i) => (
            <motion.div
              key={b.label}
              style={{ background: b.color, height: "100%" }}
              initial={false}
              animate={{ width: `${(bandCounts[i] / rows.length) * 100}%` }}
              transition={reduce ? { duration: 0 } : { duration: 0.45, ease: "easeOut" }}
            />
          ))}
        </div>
        <ul className="mt-3 grid grid-cols-2 gap-2 @md:grid-cols-5">
          {BANDS.map((b, i) => (
            <li key={b.label} className="rounded-xl px-3 py-2" style={{ background: C.soft }}>
              <div className="flex items-center gap-1.5 text-[12px]" style={{ color: C.muted }}>
                <i className="inline-block h-2 w-2 rounded-full" style={{ background: b.color }} aria-hidden />
                {b.label}
              </div>
              <div className="text-[18px] font-bold tabular-nums">{bandCounts[i]}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
