import { SAMPLE_REPORT_EN, type SampleReportCopy } from "./SampleReport";

/**
 * The sample reports in public/reports/ and the landing-page copy that
 * introduces each. Every point here must be true of the real report or results
 * screen the sample mirrors.
 *
 *   rank            → rank-tracker, website-ranking-checker, tracking-suite,
 *                     rank-tracking-tools, free-serp-checker/* (hero button
 *                     only; /serp-checker still has none, at the owner's request)
 *   audit           → audit-suite, audit-suite/us, audit-suite/uk, site-audit,
 *                     page-audit (both tools open the same report and PDF)
 *   competitor      → competitor-analysis
 *   aeo             → aeo-geo-audit
 *   maps            → google-maps-audit
 *   keywordResearch → keyword-research (mirrors the real keyword-magic PDF)
 *
 * Sample *results* pages — the tool has no downloadable report, so the file
 * mirrors its results screen and says so:
 *   ai → ai-rank-tracker · mapsTracker → google-maps-rank-tracker ·
 *   youtube → youtube-rank-tracker · allKeywords → all-keywords ·
 *   linkGraph → internal-link-analysis · keywordScore → keyword-score-checker ·
 *   searchConsole → search-console
 */

export interface SampleReportEntry {
  href: string;
  fileName: string;
  reportName: string;
  copy: SampleReportCopy;
}

const entry = (
  slug: string,
  reportName: string,
  copy: Pick<SampleReportCopy, "title" | "description" | "points"> & Partial<SampleReportCopy>,
): SampleReportEntry => ({
  href: `/reports/${slug}.html`,
  fileName: `freeserp-${slug}.html`,
  reportName,
  copy: { ...SAMPLE_REPORT_EN, ...copy },
});

const RESULTS_NOTE = "Example data showing the tool's results screen — opens in a new tab.";
// Tools behind requirePaidPlan: the free plan's monthly credits don't unlock them.
const PAID = "needs a paid plan";

export const SAMPLE_REPORTS = {
  rank: entry("rank-tracking-report", "Rank Tracking Report", {
    title: "See the rank report you'll get",
    description:
      "Open the full rank tracking report FreeSERP generates for a project — the same sections and columns as yours, filled with example data.",
    // report.html.ts: five stat cards, top movers (7d), keyword table with
    // 1d / 7d / 30d change and SERP features.
    points: [
      "Keywords, ranked, top 3, top 10 and average position",
      "Top gainers and losers over 7 days",
      "Every keyword with its 1d, 7d and 30d change",
      "SERP features for each keyword",
    ],
    // reports.routes.ts: generating the report and its PDF is behind requirePaidPlan.
    note: `Example data — opens in a new tab. The report, its PDF and email digests ${PAID}.`,
  }),
  audit: entry("website-audit-report", "Website Audit Report", {
    title: "See what a website audit looks like",
    description:
      "Open the full website audit report — the same scores, sections and checks you'll get for your own site, filled with example data.",
    // lib/audit-pdf.ts: grade + 7 category grades, grouped recommendations,
    // internal link analysis, per-category check results, backlink profile.
    points: [
      "An overall grade and 7 category grades",
      "Recommendations grouped, with pages and priority",
      "Internal link analysis and backlink profile",
      "Every check, category by category",
    ],
  }),
  competitor: entry("competitor-analysis-report", "Competitor Analysis", {
    title: "See a competitor analysis before you run one",
    description:
      "Open the full report: one keyword, your page against the pages outranking it, scored check by check, with the gaps turned into a prioritised plan.",
    // Mirrors the project results page: comparison, sites, internal links, AI plan.
    points: [
      "One SEO score per page, on-page and off-page",
      "The full side-by-side comparison table",
      "Internal link analysis for every domain",
      "A prioritised action plan, with the numbers behind it",
    ],
    // The standalone tool's results page has the comparison table only; internal
    // links and the AI plan come with the project route (a tracked keyword).
    note: `Example data — opens in a new tab. Internal links and the action plan come with analyses run from a tracked keyword. Competitor analysis ${PAID}.`,
  }),
  aeo: entry("aeo-geo-audit-report", "AEO & GEO Audit", {
    title: "See an AEO & GEO report before you run one",
    description:
      "Open the full audit report — both scores, the fixes ranked by impact and the real AI answers, filled with example data.",
    points: [
      "AEO and GEO scores by category",
      "Fixes ranked by points per effort",
      "Measured answers from the AI engines",
      "AI crawler access, bot by bot",
    ],
    // The sample asks all five engines; each audit asks only the engines picked (and paid for).
    note: `Example data with all five AI engines asked — opens in a new tab. AEO & GEO audits ${PAID}.`,
  }),
  maps: entry("google-maps-audit-report", "Google Maps Audit", {
    title: "See a Google Maps audit before you run one",
    description:
      "Open the full Business Profile audit — the score, every check, the reviews, the 3×3 rank grid, the competitors and the 30-day plan.",
    // gbp-audit/report.ts: 8 weighted categories, ~50 scored checks plus manual ones.
    points: [
      "Score across eight weighted categories",
      "Every check with pass, warn or fail",
      "The 3×3 local rank grid and competitors",
      "A 30-day action plan",
    ],
    note: `Example data — opens in a new tab. Google Maps audits ${PAID}.`,
  }),

  // ── Sample *results* pages: these tools have no downloadable report, so
  // each file mirrors the tool's results screen and says so; the copy below
  // never promises a PDF.
  ai: entry("ai-visibility-report", "AI Visibility Tracker", {
    eyebrow: "Sample results",
    title: "See what the AI tracker shows you",
    description:
      "Open the results screens — your prompts scored on every assistant, the answers themselves and who gets named instead of you, filled with example data.",
    points: [
      "Mention rate, citation and prominence per prompt",
      "Every assistant side by side",
      "The stored answers, with your brand highlighted",
      "Who gets named instead of you",
    ],
    note: RESULTS_NOTE,
  }),
  mapsTracker: entry("maps-rank-tracker-report", "Google Maps Rank Tracker", {
    eyebrow: "Sample results",
    title: "See a geo-grid scan before you run one",
    description:
      "Open a finished scan — the rank at every point on the map, SoLV, ARP and ATRP, and the businesses beating you street by street.",
    points: [
      "A rank pin at every grid point",
      "SoLV, ARP and ATRP",
      "Who else appears in the grid",
      "What Google showed at any one point",
    ],
    note: RESULTS_NOTE,
  }),
  youtube: entry("youtube-rank-report", "YouTube Rank Tracker", {
    eyebrow: "Sample results",
    title: "See the YouTube rank screen",
    description:
      "Open the results screen for a tracked channel — every keyword's position, the ranking video and the YouTube results around it.",
    points: [
      "Position, absolute rank and result block",
      "The ranking video with views and age",
      "The full results page behind a keyword",
      "Channel totals: top 3, top 10, not ranking",
    ],
    note: RESULTS_NOTE,
  }),
  allKeywords: entry("all-keywords-report", "All Keywords", {
    eyebrow: "Sample results",
    title: "See every project in one table",
    description:
      "Open the All Keywords screen — every tracked keyword across your projects with position, movement, volume, traffic and SERP features.",
    points: [
      "Average position, top 3 and top 10",
      "Position and movement per keyword",
      "Volume, estimated traffic and ranking URL",
      "SERP features beside every keyword",
    ],
    note: RESULTS_NOTE,
  }),
  linkGraph: entry("internal-link-report", "Internal Link Analysis", {
    eyebrow: "Sample results",
    title: "See your link structure before you crawl",
    description:
      "Open a finished analysis — the link graph, every page's inbound and outbound links, the hubs, the authorities and the orphan pages.",
    points: [
      "Pages, links, orphans, hubs and authorities",
      "The internal link graph",
      "Inbound, outbound and depth for every page",
      "Orphan pages, named",
    ],
    note: `${RESULTS_NOTE} Internal Link Analysis ${PAID}.`,
  }),
  keywordScore: entry("keyword-score-report", "Keyword Score Checker", {
    eyebrow: "Sample results",
    title: "See a keyword score before you run one",
    description:
      "Open a finished check — the score and grade, the on-page and off-page split, authority and backlinks, and every check behind it.",
    points: [
      "One grade over on-page and off-page",
      "Domain and Page Authority, and backlinks",
      "Every on-page factor, biggest gap first",
      "TTFB, FCP, LCP and CLS",
    ],
    note: `${RESULTS_NOTE} The Keyword Score Checker ${PAID}.`,
  }),
  searchConsole: entry("search-console-report", "Search Console", {
    eyebrow: "Sample results",
    title: "See Search Console inside FreeSERP",
    description:
      "Open the Search Console screen — clicks, impressions, CTR and position with their change, the clicks trend and the query table.",
    points: [
      "Clicks, impressions, CTR and average position",
      "Change against the previous period",
      "The clicks trend over time",
      "Up to 1,000 queries, with tracked ones tagged",
    ],
    note: RESULTS_NOTE,
  }),
  // keyword-magic-pdf.ts: this one IS a real export (no word groups — those are
  // on the results screen only).
  keywordResearch: entry("keyword-research-report", "Keyword Research Report", {
    title: "See the keyword report you'll get",
    description:
      "Open the keyword report FreeSERP exports — the seed, totals and every keyword with volume, difficulty, CPC, intent and SERP features.",
    points: [
      "Keywords, total volume and average difficulty",
      "Volume, KD, CPC and intent per keyword",
      "SERP features for every keyword",
      "Filtered to the rows you chose",
    ],
    note: `Example data — opens in a new tab. The Keyword Magic Tool ${PAID}.`,
  }),
} satisfies Record<string, SampleReportEntry>;
