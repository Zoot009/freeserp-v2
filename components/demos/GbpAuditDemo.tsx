"use client";

/**
 * Interactive Google Maps (Business Profile) audit demo.
 *
 * Mirrors freeserp-backend-v2/src/modules/gbp-audit/report.ts: the five
 * categories and their weights (30/25/20/15/10), each check's own weight and
 * priority, pass 1 / warn ½ / fail 0, "Not verified" checks left out of the
 * score, the overall score as the weighted mean of the rounded category scores,
 * and buildPlan()'s three phases. Check labels, values, details and fixes are the
 * strings report.ts emits. Verdict bands, status labels, rank colours and grid
 * point names come from the dashboard (lib/gbp-audit.ts, maps-tracker/grid.ts).
 * The business and every number are invented example data.
 */

import { useEffect, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { CircleCheck, CircleHelp, CircleX, MapPin, TriangleAlert } from "lucide-react";

type Status = "pass" | "warn" | "fail" | "unknown";
type Priority = "high" | "medium" | "low";
type Cat = "profile" | "reviews" | "content" | "website" | "visibility";

interface Check {
  id: string;
  category: Cat;
  label: string;
  weight: number;
  priority: Priority;
  status: Status;
  value: string;
  detail: string;
  fix: string | null;
}

const CATS: { key: Cat; label: string; weight: number }[] = [
  { key: "profile", label: "Profile information", weight: 30 },
  { key: "reviews", label: "Reviews & reputation", weight: 25 },
  { key: "visibility", label: "Local ranking visibility", weight: 20 },
  { key: "content", label: "Photos & content", weight: 15 },
  { key: "website", label: "Website & conversion", weight: 10 },
];

const KEYWORD = "dentist";

const CHECKS: Check[] = [
  // Profile information
  { id: "claimed", category: "profile", label: "Claimed by the owner", weight: 3, priority: "high", status: "unknown", value: "Not verified", detail: "Google did not say whether this profile is claimed.", fix: null },
  { id: "primary_category", category: "profile", label: "Primary category", weight: 3, priority: "high", status: "pass", value: "Dentist", detail: "The primary category is the strongest relevance signal a profile has.", fix: null },
  { id: "additional_categories", category: "profile", label: "Additional categories", weight: 1.5, priority: "medium", status: "warn", value: "None", detail: "Secondary categories let the profile show for the other services you offer.", fix: "Add the secondary categories that match services you actually provide (up to 9)." },
  { id: "description", category: "profile", label: "Business description", weight: 2, priority: "medium", status: "warn", value: "142 characters", detail: "Short descriptions under 250 characters leave out services and the areas you serve.", fix: "Expand the description towards 750 characters: services, specialities, and the neighbourhoods you serve." },
  { id: "phone", category: "profile", label: "Phone number", weight: 3, priority: "high", status: "pass", value: "(555) 014-2290", detail: "Searchers can call straight from the listing.", fix: null },
  { id: "hours", category: "profile", label: "Opening hours", weight: 2.5, priority: "high", status: "pass", value: "Open 6 days a week", detail: "Hours are listed, so Google can show you as open.", fix: null },
  { id: "address", category: "profile", label: "Address", weight: 1.5, priority: "low", status: "pass", value: "214 Harbor St", detail: "A visible address helps Google and customers place the business.", fix: null },
  { id: "name", category: "profile", label: "Business name", weight: 1, priority: "medium", status: "pass", value: "Harbor Street Dental", detail: "The name reads like a real-world business name.", fix: null },
  { id: "attributes", category: "profile", label: "Attributes", weight: 1, priority: "low", status: "warn", value: "3 set", detail: "Attributes such as accessibility, amenities and payment options show on the profile and in filters.", fix: "Fill in every attribute that applies (accessibility, amenities, payments, highlights)." },
  // Reviews & reputation
  { id: "rating", category: "reviews", label: "Average rating", weight: 3, priority: "high", status: "warn", value: "4.3 ★", detail: "Good, but competitors above 4.5 stand out more.", fix: "Reply to critical reviews and ask more of your happy customers to leave one." },
  { id: "review_count", category: "reviews", label: "Review volume", weight: 3, priority: "high", status: "fail", value: "38 reviews", detail: "Competitors ranking nearby have 112 reviews (median).", fix: "Close the gap to 112: ask every customer for a review with a short link, without incentives." },
  { id: "review_recency", category: "reviews", label: "Recent reviews", weight: 2, priority: "medium", status: "pass", value: "12 days ago", detail: "Fresh reviews show searchers the business is active.", fix: null },
  { id: "response_rate", category: "reviews", label: "Owner responses", weight: 2, priority: "medium", status: "warn", value: "55% answered", detail: "The owner replied to 11 of the latest 20 reviews.", fix: "Reply to every review within a few days, personally and by name." },
  { id: "negative_reviews", category: "reviews", label: "Low ratings answered", weight: 2, priority: "high", status: "fail", value: "2 unanswered", detail: "2 of the latest 20 reviews are 3★ or lower with no reply.", fix: "Reply to every low rating calmly: acknowledge, explain what changed, and offer to continue offline." },
  // Photos & content
  { id: "photos", category: "content", label: "Photos", weight: 2.5, priority: "medium", status: "warn", value: "24 photos", detail: "Profiles with more photos get more requests for directions and website clicks.", fix: "Add recent photos of the exterior, interior, team and work. Aim for 50+ and add a few every month." },
  { id: "logo", category: "content", label: "Logo", weight: 1, priority: "low", status: "pass", value: "Set", detail: "A logo makes the profile recognisable.", fix: null },
  { id: "cover_photo", category: "content", label: "Cover photo", weight: 1, priority: "low", status: "pass", value: "Set", detail: "There is a main image for the profile.", fix: null },
  // Website & conversion
  { id: "website", category: "website", label: "Website link", weight: 3, priority: "high", status: "pass", value: "harborstreetdental.com", detail: "Searchers can go from the profile to your site.", fix: null },
  { id: "website_https", category: "website", label: "Secure website (HTTPS)", weight: 1.5, priority: "medium", status: "pass", value: "HTTPS", detail: "The linked site loads over a secure connection.", fix: null },
  { id: "website_tracking", category: "website", label: "Trackable website link", weight: 1, priority: "low", status: "warn", value: "No UTM tags", detail: "Clicks from the profile show up as generic organic traffic in analytics.", fix: "Add UTM parameters to the website link (e.g. ?utm_source=google&utm_medium=gbp)." },
  { id: "action_links", category: "website", label: "Booking / action links", weight: 1, priority: "low", status: "warn", value: "None", detail: "No booking, appointment, order or menu link on the profile.", fix: "If you take bookings or orders, add the link so searchers can act straight from the profile." },
  // Local ranking visibility
  { id: "local_rank", category: "visibility", label: "Rank at the business", weight: 3, priority: "high", status: "warn", value: `#5 for “${KEYWORD}”`, detail: "Ranked on Google Maps, but below the top 3 shown in the local pack.", fix: "Strengthen relevance (categories, description, services) and prominence (reviews, photos), then track it with Google Maps Tracker." },
  { id: "grid_coverage", category: "visibility", label: "Top 3 across the area", weight: 2.5, priority: "high", status: "fail", value: "Top 3 at 2 of 9 points", detail: "Not in the top 20 at 1 of the grid's points: searchers a short distance away don't see this profile.", fix: "Build prominence beyond the doorstep: more reviews that mention the area, location pages on the website, and local citations. Then track the wider area with Google Maps Tracker." },
  { id: "rating_vs_competitors", category: "visibility", label: "Rating vs. competitors", weight: 1.5, priority: "medium", status: "warn", value: "4.3 vs 4.5", detail: "Below the average rating of the businesses ranking around you.", fix: "Work through the themes in your lower ratings and keep asking satisfied customers to review." },
  { id: "category_alignment", category: "visibility", label: "Category vs. top competitors", weight: 1.5, priority: "medium", status: "pass", value: "Dentist", detail: "You share the category most of the top competitors use (7 of 10).", fix: null },
];

const STATUS_VALUE = { pass: 1, warn: 0.5, fail: 0 } as const;
const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
const PRIORITY_LABEL: Record<Priority, string> = { high: "High", medium: "Medium", low: "Low" };
const STATUS_LABEL: Record<Status, string> = { pass: "Passed", warn: "Needs attention", fail: "Failed", unknown: "Not verified" };
const STATUS_ICON = {
  pass: { Icon: CircleCheck, color: "#16a34a" },
  warn: { Icon: TriangleAlert, color: "#f5a623" },
  fail: { Icon: CircleX, color: "#dc2626" },
  unknown: { Icon: CircleHelp, color: "#9ca3af" },
};

/** scoreCategory() in report.ts: weighted, unknowns left out, null when nothing was verifiable. */
function categoryScore(checks: Check[], key: Cat): number | null {
  const known = checks.filter((c) => c.category === key && c.status !== "unknown");
  const weight = known.reduce((n, c) => n + c.weight, 0);
  if (!weight) return null;
  return Math.round((100 * known.reduce((n, c) => n + c.weight * STATUS_VALUE[c.status as keyof typeof STATUS_VALUE], 0)) / weight);
}

function overallScore(scores: Record<Cat, number | null>): number {
  const scored = CATS.filter((c) => scores[c.key] != null);
  const total = scored.reduce((n, c) => n + c.weight, 0);
  return Math.round(scored.reduce((n, c) => n + scores[c.key]! * c.weight, 0) / total);
}

/** verdict() in the dashboard's lib/gbp-audit.ts. */
function verdict(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Strong";
  if (score >= 70) return "Good";
  if (score >= 60) return "Fair";
  return "Room to grow";
}

const scoreColor = (s: number) => (s >= 80 ? "#16a34a" : s >= 60 ? "#f5a623" : "#dc2626");

/** buildPlan() in report.ts. */
function buildPlan(checks: Check[]) {
  const findings = checks
    .filter((c) => c.status === "fail" || c.status === "warn")
    .sort(
      (a, z) =>
        PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[z.priority] ||
        (a.status === "fail" ? 0 : 1) - (z.status === "fail" ? 0 : 1) ||
        z.weight - a.weight,
    );
  const fixes = (pred: (c: Check) => boolean) => findings.filter(pred).map((c) => c.fix!);
  const essentials = fixes((c) => (c.category === "profile" || c.category === "website") && c.priority !== "low");
  const trust = fixes((c) => c.category === "reviews" || c.category === "content" || ((c.category === "profile" || c.category === "website") && c.priority === "low"));
  const reach = fixes((c) => c.category === "visibility");
  return [
    { window: "Days 1–7", title: "Fix the essentials", items: essentials.length ? essentials : ["Profile basics are in place — re-check them after any change of hours, phone or address."] },
    { window: "Days 8–14", title: "Build trust and content", items: trust.length ? trust : ["Keep replying to every review and add fresh photos each month."] },
    { window: "Days 15–30", title: "Grow local visibility", items: [...reach, "Track the wider area with a bigger grid (7×7 or more) in Google Maps Tracker, then re-run this audit to measure progress."] },
  ];
}

// 3×3 grid, row-major, 1 km between points; null = not in the top 20.
const GRID: (number | null)[] = [9, 4, 2, 6, 5, 3, null, 12, 7];

/** rankColor() in the dashboard's maps-tracker/grid.ts. */
function rankColor(rank: number | null) {
  if (rank === null) return { bg: "#7F1D1D", fg: "#FFFFFF" };
  if (rank <= 3) return { bg: "#16A34A", fg: "#FFFFFF" };
  if (rank <= 7) return { bg: "#84CC16", fg: "#1A2E05" };
  if (rank <= 10) return { bg: "#EAB308", fg: "#422006" };
  if (rank <= 15) return { bg: "#F97316", fg: "#FFFFFF" };
  return { bg: "#DC2626", fg: "#FFFFFF" };
}

const BANDS = [
  { label: "Top 3", color: "#16A34A" },
  { label: "4–7", color: "#84CC16" },
  { label: "8–10", color: "#EAB308" },
  { label: "11–15", color: "#F97316" },
  { label: "16–20", color: "#DC2626" },
  { label: "Not found", color: "#7F1D1D" },
];

/** pointPlace() in the dashboard's lib/gbp-audit.ts, for a 3×3 grid. */
function pointPlace(i: number): string {
  const row = Math.floor(i / 3);
  const col = i % 3;
  if (row === 1 && col === 1) return "At the business";
  const ns = row < 1 ? "North" : row > 1 ? "South" : "";
  const ew = col < 1 ? "west" : col > 1 ? "east" : "";
  if (!ns) return ew.charAt(0).toUpperCase() + ew.slice(1);
  return ew ? `${ns}-${ew}` : ns;
}

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0454ff]";
const NUM = { fontVariantNumeric: "tabular-nums" } as const;
const PANEL = { background: "#f5f6f8", borderRadius: 12 } as const;

function AnimatedNumber({ value, duration }: { value: number; duration: number }) {
  const mv = useMotionValue(value);
  const rounded = useTransform(mv, (v) => Math.round(v));
  useEffect(() => {
    const controls = animate(mv, value, { duration, ease: "easeOut" });
    return () => controls.stop();
  }, [mv, value, duration]);
  return <motion.span style={NUM}>{rounded}</motion.span>;
}

export function GbpAuditDemo() {
  const reduce = useReducedMotion();
  const dur = reduce ? 0 : 0.3;
  const [fixed, setFixed] = useState<Record<string, boolean>>({});
  const [tab, setTab] = useState<Cat>("reviews");
  const [point, setPoint] = useState(4);

  const checks = CHECKS.map((c) => (fixed[c.id] ? { ...c, status: "pass" as const } : c));
  const scores = Object.fromEntries(CATS.map((c) => [c.key, categoryScore(checks, c.key)])) as Record<Cat, number | null>;
  const score = overallScore(scores);
  const plan = buildPlan(checks);
  const fixedCount = Object.values(fixed).filter(Boolean).length;

  const ring = 2 * Math.PI * 46;
  const found = GRID.filter((r) => r !== null) as number[];
  const top3 = found.filter((r) => r <= 3).length;
  const arp = found.reduce((n, r) => n + r, 0) / found.length;
  const pointRank = GRID[point];
  const pointColor = rankColor(pointRank);

  return (
    <div
      className="@container"
      style={{ background: "#fff", border: "1px solid #eaeaea", borderRadius: 20, padding: "clamp(16px, 3vw, 28px)", width: "100%", boxSizing: "border-box", color: "#0b0d12", minWidth: 0, fontSize: 14 }}
    >
      {/* Top row */}
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2" style={{ fontSize: 13, fontWeight: 600 }}>
          <MapPin size={16} color="#0454ff" aria-hidden /> Google Maps Audit
        </span>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#6d6d6d", background: "#f5f6f8", border: "1px solid #eaeaea", borderRadius: 999, padding: "3px 10px", whiteSpace: "nowrap" }}>
          Example data
        </span>
      </div>
      <div className="mt-3" style={{ fontSize: 12, color: "#6d6d6d" }}>
        <b style={{ color: "#0b0d12", fontSize: 15, fontWeight: 600 }}>Harbor Street Dental</b> · Dentist · 4.3 ★ · 38 reviews
      </div>

      {/* Score + rank grid */}
      <div className="mt-4 grid grid-cols-1 gap-3 @2xl:grid-cols-2">
        <div style={{ ...PANEL, padding: 16 }}>
          <div className="flex items-center gap-4">
            <div className="relative shrink-0" style={{ width: 104, height: 104 }} role="img" aria-label={`Score ${score} out of 100`}>
              <svg width={104} height={104} style={{ transform: "rotate(-90deg)" }} aria-hidden>
                <circle cx={52} cy={52} r={46} stroke="#e3e5ea" strokeWidth={9} fill="none" />
                <motion.circle
                  cx={52}
                  cy={52}
                  r={46}
                  strokeWidth={9}
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={ring}
                  initial={false}
                  animate={{ strokeDashoffset: ring - (score / 100) * ring, stroke: scoreColor(score) }}
                  transition={{ duration: dur, ease: "easeOut" }}
                />
              </svg>
              <span className="absolute inset-0 flex flex-col items-center justify-center" style={{ lineHeight: 1 }}>
                <span style={{ fontSize: 30, fontWeight: 600 }}>
                  <AnimatedNumber value={score} duration={dur} />
                </span>
                <span style={{ fontSize: 10, color: "#6d6d6d", marginTop: 4 }}>/100</span>
              </span>
            </div>
            <div className="min-w-0">
              <div style={{ fontSize: 12, color: "#6d6d6d" }}>Profile score</div>
              <div aria-live="polite" style={{ fontSize: 18, fontWeight: 600 }}>
                {verdict(score)}
              </div>
              <div style={{ fontSize: 12, color: "#6d6d6d", marginTop: 4 }}>
                {fixedCount ? `${fixedCount} fix${fixedCount === 1 ? "" : "es"} previewed` : "Mark a finding fixed to see the score move"}
              </div>
            </div>
          </div>
          <ul className="mt-4 space-y-2.5">
            {CATS.map((c) => {
              const s = scores[c.key];
              return (
                <li key={c.key}>
                  <div className="flex items-baseline justify-between gap-2" style={{ fontSize: 12 }}>
                    <span className="min-w-0 truncate">
                      {c.label} <span style={{ color: "#6d6d6d" }}>· {c.weight}%</span>
                    </span>
                    <span style={{ ...NUM, fontWeight: 600 }}>{s ?? "—"}</span>
                  </div>
                  <div style={{ height: 6, background: "#e3e5ea", borderRadius: 999, marginTop: 4, overflow: "hidden" }}>
                    <motion.div
                      initial={false}
                      animate={{ width: `${s ?? 0}%`, backgroundColor: scoreColor(s ?? 0) }}
                      transition={{ duration: dur, ease: "easeOut" }}
                      style={{ height: "100%", borderRadius: 999 }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div style={{ ...PANEL, padding: 16 }}>
          <div className="flex items-baseline justify-between gap-2">
            <b style={{ fontSize: 13, fontWeight: 600 }}>Local rank grid</b>
            <span style={{ fontSize: 12, color: "#6d6d6d" }}>“{KEYWORD}” · 3×3</span>
          </div>
          <div
            className="mx-auto mt-3 grid grid-cols-3"
            style={{
              maxWidth: 240,
              gap: 10,
              padding: 14,
              borderRadius: 12,
              background: "#e9edf3",
              backgroundImage: "linear-gradient(#dfe4ec 1px, transparent 1px), linear-gradient(90deg, #dfe4ec 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          >
            {GRID.map((rank, i) => {
              const c = rankColor(rank);
              const on = point === i;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPoint(i)}
                  aria-pressed={on}
                  aria-label={`${pointPlace(i)}: ${rank ? `rank ${rank}` : "not in the top 20"}`}
                  className={`mx-auto grid place-items-center rounded-full transition-transform hover:scale-110 ${FOCUS}`}
                  style={{
                    ...NUM,
                    width: 44,
                    height: 44,
                    background: c.bg,
                    color: c.fg,
                    fontWeight: 700,
                    fontSize: 13,
                    boxShadow: on ? "0 0 0 3px #fff, 0 0 0 5px #0454ff" : "0 1px 3px rgba(0,0,0,.2)",
                  }}
                >
                  {rank ?? "20+"}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex items-center justify-between gap-2" style={{ background: "#fff", borderRadius: 10, padding: "8px 10px" }}>
            <span style={{ fontSize: 12, fontWeight: 600 }}>{pointPlace(point)}</span>
            <span style={{ ...NUM, fontSize: 11, fontWeight: 700, borderRadius: 999, padding: "2px 8px", background: pointColor.bg, color: pointColor.fg }}>
              {pointRank ? `You: #${pointRank}` : "You: 20+"}
            </span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center" style={{ fontSize: 11, color: "#6d6d6d" }}>
            <div>
              <div style={{ ...NUM, fontSize: 15, fontWeight: 600, color: "#0b0d12" }}>{top3} of 9</div>
              Top 3 points
            </div>
            <div>
              <div style={{ ...NUM, fontSize: 15, fontWeight: 600, color: "#0b0d12" }}>{found.length} of 9</div>
              Found at
            </div>
            <div>
              <div style={{ ...NUM, fontSize: 15, fontWeight: 600, color: "#0b0d12" }}>{arp.toFixed(1)}</div>
              Avg. rank where found
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
            {BANDS.map((b) => (
              <span key={b.label} className="inline-flex items-center gap-1.5" style={{ fontSize: 11, color: "#6d6d6d" }}>
                <span style={{ width: 9, height: 9, borderRadius: 999, background: b.color }} />
                {b.label}
              </span>
            ))}
            <span style={{ fontSize: 11, color: "#6d6d6d" }}>· 1 km between points</span>
          </div>
        </div>
      </div>

      {/* Category tabs + checks */}
      <div role="tablist" aria-label="Audit categories" className="mt-5 flex flex-wrap gap-2">
        {CATS.map((c) => {
          const on = tab === c.key;
          return (
            <button
              key={c.key}
              type="button"
              role="tab"
              id={`gbp-tab-${c.key}`}
              aria-selected={on}
              aria-controls="gbp-panel"
              onClick={() => setTab(c.key)}
              className={`rounded-full transition-colors ${FOCUS} ${on ? "bg-[#0454ff] text-white" : "bg-[#f5f6f8] text-[#0b0d12] hover:bg-[#eceef2]"}`}
              style={{ padding: "6px 12px", fontSize: 13, fontWeight: 500 }}
            >
              {c.label} <span style={{ opacity: 0.7 }}>{c.weight}%</span>
            </button>
          );
        })}
      </div>

      <div id="gbp-panel" role="tabpanel" aria-labelledby={`gbp-tab-${tab}`} className="mt-3 overflow-hidden" style={{ border: "1px solid #eaeaea", borderRadius: 12 }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: reduce ? 0 : 0.2 }}>
            {checks
              .filter((c) => c.category === tab)
              .map((c, i) => {
                const orig = CHECKS.find((o) => o.id === c.id)!;
                const isFixed = !!fixed[c.id];
                const { Icon, color } = STATUS_ICON[c.status];
                const fixable = orig.status === "warn" || orig.status === "fail";
                return (
                  <li key={c.id} className="flex items-start gap-3" style={{ padding: "12px 14px", borderTop: i ? "1px solid #eaeaea" : undefined, background: c.status === "unknown" ? "#fafafb" : "#fff" }}>
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={c.status}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: reduce ? 0 : 0.2 }}
                        className="mt-0.5 shrink-0"
                        role="img"
                        aria-label={STATUS_LABEL[c.status]}
                      >
                        <Icon size={16} color={color} aria-hidden />
                      </motion.span>
                    </AnimatePresence>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                        <b style={{ fontSize: 13, fontWeight: 500 }}>{c.label}</b>
                        <span className="flex items-center gap-2">
                          <span style={{ fontSize: 12, color: isFixed ? "#16a34a" : "#6d6d6d" }}>{isFixed ? "Fixed (preview)" : c.value}</span>
                          {fixable && !isFixed && (
                            <span style={{ fontSize: 11, fontWeight: 500, borderRadius: 4, padding: "1px 6px", background: orig.priority === "high" ? "#fde8e8" : orig.priority === "medium" ? "#fef3dc" : "#eef0f3", color: orig.priority === "high" ? "#b91c1c" : orig.priority === "medium" ? "#92400e" : "#6d6d6d" }}>
                              {PRIORITY_LABEL[orig.priority]}
                            </span>
                          )}
                        </span>
                      </div>
                      <p style={{ fontSize: 13, color: "#6d6d6d", marginTop: 2, lineHeight: 1.5 }}>
                        {c.status === "unknown" ? `${c.detail} Left out of the score.` : c.detail}
                      </p>
                      {fixable && (
                        <div className="mt-1.5 flex flex-wrap items-start justify-between gap-2">
                          <p style={{ fontSize: 13, lineHeight: 1.5, flex: "1 1 220px", textDecoration: isFixed ? "line-through" : undefined, color: isFixed ? "#6d6d6d" : "#0b0d12" }}>→ {orig.fix}</p>
                          <button
                            type="button"
                            aria-pressed={isFixed}
                            aria-label={`${isFixed ? "Undo fix for" : "Mark fixed:"} ${c.label}`}
                            onClick={() => setFixed((f) => ({ ...f, [c.id]: !f[c.id] }))}
                            className={`shrink-0 rounded-full transition-colors ${FOCUS} ${isFixed ? "bg-[#e8f6ee] text-[#16a34a] hover:bg-[#d7efe1]" : "bg-[#f5f6f8] text-[#0b0d12] hover:bg-[#eceef2]"}`}
                            style={{ padding: "5px 12px", fontSize: 12, fontWeight: 500 }}
                          >
                            {isFixed ? "Undo" : "Mark fixed"}
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
          </motion.ul>
        </AnimatePresence>
      </div>

      {/* 30-day plan */}
      <div className="mt-5" style={{ fontSize: 13, fontWeight: 600 }}>
        30-day action plan
      </div>
      <div className="mt-2 grid grid-cols-1 gap-3 @3xl:grid-cols-3">
        {plan.map((p, i) => (
          <div key={p.window} style={{ ...PANEL, padding: 14 }}>
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2" style={{ fontSize: 13, fontWeight: 600 }}>
                <span className="grid place-items-center" style={{ width: 20, height: 20, borderRadius: 999, background: "#0454ff", color: "#fff", fontSize: 11 }}>
                  {i + 1}
                </span>
                {p.title}
              </span>
              <span style={{ fontSize: 11, color: "#6d6d6d", whiteSpace: "nowrap" }}>{p.window}</span>
            </div>
            <ul className="mt-2 space-y-1.5">
              <AnimatePresence initial={false}>
                {p.items.map((item) => (
                  <motion.li
                    key={item}
                    layout={!reduce}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: reduce ? 0 : 0.25 }}
                    className="flex gap-2 overflow-hidden"
                    style={{ fontSize: 12.5, lineHeight: 1.5, color: "#6d6d6d" }}
                  >
                    <span aria-hidden style={{ marginTop: 8, width: 4, height: 4, borderRadius: 999, background: "#6d6d6d", flexShrink: 0 }} />
                    {item}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
