import type { Metadata } from "next";
import Image from "next/image";
import { Inter } from "next/font/google";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Building2,
  Check,
  ChevronDown,
  Gauge,
  Globe2,
  KeyRound,
  Link2,
  ListChecks,
  Megaphone,
  Search,
  Share2,
  Target,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";
import { LogoMark, Wordmark } from "@/components/landing/ui/Logo";
import { TESTIMONIALS } from "@/components/home/data";
import { CREDIT_PLANS } from "@/app/pricing/PricingPlans";
import { Cta } from "../_locale/Cta";
import { SignupPopup } from "../_locale/SignupPopup";
import { Point, SectionHead, ShotFrame, WRAP, type Shot } from "../_locale/pieces";
import "../_locale/audit.css";

/**
 * /audit-suite/uk — the UK paid-acquisition landing page for the audit
 * and research tools. Sibling of /audit-suite/us: same tools, same
 * screenshots, same theme, different campaign.
 *
 * What actually differs, and why the two are separate files rather than one
 * page behind a locale switch:
 *
 *  - Copy. Not a translation — a different argument. The UK page leads on
 *    "SEO shouldn't feel like guesswork" and carries a six-step workflow band
 *    the US page does not have; the US page carries sections this one drops.
 *    A shared page parameterised by locale would have to hold both, and would
 *    become the union of every campaign that ever ran.
 *  - Spelling. British throughout — analyse, prioritised, organised,
 *    programmes — including in the tool names and CTAs.
 *  - Currency. Prices render in £.
 *
 * Everything that is genuinely the same is imported from ../: the theme
 * (audit.css), the CTA and popup client islands, and the presentational pieces.
 *
 * ⚠ CURRENCY: the amounts come from CREDIT_PLANS, which is what checkout
 * actually charges, and only the symbol is localised here. If billing settles
 * in USD then "£19" is a price this page cannot honour — see the note above
 * PRICE_PREFIX before running traffic at this.
 *
 * Otherwise the same shape as its sibling: a pure server component, no global
 * Nav or Footer, a native <details> FAQ, and static HTML on a cold paid click.
 * It renders inside the root layout, so Google Ads conversion tracking, GA4,
 * GTM and first-party UTM capture are all inherited.
 */

// Inter, scoped to this page — matching /audit-suite/us and /tracking-suite.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

/**
 * The currency symbol shown against every price on this page.
 *
 * The numbers themselves are never restated here — they come from CREDIT_PLANS,
 * so this page can only ever quote a figure the checkout honours. The symbol is
 * the one thing localised, and it is the one thing that can therefore be wrong:
 * if the checkout bills in USD, a UK visitor charged $19 after being shown £19
 * has been quoted roughly 25% under the real price. Confirm GBP billing before
 * this page takes traffic, or set this back to "$".
 */
const PRICE_PREFIX = "£";

export const metadata: Metadata = {
  title: "Free SEO Audit Tools for UK Websites — FreeSERP",
  description:
    "Audit your whole website, run any page through 63 checks, analyse competitors, map internal links and track rankings — multiple SEO tools on one credit balance. 100 free credits every month, no credit card.",
  alternates: { canonical: "/audit-suite/uk" },
  openGraph: {
    title: "Your SEO Co-Pilot for Every Search Move",
    description:
      "Full website audits, page audits, competitor analysis, internal link analysis, keyword research and rank tracking — one account, one credit balance. No credit card.",
    url: "/audit-suite/uk",
    siteName: "FreeSERP",
    type: "website",
  },
  // Paid-traffic destination, kept out of the index on purpose: it restates the
  // home page, the tool pages and its own US sibling, and letting Google choose
  // between them is how a site ends up ranking its ad copy instead of its
  // content — and how /us and /uk end up cannibalising each other. Google Ads
  // does not require an indexed landing page. If this is ever repurposed for
  // organic search, flip `index`, add the route to app/sitemap.ts, and give the
  // pair reciprocal hreflang alternates rather than indexing them bare.
  robots: { index: false, follow: true },
};

/* ══════════════════════════════════════════════════════════════════════════
   CONTENT — everything a marketer edits between campaigns lives in this block.

   Every claim has to be true of the product. The tools map to real
   backend modules and the prices come from CREDIT_PLANS, imported rather than
   restated.
   ══════════════════════════════════════════════════════════════════════════ */

const HERO_SHOT: Shot = {
  src: "/shots/audit-suite/site-audit-crawl.png",
  width: 3200,
  height: 2000,
  alt: "FreeSERP Full Website Audit mid-crawl: 428 of 1,000 pages crawled, with the issues found so far — missing alt text, slow Largest Contentful Paint, short meta descriptions, duplicate H1s and broken internal links — each labelled Critical, Warning or Notice",
};

/** The problem section's shot: every tool on one workspace, one balance. */
const WORKSPACE_SHOT: Shot = {
  src: "/shots/audit-suite/workspace-overview.png",
  width: 2880,
  height: 1440,
  alt: "The FreeSERP workspace overview: visibility, average position, top-3 keywords, estimated traffic and site health across the top, and beneath them every tool — rank tracking, maps, AI prompts, YouTube, full website audit, competitor analysis, keyword magic and internal links — all spending from the same credit balance",
};

/** Section 3: what the platform does, in the five verbs it does it in. */
const VALUE_STEPS = [
  {
    icon: Wrench,
    title: "Audit",
    text: "Find technical and on-page issues across your website or individual pages.",
  },
  {
    icon: Users,
    title: "Analyse",
    text: "See what competitors ranking above you are doing differently.",
  },
  {
    icon: Search,
    title: "Discover",
    text: "Find relevant keywords and understand their search potential.",
  },
  {
    icon: TrendingUp,
    title: "Improve",
    text: "Identify the areas that can have the biggest impact on your SEO.",
  },
  {
    icon: Target,
    title: "Track",
    text: "Monitor rankings and measure how your SEO efforts are progressing.",
  },
];

interface Tool {
  key: string;
  kicker: string;
  title: string;
  body: string[];
  /** Introduces the bullet list — "See:", "Check:", "Compare:", "Discover:". */
  listLead: string;
  /** Bullets, or chips where the brief gave a single inline row of categories. */
  points?: string[];
  chips?: string[];
  /** A sentence between the list and the closing line. */
  note?: string;
  /** The closing line under the list. */
  kicker2: string;
  ctaLabel: string;
  shot: Shot;
  shotLabel: string;
  /** Flat pastel panel background — the tool's hue at its lightest. */
  tint: string;
  /** The same hue, saturated: the kicker dot and the icon chip. */
  dot: string;
}

const TOOLS: Tool[] = [
  {
    key: "website-audit",
    kicker: "Full Website Audit",
    title: "Find What's Holding Your Website Back.",
    body: [
      "Crawl your website and turn hundreds of technical checks into a prioritised list of issues worth fixing.",
      "FreeSERP can crawl up to 1,000 pages in one audit, with findings organised by priority so you can focus on what matters first.",
    ],
    listLead: "See:",
    points: [
      "Critical, Warning and Notice issues",
      "Every affected URL",
      "Exact elements causing an issue",
      "Site-wide issue counts",
      "Overall site and category grades",
      "SEO, Performance, UI/UX, Links, Technology and Social checks",
      "PDF and CSV exports",
      "Re-crawl results after making improvements",
    ],
    kicker2:
      "Don't just know that something is wrong. Know where it is and what needs attention.",
    ctaLabel: "Start Your Website Audit",
    shot: {
      src: "/shots/audit-suite/site-audit-report.png",
      width: 3200,
      height: 2000,
      alt: "A finished FreeSERP site audit for patagonia.com: site average grade B with category grades for SEO, Performance, UI/UX, Links, Technology and Social, and the findings listed by issue with the affected URLs expanded",
    },
    shotLabel: "app.freeserp.com — Full Website Audit",
    tint: "#e8eeff",
    dot: "#0454ff",
  },
  {
    key: "page-audit",
    kicker: "Page Audit",
    title: "Go From Website-Level Problems to Page-Level Answers.",
    body: [
      "Sometimes you don't need another massive report. You need to know exactly what's happening on one important page.",
      "Run a page through 63 SEO and performance checks and get a clear breakdown of what is working, what isn't and where you can improve.",
    ],
    listLead: "Check:",
    chips: ["SEO", "Performance", "UI/UX", "Links", "Technology", "Social"],
    note: "Each issue is prioritised and explained, with an Audit Assistant available to help you understand what to do next.",
    kicker2: "One page. 63 checks. A clearer path to improvement.",
    ctaLabel: "Audit a Page for Free",
    shot: {
      src: "/shots/audit-suite/page-audit.png",
      width: 2240,
      height: 1680,
      alt: "A FreeSERP page audit report: the page's overall score and category grades beside the list of failed checks, each with an explanation of what was found and why it matters, and the Audit Assistant answering what to fix first",
    },
    shotLabel: "app.freeserp.com — Page Audit",
    tint: "#e7f4ec",
    dot: "#0f9d58",
  },
  {
    key: "competitors",
    kicker: "Competitor Analysis",
    title: "See What the Pages Above You Are Doing Differently.",
    body: [
      "Your competitors are already giving you clues about what works in the search results.",
      "Choose a keyword and compare your page with pages ranking above you using the same 63 on-page checks.",
    ],
    listLead: "Compare:",
    points: [
      "SEO score",
      "SERP position",
      "Title length",
      "Meta description",
      "Word count",
      "Keyword occurrences",
      "On-page factors",
    ],
    kicker2:
      "Instead of asking “Why are they ranking above me?” — start seeing the differences that could help you close the gap.",
    ctaLabel: "Analyse Your Competition",
    shot: {
      src: "/shots/competitor-analysis.png",
      width: 2240,
      height: 1680,
      alt: "FreeSERP competitor analysis: your domain and three rivals side by side with SERP position, overall SEO score, title length, meta description, word count and keyword occurrences",
    },
    shotLabel: "app.freeserp.com — Competitor Analysis",
    tint: "#fcefe7",
    dot: "#dd6031",
  },
  {
    key: "internal-links",
    kicker: "Internal Links",
    title: "Turn Your Internal Links Into a Stronger SEO Structure.",
    body: [
      "Your important pages shouldn't be buried.",
      "FreeSERP maps your internal linking structure so you can see how authority and accessibility flow through your website.",
    ],
    listLead: "Discover:",
    points: [
      "Orphan pages",
      "Internal link hubs",
      "Crawl depth",
      "Inbound and outbound links",
      "Link equity",
      "Pages that may need stronger internal connections",
    ],
    kicker2: "See how your website connects — and where it could connect better.",
    ctaLabel: "Analyse Internal Links",
    shot: {
      src: "/shots/audit-suite/link-graph.png",
      width: 2240,
      height: 1680,
      alt: "FreeSERP internal link analysis: 428 pages, 3,914 internal links, 4 orphan pages and a max depth of 5, drawn as a node graph with hub, authority and orphan pages coloured apart",
    },
    shotLabel: "app.freeserp.com — Internal Links",
    tint: "#f0eafb",
    dot: "#7e3ff2",
  },
];

/**
 * The three keyword tools as one Discover → Assess → Track sequence.
 *
 * The brief marked the three stages with emoji. They are lucide icons here
 * instead: every other icon on the page is a lucide glyph, and the two sets
 * render at different weights and colours on the same row.
 */
const KEYWORD_STAGES = [
  {
    key: "discover",
    icon: Search,
    stage: "Discover",
    title: "Uncover New Opportunities",
    tool: "Keyword Magic Tool",
    body: "Start with a seed keyword and discover hundreds of related searches with:",
    chips: [
      "Search volume",
      "Keyword difficulty",
      "CPC",
      "Search intent",
      "SERP features",
    ],
    shot: {
      src: "/shots/audit-suite/keyword-magic.png",
      width: 3200,
      height: 2000,
      alt: "The FreeSERP Keyword Magic Tool: keyword ideas grouped into topics with search volume, keyword difficulty, CPC and search intent for each term",
    } as Shot,
  },
  {
    key: "assess",
    icon: Target,
    stage: "Assess",
    title: "Know Where You Stand",
    tool: "Keyword Score Checker",
    body: "Check your page against a target keyword and understand the factors behind your SEO performance. See:",
    chips: [
      "On-page SEO",
      "Off-page signals",
      "Domain Authority",
      "Page Authority",
      "Backlinks",
      "Page performance",
    ],
    shot: {
      src: "/shots/audit-suite/keyword-score.png",
      width: 2240,
      height: 1680,
      alt: "A FreeSERP keyword score report: an overall grade of 86 built from on-page and off-page SEO, with Domain Authority, Page Authority, backlink counts and TTFB, FCP, LCP and CLS beneath",
    } as Shot,
  },
  {
    key: "track",
    icon: TrendingUp,
    stage: "Track",
    title: "Measure Your Progress",
    tool: "Keyword Tracking",
    body: "Filter by project, device or search engine and keep your keyword performance in one place. Keep track of:",
    chips: [
      "Keyword positions",
      "Ranking movement",
      "Search volume",
      "Traffic",
      "Ranking URLs",
      "SERP features",
    ],
    shot: {
      src: "/shots/audit-suite/keywords-all.png",
      width: 3200,
      height: 2000,
      alt: "FreeSERP keyword tracking: every tracked keyword across projects with position, day-over-day movement, search volume, traffic and the ranking URL, above a filter bar",
    } as Shot,
  },
];

/** Section 13. The six steps, in order, as one continuous loop. */
const WORKFLOW = [
  { n: "01", title: "Audit", text: "Find technical and on-page issues across your website." },
  {
    n: "02",
    title: "Understand",
    text: "See which problems matter most and where they occur.",
  },
  {
    n: "03",
    title: "Analyse",
    text: "Compare your pages with competitors ranking above you.",
  },
  { n: "04", title: "Discover", text: "Find keywords and opportunities worth pursuing." },
  { n: "05", title: "Improve", text: "Make targeted changes based on real SEO signals." },
  {
    n: "06",
    title: "Track",
    text: "Monitor rankings and see whether your efforts are paying off.",
  },
];

/** Section 9. What an audit actually looks at. */
const CHECKS = [
  {
    icon: Wrench,
    tint: "#0454ff",
    title: "Technical SEO",
    text: "Canonical tags, structured data, broken links, duplicate H1s and more.",
  },
  {
    icon: ListChecks,
    tint: "#0f9d58",
    title: "On-Page SEO",
    text: "Title length, meta descriptions, headings, word count and keyword usage.",
  },
  {
    icon: Gauge,
    tint: "#d9822b",
    title: "Performance",
    text: "LCP, FCP, CLS, TTFB and other page-speed signals.",
  },
  {
    icon: Link2,
    tint: "#7e3ff2",
    title: "Links",
    text: "Internal links, orphan pages, crawl depth and link equity.",
  },
  {
    icon: Share2,
    tint: "#dd6031",
    title: "Social",
    text: "Open Graph images and other social sharing elements.",
  },
  {
    icon: KeyRound,
    tint: "#0d8ea6",
    title: "Keywords",
    text: "Search volume, difficulty, CPC, search intent and SERP features.",
  },
];

/** Section 10. The questions the workflow above is built to answer. */
const QUESTIONS = [
  "What's wrong?",
  "Why does it matter?",
  "What should I look at next?",
  "What are competitors doing differently?",
  "Are my rankings improving?",
];

const PERSONAS = [
  {
    icon: Building2,
    title: "Small Businesses",
    text: "Understand what's holding your website back without needing a dedicated SEO team.",
  },
  {
    icon: Search,
    title: "SEO Professionals",
    text: "Audit websites, investigate competitors, research keywords and track rankings from one platform.",
  },
  {
    icon: Megaphone,
    title: "Marketing Teams",
    text: "Bring SEO insights into your wider marketing strategy without juggling multiple tools.",
  },
  {
    icon: Briefcase,
    title: "Agencies",
    text: "Audit client websites, analyse competitors and export reports for easier client reporting.",
  },
  {
    icon: Globe2,
    title: "Website Owners",
    text: "Get a clearer picture of your website's SEO health and know where to start improving.",
  },
];

const STATS = [
  { value: "Multiple", label: "SEO tools on one credit balance" },
  { value: "1,000", label: "pages crawled in a single audit" },
  { value: "63", label: "checks behind every page score" },
  { value: "100", label: "free credits every month" },
];

const FREE_POINTS = [
  "Multiple SEO tools unlocked",
  "Website audits",
  "Page audits",
  "Competitor analysis",
  "Internal link analysis",
  "Keyword research",
  "Keyword scoring",
  "Rank tracking",
  "No credit card required",
];

const FREE_PLAN_POINTS = [
  "100 credits every month",
  "Multiple tools",
  "Website & page audits",
  "Keyword research",
  "Rank tracking",
  "No credit card",
];

const PAID_POINTS = [
  "Larger crawls",
  "Full Keyword Magic results",
  "CSV and PDF exports",
  "Cancel anytime",
];

/**
 * Section 15. The brief's own UK wording, with the avatar and role read off the
 * shared TESTIMONIALS rather than restated — same three people the home page
 * and the US landing page show, so the faces do not change between pages.
 */
const UK_TESTIMONIALS = [
  {
    name: "Daniel Cooper",
    headline: "I replaced a £299/month SEO tool.",
    text: "The free plan gave me what I needed to get started, and the £19/month plan made sense once I needed more rank tracking, audits and keyword research.",
  },
  {
    name: "Liam Parker",
    headline: "The competitor gap report saved us weeks.",
    text: "It showed us where competitors were stronger and gave us a much clearer direction for the terms we wanted to target.",
  },
  {
    name: "Ethan Ross",
    headline: "Rank tracking finally fits into our reporting workflow.",
    text: "We can monitor rankings across multiple countries and export the data without making reporting unnecessarily complicated.",
  },
].map((t) => {
  const base = TESTIMONIALS.find((x) => x.name === t.name);
  return { ...t, role: base?.role ?? "", img: base?.img ?? "" };
});

const FAQS = [
  {
    q: "What do I get on the free plan?",
    a: "100 credits every month, refilled automatically, with no credit card. Multiple tools are unlocked on it — website audits, page audits, competitor analysis, internal link analysis, keyword research, the keyword score checker and rank tracking all draw from the same balance.",
  },
  {
    q: "How big a website can FreeSERP audit?",
    a: "A single Full Website Audit crawls up to 1,000 pages. The crawler starts at the URL you give it and follows your internal links outward, auditing every page it reaches, then organises the findings into one prioritised report.",
  },
  {
    q: "How do credits work across the multiple tools?",
    a: "One balance covers all of them, so you spend credits on the job in front of you rather than on whichever tool your plan happened to include. A full site audit costs one credit per page crawled, and rank checks, keyword research and competitor analysis draw from the same balance.",
  },
  {
    q: "What's the difference between the Full Website Audit and the Page Audit?",
    a: "The Full Website Audit crawls your whole site and reports issues rolled up across every page it reaches. The Page Audit runs one URL through 63 individual checks and explains each failure — it's what you run on the one page you're about to rewrite.",
  },
  {
    q: "Can I track rankings on google.co.uk?",
    a: "Yes. Every tracked keyword carries its own location and device, so you can track UK results nationally, narrow to a single city, and see desktop and mobile separately.",
  },
  {
    q: "Is the keyword data real, or estimated?",
    a: "Real. Search volume, keyword difficulty and CPC come from a keyword database, not from an AI estimate — which is why the numbers stay consistent between the Keyword Magic Tool, your tracked keywords and a competitor comparison.",
  },
  {
    q: "Can I export a report for a client?",
    a: "Yes. Page audits export to PDF, and audit findings and keyword tables export to CSV, so the data lives in your stack rather than behind our login.",
  },
  {
    q: "Do I need a credit card to start?",
    a: `No. The free plan needs no card and doesn't expire — there's no trial countdown. Paid plans start at ${PRICE_PREFIX}19 a month and can be cancelled at any time; email support@freeserp.com if you'd like a hand sizing one.`,
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════════════════════ */

export default function AuditSuiteUkPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className={`audit-scope ${inter.className} w-full overflow-x-hidden`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ── floating header ───────────────────────────────────────────────
          `fixed`, not `sticky`: globals.css puts overflow-x: hidden on <body>,
          which makes it a scroll container and stops sticky from ever sticking.
          The hero carries the matching top padding. The two taglines drop out
          at md and lg rather than wrapping — a three-line capsule would eat the
          top of the hero on a laptop. */}
      <header className="fixed inset-x-0 top-3 z-50 px-4 sm:top-5">
        <div className="mx-auto flex w-full max-w-[1072px] items-center gap-4 rounded-full border border-[#0d10201f] bg-white/80 py-2.5 pr-4 pl-4 backdrop-blur-xl sm:pr-6 sm:pl-6">
          <a href="#top" className="flex shrink-0 items-center gap-2.5">
            <LogoMark className="h-6.5 w-6.5" />
            <Wordmark className="text-[16px] font-semibold tracking-[-0.02em] text-[var(--ink)]" />
          </a>

          <p className="hidden min-w-0 items-center gap-3 truncate text-[13px] text-[var(--body)] md:flex">
            <span className="font-semibold text-[var(--ink)]">
              Audit. Analyse. Improve. One SEO Platform.
            </span>
            <span className="text-[var(--line)]" aria-hidden>
              |
            </span>
            <span className="hidden xl:inline">
              100 Free Credits Every Month · Multiple Tools · One Account · No Credit Card
            </span>
          </p>
        </div>
      </header>

      <main>
        {/* ── hero ────────────────────────────────────────────────────────
            The screenshot is the Full Website Audit mid-crawl — the moment the
            product is most obviously doing something, and the same hero the US
            page runs. priority + a real width/height pair: it is the LCP
            element, and a paid click cannot afford it to arrive late or shift
            the layout. */}
        <section id="top" className="relative pt-28 pb-6 sm:pt-36">
          <div className="audit-bloom" aria-hidden />

          <div className={`${WRAP} relative text-center`}>
            <span className="audit-tag">United Kingdom · Multiple SEO tools · One credit balance</span>

            <h1 className="audit-h1 mx-auto mt-6 max-w-[44ch]">
              Get a complete SEO audit of your website and discover the issues,
              opportunities, and fixes that can help you improve your search visibility.
            </h1>

            <p className="mx-auto mt-4 max-w-[28ch] text-[clamp(20px,2.6vw,30px)] leading-[1.2] font-semibold tracking-[-0.024em]">
              <span className="audit-grad-text">Turn SEO Data Into Clearer Decisions.</span>
            </p>

            <p className="audit-lead mx-auto mt-6 max-w-[68ch]">
              From full website audits and SEO tracking to competitor analysis and keyword
              research, FreeSERP puts the essential SEO tools in one place. Uncover technical
              issues, spot new opportunities, understand your competitors and track your progress —
              so you can spend less time digging through data and more time improving your search
              performance.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Cta
                page="audit_suite_uk"
                placement="hero"
                label="Start Your SEO Audit for Free"
              />
              <a href="#toolkit" className="audit-btn audit-btn-lg audit-btn-ghost">
                Explore the multiple tools
              </a>
            </div>

            <p className="mt-5 text-[14px] text-[var(--muted)]">
              100 free credits every month · Multiple tools unlocked · No credit card required
            </p>
          </div>

          <div className={`${WRAP} relative mt-12 sm:mt-16`}>
            <p className="mb-4 text-center text-[15px] font-semibold tracking-[-0.01em]">
              The Full Website Audit, mid-crawl
            </p>
            <ShotFrame
              src={HERO_SHOT.src}
              alt={HERO_SHOT.alt}
              width={HERO_SHOT.width}
              height={HERO_SHOT.height}
              sizes="(max-width: 1120px) 100vw, 1010px"
              label="app.freeserp.com/site-audit"
              priority
            />
          </div>
        </section>

        {/* ── the problem ─────────────────────────────────────────────────
            The workspace shot carries the last paragraph's claim: every tool on
            one screen, spending one balance. It is the only place on the page
            that argument can be shown rather than asserted. */}
        <section className="py-20 sm:py-28">
          <div className={WRAP}>
            <div className="audit-panel border border-[var(--line)] bg-white px-6 py-14 sm:px-12 sm:py-16">
              <div className="mx-auto max-w-[70ch] text-center">
                <span className="audit-tag">The problem</span>
                <h2 className="audit-h2 mt-5">SEO Shouldn&rsquo;t Feel Like Guesswork.</h2>
                <p className="audit-lead mt-5">
                  Your rankings can drop because of a technical issue you didn&rsquo;t spot. A
                  competitor can overtake you because they are doing something differently. A
                  valuable keyword can be sitting right in front of you.
                </p>
                <p className="mx-auto mt-7 max-w-[38ch] text-[clamp(19px,2.3vw,26px)] leading-[1.25] font-semibold tracking-[-0.022em]">
                  The challenge isn&rsquo;t getting SEO data.
                  <br />
                  <span className="text-[var(--accent)]">
                    It&rsquo;s knowing what matters — and what to do next.
                  </span>
                </p>
                <p className="audit-lead mt-7">
                  FreeSERP brings your audits, keyword research, competitor analysis, internal
                  linking and rank tracking together so you can move from finding problems to
                  taking action.
                </p>
              </div>

              <div className="mt-12">
                <ShotFrame
                  src={WORKSPACE_SHOT.src}
                  alt={WORKSPACE_SHOT.alt}
                  width={WORKSPACE_SHOT.width}
                  height={WORKSPACE_SHOT.height}
                  sizes="(max-width: 1120px) 100vw, 930px"
                  label="app.freeserp.com — your workspace"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── who it is for ───────────────────────────────────────────────
            Paid traffic arrives from one ad group with one idea of the product.
            This row lets an agency buyer and a sole trader both decide, in one
            glance, that the page is written for them. */}
        <section className="pb-20 sm:pb-28">
          <div className={WRAP}>
            <SectionHead tag="Who it's for" title="Built for Anyone Serious About Search." />

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PERSONAS.map((p) => (
                <div key={p.title} className="audit-card audit-card-lift p-7">
                  <span className="audit-icon h-11 w-11">
                    <p.icon className="h-[19px] w-[19px]" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-5 text-[19px] font-semibold tracking-[-0.02em]">{p.title}</h3>
                  <p className="mt-2.5 text-[15px] leading-[1.6] text-[var(--body)]">{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── all-in-one value ────────────────────────────────────────────── */}
        <section id="toolkit" className="relative scroll-mt-24 pb-4">
          <div className={WRAP}>
            <SectionHead
              tag="All-in-one value"
              title="Everything You Need to Understand Your SEO."
              sub="Instead of jumping between different SEO platforms, bring the essential tools together in one workspace."
            />

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {VALUE_STEPS.map((v) => (
                <div key={v.title} className="audit-card audit-card-lift p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--canvas)]">
                    <v.icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-4 text-[18px] font-semibold tracking-[-0.02em]">{v.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-[1.6] text-[var(--body)]">{v.text}</p>
                </div>
              ))}

              {/* The fifth card leaves a gap on a three-across grid; the claim
                  the section closes on fills it rather than a blank cell. */}
              <div
                className="audit-panel flex flex-col justify-center gap-3 p-7 text-[17px] leading-[1.35] font-semibold tracking-[-0.02em]"
                style={{
                  background: "#e8eeff",
                }}
              >
                {["One platform.", "Multiple SEO tools.", "One shared credit balance."].map((s) => (
                  <span key={s} className="flex items-center gap-2.5">
                    <BadgeCheck className="h-[18px] w-[18px] text-[var(--accent)]" strokeWidth={2} />
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Each tool is a gradient 40px panel, stacking visual-last so the
                prose sets up what the screenshot then shows. Each carries its
                own CTA: a visitor who came for internal links should be able to
                sign up the moment that section convinces them. */}
            <div className="mt-14 space-y-5">
              {TOOLS.map((t) => (
                <article
                  key={t.key}
                  id={t.key}
                  className="audit-panel scroll-mt-24 overflow-hidden p-5 pb-7 sm:p-8 sm:pb-10 lg:p-10 lg:pb-12"
                  style={{ background: t.tint }}
                >
                  <div className="mx-auto max-w-[800px] px-1 text-center">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/75 px-3.5 py-1.5 text-[13px] font-medium">
                      <i
                        className="h-[7px] w-[7px] rounded-full"
                        style={{ background: t.dot }}
                        aria-hidden
                      />
                      {t.kicker}
                    </span>

                    <h3 className="audit-h3 mt-5">{t.title}</h3>

                    {t.body.map((p) => (
                      <p
                        key={p}
                        className="mx-auto mt-4 max-w-[64ch] text-[16px] leading-[1.62] text-[var(--body)]"
                      >
                        {p}
                      </p>
                    ))}

                    <p className="mt-8 text-[13px] font-semibold tracking-[0.1em] text-[var(--muted)] uppercase">
                      {t.listLead}
                    </p>

                    {/* Two columns so eight bullets cost four lines of height,
                        not eight — the screenshot below is what this panel is
                        for. */}
                    {t.points && (
                      <ul className="mx-auto mt-4 grid gap-x-8 gap-y-3 text-left sm:grid-cols-2">
                        {t.points.map((p) => (
                          <li key={p} className="flex gap-3 text-[15px] leading-[1.45]">
                            <span className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/85">
                              <Check className="h-3 w-3" strokeWidth={2.8} />
                            </span>
                            {p}
                          </li>
                        ))}
                      </ul>
                    )}

                    {t.chips && (
                      <ul className="mt-4 flex flex-wrap justify-center gap-2">
                        {t.chips.map((c) => (
                          <li
                            key={c}
                            className="rounded-full bg-white/80 px-4 py-2 text-[14px] font-medium"
                          >
                            {c}
                          </li>
                        ))}
                      </ul>
                    )}

                    {t.note && (
                      <p className="mx-auto mt-6 max-w-[62ch] text-[15px] leading-[1.6] text-[var(--body)]">
                        {t.note}
                      </p>
                    )}

                    <p className="mx-auto mt-8 max-w-[54ch] text-[17px] leading-[1.45] font-medium tracking-[-0.015em]">
                      {t.kicker2}
                    </p>

                    <div className="mt-8">
                      <Cta
                        page="audit_suite_uk"
                        placement={`tool_${t.key}`}
                        label={t.ctaLabel}
                        size="sm"
                      />
                    </div>
                  </div>

                  <div className="mt-10">
                    <ShotFrame
                      src={t.shot.src}
                      alt={t.shot.alt}
                      width={t.shot.width}
                      height={t.shot.height}
                      sizes="(max-width: 1120px) 100vw, 930px"
                      label={t.shotLabel}
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── keywords: discover → assess → track ─────────────────────────
            One panel, three cards in sequence. They share a job, and running
            them as three more full-width panels would have made the tool list
            read as endless. */}
        <section id="keywords" className="scroll-mt-24 pt-5 pb-20 sm:pb-28">
          <div className={WRAP}>
            <article
              className="audit-panel overflow-hidden p-5 pb-8 sm:p-8 sm:pb-10 lg:p-10 lg:pb-12"
              style={{
                background: "#e6f2f6",
              }}
            >
              <div className="mx-auto max-w-[760px] text-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/75 px-3.5 py-1.5 text-[13px] font-medium">
                  <i
                    className="h-[7px] w-[7px] rounded-full"
                    style={{ background: "#0f8fa8" }}
                    aria-hidden
                  />
                  Keywords
                </span>
                <h3 className="audit-h3 mt-5">From Keyword Ideas to Ranking Progress.</h3>
                <p className="mx-auto mt-4 max-w-[62ch] text-[16px] leading-[1.62] text-[var(--body)]">
                  Don&rsquo;t just collect keyword data. Use it to decide what to target, where you
                  can compete and what to improve next.
                </p>
              </div>

              <div className="mt-11 grid gap-5 lg:grid-cols-3">
                {KEYWORD_STAGES.map((k) => (
                  <div
                    key={k.key}
                    className="audit-card flex flex-col bg-white/95 p-6"
                  >
                    <span className="flex items-center gap-2 text-[12.5px] font-semibold tracking-[0.08em] text-[var(--muted)] uppercase">
                      <k.icon className="h-4 w-4 text-[var(--accent)]" strokeWidth={2} />
                      {k.stage}
                    </span>
                    <h4 className="mt-3 text-[21px] leading-[1.2] font-semibold tracking-[-0.02em]">
                      {k.title}
                    </h4>

                    <div className="mt-5">
                      <ShotFrame
                        src={k.shot.src}
                        alt={k.shot.alt}
                        width={k.shot.width}
                        height={k.shot.height}
                        sizes="(max-width: 1023px) 100vw, 300px"
                      />
                    </div>

                    <p className="mt-4 text-[14.5px] leading-[1.6] text-[var(--body)]">{k.body}</p>

                    <ul className="mt-4 flex flex-wrap gap-2">
                      {k.chips.map((c) => (
                        <li
                          key={c}
                          className="rounded-full bg-[var(--canvas)] px-3 py-1.5 text-[13px] text-[var(--body)]"
                        >
                          {c}
                        </li>
                      ))}
                    </ul>

                    <p className="mt-auto pt-6 text-[13.5px] leading-[1.5] font-semibold text-[var(--ink)]">
                      {k.tool}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-10 text-center">
                <p className="flex flex-wrap items-center justify-center gap-2.5 text-[15px] font-semibold tracking-[-0.01em]">
                  {KEYWORD_STAGES.map((k, i) => (
                    <span key={k.key} className="flex items-center gap-2.5">
                      {i > 0 && (
                        <ArrowRight className="h-4 w-4 text-[var(--muted)]" strokeWidth={2} />
                      )}
                      {k.stage}
                    </span>
                  ))}
                </p>
                <p className="mx-auto mt-3 max-w-[52ch] text-[15px] leading-[1.6] text-[var(--body)]">
                  Everything you need to turn keyword data into better SEO decisions.
                </p>
                <div className="mt-7">
                  <Cta
                    page="audit_suite_uk"
                    placement="keyword_tools"
                    label="Explore Keyword Opportunities"
                    size="sm"
                  />
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* ── stats ───────────────────────────────────────────────────────── */}
        <section className="pb-20 sm:pb-28">
          <div className={WRAP}>
            <div className="audit-on-dark audit-dark audit-panel grid grid-cols-2 gap-y-10 px-8 py-12 sm:px-12 lg:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="relative text-center">
                  <div className="text-[40px] leading-none font-semibold tracking-[-0.03em] sm:text-[52px]">
                    {s.value}
                  </div>
                  <div className="mx-auto mt-3 max-w-[20ch] text-[13.5px] leading-[1.45] text-white/60">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── the workflow ────────────────────────────────────────────────
            The six steps the whole page has been describing one tool at a time,
            finally shown as one loop. It sits here rather than near the top on
            purpose: it only means anything once a reader knows what each step
            actually opens. */}
        <section id="workflow" className="scroll-mt-24 pb-20 sm:pb-28">
          <div className={WRAP}>
            <SectionHead
              tag="The FreeSERP workflow"
              title="Stop Collecting SEO Data. Start Acting on It."
              sub="One continuous SEO workflow — without the usual tool-hopping."
            />

            <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {WORKFLOW.map((w) => (
                <li key={w.n} className="audit-card audit-card-lift p-6">
                  <span className="text-[13px] font-semibold tracking-[0.08em] text-[var(--accent)]">
                    {w.n}
                  </span>
                  <h3 className="mt-2 text-[19px] font-semibold tracking-[-0.02em]">{w.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-[1.6] text-[var(--body)]">{w.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── what it checks, and why that helps ──────────────────────────
            The brief's "What FreeSERP checks" and "Why FreeSERP" merged into
            one section, as it asked: the first is what the data is, the second
            what you get to do with it, and split across two section heads they
            read as the same section twice. */}
        <section id="why" className="scroll-mt-24 pb-20 sm:pb-28">
          <div className={WRAP}>
            <SectionHead
              tag="Why FreeSERP"
              title="The SEO Details That Can Make a Difference."
              sub="FreeSERP looks beyond basic page errors. Your audits can uncover issues and opportunities across areas including:"
            />

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CHECKS.map((c) => (
                <div key={c.title} className="audit-card audit-card-lift p-7">
                  <span
                    className="audit-icon h-10 w-10"
                    style={{ "--tint": c.tint } as React.CSSProperties}
                  >
                    <c.icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-5 text-[18px] font-semibold tracking-[-0.02em]">{c.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-[1.6] text-[var(--body)]">{c.text}</p>
                </div>
              ))}
            </div>

            <p className="mx-auto mt-8 max-w-[60ch] text-center text-[16px] leading-[1.5] font-medium">
              63 checks. Multiple SEO signals. One clearer picture of your website.
            </p>

            <div className="audit-panel audit-on-dark audit-dark mt-16 px-6 py-14 sm:px-12 sm:py-16">
              <div className="mx-auto max-w-[62ch] text-center">
                <h3 className="audit-h3">
                  SEO Tools Should Help You Decide — Not Overwhelm You.
                </h3>
                <p className="mt-5 text-[16px] leading-[1.6] text-white/60">
                  You don&rsquo;t need another dashboard filled with numbers. You need to know:
                </p>
              </div>

              <ul className="mx-auto mt-9 grid max-w-[820px] gap-3 sm:grid-cols-2">
                {QUESTIONS.map((q) => (
                  <li
                    key={q}
                    className="flex items-center gap-3 rounded-2xl border border-white/12 bg-white/[0.06] px-5 py-4 text-[15px] font-medium"
                  >
                    <span
                      className="h-[7px] w-[7px] shrink-0 rounded-full bg-[#7d9bff]"
                      aria-hidden
                    />
                    {q}
                  </li>
                ))}
              </ul>

              <p className="mx-auto mt-9 max-w-[54ch] text-center text-[16px] leading-[1.6] text-white/60">
                FreeSERP connects those questions in one workflow.
              </p>

              <p className="mx-auto mt-6 flex max-w-[820px] flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[15px] font-semibold">
                {WORKFLOW.map((w, i) => (
                  <span key={w.n} className="flex items-center gap-3">
                    {i > 0 && <ArrowRight className="h-4 w-4 text-white/35" strokeWidth={2} />}
                    {w.title}
                  </span>
                ))}
              </p>

              <p className="mt-8 text-center text-[16px] font-medium text-white/75">
                Less digging. Clearer decisions. More focused SEO work.
              </p>
            </div>
          </div>
        </section>

        {/* ── the free plan ───────────────────────────────────────────────── */}
        <section id="free" className="scroll-mt-24 pb-20 sm:pb-28">
          <div className={WRAP}>
            <div className="audit-panel border border-[var(--line)] bg-white px-6 py-14 sm:px-12 sm:py-16">
              <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16">
                <div>
                  <span className="audit-tag">Free plan</span>
                  <h2 className="audit-h2 mt-5 max-w-[18ch]">
                    Start With 100 Free Credits Every Month.
                  </h2>
                  <p className="audit-lead mt-5 max-w-[50ch]">
                    Multiple SEO tools. One credit balance. No need to manage separate
                    subscriptions or keep track of different tool limits.
                  </p>
                  <p className="mt-4 max-w-[56ch] text-[15px] leading-[1.6] text-[var(--body)]">
                    Your free credits are refilled every month, giving you a simple way to keep
                    working on your SEO without committing to a paid plan. All tools are available
                    on the free plan.
                  </p>
                  <p className="mt-6 text-[17px] font-semibold tracking-[-0.015em]">
                    Start free. Upgrade only when you need more.
                  </p>
                  <div className="mt-8">
                    <Cta
                      page="audit_suite_uk"
                      placement="free_plan"
                      label="Claim Your Free Credits"
                    />
                  </div>
                </div>

                <div
                  className="audit-panel p-7 lg:w-[360px]"
                  style={{
                    background: "#e8eeff",
                  }}
                >
                  <p className="text-[13px] font-semibold tracking-[0.08em] text-[var(--muted)] uppercase">
                    Free
                  </p>
                  <p className="mt-3 text-[44px] leading-none font-semibold tracking-[-0.03em]">
                    {PRICE_PREFIX}0
                    <span className="ml-1 text-[15px] font-normal text-[var(--muted)]">/month</span>
                  </p>
                  <p className="mt-3 text-[14.5px] font-medium">100 free credits every month</p>
                  <ul className="mt-6 space-y-3">
                    {FREE_POINTS.map((p) => (
                      <li key={p} className="flex gap-2.5 text-[14.5px] leading-[1.45]">
                        <Check
                          className="mt-px h-4 w-4 shrink-0 text-[var(--accent)]"
                          strokeWidth={2.6}
                        />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── pricing ─────────────────────────────────────────────────────
            Amounts come from CREDIT_PLANS; only PRICE_PREFIX is localised. See
            the currency warning at the top of this file. */}
        <section id="pricing" className="scroll-mt-24 pb-20 sm:pb-28">
          <div className={WRAP}>
            <SectionHead
              tag="Pricing"
              title="Start Free. Scale When Your SEO Grows."
              sub="One balance covers audits, competitor analysis, internal link analysis, keyword research and rank tracking. Nothing is reserved for a higher tier."
            />

            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <article className="audit-card flex flex-col p-7">
                <h3 className="text-[15px] font-semibold">Free</h3>
                <p className="mt-4 text-[40px] leading-none font-semibold tracking-[-0.03em]">
                  {PRICE_PREFIX}0
                  <span className="ml-1 text-[14px] font-normal text-[var(--muted)]">/month</span>
                </p>
                <p className="mt-3.5 text-[13.5px] leading-[1.55] text-[var(--body)]">
                  100 credits every month, refilled automatically. Enough to audit a small site or
                  grade a handful of pages.
                </p>
                <ul className="mt-6 mb-8 space-y-3">
                  {FREE_PLAN_POINTS.map((p) => (
                    <Point key={p}>{p}</Point>
                  ))}
                </ul>
                <Cta
                  page="audit_suite_uk"
                  placement="pricing_free"
                  label="Start Free"
                  size="sm"
                  variant="ghost"
                  arrow={false}
                  className="mt-auto w-full"
                />
              </article>

              {CREDIT_PLANS.map((plan) => (
                <article
                  key={plan.slug}
                  className="audit-card relative flex flex-col p-7"
                  style={
                    plan.popular
                      ? {
                          background: "#eef2ff",
                          borderColor: "#0d102026",
                        }
                      : undefined
                  }
                >
                  {plan.popular && (
                    <span className="absolute -top-3 right-6 rounded-full bg-[var(--accent)] px-3 py-1 text-[11px] font-medium text-white">
                      Most picked
                    </span>
                  )}
                  <h3 className="text-[15px] font-semibold">{plan.label}</h3>
                  <p className="mt-4 text-[40px] leading-none font-semibold tracking-[-0.03em]">
                    {PRICE_PREFIX}
                    {plan.price}
                    <span className="ml-1 text-[14px] font-normal text-[var(--muted)]">/month</span>
                  </p>
                  <p className="mt-3.5 text-[13.5px] leading-[1.55] text-[var(--body)]">
                    {plan.credits.toLocaleString()} credits — about{" "}
                    {Math.floor(plan.credits / 200).toLocaleString()} full site audits of 200 pages
                    each. {plan.who}.
                  </p>
                  <ul className="mt-6 mb-8 space-y-3">
                    {PAID_POINTS.map((p) => (
                      <Point key={p}>{p}</Point>
                    ))}
                  </ul>
                  <Cta
                    page="audit_suite_uk"
                    placement={`pricing_${plan.slug}`}
                    label={`Choose ${plan.label}`}
                    size="sm"
                    variant={plan.popular ? "primary" : "ghost"}
                    arrow={false}
                    className="mt-auto w-full"
                  />
                </article>
              ))}
            </div>

            <p className="mt-6 text-center text-[13.5px] text-[var(--muted)]">
              Credits are shared across every tool. Top-up packs are available on any paid plan.
            </p>
          </div>
        </section>

        {/* ── social proof ────────────────────────────────────────────────
            The brief's own UK wording; the faces and roles come from the shared
            TESTIMONIALS, so the same three people appear here, on the US page
            and on the home page rather than three different sets of customers. */}
        <section className="pb-20 sm:pb-28">
          <div className={WRAP}>
            <SectionHead tag="Social proof" title="SEO Should Feel Simpler." />

            <div className="mt-12 grid gap-4 lg:grid-cols-3">
              {UK_TESTIMONIALS.map((t) => (
                <figure key={t.name} className="audit-card flex flex-col p-7">
                  <blockquote className="mb-auto">
                    <p className="text-[18px] leading-[1.3] font-semibold tracking-[-0.02em]">
                      &ldquo;{t.headline}&rdquo;
                    </p>
                    <p className="mt-3.5 text-[15px] leading-[1.6] text-[var(--body)]">{t.text}</p>
                  </blockquote>
                  <figcaption className="mt-7 flex items-center gap-3">
                    <Image
                      src={t.img}
                      alt=""
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <span>
                      <span className="block text-[14px] font-semibold">{t.name}</span>
                      <span className="block text-[13px] text-[var(--muted)]">{t.role}</span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ── faq ─────────────────────────────────────────────────────────
            Plain <details>: keyboard-accessible and announced correctly for
            free, open before React would have loaded, and Ctrl+F still finds a
            closed answer in Chrome. */}
        <section id="faq" className="scroll-mt-24 pb-20 sm:pb-28">
          <div className={WRAP}>
            <SectionHead
              tag="FAQ"
              title="Everything You Need to Know"
              sub="The questions people ask before they sign up. Anything else — support@freeserp.com."
            />

            <div className="mx-auto mt-12 max-w-[760px] space-y-3">
              {FAQS.map((f) => (
                <details key={f.q} className="audit-faq audit-card px-6 py-1">
                  <summary className="flex items-center justify-between gap-4 py-5 text-[16px] font-medium">
                    {f.q}
                    <ChevronDown
                      className="audit-chevron h-[18px] w-[18px] shrink-0 text-[var(--muted)]"
                      aria-hidden
                    />
                  </summary>
                  <p className="pb-6 text-[15px] leading-[1.65] text-[var(--body)]">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ── closing CTA and footer ────────────────────────────────────────
          Three links only: privacy, terms and a support address. Google Ads
          wants a contactable, policy-carrying advertiser; everything beyond that
          is another way to leave the page without signing up. */}
      <footer className="pb-8">
        <div className={WRAP}>
          <div className="audit-on-dark audit-dark audit-panel px-6 py-16 text-center sm:px-12 sm:py-20">
            <LogoMark className="mx-auto h-10 w-10" />
            <h2 className="audit-h2 mx-auto mt-6 max-w-[22ch]">
              Your Next SEO Improvement Starts With Knowing Where You Stand.
            </h2>
            <p className="mx-auto mt-5 max-w-[58ch] text-[16px] leading-[1.6] text-white/60">
              Audit your website. Understand your competitors. Find better keyword opportunities.
              Track your rankings. Start with 100 free credits every month and explore multiple
              SEO tools.
            </p>
            <div className="mt-8 flex justify-center">
              <Cta
                page="audit_suite_uk"
                placement="final_cta"
                label="Start Your SEO Audit for Free"
              />
            </div>
            <p className="mt-5 text-[13.5px] text-white/45">
              No credit card required. No complicated setup. Just clearer SEO insights.
            </p>

            <ul className="mx-auto mt-12 flex max-w-[720px] flex-wrap justify-center gap-x-6 gap-y-2 text-[13px] text-white/45">
              {[
                ...TOOLS.map((t) => ({ key: t.key, label: t.kicker, dot: t.dot })),
                ...KEYWORD_STAGES.map((k) => ({ key: k.key, label: k.tool, dot: "#0f8fa8" })),
              ].map((t) => (
                <li key={t.key} className="flex items-center gap-2">
                  <i
                    className="h-[6px] w-[6px] rounded-full"
                    style={{ background: t.dot }}
                    aria-hidden
                  />
                  {t.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-[13px] text-[var(--muted)]">
            <span>© {new Date().getFullYear()} FreeSERP. All rights reserved.</span>
            <div className="flex flex-wrap gap-6">
              <a href="/privacy" className="transition-colors hover:text-[var(--ink)]">
                Privacy
              </a>
              <a href="/terms" className="transition-colors hover:text-[var(--ink)]">
                Terms
              </a>
              <a
                href="mailto:support@freeserp.com"
                className="transition-colors hover:text-[var(--ink)]"
              >
                support@freeserp.com
              </a>
            </div>
          </div>
        </div>
      </footer>

      <SignupPopup
        page="audit_suite_uk"
        title="Give Your Website the"
        titleAccent="SEO Check-Up It Deserves."
        body="Sign up now and claim 100 free credits every month to audit your website, analyse competitors, research keywords and uncover opportunities to improve your search performance."
        ctaLabel="Start SEO Audit for Free"
      />
    </div>
  );
}
