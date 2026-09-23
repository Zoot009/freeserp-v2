/**
 * Copy and schema for /google-maps-rank-tracker.
 *
 * The page owns the Maps / Google Business Profile *rank check and rank
 * tracking* intent — "google maps rank tracker", "gmb rank checker",
 * "google places ranking checker" and the rest of that family. It deliberately
 * does NOT chase "local rank grid" or grid-first queries: those are broader,
 * and the geo-grid is described here as the mechanism the tracker runs on,
 * linked rather than owned.
 *
 * Every number below is the product's real behaviour, not marketing rounding:
 *   - grid sizes and the 900-search / 50 m spacing caps come from
 *     freeserp-frontend-v2/components/maps-tracker/grid.ts
 *   - the credit maths (1 per scan + 1 per 8 points) comes from
 *     freeserp-backend-v2/src/modules/credits/catalog.ts
 *   - SoLV / ARP / ATRP are the three headline metrics the scan page shows
 * Keep them in step when the product changes.
 */

/**
 * The two product screenshots on this page, in one place so replacing an image
 * is a path + dimension change here rather than a hunt through components.
 *
 * Both are real captures from the app on a demo business (Carlo's Bakery).
 * REPLACE-ME: `report` was taken before the report header's "F" placeholder
 * became the real logo, so it still shows the old mark.
 *
 * When you replace one, give the file a NEW name rather than overwriting the
 * old one. next/image serves these through /_next/image?url=…, which browsers
 * and the CDN cache by URL — overwrite in place and visitors keep seeing the
 * previous picture long after the deploy. Update `w`/`h` to the new file's
 * real pixel size too: next/image reserves space from them, so a stale pair
 * makes the layout jump as the image loads.
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
    label: "Pick the business",
    title: "Find your Google Business Profile",
    desc:
      "Search Google Places for your business and pick the listing. The tracker stores its place ID and CID, so every rank check matches the exact profile — not a similarly named business two streets over.",
  },
  {
    n: "02",
    label: "Add keywords",
    title: "Add up to 10 keywords per scan",
    desc:
      "Enter the searches your customers actually type — \"emergency plumber\", \"dentist near me\", \"coffee shop downtown\". Each keyword is checked at every point on the map in the same run.",
  },
  {
    n: "03",
    label: "Set the area",
    title: "Choose how far around you to check",
    desc:
      "Set a radius and a grid from 3×3 up to 21×21. The tracker turns that into real search points across your service area, so you see where your ranking holds and where it falls away.",
  },
  {
    n: "04",
    label: "Read and re-scan",
    title: "Get your Map Pack position, then track it",
    desc:
      "Every point returns a live Google Maps position plus the 20 businesses ranked around you. Re-scan any time — each scan is saved, so you can compare this week's Maps ranking against last month's.",
  },
];

export type WhyCallout = { title: string; desc: string; img?: string; alt?: string };

export const WHY_CALLOUTS: WhyCallout[] = [
  {
    title: "Your Own Search Is The Worst Test",
    desc:
      "Searching your business name from your own phone, in your own shop, signed into your own Google account, shows you at the top almost every time. It is the one location and one account where you are guaranteed to look good.",
    img: "/serp-image/eye.png",
    alt: "google maps rank tracker — why checking your own Maps ranking manually is misleading",
  },
  {
    title: "Maps Rankings Change Street By Street",
    desc:
      "Google Maps ranks on proximity, so a business can sit at #1 outside its own door and vanish from the Map Pack a mile away. One position number cannot describe a Maps ranking — you need to know where it applies.",
    img: "/serp-image/globes.png",
    alt: "google maps ranking checker — Map Pack positions change by location",
  },
  {
    title: "The Map Pack Only Shows Three",
    desc:
      "Google shows three businesses before anyone taps \"More places\". The rank checker records the top 20 at every point, so you can see who is holding those three slots and how far outside them you are.",
    img: "/serp-image/bars-sort.png",
    alt: "gmb rank checker — top 20 Google Maps results captured at every point",
  },
];

/**
 * The three headline metrics, rendered as a stat row rather than cards — they
 * are the three numbers the scan page itself leads with, and the section's
 * sub-copy promises exactly three.
 */
export type HeadlineMetric = { acronym: string; title: string; desc: string };

export const HEADLINE_METRICS: HeadlineMetric[] = [
  {
    acronym: "SoLV",
    title: "Share of Local Voice",
    desc:
      "The share of checked locations where you land in the top 3. The number that maps most closely to calls and direction requests, because the top 3 is the Map Pack.",
  },
  {
    acronym: "ARP",
    title: "Average Rank Position",
    desc:
      "Your average Google Maps position across the points where you were found at all. How strong your ranking is inside the area you already compete in.",
  },
  {
    acronym: "ATRP",
    title: "Average Total Rank Position",
    desc:
      "The same average, counting every point, with places you never appeared scored as worse than 20th. ARP flatters a business that ranks well in a tiny pocket; ATRP does not.",
  },
];

export type Metric = { title: string; desc: string; img?: string; alt?: string };

export const METRICS: Metric[] = [
  {
    title: "The competitors beating you",
    desc:
      "Every business that outranked you, and at how many locations. You see the names taking your Map Pack slots, their ratings and review counts, not just that you slipped.",
    img: "/serp-image/trophy.png",
    alt: "google maps rank checker — competitors outranking your business",
  },
  {
    title: "Scan history you can compare",
    desc:
      "Each scan is stored against the business, so Google Maps rank tracking is just re-running it. Compare any two scans to see which keywords and which parts of your area moved.",
    img: "/serp-image/pending.png",
    alt: "google maps rank tracking — compare scans over time",
  },
  {
    title: "AI read-out and CSV export",
    desc:
      "Tick AI analysis and get a written diagnosis of where your ranking breaks down and why. Export any scan to CSV for a client report or your own spreadsheet.",
    img: "/serp-image/sparkles.png",
    alt: "google maps rank tracker — AI analysis and CSV export",
  },
];

export type UseCase = { title: string; desc: string; img?: string; alt?: string };

export const USE_CASES: UseCase[] = [
  {
    title: "Local Business Owners",
    desc:
      "Find out whether people two suburbs away can actually find you on Google Maps. Check your Google Business Profile ranking for the searches that bring in calls, and watch it after you add photos, categories or reviews.",
    img: "/serp-image/home.png",
    alt: "google my business rank checker — for local business owners",
  },
  {
    title: "Local SEO Freelancers",
    desc:
      "A GMB rank checker you can run before a pitch and again after the work lands. Show the client a before-and-after Maps ranking they can read in seconds, and export it straight into the monthly report.",
    img: "/serp-image/user.png",
    alt: "gmb rank tracker — for local SEO freelancers",
  },
  {
    title: "Multi-Location Brands",
    desc:
      "Track every branch as its own business, each with its own keywords and its own service area. One place to compare which locations are winning the Map Pack and which are invisible outside their own car park.",
    img: "/serp-image/briefcase.png",
    alt: "google places rank tracker software — for multi-location brands",
  },
];

export type FAQ = { q: string; a: string };

export const FAQ_ITEMS: FAQ[] = [
  {
    q: "What is a Google Maps rank tracker?",
    a: "A Google Maps rank tracker checks where a Google Business Profile ranks in Google Maps for a given keyword and a given location, and keeps checking it over time. Unlike a normal rank checker, it cannot return a single position, because Maps results depend on where the searcher is standing. So a Maps rank checker runs the same search from many points around your business and reports the position at each one.",
  },
  {
    q: "How is this different from searching my business on Google Maps myself?",
    a: "Your own search is personalised by your location, your Google account and your search history — and you are almost always searching from inside or near your own business, which is the single best position you have. The rank checker runs each search from a clean, signed-out query at a specific set of coordinates, so the position it reports is the one a stranger in that spot would see.",
  },
  {
    q: "Can I check my Google Business Profile ranking for free?",
    a: "Yes. The free plan gives you 100 credits every month with no credit card. A Maps scan costs 1 credit for the scan plus 1 credit per 8 search points, so a 3×3 scan is 3 credits and a 5×5 is 5 — enough to run a free GMB rank check regularly. Paid plans start at $19/month for 2,000 credits, and the same balance also pays for rank tracking, site audits and keyword research.",
  },
  {
    q: "How many keywords can I track per business?",
    a: "Up to 10 keywords in a single scan, and every keyword is checked at every point in the area you set. You can create as many scans as your credits allow, so there is no hard cap on the keywords you track for a business over time.",
  },
  {
    q: "How big an area can the Google Maps rank checker cover?",
    a: "You choose a radius and a grid between 3×3 and 21×21. Points must be at least 50 metres apart and a single scan is capped at 900 searches in total, keywords included. A 3×3 over a mile and a half gives you a fast read on a neighbourhood; an 11×11 is the usual choice when you want detail across a city.",
  },
  {
    q: "How much does a Google Maps rank check cost in credits?",
    a: "One credit for the scan, plus one credit per 8 grid points. That works out at 3 credits for a 3×3, 5 for a 5×5, 8 for a 7×7, 17 for an 11×11 and 57 for a 21×21. Points that fail are refunded automatically when the scan settles, so you only pay for searches that actually returned a result.",
  },
  {
    q: "Does it show which competitors outrank me?",
    a: "Yes. At every point the tracker records the top 20 businesses, so you get the full list of competitors ranking above you, how many locations each one beat you at, and their rating and review count. That is usually more actionable than your own position, because it tells you exactly who you have to displace.",
  },
  {
    q: "How often should I track Google Maps rankings?",
    a: "Monthly is enough for a stable business, weekly while you are actively working on a profile — adding categories, services, photos, posts or chasing reviews. Maps rankings move more slowly than web rankings, so daily scanning mostly burns credits without telling you anything new.",
  },
  {
    q: "Do I need to connect my Google Business Profile account?",
    a: "No. The tracker finds your business through Google Places, the same public data a customer sees, so you can check any business — yours or a competitor's — without owning or connecting the listing.",
  },
  {
    q: "Is this the same as a local rank grid tool?",
    a: "The geo-grid is how the check is run, not what the page is about. FreeSERP uses a grid of search points because that is the only honest way to measure a Maps ranking, and you see that grid in the results. But what you are buying is the rank check and the tracking over time — the grid is the instrument, not the report.",
  },
];

const PAGE_URL = "https://freeserp.com/google-maps-rank-tracker";

export const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://freeserp.com/" },
    { "@type": "ListItem", position: 2, name: "Google Maps Rank Tracker", item: PAGE_URL },
  ],
};

export const SOFTWARE_APP_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "FreeSERP Google Maps Rank Tracker",
  description:
    "Google Maps rank tracker and rank checker. Check Google Maps and Google Business Profile positions by keyword and location, see the competitors holding the Map Pack, and track how your local rankings move over time.",
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
    "Google Maps rank checking by keyword and location",
    "Google Business Profile and Google Places rank tracking",
    "Map Pack top 3 share of local voice (SoLV)",
    "Average rank position (ARP) and average total rank position (ATRP)",
    "Top 20 competitors recorded at every search point",
    "Up to 10 keywords per scan",
    "Configurable area from 3x3 to 21x21 search points",
    "Saved scan history for tracking rankings over time",
    "Optional AI analysis of local visibility",
    "CSV export",
  ],
};

export const HOWTO_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to check your Google Maps ranking",
  description:
    "Check where your Google Business Profile ranks in Google Maps for any keyword, across your whole service area, with the FreeSERP Google Maps rank tracker.",
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
