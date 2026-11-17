"use client";

import { useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Bot, CheckCircle2, Circle, CircleSlash, Eye, Lightbulb, MessageSquareText, TriangleAlert } from "lucide-react";

/*
 * AEO & GEO audit demo. The scoring below is a copy of the real engine, not an imitation:
 * - bot names, groups, severities and powers: backend aeo-audit/engine/checks/crawl-access/ai-crawlers.ts
 * - severity points, AEO/GEO category weights, the cap at 40 and which checks trigger it: engine/scoring/config.ts
 * - rule → category → headline maths (evaluate): engine/scoring/score.ts
 * - fixes ranked by (AEO gain + GEO gain) / effort cost: engine/report.ts
 * - outcome labels, bands, effort labels: frontend components/aeo/report.tsx, engine/labels.ts
 * Only the findings themselves are example data. Every robots.txt line here disallows the whole site ("/"), so a
 * blocked bot is blocked from the homepage — the case ai-crawlers.ts scores at the bot's full severity.
 */

type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
type Effort = "LOW" | "MEDIUM" | "HIGH";
type Category = "CRAWL_ACCESS" | "RENDERING" | "STRUCTURED_DATA" | "CONTENT_STRUCTURE" | "ENTITY_TRUST" | "FRESHNESS" | "TECHNICAL";
type Rule = { checkId: string; category: Category; severity: Severity; passed: number; total: number; effort: Effort; title: string };

const SEVERITY_POINTS: Record<Severity, number> = { CRITICAL: 8, HIGH: 5, MEDIUM: 3, LOW: 1 };
const RANK: Severity[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
const EFFORT_COST: Record<Effort, number> = { LOW: 1, MEDIUM: 2, HIGH: 4 };
const EFFORT_LABELS: Record<Effort, string> = { LOW: "Low effort", MEDIUM: "Medium effort", HIGH: "High effort" };
const CATEGORIES: [Category, string][] = [
  ["CRAWL_ACCESS", "Crawl access"],
  ["RENDERING", "Rendering"],
  ["STRUCTURED_DATA", "Structured data"],
  ["CONTENT_STRUCTURE", "Content structure"],
  ["ENTITY_TRUST", "Entity & trust"],
  ["FRESHNESS", "Freshness"],
  ["TECHNICAL", "Technical basics"],
];
const WEIGHTS: Record<"aeo" | "geo", Record<Category, number>> = {
  aeo: { CRAWL_ACCESS: 20, RENDERING: 10, STRUCTURED_DATA: 20, CONTENT_STRUCTURE: 25, ENTITY_TRUST: 10, FRESHNESS: 5, TECHNICAL: 10 },
  geo: { CRAWL_ACCESS: 20, RENDERING: 10, STRUCTURED_DATA: 15, CONTENT_STRUCTURE: 10, ENTITY_TRUST: 25, FRESHNESS: 10, TECHNICAL: 10 },
};
const CAP_SCORE = 40;
// Exactly config.ts CAPS (minus "robots.txt can't be fetched", which a toggle can't cause).
const CAPS: { checkId: string; atLeast: Severity; reason: string }[] = [
  { checkId: "crawl.search-bots", atLeast: "CRITICAL", reason: "robots.txt blocks Googlebot from the site" },
  { checkId: "crawl.answer-bots", atLeast: "HIGH", reason: "robots.txt blocks AI answer engines from the site" },
];

const GROUPS: { checkId: string; label: string; passTitle: string; bots: { token: string; powers: string; severity: Severity }[] }[] = [
  {
    checkId: "crawl.search-bots",
    label: "search engine crawlers",
    passTitle: "Search engines can crawl your site",
    bots: [
      { token: "Googlebot", powers: "Google Search, AI Overviews and AI Mode", severity: "CRITICAL" },
      { token: "Bingbot", powers: "Bing and Microsoft Copilot", severity: "HIGH" },
    ],
  },
  {
    checkId: "crawl.answer-bots",
    label: "AI answer engines",
    passTitle: "AI answer engines can crawl your site",
    bots: [
      { token: "OAI-SearchBot", powers: "ChatGPT search", severity: "HIGH" },
      { token: "PerplexityBot", powers: "Perplexity answers", severity: "HIGH" },
      { token: "Claude-SearchBot", powers: "Claude's web search", severity: "HIGH" },
    ],
  },
  {
    checkId: "crawl.training-bots",
    label: "AI training crawlers",
    passTitle: "AI training crawlers can crawl your site",
    bots: [
      { token: "GPTBot", powers: "training OpenAI's models", severity: "MEDIUM" },
      { token: "ClaudeBot", powers: "training Anthropic's models", severity: "MEDIUM" },
      { token: "Google-Extended", powers: "Gemini training and grounding; Google Search is unaffected", severity: "MEDIUM" },
      { token: "CCBot", powers: "Common Crawl, an open dataset many AI models are trained on", severity: "LOW" },
    ],
  },
];

// Example findings for everything robots.txt doesn't decide. Titles, severities and efforts are the real checks'.
const STATIC_RULES: Rule[] = [
  { checkId: "crawl.robots-txt", category: "CRAWL_ACCESS", severity: "CRITICAL", passed: 1, total: 1, effort: "LOW", title: "robots.txt is reachable" },
  { checkId: "crawl.sitemap", category: "CRAWL_ACCESS", severity: "HIGH", passed: 1, total: 1, effort: "LOW", title: "XML sitemap works" },
  { checkId: "crawl.llms-txt", category: "CRAWL_ACCESS", severity: "LOW", passed: 0, total: 1, effort: "LOW", title: "No llms.txt" },
  { checkId: "render.raw-content", category: "RENDERING", severity: "HIGH", passed: 5, total: 5, effort: "HIGH", title: "Content is in the HTML" },
  { checkId: "render.js-links", category: "RENDERING", severity: "MEDIUM", passed: 3, total: 5, effort: "LOW", title: "Links that only work with JavaScript" },
  { checkId: "schema.organization", category: "STRUCTURED_DATA", severity: "HIGH", passed: 0, total: 1, effort: "LOW", title: "No Organization schema" },
  { checkId: "schema.website", category: "STRUCTURED_DATA", severity: "LOW", passed: 1, total: 1, effort: "LOW", title: "WebSite schema names the site" },
  { checkId: "schema.faq", category: "STRUCTURED_DATA", severity: "LOW", passed: 0, total: 1, effort: "LOW", title: "Questions and answers without FAQPage schema" },
  { checkId: "schema.breadcrumbs", category: "STRUCTURED_DATA", severity: "LOW", passed: 1, total: 1, effort: "LOW", title: "Breadcrumbs are marked up" },
  { checkId: "schema.article", category: "STRUCTURED_DATA", severity: "MEDIUM", passed: 2, total: 3, effort: "LOW", title: "Article page without Article schema" },
  { checkId: "content.h1", category: "CONTENT_STRUCTURE", severity: "MEDIUM", passed: 5, total: 5, effort: "LOW", title: "One H1 heading" },
  { checkId: "content.answer-first", category: "CONTENT_STRUCTURE", severity: "MEDIUM", passed: 2, total: 5, effort: "MEDIUM", title: "Answers don't come first" },
  { checkId: "content.question-headings", category: "CONTENT_STRUCTURE", severity: "LOW", passed: 0, total: 1, effort: "LOW", title: "No headings phrased as questions" },
  { checkId: "content.faq", category: "CONTENT_STRUCTURE", severity: "MEDIUM", passed: 1, total: 1, effort: "MEDIUM", title: "Questions are answered on 2 pages" },
  { checkId: "content.paragraphs", category: "CONTENT_STRUCTURE", severity: "LOW", passed: 5, total: 5, effort: "LOW", title: "Paragraphs are a readable length" },
  { checkId: "trust.about", category: "ENTITY_TRUST", severity: "MEDIUM", passed: 1, total: 1, effort: "MEDIUM", title: "About page describes the business" },
  { checkId: "trust.contact", category: "ENTITY_TRUST", severity: "MEDIUM", passed: 1, total: 1, effort: "LOW", title: "Contact details are easy to find" },
  { checkId: "trust.author", category: "ENTITY_TRUST", severity: "MEDIUM", passed: 1, total: 3, effort: "LOW", title: "No author shown" },
  { checkId: "trust.reviews", category: "ENTITY_TRUST", severity: "MEDIUM", passed: 0, total: 1, effort: "MEDIUM", title: "No reviews or testimonials" },
  { checkId: "fresh.dates", category: "FRESHNESS", severity: "MEDIUM", passed: 1, total: 3, effort: "LOW", title: "No publish or update date" },
  { checkId: "fresh.age", category: "FRESHNESS", severity: "LOW", passed: 1, total: 1, effort: "LOW", title: "Updated within the last two years" },
  { checkId: "tech.title", category: "TECHNICAL", severity: "HIGH", passed: 5, total: 5, effort: "LOW", title: "Title is clear and unique" },
  { checkId: "tech.meta-description", category: "TECHNICAL", severity: "MEDIUM", passed: 5, total: 5, effort: "LOW", title: "Meta description is set" },
  { checkId: "tech.canonical", category: "TECHNICAL", severity: "MEDIUM", passed: 5, total: 5, effort: "LOW", title: "Canonical points to this page" },
  { checkId: "tech.alt-text", category: "TECHNICAL", severity: "LOW", passed: 3, total: 5, effort: "LOW", title: "4 of 12 images have no alt text" },
];

const worst = (all: Severity[]) => all.reduce((a, b) => (RANK.indexOf(b) > RANK.indexOf(a) ? b : a));

/** The three crawl-access findings for a set of blocked bots, as ai-crawlers.ts builds them. */
function crawlRules(blocked: ReadonlySet<string>): Rule[] {
  return GROUPS.map((g) => {
    const hit = g.bots.filter((b) => blocked.has(b.token));
    const base = { checkId: g.checkId, category: "CRAWL_ACCESS" as const, total: 1, effort: "LOW" as const };
    return hit.length
      ? { ...base, severity: worst(hit.map((b) => b.severity)), passed: 0, title: `robots.txt blocks ${g.label}: ${hit.map((b) => b.token).join(", ")}` }
      : { ...base, severity: worst(g.bots.map((b) => b.severity)), passed: 1, title: g.passTitle };
  });
}

/** score.ts evaluate(): rule share → weighted category → weighted headline, then the cap. Unrounded. */
function evaluate(rules: Rule[]) {
  const categories = CATEGORIES.map(([cat]) => {
    const list = rules.filter((r) => r.category === cat);
    const possible = list.reduce((s, r) => s + SEVERITY_POINTS[r.severity], 0);
    const earned = list.reduce((s, r) => s + (SEVERITY_POINTS[r.severity] * r.passed) / r.total, 0);
    return (100 * earned) / possible;
  });
  const headline = (w: Record<Category, number>) => CATEGORIES.reduce((s, [cat], i) => s + categories[i] * w[cat], 0) / 100;
  const uncapped = { aeo: headline(WEIGHTS.aeo), geo: headline(WEIGHTS.geo) };
  const caps = CAPS.filter((c) => rules.some((r) => r.checkId === c.checkId && r.passed < r.total && RANK.indexOf(r.severity) >= RANK.indexOf(c.atLeast))).map((c) => c.reason);
  const capped = caps.length ? { aeo: Math.min(uncapped.aeo, CAP_SCORE), geo: Math.min(uncapped.geo, CAP_SCORE) } : uncapped;
  return { categories, uncapped, capped, caps };
}

/** report.ts buildReport(): every failing rule, with its gain if fixed, ranked by points per effort. */
function fixList(rules: Rule[]) {
  const before = evaluate(rules).capped;
  return rules
    .filter((r) => r.passed < r.total)
    .map((r) => {
      const after = evaluate(rules.map((x) => (x === r ? { ...x, passed: x.total } : x))).capped;
      const gain = { aeo: after.aeo - before.aeo, geo: after.geo - before.geo };
      return { rule: r, gain, priority: (gain.aeo + gain.geo) / EFFORT_COST[r.effort] };
    })
    .sort(
      (a, b) =>
        b.priority - a.priority ||
        RANK.indexOf(b.rule.severity) - RANK.indexOf(a.rule.severity) ||
        b.rule.total - b.rule.passed - (a.rule.total - a.rule.passed),
    );
}

const points = (n: number) => (n >= 0.5 ? `+${Math.round(n)}` : "<1"); // frontend lib/aeo.ts
const BANDS = [
  { min: 85, label: "Strong", color: "#16a34a" },
  { min: 70, label: "Good", color: "#16a34a" },
  { min: 50, label: "Needs work", color: "#f5a623" },
  { min: 0, label: "Weak", color: "#dc2626" },
];
const bandOf = (score: number) => BANDS.find((b) => score >= b.min) ?? BANDS[3];
const SEVERITY_STYLE: Record<Severity, { label: string; color: string; bg: string }> = {
  CRITICAL: { label: "Critical", color: "#dc2626", bg: "#fdecec" },
  HIGH: { label: "High", color: "#c2410c", bg: "#fff1e6" },
  MEDIUM: { label: "Medium", color: "#a16207", bg: "#fef6e4" },
  LOW: { label: "Low", color: "#6d6d6d", bg: "#f5f6f8" },
};

// ── Measured in AI answers: example outcomes ────────────────────────────────────────────────────────────────────
type Outcome = "cited" | "consulted" | "named" | "absent" | "none";
const OUTCOME: Record<Outcome, { label: string; Icon: typeof Circle; color: string }> = {
  cited: { label: "Cited", Icon: CheckCircle2, color: "#16a34a" },
  consulted: { label: "Read your site, cited others", Icon: Eye, color: "#ca8a04" },
  named: { label: "Named you, no link", Icon: MessageSquareText, color: "#0454ff" },
  absent: { label: "Not cited", Icon: Circle, color: "#6d6d6d" },
  none: { label: "No AI answer shown", Icon: CircleSlash, color: "#6d6d6d" },
};
// The same questions go to every engine (visibility.ts asks 10; five are shown here).
const QUESTIONS = [
  "Best dentist for teeth whitening in Leeds",
  "How much does Invisalign cost in the UK?",
  "Which Leeds dental clinics take emergency appointments?",
  "Is composite bonding worth it?",
  "How long does a dental implant last?",
];
const ENGINES: { id: string; name: string; cited: number; outcomes: Outcome[]; rivals: string[] }[] = [
  { id: "chatgpt", name: "ChatGPT", cited: 4, outcomes: ["cited", "consulted", "cited", "absent", "named"], rivals: ["smileguide.example", "leedsdentists.example"] },
  { id: "claude", name: "Claude", cited: 3, outcomes: ["consulted", "cited", "named", "absent", "cited"], rivals: ["leedsdentists.example", "dentalfacts.example"] },
  { id: "perplexity", name: "Perplexity", cited: 5, outcomes: ["cited", "cited", "consulted", "cited", "absent"], rivals: ["dentalfacts.example", "smileguide.example"] },
  { id: "gemini", name: "Gemini", cited: 2, outcomes: ["named", "absent", "cited", "absent", "consulted"], rivals: ["smileguide.example", "nhs-clinics.example"] },
  { id: "ai-overviews", name: "AI Overviews", cited: 2, outcomes: ["cited", "absent", "none", "consulted", "absent"], rivals: ["dentalfacts.example", "leedsdentists.example"] },
];

// ── UI ───────────────────────────────────────────────────────────────────────────────────────────────────────────
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0454ff]";
const MUTED = "#6d6d6d";
const label: CSSProperties = { fontSize: 12, color: MUTED, fontWeight: 500 };
const panel: CSSProperties = { background: "#f5f6f8", borderRadius: 12, padding: 16, minWidth: 0 };

function Ring({ value, title, reduce }: { value: number; title: string; reduce: boolean }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const band = bandOf(value);
  const t = { duration: reduce ? 0 : 0.35, ease: "easeOut" as const };
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ position: "relative", width: 104, height: 104 }}>
        <svg width={104} height={104} viewBox="0 0 104 104" aria-hidden>
          <circle cx={52} cy={52} r={r} fill="none" stroke="#e6e8ec" strokeWidth={9} />
          <motion.circle
            cx={52}
            cy={52}
            r={r}
            fill="none"
            strokeWidth={9}
            strokeLinecap="round"
            strokeDasharray={c}
            transform="rotate(-90 52 52)"
            initial={false}
            animate={{ strokeDashoffset: c * (1 - value / 100), stroke: band.color }}
            transition={t}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", overflow: "hidden" }}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={value}
              initial={{ y: reduce ? 0 : 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: reduce ? 0 : -14, opacity: 0 }}
              transition={t}
              style={{ fontSize: 28, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}
            >
              {value}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
      <div style={{ fontSize: 13, fontWeight: 600 }}>{title}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: band.color }}>{band.label}</div>
    </div>
  );
}

export function AeoDemo() {
  const reduce = useReducedMotion() ?? false;
  const [blocked, setBlocked] = useState<ReadonlySet<string>>(() => new Set(["GPTBot", "CCBot"]));
  const [engine, setEngine] = useState(ENGINES[0].id);

  const rules = [...crawlRules(blocked), ...STATIC_RULES];
  const { categories, uncapped, capped, caps } = evaluate(rules);
  const aeo = Math.round(capped.aeo);
  const geo = Math.round(capped.geo);
  const fixes = fixList(rules).slice(0, 5);
  const active = ENGINES.find((e) => e.id === engine) ?? ENGINES[0];
  const t = { duration: reduce ? 0 : 0.25, ease: "easeOut" as const };

  const toggle = (token: string) =>
    setBlocked((prev) => {
      const next = new Set(prev);
      if (next.has(token)) next.delete(token);
      else next.add(token);
      return next;
    });

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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600 }}>
          <Bot size={16} color="#0454ff" aria-hidden />
          AEO &amp; GEO Audit
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, color: MUTED, background: "#f5f6f8", border: "1px solid #eaeaea", borderRadius: 999, padding: "3px 10px", whiteSpace: "nowrap" }}>
          Example data
        </span>
      </div>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))" }}>
        {/* robots.txt */}
        <div style={{ minWidth: 0 }}>
          <div style={{ ...label, marginBottom: 8 }}>robots.txt — click a crawler to allow or block it</div>
          <div
            style={{
              background: "#0b0d12",
              color: "#d6d9e0",
              borderRadius: 12,
              padding: "12px 8px",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
              fontSize: 12.5,
              lineHeight: 1.55,
            }}
          >
            {GROUPS.map((g) => (
              <div key={g.checkId} style={{ marginBottom: 6 }}>
                <div style={{ color: "#7c8494", padding: "0 8px" }}># {g.label}</div>
                {g.bots.map((b) => {
                  const isBlocked = blocked.has(b.token);
                  return (
                    <button
                      key={b.token}
                      type="button"
                      aria-pressed={isBlocked}
                      aria-label={`${b.token} (${b.powers}): ${isBlocked ? "blocked" : "allowed"}. Toggle.`}
                      title={b.powers}
                      onClick={() => toggle(b.token)}
                      className={`${FOCUS} block w-full cursor-pointer rounded-md text-left transition-colors hover:bg-white/10`}
                      style={{ padding: "2px 8px", font: "inherit", color: "inherit", background: isBlocked ? "rgba(220,38,38,0.14)" : "transparent", border: 0 }}
                    >
                      <span style={{ display: "block" }}>
                        <span style={{ color: "#7cb2ff" }}>User-agent:</span> {b.token}
                      </span>
                      <span style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                        <span>
                          <span style={{ color: isBlocked ? "#ff8080" : "#6ee7a0" }}>{isBlocked ? "Disallow:" : "Allow:"}</span> /
                        </span>
                        <span style={{ fontSize: 11, color: isBlocked ? "#ff8080" : "#7c8494" }}>{isBlocked ? "blocked" : "allowed"}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
            <div style={{ padding: "0 8px", color: "#7c8494" }}>Sitemap: https://brightsmile.example/sitemap.xml</div>
          </div>
        </div>

        {/* Scores */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
          <div style={{ ...panel, display: "flex", justifyContent: "space-around", gap: 12, flexWrap: "wrap" }}>
            <Ring value={aeo} title="AEO score" reduce={reduce} />
            <Ring value={geo} title="GEO score" reduce={reduce} />
          </div>
          <AnimatePresence initial={false}>
            {caps.length > 0 && (
              <motion.div
                role="status"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={t}
                style={{ overflow: "hidden" }}
              >
                <div style={{ display: "flex", gap: 8, background: "#fdecec", color: "#991b1b", border: "1px solid #f7caca", borderRadius: 12, padding: "10px 12px", fontSize: 13, lineHeight: 1.45 }}>
                  <TriangleAlert size={16} style={{ flexShrink: 0, marginTop: 2 }} aria-hidden />
                  <span>
                    Both scores are capped at 40 (they would be AEO {Math.round(uncapped.aeo)} and GEO {Math.round(uncapped.geo)}) because {caps.join("; ")}.
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div style={panel}>
            <div style={{ ...label, marginBottom: 10 }}>Categories</div>
            <div style={{ display: "grid", gap: 8 }}>
              {CATEGORIES.map(([cat, name], i) => {
                const v = Math.round(categories[i]);
                return (
                  <div key={cat} style={{ display: "grid", gridTemplateColumns: "minmax(0, 8.5rem) 1fr 2rem", alignItems: "center", gap: 10, fontSize: 13 }}>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</span>
                    <div style={{ height: 6, background: "#e6e8ec", borderRadius: 999, overflow: "hidden" }}>
                      <motion.div initial={false} animate={{ width: `${v}%`, backgroundColor: bandOf(v).color }} transition={t} style={{ height: "100%", borderRadius: 999 }} />
                    </div>
                    <span style={{ textAlign: "right", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{v}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Measured in AI answers */}
      <div style={{ ...panel, marginTop: 16, background: "#fff", border: "1px solid #eaeaea" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
          <MessageSquareText size={15} color="#0454ff" aria-hidden />
          Measured in AI answers
        </div>
        <p style={{ fontSize: 12, color: MUTED, margin: "0 0 12px" }}>
          Each engine is asked the same 10 questions a customer might ask, and we check which sites the answers link to. Five are shown.
        </p>
        <div role="tablist" aria-label="AI engine" style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          {ENGINES.map((e) => {
            const on = e.id === engine;
            return (
              <button
                key={e.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setEngine(e.id)}
                className={`${FOCUS} cursor-pointer transition-colors ${on ? "bg-[#0454ff] text-white" : "bg-[#f5f6f8] text-[#0b0d12] hover:bg-[#eceef2]"}`}
                style={{ border: 0, borderRadius: 999, padding: "6px 12px", fontSize: 13, fontWeight: 500, fontFamily: "inherit" }}
              >
                {e.name}
              </button>
            );
          })}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={active.id} role="tabpanel" initial={{ opacity: 0, y: reduce ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={t}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
              <span style={{ fontSize: 22, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: bandOf(active.cited * 10).color }}>{active.cited * 10}%</span>
              <span style={{ fontSize: 13, color: MUTED }}>
                {active.name} cited the site in {active.cited} of 10 answers
              </span>
            </div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 2 }}>
              {QUESTIONS.map((q, i) => {
                const o = OUTCOME[active.outcomes[i]];
                return (
                  <li
                    key={q}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", padding: "8px 0", borderTop: i ? "1px solid #f0f1f3" : undefined }}
                  >
                    <span style={{ minWidth: 0, flex: "1 1 220px" }}>{q}</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: o.color, fontWeight: 500 }}>
                      <o.Icon size={15} aria-hidden />
                      {o.label}
                    </span>
                  </li>
                );
              })}
            </ul>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 10 }}>
              Sites cited instead: <span style={{ color: "#0b0d12" }}>{active.rivals.join(", ")}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Fix first */}
      <div style={{ ...panel, marginTop: 16, background: "#fff", border: "1px solid #eaeaea" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
          <Lightbulb size={15} color="#f5a623" aria-hidden />
          Fix first
        </div>
        <p style={{ fontSize: 12, color: MUTED, margin: "0 0 10px" }}>
          Ranked by impact against effort. Impact is how many points each score gains once the issue is fixed everywhere.
        </p>
        <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {fixes.map((f, i) => {
            const sev = SEVERITY_STYLE[f.rule.severity];
            const failing = f.rule.total - f.rule.passed;
            return (
              <motion.li
                key={f.rule.checkId}
                layout={!reduce}
                transition={t}
                style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 0", borderTop: i ? "1px solid #f0f1f3" : undefined }}
              >
                <span style={{ width: 16, fontSize: 12, color: MUTED, fontVariantNumeric: "tabular-nums", paddingTop: 1 }}>{i + 1}</span>
                <div style={{ flex: 1, minWidth: 0, display: "flex", flexWrap: "wrap", gap: "6px 12px", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 500, minWidth: 0, flex: "1 1 200px" }}>{f.rule.title}</span>
                  <span style={{ display: "flex", flexWrap: "wrap", gap: 6, fontSize: 11 }}>
                    <span style={{ color: sev.color, background: sev.bg, borderRadius: 999, padding: "2px 8px", fontWeight: 600 }}>{sev.label}</span>
                    <span style={{ color: "#0454ff", background: "#eef3ff", borderRadius: 999, padding: "2px 8px", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                      {points(f.gain.aeo)} AEO · {points(f.gain.geo)} GEO
                    </span>
                    <span style={{ color: MUTED, border: "1px solid #eaeaea", borderRadius: 999, padding: "1px 8px" }}>{EFFORT_LABELS[f.rule.effort]}</span>
                    {f.rule.total > 1 && (
                      <span style={{ color: MUTED, border: "1px solid #eaeaea", borderRadius: 999, padding: "1px 8px" }}>
                        {failing}/{f.rule.total} pages
                      </span>
                    )}
                  </span>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
