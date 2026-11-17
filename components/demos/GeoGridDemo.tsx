"use client";

/**
 * Google Maps rank tracker geo-grid, as a try-it card.
 *
 * Metrics are the backend's computeMetrics (maps-tracker/grid.ts) verbatim:
 * depth 20, not-found counted as 21 in ATRP, SoLV = share of points ranked
 * <= 3. Pin colours and the six distribution bands are the dashboard's
 * rankColor / RANK_BANDS (frontend components/maps-tracker/grid.ts). Ranks and
 * businesses are fixed example data.
 */

import { useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MapPin, Star } from "lucide-react";

const C = {
  blue: "#0454ff",
  ink: "#0b0d12",
  muted: "#6d6d6d",
  border: "#eaeaea",
  soft: "#f5f6f8",
};
const FOCUS =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#0454ff] focus-visible:ring-offset-2";

// ── Real constants and formulas from freeserp-backend-v2 maps-tracker/grid.ts ──
const SCAN_DEPTH = 20;
const ATRP_PENALTY = 21;
const SOLV_THRESHOLD = 3;
const round = (v: number, d: number) => Math.round(v * 10 ** d) / 10 ** d;

function computeMetrics(points: { rank: number | null }[]) {
  const found = points.filter((p) => p.rank !== null);
  const arp = found.length ? found.reduce((s, p) => s + (p.rank as number), 0) / found.length : null;
  const atrp = points.length ? points.reduce((s, p) => s + (p.rank ?? ATRP_PENALTY), 0) / points.length : null;
  const solv = points.length
    ? (points.filter((p) => p.rank !== null && (p.rank as number) <= SOLV_THRESHOLD).length / points.length) * 100
    : null;
  return {
    arp: arp === null ? null : round(arp, 2),
    atrp: atrp === null ? null : round(atrp, 2),
    solv: solv === null ? null : round(solv, 2),
  };
}

function rankColor(rank: number | null) {
  if (rank === null) return { bg: "#7F1D1D", fg: "#FFFFFF", label: "20+" };
  if (rank <= 3) return { bg: "#16A34A", fg: "#FFFFFF", label: `${rank}` };
  if (rank <= 7) return { bg: "#84CC16", fg: "#1A2E05", label: `${rank}` };
  if (rank <= 10) return { bg: "#EAB308", fg: "#422006", label: `${rank}` };
  if (rank <= 15) return { bg: "#F97316", fg: "#FFFFFF", label: `${rank}` };
  return { bg: "#DC2626", fg: "#FFFFFF", label: `${rank}` };
}

const BANDS = [
  { label: "Top 3", test: (r: number | null) => r != null && r <= 3, color: rankColor(1).bg },
  { label: "4–7", test: (r: number | null) => r != null && r > 3 && r <= 7, color: rankColor(5).bg },
  { label: "8–10", test: (r: number | null) => r != null && r > 7 && r <= 10, color: rankColor(9).bg },
  { label: "11–15", test: (r: number | null) => r != null && r > 10 && r <= 15, color: rankColor(13).bg },
  { label: "16–20", test: (r: number | null) => r != null && r > 15, color: rankColor(18).bg },
  { label: "Not found", test: (r: number | null) => r == null, color: rankColor(null).bg },
];

// ── Example data ──────────────────────────────────────────────────────────
const SIZES = [3, 5, 7] as const;
type Size = (typeof SIZES)[number];
const RADIUS_KM = 3;
const KEYWORD = "outdoor gear store";
const YOU = { title: "Northpeak Outfitters", category: "Outdoor sports store", rating: 4.7, count: 812 };

const RIVALS: { title: string; category: string; rating: number; count: number }[] = [
  { title: "Ridgeline Mountain Supply", category: "Outdoor sports store", rating: 4.6, count: 1204 },
  { title: "Summit & Trail Co.", category: "Camping store", rating: 4.5, count: 688 },
  { title: "Basecamp Outdoors", category: "Outdoor sports store", rating: 4.4, count: 931 },
  { title: "Alder & Pine Outfitters", category: "Clothing store", rating: 4.8, count: 342 },
  { title: "Front Range Gear Exchange", category: "Used clothing store", rating: 4.7, count: 517 },
  { title: "Cairn Climbing Shop", category: "Climbing equipment store", rating: 4.9, count: 276 },
  { title: "Wild Sky Sporting Goods", category: "Sporting goods store", rating: 4.2, count: 1530 },
  { title: "Timberline Packs", category: "Outdoor sports store", rating: 4.6, count: 198 },
  { title: "Riverbend Fly & Camp", category: "Fishing store", rating: 4.5, count: 403 },
  { title: "High Country Hikers", category: "Hiking store", rating: 4.3, count: 254 },
  { title: "Granite Peak Rentals", category: "Ski rental service", rating: 4.4, count: 611 },
  { title: "Trailhead Running Co.", category: "Running store", rating: 4.8, count: 389 },
  { title: "Blue Spruce Surplus", category: "Army & navy store", rating: 4.1, count: 822 },
  { title: "Switchback Bike & Ski", category: "Bicycle store", rating: 4.6, count: 470 },
  { title: "Canyon Creek Outfitters", category: "Outdoor sports store", rating: 4.3, count: 157 },
  { title: "Northern Lights Apparel", category: "Clothing store", rating: 4.0, count: 96 },
  { title: "Evergreen Camp Depot", category: "Camping store", rating: 4.2, count: 303 },
  { title: "Powderhorn Ski Shop", category: "Ski shop", rating: 4.7, count: 712 },
  { title: "Mesa Trail Supply", category: "Hardware store", rating: 4.4, count: 228 },
  { title: "Kettle Lake Adventure", category: "Kayak rental service", rating: 4.5, count: 141 },
];

function mulberry32(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DIRS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

type Point = {
  i: number;
  row: number;
  col: number;
  rank: number | null;
  where: string;
  ring: number;
  results: typeof RIVALS;
};

/** Same layout as generateGrid: row 0 north, col 0 west, radius split into equal steps. */
function buildGrid(n: Size): Point[] {
  const half = (n - 1) / 2;
  const spacing = RADIUS_KM / half;
  return Array.from({ length: n * n }, (_, i) => {
    const row = Math.floor(i / n);
    const col = i % n;
    const north = (half - row) * spacing;
    const east = (col - half) * spacing;
    const r = mulberry32(n * 1000 + i * 7 + 13);
    const d = Math.hypot(north, east) / RADIUS_KM;
    // Strong downtown, weaker to the east (a rival cluster) and south.
    const raw = 1 + 5 * d ** 1.6 + 9 * Math.max(0, east / RADIUS_KM) ** 1.5 + 4 * Math.max(0, -north / RADIUS_KM) + (r() - 0.5) * 4;
    const isCenter = row === half && col === half;
    const rk = isCenter ? 1 : Math.max(1, Math.round(raw));
    const rank = rk > SCAN_DEPTH ? null : rk;

    const km = Math.hypot(north, east);
    const dir = DIRS[Math.round(((Math.atan2(east, north) * 180) / Math.PI + 360) % 360 / 45) % 8];
    const where = isCenter ? "Your pin" : `${km.toFixed(1)} km ${dir}`;

    // Who Google listed here: a shuffled set of rivals, with you at your rank.
    const pool = [...RIVALS];
    for (let k = pool.length - 1; k > 0; k--) {
      const j = Math.floor(r() * (k + 1));
      [pool[k], pool[j]] = [pool[j], pool[k]];
    }
    const results = rank == null ? pool.slice(0, SCAN_DEPTH) : [...pool.slice(0, rank - 1), YOU, ...pool.slice(rank - 1, SCAN_DEPTH - 1)];
    return { i, row, col, rank, where, ring: Math.max(Math.abs(row - half), Math.abs(col - half)), results };
  });
}

const GRIDS: Record<Size, Point[]> = { 3: buildGrid(3), 5: buildGrid(5), 7: buildGrid(7) };

export function GeoGridDemo() {
  const reduce = useReducedMotion();
  const [size, setSize] = useState<Size>(5);
  const [sel, setSel] = useState(12);

  const points = GRIDS[size];
  const point = points[sel];
  const m = computeMetrics(points);
  const counts = BANDS.map((b) => points.filter((p) => b.test(p.rank)).length);
  const spacing = RADIUS_KM / ((size - 1) / 2);
  const pin = size === 7 ? 28 : size === 5 ? 34 : 40;
  const shown = point.rank != null ? Math.max(8, Math.min(SCAN_DEPTH, point.rank + 2)) : 8;
  const hidden = Math.max(0, point.results.length - shown);

  const pickSize = (n: Size) => {
    setSize(n);
    setSel((n * n - 1) / 2);
  };

  const onPinKey = (e: KeyboardEvent<HTMLButtonElement>, p: Point) => {
    const moves: Record<string, [number, number]> = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
    const mv = moves[e.key];
    if (!mv) return;
    e.preventDefault();
    const row = Math.min(size - 1, Math.max(0, p.row + mv[0]));
    const col = Math.min(size - 1, Math.max(0, p.col + mv[1]));
    const next = row * size + col;
    setSel(next);
    e.currentTarget.parentElement?.querySelector<HTMLButtonElement>(`[data-i="${next}"]`)?.focus();
  };

  const metrics = [
    { k: "SoLV", v: m.solv == null ? "—" : `${Math.round(m.solv)}%`, cap: "Share of points where you rank in the top 3" },
    { k: "ARP", v: m.arp == null ? "—" : m.arp.toFixed(2), cap: "Average rank, only where found" },
    { k: "ATRP", v: m.atrp == null ? "—" : m.atrp.toFixed(2), cap: "Average rank across the whole grid" },
  ];

  return (
    <div
      className="@container w-full min-w-0"
      style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 20, padding: "clamp(16px, 3vw, 24px)", color: C.ink, boxSizing: "border-box" }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[14px] font-semibold">
            <MapPin size={15} style={{ color: C.blue }} aria-hidden />
            {YOU.title} · &ldquo;{KEYWORD}&rdquo;
          </div>
          <div className="text-[12px]" style={{ color: C.muted }}>
            {size}×{size} grid · {spacing.toFixed(1)} km spacing · {RADIUS_KM} km radius · ranks read to depth {SCAN_DEPTH}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div role="group" aria-label="Grid size" className="inline-flex rounded-full p-1" style={{ background: C.soft }}>
            {SIZES.map((n) => (
              <button
                key={n}
                type="button"
                aria-pressed={n === size}
                onClick={() => pickSize(n)}
                className={`rounded-full px-3 py-1.5 text-[13px] font-medium tabular-nums transition-colors ${FOCUS}`}
                style={{ background: n === size ? "#fff" : "transparent", color: n === size ? C.ink : C.muted, boxShadow: n === size ? "0 1px 2px rgba(0,0,0,.08)" : "none" }}
              >
                {n}×{n}
              </button>
            ))}
          </div>
          <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide" style={{ background: "#eef3ff", color: C.blue }}>
            Example data
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 @xl:gap-3">
        {metrics.map((x) => (
          <div key={x.k} className="min-w-0 rounded-2xl p-3" style={{ border: `1px solid ${C.border}` }}>
            <div className="text-[12px]" style={{ color: C.muted }}>{x.k}</div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={x.v}
                className="text-[clamp(20px,5cqw,28px)] font-bold leading-tight tabular-nums"
                style={{ color: C.blue }}
                initial={{ opacity: 0, y: reduce ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduce ? 0 : -6 }}
                transition={{ duration: reduce ? 0 : 0.2 }}
              >
                {x.v}
              </motion.div>
            </AnimatePresence>
            <div className="hidden text-[12px] leading-snug @lg:block" style={{ color: C.muted }}>{x.cap}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 @3xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        {/* Map */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl" style={{ background: "#f1f1ef", border: `1px solid ${C.border}` }}>
          <div aria-hidden className="absolute inset-0">
            <div className="absolute" style={{ left: "47%", top: 0, bottom: 0, width: "2.4%", background: "#fbf0d6" }} />
            <div className="absolute" style={{ top: "44%", left: 0, right: 0, height: "2.4%", background: "#fbf0d6" }} />
            <div className="absolute" style={{ top: "66%", left: 0, right: 0, height: "6%", background: "#c7dfe8", transform: "skewY(-4deg)" }} />
            <div className="absolute rounded-xl" style={{ left: "60%", top: "14%", width: "24%", height: "18%", background: "#dbe9d3" }} />
            <div className="absolute rounded-xl" style={{ left: "8%", top: "76%", width: "20%", height: "14%", background: "#dbe9d3" }} />
          </div>
          <div role="group" aria-label={`${size} by ${size} geo-grid. Use arrow keys to move between points.`} className="absolute inset-0">
            <AnimatePresence initial={false}>
              {points.map((p) => {
                const c = rankColor(p.rank);
                const on = p.i === sel;
                return (
                  <motion.button
                    key={`${size}-${p.i}`}
                    data-i={p.i}
                    type="button"
                    tabIndex={on ? 0 : -1}
                    aria-pressed={on}
                    aria-label={`${p.where}: ${p.rank == null ? `not found in the top ${SCAN_DEPTH}` : `rank ${p.rank}`}`}
                    onClick={() => setSel(p.i)}
                    onKeyDown={(e) => onPinKey(e, p)}
                    className={`absolute flex items-center justify-center rounded-full text-[12px] font-bold tabular-nums ${FOCUS}`}
                    style={{
                      left: `${((p.col + 0.5) / size) * 100}%`,
                      top: `${((p.row + 0.5) / size) * 100}%`,
                      width: pin,
                      height: pin,
                      marginLeft: -pin / 2,
                      marginTop: -pin / 2,
                      background: c.bg,
                      color: c.fg,
                      boxShadow: on ? `0 0 0 3px #fff, 0 0 0 5px ${C.ink}` : "0 1px 3px rgba(0,0,0,.25)",
                      zIndex: on ? 2 : 1,
                    }}
                    initial={reduce ? false : { scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0, transition: { duration: reduce ? 0 : 0.12 } }}
                    whileHover={reduce ? undefined : { scale: 1.12 }}
                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 26, delay: 0.05 + p.ring * 0.06 }}
                  >
                    {c.label}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Point detail */}
        <div className="min-w-0 rounded-2xl" style={{ border: `1px solid ${C.border}` }}>
          <div className="flex items-start justify-between gap-3 px-4 pt-4">
            <div className="min-w-0">
              <div className="text-[14px] font-semibold">What Google showed here</div>
              <div className="text-[12px]" style={{ color: C.muted }}>
                {point.where} · &ldquo;{KEYWORD}&rdquo;
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: C.muted }}>Your rank</div>
              <div className="text-[22px] font-bold leading-tight tabular-nums" style={{ color: point.rank != null ? rankColor(point.rank).bg : C.muted }}>
                {point.rank != null ? `#${point.rank}` : "Not found"}
              </div>
            </div>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.ol
              key={`${size}-${sel}`}
              className="mt-3 max-h-[340px] overflow-y-auto px-2 pb-3"
              initial={{ opacity: 0, x: reduce ? 0 : 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.18 }}
              aria-label={`Businesses ranking at ${point.where}`}
            >
              {point.results.slice(0, shown).map((b, k) => {
                const rank = k + 1;
                const you = b === YOU;
                const c = rankColor(rank);
                return (
                  <li
                    key={b.title}
                    className="flex items-center gap-3 rounded-xl px-2 py-1.5"
                    style={{ background: you ? "#eef3ff" : undefined, boxShadow: you ? `inset 0 0 0 1px ${C.blue}` : undefined }}
                  >
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold tabular-nums"
                      style={rank <= 3 ? { background: c.bg, color: c.fg } : { background: C.soft, color: C.muted }}
                    >
                      {rank}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate text-[13px]" style={{ fontWeight: you ? 600 : 500 }}>
                        {b.title}
                        {you && <span className="ml-1 text-[11px]" style={{ color: C.blue }}>You</span>}
                      </div>
                      <div className="flex items-center gap-1 truncate text-[11px]" style={{ color: C.muted }}>
                        {b.category} · {b.rating} <Star size={10} fill="#EAB308" stroke="none" aria-label="stars" /> ({b.count.toLocaleString("en-US")})
                      </div>
                    </div>
                  </li>
                );
              })}
              {(hidden > 0 || point.rank == null) && (
                <li className="px-2 pt-2 text-[12px]" style={{ color: C.muted }}>
                  {hidden > 0 && `${hidden} more result${hidden === 1 ? "" : "s"} captured at this point`}
                  {point.rank == null && `${hidden > 0 ? " — " : ""}you were not among them`}
                </li>
              )}
            </motion.ol>
          </AnimatePresence>
        </div>
      </div>

      {/* Rank distribution */}
      <div className="mt-4">
        <div className="text-[13px] font-semibold">Rank distribution</div>
        <div className="mt-2 flex h-2.5 w-full overflow-hidden rounded-full" style={{ background: C.soft }} aria-hidden>
          {BANDS.map((b, i) => (
            <motion.div
              key={b.label}
              style={{ background: b.color, height: "100%" }}
              initial={false}
              animate={{ width: `${(counts[i] / points.length) * 100}%` }}
              transition={{ duration: reduce ? 0 : 0.45, ease: "easeOut" }}
            />
          ))}
        </div>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px]" style={{ color: C.muted }}>
          {BANDS.map((b, i) => (
            <li key={b.label} className="flex items-center gap-1.5">
              <i className="inline-block h-2 w-2 rounded-full" style={{ background: b.color }} aria-hidden />
              {b.label} ({counts[i]})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
