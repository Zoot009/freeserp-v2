export type Dictionary = {
  meta: {
    title: string;
    description: string;
  };
  header: {
    getStarted: string;
    tryFree: string;
  };
  hero: {
    headline1: string;
    headlineHighlight: string;
    subheading: string;
    inputPlaceholder: string;
    ctaButton: string;
    disclaimer: string;
    liveDemo: string;
    demoAlt: string;
    invalidDomain: string;
    /** A well-formed domain that doesn't resolve — gibberish the user typed. */
    notFound: string;
    /** Button label while the domain's existence is being checked. */
    checking: string;
  };
  /** Copy for the sample-dashboard preview shown after the hero's domain form. */
  preview: {
    // Loading skeleton. The skeleton itself is silent and decorative; this is
    // the only thing a screen reader announces for it.
    loadingAria: string;
    // Chrome
    close: string;
    crumbWorkspace: string;
    crumbProjects: string;
    crumbKeywords: string;
    topSearch: string;
    allProjects: string;
    autoCheck: string;
    autoCheckOff: string;
    autoCheckSub: string;
    addKeywords: string;
    language: string;
    // Stat strip
    statSeoScore: string;
    statSeoScoreSub: string;
    statSeoScoreReal: string;
    statKeywords: string;
    statKeywordsSub: string;
    statTop3: string;
    statTop10: string;
    statTraffic: string;
    statTrafficSub: string;
    statDomainAuthority: string;
    statBacklinks: string;
    statBacklinksSub: string;
    // Table
    tableTitle: string;
    tableSearch: string;
    tableShowing: string;
    deviceDesktop: string;
    deviceMobile: string;
    colKeyword: string;
    colPosition: string;
    colVolume: string;
    colUrl: string;
    colScores: string;
    colLastChecked: string;
    colActions: string;
    rankCta: string;
    // Left rail
    railTitle: string;
    railVs: string;
    railGained: string;
    railLost: string;
    railNoChange: string;
    competitorsTitle: string;
    addCompetitor: string;
    competitorAvg: string;
    competitorPos: string;
    // Unlock — the table itself is the trigger, so it needs a visible affordance
    hintClick: string;
    modalTitle: string;
    modalSubtitle: string;
    modalPoint1: string;
    modalPoint2: string;
    modalPoint3: string;
    modalCta: string;
    modalNote: string;
    modalDismiss: string;
    /**
     * Short disclosure that the figures behind the modal are illustrative.
     * No check is run for a visitor who has not signed up, so the preview must
     * not be presented as a measurement of their site.
     */
    modalDisclosure: string;
    /**
     * The brief "analysis complete" beat that plays when the crawl finishes,
     * just before the unlock card rises. scanSub takes {domain}.
     */
    scanTitle: string;
    scanSub: string;
  };
  logoStrip: {
    trustLine: string;
    heading: string;
    steps: { step: string; title: string; body: string }[];
  };
  visibility: {
    visibilityScore: string;
    scorePct: string;
    visibilityDelta: string;
    top10Coverage: string;
    coveragePct: string;
    noChange: string;
    trackedKeywords: string;
    trackedRows: { label: string; val: string; color: string }[];
    heading: string;
    bullets: string[];
  };
  competitors: {
    heading: string;
    bullets: string[];
    rankReport: string;
    filters: string[];
    movement: string;
    issueRows: { lead: string; rest: string }[];
    view: string;
    aboutTitle: string;
    aboutBody: string;
    respondTitle: string;
    respondBody: string;
  };
  thematic: {
    heading: string;
    items: { label: string; pct: string; delta: string; positive: boolean }[];
    viewDetails: string;
    heading2: string;
    bullets: string[];
  };
  stats: {
    headingLine1: string;
    headingLine2: string;
    items: { n: string; bold: string; rest: string }[];
  };
  personalization: {
    leadReturning: string;
    leadSource: string;
    mainLocation: string;
    mainDefault: string;
  };
  urgency: {
    countdownLabel: string;
    momentumLine: string;
    momentumFallback: string;
  };
  testimonial: {
    quote: string;
    name: string;
    role: string;
    stat1Val: string;
    stat1Label: string;
    stat2Val: string;
    stat2Label: string;
    stat3Val: string;
    stat3Label: string;
  };
  finalCta: {
    heading: string;
    body: string;
    button: string;
    badges: string[];
    copyright: string;
    legal: string;
    privacy: string;
    doNotSell: string;
  };
};
