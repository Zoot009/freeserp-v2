/**
 * Every word on /free-serp-checker/UK, in one place.
 *
 * Deliberately NOT wired into lib/landing/dictionaries: "UK" is an ad market,
 * not a language, and putting it in the locale table made it look like one.
 * This page owns its copy outright, the way /tracking-suite and the sibling
 * /free-serp-checker/US page do — so a UK campaign can be re-worded without any
 * chance of moving the /en, /es, /fr or /nl landers, and vice versa.
 *
 * The trade is that copy shared with those landers is duplicated here rather
 * than inherited. That is the intended trade for an ad page: the campaigns
 * drift apart on purpose.
 *
 * British spellings ("personalised", "organised") are used in the copy written
 * for this market. The shared sections below keep the wording they have on the
 * other landers so the two do not silently disagree.
 */
export const content = {
  // The top bar's only control. Its own key rather than reusing the closing
  // CTA's label, so the two can be worded differently per campaign.
  topbarCta: "Start free",
  meta: {
    title: "Free SERP Checker UK — Check your Google rankings by country & device",
    description:
      "See where your website ranks on Google in the UK and worldwide. Check by keyword, country and device with real SERP results. 100 free credits monthly, no credit card.",
  },
  hero: {
    headline1: "How does your website",
    headlineHighlight: "rank on Google?",
    // Two short lines, not two paragraphs. The long version said "by keyword,
    // country and device" and "real Google SERP results" once each in BOTH
    // lines — that repetition was most of the bulk. Now the first line is the
    // what, the second is the single reason it beats searching it yourself.
    subheading:
      "Check where your site really ranks — by keyword, country and device.",
    subheading2:
      "Real Google SERP results, not the personalised ones you see when you search yourself.",
    // The label on the mid-page signup button. The hero's own submit lives in
    // `check` with the rest of the form.
    ctaButton: "Check your rankings free",
    demoAlt:
      "FreeSerp product demo: entering a domain and keyword to check search rankings",
  },
  // The hero's check form. A real SERP lookup needs all four inputs, so they
  // are asked for up front rather than collected after the click.
  check: {
    domainLabel: "Domain",
    domainPlaceholder: "example.co.uk",
    keywordLabel: "Keyword",
    keywordPlaceholder: "best running shoes",
    countryLabel: "Country",
    deviceLabel: "Device",
    desktop: "Desktop",
    mobile: "Mobile",
    submit: "Check rankings",
    checking: "Checking…",
    disclaimer: "100 Free Credits Monthly • No Credit Card • Real SERP Results",
  },
  tags: {
    demo: "The demo",
    positioning: "Positioning",
    steps: "How it works",
    reports: "What you get",
    audiences: "Search audiences",
    journey: "After the check",
    proof: "Proof",
  },
  demo: {
    heading: "See how FreeSERP works",
    body: "Enter a keyword, choose your search preferences, and get your ranking in seconds.",
    liveDemo: "Live demo",
  },
  // Country-neutral by design — the same argument holds in every market, so
  // this reads the same here as it does on the US lander.
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
  // The UK-specific block. No intro line: the heading makes the point, and the
  // map plus the four examples carry the rest.
  audiences: {
    heading: "One website. Different search audiences.",
    tiers: [
      { tier: "Local", example: "best dentist in Manchester" },
      { tier: "Regional", example: "digital marketing agency London" },
      { tier: "National", example: "best accounting software UK" },
      { tier: "International", example: "best accounting software" },
    ],
    outro:
      "Search visibility can change depending on where and how your audience searches. FreeSERP lets you check the markets and devices that matter to your business.",
    map: {
      alt: "Map of the United Kingdom: a local pin on Manchester, a regional catchment ring around London, the national outline, and dashed rings reaching past the coast for international search.",
      localPin: "Manchester",
      regionalPin: "London",
      ladder: ["Local", "Regional", "National", "Global"],
    },
  },
  journey: {
    heading: "From quick checks to long-term rank tracking",
    body: "Start with a quick SERP check, then keep your important keywords organized and monitored from your FreeSERP dashboard.",
    steps: ["Check", "Track", "Monitor", "Improve"],
    // Illustrative, not a measurement — the same footing as every other mockup
    // on this page. `bar` is the fill width as a percentage, derived from the
    // position it sits beside so the two can never disagree by hand.
    tracker: {
      chrome: "app.freeserp.com — rank tracker",
      rows: [
        { keyword: "best running shoes", position: 3 },
        { keyword: "trail shoes uk", position: 9 },
        { keyword: "marathon trainers", position: 17 },
        { keyword: "cushioned running shoes", position: 6 },
      ],
    },
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
