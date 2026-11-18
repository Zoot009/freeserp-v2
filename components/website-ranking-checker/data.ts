export type FeatureBlock = {
  title: string;
  paras: readonly string[];
  img: string;
  alt: string;
};

export const FEATURE_BLOCKS: FeatureBlock[] = [
  {
    title: "What Your Website Ranking Really Means",
    paras: [
      "Your website ranking is the organic position one of your pages holds in Google for a specific search. It is not a single score for the whole site: the same domain can be first for one keyword, on page 4 for another, and nowhere for a third. The position also changes with the searcher's country, city and device, and with how many ads, maps and other SERP features sit above the organic results.",
      "Rankings still matter in 2026 because most search clicks go to the first handful of results, and AI-generated answers tend to draw on pages that already rank well. Climbing from page 2 to the top of page 1 is usually the single biggest step for traffic — and it also improves your chances of being cited when people ask an AI assistant instead of searching.",
    ],
    img: "/serp-image/question.png",
    alt: "website-ranking-checker — what a website ranking position means",
  },
  {
    title: "Check Your Website Ranking Free",
    paras: [
      "Most ranking tools lock your data behind expensive monthly plans, charging $29 to $99 per month for the same basic rank check you needed in the first place. FreeSERP gives you 100 credits every month for free — no credit card required — and paid plans start at $19 per month for 2,000 credits, which also cover site audits, local grid scans and keyword research.",
      "Your free checks work on any domain, for any keyword, in any country. Free accounts allow up to 10 keywords per project and provide 30 days of rank history for saved tracking projects — enough to see your real positions, spot ranking drops, and decide whether FreeSERP fits your workflow before spending anything.",
    ],
    img: "/serp-image/sparkles.png",
    alt: "website-ranking-checker — check your website ranking free every month",
  },
  {
    title: "Check Your Ranking in Any Country, on Any Device",
    paras: [
      "Your website does not rank the same way everywhere. A keyword you hold position 3 for in the United States may sit at position 22 in the United Kingdom, and your mobile position can differ from desktop for the very same search. If you judge your rankings from one location on one device, you are missing most of the picture.",
      "FreeSERP supports 190+ countries and major cities. You choose the country and device before every check, and the tool returns the live ranking for that exact market. Compare positions country by country, see where you are strong and where you are losing ground, and plan your next move for each region.",
    ],
    img: "/serp-image/globes.png",
    alt: "website-ranking-checker — check website ranking by country and device",
  },
  {
    title: "Find the Ranking of Any Domain — Including Competitors",
    paras: [
      "A website rank checker is most useful when it works on any domain, not just your own. Enter any site and see its exact position for any keyword in any country. Check your own pages, audit a competitor, or confirm a client's position before a pitch meeting.",
      "Results cover the top 100 positions, not just the first 10. If you are at position 34, you need to know that to plan the climb. FreeSERP also shows the specific URL holding each position, so you can see which page on a competitor's site is winning and what kind of content Google is rewarding for that search.",
    ],
    img: "/serp-image/bullseye-arrow.png",
    alt: "website-ranking-checker — find rankings for any domain including competitors",
  },
  {
    title: "How to Read a Change in Your Ranking",
    paras: [
      "Small day-to-day movement is normal, so look at the trend rather than a single check. When many keywords drop at once across the site, the usual suspects are a Google algorithm update or a technical problem such as pages being blocked, removed or slowed down. When one page drops, look at what changed on that page and at the competitors who moved above it.",
      "Also check whether the ranking URL changed — if Google swaps one of your pages for another, two pages may be competing for the same keyword. And look at the results page itself: a new featured snippet, video block or local pack can push you down the screen even when your position barely moves.",
    ],
    img: "/serp-image/bars-sort.png",
    alt: "website-ranking-checker — how to interpret ranking gains and drops",
  },
  {
    title: "How to Improve Your Website Ranking",
    paras: [
      "Start with search intent: study the pages that rank today and make sure your page answers the same need in the format searchers expect, whether that is a guide, a product page, a comparison or a local listing. Then make it genuinely better — more complete, more current and backed by real experience. Refresh important pages on a regular schedule so facts, examples and dates stay accurate.",
      "Authority and technical health do the rest. Earn links from relevant, trusted sites with content worth citing, and keep the site fast, mobile-friendly, secure on HTTPS and marked up with structured data where it fits. After you check your ranking, run the recommendation plan or a site audit to see which of these is holding your page back the most.",
    ],
    img: "/serp-image/trophy.png",
    alt: "website-ranking-checker — ways to improve your website ranking",
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
    desc: "Check where every client's site ranks — 5 clients or 50 — without a $99+ tool eating into your margins. From $19/month for 2,000 credits, so you can walk into every client call with live data. Export rankings as a PDF or CSV and attach them to your monthly reports.",
    img: "/serp-image/user.png",
    alt: "website-ranking-checker — for solo SEOs and freelancers checking client rankings",
  },
  {
    title: "Small Business Owners",
    desc: "Enter your domain and keyword, pick your country, and see where your site stands in seconds. No credit card, no setup — start with 100 free credits a month. If your ranking slips, you find out right away instead of weeks later when the phone stops ringing.",
    img: "/serp-image/home.png",
    alt: "website-ranking-checker — for small business owners checking keyword positions",
  },
  {
    title: "Companies Running Audits",
    desc: "FreeSERP delivers a live ranking snapshot in under 10 seconds — fast enough to run during a discovery call. Five credits check one keyword, so a 15,000-credit plan handles 100 checks a day without slowing your team down. The data is live every time.",
    img: "/serp-image/briefcase.png",
    alt: "website-ranking-checker — for companies and agencies running SEO audits",
  },
];

export const FAQ_ITEMS = [
  {
    q: "How do I check where my website ranks on Google?",
    a: "There are three common ways. Searching yourself in a private window is quick but still shaped by your location and device, and you only see one keyword and one page at a time. Google Search Console shows an average position for your own site, blended across every location and device. A website ranking checker like this one gives you the exact, live position for one keyword in the country and on the device you choose — for any domain.",
  },
  {
    q: "Is the website ranking checker really free?",
    a: "Yes — the free plan gives you 100 credits every month with no credit card. Check any domain, any keyword, and any country. When you need more, plans start at $19/month for 2,000 credits. Saved projects are limited to 10 keywords on the free plan with 30 days of history; paid plans unlock unlimited keywords and extended history.",
  },
  {
    q: "Why does my ranking look different when I search for myself?",
    a: "Google personalizes results using your location, browsing history, account and device, which often makes your own site look higher than it really ranks — browser-personalized results can skew 5–15 positions high. The checker pulls live, depersonalized results from a clean IP in the country you select. There are no estimates: every position is a real query we ran the moment you clicked.",
  },
  {
    q: "Is Search Console's average position the same as my ranking?",
    a: "Not quite. Search Console averages your position across every search, location and device where your page appeared, so a page that is first in one city and twentieth in another can show an average of around ten. It is useful for spotting trends on your own site. A ranking check tells you the exact position for one keyword, in one market, on one device — and it works on competitors too.",
  },
  {
    q: "Can I check my website ranking for any country or on mobile?",
    a: "Yes — pick from 190+ supported countries in the location dropdown and toggle the Device button before you run the check. Rankings can differ a lot between countries and between mobile and desktop, so check each target market and both devices separately.",
  },
  {
    q: "Why did my website ranking drop?",
    a: "If many keywords fell at once, look for a Google algorithm update or a technical issue such as blocked, removed or slow pages. If one page fell, look at what changed on it and at the pages that moved above you. Also check whether Google switched to a different URL from your site, or whether a new SERP feature pushed the organic results down.",
  },
  {
    q: "What affects how my website ranks?",
    a: "The biggest factors are how well the page matches search intent, the quality and depth of the content compared with what already ranks, links from relevant and trusted sites, technical health such as speed, mobile usability and crawlability, and on-page basics like titles, headings and internal links. Run the recommendation plan after a check to see which of these is hurting your position most.",
  },
  {
    q: "How long does it take to rank on Google?",
    a: "There is no fixed timeline. Established sites with existing authority can see a new page move within weeks, while newer sites and competitive keywords often take several months. Less competitive, more specific long-tail keywords are usually the fastest wins — check your position regularly to see what is working.",
  },
  {
    q: "What mistakes hurt website rankings?",
    a: "The common ones are stuffing keywords into the text, buying or trading low-quality links, publishing thin pages that do not answer the search, targeting the same keyword with several pages, and ignoring technical problems like broken pages, slow loading or poor mobile layouts.",
  },
  {
    q: "Can I check a competitor's website ranking?",
    a: "Yes. Enter any domain — yours or a competitor's — and check its ranking for any keyword in any country. The checker works the same way for every URL and shows which page is ranking, so you can see exactly where competitors stand and what content is earning their position.",
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
    "Free website ranking checker. See where any website ranks on Google for any keyword, in any country and on desktop or mobile — exact position in the top 100, ranking URL and competitors. 100 free credits, no credit card.",
  applicationCategory: "BrowserApplication",
  operatingSystem: "Any",
  url: PAGE_URL,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export const HOWTO_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to check your website ranking on Google",
  description: "Check the live Google ranking of any website for any keyword in under 10 seconds.",
  step: [
    { "@type": "HowToStep", position: 1, name: "Enter your domain", text: "Type the domain whose ranking you want to check in the Domain field." },
    { "@type": "HowToStep", position: 2, name: "Enter the keyword", text: "Type the search term you want to find your position for." },
    { "@type": "HowToStep", position: 3, name: "Pick country and device", text: "Choose the country and whether you want desktop or mobile rankings." },
    { "@type": "HowToStep", position: 4, name: "Click Check Rankings", text: "FreeSERP pulls live, depersonalized results and shows your exact position in the top 100 and the URL that ranks." },
    { "@type": "HowToStep", position: 5, name: "Compare and act", text: "See which competitors rank above you, then use the recommendation plan to find what is holding your page back." },
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
