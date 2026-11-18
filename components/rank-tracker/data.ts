export type WhyCallout = { title: string; desc: string; img?: string; alt?: string };

export const WHY_CALLOUTS: WhyCallout[] = [
  {
    title: "Positions Without Personalization",
    desc: "Your own browser history and Google account nudge your pages upward, so every manual search flatters you. The rank tracker queries from a clean, neutral server, so the position it records is the one a new searcher would actually see.",
    img: "/serp-image/eye.png",
    alt: "rank-tracker — depersonalized keyword positions, free of browser bias",
  },
  {
    title: "Local Tracking by Country and City",
    desc: "The same keyword can rank on page 1 in one market and page 3 in another. Run one-off checks for any supported country, and set a tracking project to a specific city when you need to follow local rankings where your customers search.",
    img: "/serp-image/globes.png",
    alt: "rank-tracker — local rank tracking by country and city",
  },
  {
    title: "Desktop and Mobile, Tracked Separately",
    desc: "Google builds a different results page for phones and desktops, so one keyword can hold two different positions. Tracking both shows which device is costing you clicks.",
    img: "/serp-image/layers.png",
    alt: "rank-tracker — separate mobile and desktop rank tracking",
  },
  {
    title: "Top 100 Positions and SERP Features",
    desc: "Manual checking stops at page 1. The tracker records where you sit in the top 100, which URL is ranking, and which SERP features appear for the keyword, so you know how far you have to climb and what you are competing with.",
    img: "/serp-image/bars-sort.png",
    alt: "rank-tracker — top 100 positions, ranking URL and SERP features",
  },
  {
    title: "Ranking History and Alerts",
    desc: "One check is a snapshot; tracking is a trend. Saved projects keep a position history for every keyword and can alert you when a keyword moves sharply or drops off page 1, so a slide never goes unnoticed for weeks.",
    img: "/serp-image/pending.png",
    alt: "rank-tracker — keyword position history and rank-change alerts",
  },
];

export type UseCase = { title: string; desc: string; img?: string; alt?: string };

export const USE_CASES: UseCase[] = [
  {
    title: "Solo SEOs and Freelancers",
    desc: "Keep a running record of every client keyword without paying for an enterprise suite. Export rankings as a PDF or CSV and drop them straight into your monthly report, with position changes already laid out.",
    img: "/serp-image/user.png",
    alt: "rank-tracker — for solo SEOs and freelancers",
  },
  {
    title: "Small Business Owners",
    desc: "Watch the handful of searches that bring in customers and see whether they are moving up or down each week. No complicated setup — just your real position, not the inflated one your own browser shows you.",
    img: "/serp-image/home.png",
    alt: "rank-tracker — for small business owners",
  },
  {
    title: "Agencies Managing Many Sites",
    desc: "Give every client its own project with its own country, city and device targeting. Pull a live rank snapshot in seconds during a sales call, then share a read-only link once the retainer starts.",
    img: "/serp-image/briefcase.png",
    alt: "rank-tracker — for agencies tracking rankings across clients",
  },
  {
    title: "Local and Multi-Location Businesses",
    desc: "Rankings for \"near me\" style searches change from city to city. Track each location's target keywords in the market it serves so you can see which branch is winning locally and which needs work.",
    img: "/serp-image/bullseye-arrow.png",
    alt: "rank-tracker — local rank tracking for multi-location businesses",
  },
  {
    title: "Content and Editorial Teams",
    desc: "See whether a new article, a refresh or a rewrite actually moved the needle. Position history shows the before and after for every keyword the page targets, and the ranking URL shows which page Google prefers.",
    img: "/serp-image/layers.png",
    alt: "rank-tracker — for content teams measuring the impact of updates",
  },
  {
    title: "In-House SEO Teams",
    desc: "Track your own keywords alongside the competitors you lose to, spot SERP feature changes early, and catch ranking drops after an algorithm update before they show up as lost traffic.",
    img: "/serp-image/trophy.png",
    alt: "rank-tracker — for in-house SEO teams monitoring competitors",
  },
];

export type FAQ = { q: string; a: string };

export const FAQ_ITEMS: FAQ[] = [
  {
    q: "What is rank tracking?",
    a: "Rank tracking is monitoring the positions your pages hold in Google's organic results for the keywords you care about, checked repeatedly over time. A good rank tracker records each position by country, city and device, notes which URL is ranking and which SERP features appear, and keeps a history so you can tie movement to your own changes, competitor activity or algorithm updates.",
  },
  {
    q: "How do I check a keyword's position on Google?",
    a: "Searching yourself is unreliable — even in a private window, Google still tailors results to your location and device, and you can only scan one page at a time. Instead, enter your domain and keyword in the checker above, pick a country and device, and click Check Rankings. You get your exact position in the top 100 from a depersonalized query. To keep watching that keyword, save it to a tracking project.",
  },
  {
    q: "Is the rank tracker really free?",
    a: "Yes — the free plan gives you 100 credits every month with no credit card, and one credit checks one keyword. When you need more, plans start at $19/month for 2,000 credits, and the same balance also pays for site audits, local map grid scans, keyword research and competitor analysis. Saved rank tracking projects are limited to 10 keywords per project on the free plan; paid plans get unlimited keywords per project.",
  },
  {
    q: "How accurate is the rank tracking data?",
    a: "The rank tracker pulls live, depersonalized search results from a clean IP in the location you select. We do not estimate or extrapolate rankings. Every position is a real query the tracker ran at the time of the check.",
  },
  {
    q: "How do I track local keyword rankings?",
    a: "One-off checks run at the country level — choose the market from the location dropdown. For local SEO, create a tracking project and set its location to the city you serve; every check for that project then reflects what searchers in that city see. Use a separate project per location if you serve several cities.",
  },
  {
    q: "Why are my mobile and desktop rankings different?",
    a: "Google builds separate results pages for each device, and mobile pages often show more SERP features and local results above the organic listings. That means the same keyword can sit a few positions apart on mobile and desktop. Toggle the Device button before each check, and track both for any keyword with meaningful mobile traffic.",
  },
  {
    q: "Does the rank tracker show SERP features?",
    a: "Yes. Tracked keywords show which SERP features appear on the results page — such as featured snippets, People Also Ask boxes, local packs or videos — alongside your position and ranking URL. A new feature appearing above you can cut clicks even when your position number does not change, so it is worth watching.",
  },
  {
    q: "How do I track my competitors' rankings?",
    a: "Enter a competitor's domain instead of yours and run the same check — the rank tracker treats any domain the same way. For a fuller picture, use the Competitor Analysis feature to compare their ranking profile against yours and find the keywords they hold that you do not.",
  },
  {
    q: "How often should I track my rankings?",
    a: "For active SEO work, track your priority keywords daily and review the rest weekly. Rankings shift with algorithm updates, competitor changes and your own content edits, and checking once a month hides what actually happened. Tracking projects can run checks automatically on a schedule and alert you when a keyword moves sharply or drops off page 1.",
  },
  {
    q: "Can I build and share ranking reports?",
    a: "Yes. Export tracked rankings to PDF or CSV, or share a read-only link that a client or manager can open without a FreeSERP account. The link stays live, so it always shows the latest positions rather than a stale screenshot.",
  },
  {
    q: "Do you store my rank tracking data?",
    a: "We store the keywords and domains you save to rank tracking projects. We do not sell data, run ads against your usage, or share with third parties. Anonymous one-off rank checks are not logged to your account.",
  },
];

const PAGE_URL = "https://freeserp.com/rank-tracker";

export const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://freeserp.com/" },
    { "@type": "ListItem", position: 2, name: "Free Rank Tracker", item: PAGE_URL },
  ],
};

export const SOFTWARE_APP_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "FreeSERP Free Rank Tracker",
  description:
    "Free rank tracker for monitoring Google keyword positions over time. Track rankings by country, city and device, follow SERP features and competitors, and keep a position history with rank-change alerts.",
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
    "Depersonalized keyword position checks",
    "Country-level checks and city-level tracking projects",
    "Separate mobile and desktop rank tracking",
    "Top 100 positions with ranking URL",
    "SERP feature tracking",
    "Competitor domain rank tracking",
    "Scheduled automatic rank checks with position history",
    "Rank-change alerts",
    "PDF and CSV export and shareable report links",
    "No signup required for one-off checks",
  ],
};

export const HOWTO_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to track keyword rankings with the free rank tracker",
  description:
    "Set up ongoing keyword position tracking for any domain with the FreeSERP free rank tracker.",
  totalTime: "PT5M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Create a project for your domain",
      text: "Add the domain you want to track and set its target country, city and device so every check reflects the market you care about.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Add the keywords to track",
      text: "Add the keywords that bring in customers. The tracker records each keyword's position in the top 100, the ranking URL and the SERP features on the page.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Watch positions move over time",
      text: "Let the tracker re-check your keywords on a schedule, review the position history, and turn on alerts for sharp moves or page-1 drops.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Track competitors who outrank you",
      text: "Run the same checks on competitor domains to see where they rank, how far above you they sit, and which keywords they hold.",
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Run a one-off check anytime",
      text: "Enter any domain and keyword, pick a country and device, and click Check Rankings for an instant, depersonalized position check.",
    },
  ],
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
