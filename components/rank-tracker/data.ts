export type WhyCallout = { title: string; desc: string; img?: string; alt?: string };

export const WHY_CALLOUTS: WhyCallout[] = [
  {
    title: "Best Rank Tracker Online",
    desc: "Your browser history and Google account push your own pages higher than they actually rank. Every rank check you run manually is inflated. The only way to see your real business ranking is through a rank tracker that queries from a clean, neutral server.",
    img: "/serp-image/eye.png",
    alt: "rank-tracker — personalization distorts your Google rank",
  },
  {
    title: "Geo-Bias Is Invisible",
    desc: "Searching from Mumbai shows different results than searching from London — even for the exact same keyword. A rank tracker lets you check rankings from any country so you see what your target audience actually sees.",
    img: "/serp-image/globes.png",
    alt: "rank-tracker — geo-bias makes rankings differ by country",
  },
  {
    title: "Top 100, Not Top 10",
    desc: "Manual rank checking stops at page 1. A rank tracker shows you exactly where in the top 100 you sit, so you know whether you are on page 2 or page 10 and how many positions you need to climb.",
    img: "/serp-image/bars-sort.png",
    alt: "rank-tracker — full top 100 ranking results, not just the top 10",
  },
];

export type UseCase = { title: string; desc: string; img?: string; alt?: string };

export const USE_CASES: UseCase[] = [
  {
    title: "Solo SEOs and Freelancers",
    desc: "Track 5–20 client keywords without an Ahrefs or Semrush subscription. Export ranking data as a PDF or CSV to send with monthly reports. The rank tracker gives you a clean, professional ranking snapshot in seconds.",
    img: "/serp-image/user.png",
    alt: "rank-tracker — for solo SEOs and freelancers",
  },
  {
    title: "Small Business Owners",
    desc: "See where your business actually ranks for the searches that matter. Check your domain rankings daily without learning a complicated tool. Know your real business rank — not the inflated version your browser shows you.",
    img: "/serp-image/home.png",
    alt: "rank-tracker — for small business owners",
  },
  {
    title: "Agencies Running Audits",
    desc: "Pull a rank snapshot in 10 seconds during a sales call. Show prospects their current domain ranking live, then upsell the implementation work. The rank tracker needs no account and no setup — just domain, keyword, country, device.",
    img: "/serp-image/briefcase.png",
    alt: "rank-tracker — for agencies running SEO audits",
  },
];

export type FAQ = { q: string; a: string };

export const FAQ_ITEMS: FAQ[] = [
  {
    q: "Is the rank tracker really free?",
    a: "Yes, to start — you get 3 free rank checks in a 7-day trial with no credit card. After that, worker plans start at $5/month: each worker adds 15 daily checks, so 5 workers give you 75 rank checks a day. Saved rank tracking projects are limited to 10 keywords per project on the free plan; paid plans get unlimited keywords per project.",
  },
  {
    q: "How accurate is the rank tracking data?",
    a: "The rank tracker pulls live, depersonalized search results from a clean IP in the country you select. We do not estimate or extrapolate rankings. Every rank result is a real query the tracker ran when you clicked the button.",
  },
  {
    q: "Can the rank tracker check rankings in any country?",
    a: "Pick from the supported countries in the location dropdown. The rank tracker queries search engines at the country level, so every check returns the live ranking for the country you select.",
  },
  {
    q: "Does the rank tracker check mobile and desktop rankings separately?",
    a: "Yes — toggle the Device button before running the rank check. Mobile and desktop rankings often differ by 2–5 positions, so tracking both matters for any keyword with significant mobile search volume.",
  },
  {
    q: "How often should I track my rankings?",
    a: "For active SEO work, run the rank tracker daily for 5–10 priority keywords and weekly for the rest. Search engine rankings shift daily because of algorithm updates, competitor activity, and content changes. Checking once a month hides what is actually happening to your domain.",
  },
  {
    q: "Can the rank tracker monitor competitor domains?",
    a: "Yes — enter their domain instead of yours, or use the Competitor Analysis feature to compare their full ranking profile against your own. The rank tracker treats any domain the same — your site or a competitor's.",
  },
  {
    q: "Why is my domain ranking lower than I expected?",
    a: "The most common reasons are weak internal linking to the page, thin content compared to top-ranking pages, slow page speed, or mismatched search intent. Run the AI Recommendation Plan after a rank check — it diagnoses which of these is hurting your domain ranking most.",
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
    "Free rank tracker tool. Check where any domain ranks for any keyword across all major search engines. Track rankings by country, device, and competitor domain. No signup or credit card required.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  url: PAGE_URL,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "3 free rank checks in a 7-day trial. No credit card required.",
  },
  featureList: [
    "Check domain ranking for any keyword",
    "Track rankings across all major search engines",
    "Country-level rank tracking",
    "Mobile and desktop rank checks",
    "Competitor domain rank tracking",
    "Top 100 results per check",
    "Daily automated rank tracking projects",
    "No signup required for manual checks",
  ],
};

export const HOWTO_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to track keyword rankings with the free rank tracker",
  description:
    "Check where any domain ranks for any keyword in under 10 seconds using the FreeSERP free rank tracker.",
  totalTime: "PT1M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Enter your domain and keyword",
      text: "Type in the domain you want to track and the keyword you want to check. You can enter your own domain or a competitor's domain.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Select country and device",
      text: "Choose the country you want to check rankings for and toggle between mobile and desktop to see rankings for each device type.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Click Check Rankings",
      text: "The rank tracker sends a clean, depersonalized query to the search engine from a neutral server and returns your real ranking position in the top 100.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Spy on competitors who outrank you",
      text: "Switch the domain to any competitor and run the same rank check to see where they rank, how far above you they sit, and which keywords they hold.",
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Save to a tracking project",
      text: "Save your most important keywords to a rank tracking project. The tracker runs daily rank checks automatically and shows you position movement over time.",
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
