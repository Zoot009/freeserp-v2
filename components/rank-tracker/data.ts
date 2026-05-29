export type WhyCallout = { title: string; desc: string; img?: string; alt?: string };

export const WHY_CALLOUTS: WhyCallout[] = [
  {
    title: "Best Rank Tracker Online",
    desc: "Your browser history and Google account push your own pages higher than they actually rank.",
    img: "/serp-image/eye.png",
    alt: "rank-tracker — personalization distorts your Google rank",
  },
  {
    title: "Geo-Bias Is Invisible",
    desc: "Searching from Mumbai shows different results than searching from London — even for the same keyword.",
    img: "/serp-image/globes.png",
    alt: "rank-tracker — geo-bias makes rankings differ by country",
  },
  {
    title: "Top 100, Not Top 10",
    desc: "Manual checking stops at page 1. A rank tracker shows you exactly where in the top 100 you sit.",
    img: "/serp-image/bars-sort.png",
    alt: "rank-tracker — full top 100 ranking results, not just the top 10",
  },
];

export type UseCase = { title: string; desc: string; img?: string; alt?: string };

export const USE_CASES: UseCase[] = [
  {
    title: "Solo SEOs & Freelancers",
    desc: "Track 5–20 client keywords without a subscription. Export rankings as a PDF or CSV to send with monthly reports.",
    img: "/serp-image/user.png",
    alt: "rank-tracker — for solo SEOs and freelancers",
  },
  {
    title: "Small Business Owners",
    desc: "See where you actually rank for the searches that matter to your business and check them daily without learning a complicated tool.",
    img: "/serp-image/home.png",
    alt: "rank-tracker — for small business owners",
  },
  {
    title: "Companies Running Audits",
    desc: "Pull a rank snapshot in 10 seconds during a sales call. Show prospects their current rank live, then upsell the implementation work.",
    img: "/serp-image/briefcase.png",
    alt: "rank-tracker — for agencies running SEO audits",
  },
];

export type FAQ = { q: string; a: string };

export const FAQ_ITEMS: FAQ[] = [
  {
    q: "Is the Rank Tracker really free?",
    a: "Yes — unlimited checks with no credit card, no trial, and no rate limit on manual checks. Saved tracking projects are limited to 10 keywords per project on the free plan; paid plans get unlimited results per project.",
  },
  {
    q: "How accurate is the rank tracking data?",
    a: "We pull live, depersonalized search results from a clean IP in the country you select. We do not estimate or extrapolate. Every position is a real query we ran when you clicked the button.",
  },
  {
    q: "Can I check rankings for any country?",
    a: "Pick from the supported countries in the location dropdown. Rankings are pulled at the country level, so every check returns the live results for the country you select.",
  },
  {
    q: "Does the rank tracker check mobile and desktop separately?",
    a: "Yes — toggle the Device button before running the check. Mobile and desktop rankings often differ by 2–5 positions, so checking both matters for any keyword with significant mobile search volume.",
  },
  {
    q: "How often should I check my rankings?",
    a: "For active search optimization work, daily for 5–10 priority keywords and weekly for the rest. Google rankings shift daily because of algorithm updates, competitor activity, and personalization. Checking once a month hides what's actually happening.",
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
  name: "FreeSERP — Free Rank Tracker",
  description:
    "Free rank tracker that checks Google rankings in real time for any domain, keyword, country, and device.",
  applicationCategory: "BrowserApplication",
  operatingSystem: "Any",
  url: PAGE_URL,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
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
