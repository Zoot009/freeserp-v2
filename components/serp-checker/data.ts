export const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "India",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Netherlands",
  "Brazil",
  "Mexico",
  "Japan",
  "South Korea",
  "Singapore",
  "United Arab Emirates",
  "South Africa",
  "Nigeria",
];

// `img` is optional — bullets with one show the icon in place of the number
// badge. `alt` must begin with "serp-checker" followed by a feature phrase.
export type ReportBullet = {
  n: string;
  title: string;
  desc: string;
  img?: string;
  alt?: string;
};

export const REPORT_BULLETS: ReportBullet[] = [
  { n: "01", title: "Your Exact Ranking Position", desc: "Get your exact ranking position in Google's top 100, with the ranking URL highlighted.", img: "/serp-image/bullseye-arrow.png", alt: "serp-checker — your exact Google ranking position" },
  { n: "02", title: "Top 10 Competitors",          desc: "Check the top 10 competitors ranking above you and their page titles.", img: "/serp-image/trophy.png", alt: "serp-checker — top 10 competitors ranking above you" },
  { n: "03", title: "SERP Features Present",       desc: "Featured snippets, PAA boxes, image carousels, video, local pack, and ads — all detected automatically.", img: "/serp-image/layers.png", alt: "serp-checker — SERP features detected automatically" },
  { n: "04", title: "Historical Position",         desc: "Track historical position information for any keyword you've saved — free accounts get 30 days of history.", img: "/serp-image/pending.png", alt: "serp-checker — historical ranking position over time" },
  { n: "05", title: "Improve Rank Feature",        desc: "Analyze your competitors' ranking pages and get customized AI plans to improve your SERP ranking.", img: "/serp-image/sparkles.png", alt: "serp-checker — AI plans to improve your SERP ranking" },
];

// `img`/`alt` are optional — callouts with an image show the icon to the
// left of the text. `alt` must begin with "serp-checker".
export type WhyCallout = {
  title: string;
  desc: string;
  img?: string;
  alt?: string;
};

export const WHY_CALLOUTS: WhyCallout[] = [
  { title: "Personalization Distorts Rank", desc: "Your browser history and Google account push your own pages higher than they actually rank.", img: "/serp-image/eye.png", alt: "serp-checker — personalization distorts your Google rank" },
  { title: "Geo-Bias Is Invisible",         desc: "Searching from Mumbai shows different results than searching from London — even for the same keyword.", img: "/serp-image/globes.png", alt: "serp-checker — geo-bias makes rankings differ by country" },
  { title: "Top 100, Not Top 10",           desc: "Manual checking stops at page 1. A checker shows you exactly where in the top 100 you sit.", img: "/serp-image/bars-sort.png", alt: "serp-checker — full top 100 ranking results, not just the top 10" },
];

export type CompareRow = { feature: string; ours: string; mid: string; light: string };
export const COMPARE_ROWS: CompareRow[] = [
  { feature: "Live SERP check",            ours: "Free, unlimited",         mid: "$99–$249/mo", light: "Free, limited per day" },
  { feature: "Top 100 results",            ours: "Yes",                     mid: "Yes",         light: "Top 50" },
  { feature: "Country + device targeting", ours: "Yes",                     mid: "Yes",         light: "Limited" },
  { feature: "Saved keyword tracking",     ours: "10 free, unlimited paid", mid: "500–10,000",  light: "25 free" },
  { feature: "Competitor crawl",           ours: "Yes (free)",              mid: "Yes (paid)",  light: "No" },
  { feature: "AI recommendations",         ours: "Yes (free)",              mid: "No",          light: "No" },
  { feature: "Signup required",            ours: "No",                      mid: "Yes",         light: "Optional" },
];

export type Step = {
  n: string;
  label: string;
  route: string;
  title: string;
  src: string;
  alt: string;
  w: number;
  h: number;
};

export const STEPS: Step[] = [
  {
    n: "01",
    label: "Create project",
    route: "/dashboard/projects",
    title: "Create a project for the domain you want to track",    
    src: "/serp-checker/step-1-create-project.png",
    alt: "FreeSERP serp-checker step 1 — creating a new project to track a domain across Google rankings",
    w: 1440,
    h: 751,
  },
  {
    n: "02",
    label: "Track keywords",
    route: "/dashboard/keywords",
    title: "Watch your keywords ranked, ranked daily",    
    src: "/serp-checker/step-2-track-keywords.png",
    alt: "FreeSERP serp-checker step 2 — tracked keywords table with positions, change deltas, volume and SERP features",
    w: 1438,
    h: 752,
  },
  {
    n: "03",
    label: "Spy on competitors",
    route: "/dashboard/competitor-analysis",
    title: "Spy on competitors who outrank you",    
    src: "/serp-checker/step-3-competitor-spy.png",
    alt: "FreeSERP serp-checker step 3 — competitor spy dashboard showing shared keywords, content gaps and competing domains",
    w: 1436,
    h: 751,
  },
  {
    n: "04",
    label: "One-off check",
    route: "/serp-checker",
    title: "Run a one-off SERP check, anytime",    
    src: "/serp-checker/step-4-run-serp-check.png",
    alt: "FreeSERP serp-checker step 4 — one-off SERP Checker tool with domain, keyword, country and device inputs",
    w: 1430,
    h: 749,
  },
  {
    n: "05",
    label: "Catch movements",
    route: "/dashboard",
    title: "Catch every movement before your client does",    
    src: "/serp-checker/step-5-monitor-movements.png",
    alt: "FreeSERP serp-checker step 5 — latest movements feed with biggest rank gains and drops over 24 hours",
    w: 1431,
    h: 747,
  },
];

// `img`/`alt` are optional — use cases with an image show the icon instead
// of the default sparkle. `alt` must begin with "serp-checker".
export type UseCase = {
  title: string;
  desc: string;
  img?: string;
  alt?: string;
};

export const USE_CASES: UseCase[] = [
  { title: "Solo SEOs & Freelancers",  desc: "Track 5–20 client keywords without an Ahrefs or Semrush subscription. Export rankings as a PDF or CSV to send with monthly reports.", img: "/serp-image/user.png", alt: "serp-checker — for solo SEOs and freelancers" },
  { title: "Small Business Owners",    desc: "See where you actually rank for the searches that matter to your business and check them daily without learning a complicated SEO tool.", img: "/serp-image/home.png", alt: "serp-checker — for small business owners" },
  { title: "Agencies Running Audits",  desc: "Pull a SERP snapshot in 10 seconds during a sales call. Show prospects their current rank live, then upsell the implementation work.", img: "/serp-image/briefcase.png", alt: "serp-checker — for agencies running SEO audits" },
];

export const FAQ_ITEMS = [
  {
    q: "Is the Free SERP checker really free?",
    a: "Yes — unlimited keyword checks with no credit card, no trial, and no rate limit on manual checks. Saved tracking projects are limited to 10 keywords per project on the free plan; paid plans get unlimited keywords per project.",
  },
  {
    q: "How accurate is the rank data?",
    a: "We pull live, depersonalized Google results from a clean IP in the country you select. Accuracy matches paid tools like Ahrefs and Semrush for the top 100 positions. We do not estimate or extrapolate — every position is a real query we ran when you clicked the button.",
  },
  {
    q: "Can I check rankings for any country?",
    a: "Pick from the supported countries in the location dropdown. Rankings are pulled at the country level, so every check returns the live Google results for the country you select. We don't currently offer city-level targeting.",
  },
  {
    q: "Does it check mobile and desktop separately?",
    a: "Yes — toggle the Device button before running the check. Mobile and desktop rankings often differ by 2–5 positions, so checking both matters for any keyword with significant mobile search volume.",
  },
  {
    q: "How often should I check my rankings?",
    a: "For active SEO work, daily for 5–10 priority keywords and weekly for the rest. Google rankings shift daily because of algorithm updates, competitor activity, and personalization — checking once a month hides what's actually happening.",
  },
  {
    q: "Can I track competitors with this tool?",
    a: "Yes — enter their domain instead of yours, or use the Competitor Analysis feature to crawl their entire site and compare it against your ranking page.",
  },
  {
    q: "Why am I ranking lower than I expected?",
    a: "The most common reasons are weak internal linking to the page, thin content compared to top-ranking pages, slow page speed, or mismatched search intent. Run the AI Recommendation Plan after a check — it diagnoses which of these is hurting you most.",
  },
  {
    q: "Do you store my data?",
    a: "We store the keywords and domains you save to projects. We do not sell data, run ads against your usage, or share with third parties. Anonymous one-off checks aren't logged to your account.",
  },
];

const PAGE_URL = "https://freeserp.com/serp-checker";

export const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://freeserp.com/" },
    { "@type": "ListItem", position: 2, name: "Free SERP Checker", item: PAGE_URL },
  ],
};

export const SOFTWARE_APP_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "FreeSERP — Free SERP Checker",
  description:
    "Free SERP checker that tracks Google rankings in real time for any keyword, domain, country, and device.",
  applicationCategory: "BrowserApplication",
  operatingSystem: "Any",
  url: PAGE_URL,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export const HOWTO_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to check your Google ranking with FreeSERP",
  description: "Check the live Google rank of any domain for any keyword in under 10 seconds.",
  step: [
    { "@type": "HowToStep", position: 1, name: "Enter your domain",       text: "Type the domain you want to check ranking for in the Domain field." },
    { "@type": "HowToStep", position: 2, name: "Enter the keyword",       text: "Type the search term you want to check your position for." },
    { "@type": "HowToStep", position: 3, name: "Pick country and device", text: "Choose the country and whether you want desktop or mobile rankings." },
    { "@type": "HowToStep", position: 4, name: "Click Check Rankings",    text: "FreeSERP pulls live Google results and shows your exact position in the top 100." },
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
