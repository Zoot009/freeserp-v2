/**
 * Copy and schema for /local-search-grid.
 *
 * This page owns grid-only intent: the point-by-point map grid itself, how
 * proximity changes a ranking across it, and reading the resulting heatmap.
 * "local search grid tool", "google maps seo grid", "gmb heat map tracker".
 *
 * It is deliberately NOT a second Maps rank tracker. /google-maps-rank-tracker
 * owns "where does my Google Business Profile rank, and track it over time";
 * this one owns "what shape is my visibility across an area". The two link to
 * each other so the split is legible — see the last FAQ, which states it
 * outright.
 *
 * Every number is the product's real behaviour:
 *   - grid sizes, the 900-search cap and 50 m minimum spacing come from
 *     freeserp-frontend-v2/components/maps-tracker/grid.ts (GRID_SIZES,
 *     MAX_SCAN_POINTS, MIN_SPACING_METERS, SCAN_DEPTH, RANK_BANDS)
 *   - credits are 1 per scan + 1 per 8 points, from
 *     freeserp-backend-v2/src/modules/credits/catalog.ts
 * Keep them in step when the product changes.
 *
 * Both screenshots are shared with /google-maps-rank-tracker — same feature,
 * same captures. Replacing one replaces it on both pages; give the new file a
 * new name rather than overwriting, since next/image is cached by URL.
 */
export const SCAN_SHOT = { src: "/shots/maps/scan-nyc.png", w: 1911, h: 1000 } as const;
export const REPORT_SHOT = { src: "/shots/maps/report-v2.png", w: 950, h: 912 } as const;

export type Step = {
  n: string;
  label: string;
  title: string;
  desc: string;
};

export const STEPS: Step[] = [
  {
    n: "01",
    label: "Drop the centre",
    title: "Put the centre where the customers are",
    desc:
      "Pick your business from Google Places and the grid centres on it. Drag the centre pin if the area you sell into isn't the area you sit in — a workshop on a ring road serving the town next door.",
  },
  {
    n: "02",
    label: "Size the grid",
    title: "Choose the grid and the radius",
    desc:
      "Anything from 3×3 to 21×21, over a radius you set. Spacing between points is worked out from the two, so you decide how wide the scan reaches and how fine the detail is.",
  },
  {
    n: "03",
    label: "Search every point",
    title: "Every point is a real search",
    desc:
      "The grid runs centre-first and works outward, sending one live Google Maps query per point at those exact coordinates and recording the top 20 businesses it returns.",
  },
  {
    n: "04",
    label: "Read the map",
    title: "Read your visibility as a shape",
    desc:
      "Each point comes back coloured by the position it found you at. The pattern across the grid — where the green stops and the red starts — is the thing a single ranking number can never tell you.",
  },
];

/**
 * The rank bands the grid colours points by. Labels and order mirror
 * RANK_BANDS in the app's grid.ts; the hexes are the app's own pin colours so
 * the legend here matches the legend in a real scan.
 */
/**
 * `on` is the text colour to use against `color` — the three mid bands are
 * light enough that white type on them fails contrast, so they take ink.
 */
export type Band = { label: string; color: string; on: string; meaning: string };

const INK = "#10131a";

export const BANDS: Band[] = [
  { label: "Top 3", color: "#0ea66f", on: "#fff", meaning: "In the Map Pack. The only band that reliably earns calls." },
  { label: "4–7", color: "#7bc043", on: INK, meaning: "Visible after a tap on “More places”. Close, but not chosen." },
  { label: "8–10", color: "#f5a623", on: INK, meaning: "Found, effectively unseen. Worth treating as a gap." },
  { label: "11–15", color: "#f2711c", on: INK, meaning: "Deep in the list. A searcher here will not scroll to you." },
  { label: "16–20", color: "#e0393e", on: "#fff", meaning: "The edge of what the scan records at all." },
  { label: "Not found", color: "#6d1a1d", on: "#fff", meaning: "Not in the top 20 from that point. You do not exist there." },
];

export type Pattern = { title: string; desc: string };

export const PATTERNS: Pattern[] = [
  {
    title: "Green only at the centre",
    desc:
      "Your ranking is held up by proximity alone. You win where you sit and lose everywhere else, which means Google has little else to go on — thin categories, few reviews, weak relevance for the term.",
  },
  {
    title: "Strong one way, weak the other",
    desc:
      "Usually a competitor, not a mistake. A well-optimised rival on one side absorbs the Map Pack in their half of the grid, and the boundary between your green and their territory sits where the two of you meet.",
  },
  {
    title: "A hard edge, not a fade",
    desc:
      "Rankings that drop from top 3 to not-found across two adjacent points mean you are on the boundary of the area Google considers you relevant to. Widening that boundary is a content and category problem, not a distance problem.",
  },
  {
    title: "Patchy green with no pattern",
    desc:
      "Often a sign the term is volatile or the area is crowded — many businesses of similar strength trading places. Re-run the grid and compare before acting on any single point.",
  },
];

/**
 * Grid sizes, searches and credits. searches = size²; credits = 1 for the scan
 * plus 1 per 8 points, so 1 + ceil(size²/8).
 */
export type GridRow = { grid: string; searches: string; credits: string; use: string };

export const GRID_ROWS: GridRow[] = [
  { grid: "3 × 3", searches: "9", credits: "3", use: "A first look at one neighbourhood" },
  { grid: "5 × 5", searches: "25", credits: "5", use: "A suburb or a small town" },
  { grid: "7 × 7", searches: "49", credits: "8", use: "A few suburbs, or a tight service area" },
  { grid: "11 × 11", searches: "121", credits: "17", use: "A city. The usual choice for real detail" },
  { grid: "15 × 15", searches: "225", credits: "30", use: "A metro area with fine spacing" },
  { grid: "21 × 21", searches: "441", credits: "57", use: "The widest scan, for a whole region" },
];

export type WhyCallout = { title: string; desc: string; img?: string; alt?: string };

export const WHY_CALLOUTS: WhyCallout[] = [
  {
    title: "Proximity Is A Ranking Factor",
    desc:
      "Google Maps weighs how close the searcher is to each business. That makes distance part of the ranking itself, so your position is not one value — it is a different value at every point on the map.",
    img: "/serp-image/globes.png",
    alt: "local search grid tool — proximity changes Google Maps rankings by location",
  },
  {
    title: "One Number Averages Away The Answer",
    desc:
      "A single reported position hides whether you are strong across a city or strong only outside your own door. Those two businesses have the same average rank and completely different problems.",
    img: "/serp-image/bars-sort.png",
    alt: "google maps seo grid — a single rank average hides where visibility fails",
  },
  {
    title: "The Edges Are The Useful Part",
    desc:
      "The interesting thing a grid shows is not the middle, where you were always going to rank. It is the line where you drop out of the top 3 — because that line is what you are trying to push outward.",
    img: "/serp-image/bullseye-arrow.png",
    alt: "gmb heat map tracker — the boundary where top-3 visibility ends",
  },
];

export type UseCase = { title: string; desc: string; img?: string; alt?: string };

export const USE_CASES: UseCase[] = [
  {
    title: "Service-Area Businesses",
    desc:
      "Plumbers, locksmiths, mobile mechanics — trades with no useful shopfront but a real radius. The grid tells you which parts of the patch you are actually winning, and which postcodes you are paying to advertise into blind.",
    img: "/serp-image/home.png",
    alt: "local search grid tracking — for service-area businesses",
  },
  {
    title: "Local SEO Agencies",
    desc:
      "A grid is the single most persuasive thing you can put in front of a local client. Run one before the engagement, run the same grid after, and the green spreading outward is the whole case for your retainer in one picture.",
    img: "/serp-image/briefcase.png",
    alt: "local seo grid tool — for local SEO agencies",
  },
  {
    title: "Multi-Location Brands",
    desc:
      "Scan each branch on its own grid and compare the shapes. Branches with the same rating and review count often have very different coverage, and the grid shows which ones are being boxed in by a neighbouring competitor.",
    img: "/serp-image/user.png",
    alt: "google maps grid rank tracker — for multi-location brands",
  },
];

export type FAQ = { q: string; a: string };

export const FAQ_ITEMS: FAQ[] = [
  {
    q: "What is a local search grid tool?",
    a: "A local search grid tool runs the same Google Maps search from many coordinates laid out in a grid around a business, then colours each point by the position it found. Instead of one ranking number, you get a map of your visibility — where you hold the Map Pack, where you slip to the second screen, and where you disappear entirely.",
  },
  {
    q: "Why does my Google Maps ranking change from point to point?",
    a: "Because proximity is part of how Google Maps ranks. The closer a searcher is to a business, the stronger that business's case for being shown, so the same keyword returns a different order a mile down the road. A grid measures that variation directly rather than trying to average it away.",
  },
  {
    q: "What grid sizes can I run?",
    a: "3×3, 5×5, 7×7, 9×9, 11×11, 13×13, 15×15, 17×17 and 21×21. You set the radius separately, and the spacing between points is derived from the two — points must end up at least 50 metres apart. A single scan is capped at 900 searches in total, and keywords multiply that, so a 21×21 fits one keyword comfortably and two at a squeeze.",
  },
  {
    q: "How much does a grid scan cost?",
    a: "One credit for the scan plus one credit per 8 grid points. A 3×3 is 3 credits, a 5×5 is 5, a 7×7 is 8, an 11×11 is 17 and a 21×21 is 57. The free plan includes 100 credits a month with no credit card, and points that fail are refunded automatically when the scan settles.",
  },
  {
    q: "What grid size should I actually use?",
    a: "Start with a 3×3 over a wide radius to see the shape of the area cheaply, then go finer where it looks interesting. An 11×11 is the usual choice once you know the scan is worth paying for — big enough to show a boundary clearly without the cost of a 21×21. A large grid over a tiny radius is the common mistake: dozens of searches inside a few streets, all returning the same thing.",
  },
  {
    q: "Is the heatmap based on real searches or estimates?",
    a: "Real searches. Each point is one live Google Maps query run at those exact coordinates, and the top 20 businesses it returns are recorded. Nothing is interpolated between points and nothing is modelled — a colour on the map is a search that actually ran.",
  },
  {
    q: "Can I see which competitors are taking my spots?",
    a: "Yes. Because every point records the top 20, the scan can tell you which businesses outranked you, at how many points each one did it, and what share of the top-3 positions across the grid they hold. That is usually the fastest route to knowing why one side of your grid is weak.",
  },
  {
    q: "Can the grid tell me which direction I'm weak in?",
    a: "The map shows it, and the optional AI analysis says it in words — it reads the scan and reports things like which quadrant is weakest and roughly what distance you stop appearing at. The grid itself is the evidence; the AI read-out is there so you do not have to interpret the pattern yourself.",
  },
  {
    q: "How often should I re-run a grid?",
    a: "Monthly for most businesses, or before and after a specific piece of work — new categories, a batch of reviews, a service page. Every scan is saved, so re-running the same grid gives you two pictures to compare rather than two numbers. Maps rankings move slowly enough that weekly grids mostly spend credits.",
  },
  {
    q: "How is this different from the Google Maps rank tracker?",
    a: "Same underlying scan, different question. The Google Maps rank tracker is for checking where your Google Business Profile ranks for a keyword and watching that position over time. This page is about the grid itself — the spread of positions across an area and the shape they make. If you want a position and a trend, start with the rank tracker; if you want to know which parts of your area you own, start here.",
  },
];

const PAGE_URL = "https://freeserp.com/local-search-grid";

export const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://freeserp.com/" },
    { "@type": "ListItem", position: 2, name: "Local Search Grid Tool", item: PAGE_URL },
  ],
};

export const SOFTWARE_APP_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "FreeSERP Local Search Grid Tool",
  description:
    "Local search grid tool for Google Maps. Run the same search from every point on a geographic grid, see your Map Pack position at each coordinate as a heatmap, and find the neighbourhoods where your visibility drops away.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  url: PAGE_URL,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "100 free credits every month. No credit card required.",
  },
  featureList: [
    "Point-by-point Google Maps geo-grid",
    "Grid sizes from 3x3 to 21x21",
    "Configurable radius and derived point spacing",
    "Heatmap of Map Pack position at every coordinate",
    "Six rank bands from top 3 to not found",
    "Top 20 businesses recorded at every point",
    "Draggable grid centre",
    "Competitor share of top-3 positions across the grid",
    "Saved scans for grid-to-grid comparison",
    "Optional AI analysis of weak directions and drop-off distance",
    "CSV export",
  ],
};

export const HOWTO_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to run a local search grid on Google Maps",
  description:
    "Run the same Google Maps search from every point on a geographic grid around a business and read the result as a heatmap, with the FreeSERP local search grid tool.",
  totalTime: "PT5M",
  step: STEPS.map((s, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: s.title,
    text: s.desc,
  })),
};

export const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};
