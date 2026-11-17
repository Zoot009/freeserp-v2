"use client";

/**
 * Full Website Audit as a try-it card: run a crawl, then read the report.
 *
 * The crawl overlay follows freeserp-frontend-v2 components/page-audit/audit-progress.tsx
 * (site-mode stage names, "Pages found" with "N of ~M", the "Found so far" rows).
 * The report follows components/page-audit/site-issues.tsx: "By issue" / "By page"
 * tabs, one row per problem with its affected-page count, expand for the URLs and
 * the element behind each, and the page table (Page / Status / Issues / Words,
 * "Filter by URL"). Issue titles and severities are the analyzer rules' own
 * (backend page-audit/analyzer/rules); section names are its report sections and
 * grades use sectionScoreToGrade. Every number is example data.
 */

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronDown, Globe, Loader2, RefreshCw, Search, X } from "lucide-react";

const C = {
  blue: "#0454ff",
  ink: "#0b0d12",
  muted: "#6d6d6d",
  border: "#eaeaea",
  soft: "#f5f6f8",
  green: "#16a34a",
  red: "#dc2626",
  amber: "#f5a623",
  amberInk: "#b45309",
};
const FOCUS = "outline-none focus-visible:ring-2 focus-visible:ring-[#0454ff] focus-visible:ring-offset-2";

// ── Product constants ──────────────────────────────────────────────────────
const STAGES = ["Finding your pages", "Reading every page", "Checking technical health", "Measuring speed and accessibility", "Scoring and writing your report"];

type Sev = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
const SEV: Record<Sev, { label: string; bg: string; fg: string }> = {
  CRITICAL: { label: "Critical", bg: "#fdecec", fg: C.red },
  HIGH: { label: "High", bg: "#fdecec", fg: C.red },
  MEDIUM: { label: "Medium", bg: "#fef3e2", fg: C.amberInk },
  LOW: { label: "Low", bg: C.soft, fg: C.muted },
};

const grade = (s: number) => (s >= 90 ? "A" : s >= 80 ? "B" : s >= 70 ? "C" : s >= 60 ? "D" : "F");
const gradeTone = (g: string) =>
  g === "A" || g === "B" ? { fg: C.green, bg: "#e9f7ef" } : g === "C" ? { fg: C.amberInk, bg: "#fef3e2" } : { fg: C.red, bg: "#fdecec" };

// ── Example data ───────────────────────────────────────────────────────────
const DOMAIN = "northpeak.com";
const TOTAL_PAGES = 214;
const KNOWN_PAGES = 236;
const OVERALL = 81;
const SECTIONS = [
  { label: "SEO", score: 92 },
  { label: "Performance", score: 64 },
  { label: "UI/UX", score: 83 },
  { label: "Links", score: 78 },
  { label: "Technology", score: 95 },
  { label: "Social", score: 48 },
];

const DIRS = ["/shop/jackets/", "/blog/", "/shop/footwear/", "/stores/", "/shop/packs/"];
const SLUGS = ["rain-shell", "down-parka", "layering-guide", "trail-runner", "denver", "daypack-28l", "boot-fitting", "insulated-vest", "packing-list", "hiking-boot", "boulder", "softshell", "summit-pack", "gaiters", "trail-reviews"];
const crawlPath = (i: number) => DIRS[i % DIRS.length] + SLUGS[(i * 7) % SLUGS.length];

type Group = { type: string; title: string; description: string; severity: Sev; occurrences: number; pages: number; selector: string | null; urls: string[] };
const GROUPS: Group[] = [
  { type: "LCP_MOBILE", title: "Slow LCP on Mobile", description: "Mobile LCP is over 2500ms — a Core Web Vital that directly impacts search rankings.", severity: "CRITICAL", occurrences: 38, pages: 38, selector: null, urls: ["/", "/shop/jackets", "/shop/jackets/rain-shell", "/blog/layering-guide"] },
  { type: "TITLE_MISSING", title: "Missing Title Tag", description: "The page has no <title>, so search engines write their own.", severity: "CRITICAL", occurrences: 3, pages: 3, selector: "head", urls: ["/promo/spring-sale", "/landing/test-page", "/stores/boulder"] },
  { type: "IMG_ALT", title: "Images Missing Alt Text", description: "Images with no alt attribute say nothing to search engines or screen readers.", severity: "MEDIUM", occurrences: 214, pages: 61, selector: "img:not([alt])", urls: ["/shop/jackets/rain-shell", "/shop/jackets/down-parka", "/shop/footwear/trail-runner", "/shop/packs/daypack-28l"] },
  { type: "META_MISSING", title: "Missing Meta Description", description: "No meta description, so the search snippet is whatever text Google picks.", severity: "HIGH", occurrences: 12, pages: 12, selector: "head", urls: ["/stores/denver", "/blog/trail-reviews", "/shop/packs", "/faq"] },
  { type: "H1_MULTIPLE", title: "Multiple H1 Tags", description: "More than one H1 blurs what the page is about.", severity: "MEDIUM", occurrences: 23, pages: 23, selector: "h1", urls: ["/blog/boot-fitting", "/blog/packing-list", "/shop/footwear", "/about"] },
  { type: "OG_MISSING", title: "Missing Open Graph Tags", description: "Shared links fall back to an unpredictable preview.", severity: "MEDIUM", occurrences: 87, pages: 87, selector: "head", urls: ["/blog/layering-guide", "/blog/boot-fitting", "/stores/denver", "/size-guide"] },
  { type: "TITLE_LONG", title: "Title Tag Too Long", description: "Titles over 60 characters are cut off in search results.", severity: "LOW", occurrences: 19, pages: 19, selector: "title", urls: ["/shop/jackets/down-parka", "/shop/footwear/hiking-boot", "/blog/trail-reviews", "/shipping"] },
  { type: "LANG_MISSING", title: "Missing Lang Attribute", description: "No lang attribute on <html>, so the page language is guessed.", severity: "LOW", occurrences: 9, pages: 9, selector: "html", urls: ["/landing/test-page", "/promo/spring-sale", "/catalog-2021", "/returns"] },
];
const TOTAL_ISSUES = GROUPS.reduce((s, g) => s + g.occurrences, 0);

const PAGE_ROWS = [
  { url: "/", title: "Northpeak — Outdoor Clothing & Gear", status: 200, issues: 3, words: 1240 },
  { url: "/shop/jackets", title: "Jackets", status: 200, issues: 5, words: 860 },
  { url: "/shop/jackets/rain-shell", title: "Rain Shell Jacket", status: 200, issues: 6, words: 1180 },
  { url: "/shop/jackets/down-parka", title: "Down Parka", status: 200, issues: 4, words: 990 },
  { url: "/shop/footwear/trail-runner", title: "Trail Runner", status: 200, issues: 3, words: 740 },
  { url: "/blog/layering-guide", title: "How to Layer for Cold Weather", status: 200, issues: 2, words: 2310 },
  { url: "/blog/boot-fitting", title: "Boot Fitting, Step by Step", status: 200, issues: 4, words: 1870 },
  { url: "/stores/denver", title: "Denver Store", status: 200, issues: 3, words: 310 },
  { url: "/catalog-2021", title: null, status: 404, issues: 1, words: null },
  { url: "/promo/spring-sale", title: null, status: 200, issues: 4, words: 180 },
];

type Phase = "idle" | "crawling" | "done";

export function SiteAuditDemo() {
  const reduced = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<Phase>("idle");
  const [count, setCount] = useState(0);
  const [tab, setTab] = useState<"issues" | "pages">("issues");
  const [open, setOpen] = useState<string | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (phase !== "crawling") return;
    if (count >= TOTAL_PAGES) {
      const t = setTimeout(() => setPhase("done"), 350);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCount((c) => Math.min(TOTAL_PAGES, c + 4)), 45);
    return () => clearTimeout(t);
  }, [phase, count]);

  const run = () => {
    setTab("issues");
    setOpen(null);
    setQ("");
    if (reduced) {
      setCount(TOTAL_PAGES);
      setPhase("done");
    } else {
      setCount(0);
      setPhase("crawling");
    }
  };

  const pct = Math.round((count / TOTAL_PAGES) * 100);
  const stage = Math.min(STAGES.length - 1, Math.floor(pct / 20));
  const recent = Array.from({ length: 5 }, (_, k) => count - 1 - k).filter((i) => i >= 0);
  const scaled = (n: number) => Math.round((count / TOTAL_PAGES) * n);
  const found = [
    { label: "Broken pages (4xx/5xx)", n: scaled(4) },
    { label: "Missing page title", n: scaled(3) },
    { label: "Missing meta description", n: scaled(12) },
    { label: "More than one H1", n: scaled(23) },
    { label: "Images without alt text", n: scaled(61) },
  ].filter((r) => r.n > 0);

  const filteredPages = PAGE_ROWS.filter((p) => p.url.toLowerCase().includes(q.trim().toLowerCase()));
  const sevCounts = (Object.keys(SEV) as Sev[]).map((s) => ({ s, n: GROUPS.filter((g) => g.severity === s).reduce((t, g) => t + g.occurrences, 0) }));
  const overallGrade = grade(OVERALL);
  const RING = 2 * Math.PI * 40;

  return (
    <div
      className="@container w-full min-w-0"
      style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 20, padding: "clamp(16px, 3vw, 24px)", color: C.ink, boxSizing: "border-box" }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[14px] font-semibold">
            <Globe size={15} style={{ color: C.blue }} aria-hidden />
            {DOMAIN}
          </div>
          <div className="text-[12px]" style={{ color: C.muted }} aria-live="polite">
            {phase === "idle" && "Full website audit · crawls up to 1,000 pages"}
            {phase === "crawling" && `Crawling… ${count} pages so far`}
            {phase === "done" && `${TOTAL_PAGES} pages crawled · ${TOTAL_ISSUES} issues found`}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {phase === "done" && (
            <button
              type="button"
              onClick={run}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90 ${FOCUS}`}
              style={{ background: C.blue }}
            >
              <RefreshCw size={13} aria-hidden /> Re-crawl
            </button>
          )}
          <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide" style={{ background: "#eef3ff", color: C.blue }}>
            Example data
          </span>
        </div>
      </div>

      {phase === "idle" && (
        <div className="mt-4 flex flex-col items-center gap-3 rounded-2xl px-4 py-10 text-center" style={{ background: C.soft }}>
          <div className="text-[15px] font-semibold">Crawl {DOMAIN} and audit every page it reaches</div>
          <div className="max-w-md text-[13px]" style={{ color: C.muted }}>
            Technical health, content, speed, accessibility and security — page by page, then graded as one report.
          </div>
          <button
            type="button"
            onClick={run}
            className={`mt-1 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-semibold text-white transition-transform hover:-translate-y-px ${FOCUS}`}
            style={{ background: C.blue }}
          >
            <Search size={15} aria-hidden /> Run crawl
          </button>
        </div>
      )}

      {phase === "crawling" && (
        <div className="mt-4 grid gap-3 @2xl:grid-cols-2">
          <div className="min-w-0 rounded-2xl p-4" style={{ border: `1px solid ${C.border}` }}>
            <div className="flex items-baseline justify-between text-[12px]">
              <span className="font-medium">{STAGES[stage]}</span>
              <span className="font-semibold tabular-nums" style={{ color: C.muted }}>{pct}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full" style={{ background: C.soft }}>
              <div className="h-full rounded-full" style={{ width: `${Math.max(4, pct)}%`, background: C.blue, transition: "width 120ms linear" }} />
            </div>
            <ol className="mt-4 space-y-2">
              {STAGES.map((s, i) => (
                <li key={s} className="flex items-center gap-2.5 text-[13px]" style={{ color: i <= stage ? C.ink : "#b5b5b5", fontWeight: i === stage ? 600 : 400 }}>
                  <span
                    className="flex size-5 shrink-0 items-center justify-center rounded-full"
                    style={{ border: `1px solid ${i < stage ? "#bfe6cd" : i === stage ? "#c7d6ff" : C.border}`, background: i < stage ? "#e9f7ef" : i === stage ? "#eef3ff" : "#fff" }}
                  >
                    {i < stage ? <Check size={12} color={C.green} aria-hidden /> : i === stage ? <Loader2 size={12} color={C.blue} className="animate-spin" aria-hidden /> : null}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
          <div className="min-w-0 space-y-3">
            <div className="rounded-2xl p-4" style={{ background: C.soft }}>
              <div className="mb-2 flex items-baseline justify-between text-[11px] font-semibold uppercase tracking-wider" style={{ color: C.muted }}>
                <span>Pages found</span>
                <span className="tabular-nums">{count} of ~{KNOWN_PAGES}</span>
              </div>
              <ul className="space-y-1.5">
                {recent.map((i) => {
                  const ok = i % 53 !== 17;
                  return (
                    <motion.li
                      key={i}
                      initial={reduced ? false : { opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex min-w-0 items-center gap-2 font-mono text-[11.5px]"
                      style={{ color: C.muted }}
                    >
                      {ok ? <Check size={12} color={C.green} className="shrink-0" aria-hidden /> : <X size={12} color={C.amber} className="shrink-0" aria-hidden />}
                      <span className="truncate">{crawlPath(i)}</span>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
            {count >= 12 && found.length > 0 && (
              <div className="rounded-2xl p-4" style={{ border: `1px solid ${C.border}` }}>
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: C.muted }}>Found so far</div>
                <ul className="space-y-1.5">
                  {found.map((r) => (
                    <li key={r.label} className="flex items-center justify-between gap-3 text-[12.5px]">
                      <span className="truncate" style={{ color: C.muted }}>{r.label}</span>
                      <span className="font-semibold tabular-nums" style={{ color: C.amberInk }}>{r.n}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {phase === "done" && (
        <motion.div initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <div className="mt-4 flex flex-col gap-4 rounded-2xl p-4 @2xl:flex-row @2xl:items-center" style={{ border: `1px solid ${C.border}` }}>
            <div className="flex shrink-0 items-center gap-3 @2xl:flex-col @2xl:gap-1">
              <svg width="96" height="96" viewBox="0 0 96 96" role="img" aria-label={`Overall score ${OVERALL}, grade ${overallGrade}`}>
                <circle cx="48" cy="48" r="40" fill="none" stroke={C.soft} strokeWidth="8" />
                <motion.circle
                  cx="48" cy="48" r="40" fill="none" stroke={gradeTone(overallGrade).fg} strokeWidth="8" strokeLinecap="round"
                  transform="rotate(-90 48 48)"
                  strokeDasharray={RING}
                  initial={{ strokeDashoffset: reduced ? RING * (1 - OVERALL / 100) : RING }}
                  animate={{ strokeDashoffset: RING * (1 - OVERALL / 100) }}
                  transition={{ duration: reduced ? 0 : 1, ease: "easeOut" }}
                />
                <text x="48" y="56" textAnchor="middle" fontSize="26" fontWeight="700" fill={gradeTone(overallGrade).fg}>{OVERALL}</text>
              </svg>
              <div className="text-[12px]" style={{ color: C.muted }}>Overall · Grade {overallGrade}</div>
            </div>
            <div className="grid min-w-0 flex-1 grid-cols-3 gap-2 @2xl:grid-cols-6">
              {SECTIONS.map((s, i) => {
                const g = grade(s.score);
                const t = gradeTone(g);
                return (
                  <motion.div
                    key={s.label}
                    initial={reduced ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reduced ? 0 : 0.1 + i * 0.06 }}
                    className="min-w-0 rounded-xl px-2 py-2.5 text-center"
                    style={{ background: t.bg }}
                  >
                    <div className="text-[20px] font-bold leading-none" style={{ color: t.fg }}>{g}</div>
                    <div className="mt-1 truncate text-[12px] font-medium" style={{ color: t.fg }}>{s.label}</div>
                    <div className="text-[11.5px] tabular-nums" style={{ color: t.fg, opacity: 0.8 }}>{s.score}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 text-[12px]">
            {sevCounts.map(({ s, n }) => (
              <span key={s} className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1" style={{ background: SEV[s].bg, color: SEV[s].fg }}>
                <span className="font-semibold">{SEV[s].label}</span>
                <span className="tabular-nums">{n}</span>
              </span>
            ))}
          </div>

          <div className="mt-3 overflow-hidden rounded-2xl" style={{ border: `1px solid ${C.border}` }}>
            <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2.5" style={{ borderBottom: `1px solid ${C.border}` }}>
              <div role="group" aria-label="View" className="inline-flex gap-0.5 rounded-[10px] p-[3px]" style={{ background: C.soft }}>
                {([["issues", "By issue", GROUPS.length], ["pages", "By page", TOTAL_PAGES]] as const).map(([k, label, n]) => (
                  <button
                    key={k}
                    type="button"
                    aria-pressed={tab === k}
                    onClick={() => setTab(k)}
                    className={`rounded-[8px] px-2.5 py-[5px] text-[13px] transition-colors ${FOCUS}`}
                    style={{ background: tab === k ? "#fff" : "transparent", fontWeight: tab === k ? 600 : 500, color: tab === k ? C.ink : C.muted, boxShadow: tab === k ? "0 1px 2px rgba(0,0,0,.08)" : "none" }}
                  >
                    {label} <span className="tabular-nums opacity-60">{n}</span>
                  </button>
                ))}
              </div>
              {tab === "pages" && (
                <label className="relative w-full max-w-[13rem]">
                  <span className="sr-only">Filter by URL</span>
                  <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: C.muted }} aria-hidden />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Filter by URL"
                    className={`h-8 w-full rounded-lg pl-8 pr-2 text-[13px] ${FOCUS}`}
                    style={{ border: `1px solid ${C.border}`, background: "#fff" }}
                  />
                </label>
              )}
            </div>

            {tab === "issues" ? (
              <div>
                {GROUPS.map((g, gi) => {
                  const isOpen = open === g.type;
                  return (
                    <div key={g.type} style={{ borderBottom: gi < GROUPS.length - 1 ? `1px solid ${C.border}` : "none" }}>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => setOpen(isOpen ? null : g.type)}
                        className={`flex w-full items-center gap-2.5 px-3 py-3 text-left transition-colors hover:bg-[#f9fafb] ${FOCUS} focus-visible:ring-inset focus-visible:ring-offset-0`}
                      >
                        <ChevronDown size={16} className="shrink-0 transition-transform" style={{ color: C.muted, transform: isOpen ? "rotate(180deg)" : "none" }} aria-hidden />
                        <span className="w-16 shrink-0 rounded-full py-0.5 text-center text-[11px] font-semibold" style={{ background: SEV[g.severity].bg, color: SEV[g.severity].fg }}>
                          {SEV[g.severity].label}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[13px] font-semibold @xl:truncate">{g.title}</span>
                          <span className="block text-[12px] @xl:truncate" style={{ color: C.muted }}>{g.description}</span>
                        </span>
                        <span className="shrink-0 text-right">
                          <span className="block text-[13px] font-semibold tabular-nums">{g.pages}</span>
                          <span className="block text-[11px]" style={{ color: C.muted }}>{g.pages === 1 ? "page" : "pages"}</span>
                        </span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={reduced ? false : { height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { height: 0, opacity: 0 }}
                            transition={{ duration: 0.22 }}
                            className="overflow-hidden"
                            style={{ background: C.soft }}
                          >
                            <ul className="px-3 py-2 @xl:pl-12">
                              {g.urls.map((u) => (
                                <li key={u} className="flex min-w-0 items-center gap-2 py-1.5 text-[12px]" style={{ borderBottom: `1px solid ${C.border}` }}>
                                  <span className="truncate font-mono" style={{ color: C.blue }}>{DOMAIN}{u}</span>
                                  {g.selector && <code className="ml-auto shrink-0 text-[11px]" style={{ color: C.muted }}>{g.selector}</code>}
                                </li>
                              ))}
                            </ul>
                            <div className="px-3 pb-2.5 text-right text-[11.5px] @xl:pl-12" style={{ color: C.muted }}>
                              1–{g.urls.length} of {g.pages} pages
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="min-w-[440px]">
                  <div className="grid grid-cols-[minmax(0,1fr)_56px_56px_64px] gap-3 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide" style={{ color: C.muted, borderBottom: `1px solid ${C.border}` }}>
                    <span>Page</span>
                    <span className="text-right">Status</span>
                    <span className="text-right">Issues</span>
                    <span className="text-right">Words</span>
                  </div>
                  {filteredPages.length === 0 ? (
                    <p className="px-3 py-8 text-center text-[13px]" style={{ color: C.muted }}>No pages match &ldquo;{q}&rdquo;.</p>
                  ) : (
                    filteredPages.map((p) => (
                      <div key={p.url} className="grid grid-cols-[minmax(0,1fr)_56px_56px_64px] items-center gap-3 px-3 py-2 text-[13px] transition-colors hover:bg-[#f9fafb]" style={{ borderBottom: `1px solid ${C.border}` }}>
                        <div className="min-w-0">
                          <div className="truncate font-medium" style={{ color: C.blue }}>{p.url}</div>
                          {p.title && <div className="truncate text-[12px]" style={{ color: C.muted }}>{p.title}</div>}
                        </div>
                        <span className="text-right tabular-nums" style={{ color: p.status >= 400 ? C.red : C.muted, fontWeight: p.status >= 400 ? 600 : 400 }}>{p.status}</span>
                        <span className="text-right font-semibold tabular-nums" style={{ color: p.issues > 0 ? C.amberInk : C.muted }}>{p.issues}</span>
                        <span className="text-right tabular-nums" style={{ color: C.muted }}>{p.words?.toLocaleString("en-US") ?? "—"}</span>
                      </div>
                    ))
                  )}
                  <div className="px-3 py-2 text-right text-[11.5px]" style={{ color: C.muted }}>
                    Showing {filteredPages.length} of {TOTAL_PAGES} pages
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
