import { COLORS } from "@/components/site/constants";

export const FEATURES = [
  {
    title: "Keyword Research",
    text: "Discover millions of keywords with search volume, CPC, difficulty score, and trend data all in one place.",
    bg: "linear-gradient(145deg, #0c6cff 0%, #53acfe 37%, #c1deff 58%)",
    visual: "chart" as const,
  },
  {
    title: "SERP Analysis",
    text: "View real-time Google search results for any keyword across 190+ countries, cities, and device types.",
    bg: COLORS.softGray,
    visual: "nodes" as const,
  },
  {
    title: "Daily Rank Tracking",
    text: "Monitor daily position changes for your target keywords and get alerted when rankings shift significantly.",
    bg: "linear-gradient(131deg, #f5f6f8 0%, #dadde3 3%, #f5f6f8 46%, #fff 55%, #f5f6f8 100%)",
    visual: "ring" as const,
  },
  {
    title: "Competitor Spy",
    text: "Reveal every keyword your rivals rank for. Find their traffic sources and exploit their content gaps.",
    bg: COLORS.softGray,
    visual: "tasks" as const,
  },
];

export const BENEFITS = [
  {
    title: "01 — Enter a keyword",
    text: "Type any keyword or domain into Free SERP. Our engine instantly pulls data from 50M+ indexed search terms across all major search engines.",
  },
  {
    title: "02 — Analyze the data",
    text: "View search volume, keyword difficulty, CPC, SERP features, and every competing page ranked in real-time for your target keyword.",
  },
  {
    title: "03 — Track rankings",
    text: "Pin keywords to your dashboard. Get daily updates on exactly where your pages appear in search results and spot movement instantly.",
  },
  {
    title: "04 — Outrank rivals",
    text: "Use competitor gap analysis to find every keyword they rank for that you don't — then take those positions with targeted content.",
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
