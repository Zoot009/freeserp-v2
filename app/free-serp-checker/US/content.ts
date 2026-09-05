/**
 * Every word on /free-serp-checker/US, in one place.
 *
 * Deliberately NOT wired into lib/landing/dictionaries: "US" is an ad market,
 * not a language, and putting it in the locale table made it look like one.
 * This page owns its copy outright, the way /tracking-suite does — so a US
 * campaign can be re-worded without any chance of moving the /en, /es, /fr or
 * /nl landers, and vice versa.
 *
 * The trade is that copy shared with those landers is duplicated here rather
 * than inherited. That is the intended trade for an ad page: the campaigns
 * drift apart on purpose.
 *
 * Nothing in here is unread. The hero's checker is the shared SerpForm, which
 * owns its own field labels and button, so this file carries no input copy.
 */
export const content = {

  meta: {
    title: "Free SERP Checker — Check your Google rankings by country & device",
    description:
      "Check where your website actually ranks by keyword, country, and device using real Google SERP results. 100 free credits monthly, no credit card.",
  },
  nav: {
    credits: "100 free credits",
    cta: "Start free",
  },
  hero: {
    eyebrow: "Free SERP checker",
    market: "United States",
    headline1: "Still Googling your keywords",
    headlineHighlight: "to check your rankings?",
    // Two short lines, not two paragraphs. The long version explained
    // personalization at length and then repeated "by keyword, country and
    // device" — that repetition was most of the bulk. Now the first line is
    // the what, the second is the single reason it beats searching it
    // yourself, which is what the headline just asked.
    subheading:
      "Check where your site really ranks — by keyword, country and device.",
    subheading2:
      "Real Google SERP results, not the personalized ones you see when you search yourself.",
    ctaButton: "Check your rankings free",
    disclaimer: "100 Free Credits Monthly • No Credit Card • Real SERP Results",
    demoAlt:
      "FreeSerp product demo: entering a domain and keyword to check search rankings",
  },
  tags: {
    demo: "The demo",
    positioning: "Positioning",
    steps: "How it works",
    reports: "What you get",
    markets: "Search markets",
    journey: "After the check",
    proof: "Proof",
  },
  demo: {
    heading: "See how FreeSERP works",
    body: "Enter a keyword, choose your search preferences, and get your ranking in seconds.",
  },
  positioning: {
    heading: "Why pay for a full SEO suite just to check rankings?",
    suiteTitle: "Traditional SEO platforms",
    suitePoints: [
      "Complex dashboards",
      "Expensive subscriptions",
      "Features you may never use",
      "Overkill for a quick ranking check",
    ],
    freeserpTitle: "FreeSERP",
    freeserpPoints: [
      "Check rankings instantly",
      "Simple workflow",
      "190+ countries",
      "Desktop & mobile",
      "Top 100 results",
      "Free monthly credits",
    ],
  },
  markets: {
    heading: "One business. Multiple search markets.",
    intro: "A US business might care about:",
    map: {
      alt: "A map of the United States showing the four search markets at once: a pin on Miami for local, Florida filled in for state, the whole country outlined for national, and dashed rings running past its edges for international.",
      localPin: "Miami",
      statePin: "Florida",
    },
    tiers: [
      { tier: "Local", example: "plumber in Miami" },
      { tier: "State", example: "Florida plumbing services" },
      { tier: "National", example: "best plumbing company" },
      { tier: "International", example: "plumbing software" },
    ],
    outro:
      "FreeSERP lets you choose the search market you're interested in rather than relying on whatever Google happens to show you.",
  },
  journey: {
    heading: "From quick checks to long-term rank tracking",
    body: "Start with a quick SERP check, then keep your important keywords organized and monitored from your FreeSERP dashboard.",
    steps: ["Check", "Track", "Monitor", "Improve"],
  },
  logoStrip: {
    trustLine: "2M+ marketers already track with FreeSERP",
    heading: "See where you rank in google search",
    steps: [
      {
        step: "STEP #1",
        title: "Enter your domain",
        body: "Enter any domain or keyword you want to track.",
      },
      {
        step: "STEP #2",
        title: "Pick keywords & scope",
        body: "Choose the keywords, countries, and devices to monitor.",
      },
      {
        step: "STEP #3",
        title: "Get your positions",
        body: "See your visibility score and top-10 coverage — and what to fix first.",
      },
    ],
  },
  visibility: {
    visibilityScore: "Visibility score",
    scorePct: "68%",
    visibilityDelta: "+4%",
    top10Coverage: "Top-10 coverage",
    coveragePct: "24%",
    noChange: "no change",
    trackedKeywords: "Tracked keywords",
    trackedRows: [
      { label: "Winning", val: "312", color: "#16a34a" },
      { label: "Losing", val: "48", color: "#ef4444" },
      { label: "New", val: "12", color: "#f59e0b" },
      { label: "Lost", val: "5", color: "#9aa2b5" },
    ],
    heading: "Track 50M+ keywords across 190+ countries",
    bullets: [
      "See your visibility score and top-10 coverage side by side",
      "Benchmark your positions against competitors on every shared keyword",
      "Fix the keywords slipping first with prioritized, daily-updated data",
    ],
  },
  competitors: {
    heading: "Catch every competitor outranking you",
    bullets: [
      "See exactly who ranks above you for each keyword",
      "Track shared keywords, content gaps, and where you win",
      "Spot rivals gaining ground before it costs you traffic",
    ],
    rankReport: "Rank report",
    filters: ["All 112", "Winning 20", "Losing 24"],
    movement: "MOVEMENT",
    issueRows: [
      { lead: "12 keywords", rest: "entered the top 10" },
      { lead: "8 keywords", rest: "dropped out of the top 20" },
      { lead: "5 competitors", rest: "gained on shared terms" },
    ],
    view: "View",
    aboutTitle: "About this movement",
    aboutBody:
      "Positions shift daily as competitors publish and Google re-ranks.",
    respondTitle: "How to respond",
    respondBody:
      "Refresh the slipping page and target the competitor's gap keywords.",
  },
  thematic: {
    heading: "Thematic reports",
    items: [
      { label: "Rank Tracking", pct: "97%", delta: "+4%", positive: true },
      { label: "SERP Features", pct: "85%", delta: "-11%", positive: false },
      { label: "Coverage", pct: "95%", delta: "", positive: true },
      { label: "Daily Updates", pct: "98%", delta: "+4%", positive: true },
      { label: "Competitor Gaps", pct: "92%", delta: "+1%", positive: true },
      { label: "Traffic Est.", pct: "97%", delta: "+2%", positive: true },
    ],
    viewDetails: "View details →",
    heading2: "Monitor and improve your rankings",
    bullets: [
      "Access detailed reports on coverage, SERP features, competitors, and traffic",
      "Schedule daily auto-checks and get alerts before you slip",
      "Export reports to share progress with clients or stakeholders",
    ],
  },
  stats: {
    headingLine1: "Marketers all over the world",
    headingLine2: "trust FreeSERP",
    items: [
      {
        n: "50M+",
        bold: "Keywords indexed",
        rest: "across every major search engine",
      },
      {
        n: "190+",
        bold: "Countries & devices",
        rest: "with city-level targeting",
      },
      {
        n: "2 min",
        bold: "From first check",
        rest: "to daily rank tracking",
      },
    ],
  },
  testimonial: {
    quote:
      "We dropped a $299/mo tool the day we found FreeSERP. Daily rank tracking across 14 countries, competitor gaps, and CSV exports — for a fraction of the price.",
    name: "Daniel Cooper",
    role: "Indie SEO Consultant",
    stat1Val: "+100%",
    stat1Label: "ranking wins",
    stat2Val: "^336%",
    stat2Label: "keyword visibility growth",
    stat3Val: "Millions",
    stat3Label: "of ranks tracked",
  },
  finalCta: {
    heading: "Check your rankings now",
    body: "Search plays by new rules. Most sites don't know where they stand. Find out before it costs you traffic.",
    button: "Start free",
    badges: [
      "#1 RANK TRACKER",
      "#1 SERP CHECKER",
      "BEST VALUE SEO TOOL",
      "BEST FREE TIER 2026",
      "TOP RATED BY USERS",
    ],
    copyright: "© 2026 FreeSERP. All rights reserved.",
    legal: "Legal Info",
    privacy: "Privacy Policy",
    doNotSell: "Do not sell my personal info",
  },
};
