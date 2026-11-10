import type { Metadata } from "next";
import Image from "next/image";
import { Inter } from "next/font/google";
import {
  ArrowRight,
  BarChart3,
  Bot,
  CalendarClock,
  Check,
  ChevronDown,
  Code2,
  FileDown,
  FileText,
  Gauge,
  History,
  ListOrdered,
  MessageSquareText,
  Quote,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { LogoMark, Wordmark } from "@/components/landing/ui/Logo";
import { TESTIMONIALS } from "@/components/home/data";
import { CREDIT_PLANS } from "@/app/pricing/PricingPlans";
import { Cta } from "./Cta";
import { SignupPopup } from "./SignupPopup";
// Same `.cmpa-` design system as /competitor-analysis, imported rather than
// copied so the ad pages cannot drift apart.
import "../competitor-analysis/ads.css";

/**
 * /aeo-geo-audit — paid-acquisition landing page for the AEO & GEO audit.
 * Same layout family as /competitor-analysis and /google-maps-audit.
 *
 * Every claim is taken from freeserp-backend-v2/src/modules/aeo-audit:
 * engine/checks (7 scored categories), engine/scoring/config.ts (AEO and GEO
 * weights, severity points, the cap at 40 when AI bots are blocked),
 * engine/checks/crawl-access/ai-crawlers.ts (exact bot names),
 * engine/visibility (10 questions per engine, 5 engines measured),
 * credits/catalog.ts (5 base + 5 per engine unit). Things the tool does NOT do
 * — share links, CSV, AI grading of the writing, measuring Copilot — are
 * deliberately never claimed.
 */

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AEO & GEO Audit — get your website cited by ChatGPT, Gemini and AI Overviews — FreeSERP",
  description:
    "Check whether AI answer engines can read, trust and cite your website. FreeSERP audits crawler access, rendering, schema, content structure, trust and freshness, scores you for AEO and GEO, then asks ChatGPT, Claude, Perplexity, Gemini and AI Overviews real questions to see who they cite. 100 free credits every month, no credit card.",
  alternates: { canonical: "/aeo-geo-audit" },
  openGraph: {
    title: "Does AI cite your website — or your competitors'?",
    description:
      "An AEO and GEO score for your site, the fixes ranked by impact, and real answers from ChatGPT, Claude, Perplexity, Gemini and AI Overviews showing who gets cited.",
    url: "/aeo-geo-audit",
    siteName: "FreeSERP",
    type: "website",
  },
  // Paid-traffic destination, kept out of the index like the sibling ad pages.
  robots: { index: false, follow: true },
};

/* ══════════════════════════════════════════════════════════════════════════
   CONTENT
   ══════════════════════════════════════════════════════════════════════════ */

const HERO_POINTS = [
  "An AEO score and a GEO score",
  "Checks across 7 categories",
  "Real answers from 5 AI engines",
  "Fixes ranked by points per effort",
];

const HERO_LAYERS: { icon: LucideIcon; label: string }[] = [
  { icon: Bot, label: "AI crawler access" },
  { icon: Code2, label: "Schema & rendering" },
  { icon: FileText, label: "Answer-ready content" },
  { icon: Quote, label: "Cited in AI answers" },
];

interface Layer {
  id: string;
  icon: LucideIcon;
  tint: string;
  dot: string;
  name: string;
  kicker: string;
  title: string;
  body: string;
  points: string[];
  spec: { k: string; v: string }[];
}

const LAYERS: Layer[] = [
  {
    id: "crawl",
    icon: Bot,
    tint: "#e7effe",
    dot: "#0454ff",
    name: "Crawl access",
    kicker: "Can the AI bots get in at all",
    title: "Every AI crawler, tested against your robots.txt",
    body: "Search bots, AI answer bots and AI training bots are each tested against your robots.txt on every page in the audit. When one is blocked, the finding quotes the exact Disallow line and gives you the fix to paste. Sitemaps, cookie-redirect loops and llms.txt are checked too — and if your robots.txt blocks Googlebot or the answer bots, both scores are capped at 40 until it is fixed.",
    points: [
      "Search bots — Googlebot, Bingbot",
      "Answer bots — OAI-SearchBot, PerplexityBot, Claude-SearchBot",
      "Training bots — GPTBot, ClaudeBot, Google-Extended, CCBot",
      "Sitemap, robots.txt reachability and llms.txt",
    ],
    spec: [
      { k: "Checks", v: "9" },
      { k: "AEO weight", v: "20%" },
      { k: "GEO weight", v: "20%" },
      { k: "If AI bots are blocked", v: "Scores capped at 40" },
    ],
  },
  {
    id: "render",
    icon: Code2,
    tint: "#e4f2fc",
    dot: "#0d80c9",
    name: "Rendering & structured data",
    kicker: "What a bot sees without running your JavaScript",
    title: "Content in the HTML, and schema that says what it is",
    body: "Many AI crawlers do not run JavaScript, so the audit checks your content and links are in the raw HTML. Then it validates your JSON-LD and looks for the schema that tells an engine who you are and what each page is — Organization, WebSite, Article, FAQ and breadcrumbs — with the required and recommended fields checked for nine schema types.",
    points: [
      "Content and links present without JavaScript",
      "Valid JSON-LD on every page read",
      "Organization, WebSite, Article, FAQ, breadcrumb schema",
      "Required fields for 9 types, incl. LocalBusiness and Product",
    ],
    spec: [
      { k: "Checks", v: "2 + 6, plus field checks" },
      { k: "AEO weight", v: "10% + 20%" },
      { k: "GEO weight", v: "10% + 15%" },
      { k: "Scored as", v: "Share of pages that pass" },
    ],
  },
  {
    id: "content",
    icon: FileText,
    tint: "#e9ebfd",
    dot: "#3b46d6",
    name: "Content structure",
    kicker: "Is the answer easy to lift out",
    title: "Pages shaped the way answer engines read them",
    body: "Answer engines quote pages that state the answer early and break it into parts. The audit checks for one clear H1, headings in order, headings phrased as questions, answer-first paragraphs, short paragraphs, lists and tables, and an FAQ section — the shapes that turn a page into a quotable answer.",
    points: [
      "One H1 and headings in order",
      "Question-style headings and answer-first openings",
      "Paragraph length, lists and tables",
      "FAQ sections",
    ],
    spec: [
      { k: "Checks", v: "7" },
      { k: "AEO weight", v: "25% — the largest" },
      { k: "GEO weight", v: "10%" },
      { k: "Scored as", v: "Share of pages that pass" },
    ],
  },
  {
    id: "trust",
    icon: ShieldCheck,
    tint: "#e3ebfe",
    dot: "#0a3fbf",
    name: "Trust, freshness & technical",
    kicker: "Is your brand worth citing",
    title: "The signals that make a model trust a source",
    body: "Generative engines cite brands they can identify and believe. The audit looks for an About page, real contact details, named authors, sameAs profile links, a consistent brand name, reviews and outbound citations — then checks dates, how long since pages were updated and sitemap lastmod, plus the technical basics from HTTPS and canonicals to speed and broken pages.",
    points: [
      "About, contact, authors, sameAs and brand name",
      "Reviews and citations to sources",
      "Published and updated dates, sitemap lastmod",
      "HTTPS, titles, meta, canonical, speed, broken pages",
    ],
    spec: [
      { k: "Checks", v: "8 trust · 3 fresh · 11 tech" },
      { k: "GEO weight", v: "25% trust — the largest" },
      { k: "AEO weight", v: "10% · 5% · 10%" },
      { k: "Scored as", v: "Share of pages that pass" },
    ],
  },
  {
    id: "visibility",
    icon: Quote,
    tint: "#e6f0fb",
    dot: "#1867c0",
    name: "Measured in AI answers",
    kicker: "Not a prediction — the actual answers",
    title: "Ten real questions, asked to the engines you pick",
    body: "Questions a customer would ask are written from your own homepage and About page — unbranded, branded or a mix — and put to ChatGPT, Claude, Perplexity, Gemini and Google's AI Overviews in your site's country and language. For every answer you see whether your site was cited and in which source position, read but not cited, named without a link, or left out — and which domains were cited instead.",
    points: [
      "ChatGPT, Claude, Perplexity, Gemini, AI Overviews",
      "10 questions per engine, in your market's language",
      "Cited, read-but-not-cited, named, or absent",
      "The top domains cited instead of you",
    ],
    spec: [
      { k: "Questions", v: "10 per engine" },
      { k: "Score", v: "% of answers that link to you" },
      { k: "Cached", v: "Never — asked fresh each run" },
      { k: "If an engine fails", v: "Shown as couldn't measure" },
    ],
  },
];

/** The two scores, category by category — config.ts weights. */
const SCORING = [
  { id: "crawl", name: "Crawl access", aeo: "20%", geo: "20%" },
  { id: "render", name: "Rendering", aeo: "10%", geo: "10%" },
  { id: "schema", name: "Structured data", aeo: "20%", geo: "15%" },
  { id: "content", name: "Content structure", aeo: "25%", geo: "10%" },
  { id: "trust", name: "Entity & trust", aeo: "10%", geo: "25%" },
  { id: "fresh", name: "Freshness", aeo: "5%", geo: "10%" },
  { id: "tech", name: "Technical basics", aeo: "10%", geo: "10%" },
];

const DELIVERABLES = [
  {
    icon: Gauge,
    title: "Two scores, one grade",
    text: "AEO — how ready your pages are to be the answer — and GEO — how ready your brand is to be cited. Each out of 100, with a grade from A to F.",
  },
  {
    icon: ListOrdered,
    title: "Fix first, ranked",
    text: "Every failing rule sorted by the points it would add to AEO and GEO for the effort it takes, with what was found, why it matters and how to fix it.",
  },
  {
    icon: MessageSquareText,
    title: "The answers themselves",
    text: "A question-by-engine grid of real AI answers showing where you were cited, where you were read but passed over, and who was cited instead.",
  },
  {
    icon: BarChart3,
    title: "Readiness per engine",
    text: "An estimate of how ready your site is for ChatGPT, Claude, Perplexity, Gemini, AI Overviews and Copilot, based on crawler access and each engine's priorities.",
  },
  {
    icon: History,
    title: "Since the last audit",
    text: "Score changes, what got fixed and what newly broke since your previous audit of the same site, with a history of past runs.",
  },
  {
    icon: FileDown,
    title: "A PDF to hand over",
    text: "Download the full report — fixes at a glance, scores by category, measured answers and every fix in detail — as a PDF.",
  },
];

const CHIPS = [
  "SaaS products",
  "agencies",
  "local businesses",
  "e-commerce stores",
  "publishers and blogs",
  "B2B services",
  "clinics and practices",
  "consultants",
  "marketplaces",
  "documentation sites",
];

const STEPS = [
  {
    n: "01",
    title: "Enter your website",
    text: "Type the domain and pick how deep to go — 5, 10 or 20 pages besides the homepage. About, contact, FAQ, pricing and your newest articles are read first.",
  },
  {
    n: "02",
    title: "Pick the AI engines",
    text: "Choose which of ChatGPT, Claude, Perplexity, Gemini and AI Overviews to ask. The credit cost is shown before you start.",
  },
  {
    n: "03",
    title: "Crawl, check, ask",
    text: "Your pages are crawled politely, respecting robots.txt, every check runs, and ten questions go to each engine you picked. Most audits finish in 2–5 minutes.",
  },
  {
    n: "04",
    title: "Fix, then re-audit",
    text: "Work down the Fix first list, then run the audit again — the report shows what got fixed, what broke and how both scores moved.",
  },
];

const STATS = [
  { value: "7", label: "scored categories" },
  { value: "5", label: "AI engines asked" },
  { value: "10", label: "questions per engine" },
  { value: "100", label: "free credits every month" },
];

const BENEFITS = [
  {
    icon: Sparkles,
    title: "Copy-paste fixes",
    text: "A blocked bot comes back with the exact robots.txt line to change, and a missing llms.txt with a template to start from.",
  },
  {
    icon: Users,
    title: "See who is cited instead",
    text: "The domains AI engines cite in your place are listed, so you know whose content you are actually up against.",
  },
  {
    icon: RefreshCw,
    title: "Re-run after you ship",
    text: "Run the audit again and the report lines up against the last one — fixed issues, new problems and score changes.",
  },
  {
    icon: CalendarClock,
    title: "Answers change — track them",
    text: "AI answers move from run to run, so measured results are asked fresh every time rather than served from a cache.",
  },
  {
    icon: ShieldCheck,
    title: "Nothing invented",
    text: "An engine that cannot be reached shows as couldn't measure, not as zero, and engine readiness is labelled an estimate.",
  },
  {
    icon: Wallet,
    title: "One balance, every tool",
    text: "The same credits run rank tracking, AI visibility tracking, site audits, Maps audits and keyword research.",
  },
];

const FREE_POINTS = [
  "Every check and both scores",
  "Real answers from the engines you pick",
  "The full Fix first list",
  "No credit card required",
];

const PAID_POINTS = [
  "Audit every client site",
  "Ask all five engines",
  "History and run-to-run comparison",
  "Cancel anytime",
];

const FAQS = [
  {
    q: "What are AEO and GEO?",
    a: "AEO — answer engine optimisation — is how ready your pages are to be the answer an AI or search engine gives. GEO — generative engine optimisation — is how ready your brand is to be cited by generative AI like ChatGPT, Claude and Perplexity. The audit scores both out of 100 from the same checks, weighted differently: content structure counts most for AEO, entity and trust signals count most for GEO.",
  },
  {
    q: "Which AI crawlers does it check?",
    a: "Search bots (Googlebot, Bingbot), AI answer bots (OAI-SearchBot, PerplexityBot, Claude-SearchBot) and AI training bots (GPTBot, ClaudeBot, Google-Extended, CCBot) — each tested against your robots.txt on every audited page. A block is reported with the exact Disallow line and the fix.",
  },
  {
    q: "How do you measure whether AI cites my site?",
    a: "Ten questions a customer would ask are written from your homepage and About page, then put to each engine you pick — ChatGPT, Claude, Perplexity, Gemini and Google AI Overviews — in your site's country and language. Each answer is marked cited (with the source position), read but not cited, named without a link, or absent, and the domains cited instead are listed.",
  },
  {
    q: "What does an audit cost?",
    a: "5 credits for the crawl and checks, plus the engines you ask: ChatGPT, Gemini and AI Overviews add 5 each, Perplexity 10 and Claude 100. So ChatGPT alone is 10 credits, everything except Claude is 30, and all five engines are 130. At least one engine is required. A failed audit is refunded automatically.",
  },
  {
    q: "How many pages does it read?",
    a: "Your homepage plus 5, 10 or 20 more — you choose. The crawler respects robots.txt, waits between requests and reads your About, contact, FAQ, pricing and newest articles first.",
  },
  {
    q: "Can I share the report?",
    a: "Yes — download it as a PDF. Reports are private to your account.",
  },
  {
    q: "Do I need a credit card to start?",
    a: "No. The free plan needs no card and includes 100 credits every month, refilled automatically. Paid plans start at $19/month for 2,000 credits and can be cancelled at any time — email support@freeserp.com if you want a hand sizing one.",
  },
];

/** The cheapest audit: 5 base + one 1-unit engine (5) — credits/catalog.ts. */
const CREDITS_PER_AUDIT = 10;

const WRAP = "mx-auto w-full max-w-[1139px] px-5 sm:px-8";

/* ══════════════════════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════════════════════ */

export default function AeoGeoAuditPage() {
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
        {/* ── hero ── no product screenshot exists for this tool yet, so the
            band closes normally instead of having a shot hang off it. */}
        <section id="top" className="cmpa-band cmpa-on-dark pt-28 pb-20 sm:pt-36 sm:pb-28">
          <div className={`${WRAP} text-center`}>
            <a href="#measured" className="cmpa-eyebrow">
              <b>New</b>
              See the real answers ChatGPT and Gemini give
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
            </a>

            <h1 className="cmpa-h1 mx-auto mt-7 max-w-[20ch] text-white">
              Get your website <span className="cmpa-grad-text">cited by AI answers</span>
            </h1>

            <p className="cmpa-lead mx-auto mt-6 max-w-[62ch]">
              FreeSERP checks whether ChatGPT, Claude, Perplexity, Gemini and Google AI Overviews can
              read, trust and quote your site — scores you for AEO and GEO, asks the engines real
              questions to see who they cite, and ranks every fix by how much it moves the score.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Cta placement="hero" label="Audit my site free" />
              <a href="#checks" className="cmpa-btn cmpa-btn-lg cmpa-btn-ghost">
                See what it checks
              </a>
            </div>

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

        <div className={`${WRAP} mt-8`}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
        </div>

        {/* ── the layers ── */}
        <section id="checks" className="scroll-mt-24 pt-20 sm:pt-28">
          <div className={WRAP}>
            <SectionHead
              label="Audit"
              name="The checks"
              title="Everything an AI engine needs before it cites you"
              sub="Can it get in, can it read the page, can it lift the answer out, and does it trust who wrote it — then, did it actually cite you."
            />
          </div>

          <div className={`${WRAP} mt-14 space-y-5`}>
            {LAYERS.map((l, i) => (
              <article
                key={l.id}
                id={l.id === "visibility" ? "measured" : l.id}
                className="cmpa-layer scroll-mt-24 p-7 sm:p-10"
                style={{ "--tint": l.tint, "--dot": l.dot } as React.CSSProperties}
              >
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

        {/* ── scoring ── */}
        <section className="py-20 sm:py-28">
          <div className={WRAP}>
            <SectionHead
              label="Score"
              name="How it adds up"
              title="Same checks, two different questions"
              sub="AEO asks whether your pages can be the answer. GEO asks whether your brand is worth citing. So the same seven categories are weighted differently."
            />

            <div className="cmpa-table-scroll mt-12">
              <table className="cmpa-table">
                <thead>
                  <tr>
                    <th scope="col">Category</th>
                    <th scope="col">Share of AEO</th>
                    <th scope="col">Share of GEO</th>
                  </tr>
                </thead>
                <tbody>
                  {SCORING.map((row) => (
                    <tr key={row.id}>
                      <th scope="row">{row.name}</th>
                      <td>{row.aeo}</td>
                      <td>{row.geo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-center text-[13px] text-[var(--muted)]">
              Each rule scores the share of pages it passes on, weighted by severity. If robots.txt
              blocks Googlebot or the AI answer bots, both scores are capped at 40.
            </p>
          </div>
        </section>

        {/* ── what you get back ── */}
        <section id="plan" className="scroll-mt-24 pb-20 sm:pb-28">
          <div className={WRAP}>
            <SectionHead
              label="Output"
              name="What you get back"
              title="A report that tells you what to fix first"
              sub="The scores say where you stand. The answers say what AI actually does with your site. The fix list says what to do about it."
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

        {/* ── who it is for ── */}
        <section className="pb-20 sm:pb-28">
          <div className={WRAP}>
            <SectionHead
              label="Sites"
              name="Who it is for"
              title="Any site people now ask AI about"
              sub="If your customers ask ChatGPT or Google's AI Overviews before they search, the audit applies to you."
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

        {/* ── how it works ── */}
        <section id="how" className="scroll-mt-24 pb-20 sm:pb-28">
          <div className={WRAP}>
            <SectionHead label="Setup" name="How it works" title="One domain in, a ranked fix list out" />
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

        {/* ── stats ── */}
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

        {/* ── benefits ── */}
        <section id="why" className="scroll-mt-24 pb-20 sm:pb-28">
          <div className={WRAP}>
            <SectionHead
              label="Why"
              name="One platform"
              title="Built for the search that happens inside AI"
              sub="Classic SEO tools stop at the results page. This one follows the question into the answer."
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

        {/* ── pricing ── */}
        <section id="pricing" className="scroll-mt-24 pb-20 sm:pb-28">
          <div className={WRAP}>
            <SectionHead
              label="Pricing"
              name="Credits"
              title="Choose the plan that fits"
              sub="One balance covers AEO audits, rank tracking, AI visibility, site audits and keyword research. Audit counts below assume one engine (ChatGPT) per audit."
            />
            <PricingGrid
              unit="audits"
              perUnit={CREDITS_PER_AUDIT}
              freePoints={FREE_POINTS}
              paidPoints={PAID_POINTS}
            />
            <div className="cmpa-soft mt-4 flex flex-wrap items-center justify-between gap-5 px-8 py-7">
              <div>
                <p className="text-[17px] font-semibold tracking-[-0.5px]">
                  Not sure which engines to ask?
                </p>
                <p className="mt-1.5 max-w-[62ch] text-[14.5px] leading-[1.55] text-[var(--body)]">
                  ChatGPT alone is 10 credits an audit, every engine except Claude is 30, and all
                  five are 130. Tell us how many sites you look after and we will size the balance
                  for you.
                </p>
              </div>
              <a href="mailto:support@freeserp.com" className="cmpa-btn cmpa-btn-sm cmpa-btn-ink shrink-0">
                Contact us
              </a>
            </div>
          </div>
        </section>

        <Testimonials />
        <Faq faqs={FAQS} />
      </main>

      <footer className="pb-8">
        <div className={WRAP}>
          <div className="cmpa-on-dark cmpa-ink-panel cmpa-panel px-6 py-16 text-center sm:px-12 sm:py-20">
            <LogoMark className="mx-auto h-10 w-10" />
            <h2 className="cmpa-h2 mx-auto mt-6 max-w-[18ch]">
              Find out <span className="cmpa-grad-text">what AI says about you</span>
            </h2>
            <p className="mx-auto mt-5 max-w-[54ch] text-[16px] leading-[1.6] text-white/60">
              Two scores, real answers from five AI engines and a fix list ranked by impact. 100
              free credits every month, no credit card.
            </p>
            <div className="mt-8 flex justify-center">
              <Cta placement="final_cta" label="Audit my site free" />
            </div>
          </div>
          <FooterLinks />
        </div>
      </footer>

      <SignupPopup />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PIECES
   ══════════════════════════════════════════════════════════════════════════ */

function SectionHead({ label, name, title, sub }: { label: string; name: string; title: string; sub?: string }) {
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
    <li className={`flex gap-2.5 text-[13.5px] leading-[1.45] ${onDark ? "text-white/70" : "text-[var(--body)]"}`}>
      <Check className="mt-px h-4 w-4 shrink-0 text-[var(--accent)]" strokeWidth={2.4} />
      {children}
    </li>
  );
}

function PricingGrid({
  unit,
  perUnit,
  freePoints,
  paidPoints,
}: {
  unit: string;
  perUnit: number;
  freePoints: string[];
  paidPoints: string[];
}) {
  return (
    <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <article className="cmpa-card flex flex-col p-7">
        <h3 className="text-[15px] font-semibold">Free</h3>
        <p className="mt-1.5 text-[13.5px] text-[var(--muted)]">Perfect for one site</p>
        <p className="mt-5 text-[40px] leading-none font-semibold tracking-[-1.5px]">
          $0<span className="ml-1 text-[14px] font-normal text-[var(--muted)]">/mo</span>
        </p>
        <p className="mt-2 text-[12.5px] text-[var(--muted)]">
          100 credits — about {Math.floor(100 / perUnit)} {unit}
        </p>
        <Cta placement="pricing_free" label="Get started" size="sm" variant="ghost" arrow={false} className="mt-6 w-full" />
        <p className="mt-7 mb-4 text-[12.5px] font-semibold">Features included:</p>
        <ul className="space-y-3">
          {freePoints.map((p) => (
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
          <p className={`mt-1.5 text-[13.5px] ${plan.popular ? "text-white/55" : "text-[var(--muted)]"}`}>{plan.who}</p>
          <p className="mt-5 text-[40px] leading-none font-semibold tracking-[-1.5px]">
            ${plan.price}
            <span className={`ml-1 text-[14px] font-normal ${plan.popular ? "text-white/55" : "text-[var(--muted)]"}`}>/mo</span>
          </p>
          <p className={`mt-2 text-[12.5px] ${plan.popular ? "text-white/55" : "text-[var(--muted)]"}`}>
            {plan.credits.toLocaleString()} credits — about {Math.floor(plan.credits / perUnit).toLocaleString()} {unit}
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
            {paidPoints.map((p) => (
              <Point key={p} onDark={plan.popular}>
                {p}
              </Point>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

/** The home page's own testimonials, imported rather than invented. */
function Testimonials() {
  return (
    <section className="pb-20 sm:pb-28">
      <div className={WRAP}>
        <SectionHead label="Use case" name="Customers" title="See why teams switch" />
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="cmpa-card flex flex-col p-7">
              <div className="flex gap-1 text-[#f5a623]" aria-label="Rated 5 out of 5">
                {[0, 1, 2, 3, 4].map((s) => (
                  <Star key={s} className="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <blockquote className="mt-5 mb-auto text-[15px] leading-[1.6]">{t.text}</blockquote>
              <figcaption className="mt-7 flex items-center gap-3">
                <Image src={t.img} alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
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
  );
}

function Faq({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <section id="faq" className="scroll-mt-24 pb-20 sm:pb-28">
      <div className={WRAP}>
        <SectionHead label="FAQ" name="Answers" title="Frequently asked questions" sub="Anything not answered here — support@freeserp.com." />
        <div className="mx-auto mt-12 max-w-[780px] space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="cmpa-faq cmpa-card px-6 py-1">
              <summary className="flex items-center justify-between gap-4 py-5 text-[16px] font-medium">
                {f.q}
                <ChevronDown className="cmpa-chevron h-[18px] w-[18px] shrink-0 text-[var(--muted)]" aria-hidden />
              </summary>
              <p className="pb-6 text-[15px] leading-[1.65] text-[var(--body)]">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FooterLinks() {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-[13px] text-[var(--muted)]">
      <span>© {new Date().getFullYear()} FreeSERP. All rights reserved.</span>
      <div className="flex flex-wrap gap-6">
        <a href="/privacy" className="transition-colors hover:text-[var(--ink)]">Privacy</a>
        <a href="/terms" className="transition-colors hover:text-[var(--ink)]">Terms</a>
        <a href="mailto:support@freeserp.com" className="transition-colors hover:text-[var(--ink)]">
          support@freeserp.com
        </a>
      </div>
    </div>
  );
}
