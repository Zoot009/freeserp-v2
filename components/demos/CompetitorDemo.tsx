"use client";

/**
 * Competitor Analysis as a try-it card: your page beside the pages ranking above it.
 *
 * Column headers, section titles, row labels and their hints are the dashboard's
 * comparison table (freeserp-frontend-v2 components/competitor-comparison-table.tsx):
 * "Your Business", "SERP Position", Overall Score / On-Page / Off-Page, DA / PA,
 * Title Tag "30–60 chars ideal", Meta Description "120–160 chars ideal", Word Count,
 * Keyword in Content "first 100 words", PSI Performance Score, LCP, Total Internal
 * Links — and its best/worst cell shading. Picking a row to see where you trail and
 * the "only gaps" filter are demo conveniences over those same rows. Example data.
 */

import { Fragment, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Users } from "lucide-react";

const C = {
  blue: "#0454ff",
  ink: "#0b0d12",
  muted: "#6d6d6d",
  border: "#eaeaea",
  soft: "#f5f6f8",
  green: "#16a34a",
  red: "#dc2626",
  amberInk: "#b45309",
};
const FOCUS = "outline-none focus-visible:ring-2 focus-visible:ring-[#0454ff] focus-visible:ring-offset-2";

// ── Example analysis ───────────────────────────────────────────────────────
const KEYWORD = "waterproof rain jacket";
const COLS = [
  { domain: "northpeak.com", position: 4, you: true },
  { domain: "ridgelinesupply.com", position: 1, you: false },
  { domain: "summitandtrail.com", position: 2, you: false },
  { domain: "basecampoutdoors.com", position: 3, you: false },
];

type Better = "higher" | "lower" | readonly [number, number];
type Metric = { id: string; section: string; label: string; sub?: string; better: Better; values: number[]; unit?: string; donut?: boolean };
const METRICS: Metric[] = [
  { id: "overall", section: "SEO Score", label: "Overall Score", sub: "out of 100", better: "higher", values: [72, 91, 84, 79], donut: true },
  { id: "onpage", section: "SEO Score", label: "On-Page", sub: "content & technical", better: "higher", values: [78, 88, 85, 74] },
  { id: "offpage", section: "SEO Score", label: "Off-Page", sub: "authority & backlinks", better: "higher", values: [61, 94, 82, 86] },
  { id: "da", section: "Off-Page SEO", label: "Domain Authority", sub: "DA · 0–100", better: "higher", values: [38, 71, 55, 62] },
  { id: "pa", section: "Off-Page SEO", label: "Page Authority", sub: "PA · 0–100", better: "higher", values: [29, 48, 41, 36] },
  { id: "bl", section: "Off-Page SEO", label: "Backlinks — Page", sub: "total to ranking page", better: "higher", values: [42, 1280, 316, 188] },
  { id: "title", section: "On-Page SEO", label: "Title Tag", sub: "30–60 chars ideal", better: [30, 60], values: [58, 54, 63, 47], unit: " ch" },
  { id: "meta", section: "On-Page SEO", label: "Meta Description", sub: "120–160 chars ideal", better: [120, 160], values: [96, 155, 158, 171], unit: " ch" },
  { id: "words", section: "On-Page SEO", label: "Word Count", better: "higher", values: [840, 2260, 1710, 1390] },
  { id: "kw", section: "On-Page SEO", label: "Keyword in Content", sub: "first 100 words", better: "higher", values: [2, 6, 4, 5] },
  { id: "alt", section: "On-Page SEO", label: "Images with Alt Text", better: "higher", values: [6, 22, 15, 12] },
  { id: "psi", section: "Page Speed (Google PSI — Mobile)", label: "Performance Score", sub: "0–100, higher is better", better: "higher", values: [84, 71, 66, 82] },
  { id: "lcp", section: "Page Speed (Google PSI — Mobile)", label: "LCP", sub: "Largest Contentful Paint", better: "lower", values: [2.1, 2.3, 2.8, 1.9], unit: "s" },
  { id: "int", section: "Internal Links (on-page)", label: "Total Internal Links", better: "higher", values: [128, 118, 92, 75] },
];

/** Smaller is better: distance outside the ideal range, the value itself, or its negative. */
const cost = (m: Metric, v: number) =>
  m.better === "higher" ? -v : m.better === "lower" ? v : Math.max(0, m.better[0] - v, v - m.better[1]);
const ahead = (m: Metric) => m.values.slice(1).map((v, i) => (cost(m, v) < cost(m, m.values[0]) ? i + 1 : -1)).filter((i) => i > 0);
const fmt = (m: Metric, v: number) => `${v.toLocaleString("en-US")}${m.unit ?? ""}`;
const posColor = (p: number) => (p <= 3 ? C.green : p <= 10 ? C.amberInk : C.red);

function shade(m: Metric, v: number) {
  if (Array.isArray(m.better)) return null; // range rows colour the value instead, as the dashboard does
  const costs = m.values.map((x) => cost(m, x));
  const c = cost(m, v);
  if (c === Math.min(...costs)) return "#e9f7ef";
  if (c === Math.max(...costs)) return "#fdecec";
  return null;
}

function Donut({ score, reduced }: { score: number; reduced: boolean }) {
  const r = 22;
  const len = 2 * Math.PI * r;
  const color = score >= 80 ? C.green : score >= 60 ? C.amberInk : C.red;
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" role="img" aria-label={`${score} out of 100`} className="mx-auto block">
      <circle cx="28" cy="28" r={r} fill="none" stroke={C.soft} strokeWidth="5" />
      <motion.circle
        cx="28" cy="28" r={r} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
        transform="rotate(-90 28 28)"
        strokeDasharray={len}
        initial={{ strokeDashoffset: reduced ? len * (1 - score / 100) : len }}
        whileInView={{ strokeDashoffset: len * (1 - score / 100) }}
        viewport={{ once: true }}
        transition={{ duration: reduced ? 0 : 0.9, ease: "easeOut" }}
      />
      <text x="28" y="33" textAnchor="middle" fontSize="15" fontWeight="700" fill={color}>{score}</text>
    </svg>
  );
}

export function CompetitorDemo() {
  const reduced = useReducedMotion() ?? false;
  const [picked, setPicked] = useState<string | null>("words");
  const [gapsOnly, setGapsOnly] = useState(false);

  const trailing = METRICS.filter((m) => ahead(m).length > 0);
  const rows = gapsOnly ? trailing : METRICS;
  const pickedMetric = METRICS.find((m) => m.id === picked) ?? null;
  const pickedAhead = pickedMetric ? ahead(pickedMetric) : [];

  return (
    <div
      className="@container w-full min-w-0"
      style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 20, padding: "clamp(16px, 3vw, 24px)", color: C.ink, boxSizing: "border-box" }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[14px] font-semibold">
            <Users size={15} style={{ color: C.blue }} aria-hidden />
            &ldquo;{KEYWORD}&rdquo;
          </div>
          <div className="text-[12px]" style={{ color: C.muted }}>
            {COLS[0].domain} vs the {COLS.length - 1} pages above it · United States · Desktop
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-pressed={gapsOnly}
            onClick={() => setGapsOnly((v) => !v)}
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${FOCUS}`}
            style={{ background: gapsOnly ? C.blue : C.soft, color: gapsOnly ? "#fff" : C.ink }}
          >
            <span
              className="relative inline-block h-3.5 w-6 rounded-full transition-colors"
              style={{ background: gapsOnly ? "rgba(255,255,255,.35)" : "#d6d9e0" }}
              aria-hidden
            >
              <span className="absolute top-0.5 size-2.5 rounded-full bg-white transition-all" style={{ left: gapsOnly ? 12 : 2 }} />
            </span>
            Only gaps ({trailing.length})
          </button>
          <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide" style={{ background: "#eef3ff", color: C.blue }}>
            Example data
          </span>
        </div>
      </div>

      <div className="mt-3 rounded-xl px-3 py-2 text-[12.5px]" style={{ background: C.soft }} aria-live="polite">
        {pickedMetric ? (
          pickedAhead.length === 0 ? (
            <span>
              <strong>{pickedMetric.label}:</strong> you lead every page above you.
            </span>
          ) : (
            <span>
              <strong>{pickedMetric.label}:</strong> you trail{" "}
              {pickedAhead.map((i, k) => (
                <Fragment key={i}>
                  {k > 0 && ", "}
                  <span className="font-medium">{COLS[i].domain}</span> ({fmt(pickedMetric, pickedMetric.values[i])})
                </Fragment>
              ))}{" "}
              — you have {fmt(pickedMetric, pickedMetric.values[0])}.
            </span>
          )
        ) : (
          <span style={{ color: C.muted }}>Click a metric to see which pages beat you on it.</span>
        )}
      </div>

      <div className="mt-3 overflow-x-auto rounded-2xl" style={{ border: `1px solid ${C.border}` }}>
        <table className="w-full min-w-[620px] border-collapse text-[13px]" style={{ tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 168 }} />
            {COLS.map((c) => <col key={c.domain} />)}
          </colgroup>
          <thead>
            <tr>
              <th className="sticky left-0 z-[2]" style={{ background: C.soft, borderBottom: `1px solid ${C.border}` }} />
              {COLS.map((c) => (
                <th key={c.domain} className="p-2 align-top font-normal" style={{ borderBottom: `1px solid ${C.border}` }}>
                  <div className="overflow-hidden rounded-xl" style={{ border: `1px solid ${c.you ? "#c7d6ff" : C.border}`, background: c.you ? "#eef3ff" : "#fff" }}>
                    <div className="h-[3px]" style={{ background: c.you ? C.blue : posColor(c.position) }} />
                    <div className="px-2 py-2">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.08em]" style={{ color: c.you ? C.blue : "transparent" }}>
                        {c.you ? "Your Business" : "·"}
                      </div>
                      <div className="truncate text-[12.5px] font-medium" title={c.domain}>{c.domain}</div>
                      <div className="mt-1 text-[22px] font-semibold leading-none tabular-nums" style={{ color: posColor(c.position) }}>#{c.position}</div>
                      <div className="mt-1 text-[11px]" style={{ color: C.muted }}>SERP Position</div>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((m, idx) => {
              const sectionStart = idx === 0 || rows[idx - 1].section !== m.section;
              const isPicked = picked === m.id;
              const beat = ahead(m);
              return (
                <Fragment key={m.id}>
                  {sectionStart && (
                    <tr>
                      <td colSpan={COLS.length + 1} className="px-3 pb-1.5 pt-3" style={{ borderBottom: `1px solid ${C.border}` }}>
                        <span className="sticky left-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em]">
                          <span className="inline-block h-3 w-[3px] rounded" style={{ background: C.blue }} aria-hidden />
                          {m.section}
                        </span>
                      </td>
                    </tr>
                  )}
                  <tr style={{ background: isPicked ? "#f7f9ff" : undefined }}>
                    <td className="sticky left-0 z-[1] p-0" style={{ background: isPicked ? "#eef3ff" : C.soft, borderBottom: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}` }}>
                      <button
                        type="button"
                        aria-pressed={isPicked}
                        onClick={() => setPicked(isPicked ? null : m.id)}
                        className={`block w-full px-3 py-2.5 text-left transition-colors hover:bg-[#eef3ff] ${FOCUS} focus-visible:ring-inset focus-visible:ring-offset-0`}
                      >
                        <span className="flex items-center gap-1.5 text-[12.5px] font-medium" style={{ color: isPicked ? C.blue : C.ink }}>
                          {m.label}
                          {beat.length > 0 && (
                            <span className="rounded-full px-1.5 text-[10px] font-semibold" style={{ background: "#fdecec", color: C.red }} title={`${beat.length} of ${COLS.length - 1} pages beat you`}>
                              −{beat.length}
                            </span>
                          )}
                        </span>
                        {m.sub && <span className="block text-[11px]" style={{ color: C.muted }}>{m.sub}</span>}
                      </button>
                    </td>
                    {m.values.map((v, i) => {
                      const bg = shade(m, v);
                      const beatsYou = isPicked && beat.includes(i);
                      const youTrail = isPicked && i === 0 && beat.length > 0;
                      const inRange = Array.isArray(m.better) ? cost(m, v) === 0 : null;
                      return (
                        <td
                          key={i}
                          className="px-2 py-2.5 text-center align-middle tabular-nums transition-shadow"
                          style={{
                            background: bg ?? (i === 0 ? "#f7f9ff" : undefined),
                            borderBottom: `1px solid ${C.border}`,
                            borderRight: i < COLS.length - 1 ? `1px solid ${C.border}` : undefined,
                            boxShadow: beatsYou ? `inset 0 0 0 2px ${C.blue}` : youTrail ? `inset 0 0 0 2px ${C.red}` : "none",
                          }}
                        >
                          {m.donut ? (
                            <Donut score={v} reduced={reduced} />
                          ) : (
                            <span
                              className="text-[14px] font-semibold"
                              style={{ color: inRange === null ? C.ink : inRange ? C.green : C.amberInk }}
                            >
                              {fmt(m, v)}
                            </span>
                          )}
                          {beatsYou && <span className="block text-[10.5px] font-semibold" style={{ color: C.blue }}>ahead of you</span>}
                          {youTrail && <span className="block text-[10.5px] font-semibold" style={{ color: C.red }}>you trail {beat.length}</span>}
                        </td>
                      );
                    })}
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11.5px]" style={{ color: C.muted }}>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block size-2.5 rounded-sm" style={{ background: "#e9f7ef", border: "1px solid #bfe6cd" }} aria-hidden />Best</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block size-2.5 rounded-sm" style={{ background: "#fdecec", border: "1px solid #f5c2c2" }} aria-hidden />Worst</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block size-2.5 rounded-sm" style={{ boxShadow: `inset 0 0 0 2px ${C.blue}` }} aria-hidden />Ahead of you on the selected metric</span>
      </div>
    </div>
  );
}
