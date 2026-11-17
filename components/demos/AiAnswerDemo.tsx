"use client";

/**
 * AI visibility tracker, as a try-it card.
 *
 * The metrics are the llm-tracker's (llmMetrics.ts): a mention is the brand
 * named in the prose, a citation is the brand used as a linked source, and
 * prominence is how far into the answer the first mention lands (0–1), shown
 * the way the prompt board shows it: early < 0.34 <= mid < 0.67 <= late.
 * Rates are per run of 5 answers; share of voice is across that assistant's
 * answers. Brand, rivals, answers and numbers are fixed example data.
 */

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ExternalLink, Sparkles } from "lucide-react";

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

type Platform = "chatgpt" | "gemini" | "perplexity" | "claude";
const PLATFORMS: { id: Platform; label: string; color: string }[] = [
  { id: "chatgpt", label: "ChatGPT", color: "#10a37f" },
  { id: "gemini", label: "Gemini", color: "#4285f4" },
  { id: "perplexity", label: "Perplexity", color: "#1f8a8a" },
  { id: "claude", label: "Claude", color: "#d97757" },
];

const BRAND = "Northpeak";
const DOMAIN = "northpeak.com";
const BRAND_RE = /(northpeak\.com|Northpeak)/gi;

type Answer = {
  text: string;
  sources: string[];
  /** Rates across this run's 5 answers, 0–1. */
  mention: number;
  cited: number;
  /** Mean prominence over the answers that mentioned the brand; null if none did. */
  prominence: number | null;
};

const PROMPTS: { q: string; answers: Record<Platform, Answer> }[] = [
  {
    q: "best waterproof rain jacket for hiking",
    answers: {
      chatgpt: {
        text: "For wet-weather hiking, three shells stand out. Northpeak's Cascade 3L uses a fully taped three-layer membrane and is the most breathable on long climbs. The Ridgeline Storm Pro is the lightest at 310 g, while Summitwear's Torrent is the budget pick, though its hood adjusts less precisely.",
        sources: ["northpeak.com", "trailtestedgear.com", "ridgeline-outdoor.com"],
        mention: 0.82, cited: 0.6, prominence: 0.14,
      },
      gemini: {
        text: "Popular choices include the Summitwear Torrent, the Ridgeline Storm Pro and the Alder & Pine Drift. Look for a fully taped membrane, pit zips and a stiffened hood brim. Northpeak also makes a well-reviewed three-layer shell, the Cascade 3L.",
        sources: ["summitwear.com", "hikingreviewhub.com"],
        mention: 0.68, cited: 0.4, prominence: 0.71,
      },
      perplexity: {
        text: "Reviewers most often recommend the Northpeak Cascade 3L for sustained rain and the Ridgeline Storm Pro for weight-conscious hikers [1][2]. Both use three-layer laminates; the Cascade adds longer pit zips, which testers credit for less condensation on climbs [1].",
        sources: ["northpeak.com", "trailtestedgear.com", "hikingreviewhub.com", "ridgeline-outdoor.com"],
        mention: 0.9, cited: 1, prominence: 0.06,
      },
      claude: {
        text: "It depends on how you hike. For long, steep days in steady rain, a three-layer shell with good venting matters most — the Ridgeline Storm Pro and Northpeak Cascade 3L both fit. If you mostly walk in showers, a lighter 2.5-layer jacket like the Summitwear Torrent is cheaper and packs smaller.",
        sources: ["ridgeline-outdoor.com", "northpeak.com", "backpackermag-reviews.com"],
        mention: 0.74, cited: 0.8, prominence: 0.42,
      },
    },
  },
  {
    q: "sustainable outdoor clothing brands",
    answers: {
      chatgpt: {
        text: "Brands known for sustainability include Alder & Pine, which uses recycled nylon across its range; Northpeak, which runs a repair-and-resale programme; and Ridgeline, which has moved its insulation to certified recycled fill.",
        sources: ["alderandpine.com", "northpeak.com", "greenoutdoorreport.org"],
        mention: 0.94, cited: 0.8, prominence: 0.38,
      },
      gemini: {
        text: "Look for brands with Bluesign-certified fabrics, published supply chains and repair programmes. Alder & Pine and Ridgeline are frequently cited for recycled materials, and Summitwear publishes an annual impact report.",
        sources: ["greenoutdoorreport.org", "alderandpine.com"],
        mention: 0.4, cited: 0.2, prominence: 0.55,
      },
      perplexity: {
        text: "Northpeak and Alder & Pine score highest in recent sustainability rankings, largely on repair services and recycled content [1]. Northpeak's Worn Again programme has refurbished over 40,000 garments, according to its 2026 impact report [2].",
        sources: ["greenoutdoorreport.org", "northpeak.com", "alderandpine.com"],
        mention: 1, cited: 1, prominence: 0.0,
      },
      claude: {
        text: "A few brands stand out for credible commitments rather than marketing: Alder & Pine for recycled fabrics, Ridgeline for down traceability, and Northpeak for its repair-and-resale programme. Checking for third-party certifications like Bluesign is a good filter.",
        sources: ["greenoutdoorreport.org", "ridgeline-outdoor.com"],
        mention: 0.8, cited: 0.4, prominence: 0.69,
      },
    },
  },
  {
    q: "best merino base layer for winter",
    answers: {
      chatgpt: {
        text: "For cold-weather layering, a 200–260 gsm merino top is the sweet spot. The Ridgeline Thermal 250 is the warmest in its class, the Summitwear Merino Core is the best value, and the Northpeak Ember 200 is a good pick if you run warm and want more breathability.",
        sources: ["trailtestedgear.com", "ridgeline-outdoor.com"],
        mention: 0.62, cited: 0.2, prominence: 0.83,
      },
      gemini: {
        text: "The Northpeak Ember 200 is often recommended as a midweight merino layer, alongside the Ridgeline Thermal 250. Heavier 250 gsm fabrics suit static activities like ice fishing; lighter weights are better for skiing and winter hiking.",
        sources: ["northpeak.com", "hikingreviewhub.com"],
        mention: 0.55, cited: 0.2, prominence: 0.0,
      },
      perplexity: {
        text: "Testers rate the Ridgeline Thermal 250 warmest and the Alder & Pine Merino Crew most durable [1][2]. For active use, lighter options such as the Northpeak Ember 200 manage sweat better [3].",
        sources: ["trailtestedgear.com", "hikingreviewhub.com", "northpeak.com"],
        mention: 0.72, cited: 0.8, prominence: 0.6,
      },
      claude: {
        text: "For winter, start with weight: around 250 gsm for low-output days, 150–200 gsm if you move fast. The Ridgeline Thermal 250 and Alder & Pine Merino Crew are both well regarded; a merino-nylon blend lasts longer than pure merino.",
        sources: ["trailtestedgear.com", "alderandpine.com"],
        mention: 0.2, cited: 0, prominence: 0.88,
      },
    },
  },
];

/** Share of voice across each assistant's completed answers (example data). */
const SOV: Record<Platform, { name: string; share: number; cited: number }[]> = {
  chatgpt: [
    { name: BRAND, share: 0.34, cited: 8 },
    { name: "Ridgeline", share: 0.29, cited: 4 },
    { name: "Summitwear", share: 0.21, cited: 0 },
    { name: "Alder & Pine", share: 0.16, cited: 3 },
  ],
  gemini: [
    { name: "Ridgeline", share: 0.31, cited: 2 },
    { name: "Summitwear", share: 0.27, cited: 3 },
    { name: BRAND, share: 0.22, cited: 2 },
    { name: "Alder & Pine", share: 0.2, cited: 4 },
  ],
  perplexity: [
    { name: BRAND, share: 0.38, cited: 13 },
    { name: "Ridgeline", share: 0.26, cited: 6 },
    { name: "Alder & Pine", share: 0.24, cited: 7 },
    { name: "Summitwear", share: 0.12, cited: 1 },
  ],
  claude: [
    { name: "Ridgeline", share: 0.33, cited: 5 },
    { name: BRAND, share: 0.27, cited: 6 },
    { name: "Alder & Pine", share: 0.25, cited: 4 },
    { name: "Summitwear", share: 0.15, cited: 0 },
  ],
};
const RIVAL_RAMP = ["#6d6d6d", "#9aa1ad", "#c3c8d0", "#dfe2e7"];

const pct = (v: number) => `${Math.round(v * 100)}%`;
const promLabel = (v: number) => (v < 0.34 ? "early" : v < 0.67 ? "mid" : "late");

function Highlighted({ text }: { text: string }) {
  return (
    <>
      {text.split(BRAND_RE).map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="rounded px-0.5 font-semibold" style={{ background: "#dbe6ff", color: C.blue }}>
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

function Prominence({ v }: { v: number | null }) {
  if (v == null) return <span style={{ color: C.muted }}>—</span>;
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="relative h-1 w-10 rounded-full" style={{ background: C.border }} aria-hidden>
        <span className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ left: `${v * 100}%`, background: C.blue }} />
      </span>
      <b className="text-[12px]">{promLabel(v)}</b>
    </span>
  );
}

export function AiAnswerDemo() {
  const reduce = useReducedMotion();
  const [prompt, setPrompt] = useState(0);
  const [platform, setPlatform] = useState<Platform>("chatgpt");

  const p = PROMPTS[prompt];
  const a = p.answers[platform];
  const mentioned = a.text.toLowerCase().includes(BRAND.toLowerCase());
  const cited = a.sources.includes(DOMAIN);
  const label = PLATFORMS.find((x) => x.id === platform)!.label;
  const sov = SOV[platform];
  let rival = 0;
  const sovColors = sov.map((s) => (s.name === BRAND ? C.blue : RIVAL_RAMP[rival++ % RIVAL_RAMP.length]));
  const t = { duration: reduce ? 0 : 0.22, ease: "easeOut" as const };

  return (
    <div
      className="@container w-full min-w-0"
      style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 20, padding: "clamp(16px, 3vw, 24px)", color: C.ink, boxSizing: "border-box" }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[14px] font-semibold">
            <Sparkles size={15} style={{ color: C.blue }} aria-hidden /> {BRAND}
          </div>
          <div className="text-[12px]" style={{ color: C.muted }}>
            {DOMAIN} · {PROMPTS.length} prompts across 4 assistants · 5 answers per run
          </div>
        </div>
        <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide" style={{ background: "#eef3ff", color: C.blue }}>
          Example data
        </span>
      </div>

      {/* Prompt selector */}
      <div role="group" aria-label="Prompt" className="mt-4 flex flex-wrap gap-2">
        {PROMPTS.map((x, i) => (
          <button
            key={x.q}
            type="button"
            aria-pressed={i === prompt}
            onClick={() => setPrompt(i)}
            className={`rounded-full px-3 py-1.5 text-left text-[13px] font-medium transition-colors ${FOCUS}`}
            style={i === prompt ? { background: C.blue, color: "#fff" } : { background: "#fff", color: C.ink, border: `1px solid ${C.border}` }}
          >
            {x.q}
          </button>
        ))}
      </div>

      {/* Platform tabs */}
      <div role="tablist" aria-label="AI assistant" className="mt-4 flex gap-1 overflow-x-auto" style={{ borderBottom: `1px solid ${C.border}` }}>
        {PLATFORMS.map((x) => {
          const on = x.id === platform;
          return (
            <button
              key={x.id}
              id={`ai-tab-${x.id}`}
              role="tab"
              type="button"
              aria-selected={on}
              aria-controls="ai-answer-panel"
              tabIndex={on ? 0 : -1}
              onClick={() => setPlatform(x.id)}
              onKeyDown={(e) => {
                if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                e.preventDefault();
                const i = PLATFORMS.findIndex((y) => y.id === platform);
                const next = PLATFORMS[(i + (e.key === "ArrowRight" ? 1 : PLATFORMS.length - 1)) % PLATFORMS.length];
                setPlatform(next.id);
                e.currentTarget.parentElement?.querySelector<HTMLButtonElement>(`#ai-tab-${next.id}`)?.focus();
              }}
              className={`relative flex shrink-0 items-center gap-1.5 rounded-t-lg px-3 py-2 text-[13px] font-medium transition-colors hover:bg-[#f5f6f8] ${FOCUS}`}
              style={{ color: on ? C.ink : C.muted }}
            >
              <i className="inline-block h-2 w-2 rounded-full" style={{ background: x.color }} aria-hidden />
              {x.label}
              {on && <motion.span layoutId="ai-tab-underline" className="absolute -bottom-px left-0 right-0 h-0.5" style={{ background: C.blue }} transition={t} />}
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid gap-4 @3xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        {/* Stored answer */}
        <div id="ai-answer-panel" role="tabpanel" aria-labelledby={`ai-tab-${platform}`} className="min-w-0 rounded-2xl p-4" style={{ border: `1px solid ${C.border}` }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${prompt}-${platform}`}
              initial={{ opacity: 0, y: reduce ? 0 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduce ? 0 : -6 }}
              transition={t}
            >
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[12px]" style={{ color: C.muted }}>{label} · answer 1 of 5 from the latest run</span>
                <span className="ml-auto flex gap-1.5">
                  <span
                    className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                    style={mentioned ? { background: "#eef3ff", color: C.blue } : { background: C.soft, color: C.muted }}
                  >
                    {mentioned ? "Mentioned" : "Not mentioned"}
                  </span>
                  {cited && <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ background: "#e8f6ee", color: C.green }}>Cited</span>}
                </span>
              </div>
              <p className="mt-3 text-[14px] leading-relaxed">
                <Highlighted text={a.text} />
              </p>
              <div className="mt-4 text-[11px] font-semibold uppercase tracking-wide" style={{ color: C.muted }}>Sources</div>
              <ol className="mt-1.5 space-y-1">
                {a.sources.map((s, i) => {
                  const own = s === DOMAIN;
                  return (
                    <li key={s} className="flex items-center gap-2 rounded-lg px-2 py-1 text-[13px]" style={{ background: own ? "#e8f6ee" : C.soft }}>
                      <span className="w-4 text-[11px] tabular-nums" style={{ color: C.muted }}>{i + 1}</span>
                      <ExternalLink size={12} style={{ color: C.muted }} aria-hidden />
                      <span className="truncate" style={{ fontWeight: own ? 600 : 400 }}>{s}</span>
                      {own && <span className="ml-auto text-[11px] font-semibold" style={{ color: C.green }}>You</span>}
                    </li>
                  );
                })}
              </ol>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="min-w-0 space-y-4">
          {/* Per-platform scores for this prompt */}
          <div className="overflow-hidden rounded-2xl" style={{ border: `1px solid ${C.border}` }}>
            <div className="grid grid-cols-[minmax(0,1fr)_64px_48px_80px] gap-2 px-3 py-2 text-[10px] font-semibold uppercase tracking-wide" style={{ background: C.soft, color: C.muted }}>
              <span>Platform</span>
              <span className="text-right">Mention rate</span>
              <span className="text-right">Cited</span>
              <span>Prominence</span>
            </div>
            {PLATFORMS.map((x) => {
              const r = p.answers[x.id];
              const on = x.id === platform;
              return (
                <div
                  key={x.id}
                  className="grid grid-cols-[minmax(0,1fr)_64px_48px_80px] items-center gap-2 px-3 py-2 text-[13px] transition-colors"
                  style={{ borderTop: `1px solid ${C.border}`, background: on ? "#eef3ff" : undefined }}
                >
                  <span className="flex min-w-0 items-center gap-1.5 truncate" style={{ fontWeight: on ? 600 : 400 }}>
                    <i className="inline-block h-2 w-2 shrink-0 rounded-full" style={{ background: x.color }} aria-hidden />
                    {x.label}
                  </span>
                  <span className="text-right font-semibold tabular-nums">{pct(r.mention)}</span>
                  <span className="text-right tabular-nums">{pct(r.cited)}</span>
                  <Prominence v={r.prominence} />
                </div>
              );
            })}
          </div>

          {/* Share of voice */}
          <div className="rounded-2xl p-4" style={{ border: `1px solid ${C.border}` }}>
            <div className="text-[13px] font-semibold">Who gets named instead of you</div>
            <div className="text-[12px]" style={{ color: C.muted }}>Share of voice across completed {label} answers</div>
            <div className="mt-3 flex h-2.5 w-full overflow-hidden rounded-full" style={{ background: C.soft }} aria-hidden>
              {sov.map((s, i) => (
                <motion.span
                  key={s.name}
                  style={{ background: sovColors[i], height: "100%", display: "block" }}
                  initial={false}
                  animate={{ width: `${s.share * 100}%` }}
                  transition={{ duration: reduce ? 0 : 0.45, ease: "easeOut" }}
                />
              ))}
            </div>
            <ul className="mt-3 space-y-1 text-[13px]">
              {sov.map((s, i) => (
                <li key={s.name} className="flex items-center gap-2">
                  <i className="inline-block h-2 w-2 rounded-full" style={{ background: sovColors[i] }} aria-hidden />
                  <span style={{ fontWeight: s.name === BRAND ? 600 : 400 }}>{s.name}</span>
                  {s.name === BRAND && <span className="rounded px-1 text-[10px] font-semibold" style={{ background: "#eef3ff", color: C.blue }}>You</span>}
                  <b className="ml-auto tabular-nums">{pct(s.share)}</b>
                  <span className="w-[72px] text-right text-[12px]" style={{ color: C.muted }}>{s.cited ? `cited in ${s.cited}` : ""}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
