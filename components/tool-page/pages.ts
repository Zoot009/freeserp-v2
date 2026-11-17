import type { Metadata } from "next";
import { TOOLS, TRACKERS, type Shot } from "@/components/home/tools";
import { SAMPLE_REPORTS, type SampleReportEntry } from "@/components/landing/sample-reports";

/**
 * One dedicated page per tool that previously only lived inside a suite page.
 *
 * Copy, screenshots and prices are pulled from components/home/tools.ts where
 * the tool already has an entry, so the home page and these pages can never
 * quote different numbers. Only the page-specific bits (H1, meta, steps, FAQs)
 * live here, and every claim in them restates something already in tools.ts.
 */

export interface ToolPageData {
  path: string;
  kicker: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  points: string[];
  cost: string;
  shot: Shot;
  steps: { title: string; text: string }[];
  faqs: { q: string; a: string }[];
  /** Only where the sample is the report this exact tool produces. */
  report?: SampleReportEntry;
}

const tool = (kicker: string) => TOOLS.find((t) => t.kicker === kicker)!;
const tracker = (kicker: string) => TRACKERS.find((t) => t.kicker === kicker)!;

/** Asked on every tool page — both answers hold for every tool. */
const COMMON_FAQS = [
  {
    q: "Is there a free plan?",
    a: "Yes. The free plan includes 100 credits every month, refilled automatically, with no credit card. Paid plans start at $19/month for 2,000 credits.",
  },
  {
    q: "Do I need a separate subscription for this tool?",
    a: "No. Every FreeSERP tool — rank tracking, audits and keyword research — draws from the same credit balance, and none is locked behind a higher tier.",
  },
];

function page(p: ToolPageData): ToolPageData {
  return { ...p, faqs: [...p.faqs, ...COMMON_FAQS] };
}

const maps = tracker("GOOGLE MAPS TRACKER");
const youtube = tracker("YOUTUBE RANK TRACKER");
const siteAudit = tool("FULL WEBSITE AUDIT");
const pageAudit = tool("PAGE AUDIT");
const links = tool("INTERNAL LINK ANALYSIS");
const keywordMagic = tool("KEYWORD MAGIC TOOL");
const keywordScore = tool("KEYWORD SCORE CHECKER");
const allKeywords = tool("ALL KEYWORDS");

export const TOOL_PAGES = {
  "google-maps-rank-tracker": page({
    path: "/google-maps-rank-tracker",
    kicker: "GOOGLE MAPS RANK TRACKER",
    h1: "Google Maps Rank Tracker",
    metaTitle: "Google Maps Rank Tracker — geo-grid local rank tracking | FreeSERP",
    metaDescription:
      "See your Google Maps and Local Pack rank across your whole service area. FreeSERP scans a geo-grid from 3×3 to 21×21 around your business and reports ARP, ATRP and SoLV. 100 free credits every month, no credit card.",
    intro: maps.text,
    points: maps.points,
    cost: "35 credits for a 3×3 grid · up to 1,475 for 21×21",
    shot: maps.shot,
    report: SAMPLE_REPORTS.mapsTracker,
    steps: [
      { title: "Set the pin and radius", text: "Choose where the grid is centred and how far across town it reaches." },
      { title: "Pick a keyword and grid size", text: "Anything from a 3×3 grid up to 21×21, for the search term you want to win." },
      { title: "Read the rank at every point", text: "Each grid point gets a rank pin. Open one to see which businesses rank there instead of you." },
    ],
    faqs: [
      {
        q: "What do ARP, ATRP and SoLV mean?",
        a: "ARP is your average rank across the grid points where you were found. ATRP is the average across every point, with points where you were not found counted as rank 21. SoLV, share of local voice, is the percentage of grid points where you rank in the top 3 — the local pack.",
      },
      {
        q: "How much does a grid scan cost?",
        a: "It depends on the grid size: a 3×3 grid costs 35 credits, 11×11 costs 415 and 21×21 costs 1,475.",
      },
    ],
  }),

  "youtube-rank-tracker": page({
    path: "/youtube-rank-tracker",
    kicker: "YOUTUBE RANK TRACKER",
    h1: "YouTube Rank Tracker",
    metaTitle: "YouTube Rank Tracker — track video rankings in YouTube search | FreeSERP",
    metaDescription:
      "Track where your videos rank in YouTube search. Point FreeSERP at a video or a whole channel, add keywords, and get positions with country and language targeting. 100 free credits every month, no credit card.",
    intro: youtube.text,
    points: youtube.points,
    cost: "5 credits a keyword check",
    shot: youtube.shot,
    report: SAMPLE_REPORTS.youtube,
    steps: [
      { title: "Add a video or a channel", text: "Track one video, or point FreeSERP at a whole channel." },
      { title: "Add your keywords", text: "Set the country and language for each keyword you want to rank for." },
      { title: "Watch the positions", text: "Position, absolute rank and the result block it appeared in, with titles, thumbnails and view counts resolved for you." },
    ],
    faqs: [
      {
        q: "Can I track a whole channel, not just one video?",
        a: "Yes. You can track a single video or an entire channel against your keyword set.",
      },
      {
        q: "Can I track Google and YouTube for the same brand?",
        a: "Yes. YouTube projects sit alongside your Google projects in the same account and spend the same credit balance.",
      },
    ],
  }),

  "site-audit": page({
    path: "/site-audit",
    kicker: "WEBSITE SEO AUDIT",
    h1: "Website SEO Audit",
    metaTitle: "Website SEO Audit — crawl up to 1,000 pages and get a full report | FreeSERP",
    metaDescription:
      "Crawl up to 1,000 pages and get a site-wide SEO report: a site average, grades for SEO, Performance, UI/UX, Links, Technology and Social, and every issue with the URLs behind it. Export to PDF or CSV.",
    intro: siteAudit.text,
    points: siteAudit.points,
    cost: siteAudit.cost,
    shot: siteAudit.shot!,
    report: SAMPLE_REPORTS.audit,
    steps: [
      { title: "Enter your domain", text: "Point FreeSERP at the site you want audited." },
      { title: "Let it crawl", text: "Up to 1,000 pages in a single crawl, every one checked." },
      { title: "Work through the report", text: "Findings grouped by issue or page by page, ranked Critical, High, Medium and Low — then share, export or re-crawl." },
    ],
    faqs: [
      {
        q: "How many pages can one audit crawl?",
        a: "Up to 1,000 pages in a single crawl.",
      },
      {
        q: "How much does a website audit cost?",
        a: "5 credits per page crawled, so a 100-page crawl costs 500 credits.",
      },
      {
        q: "Can I share the report?",
        a: "Yes. Share the report as a link, or export it to PDF or CSV.",
      },
    ],
  }),

  "page-audit": page({
    path: "/page-audit",
    kicker: "ON-PAGE SEO AUDIT",
    h1: "On-Page SEO Audit",
    metaTitle: "On-Page SEO Audit — 63 checks on any URL, graded and explained | FreeSERP",
    metaDescription:
      "Audit any single URL against 63 checks, graded across SEO, Performance, UI/UX, Links, Technology and Social, with every failure explained. Then ask the audit what to fix first.",
    intro: pageAudit.text,
    points: pageAudit.points,
    cost: pageAudit.cost,
    shot: pageAudit.shot!,
    report: SAMPLE_REPORTS.audit,
    steps: [
      { title: "Paste a URL", text: "The one page you actually care about." },
      { title: "63 checks run", text: "Graded across six categories, under one overall score." },
      { title: "Fix, or ask", text: "Every failed check says what it found and why it matters — and you can ask the finished audit what to fix first." },
    ],
    faqs: [
      {
        q: "What is the difference between Page Audit and Site Audit?",
        a: "Page Audit scores one URL in depth against 63 checks. Site Audit crawls up to 1,000 pages and reports issues across the whole site.",
      },
      {
        q: "Can I ask questions about the results?",
        a: "Yes. Once the audit is done, the Audit Assistant answers follow-up questions such as what to fix first.",
      },
    ],
  }),

  "internal-link-analysis": page({
    path: "/internal-link-analysis",
    kicker: "INTERNAL LINK ANALYSIS",
    h1: "Internal Link Analysis",
    metaTitle: "Internal Link Analysis — find orphan pages and map your link structure | FreeSERP",
    metaDescription:
      "Crawl your site and see its internal link structure: hub pages, depth from the homepage, where link equity pools, and the orphan pages nothing links to.",
    intro: links.text,
    points: links.points,
    cost: links.cost,
    shot: links.shot!,
    report: SAMPLE_REPORTS.linkGraph,
    steps: [
      { title: "Enter your domain", text: "FreeSERP crawls it and follows every internal link." },
      { title: "See the graph", text: "Your pages drawn as a node graph, with hubs and authority pages visible at a glance." },
      { title: "Fix what is stranded", text: "Orphan pages are named, and depth from the homepage shows what sits too far down." },
    ],
    faqs: [
      {
        q: "What is an orphan page?",
        a: "A page that no other page on your site links to. Search engines and visitors struggle to reach it, so FreeSERP names every one it finds.",
      },
      {
        q: "Why does click depth matter?",
        a: "Pages buried many clicks from the homepage tend to receive less link equity. The analysis shows each page's depth so you can bring important ones closer.",
      },
    ],
  }),

  "keyword-research": page({
    path: "/keyword-research",
    kicker: "KEYWORD RESEARCH TOOL",
    h1: "Keyword Research Tool",
    metaTitle: "Keyword Research Tool — volume, difficulty, CPC and intent | FreeSERP",
    metaDescription:
      "Turn one seed keyword into hundreds of real ones with search volume, keyword difficulty, CPC and intent. Broad and Related matches, grouped into topics.",
    intro: keywordMagic.text,
    // Not keywordMagic.points: the tool has Broad and Related only (keyword-magic routes), no Phrase/Exact.
    points: [
      "Volume, difficulty, CPC and search intent on every keyword",
      "Broad match and Related keyword results",
      "Word groups that carve a long list into topics",
    ],
    cost: keywordMagic.cost,
    shot: keywordMagic.shot!,
    report: SAMPLE_REPORTS.keywordResearch,
    steps: [
      { title: "Enter a seed keyword", text: "One word or phrase that describes your topic." },
      { title: "Pick a match type", text: "Broad match or Related keywords." },
      { title: "Plan from the groups", text: "Word groups carve the list into topics, so a content plan falls out of it." },
    ],
    faqs: [
      {
        q: "Where do the search volumes come from?",
        a: "From a keyword database — not a language model's guess.",
      },
      {
        q: "How much does a search cost?",
        a: "35 credits for 100 keywords, or 190 credits for the full page of results.",
      },
    ],
  }),

  "keyword-score-checker": page({
    path: "/keyword-score-checker",
    kicker: "KEYWORD SCORE CHECKER",
    h1: "Keyword Score Checker",
    metaTitle: "Keyword Score Checker — is your page built to rank for that keyword? | FreeSERP",
    metaDescription:
      "Check how well a page is built to rank for a keyword before you publish. One grade over on-page and off-page signals, Domain and Page Authority, backlinks and real page speed.",
    intro: keywordScore.text,
    points: keywordScore.points,
    cost: keywordScore.cost,
    shot: keywordScore.shot!,
    report: SAMPLE_REPORTS.keywordScore,
    steps: [
      { title: "Enter a URL and a keyword", text: "Your page, and the term you want it to rank for." },
      { title: "FreeSERP checks it", text: "A crawl of the page, a PageSpeed run and an authority lookup." },
      { title: "Read the grade", text: "One score over on-page and off-page together, with the numbers behind it." },
    ],
    faqs: [
      {
        q: "What does the Keyword Score Checker look at?",
        a: "The page's on-page content for your keyword, its Domain and Page Authority and backlinks, and real page speed — TTFB, FCP, LCP and CLS.",
      },
      {
        q: "How is it different from Competitor Analysis?",
        a: "Keyword Score looks only at your page and your keyword. Competitor Analysis puts your page beside the real top 10 for a tracked keyword.",
      },
    ],
  }),

  "search-console": page({
    path: "/search-console",
    kicker: "GOOGLE SEARCH CONSOLE",
    h1: "Search Console, beside your rankings",
    metaTitle: "Google Search Console integration — clicks and impressions beside rank | FreeSERP",
    metaDescription:
      "Connect Google Search Console to any FreeSERP project and see clicks, impressions and CTR beside the tracked position they belong to. Free to connect, free to read.",
    intro:
      "Link a Search Console property to any project and clicks, impressions and CTR sit beside the tracked position they belong to — so you can tell which rankings actually earn traffic.",
    points: [
      "Total clicks, impressions, CTR and average position",
      "A clicks trend over time",
      "A per-query table",
      "Connecting it and reading it cost nothing",
    ],
    cost: "Free",
    shot: {
      src: "/shots/search-console.png",
      width: 3200,
      height: 2000,
      alt: "FreeSERP Search Console view: total clicks, impressions, CTR and average position, a clicks trend, and the per-query table",
    },
    report: SAMPLE_REPORTS.searchConsole,
    steps: [
      { title: "Create a project", text: "One project per domain you track." },
      { title: "Link a Search Console property", text: "Connect the property that matches the project's domain." },
      { title: "See which rankings earn clicks", text: "Clicks, impressions and CTR sit beside the position you are tracking." },
    ],
    faqs: [
      {
        q: "Does connecting Search Console cost credits?",
        a: "No. Connecting Search Console and reading its data cost nothing.",
      },
      {
        q: "Why connect it if I already track rankings?",
        a: "A ranking tells you where you appear. Search Console tells you whether that position earns clicks — together they show which rankings are worth defending.",
      },
    ],
  }),

  "all-keywords": page({
    path: "/all-keywords",
    kicker: "ALL KEYWORDS",
    h1: "Every tracked keyword, in one table",
    metaTitle: "All Keywords — every project's rankings in one table | FreeSERP",
    metaDescription:
      "See every tracked keyword across every project in a single table: position, movement, search volume, estimated traffic, ranking URL and SERP features. Filter, star and export to CSV.",
    intro: allKeywords.text,
    points: allKeywords.points,
    cost: allKeywords.cost,
    shot: allKeywords.shot!,
    report: SAMPLE_REPORTS.allKeywords,
    steps: [
      { title: "Track keywords in your projects", text: "Each domain gets its own project, targeting and history." },
      { title: "Open All Keywords", text: "Every project's keywords in one table, not one tab each." },
      { title: "Filter, star, export", text: "Narrow by project, device or search engine, star what matters, and export to CSV." },
    ],
    faqs: [
      {
        q: "Does adding keywords cost credits?",
        a: "No. Adding a keyword is free — the rank check it schedules carries the charge.",
      },
      {
        q: "Can I export the table?",
        a: "Yes. The whole table exports to CSV.",
      },
    ],
  }),
} satisfies Record<string, ToolPageData>;

export type ToolSlug = keyof typeof TOOL_PAGES;

export function toolMetadata(slug: ToolSlug): Metadata {
  const p = TOOL_PAGES[slug];
  const url = `https://freeserp.com${p.path}`;
  return {
    title: p.metaTitle,
    description: p.metaDescription,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: { title: p.metaTitle, description: p.metaDescription, url, siteName: "FreeSERP", type: "website" },
    twitter: { card: "summary_large_image", title: p.metaTitle, description: p.metaDescription },
  };
}
