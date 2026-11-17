"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { Check, Gauge, Loader2, Search } from "lucide-react";

/**
 * Keyword Score Checker demo. Mirrors the real report
 * (freeserp-frontend-v2 app/[locale]/dashboard/keyword-analysis/results):
 * - overall = on-page 30% + off-page 70% (lib/seoScorer.ts blendTotal)
 * - off-page = DA 30, domain backlinks 20 (log vs 1M), PA 10, page backlinks 10
 *   (log vs 10k) — offPageScore() in lib/seoScorer.ts, computed below
 * - grade bands A+/A/B/C/D/F (gradeFromTotal), score tones 80/60
 * - TTFB/FCP/LCP/CLS bands from components/keyword-analysis-report.tsx speedTone
 * - check order from the backend worker: crawl → PageSpeed → DA/PA + backlinks
 * On-page scores and every page/domain below are invented example data.
 */

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

type Example = {
  url: string;
  keyword: string;
  onPage: number;
  da: number;
  pa: number;
  domainBacklinks: number;
  pageBacklinks: number;
  ttfb: number;
  fcp: number;
  lcp: number;
  cls: number;
};

const EXAMPLES: Example[] = [
  {
    url: "https://northtrail-outfitters.com/shop/mens-rain-jackets",
    keyword: "waterproof rain jacket",
    onPage: 91,
    da: 58,
    pa: 44,
    domainBacklinks: 182_000,
    pageBacklinks: 640,
    ttfb: 412,
    fcp: 1280,
    lcp: 2940,
    cls: 0.04,
  },
  {
    url: "https://brightsmile-dental.co.uk/teeth-whitening",
    keyword: "teeth whitening london",
    onPage: 62,
    da: 24,
    pa: 18,
    domainBacklinks: 3_100,
    pageBacklinks: 42,
    ttfb: 1120,
    fcp: 2650,
    lcp: 4810,
    cls: 0.18,
  },
  {
    url: "https://ledgerly.io/blog/invoice-templates",
    keyword: "free invoice template",
    onPage: 84,
    da: 88,
    pa: 61,
    domainBacklinks: 2_400_000,
    pageBacklinks: 5_800,
    ttfb: 236,
    fcp: 980,
    lcp: 1890,
    cls: 0.02,
  },
];

// lib/seoScorer.ts — offPageScore + blendTotal + gradeFromTotal.
const logNorm = (n: number, ref: number) =>
  Math.max(0, Math.min(1, Math.log10(n + 1) / Math.log10(ref + 1)));

function score(e: Example) {
  const offRaw =
    (e.da / 100) * 30 +
    logNorm(e.domainBacklinks, 1_000_000) * 20 +
    (e.pa / 100) * 10 +
    logNorm(e.pageBacklinks, 10_000) * 10;
  const offPage = Math.round((offRaw / 70) * 100);
  const total = Math.min(100, Math.round((e.onPage / 100) * 30 + offRaw));
  const [grade, label] =
    total >= 90 ? ["A+", "Excellent"]
    : total >= 80 ? ["A", "Very Good"]
    : total >= 70 ? ["B", "Good"]
    : total >= 60 ? ["C", "Fair"]
    : total >= 50 ? ["D", "Needs Work"]
    : ["F", "Poor"];
  return { onPage: e.onPage, offPage, total, grade, label };
}

// The report's one-line verdict (results/page.tsx verdict()).
function verdict(on: number, off: number) {
  if (on >= 70 && off >= 70) return "Strong on both fronts: the page is well built, and the site has the authority to back it.";
  if (on >= 70) return "The page itself is in good shape. Its authority and backlinks are what hold the score down.";
  if (off >= 70) return "The site has the authority; the page itself needs work. Start with the biggest gaps below.";
  return "Both the page and its authority have room to grow. Start with the biggest gaps below.";
}

const tone = (v: number) => (v >= 80 ? C.green : v >= 60 ? C.blue : C.red);

// components/keyword-analysis-report.tsx speedTone: ≤ good is good, ≤ fair needs work, else poor.
function speed(v: number, good: number, fair: number) {
  return v <= good
    ? { color: C.green, text: "Good" }
    : v <= fair
      ? { color: C.amber, text: "Needs work" }
      : { color: C.red, text: "Poor" };
}

const STEPS = ["Crawling the page", "Running PageSpeed", "Looking up authority & backlinks"];
const STEP_MS = 850;

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0454ff]";
const fmt = (n: number) => n.toLocaleString("en-US");

export function KeywordScoreDemo() {
  const reduce = useReducedMotion() ?? false;
  const [ex, setEx] = useState(0);
  // -1 idle, 0..2 the check currently running, 3 done.
  const [step, setStep] = useState(-1);
  const e = EXAMPLES[ex];

  useEffect(() => {
    if (step < 0 || step >= STEPS.length) return;
    const id = setTimeout(() => setStep((s) => s + 1), STEP_MS);
    return () => clearTimeout(id);
  }, [step]);

  const running = step >= 0 && step < STEPS.length;
  const done = step >= STEPS.length;
  const dur = reduce ? 0 : 0.28;

  return (
    <div
      className="@container"
      style={{
        background: "#fff",
        border: `1px solid ${C.border}`,
        borderRadius: 20,
        padding: "clamp(16px, 3vw, 28px)",
        width: "100%",
        boxSizing: "border-box",
        color: C.ink,
        minWidth: 0,
        fontSize: 14,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600 }}>
          <Gauge size={16} color={C.blue} aria-hidden />
          Keyword Score Checker
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, background: C.soft, border: `1px solid ${C.border}`, borderRadius: 999, padding: "3px 10px", whiteSpace: "nowrap" }}>
          Example data
        </span>
      </div>

      {/* Example picker */}
      <div role="group" aria-label="Example page" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 12, color: C.muted, marginRight: 2 }}>Try an example:</span>
        {EXAMPLES.map((x, i) => (
          <button
            key={x.keyword}
            type="button"
            aria-pressed={i === ex}
            onClick={() => {
              setEx(i);
              setStep(-1);
            }}
            className={`${focus} ${i === ex ? "" : "hover:bg-[#eceef2]"}`}
            style={{
              borderRadius: 999,
              padding: "6px 12px",
              fontSize: 13,
              fontWeight: 500,
              border: 0,
              cursor: "pointer",
              background: i === ex ? C.blue : C.soft,
              color: i === ex ? "#fff" : C.ink,
              transition: "background .2s",
            }}
          >
            {x.keyword}
          </button>
        ))}
      </div>

      {/* The tool's form (dashboard/keyword-analysis/page.tsx labels) */}
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          setStep(reduce ? STEPS.length : 0);
        }}
        className="grid grid-cols-1 gap-3 @2xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_auto] @2xl:items-end"
      >
        <Field label="Website URL" value={e.url} />
        <Field label="Target keyword" value={e.keyword} />
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <button
            type="submit"
            disabled={running}
            className={`${focus} hover:brightness-110`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              background: C.blue,
              color: "#fff",
              border: 0,
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              padding: "11px 18px",
              cursor: running ? "default" : "pointer",
              opacity: running ? 0.75 : 1,
              whiteSpace: "nowrap",
            }}
          >
            {running ? <Loader2 size={16} className={reduce ? "" : "animate-spin"} aria-hidden /> : <Search size={16} aria-hidden />}
            {running ? "Analyzing…" : done ? "Run again" : "Score this page"}
          </button>
        </div>
      </form>
      <div style={{ fontSize: 12, color: C.muted, marginTop: 8 }}>15 credits a page</div>

      <div aria-live="polite" style={{ marginTop: 18 }}>
        <AnimatePresence mode="wait" initial={false}>
          {step < 0 && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: dur }}
              style={{ background: C.soft, borderRadius: 12, padding: "22px 18px", textAlign: "center", color: C.muted, fontSize: 13, lineHeight: 1.5 }}
            >
              Press <b style={{ color: C.ink }}>Score this page</b> to crawl it, run it through PageSpeed and look up its authority.
            </motion.div>
          )}

          {running && (
            <motion.div
              key="running"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: dur }}
              aria-busy="true"
              style={{ background: "#eef3ff", borderRadius: 12, padding: 16 }}
            >
              <div role="status" style={{ fontSize: 13, fontWeight: 600, color: C.blue, marginBottom: 12 }}>
                Analyzing your page…
              </div>
              <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10 }}>
                {STEPS.map((s, i) => {
                  const state = i < step ? "done" : i === step ? "active" : "todo";
                  return (
                    <li key={s} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: state === "todo" ? C.muted : C.ink }}>
                      <span
                        aria-hidden
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 999,
                          display: "grid",
                          placeItems: "center",
                          flexShrink: 0,
                          background: state === "done" ? C.green : state === "active" ? C.blue : "#fff",
                          border: state === "todo" ? `1px solid ${C.border}` : 0,
                          color: "#fff",
                        }}
                      >
                        {state === "done" ? <Check size={12} strokeWidth={3} /> : state === "active" ? <Loader2 size={12} className="animate-spin" /> : null}
                      </span>
                      {s}
                      <span className="sr-only">{state === "done" ? " (done)" : state === "active" ? " (running)" : ""}</span>
                    </li>
                  );
                })}
              </ol>
              <div style={{ height: 4, background: "#dbe5ff", borderRadius: 999, marginTop: 14, overflow: "hidden" }}>
                <motion.div
                  initial={false}
                  animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                  transition={{ duration: STEP_MS / 1000, ease: "linear" }}
                  style={{ height: "100%", background: C.blue, borderRadius: 999 }}
                />
              </div>
            </motion.div>
          )}

          {done && <Report key={`report-${ex}`} e={e} reduce={reduce} dur={dur} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
      <span style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: C.muted }}>{label}</span>
      <input
        readOnly
        value={value}
        className={focus}
        style={{
          width: "100%",
          boxSizing: "border-box",
          minWidth: 0,
          border: `1px solid ${C.border}`,
          borderRadius: 10,
          padding: "10px 12px",
          fontSize: 14,
          color: C.ink,
          background: "#fff",
          fontFamily: "inherit",
        }}
      />
    </label>
  );
}

function Report({ e, reduce, dur }: { e: Example; reduce: boolean; dur: number }) {
  const s = score(e);
  const ring = tone(s.total);
  const vitals = [
    { label: "TTFB", value: `${fmt(e.ttfb)}ms`, ...speed(e.ttfb, 800, 1800) },
    { label: "FCP", value: `${fmt(e.fcp)}ms`, ...speed(e.fcp, 1800, 3000) },
    { label: "LCP", value: `${fmt(e.lcp)}ms`, ...speed(e.lcp, 2500, 4000) },
    { label: "CLS", value: e.cls.toFixed(2), ...speed(e.cls, 0.1, 0.25) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: dur }}
      style={{ display: "grid", gap: 12 }}
    >
      {/* Overall score */}
      <div className="flex flex-col items-center gap-4 @lg:flex-row @lg:items-center @lg:gap-6" style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
        <ScoreRing value={s.total} color={ring} reduce={reduce} />
        <div style={{ flex: 1, minWidth: 0, width: "100%" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px 10px" }}>
            <span style={{ fontSize: 15, fontWeight: 600 }}>Overall score</span>
            <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.03em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 999, color: ring, background: `${ring}14` }}>
              Grade {s.grade} · {s.label}
            </span>
          </div>
          <p style={{ margin: "8px 0 14px", fontSize: 13, lineHeight: 1.5, color: C.muted }}>{verdict(s.onPage, s.offPage)}</p>
          <div className="grid grid-cols-1 gap-3 @xl:grid-cols-2 @xl:gap-x-6">
            <Part label="On-page SEO" weight="30% of score" value={s.onPage} reduce={reduce} />
            <Part label="Off-page SEO" weight="70% of score" value={s.offPage} reduce={reduce} />
          </div>
        </div>
      </div>

      {/* Authority & backlinks */}
      <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
        <div style={{ fontWeight: 600, fontSize: 14 }}>Authority &amp; backlinks</div>
        <div style={{ fontSize: 12, color: C.muted, margin: "2px 0 12px" }}>Off-page: 70% of the score</div>
        <div className="grid grid-cols-2 gap-2.5 @2xl:grid-cols-4">
          <Stat label="Domain Authority" value={e.da} outOf={100} caption="Site-wide" reduce={reduce} />
          <Stat label="Page Authority" value={e.pa} outOf={100} caption="This page" reduce={reduce} />
          <Stat label="Domain backlinks" value={e.domainBacklinks} caption="Site-wide" reduce={reduce} />
          <Stat label="Page backlinks" value={e.pageBacklinks} caption="This page" reduce={reduce} />
        </div>
      </div>

      {/* Performance */}
      <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
        <div style={{ fontWeight: 600, fontSize: 14 }}>Performance</div>
        <div style={{ fontSize: 12, color: C.muted, margin: "2px 0 12px" }}>Page speed from the crawl and PageSpeed</div>
        <div className="grid grid-cols-2 gap-2.5 @2xl:grid-cols-4">
          {vitals.map((v, i) => (
            <motion.div
              key={v.label}
              initial={{ opacity: 0, y: reduce ? 0 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: dur, delay: reduce ? 0 : 0.15 + i * 0.06 }}
              style={{ background: C.soft, borderRadius: 12, padding: "10px 12px", minWidth: 0 }}
            >
              <div style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: "0.04em", color: C.muted }}>{v.label}</div>
              <div style={{ fontSize: 20, fontWeight: 600, fontVariantNumeric: "tabular-nums", margin: "2px 0 4px" }}>{v.value}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.muted }}>
                <span aria-hidden style={{ width: 8, height: 8, borderRadius: 999, background: v.color, flexShrink: 0 }} />
                {v.text}
              </div>
            </motion.div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: C.muted, marginTop: 10, lineHeight: 1.5 }}>
          Good at or under: TTFB 800ms · FCP 1,800ms · LCP 2,500ms · CLS 0.10
        </div>
      </div>
    </motion.div>
  );
}

function ScoreRing({ value, color, reduce }: { value: number; color: string; reduce: boolean }) {
  const mv = useMotionValue(reduce ? value : 0);
  const shown = useTransform(mv, (v) => Math.round(v));
  const r = 52;
  const c = 2 * Math.PI * r;
  const offset = useTransform(mv, (v) => c - (v / 100) * c);

  useEffect(() => {
    if (reduce) {
      mv.set(value);
      return;
    }
    const ctl = animate(mv, value, { duration: 0.9, ease: [0.16, 1, 0.3, 1] });
    return () => ctl.stop();
  }, [mv, value, reduce]);

  return (
    <div role="img" aria-label={`Overall score ${value} out of 100`} style={{ position: "relative", width: 120, height: 120, flexShrink: 0 }}>
      <svg width={120} height={120} viewBox="0 0 120 120" aria-hidden>
        <circle cx={60} cy={60} r={r} fill="none" stroke="#eef0f3" strokeWidth={10} />
        <motion.circle
          cx={60}
          cy={60}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={c}
          style={{ strokeDashoffset: offset }}
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div aria-hidden style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
        <div>
          <motion.div style={{ fontSize: 34, fontWeight: 700, lineHeight: 1, fontVariantNumeric: "tabular-nums", color }}>{shown}</motion.div>
          <div style={{ fontSize: 11, color: C.muted, fontWeight: 500, marginTop: 3 }}>/ 100</div>
        </div>
      </div>
    </div>
  );
}

function Meter({ pct, color, reduce }: { pct: number; color: string; reduce: boolean }) {
  return (
    <div style={{ height: 6, borderRadius: 999, background: "#eef0f3", overflow: "hidden" }}>
      <motion.div
        initial={{ width: reduce ? `${pct}%` : 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: reduce ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ height: "100%", borderRadius: 999, background: color }}
      />
    </div>
  );
}

function Part({ label, weight, value, reduce }: { label: string; weight: string; value: number; reduce: boolean }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: C.muted }}>
          {label}
          <span style={{ fontWeight: 500, letterSpacing: 0, textTransform: "none", marginLeft: 6 }}>· {weight}</span>
        </span>
        <span style={{ fontSize: 20, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{value}</span>
      </div>
      <Meter pct={value} color={tone(value)} reduce={reduce} />
    </div>
  );
}

function Stat({ label, value, outOf, caption, reduce }: { label: string; value: number; outOf?: number; caption: string; reduce: boolean }) {
  return (
    <div style={{ background: C.soft, borderRadius: 12, padding: "10px 12px", minWidth: 0 }}>
      <div style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.15, fontVariantNumeric: "tabular-nums", overflowWrap: "anywhere" }}>
        {fmt(value)}
        {outOf && <small style={{ fontSize: 12, fontWeight: 500, color: C.muted, marginLeft: 2 }}>/{outOf}</small>}
      </div>
      <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{caption}</div>
      {outOf && (
        <div style={{ marginTop: 8 }}>
          <Meter pct={(value / outOf) * 100} color={tone(value)} reduce={reduce} />
        </div>
      )}
    </div>
  );
}
