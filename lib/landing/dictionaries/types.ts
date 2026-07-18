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
