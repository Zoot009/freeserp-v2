export type FeatureBlock = {
  title: string;
  paras: readonly string[];
  img: string;
  alt: string;
};

export const FEATURE_BLOCKS: FeatureBlock[] = [
  {
    title: "Check Your Website Ranking Free",
    paras: [
      "Most ranking tools lock your data behind expensive monthly plans, charging $29 to $99 per month for the same basic rank check you needed in the first place. FreeSERP lets you check your website ranking free with 3 rank checks in a 7-day trial — no credit card required — and paid plans start at just $5 per month for 75 checks a day.",
      "Your trial checks work on any domain, for any keyword, in any country. Free accounts allow up to 10 keywords per project and provide 30 days of rank history for saved tracking projects. This gives you enough data to see your real positions, spot ranking drops, and decide whether FreeSERP fits your workflow—before spending anything.",
    ],
    img: "/serp-image/sparkles.png",
    alt: "website-ranking-checker — check your website ranking free in a 7-day trial",
  },
  {
    title: "Global Website Ranking Checker",
    paras: [
      "Your website does not rank the same way in every country. A keyword you hold position 3 for in the United States may sit at position 22 in the United Kingdom, position 7 in Canada, or position 1 in Australia. If you are making decisions based on rankings from a single location, you are missing most of the information.",
      "FreeSERP is a global website ranking checker that supports 190+ countries and major cities. You choose the country and device type before every check, and the tool returns the live ranking for that exact market. Compare positions country by country, identify where you are strong and where you are losing ground, and build a targeted plan for each region.",
    ],
    img: "/serp-image/globes.png",
    alt: "website-ranking-checker — global ranking checker supporting 190+ countries",
  },
  {
    title: "Website Rank Finder for Any Domain",
    paras: [
      "A website rank finder is most useful when you can check any domain—not just your own. FreeSERP lets you enter any URL and find its exact position for any keyword in any country. Use it to check your pages, audit a competitor's rankings, or verify a client's position before a pitch meeting.",
      "The website rank finder pulls results for the top 100 positions—not just the first 10. If you are at position 34, you need to know that clearly to plan your next steps. FreeSERP also shows you the specific URL holding each ranking position, not just the domain, so you can see exactly which page on a competitor's site is ranking and what type of content is winning.",
    ],
    img: "/serp-image/bullseye-arrow.png",
    alt: "website-ranking-checker — find rankings for any domain including competitors",
  },
];

export type WhoUsesItem = {
  title: string;
  desc: string;
  img: string;
  alt: string;
};

export const WHO_USES: WhoUsesItem[] = [
  {
    title: "Solo & Freelancers",
    desc: "Check website rankings across all your clients—5 or 50—without a $99+ tool eating into your margins. From $5/month, each worker adds 15 daily checks, so you can walk into every client call with live data. Export rankings as a PDF or CSV and attach them directly to your monthly reports.",
    img: "/serp-image/user.png",
    alt: "website-ranking-checker — for solo SEOs and freelancers tracking client rankings",
  },
  {
    title: "Small Business Owners",
    desc: "Enter your domain, enter the keyword, pick your country, and see your position in seconds. No credit card, no setup — start with 3 free checks in a 7-day trial. When your ranking drops, you will know immediately instead of finding out weeks later when your traffic has already fallen.",
    img: "/serp-image/home.png",
    alt: "website-ranking-checker — for small business owners checking keyword positions",
  },
  {
    title: "Companies Running Audits",
    desc: "FreeSERP delivers a live ranking snapshot in under 10 seconds—fast enough to run during a discovery call. Each worker adds 15 daily checks, so a 100-worker plan handles 1,500 checks a day without slowing your team down. The data is live and accurate every time.",
    img: "/serp-image/briefcase.png",
    alt: "website-ranking-checker — for companies and agencies running SEO audits",
  },
];

export const FAQ_ITEMS = [
  {
    q: "Is the website ranking checker really free?",
    a: "Yes, to start — the free 7-day trial gives you 3 rank checks with no credit card. Check any domain, any keyword, and any country. When you need more, worker plans start at $5/month for 75 checks a day. Saved projects are limited to 10 keywords on the free plan with 30 days of history; paid plans unlock unlimited keywords and extended history.",
  },
  {
    q: "How accurate is the website ranking data?",
    a: "We pull live, depersonalized results from a clean IP in the country you select — no estimates, no extrapolation. Every position is a real query we ran the moment you clicked. Accuracy matches paid tools for the top 100 positions. Browser-personalized results can skew 5–15 positions high; we eliminate that bias entirely.",
  },
  {
    q: "Can I check my website ranking for any country?",
    a: "Yes — pick from 190+ supported countries in the location dropdown. Every check returns the live ranking for the exact market you select, not an averaged or estimated position. Rankings differ significantly between countries, so check each target market separately.",
  },
  {
    q: "Does the website rank tracker check mobile and desktop separately?",
    a: "Yes — toggle the Device button before running the check. Mobile and desktop rankings often differ by 2–5 positions; for keywords with high mobile search volume the gap can be larger. Always run both checks if you are optimizing for local or service-based searches.",
  },
  {
    q: "How often should I check my website ranking?",
    a: "For active optimization, check daily for your 5–10 highest-priority keywords and weekly for the rest. Rankings shift because of algorithm updates, competitor activity, and content changes — checking monthly hides what is actually happening. Set up a saved tracking project and review the 30-day history chart weekly for a clear trend line.",
  },
  {
    q: "Can I use this tool as a website rank finder for competitor domains?",
    a: "Yes. Enter any domain—yours or a competitor's—and check their ranking for any keyword in any country. The website rank finder works identically for any URL, so you can audit competitor positions the same way you check your own. Use competitor rank checks before client pitches to show prospects exactly where they stand versus the competition.",
  },
  {
    q: "Why is my website ranking lower than I expected?",
    a: "The most common reasons are weak internal linking, thin content compared to top-ranking pages, slow page speed, or a mismatch between your content and search intent. Run the recommendation plan after a check — it identifies which factor is hurting your position most.",
  },
  {
    q: "Do you store my data?",
    a: "We store only the keywords and domains you save to tracked projects. We do not sell data, run ads against your usage, or share with third parties. Anonymous one-off checks are not logged to your account; delete any project at any time to clear it from our system.",
  },
];

const PAGE_URL = "https://freeserp.com/website-ranking-checker";

export const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://freeserp.com/" },
    { "@type": "ListItem", position: 2, name: "Website Ranking Checker", item: PAGE_URL },
  ],
};

export const SOFTWARE_APP_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "FreeSERP — Website Ranking Checker",
  description:
    "Website ranking checker with a free 7-day trial. Check your website ranking in any country, on any device — 3 free checks, no credit card.",
  applicationCategory: "BrowserApplication",
  operatingSystem: "Any",
  url: PAGE_URL,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export const HOWTO_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to check your website ranking with FreeSERP",
  description: "Check the live Google ranking of any website for any keyword in under 10 seconds.",
  step: [
    { "@type": "HowToStep", position: 1, name: "Enter your domain", text: "Type the domain you want to check ranking for in the Domain field." },
    { "@type": "HowToStep", position: 2, name: "Enter the keyword", text: "Type the search term you want to check your position for." },
    { "@type": "HowToStep", position: 3, name: "Pick country and device", text: "Choose the country and whether you want desktop or mobile rankings." },
    { "@type": "HowToStep", position: 4, name: "Click Check Rankings", text: "FreeSERP pulls live results and shows your exact position in the top 100." },
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
