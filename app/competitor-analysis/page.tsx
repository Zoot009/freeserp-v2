import type { Metadata } from "next";
import Image from "next/image";
import { Inter } from "next/font/google";
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  Columns3,
  Download,
  FileText,
  Gauge,
  Layers,
  Link2,
  ListTree,
  MessageSquareText,
  Network,
  RefreshCw,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { LogoMark, Wordmark } from "@/components/landing/ui/Logo";
import { TESTIMONIALS } from "@/components/home/data";
import { CREDIT_PLANS } from "@/app/pricing/PricingPlans";
import { Cta } from "./Cta";
import { SignupPopup } from "./SignupPopup";
import "./ads.css";

/**
 * /competitor-analysis — the paid-acquisition landing page for the Competitor
 * Analysis tool, told layer by layer.
 *
 * The fourth page in the ad family, and built on /ai-rank-tracker: same dark
 * hero band with the screenshot hanging off it, same tinted blocks, same timed
 * popup on scroll depth. What it sells is different enough to need its own
 * page — /tracking-suite sells the rank trackers, /audit-suite gives competitor
 * analysis one tab in a tool carousel, and neither has room for the thing that
 * actually makes this tool worth paying for: where every number in the
 * comparison comes from, and how the score weighs them.
 *
 * Those details are not decoration. They come from
 * freeserp-backend-v2/src/modules/competitor-analysis — lib/seoScore.ts blends
 * on-page 30% with off-page 70% and falls back to on-page alone when the
 * authority provider has nothing, lib/gaps.ts pre-computes every yours-vs-their-
 * average figure before the model is asked anything, ca.routes.ts caps an
 * analysis at ten competitor URLs, lib/access.ts is what makes chat paid-only
 * and the plan on-page-only past the free daily analysis, and credits/catalog.ts
 * prices a run at 5 credits and a chat message at 1. A landing page that
 * flattened all that into "we compare you with your competitors" would be
 * selling something less trustworthy than the product actually is.
 *
 * The whole page lives in this one file: copy and layout together, so a change
 * to a headline and the section it sits in is one edit in one place. The only
 * pieces outside are ./ads.css (Next needs CSS in a .css file) and the two
 * client islands, ./Cta and ./SignupPopup.
 *
 * It is otherwise a pure server component: no hooks, no state, no hydration.
 * The FAQ is a native <details> and the page ships as static HTML, which is
 * what keeps LCP low on a cold paid click.
 *
 * It renders inside the root layout, so Google Ads conversion tracking (gtag
 * AW-), GA4, GTM and first-party UTM capture are all inherited — no tag setup
 * needed for a new campaign beyond pointing the ad at this URL.
 */

// Inter, scoped to this page — the same typeface as /ai-rank-tracker, whose
// typographic system this page shares. The rest of the marketing site is
// Archivo.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SEO Competitor Analysis — your page against the ones outranking it — FreeSERP",
  description:
    "Put your page beside the pages beating you for a keyword. FreeSERP crawls both sides, scores them on the same checks — title, headings, content, speed, schema, internal links, domain and page authority — and turns every gap into a prioritised plan. 100 free credits every month, no credit card.",
  alternates: { canonical: "/competitor-analysis" },
  openGraph: {
    title: "Why are they ranking above you?",
    description:
      "Your page and the pages outranking it, scored check by check — on-page, technical, internal links and authority — with the gaps written up as a prioritised action plan.",
    url: "/competitor-analysis",
    siteName: "FreeSERP",
    type: "website",
  },
  // Paid-traffic destination, kept out of the index on purpose, exactly as
  // /ai-rank-tracker, /audit-suite and /tracking-suite are: it restates the home
  // page and the tool pages, and letting Google choose between them is how a
  // site ends up ranking its ad copy instead of its content. Google Ads does not
  // require an indexed landing page. Flip `index` to true (and add the route to
  // app/sitemap.ts) if this is ever repurposed for organic search.
  robots: { index: false, follow: true },
};

/* ══════════════════════════════════════════════════════════════════════════
   CONTENT — everything a marketer edits between campaigns lives in this block.

   Every claim has to be true of the product. The comparison rows come from
   freeserp-frontend-v2/components/competitor-comparison-table.tsx, the score
   weighting from competitor-analysis/lib/seoScore.ts, the gap list from
   lib/gaps.ts, the plan categories from ai/ai.service.ts, the limits from
   ca.routes.ts, the credit costs from the backend's credits/catalog.ts, and the
   prices from CREDIT_PLANS, imported rather than restated so this page can
   never quote a figure checkout does not honour.
   ══════════════════════════════════════════════════════════════════════════ */

type Shot = { src: string; width: number; height: number; alt: string };

/**
 * The screenshot comes from freeserp-dummy-pages — static pages that wear the
 * product's own stylesheet (freeserp-frontend-v2/app/dashboard.css, included
 * verbatim) and carry invented data. It is pixel-identical to the dashboard;
 * the figures in it are not measurements, and nothing on this page presents
 * them as any customer's results.
 *
 * Captured at 2× from the frame the page declares in its own class (.r4x3 is
 * 1120×840). The page is the crop, so there is nothing to trim.
 */
const HERO_SHOT: Shot = {
  src: "/shots/competitor-analysis.png",
  width: 2240,
  height: 1680,
  alt: "FreeSERP competitor analysis for the keyword waterproof rain jacket: patagonia.com at position 3 beside rei.com, outdoorgearlab.com and thenorthface.com, with overall SEO score, title length, meta description, word count, keyword occurrences, H1 to H3 counts, images with alt text, internal links, domain authority and referring domains as rows, better and worse cells tinted",
};

/** What the hero screenshot is actually showing, said in four lines. */
const HERO_POINTS = [
  "Your page and the ones above it, side by side",
  "One score per page — on-page and off-page",
  "Every gap measured against their average",
  "5 credits an analysis, up to 10 rivals",
];

/** The strip under the hero headline: what a single run reads. */
const HERO_LAYERS: { icon: LucideIcon; label: string }[] = [
  { icon: Search, label: "SERP positions" },
  { icon: FileText, label: "On-page & content" },
  { icon: Gauge, label: "Speed & technical" },
  { icon: Network, label: "Links & authority" },
];

interface Layer {
  id: string;
  icon: LucideIcon;
  /** Where this layer sits on the blue ramp: panel wash and mark colour. */
  tint: string;
  dot: string;
  name: string;
  kicker: string;
  title: string;
  body: string;
  points: string[];
  spec: { k: string; v: string }[];
}

/**
 * The four layers of the comparison, one panel each.
 *
 * Order follows the report itself — the on-page rows are at the top of the
 * table, off-page at the bottom — so a visitor who signs up finds the same four
 * in the same order.
 *
 * All four tints are blue and differ only in where they sit on the ramp — core
 * blue, cyan-blue, indigo-blue, deep blue. What keeps the run of four from
 * reading as one block repeated is the layout, not the hue: the copy and the
 * spec swap sides as you go down.
 */
const LAYERS: Layer[] = [
  {
    id: "content",
    icon: FileText,
    tint: "#e7effe",
    dot: "#0454ff",
    name: "Content & on-page",
    kicker: "What the page actually says",
    title: "Every on-page field, yours next to theirs",
    body: "Title, meta description, headings, word count, images and alt text, lists, FAQ blocks, tables of contents — read off the rendered page rather than guessed from a search snippet. Each check is one row: your number, then a column per competitor, with the strongest and weakest cells tinted so a gap is visible before you have read a single figure.",
    points: [
      "Title length, meta description, word count, readability",
      "H1 through H5 counts, and the keyword's placement in each",
      "Images, alt text, lists, FAQ section, table of contents, video",
      "Keyword in the title, H1, meta, URL and first 100 words",
    ],
    spec: [
      { k: "Read from", v: "The rendered page" },
      { k: "Renderer", v: "Headless browser, fetch fallback" },
      { k: "Shown as", v: "A row per check, a column per page" },
      { k: "In the score", v: "The on-page half" },
    ],
  },
  {
    id: "technical",
    icon: Gauge,
    tint: "#e4f2fc",
    dot: "#0d80c9",
    name: "Speed & technical",
    kicker: "How the page behaves",
    title: "Lighthouse numbers on every page in the table",
    body: "Performance, SEO, accessibility and best-practices scores come from PageSpeed Insights, next to LCP, TBT, CLS, FCP and TTFB — collected for their pages exactly as they are for yours. Schema markup is parsed out of the HTML too, so “they ship FAQ schema and you do not” is a row in the table rather than a hunch in a meeting.",
    points: [
      "Performance, SEO, accessibility and best-practices scores",
      "LCP, TBT, CLS, FCP and TTFB, page by page",
      "Schema markup detected and counted",
      "Security headers — HTTPS, HSTS, CSP, X-Frame-Options",
    ],
    spec: [
      { k: "Source", v: "PageSpeed Insights" },
      { k: "Collected for", v: "Your page and every rival" },
      { k: "If a page times out", v: "Left blank, never estimated" },
      { k: "In the score", v: "The on-page half" },
    ],
  },
  {
    id: "internal-links",
    icon: Link2,
    tint: "#e9ebfd",
    dot: "#3b46d6",
    name: "Internal linking",
    kicker: "What your own site does to you",
    title: "The links pointing at the page you want to rank",
    body: "A second pass crawls your own domain and counts what actually links to the page you are trying to rank, how many pages nothing links to at all, and what the anchor text says. It is the half of the gap a page-to-page comparison cannot see, and it is usually the cheapest half to close.",
    points: [
      "Inbound internal links to your ranking page",
      "Orphan pages on your domain, named rather than counted",
      "Anchor text on internal and external links",
      "Your figures against the competitor average",
    ],
    spec: [
      { k: "Runs as", v: "A second pass after the crawl" },
      { k: "Scope", v: "Your domain" },
      { k: "Compared as", v: "Yours vs competitor average" },
      { k: "In the score", v: "Context for the plan" },
    ],
  },
  {
    id: "authority",
    icon: Network,
    tint: "#e3ebfe",
    dot: "#0a3fbf",
    name: "Off-page authority",
    kicker: "What the rest of the web says",
    title: "Authority and backlinks, weighted the way Google weights them",
    body: "Domain authority, page authority and backlink counts for every domain in the table — to the whole domain and to the exact ranking page. Off-page carries most of the weight in the score because it usually carries most of the weight in the result, and the plan is instructed to lead with an authority gap when one exists rather than blaming a title tag.",
    points: [
      "Domain authority and page authority, 0–100",
      "Backlinks to the domain and to the exact ranking page",
      "Weighted at 70% of the overall score",
      "No data for a URL means a blank cell, not a guess",
    ],
    spec: [
      { k: "Source", v: "Backlink authority provider" },
      { k: "Covers", v: "Domain and ranking page" },
      { k: "Weight", v: "70% of the score" },
      { k: "If unavailable", v: "Score falls back to on-page" },
    ],
  },
];

/** The same four layers, as one table — the provenance the blocks cannot show. */
const PROVENANCE: {
  id: string;
  name: string;
  reads: string;
  source: string;
  scored: boolean;
  scoredNote: string;
}[] = [
  {
    id: "serp",
    name: "SERP position",
    reads: "Where each page ranks for the keyword",
    source: "Your latest rank check",
    scored: false,
    scoredNote: "No — it is the reason for the run",
  },
  {
    id: "content",
    name: "Content & on-page",
    reads: "Title, meta, headings, keyword placement, media",
    source: "Rendered page crawl",
    scored: true,
    scoredNote: "Yes — the on-page half",
  },
  {
    id: "technical",
    name: "Speed & technical",
    reads: "Lighthouse scores, LCP, TBT, CLS, schema",
    source: "PageSpeed Insights",
    scored: true,
    scoredNote: "Yes — the on-page half",
  },
  {
    id: "internal-links",
    name: "Internal linking",
    reads: "Inbound links, orphan pages, anchor text",
    source: "Second-pass crawl of your domain",
    scored: false,
    scoredNote: "No — context for the plan",
  },
  {
    id: "authority",
    name: "Off-page authority",
    reads: "Domain and page authority, backlink counts",
    source: "Backlink authority provider",
    scored: true,
    scoredNote: "Yes — 70% of the score",
  },
];

/** What lands when an analysis finishes. */
const DELIVERABLES = [
  {
    icon: Target,
    title: "One score per page",
    text: "On-page checks blended with domain and page authority into a single 0–100 number, graded A+ down to F. The same formula runs on your page and on theirs, so the two are actually comparable.",
  },
  {
    icon: Columns3,
    title: "The side-by-side table",
    text: "Every check as a row and every page as a column, grouped into on-page and off-page, with the best and worst cell in each row tinted. It is the artefact you screenshot into a deck.",
  },
  {
    icon: BarChart3,
    title: "Gaps against their average",
    text: "Word count, headings, images, links, readability, speed and authority — your figure beside the competitor average, computed before the model is asked anything so the plan argues from arithmetic rather than impressions.",
  },
  {
    icon: ListTree,
    title: "A prioritised action plan",
    text: "Tasks sorted high, medium and low across on-page, content, technical, internal linking, user experience, security and off-page. Every task carries the number behind it and the result to expect.",
  },
  {
    icon: Sparkles,
    title: "What you already do well",
    text: "Strengths are listed too, and a category with nothing real to fix is left out entirely. A plan that invents a problem for every heading is a plan you stop believing on the second read.",
  },
  {
    icon: MessageSquareText,
    title: "Questions, answered in context",
    text: "A chat that already has the crawl, the gaps and the plan in front of it, scoped to whichever category you are reading. On paid plans, 1 credit a message.",
  },
];

/** The shapes of keyword this tool is actually won and lost on. */
const CHIPS = [
  "best project management software",
  "waterproof rain jacket",
  "crm for small teams",
  "seo agency in austin",
  "alternatives to [competitor]",
  "[category] pricing",
  "how to [job your product does]",
  "best [product] for beginners",
  "[service] near me",
  "[competitor] vs [you]",
];

const STEPS = [
  {
    n: "01",
    title: "Name the page and the keyword",
    text: "The domain you want ranking and the term you want it to rank for. Start it from a tracked keyword and every column carries that keyword's live SERP position from your latest check.",
  },
  {
    n: "02",
    title: "Pick who to compare against",
    text: "Search results are pulled for the keyword so you can tick the pages actually beating you, or paste URLs by hand — up to 10 in one analysis. Your own domain is filtered out, so you cannot end up compared with yourself.",
  },
  {
    n: "03",
    title: "Both sides get crawled",
    text: "Every page is rendered and read the same way, Lighthouse runs against each one, authority is looked up in bulk, and your own site is crawled for the links pointing at your page.",
  },
  {
    n: "04",
    title: "Work the list, then re-run",
    text: "A score per page, a row per check and a prioritised plan with the numbers attached. Share it, export it, and re-run once you have shipped the changes to see whether the gap closed.",
  },
];

const STATS = [
  { value: "10", label: "competitors in one analysis" },
  { value: "5", label: "credits an analysis" },
  { value: "7", label: "plan categories, prioritised" },
  { value: "100", label: "free credits every month" },
];

const BENEFITS = [
  {
    icon: Share2,
    title: "Send the client a link",
    text: "Every report has a share link that opens without an account and carries your agency name. The comparison does the arguing before the call starts.",
  },
  {
    icon: Download,
    title: "Export anything",
    text: "CSV, JSON or Markdown, so the table lands in your reporting stack or straight into a content brief instead of behind our login.",
  },
  {
    icon: RefreshCw,
    title: "Re-run after you ship",
    text: "Re-run the whole analysis, or recrawl a single domain when only one page moved. The point of a gap report is the second reading, not the first.",
  },
  {
    icon: Layers,
    title: "Wired into your projects",
    text: "Run it from a tracked keyword and the score lands back on that keyword in your project, beside its position history — no separate tool to remember.",
  },
  {
    icon: ShieldCheck,
    title: "Nothing is invented",
    text: "Authority the provider does not have stays blank, the score drops to on-page only rather than guessing, and the plan is told in writing never to fabricate a number.",
  },
  {
    icon: Wallet,
    title: "One balance, every tool",
    text: "The same credits run Google, Maps and YouTube rank tracking, AI visibility, site audits and keyword research. Nothing here is locked behind a higher tier.",
  },
];

const FREE_POINTS = [
  "A full analysis every day",
  "Every check in the comparison table",
  "On-page tasks in the action plan",
  "No credit card required",
];

const PAID_POINTS = [
  "The full plan, every category",
  "Ask the report questions in chat",
  "Internal link analysis unrestricted",
  "Cancel anytime",
];

const FAQS = [
  {
    q: "What does the competitor analysis actually do?",
    a: "It takes one keyword, your page and the pages ranking around you, crawls all of them the same way, and lays every check side by side: title, meta description, headings, word count, keyword placement, images and alt text, internal and external links, Lighthouse scores, Core Web Vitals, schema markup, security headers, domain authority, page authority and backlinks. Then it writes a prioritised action plan out of the differences.",
  },
  {
    q: "How do I choose who to compare against?",
    a: "Type the keyword and FreeSERP pulls the live search results so you can tick the pages actually ranking for it, or paste URLs yourself — up to 10 in a single analysis. Your own domain is filtered out of the competitor list, subdomains included, so you cannot end up comparing yourself with yourself.",
  },
  {
    q: "How is the overall score calculated?",
    a: "On-page checks make up 30% of it and off-page authority the other 70% — domain authority, page authority, backlinks to the domain and backlinks to the exact ranking page. When no authority data exists for a URL, the score falls back to the on-page checks alone rather than filling the hole with a guess. Grades run from A+ down to F, and the same formula scores every page in the table.",
  },
  {
    q: "Is the action plan just generic SEO advice?",
    a: "No. Every yours-versus-their-average gap is computed from the crawl before the model is asked anything, and the plan is instructed to cite those real numbers — “your page has 1,840 words against a competitor average of 2,880” — to give a target for each one, and to leave a whole category out when there is genuinely nothing to fix there.",
  },
  {
    q: "What does it cost in credits?",
    a: "5 credits an analysis, however many competitors you put in it, and 1 credit a chat message. The free plan runs one full analysis a day out of its monthly credits; past that the comparison table is still complete and the plan narrows to the on-page category.",
  },
  {
    q: "Can I share the report with a client?",
    a: "Yes. Every analysis has a share link that works without a FreeSERP account and carries your agency name, and the table exports to CSV, JSON or Markdown when the report needs to live somewhere else.",
  },
  {
    q: "Do I need a credit card to start?",
    a: "No. The free plan needs no card and includes 100 credits every month, refilled automatically. Paid plans start at $19/month for 2,000 credits and can be cancelled at any time — email support@freeserp.com if you want a hand sizing one.",
  },
];

/** Credits per analysis, from the backend's credits catalog. */
const CREDITS_PER_ANALYSIS = 5;

/** The page column. 1139px, matching /ai-rank-tracker. */
const WRAP = "mx-auto w-full max-w-[1139px] px-5 sm:px-8";

/* ══════════════════════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════════════════════ */

export default function CompetitorAnalysisPage() {
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
    <div className={`cmpa-scope ${inter.className} w-full overflow-x-hidden`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ── nav ───────────────────────────────────────────────────────────
          No bar: the header is transparent and sits directly on the dark hero
          band, so the top of the page is the headline rather than a chrome
          strip above it. That is only readable while there is band behind it,
          so this is `absolute` at the top of the document rather than `fixed`.
          Logo one side, the CTA the other, nothing in between: anchors here read
          as a site nav, and this is a landing page with one thing to do. */}
      <header className="absolute inset-x-0 top-0 z-50">
        <div className={`${WRAP} flex h-[76px] items-center justify-between gap-4 sm:h-[84px]`}>
          <a href="#top" className="flex items-center gap-2.5 text-white">
            <LogoMark className="h-7 w-7 rounded-[8px]" />
            <Wordmark className="text-[19px] font-semibold tracking-[-0.6px]" />
          </a>

          <Cta placement="nav" label="Start free" size="sm" variant="white" arrow="up-right" />
        </div>
      </header>

      <main>
        {/* ── hero ─────────────────────────────────────────────────────────
            A full-bleed near-black band with the screenshot hanging off the
            bottom of it. The band is what makes this campaign visually its own
            page, and it lets the one product shot — a light, dense comparison
            table — sit at the centre of the frame with real contrast behind it
            rather than white on white. */}
        <section
          id="top"
          className="cmpa-band cmpa-on-dark pt-28 pb-[190px] sm:pt-36 sm:pb-[240px]"
        >
          <div className={`${WRAP} text-center`}>
            <a href="#plan" className="cmpa-eyebrow">
              <b>New</b>
              Every gap comes back as a prioritised task
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
            </a>

            {/* Half the headline in the gradient — the page's one loud
                moment, and the only place on the band where the ramp appears
                as type rather than as atmosphere. */}
            <h1 className="cmpa-h1 mx-auto mt-7 max-w-[20ch] text-white">
              See exactly <span className="cmpa-grad-text">why they rank above you</span>
            </h1>

            <p className="cmpa-lead mx-auto mt-6 max-w-[62ch]">
              Pick a keyword and FreeSERP crawls your page and the pages beating you, scores both
              sides on the same checks, and turns every difference into a list of changes worth
              making — in the order worth making them.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Cta placement="hero" label="Start free — 100 credits" />
              <a href="#compares" className="cmpa-btn cmpa-btn-lg cmpa-btn-ghost">
                See what it compares
              </a>
            </div>

            {/* What one run reads, named. The claim of this page is breadth of
                evidence, so the four layers are stated once at full size here
                rather than left to the section headings further down. */}
            <ul className="mt-11 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              {HERO_LAYERS.map((l) => (
                <li
                  key={l.label}
                  className="flex items-center gap-2.5 text-[15px] font-medium text-white/80"
                >
                  <span className="cmpa-hero-layer">
                    <l.icon className="h-[17px] w-[17px]" strokeWidth={1.9} />
                  </span>
                  {l.label}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* The screenshot straddles the band and the canvas. `relative` is load
            bearing: the band above is positioned, and a static sibling would
            paint underneath it. */}
        <div className={`${WRAP} cmpa-shot-glow relative z-10 -mt-[150px] sm:-mt-[190px]`}>
          <Shot
            src={HERO_SHOT.src}
            alt={HERO_SHOT.alt}
            width={HERO_SHOT.width}
            height={HERO_SHOT.height}
            sizes="(max-width: 1180px) 100vw, 1075px"
            label="app.freeserp.com/dashboard/competitor-analysis"
            priority
          />

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {HERO_POINTS.map((p) => (
              <div
                key={p}
                className="flex items-start gap-2.5 rounded-[14px] border border-[#46484d0f] bg-white px-4 py-3.5 text-[14px] leading-[1.4] font-medium"
              >
                <Check className="mt-px h-4 w-4 shrink-0 text-[var(--accent)]" strokeWidth={2.6} />
                {p}
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-[13px] text-[var(--muted)]">
            Above: one keyword, your page against the pages ranking around it
          </p>
        </div>

        {/* ── the four layers ───────────────────────────────────────────────
            The centre of the page. One tinted panel per layer, each a step
            along the blue ramp, with the copy and the provenance spec swapping
            sides as you go down so four blocks of the same shape do not read
            as one block printed four times. */}
        <section id="compares" className="scroll-mt-24 pt-20 sm:pt-28">
          <div className={WRAP}>
            <SectionHead
              label="Compare"
              name="The layers"
              title="Four kinds of evidence, one table"
              sub="Collected in whichever way gives the truest reading, and lined up the same way once it is in."
            />
          </div>

          <div className={`${WRAP} mt-14 space-y-5`}>
            {LAYERS.map((l, i) => (
              <article
                key={l.id}
                id={l.id}
                className="cmpa-layer scroll-mt-24 p-7 sm:p-10"
                style={{ "--tint": l.tint, "--dot": l.dot } as React.CSSProperties}
              >
                {/* Odd panels put the spec on the left. `order` rather than a
                    reversed grid, so the DOM — and therefore the reading order
                    on a phone, where this collapses to one column — is always
                    copy first, spec second.
                    The track sizes have to flip with it. `order` only changes
                    which track an item lands in, so leaving the template alone
                    would hand the spec the 1.15fr track on every reversed panel
                    and the table would come out ~140px wider than the ones
                    opposite it. Mirroring the template keeps the copy on 1.15fr
                    and the spec on 0.85fr whichever side each is on. */}
                <div
                  className={`grid gap-9 lg:gap-14 ${
                    i % 2 ? "lg:grid-cols-[0.85fr_1.15fr]" : "lg:grid-cols-[1.15fr_0.85fr]"
                  }`}
                >
                  <div className={i % 2 ? "lg:order-2" : undefined}>
                    <div className="flex items-center gap-4">
                      <span className="cmpa-layer-mark">
                        <l.icon className="h-[23px] w-[23px]" strokeWidth={1.8} />
                      </span>
                      <span>
                        <span className="block text-[19px] font-semibold tracking-[-0.6px]">
                          {l.name}
                        </span>
                        <span className="block text-[13.5px] text-[var(--muted)]">{l.kicker}</span>
                      </span>
                    </div>

                    <h3 className="cmpa-h3 mt-7">{l.title}</h3>
                    <p className="mt-4 text-[15.5px] leading-[1.65] text-[var(--body)]">{l.body}</p>
                  </div>

                  {/* The spec and the checklist share the second column. Four
                      spec rows on their own left half a panel of dead space
                      under them; carrying the points across balances the two
                      columns to within a line or two of each other and gives
                      the split a meaning — prose on one side, facts on the
                      other. */}
                  <div className={i % 2 ? "lg:order-1" : undefined}>
                    <dl className="cmpa-spec">
                      {l.spec.map((s) => (
                        <div key={s.k}>
                          <dt>{s.k}</dt>
                          <dd>{s.v}</dd>
                        </div>
                      ))}
                    </dl>

                    <ul className="mt-7 space-y-3">
                      {l.points.map((p) => (
                        <Point key={p}>{p}</Point>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── provenance ───────────────────────────────────────────────────
            Four panels can each be honest and still leave the obvious question
            unanswered: where did this number come from, and does it move the
            score. This is that, on one screen. */}
        <section className="py-20 sm:py-28">
          <div className={WRAP}>
            <SectionHead
              label="Sources"
              name="Where it comes from"
              title="Every number, and where it was read"
              sub="An SEO report is only worth as much as its provenance — including the parts we deliberately leave out of the score."
            />

            <div className="cmpa-table-scroll mt-12">
              <table className="cmpa-table">
                <thead>
                  <tr>
                    <th scope="col">Layer</th>
                    <th scope="col">What it reads</th>
                    <th scope="col">Collected from</th>
                    <th scope="col">In the overall score</th>
                  </tr>
                </thead>
                <tbody>
                  {PROVENANCE.map((row) => (
                    <tr key={row.id}>
                      <th scope="row">{row.name}</th>
                      <td>{row.reads}</td>
                      <td>{row.source}</td>
                      <td className={row.scored ? "cmpa-yes" : "cmpa-no"}>{row.scoredNote}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-center text-[13px] text-[var(--muted)]">
              On-page is 30% of the score and off-page authority 70% — and when the authority
              data does not exist for a URL, the score falls back to on-page alone.
            </p>
          </div>
        </section>

        {/* ── what you get back ────────────────────────────────────────── */}
        <section id="plan" className="scroll-mt-24 pb-20 sm:pb-28">
          <div className={WRAP}>
            <SectionHead
              label="Output"
              name="What you get back"
              title="A report you can act on the same afternoon"
              sub="The comparison is the evidence. The plan is the part that tells you which row to go and fix first."
            />

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {DELIVERABLES.map((d) => (
                <div key={d.title} className="cmpa-card p-7">
                  <span className="cmpa-icon">
                    <d.icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-5 text-[17px] font-semibold tracking-[-0.5px]">{d.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-[1.6] text-[var(--body)]">{d.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── keyword shapes ───────────────────────────────────────────── */}
        <section className="pb-20 sm:pb-28">
          <div className={WRAP}>
            <SectionHead
              label="Keywords"
              name="What to run it on"
              title="The terms you are close on"
              sub="Not the ones you already own and not the ones you will never touch — the ones where you are on page one and someone else is above you."
            />
            <div className="mx-auto mt-11 flex max-w-[900px] flex-wrap justify-center gap-2.5">
              {CHIPS.map((c) => (
                <span key={c} className="cmpa-chip">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── how it works ─────────────────────────────────────────────── */}
        <section id="how" className="scroll-mt-24 pb-20 sm:pb-28">
          <div className={WRAP}>
            <SectionHead
              label="Setup"
              name="How it works"
              title="Four steps, and the last one repeats"
            />

            <div className="cmpa-steps mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s) => (
                <div key={s.n} className="cmpa-card flex flex-col p-7">
                  <span className="cmpa-step-n">{s.n}</span>
                  <h3 className="mt-5 text-[17px] font-semibold tracking-[-0.5px]">{s.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-[1.6] text-[var(--body)]">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── stats ────────────────────────────────────────────────────── */}
        <section className="pb-20 sm:pb-28">
          <div className={WRAP}>
            <div className="cmpa-on-dark cmpa-ink-panel cmpa-panel grid grid-cols-2 gap-y-10 px-8 py-12 sm:px-12 lg:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-[40px] leading-none font-semibold tracking-[-1.5px] sm:text-[52px]">
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

        {/* ── benefits ─────────────────────────────────────────────────── */}
        <section id="why" className="scroll-mt-24 pb-20 sm:pb-28">
          <div className={WRAP}>
            <SectionHead
              label="Why"
              name="One platform"
              title="Built to be handed on, not just run"
              sub="A gap report is only worth having if you can send it, export it, and run it again once the work is done."
            />

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {BENEFITS.map((b) => (
                <div key={b.title} className="cmpa-card p-7">
                  <span className="cmpa-icon">
                    <b.icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-5 text-[17px] font-semibold tracking-[-0.5px]">{b.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-[1.6] text-[var(--body)]">{b.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── pricing ──────────────────────────────────────────────────────
            Prices come from CREDIT_PLANS. An analysis is 5 credits whatever it
            crawls, so a balance divides cleanly into runs — the same arithmetic
            the credit catalog uses. */}
        <section id="pricing" className="scroll-mt-24 pb-20 sm:pb-28">
          <div className={WRAP}>
            <SectionHead
              label="Pricing"
              name="Credits"
              title="Choose the plan that fits"
              sub="One balance covers competitor analysis, rank tracking, AI visibility, audits and keyword research. Nothing is reserved for a higher tier."
            />

            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <article className="cmpa-card flex flex-col p-7">
                <h3 className="text-[15px] font-semibold">Free</h3>
                <p className="mt-1.5 text-[13.5px] text-[var(--muted)]">Perfect for one site</p>
                <p className="mt-5 text-[40px] leading-none font-semibold tracking-[-1.5px]">
                  $0<span className="ml-1 text-[14px] font-normal text-[var(--muted)]">/mo</span>
                </p>
                <p className="mt-2 text-[12.5px] text-[var(--muted)]">
                  100 credits — about {100 / CREDITS_PER_ANALYSIS} analyses
                </p>
                <Cta
                  placement="pricing_free"
                  label="Get started"
                  size="sm"
                  variant="ghost"
                  arrow={false}
                  className="mt-6 w-full"
                />
                <p className="mt-7 mb-4 text-[12.5px] font-semibold">Features included:</p>
                <ul className="space-y-3">
                  {FREE_POINTS.map((p) => (
                    <Point key={p}>{p}</Point>
                  ))}
                </ul>
              </article>

              {CREDIT_PLANS.map((plan) => (
                <article
                  key={plan.slug}
                  className={`relative flex flex-col p-7 ${plan.popular ? "cmpa-panel cmpa-ink-soft" : "cmpa-card"}`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 right-6 rounded-full bg-[var(--accent)] px-3 py-1 text-[11px] font-semibold tracking-[0.04em] text-white uppercase">
                      Popular
                    </span>
                  )}
                  <h3 className="text-[15px] font-semibold">{plan.label}</h3>
                  <p
                    className={`mt-1.5 text-[13.5px] ${plan.popular ? "text-white/55" : "text-[var(--muted)]"}`}
                  >
                    {plan.who}
                  </p>
                  <p className="mt-5 text-[40px] leading-none font-semibold tracking-[-1.5px]">
                    ${plan.price}
                    <span
                      className={`ml-1 text-[14px] font-normal ${plan.popular ? "text-white/55" : "text-[var(--muted)]"}`}
                    >
                      /mo
                    </span>
                  </p>
                  <p
                    className={`mt-2 text-[12.5px] ${plan.popular ? "text-white/55" : "text-[var(--muted)]"}`}
                  >
                    {plan.credits.toLocaleString()} credits — about{" "}
                    {(plan.credits / CREDITS_PER_ANALYSIS).toLocaleString()} analyses
                  </p>
                  <Cta
                    placement={`pricing_${plan.slug}`}
                    label="Get started"
                    size="sm"
                    variant={plan.popular ? "primary" : "ghost"}
                    arrow={false}
                    className="mt-6 w-full"
                  />
                  <p className="mt-7 mb-4 text-[12.5px] font-semibold">Features included:</p>
                  <ul className="space-y-3">
                    {PAID_POINTS.map((p) => (
                      <Point key={p} onDark={plan.popular}>
                        {p}
                      </Point>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            {/* The plans are credit bundles, and "how many do I need" is the
                question they leave behind — here it is unusually easy to answer,
                because an analysis is a flat price whatever it crawls. */}
            <div className="cmpa-soft mt-4 flex flex-wrap items-center justify-between gap-5 px-8 py-7">
              <div>
                <p className="text-[17px] font-semibold tracking-[-0.5px]">
                  Not sure how many analyses you need?
                </p>
                <p className="mt-1.5 max-w-[62ch] text-[14.5px] leading-[1.55] text-[var(--body)]">
                  An analysis is 5 credits however many competitors go into it, and a chat message
                  is 1. Tell us how many keywords you want to work and we will size the balance
                  for you.
                </p>
              </div>
              <a
                href="mailto:support@freeserp.com"
                className="cmpa-btn cmpa-btn-sm cmpa-btn-ink shrink-0"
              >
                Contact us
              </a>
            </div>
          </div>
        </section>

        {/* ── testimonials ─────────────────────────────────────────────────
            The same three quotes the home page runs, imported rather than
            re-written: a landing page that invents its own customers is one
            whose social proof contradicts the site the moment a visitor clicks
            through. framerusercontent.com is already in next.config's
            remotePatterns, so next/image can optimize the avatars. */}
        <section className="pb-20 sm:pb-28">
          <div className={WRAP}>
            <SectionHead label="Use case" name="Customers" title="See why teams switch" />

            <div className="mt-12 grid gap-4 lg:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <figure key={t.name} className="cmpa-card flex flex-col p-7">
                  {/* Amber, not the accent — a blue five-star row reads as UI
                      rather than as a rating. */}
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

        {/* ── faq ──────────────────────────────────────────────────────────
            Plain <details>: keyboard-accessible and announced correctly for
            free, open before React would have loaded, and Ctrl+F still finds a
            closed answer in Chrome. */}
        <section id="faq" className="scroll-mt-24 pb-20 sm:pb-28">
          <div className={WRAP}>
            <SectionHead
              label="FAQ"
              name="Answers"
              title="Frequently asked questions"
              sub="Anything not answered here — support@freeserp.com."
            />

            <div className="mx-auto mt-12 max-w-[780px] space-y-3">
              {FAQS.map((f) => (
                <details key={f.q} className="cmpa-faq cmpa-card px-6 py-1">
                  <summary className="flex items-center justify-between gap-4 py-5 text-[16px] font-medium">
                    {f.q}
                    <ChevronDown
                      className="cmpa-chevron h-[18px] w-[18px] shrink-0 text-[var(--muted)]"
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
          <div className="cmpa-on-dark cmpa-ink-panel cmpa-panel px-6 py-16 text-center sm:px-12 sm:py-20">
            <LogoMark className="mx-auto h-10 w-10" />
            <h2 className="cmpa-h2 mx-auto mt-6 max-w-[18ch]">
              Find out <span className="cmpa-grad-text">what the page above you is doing</span>
            </h2>
            <p className="mx-auto mt-5 max-w-[54ch] text-[16px] leading-[1.6] text-white/60">
              One keyword, one credit balance. 100 free credits every month, no credit card, and
              every check laid out beside theirs so you can see the gap for yourself.
            </p>
            <div className="mt-8 flex justify-center">
              <Cta placement="final_cta" label="Start free — 100 credits" />
            </div>
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

      <SignupPopup />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PIECES
   ══════════════════════════════════════════════════════════════════════════ */

/** The two-part section label: a coloured cap and a name. */
function SectionHead({
  label,
  name,
  title,
  sub,
}: {
  label: string;
  name: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mx-auto max-w-[66ch] text-center">
      <span className="cmpa-tag">
        <b>{label}</b>
        {name}
      </span>
      <h2 className="cmpa-h2 mt-5">{title}</h2>
      {sub && <p className="cmpa-lead mx-auto mt-4 max-w-[58ch]">{sub}</p>}
    </div>
  );
}

function Point({ children, onDark }: { children: React.ReactNode; onDark?: boolean }) {
  return (
    <li
      className={`flex gap-2.5 text-[13.5px] leading-[1.45] ${onDark ? "text-white/70" : "text-[var(--body)]"}`}
    >
      <Check className="mt-px h-4 w-4 shrink-0 text-[var(--accent)]" strokeWidth={2.4} />
      {children}
    </li>
  );
}

/** The window bar above a screenshot. */
function ShotBar({ label }: { label?: string }) {
  return (
    <div className="cmpa-shot-bar">
      <span className="flex gap-1.5" aria-hidden>
        <i className="h-[7px] w-[7px] rounded-full bg-[#46484d29]" />
        <i className="h-[7px] w-[7px] rounded-full bg-[#46484d29]" />
        <i className="h-[7px] w-[7px] rounded-full bg-[#46484d29]" />
      </span>
      {label && <span className="truncate text-[11px] text-[var(--muted)]">{label}</span>}
    </div>
  );
}

/** A product screenshot in browser chrome. */
function Shot({
  src,
  alt,
  width,
  height,
  sizes,
  label,
  priority,
}: Shot & { sizes: string; label?: string; priority?: boolean }) {
  return (
    <div className="cmpa-shot">
      {label && <ShotBar label={label} />}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        className="block h-auto w-full"
      />
    </div>
  );
}
