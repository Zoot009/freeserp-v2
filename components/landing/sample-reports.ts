import { SAMPLE_REPORT_EN, type SampleReportCopy } from "./SampleReport";

/**
 * The five sample reports in public/reports/, one per report the
 * product actually generates, and the landing-page copy that introduces each.
 * Every point here must be true of the real report the sample mirrors.
 *
 *   rank        → rank-tracker, website-ranking-checker, tracking-suite,
 *                 rank-tracking-tools
 *                 (not /serp-checker or /free-serp-checker/* — removed at the
 *                 owner's request)
 *   audit       → audit-suite, audit-suite/us, audit-suite/uk
 *   competitor  → competitor-analysis
 *   aeo         → aeo-geo-audit
 *   maps        → google-maps-audit
 *
 * /ai-rank-tracker has none: the AI prompt tracker has no report download.
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
    // ai.service.ts buildFreeOnlyPrompt: free plans get the On-Page part of the plan only.
    note: "Example data, showing the full report on a paid plan — the free plan's action plan covers on-page tasks. Opens in a new tab.",
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
  }),
  maps: entry("google-maps-audit-report", "Google Maps Audit", {
    title: "See a Google Maps audit before you run one",
    description:
      "Open the full Business Profile audit — the score, all 25 checks, the reviews, the 3×3 rank grid, the competitors and the 30-day plan.",
    points: [
      "Score across five weighted areas",
      "All 25 checks with pass, warn or fail",
      "The 3×3 local rank grid and competitors",
      "A 30-day action plan",
    ],
  }),
} satisfies Record<string, SampleReportEntry>;
