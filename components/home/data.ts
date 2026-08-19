import { COLORS } from "@/components/site/constants";

export const FEATURES = [
  {
    title: "Rank Tracking",
    text: "Monitor daily position changes for your target keywords and get alerted when rankings shift significantly. Track your entire keyword portfolio in one dashboard.",
    bg: "linear-gradient(145deg, #0c6cff 0%, #53acfe 37%, #c1deff 58%)",
    visual: "chart" as const,
  },
  {
    title: "SERP Intelligence",
    text: "View real-time search results for any keyword across 190+ countries, cities, and device types. Analyze SERP features that are stealing your clicks.",
    bg: COLORS.softGray,
    visual: "nodes" as const,
  },
  {
    title: "Competitor Gap Analysis",
    text: "Reveal every keyword your rivals rank for. Find their traffic sources and exploit content gaps. Use competitor intelligence to take rankings they currently own.",
    bg: "linear-gradient(131deg, #f5f6f8 0%, #dadde3 3%, #f5f6f8 46%, #fff 55%, #f5f6f8 100%)",
    visual: "ring" as const,
  },
  {
    title: "Daily Rank Updates",
    text: "Get automated daily rank updates across your full keyword set. Spot ranking movement the moment it happens — not at the end of the month.",
    bg: COLORS.softGray,
    visual: "tasks" as const,
  },
];

export const INSIDE_APP = [
  {
    kicker: "RANK TRACKER",
    title: "Catch every rank change the moment it happens",
    text: "Every tracked keyword updates daily — average position, estimated traffic, and how many terms sit in the top 3, top 10, and top 30. No more spreadsheets, no more end-of-month surprises.",
    link: { text: "Explore Rank Tracker →", href: "/rank-tracker" },
    image: "/inside-app/rank-tracker.jpg",
    alt: "FreeSERP rank tracker — keywords tracked",
    pop: { label: "Keywords in Top 10", num: "312", badge: "26%", color: COLORS.blue },
  },
  {
    kicker: "COMPETITOR ANALYSIS",
    title: "See exactly who's outranking you",
    text: "Pull the real top-10 competitors for any tracked keyword, compare their pages side by side, and pick which ones to analyze further.",
    image: "/inside-app/competitor-analysis.jpg",
    alt: "Competitor analysis — shared keywords and gaps",
    pop: { label: "You rank higher", num: "100%", badge: "2 of 2", color: COLORS.blue },
  },
  {
    kicker: "PROJECTS",
    title: "One dashboard per domain",
    text: "Organize keywords into projects — your site, a client's site, or a competitor you're watching. Each gets its own tracked history.",
    image: "/inside-app/projects.jpg",
    alt: "Projects — one dashboard per domain",
    pop: { label: "Active projects", num: "12", badge: "3 new", color: COLORS.purple },
  },
  {
    kicker: "ALERTS",
    title: "Get notified the moment rankings move",
    text: "No need to check the dashboard every morning — significant position changes land in your activity feed as they happen.",
    image: "/inside-app/alerts.jpg",
    alt: "Alerts — rank-change notifications",
    pop: { label: "Rank movements · 7d", num: "13", badge: "8 up", color: COLORS.blue },
  },
  {
    kicker: "FAVORITES",
    title: "Pin the keywords that matter most",
    text: "Star your highest-priority terms across every project so they're one click away, without digging through hundreds of rows.",
    image: "/inside-app/favorites.jpg",
    alt: "Favorites — pinned keywords",
    narrow: true,
    pop: { label: "Pinned keywords", num: "3", badge: "starred", color: COLORS.amber },
  },
  {
    kicker: "GOOGLE SEARCH CONSOLE",
    title: "Connect real click data to your rank data",
    text: "Link Search Console to any project and see clicks, impressions, and CTR sit right next to FreeSERP's tracked positions — so you know which rankings are actually driving traffic. Export any of it to CSV in one click.",
    link: { text: "See integrations →", href: "#" },
    image: "/inside-app/search-console.jpg",
    alt: "Tracked keyword positions",
    pop: { label: "Clicks · 28 days", num: "9.6K", badge: "15%", color: COLORS.purple },
  },
];

export const BENEFITS = [
  {
    title: "01 — Enter a keyword",
    text: "Enter any keyword or domain. Our engine instantly pulls ranking data from 50M+ indexed search terms across all major search engines.",
  },
  {
    title: "02 — Analyze the data",
    text: "View your real ranking. See every competing page ranked for your target keyword in real-time — search volume, difficulty, SERP features, and your exact position.",
  },
  {
    title: "03 — Track rankings",
    text: "Pin keywords to your dashboard. Get daily rank updates and spot movement instantly.",
  },
  {
    title: "04 — Outrank rivals",
    text: "Find every keyword your competitors rank for that you do not — then take those positions with targeted content.",
  },
  {
    title: "Keyword Clusters",
    text: "Automatically group related keywords by search intent. Plan content that dominates entire topic areas.",
  },
  {
    title: "CSV Export",
    text: "Export all keyword metrics and rank data to CSV with a single click.",
  },
];

export const PLANS = {
  monthly: [
    {
      name: "Free",
      price: 0,
      desc: "100 credits every month, refilled automatically — no credit card. Built for solo SEOs and side projects.",
      cta: "Start for Free",
      featured: false,
      features: [
        "100 credits every month",
        "Every tool unlocked",
        "190+ countries & all devices",
        "No credit card required",
      ],
    },
    {
      name: "Pro",
      price: 49,
      desc: "6,000 credits a month — about 200 keywords checked daily, or spend them on audits, local grids and keyword research instead.",
      cta: "Get Pro",
      featured: true,
      features: [
        "Automated recurring rank checks",
        "Local map grid scans and site audits",
        "Keyword research, competitor and internal-link analysis",
        "190+ countries & all devices",
        "Priority support",
        "Cancel anytime",
      ],
    },
  ],
  yearly: [
    {
      name: "Free",
      price: 0,
      desc: "100 credits every month, refilled automatically — no credit card. Built for solo SEOs and side projects.",
      cta: "Start for Free",
      featured: false,
      features: [
        "100 credits every month",
        "Every tool unlocked",
        "190+ countries & all devices",
        "No credit card required",
      ],
    },
    {
      name: "Pro",
      price: 49,
      desc: "6,000 credits a month — about 200 keywords checked daily, or spend them on audits, local grids and keyword research instead.",
      cta: "Get Pro",
      featured: true,
      features: [
        "Automated recurring rank checks",
        "Local map grid scans and site audits",
        "Keyword research, competitor and internal-link analysis",
        "190+ countries & all devices",
        "Priority support",
        "Cancel anytime",
      ],
    },
  ],
};

export const INTEGRATIONS = [
  { name: "FlowSync", img: "https://framerusercontent.com/images/qrGAVdatvPHPQVWWYcsEInFVE.svg" },
  { name: "PipeFlow", img: "https://framerusercontent.com/images/K7uoBSJf3VXT2RFxYWZc8LPzT5o.svg" },
  { name: "LinkHive", img: "https://framerusercontent.com/images/ioNG1lCITABPNEUbNUHWYXhExQ.svg" },
  { name: "CoreSuite", img: "https://framerusercontent.com/images/4CtzrgESqZ3Lm9W8VD1yVuEuet0.svg" },
  { name: "WorkStream", img: "https://framerusercontent.com/images/Ufdanfgk8al4zaOepPWD4ZlUtw.svg" },
  { name: "GrowMate", img: "https://framerusercontent.com/images/OJB28HIlLHqiOWhbxLxYn0dc70M.svg" },
];

export const TESTIMONIALS = [
  {
    text: "I dropped a $299/mo SEO tool the day I found FreeSERP. The free plan sold me in a week, and $19/mo covering rank tracking, audits and keyword research is a no-brainer.",
    name: "Daniel Cooper",
    role: "Indie SEO Consultant",
    img: "https://framerusercontent.com/images/KcCMMECKZOgi4RCYPbRBT2B8u0.png",
  },
  {
    text: "The competitor gap report alone saved us weeks of manual research. We're now ranking on terms we didn't even know our rivals owned.",
    name: "Liam Parker",
    role: "Growth Marketer",
    img: "https://framerusercontent.com/images/vm6rgYhGUSG7SRXU6hpw22hnk.png",
  },
  {
    text: "Daily rank tracking across 14 countries without touching a credit card. The CSV exports plug straight into our reporting stack.",
    name: "Ethan Ross",
    role: "SEO Operations Manager",
    img: "https://framerusercontent.com/images/XaVOaVzmCJpth8zmlr10pMbrt8.png",
  },
];

export const FAQS = [
  {
    q: "What are SERPs?",
    a: "SERPs (Search Engine Results Pages) are the pages displayed by Google after a user searches for a query. They include organic results, ads, and SERP features.",
  },
  {
    q: "What is SERP analysis?",
    a: "SERP analysis is the process of analyzing search results for a keyword to understand ranking difficulty, competitors, and available SERP features.",
  },
  {
    q: "How do I do SERP analysis?",
    a: "To perform SERP analysis, search your target keyword, review the top-ranking pages, analyze content quality, and identify SERP features like snippets or FAQs.",
  },
  {
    q: "How do I analyze SERP features?",
    a: "You can analyze SERP features by checking which elements appear in search results, such as featured snippets, image packs, or local results.",
  },
  {
    q: "How do I check SERP ranking?",
    a: "You can check SERP ranking by using a SERP checker tool to see where your website appears for a specific keyword.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes — the free plan gives you 100 credits every month with no credit card, and every tool is unlocked. If you need more, plans start at $19/month for 2,000 credits. One credit checks one keyword; the same balance pays for audits, local grid scans and keyword research. Questions? Email support@freeserp.com.",
  },
];

export const HOME_WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "FreeSERP",
  url: "https://freeserp.com",
  description:
    "FreeSERP rank tracking and competitor intelligence tool. Track keyword rankings daily, reveal competitor gaps, and outrank rivals. No credit card required.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://freeserp.com/?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export const HOME_SOFTWARE_APP_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "FreeSERP",
  description:
    "FreeSERP rank tracking and competitor intelligence platform. Track daily keyword rankings, monitor competitors, and close ranking gaps across 190+ countries.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  url: "https://freeserp.com",
  offers: [
    {
      "@type": "Offer",
      name: "Free Trial",
      price: "0",
      priceCurrency: "USD",
      description: "100 free credits every month. No credit card required.",
    },
    {
      "@type": "Offer",
      name: "Workers",
      price: "5",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "5",
        priceCurrency: "USD",
        unitCode: "MON",
        billingIncrement: 1,
      },
      description:
        "Credit plans from $19/month — 2,000 credits, where one credit checks one keyword. The same balance also covers site audits, local map grid scans, keyword research and competitor analysis.",
    },
  ],
  featureList: [
    "Daily keyword rank tracking",
    "Competitor gap analysis",
    "Real-time SERP intelligence",
    "190+ country targeting",
    "Mobile and desktop rank tracking",
    "CSV export",
    "Free trial available",
  ],
};

export const HOME_ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "FreeSERP",
  url: "https://freeserp.com",
  logo: "https://freeserp.com/logo.png",
  contactPoint: {
    "@type": "ContactPoint",
    email: "support@freeserp.com",
    contactType: "customer support",
  },
  sameAs: [] as string[],
};

export const HOME_FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is SERP analysis?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SERP analysis is the process of examining the search engine results page for a target keyword to understand what types of content rank, which competitors appear, and what SERP features (like featured snippets, maps, or image packs) are present. It helps SEOs understand what Google rewards for a given query.",
      },
    },
    {
      "@type": "Question",
      name: "How do I do SERP analysis?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Enter your target keyword into FreeSERP, then review which domains rank in the top 10, what content format they use, which SERP features appear, and how your own domain compares. Use the competitor gap report to identify which ranking terms you are missing.",
      },
    },
    {
      "@type": "Question",
      name: "How do I analyze SERP features?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "FreeSERP shows which SERP features appear for each keyword — featured snippets, People Also Ask, image packs, local maps, and more. If a feature is present, it means Google is pulling from a specific content format. Use that to guide your content strategy.",
      },
    },
    {
      "@type": "Question",
      name: "How do I check SERP ranking?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Go to freeserp.com, enter your domain and the keyword you want to check, select your country and device, and click Check Rankings. FreeSERP returns your real ranking position in the top 100 in under 10 seconds — without browser history or personalization affecting the result.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a free plan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The free plan gives you 100 credits every month with no credit card required, and every tool is unlocked. Rank tracking projects are available on the free plan with up to 10 keywords per project. Paid plans start at $19/month for 2,000 credits — one credit checks one keyword — with automated recurring checks and unlimited project keywords.",
      },
    },
  ],
};
