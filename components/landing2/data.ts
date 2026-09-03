// Copy for /landing2, lifted verbatim from the "FreeSERP Ads Landing v2 (Tight)"
// design canvas (its DCLogic renderVals()). Kept in one module rather than inline
// in the sections so a copy edit is a one-file change — this is an ads landing
// page whose wording gets tuned far more often than its layout.

export type Tool = {
  name: string;
  what: string;
  /** Credit price. Empty for the two tools whose rate is server-side only. */
  cost: string;
};

export const TOOLS: Tool[] = [
  { name: "Keyword Rank Tracker", what: "Daily positions in any country, with history", cost: "1 / keyword" },
  { name: "AI Prompt Tracker", what: "Brand mentions in ChatGPT, Claude, Gemini, Perplexity", cost: "" },
  { name: "Google Maps Tracker", what: "A geo-grid of local rankings, block by block", cost: "3–57 / scan" },
  { name: "YouTube Rank Tracker", what: "Video positions, with views and age", cost: "1 / keyword" },
  { name: "Website Audit", what: "A real browser crawl and 63 SEO rules", cost: "1 / 20 pages" },
  { name: "Page Audit", what: "One URL, every issue, with an AI plan", cost: "" },
  { name: "Competitor Analysis", what: "Your page against the ones outranking it", cost: "5 / analysis" },
  { name: "AI Internal Linking", what: "Your link graph, with orphans and hubs surfaced", cost: "2 / crawl" },
  { name: "Keyword Magic Tool", what: "Hundreds of ideas with volume, difficulty and intent", cost: "3–15 / search" },
  { name: "Keyword Score Checker", what: "One page scored against one keyword", cost: "3 / page" },
  { name: "Quick Serp", what: "A live lookup without tracking anything", cost: "1 / lookup" },
  { name: "Search Console & GA4", what: "Real clicks beside your tracked positions", cost: "Free" },
];

/** The rate card is the tool list minus the two with no public per-unit price. */
export const COSTS: Tool[] = TOOLS.filter((t) => t.cost);

export type Step = {
  n: string;
  title: string;
  body: string;
  shot: string;
  width: number;
  height: number;
};

export const STEPS: Step[] = [
  {
    n: "01",
    title: "Sign up free",
    body: "Email or Google. No card, no sales call.",
    shot: "/screenshots/08-signup.png",
    width: 1042,
    height: 585,
  },
  {
    n: "02",
    title: "Add your site",
    body: "One project per domain you want to watch.",
    shot: "/screenshots/09-create-project.png",
    width: 1040,
    height: 585,
  },
  {
    n: "03",
    title: "Pick keywords",
    body: "Choose the engine, country and device for each.",
    shot: "/screenshots/10-add-keywords.png",
    width: 1040,
    height: 585,
  },
  {
    n: "04",
    title: "Read the report",
    body: "Positions daily, alerts on movement, a plan to fix.",
    shot: "/screenshots/11-rankings-report.png",
    width: 1040,
    height: 585,
  },
];

export type Faq = { q: string; a: string };

export const FAQS: Faq[] = [
  {
    q: "Is the free plan actually usable?",
    a: "Yes. Every tool is unlocked on it and it refills every month. There is no card at signup and no trial clock.",
  },
  {
    q: "Do I need to know SEO?",
    a: "No. Issues come back in plain English with the fix attached, and the AI panel answers questions using your own report data.",
  },
  {
    q: "Which countries and devices?",
    a: "190+ countries and all devices. You set the engine, the location and the device per keyword.",
  },
  {
    q: "What is a credit?",
    a: "One unit of work. A tracked keyword costs 1, an audit costs 1 per 20 pages, a competitor analysis costs 5. The full rate card is above.",
  },
  {
    q: "Can I share results with a client?",
    a: "Any keyword set, audit or maps scan can become a shareable link or a PDF. Whoever you send it to does not need an account.",
  },
  {
    q: "Is it available in my language?",
    a: "The app ships in English, Spanish, French, German and Dutch.",
  },
];

export type Plan = {
  name: string;
  price: string;
  note: string;
  feats: string[];
  cta: string;
  featured?: boolean;
};

export const PLANS: Plan[] = [
  {
    name: "Free",
    price: "$0",
    note: "Refilled every month, automatically.",
    feats: ["Every tool unlocked", "190+ countries, all devices", "No credit card required"],
    cta: "Start free",
  },
  {
    name: "Starter",
    price: "$19",
    note: "One site, checked every day.",
    feats: ["Daily rank checks", "Site audits and competitor runs", "Top-up packs any time"],
    cta: "Choose Starter",
  },
  {
    name: "Pro",
    price: "$49",
    note: "Several sites, or one you work hard.",
    feats: ["Everything in Starter", "Maps grids and AI platform tracking", "Shareable white-label reports"],
    cta: "Choose Pro",
    featured: true,
  },
  {
    name: "Agency",
    price: "$99",
    note: "Client work and bigger keyword sets.",
    feats: ["Everything in Pro", "Large crawls and multi-client projects", "PDF and CSV export everywhere"],
    cta: "Choose Agency",
  },
];

export type Stat = { n: string; label: string; shortLabel: string };

export const STATS: Stat[] = [
  { n: "12", label: "tools, all included", shortLabel: "tools included" },
  { n: "63", label: "SEO rules per audit", shortLabel: "audit rules" },
  { n: "4", label: "AI platforms tracked", shortLabel: "AI platforms" },
  { n: "$0", label: "to start, no card", shortLabel: "to start" },
];

export const AI_PLATFORMS = ["ChatGPT", "Claude", "Gemini", "Perplexity"];
