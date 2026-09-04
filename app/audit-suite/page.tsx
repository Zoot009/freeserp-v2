import type { Metadata } from "next";
import Image from "next/image";
import { Inter } from "next/font/google";
import {
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  Code2,
  Download,
  FileSearch,
  Gauge,
  Layers,
  MessageSquareText,
  Star,
  Users,
  Wallet,
} from "lucide-react";
import { LogoMark, Wordmark } from "@/components/landing/ui/Logo";
import { TESTIMONIALS } from "@/components/home/data";
import { CREDIT_PLANS } from "@/app/pricing/PricingPlans";
import { Cta } from "./Cta";
import "./ads.css";

/**
 * /audit-suite — the paid-acquisition landing page for the audit and research
 * tools: Full Website Audit, Page Audit, Competitor Analysis, Internal Link
 * Analysis, Keywords, Keyword Magic Tool and Keyword Score Checker.
 *
 * Sibling of /tracking-suite, which sells the four rank trackers. Same product,
 * different half of it, and deliberately a different design: this one follows
 * filo-saas.framer.website — near-white canvas, orange accent, 24px cards and
 * 10px controls, Inter 500/600 with px letter-spacing, a 1139px column — where
 * the tracker page follows drospecta. Two campaigns, two looks, so a test
 * between them measures something.
 *
 * The reference's structure is what shapes this page: an announcement pill over
 * the headline, a two-part label above every section, a screenshot-led block per
 * tool, a chip cloud of
 * what actually gets checked, and pricing that ends in a "specific needs?"
 * strip.
 *
 * The whole page lives in this one file: copy and layout together, so a change
 * to a headline and the section it sits in is one edit in one place. The only
 * pieces outside are ./ads.css (Next needs CSS in a .css file) and ./Cta.tsx
 * (the single client component — see the note there).
 *
 * It is otherwise a pure server component: no hooks, no state, no hydration.
 * The FAQ is a native <details> and the page ships as static HTML, which is
 * what keeps LCP low on a cold paid click.
 *
 * It renders inside the root layout, so Google Ads conversion tracking (gtag
 * AW-), GA4, GTM and first-party UTM capture are all inherited — no tag setup
 * needed for a new campaign beyond pointing the ad at this URL.
 */

// Inter, scoped to this page — the reference's typeface, and 500 is the weight
// it leans on for nearly everything that is not a heading.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Website Audit, Page Audit and Keyword Research — FreeSERP",
  description:
    "Crawl every page, audit one page against 63 checks, compare yourself with the pages ranking above you, map your internal links, and research keywords. 100 free credits every month, no credit card.",
  alternates: { canonical: "/audit-suite" },
  openGraph: {
    title: "Find what is holding your site back",
    description:
      "Full site audit, page audit, competitor analysis, internal link analysis and keyword research — one dashboard, one credit balance.",
    url: "/audit-suite",
    siteName: "FreeSERP",
    type: "website",
  },
  // Paid-traffic destination, kept out of the index on purpose: it restates the
  // home page and the tool pages, and letting Google choose between them is how
  // a site ends up ranking its ad copy instead of its content. Google Ads does
  // not require an indexed landing page. Flip `index` to true (and add the route
  // to app/sitemap.ts) if this is ever repurposed for organic search.
  robots: { index: false, follow: true },
};

/* ══════════════════════════════════════════════════════════════════════════
   CONTENT — everything a marketer edits between campaigns lives in this block.

   Every claim has to be true of the product. The seven tools map to real backend
   modules (site-crawl, page-audit, competitor-analysis, internal-link-analysis,
   keywords, keyword-magic, keyword-analysis), the credit costs come from the
   backend's credits/catalog.ts, and the prices come from CREDIT_PLANS, imported
   rather than restated so this page can never quote a figure checkout does not
   honour.
   ══════════════════════════════════════════════════════════════════════════ */

type Shot = { src: string; width: number; height: number; alt: string };

/**
 * Screenshots come from dummy-ss/freeserp-dummy-pages — static pages that wear
 * the product's own stylesheet (freeserp-frontend-v2/app/dashboard.css, included
 * verbatim) and carry invented data. They are pixel-identical to the dashboard;
 * the figures in them are not measurements, and nothing on this page presents
 * them as any customer's results.
 *
 * Captured at 2× from the frame each page declares in its own class (.r4x3 is
 * 1120×840, .r8x5 1600×1000 — read those off shots.css, not the README table,
 * which disagrees in places). The page is the crop, so there is nothing to trim.
 */
const HERO_SHOT: Shot = {
  src: "/shots/site-audit.png",
  width: 3200,
  height: 2000,
  alt: "FreeSERP Full Website Audit: a crawl of patagonia.com in progress at 428 of 1,000 pages, with 735 findings rolled up into a prioritised issue list",
};

/** What the hero screenshot is actually showing, said in four lines. */
const HERO_POINTS = [
  "Up to 1,000 pages in one crawl",
  "Findings ranked Critical, Warning, Notice",
  "Every issue counted across every page",
  "1 credit per 20 pages",
];

interface Feature {
  key: string;
  label: string;
  kicker: string;
  title: string;
  body: string;
  points: string[];
  shot: Shot;
}

/** All seven tools, one screenshot-led block each. */
const FEATURES: Feature[] = [
  {
    key: "full-website-audit",
    label: "Crawl",
    kicker: "Full Website Audit",
    title: "The whole site, graded and grouped",
    body: "When the crawl finishes it is a report, not a progress bar. One site average over six category grades, then every finding grouped by issue — or flipped to a page-by-page list — with the URLs and the exact element behind each one.",
    points: [
      "A site average, and a grade per category",
      "Findings by issue, or by page, either way",
      "Expand an issue for the URLs and the element",
      "Share it, export PDF or CSV, re-crawl any time",
    ],
    shot: {
      src: "/shots/site-audit-report.png",
      width: 3200,
      height: 2000,
      alt: "FreeSERP Full Website Audit report: a site average of 74 over SEO, Performance, UI/UX, Links, Technology and Social grades, with 735 issues grouped by type and the affected URLs listed under each",
    },
  },
  {
    key: "page-audit",
    label: "Audit",
    kicker: "Page Audit",
    title: "One page, 63 checks, graded",
    body: "The page you actually care about, scored end to end and explained in words you can act on. Six category grades sit under one overall score, and every failed check says what it found, why it matters and where.",
    points: [
      "SEO, Performance, UI/UX, Links, Technology and Social",
      "Failures ranked Critical or Warning, each one explained",
      "Ask the finished audit a follow-up question",
      "PDF export · 1 credit an audit",
    ],
    shot: {
      src: "/shots/page-audit.png",
      width: 2240,
      height: 1680,
      alt: "FreeSERP Page Audit: an overall grade of 76 with SEO, Performance, UI/UX, Links, Technology and Social scores, the failed checks explained beneath, and the Audit Assistant answering what to fix first",
    },
  },
  {
    key: "competitor-analysis",
    label: "Compare",
    kicker: "Competitor Analysis",
    title: "Your page against the ones ranking above it",
    body: "Pick a keyword and FreeSERP puts your page beside the pages beating you, scored on the same 63 on-page checks. Not a list of what they rank for — a column-by-column read of what they do differently on the page that outranks yours.",
    points: [
      "Your domain and the pages above it, side by side",
      "Overall SEO score plus every check behind it",
      "Title length, meta description, word count, keyword use",
      "Share or export it · 5 credits an analysis",
    ],
    shot: {
      src: "/shots/competitor-analysis.png",
      width: 2240,
      height: 1680,
      alt: "FreeSERP competitor analysis: your domain and three rivals side by side with SERP position, overall SEO score, title length, meta description, word count and keyword occurrences",
    },
  },
  {
    key: "internal-links",
    label: "Structure",
    kicker: "Internal Link Analysis",
    title: "See the link graph your site actually has",
    body: "Crawl the whole domain and get the internal link structure drawn out — which pages are hubs, which hold authority, how deep everything sits from the homepage, and which pages nothing at all links to.",
    points: [
      "Pages crawled, internal links, links per page",
      "Orphan pages — reachable from nothing — named",
      "Depth from the homepage, and where equity pools",
      "Inbound, outbound and equity share per page · 2 credits",
    ],
    shot: {
      src: "/shots/internal-links.png",
      width: 2240,
      height: 1680,
      alt: "FreeSERP Internal Links Analysis: 428 pages crawled with 3,914 internal links, 4 orphan pages and a max depth of 5, drawn as a node graph",
    },
  },
  {
    key: "keywords",
    label: "Track",
    kicker: "Keywords",
    title: "Your whole portfolio in one table",
    body: "Every keyword you track, across every project, in one table — position, movement, search volume and the URL that ranks. Filter it, star the ones that matter, and take the whole thing out as a CSV when the report is due.",
    points: [
      "Every project in one table, not one tab each",
      "Position, movement, volume, traffic and ranking URL",
      "Filter by project, device or engine; star and export",
      "Adding a keyword is free · 1 credit a check",
    ],
    shot: {
      src: "/shots/keywords-all.png",
      width: 3200,
      height: 2000,
      alt: "FreeSERP Keywords: 487 keywords tracked across three projects in one table, with average position, top-3 and top-10 counts, and each keyword's position, movement, volume, traffic, ranking URL and SERP features",
    },
  },
  {
    key: "keyword-magic",
    label: "Research",
    kicker: "Keyword Magic Tool",
    title: "One seed keyword, hundreds of real ones",
    body: "Type a seed and get back keywords people actually search, with real volumes from a keyword database rather than a language model's guess — grouped by the words inside them, so a content plan falls out of the list.",
    points: [
      "Volume, difficulty, CPC and intent on every keyword",
      "Broad, Phrase, Exact and Related match types",
      "Word groups that carve a big list into topics",
      "3 credits a search, 15 for the full page on paid",
    ],
    shot: {
      src: "/shots/keyword-magic.png",
      width: 3200,
      height: 2000,
      alt: "FreeSERP Keyword Magic Tool: 1,284 keywords from one seed with 1.9M total monthly volume, average difficulty 44 and average CPC $1.21, grouped by word",
    },
  },
  {
    key: "keyword-score",
    label: "Score",
    kicker: "Keyword Score Checker",
    title: "Score a page before you publish",
    body: "No competitors, no crawl of the whole site — just your page and the term you want it to rank for. FreeSERP crawls it, runs it through PageSpeed and an authority lookup, and tells you how well the page is actually built for that keyword.",
    points: [
      "One grade over on-page and off-page together",
      "Domain and Page Authority, and the backlinks behind them",
      "Real page speed — TTFB, FCP, LCP and CLS",
      "3 credits a page",
    ],
    shot: {
      src: "/shots/keyword-score.png",
      width: 2240,
      height: 1680,
      alt: "FreeSERP Keyword Score Checker: a page scored 86, Grade A, split into on-page 91 and off-page 78, with Domain Authority 91, Page Authority 64, backlink counts and the page's TTFB, LCP and CLS",
    },
  },
];

const CHIPS = [
  "Missing alt text",
  "Largest Contentful Paint",
  "Meta description length",
  "Duplicate H1",
  "Broken internal links",
  "Open Graph image",
  "Structured data",
  "Canonical tags",
  "Orphan pages",
  "Crawl depth",
  "Link equity share",
  "Title length",
  "Word count",
  "Keyword occurrences",
  "Search volume",
  "Keyword difficulty",
  "CPC",
  "Search intent",
  "SERP features",
  "Page speed",
];

const STATS = [
  { value: "7", label: "tools on one credit balance" },
  { value: "63", label: "on-page checks per page" },
  { value: "1,000", label: "pages in a single crawl" },
  { value: "100", label: "free credits every month" },
];

const PERSONAS = [
  {
    icon: Building2,
    title: "Agencies",
    text: "Audit a prospect's site before the pitch, and every client's on the same schedule. Exports drop into the report you already send.",
  },
  {
    icon: Users,
    title: "In-house SEO",
    text: "Turn a vague 'the site has issues' into a list with counts against it — and the comparison that says which fix moves a ranking.",
  },
  {
    icon: Code2,
    title: "Developers and owners",
    text: "Find the broken links, the 4MB hero images and the pages nothing links to, without learning an SEO platform first.",
  },
];

const BENEFITS = [
  {
    icon: Wallet,
    title: "One balance, every tool",
    text: "Credits are shared across audits, analyses, keyword research and rank tracking. Nothing is locked behind a higher tier.",
  },
  {
    icon: Gauge,
    title: "Our own crawler",
    text: "The site crawl and the page audit run on FreeSERP's own browser, which is why a full crawl costs a credit per twenty pages.",
  },
  {
    icon: MessageSquareText,
    title: "Answers, not just findings",
    text: "Every failed check explains what it found and why it matters, and you can ask the finished audit a follow-up question.",
  },
  {
    icon: FileSearch,
    title: "Real keyword data",
    text: "Volumes, difficulty and CPC come from a keyword database, not a model — deliberately, because a model cannot know a real volume.",
  },
  {
    icon: Download,
    title: "Export anything",
    text: "CSV and PDF export on every report, so the findings live in your stack rather than behind our login.",
  },
  {
    icon: Layers,
    title: "Sits beside the trackers",
    text: "Same account, same balance as Google, Maps, YouTube and AI rank tracking. Audit the page, then watch what the fix does.",
  },
];

const FREE_POINTS = [
  "All seven tools unlocked",
  "Website and page audits",
  "Keyword research included",
  "No credit card required",
];

const PAID_POINTS = [
  "Larger site crawls",
  "Full Keyword Magic result pages",
  "CSV and PDF export",
  "Cancel anytime",
];

const FAQS = [
  {
    q: "What do I get on the free plan?",
    a: "100 credits every month, refilled automatically, with no credit card. Every tool is unlocked on it — audits, competitor analysis, internal link analysis and keyword research all draw from the same balance.",
  },
  {
    q: "What does each tool cost in credits?",
    a: "A website crawl is 1 credit per 20 pages, so 100 pages is 5. A page audit is 1 credit, and a follow-up question on it is 1 more. Competitor analysis is 5 an analysis, internal link analysis is 2 a crawl, the Keyword Score Checker is 3 a page, and the Keyword Magic Tool is 3 a search — 15 for the fuller result page on a paid plan.",
  },
  {
    q: "How many pages will the site audit crawl?",
    a: "Up to 1,000 in one crawl. It starts at the URL you give it and follows internal links outward with a real browser, so what it audits is what a visitor can actually reach.",
  },
  {
    q: "Is the keyword data real or AI-generated?",
    a: "Real. Search volume, difficulty and CPC come from a keyword database in a single lookup per search. AI is deliberately kept out of that part — it cannot know a real search volume, and a made-up one is worse than none.",
  },
  {
    q: "What is the difference between Page Audit and Keyword Score Checker?",
    a: "Page Audit grades a page on its own merits across 63 checks in six categories. The Keyword Score Checker scores that same page against one target keyword, including page speed and an authority lookup — it answers 'is this page built to rank for this term', not 'is this page healthy'.",
  },
  {
    q: "Do I need a credit card to start?",
    a: "No. The free plan needs no card. Paid plans start at $19/month for 2,000 credits and can be cancelled at any time — email support@freeserp.com if you want a hand sizing one.",
  },
];

/** The page column. 1139px is the reference's container width. */
const WRAP = "mx-auto w-full max-w-[1139px] px-5 sm:px-8";

/* ══════════════════════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════════════════════ */

export default function AuditSuitePage() {
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
    <div className={`ads-scope ${inter.className} w-full overflow-x-hidden`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ── nav ───────────────────────────────────────────────────────────
          `fixed`, not `sticky`, for the same reason the site Nav and the
          existing landing Header are: globals.css puts overflow-x: hidden on
          <body>, which makes it a scroll container and stops sticky from ever
          sticking. The hero carries the matching top padding.
          Logo and one CTA, nothing else: every extra destination in the bar of
          a paid landing page is a way to spend the click without converting. */}
      <header className="fixed inset-x-0 top-3 z-50 px-4 sm:top-5">
        <div className="mx-auto flex w-full max-w-[1139px] items-center gap-6 rounded-[16px] border border-[#46484d1f] bg-white/85 py-2.5 pr-2.5 pl-4 backdrop-blur-xl sm:pl-6">
          <a href="#top" className="flex items-center gap-2.5">
            <LogoMark className="h-6.5 w-6.5" />
            <Wordmark className="text-[16px] font-semibold tracking-[-0.5px] text-[var(--ink)]" />
          </a>
          <Cta
            placement="nav"
            label="Create free account"
            size="sm"
            variant="ink"
            arrow={false}
            className="ml-auto"
          />
        </div>
      </header>

      <main>
        {/* ── hero ─────────────────────────────────────────────────────────
            The announcement pill, the single primary CTA and the reassurance
            line under it are the reference's opening move. The screenshot is
            the Full Website Audit mid-crawl. The finished report is the first
            block in the toolkit below — the flagship tool, in both its states. */}
        <section id="top" className="relative pt-28 pb-6 sm:pt-36">
          <div className={`${WRAP} text-center`}>
            <a
              href="#page-audit"
              className="inline-flex items-center gap-2.5 rounded-full border border-[#46484d1f] bg-white py-1.5 pr-4 pl-1.5 text-[13px] font-medium text-[var(--body)] transition-colors hover:border-[#46484d3d]"
            >
              <span className="rounded-full bg-[var(--accent)] px-2.5 py-1 text-[11px] font-semibold tracking-[0.04em] text-white uppercase">
                New
              </span>
              Ask your audit what to fix first
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
            </a>

            <h1 className="ads-h1 mx-auto mt-7 max-w-[16ch]">
              Find what is holding your site back
            </h1>

            <p className="ads-lead mx-auto mt-6 max-w-[62ch]">
              Crawl every page and get one prioritised list of what is broken. Grade a
              single page against 63 checks. Put yourself beside the pages outranking
              you, map your internal links, and find the keywords worth writing for.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Cta placement="hero" label="Start free — 100 credits" />
              <a href="#pricing" className="ads-btn ads-btn-lg ads-btn-ghost">
                See pricing
              </a>
            </div>

            <p className="mt-4 text-[14px] text-[var(--muted)]">No credit card required</p>
          </div>

          <div className={`${WRAP} mt-12 sm:mt-16`}>
            <Shot
              src={HERO_SHOT.src}
              alt={HERO_SHOT.alt}
              width={HERO_SHOT.width}
              height={HERO_SHOT.height}
              sizes="(max-width: 1180px) 100vw, 1075px"
              label="app.freeserp.com/dashboard/site-audit"
              priority
            />

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {HERO_POINTS.map((p) => (
                <div
                  key={p}
                  className="flex items-start gap-2.5 rounded-[14px] border border-[#46484d0f] bg-white px-4 py-3.5 text-[14px] leading-[1.4] font-medium"
                >
                  <Check
                    className="mt-px h-4 w-4 shrink-0 text-[var(--accent)]"
                    strokeWidth={2.6}
                  />
                  {p}
                </div>
              ))}
            </div>
            <p className="mt-4 text-center text-[13px] text-[var(--muted)]">
              Above: the Full Website Audit, mid-crawl
            </p>
          </div>
        </section>

        {/* ── personas ─────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-28">
          <div className={WRAP}>
            <SectionHead label="Who" name="Audiences" title="Built for whoever has to fix it" />

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {PERSONAS.map((p) => (
                <div key={p.title} className="ads-card p-7">
                  <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[var(--surface)] text-[var(--ink)]">
                    <p.icon className="h-[19px] w-[19px]" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-5 text-[19px] font-semibold tracking-[-0.5px]">{p.title}</h3>
                  <p className="mt-2.5 text-[15px] leading-[1.6] text-[var(--body)]">{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── the seven screenshot-led tools ────────────────────────────────
            Copy above, screenshot across the full column. These are dense
            dashboards — a graded report, a node graph, a keyword table — and
            beside a column of text each renders at about a third of the size it
            was captured at, where nothing inside it can be read. */}
        <section id="tools" className="scroll-mt-24">
          <div className={WRAP}>
            <SectionHead
              label="Toolkit"
              name="Audit & research"
              title="Seven tools, one dashboard"
              sub="Finding the problem, proving it against your competitors, and finding what to write next — without a second subscription for each."
            />
          </div>

          <div className={`${WRAP} mt-14 space-y-20 sm:space-y-28`}>
            {FEATURES.map((f) => (
              <article key={f.key} id={f.key} className="scroll-mt-24">
                <div className="mx-auto max-w-[760px] text-center">
                  <span className="ads-tag">
                    <b>{f.label}</b>
                    {f.kicker}
                  </span>
                  <h3 className="ads-h3 mt-5">{f.title}</h3>
                  <p className="mx-auto mt-4 max-w-[62ch] text-[16px] leading-[1.6] text-[var(--body)]">
                    {f.body}
                  </p>
                </div>

                <div className="mt-9">
                  <Shot
                    src={f.shot.src}
                    alt={f.shot.alt}
                    width={f.shot.width}
                    height={f.shot.height}
                    sizes="(max-width: 1180px) 100vw, 1075px"
                    label={`app.freeserp.com — ${f.kicker}`}
                  />
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {f.points.map((p) => (
                    <div
                      key={p}
                      className="flex items-start gap-2.5 rounded-[14px] border border-[#46484d0f] bg-white px-4 py-3.5 text-[14px] leading-[1.4] font-medium"
                    >
                      <Check
                        className="mt-px h-4 w-4 shrink-0 text-[var(--accent)]"
                        strokeWidth={2.6}
                      />
                      {p}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── chip cloud ───────────────────────────────────────────────────
            The reference runs a wall of feature names here. Ours lists checks
            the product genuinely performs, which is the difference between a
            wall of words and a spec. */}
        <section className="py-20 sm:py-28">
          <div className={WRAP}>
            <SectionHead
              label="Checks"
              name="Under the hood"
              title="Everything it looks at"
              sub="A crawl, a page audit, a link graph and a keyword lookup, between them, produce all of this."
            />
            <div className="mx-auto mt-11 flex max-w-[900px] flex-wrap justify-center gap-2.5">
              {CHIPS.map((c) => (
                <span key={c} className="ads-chip">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── stats ────────────────────────────────────────────────────── */}
        <section className="pb-20 sm:pb-28">
          <div className={WRAP}>
            <div className="ads-on-dark ads-panel grid grid-cols-2 gap-y-10 bg-[var(--ink)] px-8 py-12 text-white sm:px-12 lg:grid-cols-4">
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
              title="All-in-one, no extra tools needed"
              sub="An audit is only worth running if you can read the result, act on it, and get it out of the tool when someone asks for a report."
            />

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {BENEFITS.map((b) => (
                <div key={b.title} className="ads-card p-7">
                  <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[var(--surface)]">
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
            Prices come from CREDIT_PLANS. A credit buys 20 crawled pages, so
            credits / 5 is roughly how many pages a balance crawls in a month —
            the same arithmetic the credit catalog uses. */}
        <section id="pricing" className="scroll-mt-24 pb-20 sm:pb-28">
          <div className={WRAP}>
            <SectionHead
              label="Pricing"
              name="Credits"
              title="Choose the plan that fits"
              sub="One balance covers every audit, analysis and keyword search — and the rank trackers too. Nothing is reserved for a higher tier."
            />

            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <article className="ads-card flex flex-col p-7">
                <h3 className="text-[15px] font-semibold">Free</h3>
                <p className="mt-1.5 text-[13.5px] text-[var(--muted)]">
                  Perfect for one site
                </p>
                <p className="mt-5 text-[40px] leading-none font-semibold tracking-[-1.5px]">
                  $0<span className="ml-1 text-[14px] font-normal text-[var(--muted)]">/mo</span>
                </p>
                <p className="mt-2 text-[12.5px] text-[var(--muted)]">
                  100 credits, refilled monthly
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
                  className={`relative flex flex-col p-7 ${plan.popular ? "ads-panel bg-[var(--ink)] text-white" : "ads-card"}`}
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
                    {(Math.floor(plan.credits / 5) * 20).toLocaleString()} pages crawled
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

            {/* The reference closes pricing with this strip, and it earns its
                place: the plans are credit bundles, and "how many do I need"
                is the question they leave behind. */}
            <div className="ads-soft mt-4 flex flex-wrap items-center justify-between gap-5 px-8 py-7">
              <div>
                <p className="text-[17px] font-semibold tracking-[-0.5px]">
                  Do you have specific needs?
                </p>
                <p className="mt-1.5 max-w-[62ch] text-[14.5px] leading-[1.55] text-[var(--body)]">
                  Crawling far more than 1,000 pages, or not sure which balance covers your
                  client list? Tell us the sites and we will size it for you.
                </p>
              </div>
              <a
                href="mailto:support@freeserp.com"
                className="ads-btn ads-btn-sm ads-btn-ink shrink-0"
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
                <figure key={t.name} className="ads-card flex flex-col p-7">
                  {/* Amber, not the accent — a blue five-star row reads as UI
                      rather than as a rating. */}
                  <div className="flex gap-1 text-[#f5a623]" aria-label="Rated 5 out of 5">
                    {[0, 1, 2, 3, 4].map((s) => (
                      <Star key={s} className="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} />
                    ))}
                  </div>
                  <blockquote className="mt-5 mb-auto text-[15px] leading-[1.6]">{t.text}</blockquote>
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
                <details key={f.q} className="ads-faq ads-card px-6 py-1">
                  <summary className="flex items-center justify-between gap-4 py-5 text-[16px] font-medium">
                    {f.q}
                    <ChevronDown
                      className="ads-chevron h-[18px] w-[18px] shrink-0 text-[var(--muted)]"
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
          <div className="ads-on-dark ads-panel bg-[var(--ink)] px-6 py-16 text-center text-white sm:px-12 sm:py-20">
            <LogoMark className="mx-auto h-10 w-10" />
            <h2 className="ads-h2 mx-auto mt-6 max-w-[15ch]">
              Audit it before your competitor does
            </h2>
            <p className="mx-auto mt-5 max-w-[52ch] text-[16px] leading-[1.6] text-white/60">
              Seven tools, one credit balance. 100 free credits every month, no credit card,
              and everything unlocked from the first day.
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
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PIECES
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * The reference's two-part label: a coloured cap and a name. The name carries
 * its own word rather than repeating the brand — "WHO · FreeSERP" said nothing
 * seven times over, which is what the first pass did.
 */
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
      <span className="ads-tag">
        <b>{label}</b>
        {name}
      </span>
      <h2 className="ads-h2 mt-5">{title}</h2>
      {sub && <p className="ads-lead mx-auto mt-4 max-w-[58ch]">{sub}</p>}
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
    <div className="ads-shot-bar">
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
    <div className="ads-shot">
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
