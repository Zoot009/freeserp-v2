/**
 * Copy and schema for /local-rank-tracker.
 *
 * Intent: location-specific ORGANIC rankings plus Local Pack visibility. The
 * page is deliberately neither a Maps-only nor a grid-only template — those
 * are /google-maps-rank-tracker and /local-search-grid, and all three link to
 * each other so the boundaries are stated rather than inferred.
 *
 * The publishing gate was "publish ONLY with useful city/postcode organic AND
 * Map Pack workflows". Both exist, and the page is built around them as two
 * named workflows. What the product actually does, verified in the code:
 *
 *   ORGANIC BY CITY / POSTCODE
 *     serp_locations (backend prisma/schema.prisma) stores DataForSEO's
 *     Country | Region | City | Postal Code rows; /api/locations typeaheads
 *     them; serpLocation.service.resolveMarket() turns a pick into a
 *     location_code; keywords.service.addMany() persists it per keyword.
 *     Engines that cannot honour a sub-country code are REFUSED rather than
 *     silently returning the country SERP — see the isSubCountry guard.
 *
 *   MAP PACK
 *     serp/parse.ts sets features.localPack when the SERP contains a
 *     local_pack block, it renders as a "Local pack" chip, reports label it
 *     (reports/report.builder.ts) and alerts fire on it
 *     (notifications/evaluate.ts).
 *
 * The honest limit, and the reason the Maps pages exist: the organic check
 * detects that a Local Pack is PRESENT, not which position you hold inside
 * it. Do not let this copy drift into implying otherwise.
 */

/**
 * Real app capture, the same one /google-maps-rank-tracker and
 * /local-search-grid lead with. Shared, not copied — replacing it replaces it
 * on all three, and a replacement should get a new filename rather than
 * overwrite, since next/image caches by URL.
 */
export const SCAN_SHOT = { src: "/shots/maps/scan-nyc.png", w: 1911, h: 1000 } as const;

export type Step = {
  n: string;
  label: string;
  title: string;
  desc: string;
};

export const STEPS: Step[] = [
  {
    n: "01",
    label: "Add the domain",
    title: "Start a project for the site",
    desc:
      "One project per site you track. Everything below hangs off it — keywords, their markets, the competitors you compare against and the reports you send out.",
  },
  {
    n: "02",
    label: "Pick the market",
    title: "Choose a country, city or postcode",
    desc:
      "Type a place and pick it. Countries, regions, cities and postal codes are all valid markets, and each keyword carries its own — so one project can track a national term and a suburb term side by side.",
  },
  {
    n: "03",
    label: "Set the device",
    title: "Track mobile and desktop apart",
    desc:
      "Local searches skew heavily mobile, and mobile results are not desktop results. Each keyword is tracked on the device you choose, so the two never get averaged into one misleading number.",
  },
  {
    n: "04",
    label: "Watch it move",
    title: "Get positions daily, with the Local Pack flagged",
    desc:
      "Checks run automatically and the history builds. Every result records the position, the ranking URL and which SERP features were present — a Local Pack among them.",
  },
];

/**
 * The two workflows the page exists to describe. This is the section that
 * makes the page distinct from the two Maps pages.
 */
export type Workflow = {
  kicker: string;
  title: string;
  question: string;
  bullets: string[];
};

export const WORKFLOWS: Workflow[] = [
  {
    kicker: "Workflow one",
    title: "Localized organic rankings",
    question: "Where do my pages rank for someone searching in this city?",
    bullets: [
      "Any country, region, city or postal code as the market",
      "Mobile and desktop tracked as separate keywords",
      "Position, ranking URL and movement, checked daily",
      "Full top 100, so you can see page 2 and page 5",
      "Competitors compared in the same market as you",
    ],
  },
  {
    kicker: "Workflow two",
    title: "Map Pack visibility",
    question: "Does this search even show a Map Pack — and did that change?",
    bullets: [
      "Local Pack presence recorded on every check",
      "Shown as a SERP feature beside the position",
      "Alerts when a Local Pack appears or disappears",
      "Labelled in client reports alongside the other features",
      "Your position inside the pack: see the Maps rank tracker",
    ],
  },
];

/** Market granularity, in the order the picker offers it. */
export type Level = { level: string; example: string; use: string };

export const LEVELS: Level[] = [
  { level: "Country", example: "United States", use: "National terms, and the default for most keywords" },
  { level: "Region", example: "Texas, United States", use: "State or county campaigns, multi-city service areas" },
  { level: "City", example: "Austin, Texas, United States", use: "The level most local SEO actually happens at" },
  { level: "Postal Code", example: "78701, Texas, United States", use: "Dense metros where one city is far too coarse" },
];

export type WhyCallout = { title: string; desc: string; img?: string; alt?: string };

export const WHY_CALLOUTS: WhyCallout[] = [
  {
    title: "A National Rank Is The Wrong Answer",
    desc:
      "Tracked at country level, a plumber in Leeds is measured against every plumber in the country. The number moves for reasons that have nothing to do with them, and says nothing about the city they actually sell in.",
    img: "/serp-image/globes.png",
    alt: "local rank tracker — country-level tracking hides city rankings",
  },
  {
    title: "Local Results Are Mostly Mobile",
    desc:
      "Local intent searches happen on phones, and mobile SERPs carry different features, a different Local Pack and often a different order. Tracking desktop only measures the audience you have least of.",
    img: "/serp-image/layers.png",
    alt: "local seo rank tracker — mobile and desktop local rankings differ",
  },
  {
    title: "Nothing Is Quietly Substituted",
    desc:
      "If a search engine cannot honour a city-level request, FreeSERP refuses the keyword and says so. It will not hand back the country's results filed under the city's name — the failure mode that makes a local rank checker worse than useless.",
    img: "/serp-image/eye.png",
    alt: "local ranking checker — city requests are never silently downgraded to country",
  },
];

export type UseCase = { title: string; desc: string; img?: string; alt?: string };

export const USE_CASES: UseCase[] = [
  {
    title: "Single-Location Businesses",
    desc:
      "A restaurant, clinic or shop with one address and one town that matters. Track the handful of terms that bring people through the door, in the city they are searched from, on the device they are searched on.",
    img: "/serp-image/home.png",
    alt: "local rank checker — for single-location businesses",
  },
  {
    title: "Local SEO Agencies",
    desc:
      "Every client in their own market, in one place. City-level tracking is also the difference between a report that shows real movement and one that shows national noise the client cannot act on.",
    img: "/serp-image/briefcase.png",
    alt: "google local rank tracker — for local SEO agencies",
  },
  {
    title: "Multi-City Service Brands",
    desc:
      "The same landing page competing in a dozen towns. Track the term once per city and the gaps become obvious — the cities where the page ranks, and the ones where it never did.",
    img: "/serp-image/user.png",
    alt: "local search rank tracker — for multi-city service brands",
  },
];

export type FAQ = { q: string; a: string };

export const FAQ_ITEMS: FAQ[] = [
  {
    q: "What is a local rank tracker?",
    a: "A local rank tracker records where a site ranks for a keyword as searched from a specific place, rather than nationally. You pick the market — a country, a region, a city or a postal code — and every check returns the results a searcher in that market would actually be shown, including whether a Local Pack appeared.",
  },
  {
    q: "Can I track rankings by city or postcode?",
    a: "Yes. Start typing a place in the location picker and pick from the list; cities, regions and postal codes are all valid markets alongside countries. Each keyword stores its own market, so one project can track a national term, a city term and a postcode term at the same time.",
  },
  {
    q: "Does it track the Map Pack as well as organic results?",
    a: "It records whether a Local Pack was present on the search, shows that beside the position as a SERP feature, labels it in reports and can alert you when it appears or disappears. For your position inside the pack — which business sits first, second and third, and how that changes across an area — use the Google Maps rank tracker or the local search grid, which query Maps directly.",
  },
  {
    q: "What happens if a search engine can't target a city?",
    a: "The keyword is refused, with a message telling you to pick a country or track that city on Google instead. This matters more than it sounds: an engine handed a city code it does not support returns the country's results, and a tracker that stored those as the city's ranking would give you numbers that are all plausible and all wrong.",
  },
  {
    q: "Are mobile and desktop tracked separately?",
    a: "Yes, and for local terms you should use both. Each keyword is tracked on the device you pick, so the same term in the same city can be two keywords. Mobile and desktop local results commonly differ by several positions and do not always carry the same Local Pack.",
  },
  {
    q: "Is there a free local rank checker?",
    a: "The free plan includes 100 credits a month with no credit card, and one credit is one keyword check. That is enough to track a small local keyword set and watch it move. Paid plans start at $19/month for 2,000 credits, and the same balance covers site audits, Maps grid scans and keyword research too.",
  },
  {
    q: "How often are local rankings checked?",
    a: "Tracked keywords are checked daily. You can also run a one-off check whenever you want a reading immediately, and every check is stored so the history builds into a trend rather than a snapshot.",
  },
  {
    q: "Can I see which competitors rank above me locally?",
    a: "Yes. Because every check captures the full top 100 for that market, you get the sites above you in the city you care about — not the national leaders who may not compete with you locally at all.",
  },
  {
    q: "How is this different from the Google Maps rank tracker?",
    a: "This page is about the ordinary Google results page as seen from a place: your organic positions there, and whether a Local Pack showed up on it. The Google Maps rank tracker is about Maps itself — which position your Google Business Profile holds, checked from coordinates around your business. Most local businesses need both, because customers use both.",
  },
];

const PAGE_URL = "https://freeserp.com/local-rank-tracker";

export const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://freeserp.com/" },
    { "@type": "ListItem", position: 2, name: "Local Rank Tracker", item: PAGE_URL },
  ],
};

export const SOFTWARE_APP_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "FreeSERP Local Rank Tracker",
  description:
    "Local rank tracker for Google. Track keyword positions by country, region, city or postal code, on mobile and desktop, and see when a search returns a Local Pack.",
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
    "Localized organic rank tracking by city and postal code",
    "Country, region, city and postal code markets",
    "Local Pack presence detected on every check",
    "Alerts when a Local Pack appears or disappears",
    "Separate mobile and desktop tracking",
    "Daily automated checks with position history",
    "Full top 100 results per check",
    "Local competitor comparison in the same market",
    "Client-ready reports and CSV export",
  ],
};

export const HOWTO_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to track local keyword rankings by city",
  description:
    "Track where a site ranks for a keyword as searched from a specific city or postcode, and see whether the search returns a Local Pack, with the FreeSERP local rank tracker.",
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
