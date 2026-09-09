import type { Metadata } from "next";
import Image from "next/image";
import { Inter } from "next/font/google";
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  Clock,
  Download,
  Globe,
  Layers,
  Link2,
  ListTree,
  MessageSquareText,
  Quote,
  Search,
  Star,
  Target,
  Wallet,
} from "lucide-react";
import { LogoMark, Wordmark } from "@/components/landing/ui/Logo";
import { TESTIMONIALS } from "@/components/home/data";
import { CREDIT_PLANS } from "@/app/pricing/PricingPlans";
import { Cta } from "./Cta";
import { PlatformMark, type PlatformId } from "./PlatformMarks";
import { SignupPopup } from "./SignupPopup";
import "./ads.css";

/**
 * /ai-rank-tracker — the paid-acquisition landing page for the AI Prompt
 * Tracker, told platform by platform.
 *
 * The third page in the ad family. /tracking-suite sells the four rank trackers
 * together and gives AI one block of four bullets; /audit-suite sells the audit
 * and research tools. This one takes the AI tracker on its own and spends the
 * page on the thing those two have no room for: what FreeSERP actually does on
 * ChatGPT, Claude, Gemini and Perplexity, and where the four genuinely differ.
 *
 * Those differences are not decoration. They come from
 * freeserp-backend-v2/src/modules/llm-tracker/llmPlatform.adapter.ts, where each
 * capability was measured against the live API — ChatGPT and Gemini are read
 * from the products' own output, Claude and Perplexity are answered through
 * their APIs on a pinned model, Gemini refuses country targeting outright, and
 * Claude costs about six times an answer, which is why it is 3 credits and the
 * rest are 1. A landing page that flattened all that into "we track four AI
 * platforms" would be selling something the product does not do.
 *
 * The whole page lives in this one file: copy and layout together, so a change
 * to a headline and the section it sits in is one edit in one place. The only
 * pieces outside are ./ads.css (Next needs CSS in a .css file), ./PlatformMarks
 * (four long SVG paths) and the two client islands, ./Cta and ./SignupPopup.
 *
 * It is otherwise a pure server component: no hooks, no state, no hydration.
 * The FAQ is a native <details> and the page ships as static HTML, which is
 * what keeps LCP low on a cold paid click.
 *
 * It renders inside the root layout, so Google Ads conversion tracking (gtag
 * AW-), GA4, GTM and first-party UTM capture are all inherited — no tag setup
 * needed for a new campaign beyond pointing the ad at this URL.
 */

// Inter, scoped to this page — the same typeface as /audit-suite, whose
// typographic system this page shares. The rest of the marketing site is
// Archivo.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Rank Tracker for ChatGPT, Claude, Gemini and Perplexity — FreeSERP",
  description:
    "Track whether AI assistants name you. FreeSERP runs your prompts on ChatGPT, Claude, Gemini and Perplexity and scores mention rate, citation rate, prominence and share of voice. 100 free credits every month, no credit card.",
  alternates: { canonical: "/ai-rank-tracker" },
  openGraph: {
    title: "Do the AI assistants name you?",
    description:
      "Rank tracking for ChatGPT, Claude, Gemini and Perplexity — mention rate, citations, prominence and share of voice, on a schedule.",
    url: "/ai-rank-tracker",
    siteName: "FreeSERP",
    type: "website",
  },
  // Paid-traffic destination, kept out of the index on purpose, exactly as
  // /audit-suite and /tracking-suite are: it restates the home page and the
  // tool pages, and letting Google choose between them is how a site ends up
  // ranking its ad copy instead of its content. Google Ads does not require an
  // indexed landing page. Flip `index` to true (and add the route to
  // app/sitemap.ts) if this is ever repurposed for organic search.
  robots: { index: false, follow: true },
};

/* ══════════════════════════════════════════════════════════════════════════
   CONTENT — everything a marketer edits between campaigns lives in this block.

   Every claim has to be true of the product. The platform capabilities come
   from llmPlatform.adapter.ts, the metrics from llmMetrics.ts, the limits from
   llmPrompt.routes.ts, the credit costs from the backend's credits/catalog.ts,
   and the prices from CREDIT_PLANS, imported rather than restated so this page
   can never quote a figure checkout does not honour.
   ══════════════════════════════════════════════════════════════════════════ */

type Shot = { src: string; width: number; height: number; alt: string };

/**
 * The screenshot comes from freeserp-dummy-pages — static pages that wear the
 * product's own stylesheet (freeserp-frontend-v2/app/dashboard.css, included
 * verbatim) and carry invented data. It is pixel-identical to the dashboard;
 * the figures in it are not measurements, and nothing on this page presents
 * them as any customer's results.
 *
 * Captured at 2× from the frame the page declares in its own class (.r8x5 is
 * 1600×1000). The page is the crop, so there is nothing to trim.
 */
const HERO_SHOT: Shot = {
  src: "/shots/ai-tracker.png",
  width: 3200,
  height: 2000,
  alt: "FreeSERP AI Prompt Tracker: the brand Patagonia with multiple prompts tracked across ChatGPT, Claude, Gemini and Perplexity, an 83% average mention rate and 70% cited as a source, and a mention rate, cited rate, prominence and schedule on every prompt and platform",
};

/** What the hero screenshot is actually showing, said in four lines. */
const HERO_POINTS = [
  "ChatGPT, Claude, Gemini and Perplexity",
  "Mention rate, citations and prominence",
  "Up to 5 answers a prompt, so it is a rate",
  "1 credit an answer — 3 on Claude",
];

interface Platform {
  id: PlatformId;
  /** Panel tint and mark colour — each platform's own, not one repeated accent. */
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
 * The four platforms, one panel each.
 *
 * Order follows the dashboard's own AI Platforms nav — ChatGPT, Claude, Gemini,
 * Perplexity — so a visitor who signs up finds the same four in the same order.
 */
const PLATFORMS: Platform[] = [
  {
    id: "chat_gpt",
    tint: "#f1f2f0",
    dot: "#0d0d0d",
    name: "ChatGPT",
    kicker: "The one they ask first",
    title: "The answer the product actually gave",
    body: "FreeSERP reads ChatGPT's own output rather than re-creating an answer through a raw model call. What gets scored is what a person asking that question would have been shown — with web search forced on, so you are measuring AI search rather than the model's memory of its training data.",
    points: [
      "Real product output, not an API re-creation",
      "Web search forced on, so answers are retrieved and not remembered",
      "Country targeting on any prompt",
      "Answers keep a link back, so you can reproduce what it said",
    ],
    spec: [
      { k: "Answer comes from", v: "The ChatGPT product" },
      { k: "Model", v: "Recorded per run" },
      { k: "Country targeting", v: "Yes" },
      { k: "Cost", v: "1 credit an answer" },
    ],
  },
  {
    id: "claude",
    tint: "#f8efe9",
    dot: "#d97757",
    name: "Claude",
    kicker: "The considered second opinion",
    title: "Pinned to one model, so history means something",
    body: "Claude answers through its API with web search turned on, on a version we pin deliberately. A bare model name auto-selects whatever is latest, which silently moves your numbers mid-history — this way a change in the chart is a change in your visibility, not a model that moved underneath it.",
    points: [
      "Pinned model version, so runs stay comparable over time",
      "Web search forced on, and country targeting supported",
      "Linked sources parsed out of every answer",
      "3 credits an answer — priced on what it really costs",
    ],
    spec: [
      { k: "Answer comes from", v: "Claude API, web search on" },
      { k: "Model", v: "claude-haiku-4-5, pinned" },
      { k: "Country targeting", v: "Yes" },
      { k: "Cost", v: "3 credits an answer" },
    ],
  },
  {
    id: "gemini",
    tint: "#e9eefd",
    dot: "#4a7dfc",
    name: "Gemini",
    kicker: "The one sitting next to Google",
    title: "Read straight from the product, same as ChatGPT",
    body: "Gemini is where a Google search increasingly ends, and FreeSERP reads its product output the same way it reads ChatGPT's. One honest limit, measured against the live API rather than assumed: Gemini rejects country targeting outright, so its answers are global — every other platform here can be pinned to a market.",
    points: [
      "Real product output on Gemini 2.5 Flash",
      "Global answers — Gemini will not accept a country",
      "Scored on exactly the same metrics as every other platform",
      "1 credit an answer",
    ],
    spec: [
      { k: "Answer comes from", v: "The Gemini product" },
      { k: "Model", v: "Recorded per run" },
      { k: "Country targeting", v: "Not supported" },
      { k: "Cost", v: "1 credit an answer" },
    ],
  },
  {
    id: "perplexity",
    tint: "#e4f0f1",
    dot: "#20808d",
    name: "Perplexity",
    kicker: "The one that always cites",
    title: "A search product, so every answer arrives with sources",
    body: "Perplexity retrieves before it answers, every single time — there is no web search to switch on, because it is the whole product. That makes it the cleanest read you have on whether your pages are being used as a source rather than merely recalled, which is a different problem with a different fix.",
    points: [
      "Retrieves on every answer — there is nothing to force",
      "Sources on every answer, resolved down to the domain",
      "Country targeting on any prompt",
      "1 credit an answer",
    ],
    spec: [
      { k: "Answer comes from", v: "Perplexity Sonar, live retrieval" },
      { k: "Model", v: "sonar, pinned" },
      { k: "Country targeting", v: "Yes" },
      { k: "Cost", v: "1 credit an answer" },
    ],
  },
];

/** The same four, as one table — the comparison the blocks above cannot make. */
const COMPARISON: {
  id: PlatformId;
  name: string;
  source: string;
  model: string;
  geo: boolean;
  geoNote: string;
  credits: string;
}[] = [
  {
    id: "chat_gpt",
    name: "ChatGPT",
    source: "Product output",
    model: "Recorded per run",
    geo: true,
    geoNote: "Yes",
    credits: "1 credit",
  },
  {
    id: "claude",
    name: "Claude",
    source: "API, web search on",
    model: "claude-haiku-4-5",
    geo: true,
    geoNote: "Yes",
    credits: "3 credits",
  },
  {
    id: "gemini",
    name: "Gemini",
    source: "Product output",
    model: "Recorded per run",
    geo: false,
    geoNote: "Global only",
    credits: "1 credit",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    source: "Sonar, always retrieves",
    model: "sonar",
    geo: true,
    geoNote: "Yes",
    credits: "1 credit",
  },
];

/** What a run measures, once the answers are in. */
const METRICS = [
  {
    icon: Target,
    title: "Mention rate",
    text: "How many of the run's answers named you. A rate, not a tick — these platforms answer with temperature, so a single answer flips run to run and only a rate is a measurement.",
  },
  {
    icon: Link2,
    title: "Citation rate",
    text: "How often you were used as a linked source. Tracked apart from a mention and never merged into it: being named is awareness, being cited is a link, and the two take different work.",
  },
  {
    icon: BarChart3,
    title: "Prominence",
    text: "How early in the answer your first mention lands, as a percentage of the way through. It is the closest thing AI search has to a rank position, and it works on every platform.",
  },
  {
    icon: Quote,
    title: "Share of voice",
    text: "Which of the competitors you named turned up in the same answer. Not a leaderboard you cannot verify — the rivals you listed, counted in the answers you paid for.",
  },
  {
    icon: Search,
    title: "Fan-out queries",
    text: "The searches the assistant actually ran to build its answer. Almost nobody surfaces these, and they are the most directly actionable thing on the page: those are the terms to go and rank for.",
  },
  {
    icon: MessageSquareText,
    title: "The answer itself",
    text: "Every answer is stored, with your brand highlighted in the text, the sources it linked listed out, and the model that produced it recorded beside it.",
  },
];

/** The shapes of prompt that AI visibility is actually won and lost on. */
const CHIPS = [
  "best waterproof rain jacket",
  "patagonia vs arc'teryx",
  "alternatives to [competitor]",
  "cheapest CRM for a small team",
  "is [brand] any good",
  "who should I use for [service]",
  "top 5 [category] in 2026",
  "[category] for beginners",
  "what do people say about [brand]",
  "recommend a [product] under $100",
];

const STEPS = [
  {
    n: "01",
    title: "Add your brand",
    text: "Name, domain, and up to 25 aliases and 25 competitors. Terms too generic to prove anything are reported back and left out of the score, so an ordinary word your name is spelled with never counts as a mention.",
  },
  {
    n: "02",
    title: "Write the prompts",
    text: "The questions your buyers actually type, up to 500 characters each and up to 250 per brand. Paste a whole list at once rather than adding them one at a time.",
  },
  {
    n: "03",
    title: "Pick platforms and samples",
    text: "Any of the platforms, per prompt, and 1 to 5 answers each run — three by default. More samples is a steadier rate; fewer is a cheaper one.",
  },
  {
    n: "04",
    title: "Set a cadence",
    text: "Daily, every three days, weekly or monthly — or leave it manual and run it yourself. Weekly is the default because AI answers drift slowly enough that daily mostly buys noise.",
  },
];

const STATS = [
  { value: "All", label: "AI platforms, one dashboard" },
  { value: "5", label: "answers a prompt, every run" },
  { value: "250", label: "prompts per brand" },
  { value: "100", label: "free credits every month" },
];

const BENEFITS = [
  {
    icon: Layers,
    title: "A page per platform",
    text: "The brand view answers 'how is this brand doing'. The platform view answers the other one — how am I doing on Claude — across every brand you track, in one table.",
  },
  {
    icon: Clock,
    title: "Runs without you",
    text: "Give a prompt a cadence and it re-runs itself. Movement lands in the dashboard instead of waiting for you to remember to look.",
  },
  {
    icon: Globe,
    title: "Per-market answers",
    text: "Pin a prompt to a country on ChatGPT, Claude and Perplexity, and see how the answer changes between the markets you sell in.",
  },
  {
    icon: ListTree,
    title: "Read the actual answer",
    text: "Every stored answer is there in full, with your brand marked up in it, so you can see the sentence you were named in rather than a number claiming you were.",
  },
  {
    icon: Download,
    title: "Export anything",
    text: "CSV export on the tables, so the numbers live in your reporting stack rather than behind our login.",
  },
  {
    icon: Wallet,
    title: "One balance, every tool",
    text: "The same credits run Google, Maps and YouTube rank tracking, site audits and keyword research. Nothing here is locked behind a higher tier.",
  },
];

const FREE_POINTS = [
  "All platforms unlocked",
  "Mentions, citations, prominence",
  "Every answer stored in full",
  "No credit card required",
];

const PAID_POINTS = [
  "Recurring runs on a cadence",
  "Bigger prompt sets, more samples",
  "CSV export",
  "Cancel anytime",
];

const FAQS = [
  {
    q: "What does the AI Rank Tracker actually do?",
    a: "It asks the AI assistants the questions your buyers ask, on a schedule, and scores what comes back. For every prompt you get the share of answers that named you, the share that linked to you as a source, how early in the answer you appeared, which competitors were named alongside you, and the full text of every answer it collected.",
  },
  {
    q: "Why these platforms?",
    a: "ChatGPT, Claude, Gemini and Perplexity are where AI answers are actually being read, and each is reached in the way that gives the truest result: ChatGPT and Gemini are read from their own product output, while Claude and Perplexity are answered through their APIs on a pinned model version with web search on.",
  },
  {
    q: "What does it cost in credits?",
    a: "One credit per answer on ChatGPT, Gemini and Perplexity, and three on Claude — Claude costs us about six times as much an answer, and pricing it apart stops the cheap platforms subsidising it. A run is one prompt × the platforms you picked × your samples per run, so one prompt on every platform at three samples each is 18 credits.",
  },
  {
    q: "Why more than one answer per prompt?",
    a: "Because these models do not answer identically twice. Ask once and you learn what one roll of the dice said; ask three to five times and you have a mention rate that means something and can be compared with last week's.",
  },
  {
    q: "Can I track a specific country?",
    a: "On ChatGPT, Claude and Perplexity, yes — set a country on the prompt and the answer is retrieved for that market. Gemini rejects country targeting at the API level, so Gemini answers are global. We would rather say that than quietly return a global answer labelled as a local one.",
  },
  {
    q: "Is this the same as Google rank tracking?",
    a: "No, and it does not replace it. There is no position 1 to 10 in an AI answer — there is being named or not, being cited or not, and how early you turn up. FreeSERP tracks both worlds on one account and one balance: Google, Maps and YouTube positions beside AI visibility.",
  },
  {
    q: "Do I need a credit card to start?",
    a: "No. The free plan needs no card and includes 100 credits every month, refilled automatically. Paid plans start at $19/month for 2,000 credits and can be cancelled at any time — email support@freeserp.com if you want a hand sizing one.",
  },
];

/** The page column. 1139px, matching /audit-suite. */
const WRAP = "mx-auto w-full max-w-[1139px] px-5 sm:px-8";

/* ══════════════════════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════════════════════ */

export default function AiRankTrackerPage() {
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
    <div className={`airt-scope ${inter.className} w-full overflow-x-hidden`}>
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
            page next to /audit-suite, and it lets the one product shot — a
            light dashboard — sit at the centre of the frame with real contrast
            behind it rather than white on white. */}
        <section
          id="top"
          className="airt-band airt-on-dark pt-28 pb-[190px] sm:pt-36 sm:pb-[240px]"
        >
          <div className={`${WRAP} text-center`}>
            <a
              href="#platforms"
              className="inline-flex items-center gap-2.5 rounded-full border border-white/16 bg-white/8 py-1.5 pr-4 pl-1.5 text-[13px] font-medium text-white/72 transition-colors hover:border-white/30"
            >
              <span className="rounded-full bg-[var(--accent)] px-2.5 py-1 text-[11px] font-semibold tracking-[0.04em] text-white uppercase">
                New
              </span>
              A page for every assistant you track
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
            </a>

            <h1 className="airt-h1 mx-auto mt-7 max-w-[19ch] text-white">
              Rank tracking for ChatGPT, Claude, Gemini and Perplexity
            </h1>

            <p className="airt-lead mx-auto mt-6 max-w-[62ch]">
              A growing share of buying decisions never touches a blue link — it ends at an
              assistant&rsquo;s answer. FreeSERP asks the questions your buyers ask, on every
              platform, and scores how often you are named, how often you are cited, and how
              early in the answer you appear.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Cta placement="hero" label="Start free — 100 credits" />
              <a href="#platforms" className="airt-btn airt-btn-lg airt-btn-ghost">
                See the platforms
              </a>
            </div>

            {/* The four marks, named. On an AI page the logos are the product
                claim, so they are stated once at full size here rather than
                scrolled past in a strip. */}
            <ul className="mt-11 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              {PLATFORMS.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center gap-2.5 text-[15px] font-medium text-white/80"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-white text-[var(--ink)]">
                    <PlatformMark id={p.id} size={17} />
                  </span>
                  {p.name}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* The screenshot straddles the band and the canvas. `relative` is load
            bearing: the band above is positioned, and a static sibling would
            paint underneath it. */}
        <div className={`${WRAP} relative z-10 -mt-[150px] sm:-mt-[190px]`}>
          <Shot
            src={HERO_SHOT.src}
            alt={HERO_SHOT.alt}
            width={HERO_SHOT.width}
            height={HERO_SHOT.height}
            sizes="(max-width: 1180px) 100vw, 1075px"
            label="app.freeserp.com/dashboard/ai-prompt-tracker"
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
            Above: one brand&rsquo;s prompts, scored on every platform
          </p>
        </div>

        {/* ── the four platforms ────────────────────────────────────────────
            The centre of the page. Copy on the left, the capability spec on the
            right, one tinted panel per platform in that platform's own colour —
            because the four are genuinely different, and a page that painted
            them all the same blue would be implying they behave the same. */}
        <section id="platforms" className="scroll-mt-24 pt-20 sm:pt-28">
          <div className={WRAP}>
            <SectionHead
              label="Platforms"
              name="The platforms"
              title="What FreeSERP does on each assistant"
              sub="Reached in whichever way gives the truest answer, and scored the same way once the answer is in."
            />
          </div>

          <div className={`${WRAP} mt-14 space-y-5`}>
            {PLATFORMS.map((p) => (
              <article
                key={p.id}
                id={p.id.replace("_", "-")}
                className="airt-plat scroll-mt-24 p-7 sm:p-10"
                style={
                  { "--tint": p.tint, "--dot": p.dot } as React.CSSProperties
                }
              >
                <div className="grid gap-9 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
                  <div>
                    <div className="flex items-center gap-4">
                      <span className="airt-plat-mark">
                        <PlatformMark id={p.id} size={26} />
                      </span>
                      <div>
                        <h3 className="text-[21px] font-semibold tracking-[-0.6px]">{p.name}</h3>
                        <p className="text-[13.5px] text-[var(--muted)]">{p.kicker}</p>
                      </div>
                    </div>

                    <h4 className="airt-h3 mt-7">{p.title}</h4>
                    <p className="mt-4 max-w-[58ch] text-[16px] leading-[1.6] text-[var(--body)]">
                      {p.body}
                    </p>

                    <ul className="mt-7 space-y-3">
                      {p.points.map((pt) => (
                        <Point key={pt}>{pt}</Point>
                      ))}
                    </ul>
                  </div>

                  <dl className="airt-spec self-start">
                    {p.spec.map((row) => (
                      <div key={row.k}>
                        <dt>{row.k}</dt>
                        <dd>{row.v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── comparison ───────────────────────────────────────────────────
            Four panels can each be honest and still leave the comparison
            unmade. This is the answer to "so which one do I turn on", on one
            screen. */}
        <section className="py-20 sm:py-28">
          <div className={WRAP}>
            <SectionHead
              label="Compare"
              name="Side by side"
              title="Where they actually differ"
              sub="Measured against the live APIs, not assumed — including the one limitation we would rather state than paper over."
            />

            <div className="airt-table-scroll mt-12">
              <table className="airt-table">
                <thead>
                  <tr>
                    <th scope="col">Platform</th>
                    <th scope="col">Answer comes from</th>
                    <th scope="col">Model</th>
                    <th scope="col">Country targeting</th>
                    <th scope="col">Credits an answer</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row) => (
                    <tr key={row.id}>
                      <th scope="row">
                        <span className="flex items-center gap-2.5">
                          <PlatformMark id={row.id} size={17} />
                          {row.name}
                        </span>
                      </th>
                      <td>{row.source}</td>
                      <td>{row.model}</td>
                      <td className={row.geo ? "airt-yes" : "airt-no"}>{row.geoNote}</td>
                      <td>{row.credits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-center text-[13px] text-[var(--muted)]">
              Web search is forced on wherever the platform allows it — Perplexity always
              retrieves, so there is nothing to force.
            </p>
          </div>
        </section>

        {/* ── what a run measures ───────────────────────────────────────── */}
        <section id="metrics" className="scroll-mt-24 pb-20 sm:pb-28">
          <div className={WRAP}>
            <SectionHead
              label="Metrics"
              name="What you get back"
              title="What every run tells you"
              sub="The same metrics on every platform, so a number from ChatGPT and a number from Claude can sit in the same column."
            />

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {METRICS.map((m) => (
                <div key={m.title} className="airt-card p-7">
                  <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[var(--surface)]">
                    <m.icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-5 text-[17px] font-semibold tracking-[-0.5px]">{m.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-[1.6] text-[var(--body)]">{m.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── prompt shapes ────────────────────────────────────────────── */}
        <section className="pb-20 sm:pb-28">
          <div className={WRAP}>
            <SectionHead
              label="Prompts"
              name="What to track"
              title="The questions worth asking"
              sub="Not keywords — questions. These are the shapes that decide a shortlist before anyone opens a search engine."
            />
            <div className="mx-auto mt-11 flex max-w-[900px] flex-wrap justify-center gap-2.5">
              {CHIPS.map((c) => (
                <span key={c} className="airt-chip">
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
              title="A few steps, then it runs itself"
            />

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s) => (
                <div key={s.n} className="airt-card flex flex-col p-7">
                  <span className="text-[13px] font-semibold text-[var(--accent)]">{s.n}</span>
                  <h3 className="mt-4 text-[17px] font-semibold tracking-[-0.5px]">{s.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-[1.6] text-[var(--body)]">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── stats ────────────────────────────────────────────────────── */}
        <section className="pb-20 sm:pb-28">
          <div className={WRAP}>
            <div className="airt-on-dark airt-panel grid grid-cols-2 gap-y-10 bg-[var(--ink)] px-8 py-12 text-white sm:px-12 lg:grid-cols-4">
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
              title="Built to be read, not just collected"
              sub="A visibility number is only worth having if you can see the answer behind it, act on it, and get it out of the tool when the report is due."
            />

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {BENEFITS.map((b) => (
                <div key={b.title} className="airt-card p-7">
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
            Prices come from CREDIT_PLANS. An answer is 1 credit on three of the
            four platforms, so a balance is roughly that many answers — the same
            arithmetic the credit catalog uses. */}
        <section id="pricing" className="scroll-mt-24 pb-20 sm:pb-28">
          <div className={WRAP}>
            <SectionHead
              label="Pricing"
              name="Credits"
              title="Choose the plan that fits"
              sub="One balance covers AI visibility, rank tracking, audits and keyword research. Nothing is reserved for a higher tier."
            />

            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <article className="airt-card flex flex-col p-7">
                <h3 className="text-[15px] font-semibold">Free</h3>
                <p className="mt-1.5 text-[13.5px] text-[var(--muted)]">Perfect for one brand</p>
                <p className="mt-5 text-[40px] leading-none font-semibold tracking-[-1.5px]">
                  $0<span className="ml-1 text-[14px] font-normal text-[var(--muted)]">/mo</span>
                </p>
                <p className="mt-2 text-[12.5px] text-[var(--muted)]">
                  100 credits — about 100 AI answers
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
                  className={`relative flex flex-col p-7 ${plan.popular ? "airt-panel bg-[var(--ink)] text-white" : "airt-card"}`}
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
                    {plan.credits.toLocaleString()} AI answers
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
                question they leave behind — more so here than anywhere, because
                a run multiplies prompts by platforms by samples. */}
            <div className="airt-soft mt-4 flex flex-wrap items-center justify-between gap-5 px-8 py-7">
              <div>
                <p className="text-[17px] font-semibold tracking-[-0.5px]">
                  Not sure how many answers you need?
                </p>
                <p className="mt-1.5 max-w-[62ch] text-[14.5px] leading-[1.55] text-[var(--body)]">
                  A run is prompts × platforms × samples. Tell us how many prompts you want to
                  watch, on which assistants and how often, and we will size the balance for you.
                </p>
              </div>
              <a
                href="mailto:support@freeserp.com"
                className="airt-btn airt-btn-sm airt-btn-ink shrink-0"
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
                <figure key={t.name} className="airt-card flex flex-col p-7">
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
                <details key={f.q} className="airt-faq airt-card px-6 py-1">
                  <summary className="flex items-center justify-between gap-4 py-5 text-[16px] font-medium">
                    {f.q}
                    <ChevronDown
                      className="airt-chevron h-[18px] w-[18px] shrink-0 text-[var(--muted)]"
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
          <div className="airt-on-dark airt-panel bg-[var(--ink)] px-6 py-16 text-center text-white sm:px-12 sm:py-20">
            <LogoMark className="mx-auto h-10 w-10" />
            <h2 className="airt-h2 mx-auto mt-6 max-w-[17ch]">
              Find out what the assistants say about you
            </h2>
            <p className="mx-auto mt-5 max-w-[54ch] text-[16px] leading-[1.6] text-white/60">
              Multiple AI platforms, one credit balance. 100 free credits every month, no credit card,
              and every answer stored so you can read it for yourself.
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
      <span className="airt-tag">
        <b>{label}</b>
        {name}
      </span>
      <h2 className="airt-h2 mt-5">{title}</h2>
      {sub && <p className="airt-lead mx-auto mt-4 max-w-[58ch]">{sub}</p>}
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
    <div className="airt-shot-bar">
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
    <div className="airt-shot">
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
