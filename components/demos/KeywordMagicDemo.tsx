"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Search, Sparkles, TextSearch, Waypoints } from "lucide-react";

/**
 * Keyword Magic Tool demo. Mirrors freeserp-frontend-v2 dashboard/keyword-magic:
 * Broad Match / Related (the only two match types the backend accepts —
 * keywordMagic.routes.ts), the "By keyword" word groups (seed words and
 * GROUP_STOP excluded, as wordGroups() in keywordMagic.service.ts), intent
 * badges, KD bands 0–33 / 34–66 / 67+ (lib/keyword-magic.ts kdBand), SERP
 * feature chips, sortable Volume / KD / CPC. All numbers are example data.
 */

type Intent = "informational" | "navigational" | "commercial" | "transactional";
type Feat = "AI" | "FS" | "PAA" | "VID" | "IMG" | "LOCAL" | "SHOP" | "NEWS";
type Row = { keyword: string; volume: number; kd: number; cpc: number; intent: Intent; feats: Feat[] };
type Match = "broad" | "related";
type SortKey = "volume" | "kd" | "cpc";

const r = (keyword: string, volume: number, kd: number, cpc: number, intent: Intent, feats: Feat[]): Row => ({ keyword, volume, kd, cpc, intent, feats });

const DATA: Record<string, Record<Match, Row[]>> = {
  "rain jacket": {
    broad: [
      r("waterproof rain jacket", 40500, 62, 1.84, "commercial", ["AI", "IMG", "SHOP"]),
      r("mens rain jacket", 33100, 71, 2.16, "transactional", ["IMG", "SHOP"]),
      r("womens rain jacket", 27100, 66, 1.97, "transactional", ["IMG", "SHOP"]),
      r("north face rain jacket", 22200, 41, 1.02, "navigational", ["IMG", "SHOP"]),
      r("lightweight rain jacket", 18100, 47, 1.29, "commercial", ["AI", "SHOP"]),
      r("best rain jacket", 14800, 58, 1.42, "commercial", ["AI", "PAA"]),
      r("packable rain jacket", 9900, 39, 1.05, "commercial", ["SHOP"]),
      r("kids rain jacket", 8100, 29, 0.87, "transactional", ["IMG", "SHOP"]),
      r("rain jacket with hood", 6600, 35, 0.98, "transactional", ["IMG", "SHOP"]),
      r("mens waterproof rain jacket", 5400, 52, 1.88, "transactional", ["SHOP"]),
      r("how to wash a rain jacket", 3600, 18, 0.21, "informational", ["AI", "PAA", "VID"]),
      r("best waterproof rain jacket for hiking", 2900, 44, 1.12, "commercial", ["AI", "PAA", "VID"]),
      r("womens lightweight rain jacket", 2400, 33, 1.36, "transactional", ["IMG", "SHOP"]),
      r("rain jacket vs windbreaker", 1900, 12, 0.34, "informational", ["AI", "FS", "PAA"]),
    ],
    related: [
      r("rain coat", 60500, 63, 1.22, "commercial", ["IMG", "SHOP"]),
      r("waterproof jacket", 49500, 68, 1.71, "commercial", ["AI", "SHOP"]),
      r("gore-tex jacket", 18100, 55, 1.66, "commercial", ["IMG", "SHOP"]),
      r("hardshell jacket", 6600, 37, 1.48, "commercial", ["SHOP"]),
      r("what is a hardshell jacket", 1600, 14, 0.39, "informational", ["AI", "PAA"]),
      r("best rain gear for hiking", 1300, 22, 0.74, "commercial", ["AI", "PAA", "VID"]),
    ],
  },
  "coffee grinder": {
    broad: [
      r("best coffee grinder", 33100, 61, 1.12, "commercial", ["AI", "PAA", "SHOP"]),
      r("burr coffee grinder", 27100, 49, 0.94, "commercial", ["AI", "SHOP"]),
      r("manual coffee grinder", 14800, 38, 0.77, "commercial", ["VID", "SHOP"]),
      r("electric coffee grinder", 12100, 43, 0.81, "transactional", ["SHOP"]),
      r("best burr coffee grinder", 6600, 52, 1.03, "commercial", ["AI", "PAA"]),
      r("coffee grinder for espresso", 5400, 46, 0.92, "commercial", ["AI", "VID"]),
      r("how to clean a coffee grinder", 4400, 15, 0.18, "informational", ["AI", "PAA", "VID"]),
      r("baratza coffee grinder", 3600, 27, 0.64, "navigational", ["SHOP"]),
      r("best manual coffee grinder", 2900, 34, 0.88, "commercial", ["AI", "VID"]),
      r("cheap coffee grinder", 1900, 21, 0.71, "transactional", ["SHOP"]),
      r("conical burr coffee grinder", 1600, 31, 0.85, "commercial", ["IMG", "SHOP"]),
      r("coffee grinder settings for french press", 1300, 9, 0.12, "informational", ["AI", "FS", "PAA"]),
    ],
    related: [
      r("burr grinder", 40500, 57, 0.96, "commercial", ["AI", "SHOP"]),
      r("espresso grinder", 18100, 54, 1.08, "commercial", ["SHOP", "VID"]),
      r("coffee mill", 9900, 33, 0.62, "commercial", ["IMG", "SHOP"]),
      r("hand grinder", 6600, 36, 0.7, "commercial", ["SHOP"]),
      r("grind size chart", 4400, 11, 0.1, "informational", ["AI", "FS", "IMG"]),
      r("burr vs blade grinder", 2400, 13, 0.25, "informational", ["AI", "PAA"]),
    ],
  },
  "running shoes": {
    broad: [
      r("best running shoes", 49500, 72, 1.65, "commercial", ["AI", "PAA", "SHOP"]),
      r("womens running shoes", 40500, 68, 1.34, "transactional", ["IMG", "SHOP"]),
      r("mens running shoes", 33100, 67, 1.41, "transactional", ["IMG", "SHOP"]),
      r("trail running shoes", 27100, 58, 1.22, "commercial", ["AI", "VID", "SHOP"]),
      r("nike running shoes", 22200, 49, 0.89, "navigational", ["IMG", "SHOP"]),
      r("running shoes sale", 12100, 44, 1.58, "transactional", ["SHOP"]),
      r("running shoes for flat feet", 9900, 41, 0.98, "commercial", ["AI", "PAA"]),
      r("best trail running shoes", 8100, 53, 1.27, "commercial", ["AI", "VID"]),
      r("best running shoes for beginners", 6600, 36, 1.04, "commercial", ["AI", "PAA", "VID"]),
      r("wide running shoes", 5400, 33, 1.11, "transactional", ["SHOP"]),
      r("mens trail running shoes", 4400, 39, 1.19, "transactional", ["SHOP"]),
      r("how often to replace running shoes", 2900, 10, 0.15, "informational", ["AI", "FS", "PAA"]),
    ],
    related: [
      r("running sneakers", 14800, 51, 1.2, "commercial", ["IMG", "SHOP"]),
      r("marathon shoes", 6600, 42, 1.05, "commercial", ["AI", "SHOP"]),
      r("stability shoes", 5400, 38, 1.13, "commercial", ["AI", "SHOP"]),
      r("jogging shoes", 4400, 35, 0.88, "commercial", ["SHOP"]),
      r("carbon plate shoes", 3600, 29, 0.92, "commercial", ["VID", "SHOP"]),
      r("how to choose running shoes", 2400, 12, 0.2, "informational", ["AI", "PAA", "VID"]),
    ],
  },
};
const SEEDS = Object.keys(DATA);

const INTENT: Record<Intent, { name: string; dot: string }> = {
  informational: { name: "Informational", dot: "#0454ff" },
  navigational: { name: "Navigational", dot: "#6d6d6d" },
  commercial: { name: "Commercial", dot: "#f5a623" },
  transactional: { name: "Transactional", dot: "#16a34a" },
};

// Short chip text and full name, as the dashboard's FeatChip (messages/en.json feat.*).
const FEAT: Record<Feat, [string, string]> = {
  AI: ["AI", "AI Overview"],
  FS: ["Featured", "Featured snippet"],
  PAA: ["PAA", "People also ask"],
  VID: ["Video", "Video carousel"],
  IMG: ["Images", "Image pack"],
  LOCAL: ["Local", "Local pack"],
  SHOP: ["Shopping", "Shopping"],
  NEWS: ["News", "News"],
};

// Backend GROUP_STOP (keywordMagic.service.ts).
const STOP = new Set("the a an of for to in on and or with your you is are vs my me it at by".split(" "));
const words = (s: string) => s.toLowerCase().split(/[^\p{L}\p{M}\p{N}]+/u).filter(Boolean);

function wordGroups(rows: Row[], seed: string) {
  const seedWords = new Set(words(seed));
  const counts = new Map<string, number>();
  for (const row of rows)
    for (const w of new Set(words(row.keyword)))
      if (w.length >= 2 && !seedWords.has(w) && !STOP.has(w)) counts.set(w, (counts.get(w) ?? 0) + 1);
  return [...counts].map(([word, count]) => ({ word, count })).sort((a, b) => b.count - a.count || a.word.localeCompare(b.word)).slice(0, 8);
}

const kdColor = (kd: number) => (kd <= 33 ? "#16a34a" : kd <= 66 ? "#d97706" : "#dc2626");
const kdWord = (kd: number) => (kd <= 33 ? "Easy" : kd <= 66 ? "Medium" : "Hard");
const num = (n: number) => n.toLocaleString("en-US");

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0454ff]";
const pill = (on: boolean) =>
  `${FOCUS} inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors whitespace-nowrap ${
    on ? "bg-[#0454ff] text-white" : "bg-[#f5f6f8] text-[#0b0d12] hover:bg-[#eceef2]"
  }`;

export function KeywordMagicDemo() {
  const reduce = useReducedMotion();
  const [seed, setSeed] = useState(SEEDS[0]);
  const [match, setMatch] = useState<Match>("broad");
  const [group, setGroup] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" } | null>(null);
  const [pending, setPending] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // A short fake "Finding keywords…" so switching feels like a search ran.
  function run(nextSeed: string, nextMatch: Match) {
    if (nextSeed === seed && nextMatch === match) return;
    setSeed(nextSeed);
    setMatch(nextMatch);
    setGroup(null);
    setFilter("");
    if (reduce) return;
    setPending(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setPending(false), 550);
  }

  function onSort(key: SortKey) {
    setSort((s) => (s?.key === key ? { key, dir: s.dir === "desc" ? "asc" : "desc" } : { key, dir: "desc" }));
  }

  const all = DATA[seed][match];
  const groups = wordGroups(all, seed);
  const q = filter.trim().toLowerCase();
  const rows = all.filter((row) => (!group || words(row.keyword).includes(group)) && (!q || row.keyword.includes(q)));
  if (sort) {
    const sign = sort.dir === "asc" ? 1 : -1;
    rows.sort((a, b) => (a[sort.key] - b[sort.key]) * sign);
  }
  const totalVolume = rows.reduce((s, x) => s + x.volume, 0);
  const avgKd = rows.length ? Math.round(rows.reduce((s, x) => s + x.kd, 0) / rows.length) : null;
  const avgCpc = rows.length ? rows.reduce((s, x) => s + x.cpc, 0) / rows.length : null;
  const t = { duration: reduce ? 0 : 0.25, ease: "easeOut" as const };

  const sortTh = (key: SortKey, label: string, tip: string) => {
    const active = sort?.key === key;
    return (
      <th
        scope="col"
        aria-sort={active ? (sort?.dir === "asc" ? "ascending" : "descending") : "none"}
        style={{ textAlign: "right", padding: "10px 12px", fontWeight: 500 }}
      >
        <button
          type="button"
          onClick={() => onSort(key)}
          title={tip}
          className={`${FOCUS} inline-flex items-center gap-1 rounded uppercase tracking-wide hover:text-[#0b0d12]`}
          style={{ fontSize: 12, color: active ? "#0454ff" : "#6d6d6d", fontWeight: 500 }}
        >
          {label}
          <span aria-hidden style={{ width: 8 }}>{active ? (sort?.dir === "asc" ? "↑" : "↓") : ""}</span>
        </button>
      </th>
    );
  };

  return (
    <div
      className="@container"
      style={{ background: "#fff", border: "1px solid #eaeaea", borderRadius: 20, padding: "clamp(16px, 3vw, 28px)", width: "100%", boxSizing: "border-box", color: "#0b0d12", minWidth: 0, fontSize: 14 }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600 }}>
          <Sparkles size={16} color="#0454ff" aria-hidden /> Keyword Magic Tool
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#6d6d6d", background: "#f5f6f8", border: "1px solid #eaeaea", borderRadius: 999, padding: "3px 10px", whiteSpace: "nowrap" }}>
          Example data
        </span>
      </div>

      {/* Search form: seed keyword presets + match type */}
      <div className="flex flex-col gap-3 @2xl:flex-row @2xl:items-end @2xl:justify-between" style={{ marginBottom: 12 }}>
        <div role="group" aria-label="Seed keyword" className="flex min-w-0 flex-col gap-1.5">
          <span style={{ fontSize: 12, color: "#6d6d6d" }}>Seed keyword</span>
          <div className="flex flex-wrap gap-1.5">
            {SEEDS.map((s) => (
              <button key={s} type="button" aria-pressed={seed === s} onClick={() => run(s, match)} className={pill(seed === s)}>
                <Search size={13} aria-hidden /> {s}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <span style={{ fontSize: 12, color: "#6d6d6d" }}>Match type</span>
          <div role="tablist" aria-label="Match type" className="flex gap-1.5">
            {(
              [
                ["broad", "Broad Match", TextSearch, "Broad match: keywords that contain the words of your seed."],
                ["related", "Related", Waypoints, "Related: searches Google ties to your seed, even ones without its words."],
              ] as const
            ).map(([key, label, Glyph, tip]) => (
              <button key={key} type="button" role="tab" aria-selected={match === key} title={tip} onClick={() => run(seed, key)} className={pill(match === key)}>
                <Glyph size={14} aria-hidden /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* "Finding keywords" progress bar */}
      <div aria-live="polite" style={{ height: 3, borderRadius: 3, background: pending ? "#eceef2" : "transparent", overflow: "hidden", marginBottom: 12 }}>
        {pending && (
          <motion.div
            style={{ height: "100%", width: "40%", background: "#0454ff", borderRadius: 3 }}
            initial={{ x: "-100%" }}
            animate={{ x: "250%" }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
          />
        )}
        <span className="sr-only">{pending ? `Finding keywords for “${seed}”` : ""}</span>
      </div>

      <motion.div
        animate={{ opacity: pending ? 0.45 : 1 }}
        transition={t}
        aria-busy={pending || undefined}
        className="grid min-w-0 gap-3 @2xl:grid-cols-[180px_minmax(0,1fr)]"
      >
        {/* Word groups: sidebar on wide cards, a chip strip on narrow ones */}
        <div className="min-w-0" style={{ background: "#f5f6f8", borderRadius: 12, padding: 10 }}>
          <div style={{ fontSize: 12, color: "#6d6d6d", padding: "2px 6px 8px" }}>By keyword</div>
          <div role="group" aria-label="Filter by word" className="flex gap-1 overflow-x-auto pb-1 @2xl:flex-col @2xl:overflow-visible @2xl:pb-0">
            {[{ word: null as string | null, count: all.length }, ...groups].map((g) => {
              const on = group === g.word;
              return (
                <button
                  key={g.word ?? "__all"}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setGroup(on ? null : g.word)}
                  className={`${FOCUS} flex shrink-0 items-center justify-between gap-3 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-left text-[13px] transition-colors ${
                    on ? "bg-white font-semibold text-[#0454ff] shadow-sm" : "hover:bg-white/70"
                  }`}
                >
                  <span>{g.word ?? "All keywords"}</span>
                  <span style={{ fontVariantNumeric: "tabular-nums", color: on ? "#0454ff" : "#6d6d6d" }}>{g.count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results table */}
        <div className="min-w-0" style={{ border: "1px solid #eaeaea", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, borderBottom: "1px solid #eaeaea" }}>
            <label className="relative min-w-0 flex-1">
              <span className="sr-only">Filter these keywords</span>
              <Search size={14} aria-hidden style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#6d6d6d" }} />
              <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter these keywords…"
                className={`${FOCUS} w-full rounded-lg`}
                style={{ border: "1px solid #eaeaea", padding: "7px 10px 7px 30px", fontSize: 13, background: "#fff", color: "#0b0d12" }}
              />
            </label>
            <span style={{ fontSize: 12, color: "#6d6d6d", whiteSpace: "nowrap" }}>{rows.length} shown</span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", minWidth: 640, borderCollapse: "collapse", fontSize: 13, fontVariantNumeric: "tabular-nums" }}>
              <thead style={{ background: "#f5f6f8" }}>
                <tr>
                  <th scope="col" style={{ textAlign: "left", padding: "10px 12px", fontSize: 12, color: "#6d6d6d", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.03em" }}>Keyword</th>
                  <th scope="col" title="What the searcher is after: to learn, to find a site, to compare, or to buy." style={{ textAlign: "left", padding: "10px 12px", fontSize: 12, color: "#6d6d6d", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.03em" }}>Intent</th>
                  {sortTh("volume", "Volume", "Average monthly Google searches in this market.")}
                  {sortTh("kd", "KD", "Keyword difficulty, 0–100: how hard it is to reach the top 10. 0–33 easy, 34–66 medium, 67+ hard.")}
                  {sortTh("cpc", "CPC", "Average cost per click advertisers pay for this keyword.")}
                  <th scope="col" style={{ textAlign: "left", padding: "10px 12px", fontSize: 12, color: "#6d6d6d", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.03em" }}>SERP Features</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <motion.tr
                    key={`${seed}:${match}:${row.keyword}`}
                    layout={reduce ? false : "position"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={t}
                    className="transition-colors hover:bg-[#f5f6f8]"
                    style={{ borderTop: "1px solid #eaeaea" }}
                  >
                    <td style={{ padding: "9px 12px", fontWeight: 500, maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={row.keyword}>
                      {row.keyword}
                    </td>
                    <td style={{ padding: "9px 12px" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, border: "1px solid #eaeaea", borderRadius: 999, padding: "2px 8px", fontSize: 12, whiteSpace: "nowrap" }}>
                        <span aria-hidden style={{ width: 6, height: 6, borderRadius: 6, background: INTENT[row.intent].dot }} />
                        {INTENT[row.intent].name}
                      </span>
                    </td>
                    <td style={{ padding: "9px 12px", textAlign: "right" }}>{num(row.volume)}</td>
                    <td style={{ padding: "9px 12px", textAlign: "right", fontWeight: 600, color: kdColor(row.kd) }} title={`Keyword difficulty ${row.kd}/100 · ${kdWord(row.kd)}`}>
                      {row.kd}
                    </td>
                    <td style={{ padding: "9px 12px", textAlign: "right" }}>${row.cpc.toFixed(2)}</td>
                    <td style={{ padding: "9px 12px" }}>
                      <span style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {row.feats.map((f) => (
                          <span key={f} title={FEAT[f][1]} style={{ border: "1px solid #eaeaea", borderRadius: 6, padding: "1px 6px", fontSize: 11, color: "#0b0d12", background: "#fff", whiteSpace: "nowrap" }}>
                            {FEAT[f][0]}
                          </span>
                        ))}
                      </span>
                    </td>
                  </motion.tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: 32, textAlign: "center", color: "#6d6d6d" }}>No keywords match your filter.</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: "1px solid #eaeaea", background: "#f5f6f8", fontWeight: 600 }}>
                  <td style={{ padding: "10px 12px" }} colSpan={2}>
                    {rows.length} keyword{rows.length === 1 ? "" : "s"}
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "right" }}>
                    {num(totalVolume)}
                    <div style={{ fontSize: 11, color: "#6d6d6d", fontWeight: 400 }}>total volume</div>
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "right", color: avgKd == null ? "#6d6d6d" : kdColor(avgKd) }}>
                    {avgKd ?? "—"}
                    <div style={{ fontSize: 11, color: "#6d6d6d", fontWeight: 400 }}>avg KD</div>
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "right" }}>
                    {avgCpc == null ? "—" : `$${avgCpc.toFixed(2)}`}
                    <div style={{ fontSize: 11, color: "#6d6d6d", fontWeight: 400 }}>avg CPC</div>
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
