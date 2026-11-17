"use client";

/**
 * Interactive mock of Dashboard → Keywords (every project in one table).
 *
 * Mirrors freeserp-frontend-v2/app/[locale]/dashboard/keywords/page.tsx:
 * project dropdown, device and engine pill toggles, the five summary chips
 * (Showing / Avg position / Top 3 / Top 10 / Est. traffic), sortable Keyword,
 * Position, Δ, Volume and Traffic columns (default Volume desc; a click on the
 * active column flips direction), the favorite star (FavoriteButton), and the
 * SERP-feature chips serpFeaturesToChips() emits. Example data only.
 */

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Image as ImageIcon,
  KeyRound,
  MapPin,
  MessageCircleQuestion,
  Monitor,
  Smartphone,
  Sparkles,
  Star,
  TextQuote,
  Video,
  type LucideIcon,
} from "lucide-react";

type Feat = "AI" | "FS" | "PAA" | "VID" | "IMG" | "LOCAL" | "KG";
type Device = "desktop" | "mobile";
type Engine = "google" | "bing";
type Row = {
  id: string;
  kw: string;
  project: string;
  country: string;
  device: Device;
  engine: Engine;
  pos: number;
  prev: number;
  url: string;
  vol: number;
  traffic: number;
  feat: Feat[];
};

// Labels from dashPrimitives.feat in the dashboard's messages/en.json.
const FEATS: Record<Feat, { label: string; Icon: LucideIcon }> = {
  AI: { label: "AI Overview", Icon: Sparkles },
  FS: { label: "Featured snippet", Icon: TextQuote },
  PAA: { label: "People also ask", Icon: MessageCircleQuestion },
  VID: { label: "Video carousel", Icon: Video },
  IMG: { label: "Image pack", Icon: ImageIcon },
  LOCAL: { label: "Local pack", Icon: MapPin },
  KG: { label: "Knowledge graph", Icon: BookOpen },
};

const PROJECTS = ["northpeak.com", "trailfixer.com", "campfirepantry.com"];

const ROWS: Row[] = [
  { id: "1", kw: "merino wool base layer", project: "northpeak.com", country: "US", device: "desktop", engine: "google", pos: 1, prev: 3, url: "northpeak.com/shop/merino-base-layer", vol: 22200, traffic: 6100, feat: ["AI", "IMG"] },
  { id: "2", kw: "fleece pullover men", project: "northpeak.com", country: "US", device: "mobile", engine: "google", pos: 2, prev: 3, url: "northpeak.com/shop/mens-fleece", vol: 18100, traffic: 4300, feat: ["AI"] },
  { id: "3", kw: "waterproof rain jacket", project: "northpeak.com", country: "US", device: "desktop", engine: "google", pos: 3, prev: 7, url: "northpeak.com/shop/rain-jackets", vol: 40500, traffic: 4820, feat: ["AI", "PAA", "IMG"] },
  { id: "4", kw: "boot resole service", project: "trailfixer.com", country: "US", device: "desktop", engine: "google", pos: 3, prev: 3, url: "trailfixer.com/repairs/resole", vol: 9900, traffic: 1180, feat: ["PAA", "LOCAL"] },
  { id: "5", kw: "recycled polyester jacket", project: "northpeak.com", country: "GB", device: "desktop", engine: "bing", pos: 4, prev: 4, url: "northpeak.com/stories/recycled-materials", vol: 5400, traffic: 610, feat: ["FS"] },
  { id: "6", kw: "freeze dried camping meals", project: "campfirepantry.com", country: "US", device: "mobile", engine: "google", pos: 5, prev: 8, url: "campfirepantry.com/collections/meals", vol: 4400, traffic: 480, feat: ["AI", "PAA", "VID"] },
  { id: "7", kw: "down puffer jacket", project: "northpeak.com", country: "US", device: "desktop", engine: "google", pos: 6, prev: 4, url: "northpeak.com/shop/down-jackets", vol: 74000, traffic: 6900, feat: ["IMG", "KG"] },
  { id: "8", kw: "fix zipper on jacket", project: "trailfixer.com", country: "GB", device: "mobile", engine: "google", pos: 7, prev: 12, url: "trailfixer.com/guides/zipper-repair", vol: 12100, traffic: 1020, feat: ["VID", "PAA"] },
  { id: "9", kw: "backpacking stove fuel", project: "campfirepantry.com", country: "US", device: "desktop", engine: "bing", pos: 9, prev: 10, url: "campfirepantry.com/blog/stove-fuel", vol: 8100, traffic: 540, feat: [] },
  { id: "10", kw: "best hiking pants", project: "northpeak.com", country: "US", device: "mobile", engine: "google", pos: 12, prev: 18, url: "northpeak.com/shop/hiking-pants", vol: 33100, traffic: 1640, feat: ["AI", "IMG"] },
  { id: "11", kw: "tent pole repair kit", project: "trailfixer.com", country: "US", device: "desktop", engine: "bing", pos: 15, prev: 11, url: "trailfixer.com/shop/pole-kits", vol: 2900, traffic: 120, feat: ["VID"] },
  { id: "12", kw: "trail mix recipes", project: "campfirepantry.com", country: "CA", device: "mobile", engine: "google", pos: 24, prev: 21, url: "campfirepantry.com/recipes/trail-mix", vol: 6600, traffic: 90, feat: ["FS", "PAA"] },
];

type SortKey = "kw" | "pos" | "delta" | "vol" | "traffic";

const BLUE = "#0454ff";
const MUTED = "#6d6d6d";
const BORDER = "#eaeaea";
const SOFT = "#f5f6f8";
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0454ff]";
const NUM = { fontVariantNumeric: "tabular-nums" } as const;

function Pills<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: [T, string][];
  onChange: (v: T) => void;
}) {
  return (
    <div role="group" aria-label={label} style={{ display: "inline-flex", gap: 4, padding: 3, background: SOFT, borderRadius: 999, flexWrap: "wrap" }}>
      {options.map(([v, text]) => {
        const on = v === value;
        return (
          <button
            key={v}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(v)}
            className={`${FOCUS} ${on ? "" : "hover:bg-[#eceef2]"} transition-colors`}
            style={{
              border: 0,
              cursor: "pointer",
              borderRadius: 999,
              padding: "6px 12px",
              font: "inherit",
              fontSize: 13,
              fontWeight: 500,
              background: on ? BLUE : "transparent",
              color: on ? "#fff" : "#0b0d12",
            }}
          >
            {text}
          </button>
        );
      })}
    </div>
  );
}

function PosBadge({ pos }: { pos: number }) {
  const [bg, fg] = pos <= 3 ? ["#e8f7ee", "#16a34a"] : pos <= 10 ? ["#eaf0ff", BLUE] : [SOFT, "#0b0d12"];
  return (
    <span style={{ ...NUM, display: "inline-block", minWidth: 36, textAlign: "center", padding: "4px 8px", borderRadius: 8, background: bg, color: fg, fontWeight: 600 }}>
      {pos}
    </span>
  );
}

function Delta({ pos, prev }: { pos: number; prev: number }) {
  if (prev === pos) return <span style={{ color: MUTED }}>—</span>;
  const up = prev > pos;
  const Arrow = up ? ArrowUp : ArrowDown;
  return (
    <span style={{ ...NUM, display: "inline-flex", alignItems: "center", gap: 2, fontWeight: 600, color: up ? "#16a34a" : "#dc2626" }}>
      <Arrow size={13} strokeWidth={2.5} aria-hidden />
      <span className="sr-only">{up ? "up" : "down"} </span>
      {Math.abs(prev - pos)}
    </span>
  );
}

export function AllKeywordsDemo() {
  const reduce = useReducedMotion();
  const [project, setProject] = useState("all");
  const [device, setDevice] = useState<"all" | Device>("all");
  const [engine, setEngine] = useState<"all" | Engine>("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "vol", dir: "desc" });
  const [favs, setFavs] = useState<ReadonlySet<string>>(() => new Set(["3", "7"]));

  const value = (r: Row, k: SortKey) =>
    k === "pos" ? r.pos : k === "delta" ? r.prev - r.pos : k === "traffic" ? r.traffic : r.vol;

  const rows = ROWS.filter(
    (r) =>
      (project === "all" || r.project === project) &&
      (device === "all" || r.device === device) &&
      (engine === "all" || r.engine === engine),
  ).sort((a, b) => {
    const d = sort.key === "kw" ? a.kw.localeCompare(b.kw) : value(a, sort.key) - value(b, sort.key);
    return sort.dir === "asc" ? d : -d;
  });

  const n = rows.length;
  const avg = n ? rows.reduce((s, r) => s + r.pos, 0) / n : 0;
  const top3 = rows.filter((r) => r.pos <= 3).length;
  const top10 = rows.filter((r) => r.pos <= 10).length;
  const traffic = rows.reduce((s, r) => s + r.traffic, 0);
  const pct = (x: number) => (n ? Math.round((x / n) * 100) : 0);

  const click = (key: SortKey) =>
    setSort((s) => ({ key, dir: s.key === key && s.dir === "desc" ? "asc" : "desc" }));

  const toggleFav = (id: string) =>
    setFavs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const t = { duration: reduce ? 0 : 0.25, ease: "easeOut" } as const;

  const th = (k: SortKey, label: string) => {
    const active = sort.key === k;
    const Icon = !active ? ChevronsUpDown : sort.dir === "asc" ? ChevronUp : ChevronDown;
    return (
      <th aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"} key={k} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 500 }}>
        <button
          type="button"
          onClick={() => click(k)}
          className={`${FOCUS} hover:text-[#0b0d12]`}
          style={{ display: "inline-flex", alignItems: "center", gap: 4, border: 0, background: "none", padding: 0, cursor: "pointer", font: "inherit", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.4, color: active ? "#0b0d12" : MUTED, borderRadius: 4 }}
        >
          {label}
          <Icon size={12} aria-hidden />
        </button>
      </th>
    );
  };

  const chip = (lbl: string, val: string, extra?: string) => (
    <div key={lbl} style={{ display: "inline-flex", alignItems: "baseline", gap: 6, padding: "7px 12px", border: `1px solid ${BORDER}`, borderRadius: 10, fontSize: 12, color: MUTED }}>
      {lbl}
      <motion.span key={val} initial={reduce ? false : { opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={t} style={{ ...NUM, fontSize: 15, fontWeight: 600, color: "#0b0d12" }}>
        {val}
      </motion.span>
      {extra && <span style={NUM}>{extra}</span>}
    </div>
  );

  return (
    <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 20, padding: "clamp(16px, 3vw, 28px)", width: "100%", boxSizing: "border-box", color: "#0b0d12", minWidth: 0, fontSize: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600 }}>
          <KeyRound size={16} color={BLUE} aria-hidden /> All Keywords
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, color: MUTED, background: SOFT, border: `1px solid ${BORDER}`, borderRadius: 999, padding: "3px 10px", whiteSpace: "nowrap" }}>
          Example data
        </span>
      </div>

      <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.2 }} aria-live="polite">
        <span style={NUM}>{n}</span> keywords tracked
      </div>
      <div style={{ fontSize: 13, color: MUTED, marginBottom: 16 }}>
        {project === "all" ? "Daily-updated rankings across all your projects" : `Daily-updated rankings for ${project}`}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        <div style={{ position: "relative", display: "inline-flex" }}>
          <select
            aria-label="Project"
            value={project}
            onChange={(e) => setProject(e.target.value)}
            className={`${FOCUS} hover:bg-[#f5f6f8]`}
            style={{ appearance: "none", font: "inherit", fontSize: 13, fontWeight: 500, color: "#0b0d12", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 999, padding: "7px 32px 7px 14px", cursor: "pointer" }}
          >
            <option value="all">All projects ({PROJECTS.length})</option>
            {PROJECTS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <ChevronDown size={14} aria-hidden style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: MUTED }} />
        </div>
        <Pills label="Device" value={device} onChange={setDevice} options={[["all", "All devices"], ["desktop", "Desktop"], ["mobile", "Mobile"]]} />
        <Pills label="Search engine" value={engine} onChange={setEngine} options={[["all", "All engines"], ["google", "Google"], ["bing", "Bing"]]} />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
        {chip("Showing", String(n), `of ${ROWS.length}`)}
        {chip("Avg position", n ? `#${avg.toFixed(1)}` : "—")}
        {chip("Top 3", String(top3), `(${pct(top3)}%)`)}
        {chip("Top 10", String(top10), `(${pct(top10)}%)`)}
        {chip("Est. traffic", traffic.toLocaleString("en-US"))}
      </div>

      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 12, overflowX: "auto" }}>
        <table style={{ width: "100%", minWidth: 940, borderCollapse: "collapse", fontSize: 13 }}>
          <thead style={{ background: SOFT, color: MUTED, fontSize: 12 }}>
            <tr>
              <th style={{ width: 40 }}><span className="sr-only">Favorite</span></th>
              {th("kw", "Keyword")}
              {th("pos", "Position")}
              {th("delta", "Δ")}
              <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.4 }}>Ranking URL</th>
              {th("vol", "Volume")}
              {th("traffic", "Traffic")}
              <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.4 }}>Project</th>
              <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.4, minWidth: 116 }}>SERP</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {rows.map((r) => {
                const fav = favs.has(r.id);
                const DeviceIcon = r.device === "mobile" ? Smartphone : Monitor;
                return (
                  <motion.tr
                    key={r.id}
                    layout={reduce ? false : "position"}
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0 }}
                    transition={t}
                    className="hover:bg-[#fafbfc]"
                    style={{ borderTop: `1px solid ${BORDER}` }}
                  >
                    <td style={{ padding: "10px 0 10px 12px" }}>
                      <button
                        type="button"
                        aria-pressed={fav}
                        aria-label={`${fav ? "Remove from" : "Add to"} favorites: ${r.kw}`}
                        title={fav ? "Remove from favorites" : "Add to favorites"}
                        onClick={() => toggleFav(r.id)}
                        className={`${FOCUS} hover:bg-[#f5f6f8]`}
                        style={{ display: "inline-flex", border: 0, background: "none", padding: 4, borderRadius: 6, cursor: "pointer", color: fav ? "#f5a623" : "#b5b8bf" }}
                      >
                        <motion.span key={String(fav)} initial={reduce || !fav ? false : { scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 15, duration: reduce ? 0 : undefined }} style={{ display: "inline-flex" }}>
                          <Star size={16} fill={fav ? "#f5a623" : "none"} aria-hidden />
                        </motion.span>
                      </button>
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ fontWeight: 500, whiteSpace: "nowrap" }}>{r.kw}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2, fontSize: 12, color: MUTED }}>
                        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.3 }}>{r.country}</span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                          <DeviceIcon size={12} aria-hidden />
                          {r.device === "mobile" ? "Mobile" : "Desktop"}
                        </span>
                        <span>{r.engine === "bing" ? "Bing" : "Google"}</span>
                      </div>
                    </td>
                    <td style={{ padding: "10px 12px" }}><PosBadge pos={r.pos} /></td>
                    <td style={{ padding: "10px 12px" }}><Delta pos={r.pos} prev={r.prev} /></td>
                    <td style={{ padding: "10px 12px" }}>
                      <span title={r.url} style={{ display: "block", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12, color: MUTED }}>
                        {r.url}
                      </span>
                    </td>
                    <td style={{ ...NUM, padding: "10px 12px" }}>{r.vol.toLocaleString("en-US")}</td>
                    <td style={{ ...NUM, padding: "10px 12px" }}>{r.traffic.toLocaleString("en-US")}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ display: "inline-block", padding: "3px 8px", borderRadius: 6, background: SOFT, fontSize: 12, whiteSpace: "nowrap" }}>{r.project}</span>
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      {r.feat.length ? (
                        <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                          {r.feat.map((f) => {
                            const { label, Icon } = FEATS[f];
                            return (
                              <span key={f} role="img" aria-label={label} title={label} style={{ display: "inline-flex", padding: 4, borderRadius: 6, border: `1px solid ${BORDER}`, color: "#3b3f47" }}>
                                <Icon size={13} aria-hidden />
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        <span style={{ color: MUTED }}>—</span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
        {n === 0 && (
          <div style={{ padding: "32px 16px", textAlign: "center", color: MUTED, fontSize: 13 }}>
            No keywords match these filters — try a different filter.
          </div>
        )}
      </div>
    </div>
  );
}
