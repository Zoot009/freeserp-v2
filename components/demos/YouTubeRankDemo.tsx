"use client";

/**
 * YouTube rank tracker, as a try-it card.
 *
 * Columns follow the dashboard's keyword table (youtube/[id]/keywords): Position
 * is the rank among standalone organic videos; Abs. is the place in the full
 * result list, counting ads, Shorts shelves, playlist and channel blocks;
 * Block is where the ranking video came from (BlockChip). A project tracks a
 * Channel or a single Video. All data is fixed example data.
 */

import { Fragment, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Play, SquarePlay } from "lucide-react";

const C = {
  blue: "#0454ff",
  ink: "#0b0d12",
  muted: "#6d6d6d",
  border: "#eaeaea",
  soft: "#f5f6f8",
  green: "#16a34a",
  amber: "#f5a623",
};
const FOCUS =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#0454ff] focus-visible:ring-offset-2";

type Mode = "channel" | "video";
type Vid = { title: string; dur: string; views: string; age: string };
type Row = { kw: string; pos: number | null; abs: number | null; video: Vid | null };

const CHANNEL = "Northpeak";
const HANDLE = "youtube.com/@northpeak";
const DEPTH = 20;

const WASH: Vid = { title: "How To Wash & Reproof Your Down Jacket", dur: "6:14", views: "412K", age: "2 yr" };

const ROWS: Record<Mode, Row[]> = {
  channel: [
    { kw: "how to wash a down jacket", pos: 1, abs: 2, video: WASH },
    { kw: "rain jacket buying guide", pos: 2, abs: 4, video: { title: "Rain Shells Explained: 2.5-Layer vs 3-Layer", dur: "9:41", views: "96K", age: "8 mo" } },
    { kw: "merino base layer review", pos: 6, abs: 9, video: { title: "A Year In Merino: Base Layer Long-Term Test", dur: "7:28", views: "54K", age: "1 yr" } },
    { kw: "packing for a thru hike", pos: 11, abs: 17, video: { title: "3 Layers, 6 Days, One Pack", dur: "12:05", views: "188K", age: "5 mo" } },
    { kw: "tent pitching tips", pos: 14, abs: 21, video: { title: "Pitch Any Tent In The Wind", dur: "13:05", views: "73K", age: "2 yr" } },
    { kw: "sustainable outerwear brands", pos: null, abs: null, video: null },
  ],
  video: [
    { kw: "how to wash a down jacket", pos: 1, abs: 2, video: WASH },
    { kw: "down jacket care", pos: 2, abs: 3, video: WASH },
    { kw: "reproof waterproof jacket", pos: 4, abs: 6, video: WASH },
    { kw: "washing machine down jacket", pos: 9, abs: 13, video: WASH },
    { kw: "how to wash a sleeping bag", pos: 17, abs: 24, video: WASH },
    { kw: "rain jacket buying guide", pos: null, abs: null, video: null },
  ],
};

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

const TITLES = [
  (k: string) => `${cap(k)}: what actually works`,
  (k: string) => `I tested every method for "${k}"`,
  (k: string) => `${cap(k)} — beginner's guide`,
  (k: string) => `Don't make these ${k} mistakes`,
  (k: string) => `${cap(k)} in under 10 minutes`,
  (k: string) => `The truth about ${k}`,
  (k: string) => `${cap(k)} (field-tested)`,
];
const CHANNELS = ["Trail Lab", "Packweight", "The Gear Bench", "Miles Outdoors", "Alpine Notes", "Camp Kitchen TV", "Wander Weekly"];
const VIEWS = ["1.1M", "640K", "322K", "208K", "151K", "97K", "48K", "31K", "12K"];
const AGES = ["3 wk", "2 mo", "6 mo", "11 mo", "1 yr", "2 yr", "4 yr"];
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

type Item = { abs: number; kind: "Video" | "Ad" | "Shorts" | "Channel" | "Playlist"; title: string; channel: string; meta: string; dur?: string; you: boolean };

/**
 * The full result list down to the tracked video. Exactly (abs - pos) of the
 * items above it are non-organic blocks, so Position and Abs. agree with the row.
 */
function serp(row: Row): Item[] {
  const r = mulberry32(hash(row.kw));
  const end = row.abs ?? DEPTH;
  const extra = row.abs != null && row.pos != null ? row.abs - row.pos : 2;
  const slots = new Set<number>();
  if (extra > 0) slots.add(1); // a paid placement on top
  while (slots.size < extra) slots.add(2 + Math.floor(r() * (end - 2)));
  const others: Item["kind"][] = ["Shorts", "Channel", "Playlist"];
  let o = 0;
  const items: Item[] = [];
  for (let abs = 1; abs <= Math.min(DEPTH + 1, end + 2); abs++) {
    if (abs === row.abs && row.video) {
      items.push({ abs, kind: "Video", title: row.video.title, channel: CHANNEL, meta: `${row.video.views} views · ${row.video.age}`, dur: row.video.dur, you: true });
      continue;
    }
    const kind: Item["kind"] = slots.has(abs) ? (abs === 1 ? "Ad" : others[o++ % others.length]) : "Video";
    const ch = CHANNELS[Math.floor(r() * CHANNELS.length)];
    const title =
      kind === "Shorts" ? `Shorts shelf · ${row.kw}` : kind === "Channel" ? ch : kind === "Playlist" ? `${cap(row.kw)} — full playlist` : TITLES[Math.floor(r() * TITLES.length)](row.kw);
    const meta = kind === "Channel" ? "Channel" : kind === "Playlist" ? `${4 + Math.floor(r() * 12)} videos` : kind === "Shorts" ? "Shorts" : `${VIEWS[Math.floor(r() * VIEWS.length)]} views · ${AGES[Math.floor(r() * AGES.length)]}`;
    const dur = kind === "Video" || kind === "Ad" ? `${2 + Math.floor(r() * 16)}:${String(Math.floor(r() * 60)).padStart(2, "0")}` : undefined;
    items.push({ abs, kind, title, channel: ch, meta, dur, you: false });
  }
  return items;
}

function PosChip({ pos }: { pos: number | null }) {
  if (pos == null) return <span className="text-[14px] font-semibold" style={{ color: C.muted }}>{DEPTH}+</span>;
  const style = pos <= 3 ? { background: "#e8f6ee", color: C.green } : pos <= 10 ? { background: "#eef3ff", color: C.blue } : { background: C.soft, color: C.ink };
  return <span className="inline-block rounded-lg px-2 py-1 text-[13px] font-bold tabular-nums" style={style}>#{pos}</span>;
}

function KindChip({ kind }: { kind: Item["kind"] }) {
  const warn = kind === "Ad";
  return (
    <span
      className="inline-block rounded-md px-1.5 py-0.5 text-[11px] font-medium"
      style={{ border: `1px solid ${warn ? "#f3d9a4" : C.border}`, background: warn ? "#fff7e6" : kind === "Video" ? "#fff" : C.soft, color: warn ? "#9a6400" : C.ink }}
    >
      {kind}
    </span>
  );
}

function Thumb({ dur, you }: { dur?: string; you: boolean }) {
  return (
    <span
      className="relative flex h-[38px] w-[64px] shrink-0 items-center justify-center rounded-md"
      style={{ background: you ? "linear-gradient(135deg,#dfe8ff,#b9ccff)" : "linear-gradient(135deg,#eceef2,#dcdfe5)" }}
      aria-hidden
    >
      <Play size={14} style={{ color: you ? C.blue : "#9aa1ad" }} fill="currentColor" />
      {dur && <span className="absolute bottom-0.5 right-0.5 rounded px-1 text-[9px] font-semibold text-white" style={{ background: "rgba(0,0,0,.75)" }}>{dur}</span>}
    </span>
  );
}

function ResultsList({ row }: { row: Row }) {
  const items = serp(row);
  // Long lists: the top, then a gap, then the neighbourhood of the tracked video.
  const anchor = row.abs ?? 0;
  const show = (it: Item) => anchor <= 8 || it.abs <= 3 || it.abs >= anchor - 2;
  const visible = row.abs == null ? items.slice(0, 6) : items.filter(show);
  return (
    <div className="rounded-xl p-2" style={{ background: C.soft }}>
      <div className="flex items-center gap-1.5 px-2 pb-2 pt-1 text-[12px]" style={{ color: C.muted }}>
        <SquarePlay size={14} aria-hidden style={{ color: "#d94a2b" }} /> YouTube results for &ldquo;{row.kw}&rdquo; · United States · EN
      </div>
      <ol className="space-y-1">
        {visible.map((it, k) => {
          const gap = k > 0 && it.abs - visible[k - 1].abs > 1;
          return (
            <Fragment key={it.abs}>
              {gap && (
                <li className="px-2 py-1 text-[11px]" style={{ color: C.muted }}>
                  · · · {it.abs - visible[k - 1].abs - 1} more results
                </li>
              )}
              <li
                className="flex items-center gap-2.5 rounded-lg px-2 py-1.5"
                style={{ background: it.you ? "#fff" : "transparent", boxShadow: it.you ? `0 0 0 1.5px ${C.blue}` : undefined }}
              >
                <span className="w-6 shrink-0 text-right text-[11px] tabular-nums" style={{ color: C.muted }}>{it.abs}</span>
                <Thumb dur={it.dur} you={it.you} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px]" style={{ fontWeight: it.you ? 600 : 500 }}>{it.title}</span>
                  <span className="block truncate text-[11px]" style={{ color: C.muted }}>
                    {it.kind === "Channel" || it.kind === "Shorts" ? it.meta : `${it.channel} · ${it.meta}`}
                  </span>
                </span>
                {it.you ? (
                  <span className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold text-white" style={{ background: C.blue }}>
                    Tracked · #{row.pos}
                  </span>
                ) : (
                  <span className="shrink-0"><KindChip kind={it.kind} /></span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
      {row.abs == null && (
        <div className="px-2 pb-1 pt-2 text-[12px]" style={{ color: C.muted }}>
          Not in the top {DEPTH} — none of the tracked videos appeared within the depth checked.
        </div>
      )}
      <div className="px-2 pb-1 pt-2 text-[11px]" style={{ color: C.muted }}>
        Position counts standalone organic videos only; Abs. counts every item, ads and shelves included.
      </div>
    </div>
  );
}

export function YouTubeRankDemo() {
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<Mode>("channel");
  const [open, setOpen] = useState<string | null>(ROWS.channel[2].kw);
  const rows = ROWS[mode];

  const switchMode = (m: Mode) => {
    setMode(m);
    setOpen(ROWS[m][2].kw);
  };

  return (
    <div
      className="@container w-full min-w-0"
      style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 20, padding: "clamp(16px, 3vw, 24px)", color: C.ink, boxSizing: "border-box" }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white" style={{ background: "#ff0000" }} aria-hidden>
            <SquarePlay size={20} />
          </span>
          <div className="min-w-0">
            <div className="truncate text-[15px] font-semibold">{mode === "channel" ? CHANNEL : WASH.title}</div>
            <div className="truncate font-mono text-[12px]" style={{ color: C.muted }}>
              {mode === "channel" ? HANDLE : "youtube.com/watch?v=…"} · {rows.length} keywords · Top {DEPTH}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div role="group" aria-label="Track a channel or a single video" className="inline-flex rounded-full p-1" style={{ background: C.soft }}>
            {(["channel", "video"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={m === mode}
                onClick={() => switchMode(m)}
                className={`rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${FOCUS}`}
                style={{ background: m === mode ? "#fff" : "transparent", color: m === mode ? C.ink : C.muted, boxShadow: m === mode ? "0 1px 2px rgba(0,0,0,.08)" : "none" }}
              >
                {m === "channel" ? "Channel" : "Video"}
              </button>
            ))}
          </div>
          <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide" style={{ background: "#eef3ff", color: C.blue }}>
            Example data
          </span>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl" style={{ border: `1px solid ${C.border}` }}>
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="text-[11px] font-semibold uppercase tracking-wide" style={{ background: C.soft, color: C.muted }}>
              <th className="px-3 py-2.5 font-semibold">Keyword</th>
              <th className="px-2 py-2.5 font-semibold" title="Rank among standalone organic videos — ads, Shorts shelves, playlist and channel blocks are excluded.">Position</th>
              <th className="px-2 py-2.5 font-semibold" title="Absolute position — where the video sits in the full result list, counting ads, Shorts shelves and other blocks.">Abs.</th>
              <th className="px-2 py-2.5 font-semibold">Block</th>
              <th className="px-2 py-2.5 font-semibold">Ranking video</th>
              <th className="px-3 py-2.5 font-semibold">Video stats</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const isOpen = open === r.kw;
              return (
                <Fragment key={`${mode}-${r.kw}`}>
                  <tr
                    onClick={() => setOpen(isOpen ? null : r.kw)}
                    className="cursor-pointer transition-colors hover:bg-[#f5f6f8]"
                    style={{ borderTop: `1px solid ${C.border}`, background: isOpen ? "#f7f9ff" : undefined }}
                  >
                    <td className="px-3 py-2.5">
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-label={`${r.kw}: show the YouTube results`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpen(isOpen ? null : r.kw);
                        }}
                        className={`flex items-center gap-1.5 rounded-md text-left ${FOCUS}`}
                      >
                        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: reduce ? 0 : 0.2 }} style={{ display: "inline-flex", color: C.muted }}>
                          <ChevronDown size={14} aria-hidden />
                        </motion.span>
                        <span>
                          <span className="block text-[14px] font-medium">{r.kw}</span>
                          <span className="block text-[12px]" style={{ color: C.muted }}>United States · EN</span>
                        </span>
                      </button>
                    </td>
                    <td className="px-2 py-2.5"><PosChip pos={r.pos} /></td>
                    <td className="px-2 py-2.5 text-[14px] tabular-nums">{r.abs ?? "—"}</td>
                    <td className="px-2 py-2.5">{r.video ? <KindChip kind="Video" /> : <span style={{ color: C.muted }}>—</span>}</td>
                    <td className="px-2 py-2.5">
                      {r.video ? (
                        <span className="flex items-center gap-2">
                          <Thumb dur={r.video.dur} you />
                          <span className="line-clamp-2 text-[13px]">{r.video.title}</span>
                        </span>
                      ) : (
                        <span className="text-[13px]" style={{ color: C.muted }}>Not in the top {DEPTH}</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-[13px]">
                      {r.video ? (
                        <>
                          <b className="tabular-nums">{r.video.views}</b> <span style={{ color: C.muted }}>views · {r.video.age}</span>
                        </>
                      ) : (
                        <span style={{ color: C.muted }}>—</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={6} className="p-0">
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: reduce ? 0 : 0.28, ease: "easeOut" }}
                            style={{ overflow: "hidden" }}
                          >
                            <div className="px-3 pb-3">
                              <ResultsList row={r} />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
