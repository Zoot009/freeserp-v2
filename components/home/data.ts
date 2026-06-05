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
      desc: "Start researching keywords and tracking rankings with no credit card. Built for solo SEOs and side projects.",
      cta: "Start for Free",
      featured: false,
      features: [
        "20 SERP searches per day",
        "50M+ indexed keywords",
        "190+ countries supported",
        "Daily rank updates",
        "Competitor gap analysis",
        "CSV export",
      ],
    },
    {
      name: "Pro",
      price: 20,
      desc: "Higher daily limits and full SERP intelligence for agencies, in-house teams, and serious operators.",
      cta: "Upgrade to Pro",
      featured: true,
      features: [
        "75 SERP searches per day",
        "Real-time Google SERP data",
        "AI-powered keyword clusters",
        "Search intent grouping",
        "API access included",
        "Priority email support",
      ],
    },
  ],
  yearly: [
    {
      name: "Free",
      price: 0,
      desc: "Start researching keywords and tracking rankings with no credit card. Built for solo SEOs and side projects.",
      cta: "Start for Free",
      featured: false,
      features: [
        "20 SERP searches per day",
        "50M+ indexed keywords",
        "190+ countries supported",
        "Daily rank updates",
        "Competitor gap analysis",
        "CSV export",
      ],
    },
    {
      name: "Pro",
      price: 200,
      desc: "Higher daily limits and full SERP intelligence for agencies, in-house teams, and serious operators.",
      cta: "Upgrade to Pro",
      featured: true,
      features: [
        "75 SERP searches per day",
        "Real-time Google SERP data",
        "AI-powered keyword clusters",
        "Search intent grouping",
        "API access included",
        "Priority email support",
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
    text: "I dropped a $299/mo SEO tool the day I found Free SERP. The free tier got me through my first month, and Pro at $20 is a no-brainer for the daily search headroom.",
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
    a: "Yes — the Free plan gives you 20 SERP searches per day with no credit card. If you need more headroom, Pro ($20/month) raises the limit to 75 searches per day. Questions? Email support@freeserp.com.",
  },
];

export const HOME_WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "FreeSERP",
  url: "https://freeserp.com",
  description:
    "Free SERP rank tracking and competitor intelligence tool. Track keyword rankings daily, reveal competitor gaps, and outrank rivals. No credit card required.",
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
    "Free SERP rank tracking and competitor intelligence platform. Track daily keyword rankings, monitor competitors, and close ranking gaps across 190+ countries.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  url: "https://freeserp.com",
  offers: [
    {
      "@type": "Offer",
      name: "Free Tier",
      price: "0",
      priceCurrency: "USD",
      description: "20 free SERP searches per day. No credit card required.",
    },
    {
      "@type": "Offer",
      name: "Pro",
      price: "20",
      priceCurrency: "USD",
      billingIncrement: "month",
      description:
        "75 SERP searches per day with full competitor intelligence and unlimited tracking projects.",
    },
  ],
  featureList: [
    "Daily keyword rank tracking",
    "Competitor gap analysis",
    "Real-time SERP intelligence",
    "190+ country targeting",
    "Mobile and desktop rank tracking",
    "CSV export",
    "Free tier available",
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
        text: "Yes. The free tier gives you 20 SERP searches per day with no credit card and no signup required. Rank tracking projects are available on the free plan with up to 10 keywords per project. Upgrade to Pro for 75 searches per day and unlimited project keywords.",
      },
    },
  ],
};
