import { COLORS } from "@/components/site/constants";

/**
 * The rest of the product, said on the home page.
 *
 * The home page used to stop at the Google rank tracker — Hero, Ticker and
 * InsideApp cover projects, keywords, competitor analysis, alerts, favorites and
 * Search Console, and nothing else. Everything in this file is the part that was
 * missing: the three trackers beyond Google, the seven audit and research tools,
 * the capabilities that have no screenshot of their own, and the credit model
 * that pays for all of it.
 *
 * Every claim maps to a shipped module. The trackers are rankings, maps-tracker,
 * youtube and llm-tracker; the tools are site-crawl, page-audit,
 * competitor-analysis, internal-link-analysis, keywords, keyword-magic and
 * keyword-analysis; the credit costs are DEFAULT_CREDIT_RATES in the backend's
 * credits/catalog.ts and the plan prices are CREDIT_PLANS on /pricing. Nothing
 * here quotes a figure the product does not honour.
 *
 * Screenshots come from freeserp-dummy-pages — static pages that include the
 * app's own dashboard.css verbatim and carry invented data, already captured at
 * 2x into /public/shots and used on /tracking-suite and /audit-suite. They are
 * pixel-identical to the dashboard; the numbers in them are not measurements of
 * anyone's site.
 */

export type Shot = { src: string; width: number; height: number; alt: string };

export interface Tracker {
  kicker: string;
  title: string;
  text: string;
  points: string[];
  /** Saturated accent so the four blocks stay distinguishable as you scroll. */
  dot: string;
  shot: Shot;
  pop: { label: string; num: string; badge?: string; color: string };
}

export const TRACKERS: Tracker[] = [
  {
    kicker: "GOOGLE & BING RANK TRACKER",
    title: "Every keyword, checked every day",
    text: "Add your keywords once and FreeSERP checks them on a schedule — Google or Bing, desktop and mobile, in any of 190+ countries, down to a single city or postcode. Open a keyword and you get its whole position history, the SERP that produced it, and the pages ranking around you.",
    points: [
      "Automated recurring checks across your whole keyword set",
      "Google and Bing tracked separately — a keyword can use either or both",
      "Position history charted, with day-over-day movement",
      "Top 3, 4–10, 11–20, 21–100 and Unranked bands that sum to your total",
      "The full SERP behind every position, features included",
    ],
    dot: COLORS.blue,
    shot: {
      src: "/shots/rank-tracker.png",
      width: 2240,
      height: 1680,
      alt: "FreeSERP rank tracker: a tracked keyword with its position history chart, the SERP that produced it, and the competing pages",
    },
    pop: { label: "Position · 30 days", num: "4", badge: "+6", color: COLORS.blue },
  },
  {
    kicker: "GOOGLE MAPS TRACKER",
    title: "See your Map Pack rank street by street",
    text: "Ranking first at your own address does not mean you rank first across town. FreeSERP scans a geo-grid around your business and puts a rank pin on every point, so you can see exactly which corners of your service area you are losing — and who is holding them.",
    points: [
      "Geo-grids from 3×3 up to 21×21 around any pin and radius",
      "ARP, ATRP and SoLV — the three metrics local SEOs report on",
      "Ranks read to depth 20, with the top 3 counted as the local pack",
      "Open any grid point for the businesses ranking at it",
    ],
    dot: COLORS.green,
    shot: {
      src: "/shots/maps-tracker.png",
      width: 2240,
      height: 1680,
      alt: "FreeSERP Google Maps Tracker: a completed geo-grid scan with SoLV, ARP and ATRP, a rank pin at every grid point, and the rank distribution beneath",
    },
    pop: { label: "Share of local voice", num: "38%", badge: "11×11", color: COLORS.green },
  },
  {
    kicker: "YOUTUBE RANK TRACKER",
    title: "Track video rankings the way you track pages",
    text: "YouTube is the second-largest search engine and almost nobody tracks it. Point FreeSERP at a video or an entire channel, give it your keywords, and it reports position and movement exactly the way it reports Google.",
    points: [
      "Track a single video or a whole channel against your keyword set",
      "Daily positions, absolute rank and the result block it appeared in",
      "Country and language targeting on every keyword",
      "Titles, channels, thumbnails and view counts resolved automatically",
    ],
    dot: "#d94a2b",
    shot: {
      src: "/shots/youtube-tracker.png",
      width: 3200,
      height: 2000,
      alt: "FreeSERP YouTube Rank Tracker: tracked keywords with position, absolute rank, result block, the ranking video and its view count",
    },
    pop: { label: "Videos in Top 10", num: "27", badge: "9 up", color: "#d94a2b" },
  },
  {
    kicker: "AI VISIBILITY TRACKER",
    title: "Find out what AI answers say about you",
    text: "A growing share of buying decisions never touches a blue link. FreeSERP runs your prompts against ChatGPT, Gemini, Perplexity and Claude on a schedule, then scores how often you are named, how often you are cited, and how early in the answer you appear. Every answer is stored, so you can read the sentence you were mentioned in.",
    points: [
      "ChatGPT, Gemini, Perplexity and Claude, run on your cadence",
      "Mention rate, citation rate and prominence per prompt and platform",
      "Share of voice against the competitors you name",
      "The cited sources behind each answer, and the answer text itself",
    ],
    dot: COLORS.purple,
    shot: {
      src: "/shots/ai-tracker.png",
      width: 3200,
      height: 2000,
      alt: "FreeSERP AI Prompt Tracker: prompts scored across ChatGPT, Claude, Gemini and Perplexity with mention rate, citation rate and prominence",
    },
    pop: { label: "Mention rate", num: "61%", badge: "4 models", color: COLORS.purple },
  },
];

export interface Tool {
  /** Short name for the tab strip — two words at most, so seven fit on one row. */
  label: string;
  kicker: string;
  title: string;
  text: string;
  points: string[];
  cost: string;
  shot: Shot;
}

/**
 * The seven audit and research tools, shown as a tabbed showcase.
 *
 * One panel at a time rather than seven cards side by side: the screenshots are
 * the point, and at card size they read as grey mush. All seven panels stay in
 * the HTML (hidden, not unmounted) so the copy is still indexable and the tab
 * switch has nothing to fetch but the image.
 *
 * Order is the order people meet them — crawl the site, audit a page, compare
 * with rivals, then the research tools.
 */
export const TOOLS: Tool[] = [
  {
    label: "Site Audit",
    kicker: "FULL WEBSITE AUDIT",
    title: "Crawl the whole site, then read it as a report",
    text: "Point FreeSERP at a domain and it crawls up to 1,000 pages, then hands back a document rather than a progress bar: one site average over six category grades, every finding grouped by issue — or flipped to a page-by-page list — with the URLs and the exact element behind each one.",
    points: [
      "Up to 1,000 pages in a single crawl",
      "A site average, plus a grade for SEO, Performance, UI/UX, Links, Technology and Social",
      "Findings ranked Critical, Warning and Notice, counted across every page",
      "Share the report, export it to PDF or CSV, re-crawl whenever you like",
    ],
    cost: "1 credit per 20 pages",
    shot: {
      src: "/shots/site-audit-report.png",
      width: 3200,
      height: 2000,
      alt: "FreeSERP Full Website Audit report: a site average of 74 over SEO, Performance, UI/UX, Links, Technology and Social grades, with 735 issues grouped by type and the affected URLs listed under each",
    },
  },
  {
    label: "Page Audit",
    kicker: "PAGE AUDIT",
    title: "One page, 63 checks, graded",
    text: "The page you actually care about, scored end to end and explained in words you can act on. Six category grades sit under one overall score, and every failed check says what it found, why it matters and where. When the audit is done you can ask it a follow-up question.",
    points: [
      "SEO, Performance, UI/UX, Links, Technology and Social",
      "Failures ranked Critical or Warning, each one explained",
      "Ask the finished audit what to fix first",
    ],
    cost: "1 credit an audit",
    shot: {
      src: "/shots/page-audit.png",
      width: 2240,
      height: 1680,
      alt: "FreeSERP Page Audit: an overall grade of 76 with SEO, Performance, UI/UX, Links, Technology and Social scores, the failed checks explained beneath, and the Audit Assistant answering what to fix first",
    },
  },
  {
    label: "Competitors",
    kicker: "COMPETITOR ANALYSIS",
    title: "Your page against the ones ranking above it",
    text: "Pick a tracked keyword and FreeSERP puts your page beside the pages beating you, scored on the same 63 on-page checks. Not a list of what they rank for — a column-by-column read of what they do differently on the page that outranks yours.",
    points: [
      "Your domain and the real top 10, side by side",
      "Overall SEO score plus every check behind it",
      "Title length, meta description, word count, keyword use",
    ],
    cost: "5 credits an analysis",
    shot: {
      src: "/shots/competitor-analysis.png",
      width: 2240,
      height: 1680,
      alt: "FreeSERP competitor analysis: your domain and three rivals side by side with SERP position, overall SEO score, title length, meta description, word count and keyword occurrences",
    },
  },
  {
    label: "Internal Links",
    kicker: "INTERNAL LINK ANALYSIS",
    title: "See the link graph your site actually has",
    text: "Crawl the domain and get your internal link structure drawn out — which pages are hubs, which hold authority, how deep everything sits from the homepage, and which pages nothing at all links to.",
    points: [
      "Pages crawled, internal links and links per page",
      "Orphan pages — reachable from nothing — named",
      "Depth from the homepage, and where link equity pools",
    ],
    cost: "2 credits a crawl",
    shot: {
      src: "/shots/internal-links.png",
      width: 2240,
      height: 1680,
      alt: "FreeSERP Internal Links Analysis: 428 pages crawled with 3,914 internal links, 4 orphan pages and a max depth of 5, drawn as a node graph",
    },
  },
  {
    label: "Keyword Research",
    kicker: "KEYWORD MAGIC TOOL",
    title: "One seed keyword, hundreds of real ones",
    text: "Type a seed and get back keywords people actually search, with volumes from a keyword database rather than a language model's guess — grouped by the words inside them, so a content plan falls out of the list.",
    points: [
      "Volume, difficulty, CPC and search intent on every keyword",
      "Broad, Phrase, Exact and Related match types",
      "Word groups that carve a long list into topics",
    ],
    cost: "3 credits a search, 15 for the full page",
    shot: {
      src: "/shots/keyword-magic.png",
      width: 3200,
      height: 2000,
      alt: "FreeSERP Keyword Magic Tool: 1,284 keywords from one seed with 1.9M total monthly volume, average difficulty 44 and average CPC $1.21, grouped by word",
    },
  },
  {
    label: "Keyword Score",
    kicker: "KEYWORD SCORE CHECKER",
    title: "Score a page before you publish it",
    text: "No competitors, no crawl of the whole site — just your page and the term you want it to rank for. FreeSERP crawls it, runs it through PageSpeed and an authority lookup, and tells you how well the page is actually built for that keyword.",
    points: [
      "One grade over on-page and off-page together",
      "Domain and Page Authority, and the backlinks behind them",
      "Real page speed — TTFB, FCP, LCP and CLS",
    ],
    cost: "3 credits a page",
    shot: {
      src: "/shots/keyword-score.png",
      width: 2240,
      height: 1680,
      alt: "FreeSERP Keyword Score Checker: a page scored 86, Grade A, split into on-page 91 and off-page 78, with Domain Authority 91, Page Authority 64, backlink counts and the page's TTFB, LCP and CLS",
    },
  },
  {
    label: "All Keywords",
    kicker: "ALL KEYWORDS",
    title: "Every project in one table",
    text: "Your whole portfolio in a single view instead of one tab per project — position, movement, search volume, estimated traffic, the URL that ranks and the SERP features around it. Filter it, star what matters, and take the whole thing out as a CSV when the report is due.",
    points: [
      "Every project in one table, not one tab each",
      "Filter by project, device or search engine",
      "Adding a keyword is free — you pay for the check",
    ],
    cost: "1 credit a check",
    shot: {
      src: "/shots/keywords-all.png",
      width: 3200,
      height: 2000,
      alt: "FreeSERP Keywords: 487 keywords tracked across three projects in one table, with average position, top-3 and top-10 counts, and each keyword's position, movement, volume, traffic, ranking URL and SERP features",
    },
  },
];

/** Capability, icon key, and what it actually does. Icons resolve in Capabilities.tsx. */
export interface Capability {
  icon:
    | "globe"
    | "clock"
    | "layers"
    | "bell"
    | "star"
    | "download"
    | "share"
    | "zap"
    | "gauge"
    | "sparkles"
    | "eye"
    | "chart";
  title: string;
  text: string;
}

export const CAPABILITIES: Capability[] = [
  {
    icon: "globe",
    title: "Targeting past the country",
    text: "190+ countries, and below that a searchable catalogue of cities and postcodes. Pick desktop or mobile per keyword — the two are tracked separately, because they rank separately.",
  },
  {
    icon: "eye",
    title: "Watch rivals on your own keywords",
    text: "Name the domains you compete with and FreeSERP captures their position alongside yours on every keyword you track — one SERP fetch returns both — so the gap between you is a tracked line, not a one-off snapshot.",
  },
  {
    icon: "clock",
    title: "Checks that run without you",
    text: "Set a cadence on a project and the checks run themselves. Movement lands in your activity feed instead of waiting for someone to remember to look.",
  },
  {
    icon: "gauge",
    title: "Position bands that add up",
    text: "Top 3, 4–10, 11–20, 21–100 and Unranked. They are exclusive, so the five counts sum to the keywords you track and the dashboard never double-counts a win.",
  },
  {
    icon: "chart",
    title: "Search Console, connected free",
    text: "Link a property to any project and clicks, impressions and CTR sit beside the tracked position they belong to — so you can tell which rankings actually earn traffic.",
  },
  {
    icon: "zap",
    title: "Quick SERP lookup",
    text: "Need one answer now rather than a tracked history? Run a live check on any keyword and read the current top 100, with the SERP features that come with it.",
  },
  {
    icon: "sparkles",
    title: "Keyword suggestions on day one",
    text: "Create a project and FreeSERP reads your homepage and proposes the keywords worth tracking, with volumes attached — so your first dashboard is not an empty one.",
  },
  {
    icon: "layers",
    title: "A project per domain",
    text: "Your site, a client's site, or a rival you are watching. Each project keeps its own keywords, its own targeting and its own tracked history, all under one login.",
  },
  {
    icon: "bell",
    title: "Alerts and an activity feed",
    text: "Significant position changes are surfaced as they happen, so a drop reaches you on the day it occurs rather than in next month's report.",
  },
  {
    icon: "star",
    title: "Favorites across every project",
    text: "Star your highest-priority terms wherever they live and reach them in one click, without scrolling hundreds of rows to find the five that matter.",
  },
  {
    icon: "download",
    title: "Export anything",
    text: "CSV and PDF export on the tables and the reports, so the data lives in your stack and your client's inbox rather than behind our login.",
  },
  {
    icon: "share",
    title: "Shareable reports",
    text: "Send a finished audit or analysis as a link. The person reading it does not need an account, and you do not need to rebuild it as a slide.",
  },
];

/**
 * What a credit buys. Straight from the backend rate card
 * (credits/catalog.ts DEFAULT_CREDIT_RATES) so the page cannot quote a price
 * checkout does not honour.
 */
export const CREDIT_COSTS: { action: string; cost: string; note: string }[] = [
  { action: "Rank check", cost: "1", note: "One keyword, one engine, depth 100" },
  { action: "Adding a keyword", cost: "Free", note: "The check it schedules carries the charge" },
  { action: "Quick SERP lookup", cost: "1", note: "A live, one-off check" },
  { action: "YouTube check", cost: "1", note: "One keyword against a video or channel" },
  { action: "Local map grid scan", cost: "3–57", note: "3×3 costs 3, 11×11 costs 17, 21×21 costs 57" },
  { action: "AI answer", cost: "1", note: "Per answer sampled; 3 on Claude" },
  { action: "Page audit", cost: "1", note: "One URL, 63 checks" },
  { action: "Website audit", cost: "1 / 20 pages", note: "A 1,000-page crawl costs 50" },
  { action: "Competitor analysis", cost: "5", note: "Your page against the real top 10" },
  { action: "Internal link analysis", cost: "2", note: "Up to 150 pages crawled and graphed" },
  { action: "Keyword research", cost: "3–15", note: "3 for 100 keywords, 15 for the full page" },
  { action: "Keyword score", cost: "3", note: "Crawl, PageSpeed and an authority lookup" },
  { action: "Search Console", cost: "Free", note: "Connecting it and reading it cost nothing" },
];
