"use client";

/**
 * Search Console demo — a working miniature of the dashboard's
 * /dashboard/project/[id]/search-console page.
 *
 * Mirrors the real page (freeserp-frontend-v2 search-console/page.tsx and the
 * dashSearchConsole strings in messages/en.json): the 7 days / 28 days /
 * 3 months presets (backend gsc.schemas.ts `days` 7/28/90), four metric tiles
 * that act as checkboxes with at most two plotted at once (ticking a third drops
 * the oldest, the last one cannot be unticked), each on its own axis with
 * position reversed, deltas against the previous period of equal length (CTR in
 * percentage points), and the Queries table with its "Tracked" tag and
 * "Add to rank tracker" selection. Every number is invented example data.
 */

import { useState, type KeyboardEvent, type PointerEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, ChartLine, Check, Eye, Gauge, MousePointerClick, Percent } from "lucide-react";

type MetricKey = "clicks" | "impressions" | "ctr" | "position";
type Point = { date: string; clicks: number; impressions: number; ctr: number; position: number };

const METRICS: MetricKey[] = ["clicks", "impressions", "ctr", "position"];
const LABEL: Record<MetricKey, string> = {
  clicks: "Total clicks",
  impressions: "Total impressions",
  ctr: "Average CTR",
  position: "Average position",
};
// Same fixed colour per metric as the dashboard (clicks takes the brand blue).
const COLOR: Record<MetricKey, string> = { clicks: "#0454ff", impressions: "#7c3aed", ctr: "#0891b2", position: "#d97706" };
const ICON = { clicks: MousePointerClick, impressions: Eye, ctr: Percent, position: Gauge };

const nf = new Intl.NumberFormat("en-US");
const FMT: Record<MetricKey, (v: number) => string> = {
  clicks: (v) => nf.format(Math.round(v)),
  impressions: (v) => nf.format(Math.round(v)),
  ctr: (v) => `${(v * 100).toFixed(1)}%`,
  position: (v) => v.toFixed(1),
};

const RANGES = [
  { days: 7, label: "7 days" },
  { days: 28, label: "28 days" },
  { days: 90, label: "3 months" },
] as const;
type Days = (typeof RANGES)[number]["days"];

/* ── Deterministic example data ─────────────────────────────────────────── */

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TOTAL_DAYS = 180; // 90 shown at most, plus the previous 90 for the deltas
const END = Date.UTC(2026, 10, 14);
const SERIES: Point[] = (() => {
  const r = mulberry32(20261114);
  const out: Point[] = [];
  for (let i = 0; i < TOTAL_DAYS; i++) {
    const t = i / (TOTAL_DAYS - 1);
    const d = new Date(END - (TOTAL_DAYS - 1 - i) * 86400000);
    const weekend = d.getUTCDay() === 0 || d.getUTCDay() === 6 ? 0.8 : 1;
    const clicks = Math.round((880 + 720 * t) * weekend * (0.9 + 0.2 * r()));
    const ctr = 0.025 + 0.011 * t + (r() - 0.5) * 0.004;
    const impressions = Math.round(clicks / ctr);
    out.push({
      date: d.toISOString().slice(0, 10),
      clicks,
      impressions,
      ctr: clicks / impressions,
      position: 14.2 - 4.4 * t + (r() - 0.5) * 1.1,
    });
  }
  return out;
})();

function totals(points: Point[]) {
  const clicks = points.reduce((s, p) => s + p.clicks, 0);
  const impressions = points.reduce((s, p) => s + p.impressions, 0);
  // Google's average position is impression-weighted.
  const position = points.reduce((s, p) => s + p.position * p.impressions, 0) / impressions;
  return { clicks, impressions, ctr: clicks / impressions, position };
}

type Query = { query: string; share: number; ctr: number; position: number };
const QUERIES: Query[] = [
  { query: "waterproof hiking boots", share: 0.071, ctr: 0.081, position: 2.8 },
  { query: "trail running shoes", share: 0.052, ctr: 0.064, position: 3.9 },
  { query: "best rain jacket", share: 0.046, ctr: 0.042, position: 6.4 },
  { query: "merino base layer", share: 0.038, ctr: 0.074, position: 2.2 },
  { query: "lightweight 2 person tent", share: 0.027, ctr: 0.031, position: 8.7 },
  { query: "hiking boots women", share: 0.024, ctr: 0.036, position: 7.1 },
  { query: "how to waterproof boots", share: 0.019, ctr: 0.022, position: 11.6 },
  { query: "down jacket sale", share: 0.013, ctr: 0.015, position: 14.3 },
];
const RANGE_NUDGE: Record<Days, number> = { 7: 0.4, 28: 0.1, 90: 0 };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmtDate = (iso: string) => `${MONTHS[Number(iso.slice(5, 7)) - 1]} ${Number(iso.slice(8, 10))}, ${iso.slice(0, 4)}`;

/** Axis bounds per metric; position runs 1-at-top, like the dashboard. */
function bounds(key: MetricKey, pts: Point[]) {
  const vals = pts.map((p) => p[key]);
  if (key === "position") {
    return { lo: Math.max(1, Math.floor(Math.min(...vals) - 1)), hi: Math.ceil(Math.max(...vals) + 1), inverted: true };
  }
  return { lo: 0, hi: Math.max(...vals) * 1.12, inverted: false };
}

const W = 600;
const H = 200;
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0454ff]";

type SortKey = "query" | "clicks" | "impressions" | "ctr" | "position";

export function SearchConsoleDemo() {
  const reduce = useReducedMotion();
  const dur = reduce ? 0 : 0.3;

  const [days, setDays] = useState<Days>(90);
  const [metrics, setMetrics] = useState<MetricKey[]>(["clicks"]);
  const [active, setActive] = useState<number | null>(null);
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" } | null>(null);
  const [tracked, setTracked] = useState<Set<string>>(
    () => new Set(["waterproof hiking boots", "trail running shoes", "best rain jacket"]),
  );
  const [selected, setSelected] = useState<Set<string>>(() => new Set());

  const pts = SERIES.slice(TOTAL_DAYS - days);
  const cur = totals(pts);
  const prev = totals(SERIES.slice(TOTAL_DAYS - 2 * days, TOTAL_DAYS - days));
  const n = pts.length;
  const idx = active != null && active < n ? active : null;

  // Same rule as the dashboard: two at most, oldest drops, last one stays on.
  const toggleMetric = (k: MetricKey) =>
    setMetrics((m) => (m.includes(k) ? (m.length === 1 ? m : m.filter((x) => x !== k)) : m.length < 2 ? [...m, k] : [m[1], k]));

  const scales = metrics.map((k) => ({ key: k, ...bounds(k, pts) }));
  const yPct = (s: (typeof scales)[number], v: number) => {
    const f = (v - s.lo) / (s.hi - s.lo);
    return (s.inverted ? f : 1 - f) * 100;
  };
  const xPct = (i: number) => (n === 1 ? 50 : (i / (n - 1)) * 100);
  const path = (s: (typeof scales)[number]) =>
    pts.map((p, i) => `${i ? "L" : "M"}${((xPct(i) / 100) * W).toFixed(1)},${((yPct(s, p[s.key]) / 100) * H).toFixed(1)}`).join("");

  const onPointer = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setActive(Math.max(0, Math.min(n - 1, Math.round(((e.clientX - r.left) / r.width) * (n - 1)))));
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step: Record<string, (a: number) => number> = {
      ArrowLeft: (a) => Math.max(0, a - 1),
      ArrowRight: (a) => Math.min(n - 1, a + 1),
      Home: () => 0,
      End: () => n - 1,
    };
    if (!step[e.key]) return;
    e.preventDefault();
    setActive(step[e.key](idx ?? n - 1));
  };

  const rows = QUERIES.map((q) => {
    const clicks = Math.round(cur.clicks * q.share);
    return { query: q.query, clicks, impressions: Math.round(clicks / q.ctr), ctr: q.ctr, position: q.position + RANGE_NUDGE[days] };
  });
  if (sort) {
    const m = sort.dir === "asc" ? 1 : -1;
    rows.sort((a, b) =>
      sort.key === "query" ? a.query.localeCompare(b.query) * m : (a[sort.key] - b[sort.key]) * m,
    );
  }
  const clickSort = (key: SortKey) =>
    setSort((s) =>
      s?.key === key
        ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key, dir: key === "query" || key === "position" ? "asc" : "desc" },
    );

  const selectable = rows.filter((r) => !tracked.has(r.query)).map((r) => r.query);
  const allOn = selectable.length > 0 && selectable.every((q) => selected.has(q));
  const toggleRow = (q: string) =>
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(q)) next.delete(q);
      else next.add(q);
      return next;
    });
  const addToTracker = () => {
    setTracked((t) => new Set([...t, ...selected]));
    setSelected(new Set());
  };

  const tipLeft = idx != null ? xPct(idx) : 0;

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #eaeaea",
        borderRadius: 20,
        padding: "clamp(16px, 3vw, 28px)",
        width: "100%",
        boxSizing: "border-box",
        color: "#0b0d12",
        minWidth: 0,
        fontSize: 14,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600 }}>
          <ChartLine size={16} color="#0454ff" aria-hidden />
          Search Console
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#6d6d6d", background: "#f5f6f8", border: "1px solid #eaeaea", borderRadius: 999, padding: "3px 10px", whiteSpace: "nowrap" }}>
          Example data
        </span>
      </div>

      {/* Property + range */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 14 }}>
        <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12, color: "#6d6d6d" }}>example-outdoor.com</span>
        <div role="group" aria-label="Date range" style={{ display: "inline-flex", gap: 6, flexWrap: "wrap" }}>
          {RANGES.map((r) => {
            const on = r.days === days;
            return (
              <button
                key={r.days}
                type="button"
                aria-pressed={on}
                onClick={() => setDays(r.days)}
                className={`${FOCUS} ${on ? "" : "hover:bg-[#eceef2]"} transition-colors`}
                style={{ borderRadius: 999, padding: "6px 12px", fontSize: 13, fontWeight: 500, border: 0, cursor: "pointer", background: on ? "#0454ff" : "#f5f6f8", color: on ? "#fff" : "#0b0d12" }}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Metric tiles — checkboxes, like Search Console's own */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 14 }}>
        {METRICS.map((k) => {
          const on = metrics.includes(k);
          const Icon = ICON[k];
          const diff = cur[k] - prev[k];
          const better = k === "position" ? diff < 0 : diff > 0;
          const deltaText = k === "ctr" ? `${Math.abs(diff * 100).toFixed(2)} pp` : FMT[k](Math.abs(diff));
          return (
            <button
              key={k}
              type="button"
              aria-pressed={on}
              onClick={() => toggleMetric(k)}
              className={`${FOCUS} ${on ? "" : "hover:border-[#c9ccd3]"} transition-colors`}
              style={{
                textAlign: "left",
                minWidth: 0,
                cursor: "pointer",
                background: "#fff",
                color: "#0b0d12",
                borderRadius: 14,
                padding: "12px 14px",
                border: `1px solid ${on ? COLOR[k] : "#eaeaea"}`,
                boxShadow: on ? `inset 0 0 0 1px ${COLOR[k]}` : "none",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#6d6d6d", minWidth: 0 }}>
                <span
                  aria-hidden
                  style={{ width: 14, height: 14, flexShrink: 0, borderRadius: 4, display: "grid", placeItems: "center", border: `1px solid ${on ? COLOR[k] : "#d4d6dc"}`, background: on ? COLOR[k] : "#fff" }}
                >
                  {on && <Check size={10} color="#fff" strokeWidth={3} />}
                </span>
                <Icon size={14} color={COLOR[k]} aria-hidden style={{ flexShrink: 0 }} />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{LABEL[k]}</span>
              </span>
              <motion.span
                key={`${k}-${days}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: dur }}
                style={{ display: "block", marginTop: 6, fontSize: 20, fontWeight: 600, letterSpacing: "-0.01em", fontVariantNumeric: "tabular-nums" }}
              >
                {FMT[k](cur[k])}
              </motion.span>
              <span
                style={{
                  marginTop: 4,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 2,
                  borderRadius: 999,
                  padding: "1px 6px",
                  fontSize: 11,
                  fontWeight: 600,
                  fontVariantNumeric: "tabular-nums",
                  color: better ? "#15803d" : "#dc2626",
                  background: better ? "rgba(22,163,74,0.1)" : "rgba(220,38,38,0.1)",
                }}
              >
                {better ? <ArrowUpRight size={12} aria-hidden /> : <ArrowDownRight size={12} aria-hidden />}
                <span className="sr-only">{better ? "Improved by" : "Worsened by"} </span>
                {deltaText}
              </span>
            </button>
          );
        })}
      </div>

      {/* Chart */}
      <div style={{ border: "1px solid #eaeaea", borderRadius: 14, padding: "14px 14px 10px", marginBottom: 14 }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 6, marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{metrics.map((k) => LABEL[k]).join(" and ")}</span>
          <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 11, color: "#6d6d6d" }}>
            {pts[0].date} → {pts[n - 1].date}
          </span>
        </div>

        <div style={{ display: "flex", gap: 6, height: 190 }}>
          {scales.map((s, si) => {
            const ticks = s.inverted ? [s.lo, (s.lo + s.hi) / 2, s.hi] : [s.hi, s.hi / 2, 0];
            return (
              <div
                key={s.key}
                aria-hidden
                style={{ order: si === 0 ? 0 : 2, position: "relative", width: 40, flexShrink: 0, fontSize: 10, color: COLOR[s.key], fontVariantNumeric: "tabular-nums" }}
              >
                {ticks.map((v, ti) => (
                  <span
                    key={ti}
                    style={{ position: "absolute", top: `${ti * 50}%`, transform: "translateY(-50%)", [si === 0 ? "right" : "left"]: 0 }}
                  >
                    {s.key === "ctr" ? `${(v * 100).toFixed(1)}%` : s.key === "position" ? v.toFixed(0) : nf.format(Math.round(v))}
                  </span>
                ))}
              </div>
            );
          })}

          <div
            role="group"
            tabIndex={0}
            aria-label="Trend chart. Use the left and right arrow keys to read each day."
            onPointerMove={onPointer}
            onPointerLeave={() => setActive(null)}
            onKeyDown={onKey}
            onFocus={() => setActive((a) => a ?? n - 1)}
            onBlur={() => setActive(null)}
            className={FOCUS}
            style={{ order: 1, position: "relative", flex: 1, minWidth: 0, borderRadius: 4, touchAction: "pan-y", cursor: "crosshair" }}
          >
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" width="100%" height="100%" style={{ display: "block", overflow: "visible" }} aria-hidden>
              {[0, 0.5, 1].map((f) => (
                <line key={f} x1={0} x2={W} y1={f * H} y2={f * H} stroke="#eaeaea" vectorEffect="non-scaling-stroke" />
              ))}
              <AnimatePresence initial={false}>
                <motion.g
                  key={`${days}-${metrics.join("-")}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: dur }}
                >
                  {metrics.length === 1 && (
                    <path d={`${path(scales[0])}L${W},${H}L0,${H}Z`} fill={COLOR[metrics[0]]} opacity={0.08} />
                  )}
                  {scales.map((s) => (
                    <path key={s.key} d={path(s)} fill="none" stroke={COLOR[s.key]} strokeWidth={2} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                  ))}
                </motion.g>
              </AnimatePresence>
            </svg>

            {idx != null && (
              <>
                <div aria-hidden style={{ position: "absolute", top: 0, bottom: 0, left: `${tipLeft}%`, width: 1, background: "#c9ccd3", pointerEvents: "none" }} />
                {scales.map((s) => (
                  <span
                    key={s.key}
                    aria-hidden
                    style={{ position: "absolute", left: `${tipLeft}%`, top: `${yPct(s, pts[idx][s.key])}%`, width: 9, height: 9, borderRadius: 999, background: "#fff", border: `2px solid ${COLOR[s.key]}`, transform: "translate(-50%, -50%)", pointerEvents: "none" }}
                  />
                ))}
                <div
                  style={{
                    position: "absolute",
                    top: 4,
                    left: `${tipLeft}%`,
                    transform: tipLeft > 50 ? "translateX(calc(-100% - 10px))" : "translateX(10px)",
                    background: "#0b0d12",
                    color: "#fff",
                    borderRadius: 10,
                    padding: "8px 10px",
                    fontSize: 12,
                    lineHeight: 1.5,
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                    boxShadow: "0 6px 20px rgba(11,13,18,0.18)",
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{fmtDate(pts[idx].date)}</div>
                  {metrics.map((k) => (
                    <div key={k} style={{ display: "flex", alignItems: "center", gap: 6, fontVariantNumeric: "tabular-nums" }}>
                      <span style={{ width: 8, height: 8, borderRadius: 999, background: COLOR[k] }} />
                      {LABEL[k].replace(/^(Total|Average) /, "")}: {FMT[k](pts[idx][k])}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <p aria-live="polite" className="sr-only">
          {idx != null ? `${fmtDate(pts[idx].date)}: ${metrics.map((k) => `${LABEL[k]} ${FMT[k](pts[idx][k])}`).join(", ")}` : ""}
        </p>
        <p style={{ margin: "8px 0 0", fontSize: 12, color: "#6d6d6d" }}>
          {metrics.length > 1
            ? "Two metrics are drawn on separate scales, so read each line against its own axis. Ticking a third drops the oldest."
            : "Tick a second tile to compare two metrics. Position runs 1 at the top: lower is better."}
        </p>
      </div>

      {/* Queries */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600, borderBottom: "2px solid #0454ff", paddingBottom: 4 }}>Queries</span>
        <AnimatePresence>
          {selected.size > 0 && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: reduce ? 0 : 0.2 }}
              onClick={addToTracker}
              className={`${FOCUS} hover:bg-[#0340d6] transition-colors`}
              style={{ border: 0, borderRadius: 999, padding: "6px 12px", fontSize: 13, fontWeight: 500, background: "#0454ff", color: "#fff", cursor: "pointer" }}
            >
              Add {selected.size} to rank tracker
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div style={{ overflowX: "auto", border: "1px solid #eaeaea", borderRadius: 12 }}>
        <table style={{ width: "100%", minWidth: 600, borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f5f6f8" }}>
              <th style={{ width: 36, padding: "8px 0 8px 12px", textAlign: "left" }}>
                <input
                  type="checkbox"
                  aria-label="Select all"
                  checked={allOn}
                  disabled={selectable.length === 0}
                  onChange={() => setSelected(allOn ? new Set() : new Set(selectable))}
                  className={FOCUS}
                  style={{ accentColor: "#0454ff" }}
                />
              </th>
              {(
                [
                  ["query", "Query", "left"],
                  ["clicks", "Total clicks", "right"],
                  ["impressions", "Total impressions", "right"],
                  ["ctr", "Average CTR", "right"],
                  ["position", "Average position", "right"],
                ] as const
              ).map(([key, label, align]) => {
                const on = sort?.key === key;
                return (
                  <th
                    key={key}
                    aria-sort={on ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
                    style={{ padding: "8px 12px", textAlign: align, fontWeight: 500 }}
                  >
                    <button
                      type="button"
                      onClick={() => clickSort(key)}
                      className={`${FOCUS} hover:text-[#0b0d12] transition-colors`}
                      style={{ background: "none", border: 0, padding: 0, cursor: "pointer", fontSize: 12, fontWeight: 500, whiteSpace: "nowrap", color: on ? "#0b0d12" : "#6d6d6d", display: "inline-flex", gap: 4, alignItems: "center" }}
                    >
                      {label}
                      <span aria-hidden style={{ fontSize: 9, opacity: on ? 1 : 0 }}>{on && sort.dir === "asc" ? "▲" : "▼"}</span>
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <motion.tbody key={days} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ duration: dur }}>
            {rows.map((r) => {
              const isTracked = tracked.has(r.query);
              return (
                <tr key={r.query} className="hover:bg-[#fafbfc] transition-colors" style={{ borderTop: "1px solid #eaeaea" }}>
                  <td style={{ padding: "9px 0 9px 12px" }}>
                    <input
                      type="checkbox"
                      aria-label={isTracked ? "Already tracked in this project" : r.query}
                      title={isTracked ? "Already tracked in this project" : undefined}
                      checked={isTracked || selected.has(r.query)}
                      disabled={isTracked}
                      onChange={() => toggleRow(r.query)}
                      className={FOCUS}
                      style={{ accentColor: "#0454ff" }}
                    />
                  </td>
                  <td style={{ padding: "9px 12px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      {r.query}
                      {isTracked && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: reduce ? 0 : 0.2 }}
                          style={{ fontSize: 11, fontWeight: 600, color: "#0454ff", background: "rgba(4,84,255,0.08)", borderRadius: 999, padding: "1px 8px" }}
                        >
                          Tracked
                        </motion.span>
                      )}
                    </span>
                  </td>
                  {(["clicks", "impressions", "ctr", "position"] as const).map((k) => (
                    <td key={k} style={{ padding: "9px 12px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                      {FMT[k](r[k])}
                    </td>
                  ))}
                </tr>
              );
            })}
          </motion.tbody>
        </table>
      </div>
    </div>
  );
}
