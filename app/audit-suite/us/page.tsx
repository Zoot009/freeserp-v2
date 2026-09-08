import type { Metadata } from "next";
import Image from "next/image";
import { Inter } from "next/font/google";
import {
  BadgeCheck,
  Briefcase,
  Building2,
  Check,
  ChevronDown,
  Code2,
  FileDown,
  Gauge,
  KeyRound,
  Link2,
  LineChart,
  ListChecks,
  Megaphone,
  ScanSearch,
  Search,
  Sparkles,
  Star,
  Wallet,
} from "lucide-react";
import { LogoMark, Wordmark } from "@/components/landing/ui/Logo";
import { TESTIMONIALS } from "@/components/home/data";
import { CREDIT_PLANS } from "@/app/pricing/PricingPlans";
import { Cta } from "../_locale/Cta";
import { SignupPopup } from "../_locale/SignupPopup";
import { Point, SectionHead, ShotFrame, WRAP, type Shot } from "../_locale/pieces";
import "../_locale/audit.css";

/**
 * /audit-suite/us — the US paid-acquisition landing page for the audit
 * and research tools. Sibling of /tracking-suite, which sells the four trackers
 * to the same account; the two campaigns run side by side and share nothing but
 * the pricing table and the testimonials, both imported rather than restated.
 *
 * The whole page lives in this one file on purpose: copy, layout and section
 * order together, so a change to a headline and the section it sits in is one
 * edit in one place. The only pieces kept outside are ./audit.css (Next needs
 * CSS in a .css file) and the two client islands — ./Cta.tsx and
 * ./SignupPopup.tsx.
 *
 * It is otherwise a pure server component: no hooks, no state. The FAQ is a
 * native <details>, the nav is a plain bar, and everything but the popup ships
 * as static HTML — which is what keeps LCP low on a cold paid click.
 *
 * Copy is US English throughout (analyze, prioritized, organize), including in
 * the headings the brief wrote in British spelling: this is the page a US
 * searcher lands on, and the brief's own CTAs already say "Analyze".
 *
 * Separate from the marketing site's own pages by design: no global Nav, no
 * Footer, no links out except signup, privacy, terms and support. Everything a
 * visitor can click either scrolls down this page or starts a signup.
 *
 * It renders inside the root layout, so Google Ads conversion tracking (gtag
 * AW-), GA4, GTM and first-party UTM capture are all inherited — no tag setup
 * needed for a new campaign beyond pointing the ad at this URL.
 */

// Inter, scoped to this page. The rest of the site is Archivo; /tracking-suite
// is Inter, and the two campaigns have to look like the same company.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Free SEO Audit Suite for US Websites — FreeSERP",
  description:
    "Audit your whole website, grade any page across 63 checks, compare competitors, map internal links, and research keywords — multiple SEO tools on one credit balance. 100 free credits every month, no credit card.",
  alternates: { canonical: "/audit-suite/us" },
  openGraph: {
    title: "Your SEO Co-Pilot for Every Search Move",
    description:
      "Full website audits, page audits, competitor analysis, internal link analysis, keyword research and rank tracking — one account, one credit balance. No credit card.",
    url: "/audit-suite/us",
    siteName: "FreeSERP",
    type: "website",
  },
  // Paid-traffic destination, kept out of the index on purpose: it restates the
  // home page and the individual tool pages, and letting Google choose between
  // them is how a site ends up ranking its ad copy instead of its content.
  // Google Ads does not require an indexed landing page. Flip `index` to true
  // (and add the route to app/sitemap.ts) if this is ever repurposed for
  // organic search.
  robots: { index: false, follow: true },
};

/* ══════════════════════════════════════════════════════════════════════════
   CONTENT — everything a marketer edits between campaigns lives in this block.

   Every claim has to be true of the product. The tools map to real
   backend modules (site-audit, page-audit, competitor-analysis,
   ai-internal-linking, rankings, keyword-magic, keyword-analysis) and the
   prices come from CREDIT_PLANS, imported rather than restated so this page can
   never quote a figure the checkout does not honor.
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * Every screenshot on this page comes from landing-shots/ — static pages that
 * wear the product's own stylesheet and carry invented data. They are
 * pixel-identical to the dashboard; the figures in them are not measurements,
 * and nothing on this page presents them as any customer's results.
 *
 * Captured at 2× from the frame each page declares in its own class (.r8x5 is
 * 1600×1000, .r4x3 1120×840). The page is the crop, so there is nothing to
 * trim. To refresh one: open the .html, DevTools → Capture full size screenshot
 * at DPR 2, overwrite the file in /public/shots.
 */
const HERO_SHOT: Shot = {
  src: "/shots/audit-suite/site-audit-crawl.png",
  width: 3200,
  height: 2000,
  alt: "FreeSERP Full Website Audit mid-crawl: 428 of 1,000 pages crawled, with the issues found so far — missing alt text, slow Largest Contentful Paint, short meta descriptions, duplicate H1s and broken internal links — each labeled Critical, Warning or Notice",
};

interface Tool {
  key: string;
  kicker: string;
  title: string;
  body: string[];
  /** Introduces the bullet list — "See:", "Get:", "Compare:", "Discover:". */
  listLead: string;
  points: string[];
  /** A closing line under the bullets, where the brief gave one. */
  kicker2?: string;
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
    title: "Know what's happening across your entire website.",
    body: [
      "Crawl your website and uncover the technical, SEO, performance, UX, link, technology and social issues that may be affecting your search performance.",
      "FreeSERP crawls up to 1,000 pages in a single audit and turns the results into a prioritized report instead of leaving you with an overwhelming list of problems.",
    ],
    listLead: "See:",
    points: [
      "Critical, Warning and Notice findings",
      "Issues grouped by type or page",
      "The affected URLs and exact elements",
      "Site-wide and category-level scores",
      "Technical and on-page SEO issues",
      "Performance and page-speed signals",
      "Broken links and internal linking issues",
      "Missing or incorrect SEO elements",
    ],
    ctaLabel: "Audit My Website for Free",
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
    title: "One page. 63 checks. A clearer path to improvement.",
    body: [
      "Want to understand why a specific page isn't performing? Grade a page across 63 checks covering SEO, performance, UI/UX, links, technology and social signals.",
      "Instead of simply telling you that something is wrong, FreeSERP explains what it found, why it matters and where to look.",
    ],
    listLead: "Get:",
    points: [
      "One overall page score",
      "Six category-level grades",
      "Critical and Warning issues",
      "Explanations for failed checks",
      "Actionable findings you can work through",
      "PDF reporting",
      "Follow-up questions about your completed audit",
    ],
    ctaLabel: "Check My Page",
    shot: {
      src: "/shots/audit-suite/page-audit.png",
      width: 2240,
      height: 1680,
      alt: "A FreeSERP page audit report: the page's overall score and category grades beside the list of failed checks, each with an explanation of what was found and why it matters",
    },
    shotLabel: "app.freeserp.com — Page Audit",
    tint: "#e7f4ec",
    dot: "#0f9d58",
  },
  {
    key: "competitors",
    kicker: "Competitor Analysis",
    title: "Don't just study your competitors. Understand what they're doing differently.",
    body: [
      "Choose a keyword and compare your page with the pages ranking above you.",
      "See how your page stacks up against competing pages across the same SEO checks — so you can identify the differences that may be helping them outrank you.",
    ],
    listLead: "Compare:",
    points: [
      "SEO scores",
      "SERP positions",
      "Title length",
      "Meta descriptions",
      "Word count",
      "Keyword usage",
      "On-page SEO signals",
      "Other page-level factors",
    ],
    kicker2: "Stop asking, “Why are they ranking?” Start seeing what they are doing differently.",
    ctaLabel: "Analyze My Competitors",
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
    kicker: "Internal Link Analysis",
    title: "Find the pages your website isn't connecting.",
    body: [
      "Your internal links help search engines understand your website. FreeSERP maps your internal link structure so you can see how pages connect — and where valuable pages may be getting overlooked.",
    ],
    listLead: "Discover:",
    points: [
      "Orphan pages",
      "Internal links",
      "Pages with the most connections",
      "Crawl depth from your homepage",
      "Inbound and outbound links",
      "Internal link equity distribution",
      "Areas where your site structure can improve",
    ],
    ctaLabel: "Analyze My Site Structure",
    shot: {
      src: "/shots/audit-suite/link-graph.png",
      width: 2240,
      height: 1680,
      alt: "FreeSERP internal link analysis: 428 pages, 3,914 internal links, 4 orphan pages and a max depth of 5, drawn as a node graph with hub, authority and orphan pages colored apart",
    },
    shotLabel: "app.freeserp.com — Internal Links",
    tint: "#f0eafb",
    dot: "#7e3ff2",
  },
];

interface KeywordTool {
  key: string;
  kicker: string;
  title: string;
  body: string[];
  listLead: string;
  points: string[];
  footnote: string;
  /** The card's hue — the dot beside its kicker. */
  tint: string;
  shot: Shot;
}

/**
 * The three keyword tools, merged into one section as three cards rather than
 * three full-width panels: they share a job (finding and following the terms
 * you rank for) and running them as three more alternating panels would have
 * made the tool list read as endless.
 */
const KEYWORD_TOOLS: KeywordTool[] = [
  {
    key: "tracking",
    tint: "#0d8ea6",
    kicker: "Keyword Tracking",
    // The brief's headline for this tool — "Know where you rank, and where
    // you're heading" — is the section head above; the card takes the next line
    // of its own copy so the two do not read as the same sentence twice.
    title: "Keep your SEO performance in one clear view.",
    body: [
      "Track your keywords across projects and monitor positions, movement, search volume, traffic and ranking URLs over time.",
    ],
    listLead: "Monitor:",
    points: [
      "Keyword positions",
      "Ranking movement",
      "Search volume",
      "Traffic",
      "Ranking URLs",
      "SERP features",
      "Top 3 and Top 10 rankings",
      "Device and search engine performance",
    ],
    footnote: "Filter, organize, star and export the keywords that matter most.",
    shot: {
      src: "/shots/audit-suite/keywords-all.png",
      width: 3200,
      height: 2000,
      alt: "FreeSERP keyword tracking: every tracked keyword across projects with position, day-over-day movement, search volume, traffic and the ranking URL, above a filter bar",
    },
  },
  {
    key: "research",
    tint: "#0454ff",
    kicker: "Keyword Magic Tool",
    title: "Find the search terms worth targeting next.",
    body: [
      "Start with a seed keyword and discover hundreds of related search opportunities.",
      "See search volume, keyword difficulty, CPC and search intent, then group related terms into topics that can help shape your next content plan.",
    ],
    listLead: "Discover:",
    points: [
      "Related keywords",
      "Search volume",
      "Keyword difficulty",
      "CPC",
      "Search intent",
      "SERP features",
      "Broad, Phrase and Exact matches",
      "Keyword topic groups",
    ],
    footnote: "Real keyword data to support real SEO decisions.",
    shot: {
      src: "/shots/audit-suite/keyword-magic.png",
      width: 3200,
      height: 2000,
      alt: "The FreeSERP Keyword Magic Tool: keyword ideas grouped into topics with search volume, keyword difficulty, CPC and search intent for each term",
    },
  },
  {
    key: "score",
    tint: "#7e3ff2",
    kicker: "Keyword Score Checker",
    title: "Before you publish, check how well your page is built to rank.",
    body: [
      "Have a target keyword in mind? Check your page against it and see how well your content and SEO signals support that target.",
      "FreeSERP combines on-page, off-page, authority and performance signals to give you a clearer picture of your page's ranking readiness.",
    ],
    listLead: "Check:",
    points: [
      "On-page SEO",
      "Off-page signals",
      "Domain Authority",
      "Page Authority",
      "Backlinks",
      "TTFB",
      "FCP",
      "LCP",
      "CLS",
    ],
    footnote: "A readiness score you can act on before the page goes live.",
    shot: {
      src: "/shots/audit-suite/keyword-score.png",
      width: 2240,
      height: 1680,
      alt: "A FreeSERP keyword score report: an overall grade of 86 built from on-page and off-page SEO, with Domain Authority, Page Authority, backlink counts and TTFB, FCP, LCP and CLS beneath",
    },
  },
];

const PROBLEM_STEPS = [
  { n: "01", label: "Find the issue." },
  { n: "02", label: "Understand the opportunity." },
  { n: "03", label: "Take action." },
  { n: "04", label: "Track the result." },
];

const PERSONAS = [
  {
    icon: Search,
    title: "SEO Specialists",
    text: "Audit websites, research keywords, analyze competitors and monitor rankings from one platform.",
  },
  {
    icon: Briefcase,
    title: "Agencies & Consultants",
    text: "Audit prospects before a pitch, work through client websites and create reports without switching between several tools.",
  },
  {
    icon: Megaphone,
    title: "Marketing Teams",
    text: "Turn website and search data into clear SEO priorities.",
  },
  {
    icon: Building2,
    title: "Business Owners",
    text: "Understand your website's SEO without having to become an SEO specialist.",
  },
  {
    icon: Code2,
    title: "Developers",
    text: "Find technical issues, broken links, performance problems and pages that need attention.",
  },
];

const STATS = [
  { value: "Multiple", label: "SEO tools on one credit balance" },
  { value: "1,000", label: "pages crawled in a single audit" },
  { value: "63", label: "checks behind every page score" },
  { value: "100", label: "free credits every month" },
];

/**
 * What FreeSERP analyzes. The brief's own note — "the current Audit Suite
 * already supports these categories of checks and data" — is the reason this
 * list is safe to publish, and is kept here rather than on the page: it is a
 * note to the writer, not a sentence a visitor needs to read.
 */
const ANALYSES = [
  {
    icon: ListChecks,
    tint: "#0454ff",
    title: "Website & On-Page SEO",
    items: [
      "Title length",
      "Meta descriptions",
      "H1s",
      "Alt text",
      "Word count",
      "Keyword usage",
      "Structured data",
      "Canonical tags",
    ],
  },
  {
    icon: Gauge,
    tint: "#d9822b",
    title: "Performance",
    items: ["LCP", "FCP", "CLS", "TTFB", "Page speed"],
  },
  {
    icon: Link2,
    tint: "#7e3ff2",
    title: "Links & Structure",
    items: ["Broken links", "Orphan pages", "Crawl depth", "Internal links", "Link equity"],
  },
  {
    icon: KeyRound,
    tint: "#0d8ea6",
    title: "Keyword & Search Data",
    items: [
      "Search volume",
      "Keyword difficulty",
      "CPC",
      "Search intent",
      "SERP features",
    ],
  },
];

/** Why FreeSERP. Same caveat as ANALYSES: these all describe shipped behavior. */
const BENEFITS = [
  {
    icon: Wallet,
    title: "One balance. Every tool.",
    text: "Use your credits across audits, competitor analysis, keyword research and rank tracking.",
  },
  {
    icon: ListChecks,
    title: "Prioritized findings.",
    text: "See what needs attention first with Critical, Warning and Notice findings.",
  },
  {
    icon: LineChart,
    title: "Real keyword data.",
    text: "Search volume, difficulty and CPC come from a keyword database rather than AI-generated estimates.",
  },
  {
    icon: Sparkles,
    title: "Clear explanations.",
    text: "Understand what an issue means and why it matters.",
  },
  {
    icon: FileDown,
    title: "Your data, your reports.",
    text: "Export findings to PDF or CSV when you need to share them.",
  },
  {
    icon: ScanSearch,
    title: "Follow your progress.",
    text: "Audit your site, make improvements and track what changes afterwards.",
  },
];

const FREE_POINTS = [
  "100 free credits every month",
  "Multiple tools unlocked",
  "Website and page audits",
  "Competitor analysis",
  "Internal link analysis",
  "Keyword research",
  "SEO tracking",
  "No credit card required",
];

const PAID_POINTS = [
  "Bigger crawls and more audits",
  "Automated recurring checks",
  "CSV and PDF export",
  "Cancel anytime",
];

const FAQS = [
  {
    q: "What do I get on the free plan?",
    a: "100 credits every month, refilled automatically, with no credit card. Multiple tools are unlocked on it — website audits, page audits, competitor analysis, internal link analysis, keyword research, the keyword score checker and rank tracking all draw from the same balance.",
  },
  {
    q: "How big a website can FreeSERP audit?",
    a: "A single Full Website Audit crawls up to 1,000 pages. The crawler starts at the URL you give it and follows your internal links outward, auditing every page it reaches, then rolls the findings up into one prioritized report.",
  },
  {
    q: "How do credits work across the multiple tools?",
    a: "One balance covers all of them, so you spend credits on the job in front of you rather than on whichever tool your plan happened to include. A full site audit costs one credit per page crawled, and rank checks, keyword research and competitor analysis draw from the same balance.",
  },
  {
    q: "What is the difference between the Full Website Audit and the Page Audit?",
    a: "The Full Website Audit crawls your whole site and reports issues rolled up across every page it reaches. The Page Audit grades one URL against 63 individual checks and explains each failure — it is what you run on the one page you are about to rewrite.",
  },
  {
    q: "Is the keyword data real, or estimated?",
    a: "Real. Search volume, keyword difficulty and CPC come from a keyword database, not from an AI estimate — which is why the numbers stay consistent between the Keyword Magic Tool, your tracked keywords and a competitor comparison.",
  },
  {
    q: "Can I track rankings in the United States specifically?",
    a: "Yes. Every tracked keyword carries its own location and device, so you can track google.com results for the US nationally, or narrow to a single city, and see desktop and mobile separately.",
  },
  {
    q: "Can I export a report for a client?",
    a: "Yes. Page audits export to PDF, and the audit findings and keyword tables export to CSV, so the data lives in your stack rather than behind our login.",
  },
  {
    q: "Do I need a credit card to start?",
    a: "No. The free plan needs no card and does not expire — there is no trial countdown. Paid plans start at $19/month and can be cancelled at any time; email support@freeserp.com if you want a hand sizing one.",
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════════════════════ */

export default function AuditSuiteUsPage() {
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
          `fixed`, not `sticky`, for the same reason the site Nav is:
          globals.css puts overflow-x: hidden on <body>, which makes it a scroll
          container and stops sticky from ever sticking. The hero carries the
          matching top padding.
          The two taglines drop out at md and lg rather than wrapping — a
          three-line capsule would eat the top of the hero on a laptop. */}
      <header className="fixed inset-x-0 top-3 z-50 px-4 sm:top-5">
        <div className="mx-auto flex w-full max-w-[1072px] items-center gap-4 rounded-full border border-[#0d10201f] bg-white/80 py-2.5 pr-4 pl-4 backdrop-blur-xl sm:pr-6 sm:pl-6">
          <a href="#top" className="flex shrink-0 items-center gap-2.5">
            <LogoMark className="h-6.5 w-6.5" />
            <Wordmark className="text-[16px] font-semibold tracking-[-0.02em] text-[var(--ink)]" />
          </a>

          <p className="hidden min-w-0 items-center gap-3 truncate text-[13px] text-[var(--body)] md:flex">
            <span className="font-semibold text-[var(--ink)]">
              Audit. Analyze. Improve. All in One SEO Platform.
            </span>
            <span className="text-[var(--line)]" aria-hidden>
              |
            </span>
            <span className="hidden xl:inline">
              100 Free Credits Every Month · Multiple Tools · One Account. No Credit Card.
            </span>
          </p>
        </div>
      </header>

      <main>
        {/* ── hero ────────────────────────────────────────────────────────
            The screenshot is the Full Website Audit mid-crawl — the moment the
            product is most obviously doing something. priority + a real
            width/height pair: it is the LCP element, and a paid click cannot
            afford it to arrive late or shift the layout. */}
        <section id="top" className="relative pt-28 pb-6 sm:pt-36">
          <div className="audit-bloom" aria-hidden />

          <div className={`${WRAP} relative text-center`}>
            <span className="audit-tag">
              United States · Multiple SEO tools · One credit balance
            </span>

            <h1 className="audit-h1 mx-auto mt-6 max-w-[19ch]">
              Your SEO Co-Pilot for Every Search Move.
            </h1>

            <p className="mx-auto mt-4 max-w-[28ch] text-[clamp(20px,2.6vw,30px)] leading-[1.2] font-semibold tracking-[-0.024em]">
              <span className="audit-grad-text">Turn SEO Data Into Clearer Decisions.</span>
            </p>

            <p className="audit-lead mx-auto mt-6 max-w-[68ch]">
              From full website audits and SEO tracking to competitor analysis and keyword
              research, FreeSERP puts the essential SEO tools in one place. Uncover technical
              issues, spot new opportunities, understand your competitors, and track your
              progress — so you can spend less time digging through data and more time improving
              your search performance.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Cta page="audit_suite_us" placement="hero" label="Start SEO Audit for Free" />
              <a href="#toolkit" className="audit-btn audit-btn-lg audit-btn-ghost">
                Explore the multiple tools
              </a>
            </div>

            <p className="mt-5 text-[14px] text-[var(--muted)]">
              100 free credits every month · no credit card · every tool unlocked
            </p>
          </div>

          <div className={`${WRAP} relative mt-12 sm:mt-16`}>
            {/* The brief asks for this label above the shot, in bold. */}
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
            Sits between the hero shot and the audience row, per the brief: the
            visitor has just seen what the product does, and this is where they
            recognize the reason they clicked. */}
        <section className="py-20 sm:py-28">
          <div className={WRAP}>
            <div className="audit-panel border border-[var(--line)] bg-white px-6 py-14 sm:px-12 sm:py-16">
              <div className="mx-auto max-w-[70ch] text-center">
                <span className="audit-tag">The problem</span>
                <h2 className="audit-h2 mt-5">SEO shouldn&rsquo;t feel like a guessing game.</h2>
                <p className="audit-lead mt-5">
                  Your rankings change. Your competitors move. Pages lose visibility. Technical
                  issues go unnoticed. And finding the right keywords can take hours.
                </p>
                <p className="audit-lead mt-4">
                  FreeSERP brings the essential data together so you can see what&rsquo;s
                  happening, understand why it matters, and decide what to do next.
                </p>
              </div>

              <ol className="mx-auto mt-12 grid max-w-[880px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {PROBLEM_STEPS.map((s) => (
                  <li
                    key={s.n}
                    className="audit-card audit-card-lift bg-[var(--canvas)] p-5 text-left"
                  >
                    <span
                      className="text-[13px] font-semibold tracking-[0.08em] text-[var(--accent)]"
                      aria-hidden
                    >
                      {s.n}
                    </span>
                    <p className="mt-2 text-[16px] leading-[1.35] font-medium tracking-[-0.01em]">
                      {s.label}
                    </p>
                  </li>
                ))}
              </ol>

              <div className="mt-10 flex justify-center">
                <a href="#toolkit" className="audit-btn audit-btn-lg audit-btn-primary">
                  Explore Free SEO Tools
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── who it is for ───────────────────────────────────────────────
            Paid traffic arrives from one ad group with one idea of the product.
            This row lets an agency buyer and a solo business owner both decide,
            in one glance, that the page is written for them. */}
        <section className="pb-20 sm:pb-28">
          <div className={WRAP}>
            <SectionHead
              tag="Who it is for"
              title="Built for anyone responsible for better search performance."
            />

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

        {/* ── the toolkit ─────────────────────────────────────────────────── */}
        <section id="toolkit" className="relative scroll-mt-24 pb-4">
          <div className={WRAP}>
            <SectionHead
              tag="All-in-one value"
              title="One SEO platform. Everything you need to make your next move."
              sub="Why switch between multiple SEO tools when your website audit, keyword research, competitor analysis and rank tracking can work from one place?"
            />

            <p className="audit-lead mx-auto mt-5 max-w-[64ch] text-center">
              FreeSERP gives you multiple connected SEO tools with one shared credit balance — so you
              can move from finding a problem to investigating it, fixing it, and tracking what
              happens next.
            </p>

            <ul className="mt-9 flex flex-wrap justify-center gap-3">
              {["One account.", "Multiple SEO tools.", "One shared credit balance."].map((s) => (
                <li
                  key={s}
                  className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-4 py-2 text-[14px] font-medium"
                >
                  <BadgeCheck className="h-4 w-4 text-[var(--accent)]" strokeWidth={2} />
                  {s}
                </li>
              ))}
            </ul>

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

                    {t.kicker2 && (
                      <p className="mx-auto mt-8 max-w-[52ch] text-[17px] leading-[1.45] font-medium tracking-[-0.015em]">
                        {t.kicker2}
                      </p>
                    )}

                    <div className="mt-8">
                      <Cta page="audit_suite_us" placement={`tool_${t.key}`} label={t.ctaLabel} size="sm" />
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

        {/* ── SEO tracking: the three keyword tools ───────────────────────
            One panel, three cards. They share a job, and three more full-width
            panels would have made the tool list read as endless. */}
        <section id="seo-tracking" className="scroll-mt-24 pt-5 pb-20 sm:pb-28">
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
                  SEO Tracking
                </span>
                <h3 className="audit-h3 mt-5">
                  Know where you rank — and where you&rsquo;re heading.
                </h3>
                <p className="mx-auto mt-4 max-w-[62ch] text-[16px] leading-[1.62] text-[var(--body)]">
                  Three tools that work on the same keywords: find the terms worth targeting,
                  check whether a page is built to rank for one, then follow the position it earns.
                </p>
              </div>

              <div className="mt-11 grid gap-5 lg:grid-cols-3">
                {KEYWORD_TOOLS.map((k) => (
                  <div
                    key={k.key}
                    className="audit-card flex flex-col bg-white/95 p-6"
                  >
                    <span className="flex items-center gap-2 text-[12.5px] font-semibold tracking-[0.08em] text-[var(--muted)] uppercase">
                      <i
                        className="audit-dot"
                        style={{ "--tint": k.tint } as React.CSSProperties}
                        aria-hidden
                      />
                      {k.kicker}
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

                    {k.body.map((p) => (
                      <p key={p} className="mt-4 text-[14.5px] leading-[1.6] text-[var(--body)]">
                        {p}
                      </p>
                    ))}

                    <p className="mt-6 text-[12px] font-semibold tracking-[0.1em] text-[var(--muted)] uppercase">
                      {k.listLead}
                    </p>
                    <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                      {k.points.map((p) => (
                        <li key={p} className="flex gap-2.5 text-[14px] leading-[1.45]">
                          <Check
                            className="mt-px h-4 w-4 shrink-0 text-[var(--accent)]"
                            strokeWidth={2.6}
                          />
                          {p}
                        </li>
                      ))}
                    </ul>

                    <p className="mt-auto pt-6 text-[13.5px] leading-[1.5] font-medium text-[var(--ink)]">
                      {k.footnote}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Cta page="audit_suite_us" placement="keyword_tools" label="Start Tracking My Keywords" size="sm" />
                <span className="text-[13.5px] text-[var(--body)]">
                  All three run on the same 100 free credits.
                </span>
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

        {/* ── what it analyzes, and why it is different ────────────────────
            The brief's "What FreeSERP analyses" and "Why FreeSERP" merged into
            one section, as it asked: the first answers what the data is, the
            second what the product does with it, and split across two section
            heads they read as the same section twice. */}
        <section id="why" className="scroll-mt-24 pb-20 sm:pb-28">
          <div className={WRAP}>
            <SectionHead
              tag="Why FreeSERP"
              title="Go beyond the basics."
              sub="FreeSERP looks at the details behind your SEO performance — and turns them into something you can decide from, rather than a wall of data."
            />

            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {ANALYSES.map((a) => (
                <div key={a.title} className="audit-card audit-card-lift p-7">
                  <span
                    className="audit-icon h-10 w-10"
                    style={{ "--tint": a.tint } as React.CSSProperties}
                  >
                    <a.icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-5 text-[18px] font-semibold tracking-[-0.02em]">{a.title}</h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {a.items.map((i) => (
                      <li
                        key={i}
                        className="rounded-full bg-[var(--canvas)] px-3 py-1.5 text-[13px] text-[var(--body)]"
                      >
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <p className="mx-auto mt-16 max-w-[52ch] text-center text-[clamp(20px,2.4vw,28px)] leading-[1.22] font-semibold tracking-[-0.022em]">
              SEO tools should help you decide — not overwhelm you with data.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {BENEFITS.map((b) => (
                <div key={b.title} className="audit-card audit-card-lift p-7">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--canvas)]">
                    <b.icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-5 text-[17px] font-semibold tracking-[-0.02em]">{b.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-[1.6] text-[var(--body)]">{b.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── the free plan ───────────────────────────────────────────────── */}
        <section id="free" className="scroll-mt-24 pb-20 sm:pb-28">
          <div className={WRAP}>
            <div className="audit-on-dark audit-dark audit-panel px-6 py-14 sm:px-12 sm:py-16">
              <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[13px] font-medium">
                    Free plan
                  </span>
                  <h2 className="audit-h2 mt-5 max-w-[18ch]">
                    Start with 100 free credits. Refilled every month.
                  </h2>
                  <p className="mt-5 max-w-[52ch] text-[17px] leading-[1.55] text-white/65">
                    No trial countdown. No credit card requirement.
                  </p>
                  <p className="mt-4 max-w-[56ch] text-[15px] leading-[1.6] text-white/55">
                    Your credits work across the platform, so you can use them for the SEO task you
                    need rather than being restricted to one tool.
                  </p>
                  <div className="mt-9">
                    <Cta page="audit_suite_us" placement="free_plan" label="Claim My 100 Free Credits" />
                  </div>
                </div>

                <div className="rounded-3xl border border-white/15 bg-white/[0.06] p-7 backdrop-blur-sm lg:w-[360px]">
                  <p className="text-[13px] font-semibold tracking-[0.08em] text-white/50 uppercase">
                    Create your free account and get
                  </p>
                  <ul className="mt-5 space-y-3">
                    {FREE_POINTS.map((p) => (
                      <li key={p} className="flex gap-2.5 text-[14.5px] leading-[1.45]">
                        <Check className="mt-px h-4 w-4 shrink-0 text-[#8fb4ff]" strokeWidth={2.6} />
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
            Prices come from CREDIT_PLANS. The "what it buys" line uses the same
            divisor the pricing page does: a full site audit is one credit per
            page crawled, so credits / 200 is roughly how many mid-sized site
            audits a balance covers. */}
        <section id="pricing" className="scroll-mt-24 pb-20 sm:pb-28">
          <div className={WRAP}>
            <SectionHead
              tag="Pricing"
              title="Start free. Pay when you outgrow it."
              sub="One balance covers audits, competitor analysis, internal link analysis, keyword research and rank tracking. Nothing is reserved for a higher tier."
            />

            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <article className="audit-card flex flex-col p-7">
                <h3 className="text-[15px] font-semibold">Free</h3>
                <p className="mt-4 text-[40px] leading-none font-semibold tracking-[-0.03em]">
                  $0
                  <span className="ml-1 text-[14px] font-normal text-[var(--muted)]">/mo</span>
                </p>
                <p className="mt-3.5 text-[13.5px] leading-[1.55] text-[var(--body)]">
                  100 credits every month, refilled automatically. Enough to audit a small site or
                  grade a handful of pages.
                </p>
                <ul className="mt-6 mb-8 space-y-3">
                  {[
                    "Multiple tools unlocked",
                    "Website and page audits",
                    "Real keyword data",
                    "No credit card required",
                  ].map((p) => (
                    <Point key={p}>{p}</Point>
                  ))}
                </ul>
                <Cta
                  page="audit_suite_us"
                  placement="pricing_free"
                  label="Start for free"
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
                    ${plan.price}
                    <span className="ml-1 text-[14px] font-normal text-[var(--muted)]">/mo</span>
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
                    page="audit_suite_us"
                    placement={`pricing_${plan.slug}`}
                    label={`Get ${plan.label}`}
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

        {/* ── testimonials ────────────────────────────────────────────────
            The same three quotes the home page runs, imported rather than
            re-written: a landing page that invents its own customers is one
            whose social proof contradicts the site the moment a visitor clicks
            through. framerusercontent.com is already in next.config's
            remotePatterns, so next/image can optimize the avatars. */}
        <section className="pb-20 sm:pb-28">
          <div className={WRAP}>
            <SectionHead tag="Testimonials" title="Results from real customers" />

            <div className="mt-12 grid gap-4 lg:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <figure key={t.name} className="audit-card flex flex-col p-7">
                  <div className="flex gap-1 text-[#f5a623]" aria-label="Rated 5 out of 5">
                    {[0, 1, 2, 3, 4].map((s) => (
                      <Star key={s} className="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} />
                    ))}
                  </div>
                  <blockquote className="mt-5 mb-auto text-[15px] leading-[1.6]">
                    {t.text}
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
              title="Everything you need to know"
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
            <h2 className="audit-h2 mx-auto mt-6 max-w-[18ch]">
              Turn SEO data into your next clear decision
            </h2>
            <p className="mx-auto mt-5 max-w-[56ch] text-[16px] leading-[1.6] text-white/60">
              Multiple SEO tools, one account, one shared credit balance. 100 free credits every
              month, no credit card, and everything unlocked from the first day.
            </p>
            <div className="mt-8 flex justify-center">
              <Cta page="audit_suite_us" placement="final_cta" label="Start SEO Audit for Free" />
            </div>

            <ul className="mx-auto mt-12 flex max-w-[720px] flex-wrap justify-center gap-x-6 gap-y-2 text-[13px] text-white/45">
              {[
                ...TOOLS.map((t) => ({ key: t.key, label: t.kicker, dot: t.dot })),
                ...KEYWORD_TOOLS.map((k) => ({ key: k.key, label: k.kicker, dot: "#0f8fa8" })),
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

      {/* The inline "Turn Your Website Into Your Next SEO Opportunity" band used
          to live under the hero. It is this instead: the same offer, asked for
          eight seconds in, once per session. */}
      <SignupPopup
        page="audit_suite_us"
        title="Turn Your Website Into Your Next"
        titleAccent="SEO Opportunity"
        body="Start with 100 free credits every month and use them across FreeSERP to audit your website, analyze competitors, research keywords, and track your SEO progress."
        ctaLabel="Start SEO Audit for Free"
      />
    </div>
  );
}
