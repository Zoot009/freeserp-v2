import type { Metadata } from "next";
import Image from "next/image";
import { Inter } from "next/font/google";
import {
  BarChart3,
  Building2,
  Check,
  ChevronDown,
  Clock,
  Download,
  Layers,
  MapPin,
  Star,
  Target,
  Users,
  Wallet,
} from "lucide-react";
import { LogoMark, Wordmark } from "@/components/landing/ui/Logo";
import { TESTIMONIALS } from "@/components/home/data";
import { CREDIT_PLANS } from "@/app/pricing/PricingPlans";
import { Cta } from "./Cta";
import "./ads.css";

/**
 * /tracking-suite — the paid-acquisition landing page for the four trackers.
 *
 * The whole page lives in this one file on purpose: copy, layout and mockups
 * together, so a change to a headline and the section it sits in is one edit in
 * one place. The only pieces kept outside are ./ads.css (Next needs CSS in a
 * .css file) and ./Cta.tsx (the single client component — see the note there).
 *
 * It is otherwise a pure server component: no hooks, no state, no hydration.
 * The FAQ is a native <details>, the nav is a plain bar, and the page ships as
 * static HTML — which is what keeps LCP low on a cold paid click.
 *
 * Layout and typography follow drospecta.framer.website, the reference for this
 * campaign: warm off-white canvas, near-black ink, Inter 600 headings, a 1072px
 * column, 20px cards inside 40px panels, and a pastel tile per feature. The
 * palette lives in ads.css so the whole page can be rethemed from two lines.
 *
 * Separate from the marketing site's own pages by design: no global Nav, no
 * Footer, no links out except signup, privacy, terms and support. Everything a
 * visitor can click either scrolls down this page or starts a signup.
 *
 * It renders inside the root layout, so Google Ads conversion tracking (gtag
 * AW-), GA4, GTM and first-party UTM capture are all inherited — no tag setup
 * needed for a new campaign beyond pointing the ad at this URL.
 */

// Inter, scoped to this page. The rest of the site is Archivo; the reference
// design is Inter, and its tighter, lower-contrast letterforms are half of why
// that layout reads the way it does.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rank Tracking for Google, Maps, YouTube and AI — FreeSERP",
  description:
    "One dashboard for Google rank tracking, Google Maps grid scans, YouTube video rankings, and AI visibility on ChatGPT, Gemini, Perplexity and Claude. 100 free credits every month, no credit card.",
  alternates: { canonical: "/tracking-suite" },
  openGraph: {
    title: "Track every ranking that matters — not just Google",
    description:
      "Google, Google Maps, YouTube and AI answers in one dashboard. Free plan, no credit card.",
    url: "/tracking-suite",
    siteName: "FreeSERP",
    type: "website",
  },
  // Paid-traffic destination, kept out of the index on purpose: it restates the
  // home page and the four tool pages, and letting Google choose between them
  // is how a site ends up ranking its ad copy instead of its content. Google Ads
  // does not require an indexed landing page. Flip `index` to true (and add the
  // route to app/sitemap.ts) if this is ever repurposed for organic search.
  robots: { index: false, follow: true },
};

/* ══════════════════════════════════════════════════════════════════════════
   CONTENT — everything a marketer edits between campaigns lives in this block.

   Every claim has to be true of the product. The four trackers map to real
   backend modules (rankings, maps-tracker, youtube, llm-tracker) and the prices
   come from CREDIT_PLANS, imported rather than restated so this page can never
   quote a figure the checkout does not honour.
   ══════════════════════════════════════════════════════════════════════════ */

type TrackerKey = "google" | "maps" | "youtube" | "ai";

type Shot = { src: string; width: number; height: number; alt: string };

/**
 * Every screenshot on this page comes from dummy-ss/freeserp-dummy-pages —
 * static pages that wear the product's own stylesheet
 * (freeserp-frontend-v2/app/dashboard.css, included verbatim) and carry invented
 * data. They are pixel-identical to the dashboard; the figures in them are not
 * measurements, and nothing on this page presents them as any customer's
 * results.
 *
 * One kit rather than a mix of live captures: the live shots were taken at
 * different times against different accounts, so they disagreed with each other
 * on scale — one project with 10 keywords beside another with 136 — and with
 * the copy around them. One source keeps the whole page telling one story.
 *
 * Captured at 2× from the frame each page declares in its own class (.r2x1 is
 * 1440×720, .r4x3 1120×840, .r8x5 1600×1000 — read those off shots.css, not the
 * README table, which disagrees for the hero). The page is the crop, so there is
 * nothing to trim. To refresh one: open the .html, DevTools → Capture full size
 * screenshot at DPR 2, overwrite the file in /public/shots.
 */
const SHOTS: Record<TrackerKey, Shot> = {
  google: {
    src: "/shots/rank-tracker.png",
    width: 2240,
    height: 1680,
    alt: "FreeSERP rank tracker: a tracked keyword with its position history chart, the SERP that produced it, and the competing pages",
  },
  maps: {
    src: "/shots/maps-tracker.png",
    width: 2240,
    height: 1680,
    alt: "FreeSERP Google Maps Tracker: a completed geo-grid scan with SoLV, ARP and ATRP, a rank pin at every grid point, and the rank distribution beneath",
  },
  youtube: {
    src: "/shots/youtube-tracker.png",
    width: 3200,
    height: 2000,
    alt: "FreeSERP YouTube Rank Tracker: tracked keywords with position, absolute rank, result block, the ranking video and its view count",
  },
  ai: {
    src: "/shots/ai-tracker.png",
    width: 3200,
    height: 2000,
    alt: "FreeSERP AI Prompt Tracker: prompts scored across ChatGPT, Claude, Gemini and Perplexity with mention rate, citation rate and prominence",
  },
};

const HERO_SHOT: Shot = {
  src: "/shots/hero-keywords.png",
  width: 2880,
  height: 1440,
  alt: "The FreeSERP dashboard: 128 keywords tracked with average position, top-3 and top-10 counts, rankings improved, competitors, and the keyword table",
};

const SUPPORTING_SHOTS: (Shot & { caption: string })[] = [
  {
    src: "/shots/competitor-analysis.png",
    width: 2240,
    height: 1680,
    caption: "Competitor analysis — your page against the ones ranking above it, scored check by check",
    alt: "FreeSERP competitor analysis: your domain and three rivals side by side with SERP position, overall SEO score, title length, meta description, word count and keyword occurrences",
  },
  {
    src: "/shots/search-console.png",
    width: 3200,
    height: 2000,
    caption: "Search Console — clicks, impressions and CTR beside the tracked position",
    alt: "FreeSERP Search Console view: total clicks, impressions, CTR and average position, a clicks trend, and the per-query table",
  },
];

interface Tracker {
  key: TrackerKey;
  kicker: string;
  title: string;
  body: string;
  points: string[];
  /** Pastel panel background — the reference's four tile tints. */
  tint: string;
  /** Saturated dot on the kicker, so the four blocks stay distinguishable. */
  dot: string;
}

const TRACKERS: Tracker[] = [
  {
    key: "google",
    kicker: "Google Rank Tracker",
    title: "Know your Google position before the client asks",
    body: "Add your keywords once and FreeSERP checks them every day — desktop and mobile, in any of 190+ countries, down to a single city. Positions, movement and the whole top-3 / top-10 split are on the dashboard when you open it.",
    points: [
      "Automated daily checks across your whole keyword set",
      "190+ countries, city-level targeting, desktop and mobile",
      "Day-over-day movement, plus Top 3, 4–10, 11–20 and 21–100 bands",
      "Search Console clicks and impressions beside every position",
    ],
    tint: "#dff0f0",
    dot: "#0454ff",
  },
  {
    key: "maps",
    kicker: "Google Map Tracker",
    title: "See your Map Pack rank street by street",
    body: "One position is a lie for a local business — you rank first outside your own door and nowhere three miles away. FreeSERP scans a geo-grid around your pin and shows the rank at every point on it.",
    points: [
      "Geo-grid scans from 3×3 up to 21×21 around your business",
      "ARP, ATRP and SoLV — the three metrics local SEOs report on",
      "Ranks read to depth 20; the top 3 counted as the local pack",
      "The competing businesses holding each point, named",
    ],
    tint: "#eef6e6",
    dot: "#4ea72e",
  },
  {
    key: "youtube",
    kicker: "YouTube Rank Tracker",
    title: "Track video rankings the way you track pages",
    body: "YouTube is the second-largest search engine and almost nobody tracks it. Point FreeSERP at a video or a channel, give it your keywords, and it reports the position the same way it reports Google.",
    points: [
      "Track any video or whole channel against your keyword set",
      "Daily positions with the same day-over-day deltas",
      "Country and language targeting on every keyword",
      "Titles, channels and thumbnails resolved automatically",
    ],
    tint: "#f0e6df",
    dot: "#d94a2b",
  },
  {
    key: "ai",
    kicker: "AI Visibility Tracker",
    title: "Find out whether ChatGPT recommends you",
    body: "A growing share of buying decisions never touches a blue link. FreeSERP runs your prompts against ChatGPT, Gemini, Perplexity and Claude on a schedule, then scores how often you are named, cited, and how early in the answer you appear.",
    points: [
      "ChatGPT, Gemini, Perplexity and Claude, run on a schedule",
      "Mention rate, citation rate and prominence in the answer",
      "Share of voice against the competitors you name",
      "Every answer stored, so you can read what the model said",
    ],
    tint: "#f0dfe9",
    dot: "#8b3ab0",
  },
];

const STATS = [
  { value: "4", label: "trackers on one credit balance" },
  { value: "190+", label: "countries and all device types" },
  { value: "50M+", label: "indexed search terms" },
  { value: "100", label: "free credits every month" },
];

const PERSONAS = [
  {
    icon: Building2,
    title: "Agencies",
    text: "One dashboard per client, daily updates, and CSV or PDF exports that drop straight into the monthly report. No per-seat pricing.",
  },
  {
    icon: MapPin,
    title: "Local businesses",
    text: "Find out where in your service area you actually show up in the Map Pack — and which competitor is holding the corners you lose.",
  },
  {
    icon: Users,
    title: "In-house SEO and creators",
    text: "Google, YouTube and AI answers side by side, so you can prove which channel moved and defend the budget behind it.",
  },
];

const BENEFITS = [
  {
    icon: Wallet,
    title: "One balance, every tool",
    text: "Credits are shared. Spend them on rank checks, map grids, audits or keyword research — nothing is locked behind a higher tier.",
  },
  {
    icon: Clock,
    title: "Runs without you",
    text: "Set a frequency and recurring checks run themselves. Movement lands in your activity feed instead of waiting for you to look.",
  },
  {
    icon: BarChart3,
    title: "Search Console, connected",
    text: "Link your property for free and see clicks, impressions and CTR sitting next to the tracked position they belong to.",
  },
  {
    icon: Target,
    title: "Competitor analysis",
    text: "Pull the real top 10 for any tracked keyword, compare the pages side by side, and pick the gap worth closing.",
  },
  {
    icon: Download,
    title: "Export anything",
    text: "CSV and PDF export on every table, so the data lives in your stack rather than behind our login.",
  },
  {
    icon: Layers,
    title: "Projects per domain",
    text: "Your site, a client site, or a rival you are watching — each gets its own keywords and its own tracked history.",
  },
];

const FREE_POINTS = [
  "All four trackers unlocked",
  "190+ countries, all devices",
  "Search Console included",
  "No credit card required",
];

const PAID_POINTS = [
  "Automated recurring checks",
  "Local map grid scans and site audits",
  "CSV and PDF export",
  "Cancel anytime",
];

const FAQS = [
  {
    q: "What do I get on the free plan?",
    a: "100 credits every month, refilled automatically, with no credit card. Every tool is unlocked on it — Google, Maps, YouTube and AI tracking all draw from the same balance.",
  },
  {
    q: "How do credits work across the four trackers?",
    a: "One credit checks one keyword on Google or YouTube. A local map grid scan costs 3 to 57 credits depending on the grid size you choose, and research tools such as the Keyword Magic Tool and Website Audit draw from the same balance.",
  },
  {
    q: "Do you really track the Google Map Pack?",
    a: "Yes. You place a pin, choose a radius and a grid size from 3×3 to 21×21, and we read the local results at every point — then report ARP, ATRP and SoLV plus the competing businesses at each point.",
  },
  {
    q: "Which AI assistants does the AI tracker cover?",
    a: "ChatGPT, Gemini, Perplexity and Claude. You supply the prompts your buyers would actually type, and we score how often you are mentioned, how often you are cited, and who gets named instead.",
  },
  {
    q: "Can I track Google and YouTube for the same brand?",
    a: "Yes. YouTube projects sit alongside your Google projects in the same account and spend the same credit balance, so nothing needs a second subscription.",
  },
  {
    q: "Do I need a credit card to start?",
    a: "No. The free plan needs no card. Paid plans start at $19/month for 2,000 credits and can be cancelled at any time — email support@freeserp.com if you want a hand sizing one.",
  },
];

/** The page column. 1072px is the reference's container width. */
const WRAP = "mx-auto w-full max-w-[1072px] px-5 sm:px-8";

/* ══════════════════════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════════════════════ */

export default function TrackingSuitePage() {
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
          A floating capsule, the way the reference does it.
          `fixed`, not `sticky`, for the same reason the site Nav and the
          existing landing Header are: globals.css puts overflow-x: hidden on
          <body>, which makes it a scroll container and stops sticky from ever
          sticking. The hero carries the matching top padding.
          Logo and one CTA, nothing else: every extra destination in the bar of
          a paid landing page is a way to spend the click without converting.
          The section anchors still exist for the in-page links (the hero's
          "See pricing"), they just are not advertised up here. */}
      <header className="fixed inset-x-0 top-3 z-50 px-4 sm:top-5">
        <div className="mx-auto flex w-full max-w-[1072px] items-center gap-6 rounded-full border border-[#0e0f0c1f] bg-white/80 py-2.5 pr-2.5 pl-4 backdrop-blur-xl sm:pl-6">
          <a href="#top" className="flex items-center gap-2.5">
            <LogoMark className="h-6.5 w-6.5" />
            <Wordmark className="text-[16px] font-semibold tracking-[-0.02em] text-[var(--ink)]" />
          </a>
          <Cta
            placement="nav"
            label="Start for free"
            size="sm"
            variant="ink"
            arrow={false}
            className="ml-auto"
          />
        </div>
      </header>

      <main>
        {/* ── hero ────────────────────────────────────────────────────────
            The screenshot is the real keywords dashboard, not an illustration.
            priority + a real width/height pair: it is the LCP element, and a
            paid click cannot afford it to arrive late or shift the layout. */}
        <section id="top" className="relative pt-28 pb-6 sm:pt-36">
          <div className={`${WRAP} text-center`}>
            <span className="ads-tag">Google · Maps · YouTube · AI</span>

            <h1 className="ads-h1 mx-auto mt-6 max-w-[16ch]">
              Track every ranking that matters
            </h1>

            <p className="ads-lead mx-auto mt-5 max-w-[64ch]">
              FreeSERP tracks your Google positions, your Google Maps pack rank street by
              street, your YouTube videos, and whether ChatGPT, Gemini, Perplexity and
              Claude recommend you — in one dashboard, updated every day.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Cta placement="hero" />
              <a href="#pricing" className="ads-btn ads-btn-lg ads-btn-ghost">
                See pricing
              </a>
            </div>

            <p className="mt-5 text-[14px] text-[var(--muted)]">
              100 free credits every month · no credit card · every tool unlocked
            </p>
          </div>

          <div className={`${WRAP} mt-12 sm:mt-16`}>
            <Shot
              src={HERO_SHOT.src}
              alt={HERO_SHOT.alt}
              width={HERO_SHOT.width}
              height={HERO_SHOT.height}
              sizes="(max-width: 1120px) 100vw, 1010px"
              label="app.freeserp.com/keywords"
              priority
            />
          </div>
        </section>

        {/* ── personas ────────────────────────────────────────────────────
            Paid traffic arrives from one ad group with one idea of the product.
            This row lets an agency buyer and a single-location restaurant owner
            both decide, in one glance, that the page is written for them. */}
        <section className="py-20 sm:py-28">
          <div className={WRAP}>
            <SectionHead tag="Who it is for" title="Built for everyone chasing a position" />

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {PERSONAS.map((p) => (
                <div key={p.title} className="ads-card p-7">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--canvas)] text-[var(--ink)]">
                    <p.icon className="h-[19px] w-[19px]" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-5 text-[19px] font-semibold tracking-[-0.02em]">{p.title}</h3>
                  <p className="mt-2.5 text-[15px] leading-[1.6] text-[var(--body)]">{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── the four trackers ───────────────────────────────────────────
            Each is a pastel 40px panel, alternating sides on desktop and
            stacking visual-first on mobile so a phone reader sees the product
            before the prose. Each carries its own CTA: a visitor who came for
            the map tracker should be able to sign up the moment that section
            convinces them. */}
        <section id="trackers" className="scroll-mt-24 pb-4">
          <div className={WRAP}>
            <SectionHead
              tag="The suite"
              title="Four trackers, one dashboard"
              sub="Search did not stay in one place, so rank tracking cannot either. These four cover where your buyers actually look."
            />

            <div className="mt-12 space-y-5">
              {TRACKERS.map((t) => {
                const shot = SHOTS[t.key];

                return (
                  <article
                    key={t.key}
                    id={t.key}
                    className="ads-panel scroll-mt-24 overflow-hidden p-5 pb-7 sm:p-8 sm:pb-10 lg:p-10 lg:pb-12"
                    style={{ background: t.tint }}
                  >
                    <div className="mx-auto max-w-[780px] px-1 text-center">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3.5 py-1.5 text-[13px] font-medium">
                        <i
                          className="h-[7px] w-[7px] rounded-full"
                          style={{ background: t.dot }}
                          aria-hidden
                        />
                        {t.kicker}
                      </span>

                      <h3 className="ads-h3 mt-5">{t.title}</h3>
                      <p className="mx-auto mt-4 max-w-[62ch] text-[16px] leading-[1.6] text-[var(--body)]">
                        {t.body}
                      </p>

                      {/* Two columns so four bullets cost two lines of height, not
                          four — the screenshot below is what this panel is for. */}
                      <ul className="mx-auto mt-7 grid gap-x-8 gap-y-3 text-left sm:grid-cols-2">
                        {t.points.map((p) => (
                          <li key={p} className="flex gap-3 text-[15px] leading-[1.45]">
                            <span className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/80">
                              <Check className="h-3 w-3" strokeWidth={2.8} />
                            </span>
                            {p}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-8">
                        <Cta placement={`tracker_${t.key}`} label="Start for free" size="sm" />
                      </div>
                    </div>

                    <div className="mt-10">
                      <Shot
                        src={shot.src}
                        alt={shot.alt}
                        width={shot.width}
                        height={shot.height}
                        sizes="(max-width: 1120px) 100vw, 930px"
                        label={`app.freeserp.com — ${t.kicker}`}
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── stats ───────────────────────────────────────────────────────── */}
        <section className="py-20 sm:py-28">
          <div className={WRAP}>
            <div className="ads-on-dark ads-panel grid grid-cols-2 gap-y-10 bg-[var(--ink)] px-8 py-12 text-white sm:px-12 lg:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
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

        {/* ── benefits and supporting screenshots ─────────────────────────── */}
        <section id="why" className="scroll-mt-24 pb-20 sm:pb-28">
          <div className={WRAP}>
            <SectionHead
              tag="Why FreeSERP"
              title="All-in-one, no extra tools needed"
              sub="Tracking is only useful if it runs on its own, connects to the data you already have, and leaves the building when you need to report on it."
            />

            <div className="mt-12 space-y-10">
              {SUPPORTING_SHOTS.map((s) => (
                <figure key={s.src}>
                  <Shot
                    src={s.src}
                    alt={s.alt}
                    width={s.width}
                    height={s.height}
                    sizes="(max-width: 1120px) 100vw, 1010px"
                  />
                  <figcaption className="mt-3.5 text-center text-[13px] text-[var(--muted)]">
                    {s.caption}
                  </figcaption>
                </figure>
              ))}
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {BENEFITS.map((b) => (
                <div key={b.title} className="ads-card p-7">
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

        {/* ── pricing ─────────────────────────────────────────────────────
            Prices come from CREDIT_PLANS. The "what it buys" line uses the same
            divisor the pricing page does: a credit checks one keyword and a
            month is 30 days, so credits / 30 is how many keywords the balance
            tracks daily for a full month. */}
        <section id="pricing" className="scroll-mt-24 pb-20 sm:pb-28">
          <div className={WRAP}>
            <SectionHead
              tag="Pricing"
              title="Start free. Pay when you outgrow it."
              sub="One balance covers Google, Maps, YouTube and AI tracking — plus audits and keyword research. Nothing is reserved for a higher tier."
            />

            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <article className="ads-card flex flex-col p-7">
                <h3 className="text-[15px] font-semibold">Free</h3>
                <p className="mt-4 text-[40px] leading-none font-semibold tracking-[-0.03em]">
                  $0
                  <span className="ml-1 text-[14px] font-normal text-[var(--muted)]">/mo</span>
                </p>
                <p className="mt-3.5 text-[13.5px] leading-[1.55] text-[var(--body)]">
                  100 credits every month, refilled automatically. Enough to keep 3 keywords
                  checked daily.
                </p>
                <ul className="mt-6 mb-8 space-y-3">
                  {FREE_POINTS.map((p) => (
                    <Point key={p}>{p}</Point>
                  ))}
                </ul>
                <Cta
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
                  className="ads-card relative flex flex-col p-7"
                  style={plan.popular ? { background: "#eef6e6", borderColor: "#0e0f0c1f" } : undefined}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 right-6 rounded-full bg-[var(--ink)] px-3 py-1 text-[11px] font-medium text-white">
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
                    {Math.floor(plan.credits / 30).toLocaleString()} keywords checked every day.{" "}
                    {plan.who}.
                  </p>
                  <ul className="mt-6 mb-8 space-y-3">
                    {PAID_POINTS.map((p) => (
                      <Point key={p}>{p}</Point>
                    ))}
                  </ul>
                  <Cta
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
                <figure key={t.name} className="ads-card flex flex-col p-7">
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
            <h2 className="ads-h2 mx-auto mt-6 max-w-[16ch]">
              Every ranking you own, on one screen
            </h2>
            <p className="mx-auto mt-5 max-w-[54ch] text-[16px] leading-[1.6] text-white/60">
              Google, Google Maps, YouTube and AI answers. 100 free credits every month, no
              credit card, and every tool unlocked from the first day.
            </p>
            <div className="mt-8 flex justify-center">
              <Cta placement="final_cta" />
            </div>

            <ul className="mx-auto mt-12 flex max-w-[640px] flex-wrap justify-center gap-x-6 gap-y-2 text-[13px] text-white/45">
              {TRACKERS.map((t) => (
                <li key={t.key} className="flex items-center gap-2">
                  <i
                    className="h-[6px] w-[6px] rounded-full"
                    style={{ background: t.dot }}
                    aria-hidden
                  />
                  {t.kicker}
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
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PIECES
   ══════════════════════════════════════════════════════════════════════════ */

function SectionHead({ tag, title, sub }: { tag: string; title: string; sub?: string }) {
  return (
    <div className="mx-auto max-w-[66ch] text-center">
      <span className="ads-tag">{tag}</span>
      <h2 className="ads-h2 mt-5">{title}</h2>
      {sub && <p className="ads-lead mx-auto mt-4 max-w-[58ch]">{sub}</p>}
    </div>
  );
}

function Point({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2.5 text-[13.5px] leading-[1.45] text-[var(--body)]">
      <Check className="mt-px h-4 w-4 shrink-0 text-[var(--ink)]" strokeWidth={2.4} />
      {children}
    </li>
  );
}

/** The window bar above a screenshot or mockup. */
function ShotBar({ label }: { label?: string }) {
  return (
    <div className="ads-shot-bar">
      <span className="flex gap-1.5" aria-hidden>
        <i className="h-[7px] w-[7px] rounded-full bg-[#0e0f0c1f]" />
        <i className="h-[7px] w-[7px] rounded-full bg-[#0e0f0c1f]" />
        <i className="h-[7px] w-[7px] rounded-full bg-[#0e0f0c1f]" />
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
