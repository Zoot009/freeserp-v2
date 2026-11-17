import type { Metadata } from "next";
import { SampleReport } from "@/components/landing/SampleReport";
import { SAMPLE_REPORTS } from "@/components/landing/sample-reports";
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
  History,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wallet,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { LogoMark } from "@/components/landing/ui/Logo";
import { TESTIMONIALS } from "@/components/home/data";
import { CREDIT_PLANS } from "@/app/pricing/PricingPlans";
import { Cta } from "./Cta";
import { SignupPopup } from "./SignupPopup";
// Same `.cmpa-` design system as /competitor-analysis, imported rather than
// copied so the ad pages share one theme. aeo.css adds this page's visuals.
import "../competitor-analysis/ads.css";
import "./aeo.css";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { DemoSection } from "@/components/demos/DemoSection";
import { AeoDemo } from "@/components/demos/AeoDemo";

/**
 * /aeo-geo-audit — paid-acquisition landing page for the AEO & GEO audit.
 *
 * Every claim is taken from freeserp-backend-v2/src/modules/aeo-audit:
 * engine/checks (7 scored categories), engine/scoring/config.ts (AEO and GEO
 * weights, severity points, the cap at 40 when robots.txt blocks Googlebot or
 * the answer bots), engine/checks/crawl-access/ai-crawlers.ts (exact bot
 * names), engine/visibility (10 questions per engine, 5 engines measured,
 * cited / read / named / absent), engine/report.ts (fixes ranked by points per
 * effort), credits/catalog.ts (5 base + 5 per engine unit). Things the tool
 * does NOT do — share links, CSV, AI grading of the writing, measuring
 * Copilot — are deliberately never claimed.
 *
 * The chat card, robots.txt, matrix and fix list are illustrative mock ups
 * built in HTML/CSS (no screenshot exists for this tool), each marked
 * "Example".
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

const ENGINES = ["ChatGPT", "Claude", "Perplexity", "Gemini", "AI Overviews"];

const BOT_GROUPS: { name: string; bots: { name: string; blocked?: boolean }[] }[] = [
  { name: "Search bots", bots: [{ name: "Googlebot" }, { name: "Bingbot" }] },
  {
    name: "AI answer bots",
    bots: [{ name: "OAI-SearchBot" }, { name: "PerplexityBot", blocked: true }, { name: "Claude-SearchBot" }],
  },
  {
    name: "AI training bots",
    bots: [{ name: "GPTBot" }, { name: "ClaudeBot" }, { name: "Google-Extended" }, { name: "CCBot" }],
  },
];

const CRAWL_POINTS = [
  "Every bot tested on every page in the audit",
  "The exact Disallow line quoted, with the fix to paste",
  "Sitemap, robots.txt reachability, cookie-redirect loops",
  "llms.txt checked — and a template if you have none",
];

/** The seven categories and their share of each score — scoring/config.ts. */
const WEIGHTS = [
  { name: "Crawl access", aeo: 20, geo: 20 },
  { name: "Rendering", aeo: 10, geo: 10 },
  { name: "Structured data", aeo: 20, geo: 15 },
  { name: "Content structure", aeo: 25, geo: 10 },
  { name: "Entity & trust", aeo: 10, geo: 25 },
  { name: "Freshness", aeo: 5, geo: 10 },
  { name: "Technical basics", aeo: 10, geo: 10 },
];

/** Severity points per failing rule — scoring/config.ts. */
const SEVERITY = [
  { name: "Critical", pts: 8 },
  { name: "High", pts: 5 },
  { name: "Medium", pts: 3 },
  { name: "Low", pts: 1 },
];

type Mark = "cited" | "read" | "named" | "absent";
type Cell = { m: Mark; pos?: number };

/** The example matrix: one row per question, one cell per engine. */
const MATRIX: { q: string; cells: Cell[] }[] = [
  {
    q: "best crm for small sales teams",
    cells: [{ m: "cited", pos: 1 }, { m: "read" }, { m: "cited", pos: 2 }, { m: "named" }, { m: "absent" }],
  },
  {
    q: "crm with email tracking",
    cells: [{ m: "read" }, { m: "absent" }, { m: "cited", pos: 3 }, { m: "absent" }, { m: "read" }],
  },
  {
    q: "how to choose a crm",
    cells: [{ m: "absent" }, { m: "absent" }, { m: "named" }, { m: "absent" }, { m: "cited", pos: 4 }],
  },
  {
    q: "cheapest crm for startups",
    cells: [{ m: "cited", pos: 2 }, { m: "named" }, { m: "absent" }, { m: "read" }, { m: "absent" }],
  },
  {
    q: "crm that works with gmail",
    cells: [{ m: "absent" }, { m: "read" }, { m: "cited", pos: 1 }, { m: "absent" }, { m: "cited", pos: 2 }],
  },
];
const CELLS = MATRIX.flatMap((r) => r.cells);
const CITED = CELLS.filter((c) => c.m === "cited").length;

const CITED_INSTEAD = [
  { d: "competitor-a.com", n: 7 },
  { d: "review-site.com", n: 5 },
  { d: "competitor-b.com", n: 3 },
];

const FIXES = [
  {
    title: "Allow PerplexityBot in robots.txt",
    sev: "Critical",
    gain: "+8 AEO · +8 GEO",
    effort: "Low effort",
    where: "robots.txt",
  },
  {
    title: "Add FAQ schema to question pages",
    sev: "High",
    gain: "+5 AEO · +3 GEO",
    effort: "Medium effort",
    where: "6 / 21 pages",
  },
  {
    title: "Open pages with a direct answer",
    sev: "High",
    gain: "+4 AEO · +2 GEO",
    effort: "Medium effort",
    where: "12 / 21 pages",
  },
  {
    title: "Add named authors to articles",
    sev: "Medium",
    gain: "+1 AEO · +4 GEO",
    effort: "Low effort",
    where: "8 / 21 pages",
  },
];

const OUTPUT_POINTS = [
  "What was found, why it matters and how to fix it — per rule",
  "What got fixed and what newly broke since the last audit",
  "Readiness per engine, incl. Copilot — clearly labelled an estimate",
  "The whole report as a PDF",
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

      <Nav />

      <main>
        {/* ── hero: copy on the left, an AI answer citing you on the right ── */}
        <section id="top" className="cmpa-band cmpa-on-dark pt-28 pb-20 sm:pt-36 sm:pb-28">
          <div className={`${WRAP} grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr]`}>
            <div className="text-center lg:text-left">
              <a href="#measured" className="cmpa-eyebrow">
                <b>New</b>
                See the real answers AI engines give
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
              </a>

              <h1 className="cmpa-h1 mx-auto mt-7 max-w-[16ch] text-white lg:mx-0">
                Get your website <span className="cmpa-grad-text">cited by AI answers</span>
              </h1>

              <p className="cmpa-lead mx-auto mt-6 max-w-[54ch] lg:mx-0">
                FreeSERP checks whether ChatGPT, Claude, Perplexity, Gemini and Google AI Overviews
                can read, trust and quote your site — scores you for AEO and GEO, asks the engines
                real questions to see who they cite, and ranks every fix by how much it moves the
                score.
              </p>

              <div className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <Cta placement="hero" label="Audit my site free" />
                <a
                  href={SAMPLE_REPORTS.aeo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cmpa-btn cmpa-btn-lg cmpa-btn-ghost"
                >
                  View sample report
                </a>
              </div>
            </div>

            <HeroChat />
          </div>
        </section>

        <div className={`${WRAP} mt-8`}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {HERO_POINTS.map((p) => (
              <div
                key={p}
                className="flex items-start gap-2.5 rounded-[14px] border border-[#eaeaea] bg-white px-4 py-3.5 text-[14px] leading-[1.4] font-medium"
              >
                <Check className="mt-px h-4 w-4 shrink-0 text-[var(--accent)]" strokeWidth={2.6} />
                {p}
              </div>
            ))}
          </div>
        </div>

        <DemoSection title="Block a bot, watch the score move">
          <AeoDemo />
        </DemoSection>

        {/* ── crawl access: copy beside a robots.txt read-out ── */}
        <section id="checks" className="scroll-mt-24 pt-20 sm:pt-28">
          <div className={`${WRAP} grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]`}>
            <div>
              <span className="cmpa-tag">
                <b>Step 1</b>
                Crawl access
              </span>
              <h2 className="cmpa-h2 mt-5">If the AI bots can&rsquo;t get in, nothing else counts</h2>
              <p className="cmpa-lead mt-4 max-w-[52ch]">
                Nine AI and search crawlers are tested against your robots.txt. Block Googlebot or the
                answer bots and both scores are capped at 40 — however good the rest of the site is.
              </p>
              <ul className="mt-7 space-y-3">
                {CRAWL_POINTS.map((p) => (
                  <Point key={p}>{p}</Point>
                ))}
              </ul>
            </div>

            <div className="aeo-term">
              <div className="aeo-term-bar">
                <i />
                <i />
                <i />
                <span className="aeo-mono ml-2">yoursite.com/robots.txt</span>
                <span className="aeo-example ml-auto">Example</span>
              </div>
              <pre className="aeo-mono">
                <span className="c"># robots.txt</span>
                {"\n"}
                <span className="k">User-agent:</span> *{"\n"}
                <span className="k">Allow:</span> /{"\n\n"}
                <span className="k">User-agent:</span> PerplexityBot{"\n"}
                <span className="bad">
                  <span className="k">Disallow:</span> /
                </span>
              </pre>
              <div className="aeo-bots">
                {BOT_GROUPS.map((g) => (
                  <div key={g.name}>
                    <p>{g.name}</p>
                    {g.bots.map((b) => (
                      <span key={b.name} className={`aeo-bot${b.blocked ? " blocked" : ""}`}>
                        <i />
                        {b.name}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
              <div className="aeo-fixline">
                <Wrench className="mt-0.5 h-4 w-4 shrink-0 text-[#c1deff]" strokeWidth={2} />
                <span>
                  PerplexityBot is blocked on line 6. Remove the Disallow so Perplexity can read your
                  pages — and cite them.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── three tiles: can it read, lift and trust the page ── */}
        <section className="pt-20 sm:pt-28">
          <div className={WRAP}>
            <SectionHead
              label="Step 2"
              name="On the page"
              title="Can it read it, lift the answer out, and trust who wrote it?"
              sub="Checked on every page in the audit and scored by the share of pages that pass."
            />

            <div className="mt-12 grid gap-4 lg:grid-cols-3">
              <article className="cmpa-card flex flex-col p-7">
                <TileHead icon={Code2} name="Rendering & schema" weights="AEO 30% · GEO 25%" />
                <div className="aeo-code aeo-mono mt-5">
                  {"{\n  "}
                  <span className="k">&quot;@type&quot;</span>: <span className="s">&quot;Organization&quot;</span>
                  {",\n  "}
                  <span className="k">&quot;name&quot;</span>: <span className="s">&quot;Your Company&quot;</span>
                  {",\n  "}
                  <span className="k">&quot;url&quot;</span>: <span className="s">&quot;https://yoursite.com&quot;</span>
                  {",\n  "}
                  <span className="k">&quot;sameAs&quot;</span>: [ … ]{"\n}"}
                </div>
                <ul className="mt-6 space-y-3">
                  <Point>Content and links present without JavaScript</Point>
                  <Point>Valid JSON-LD — Organization, WebSite, Article, FAQ, breadcrumbs</Point>
                  <Point>Required fields checked for 9 schema types</Point>
                </ul>
              </article>

              <article className="cmpa-card flex flex-col p-7">
                <TileHead icon={FileText} name="Content structure" weights="AEO 25% · GEO 10%" />
                <div className="aeo-outline mt-5">
                  <div>
                    <span className="h">H1</span>CRM for small sales teams
                  </div>
                  <div className="sub">
                    <span className="h">H2</span>What is a CRM?<span className="q">Question</span>
                  </div>
                  <div className="sub">
                    <span className="h">H2</span>How much does it cost?<span className="q">Question</span>
                  </div>
                  <div className="sub">
                    <span className="h">H2</span>Compare plans<span className="q">Table</span>
                  </div>
                </div>
                <ul className="mt-6 space-y-3">
                  <Point>One H1, headings in order, question-style headings</Point>
                  <Point>Answer-first openings and short paragraphs</Point>
                  <Point>Lists, tables and FAQ sections</Point>
                </ul>
              </article>

              <article className="cmpa-card flex flex-col p-7">
                <TileHead icon={ShieldCheck} name="Trust & freshness" weights="GEO 35% · AEO 15%" />
                <div className="aeo-trust mt-5">
                  {["About page", "Contact details", "Named authors", "Reviews", "Updated dates", "Sitemap lastmod"].map((t) => (
                    <span key={t}>
                      <Check className="h-3.5 w-3.5 text-[var(--accent)]" strokeWidth={2.6} />
                      {t}
                    </span>
                  ))}
                  {["sameAs links", "Cited sources"].map((t) => (
                    <span key={t} className="miss">
                      {t}
                    </span>
                  ))}
                </div>
                <ul className="mt-6 space-y-3">
                  <Point>About, contact, authors, brand name, sameAs</Point>
                  <Point>Published and updated dates, sitemap lastmod</Point>
                  <Point>Plus 11 technical basics — HTTPS to broken pages</Point>
                </ul>
              </article>
            </div>
          </div>
        </section>

        {/* ── AEO vs GEO ── */}
        <section className="py-20 sm:py-28">
          <div className={WRAP}>
            <SectionHead
              label="Score"
              name="AEO vs GEO"
              title="Same checks, two different questions"
              sub="AEO asks whether your pages can be the answer. GEO asks whether your brand is worth citing. So the same seven categories count differently in each."
            />

            <div className="cmpa-soft mt-12 p-5 sm:p-10">
              {/* Butterfly: AEO grows left from the category, GEO grows right.
                  The lighter bar in each row is the score that leans on it less. */}
              <div className="aeo-fly-row aeo-fly-head">
                <div className="text-right">
                  <span className="aeo-fly-name">AEO</span>
                  <span className="aeo-fly-q">Can your pages be the answer?</span>
                </div>
                <span className="aeo-fly-mid">Share of score</span>
                <div>
                  <span className="aeo-fly-name geo">GEO</span>
                  <span className="aeo-fly-q">Is your brand worth citing?</span>
                </div>
              </div>

              <div className="aeo-fly mt-6">
                {WEIGHTS.map((w) => (
                  <div key={w.name} className="aeo-fly-row">
                    <div className={`aeo-fly-side aeo${w.aeo < w.geo ? " dim" : ""}`}>
                      <i style={{ "--w": w.aeo } as React.CSSProperties} />
                      <b>{w.aeo}%</b>
                    </div>
                    <span className="aeo-fly-label">{w.name}</span>
                    <div className={`aeo-fly-side geo${w.geo < w.aeo ? " dim" : ""}`}>
                      <i style={{ "--w": w.geo } as React.CSSProperties} />
                      <b>{w.geo}%</b>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 grid gap-4 border-t border-[var(--line-soft)] pt-8 lg:grid-cols-[1.4fr_1fr]">
                <div>
                  <p className="text-[12px] font-semibold tracking-[0.05em] text-[var(--muted)] uppercase">
                    Every rule carries a severity
                  </p>
                  <div className="aeo-sev mt-3">
                    {SEVERITY.map((s) => (
                      <div key={s.name}>
                        <span className="text-[13px] font-semibold">{s.name}</span>
                        <span className="aeo-dots" aria-label={`${s.pts} points`}>
                          {Array.from({ length: s.pts }, (_, i) => (
                            <i key={i} />
                          ))}
                        </span>
                        <span className="text-[12px] text-[var(--muted)]">
                          {s.pts} {s.pts === 1 ? "point" : "points"}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-[12.5px] text-[var(--muted)]">
                    Scored by the share of pages each rule passes on. Both scores are graded A to F.
                  </p>
                </div>

                <div className="aeo-cap">
                  <span className="aeo-cap-num">40</span>
                  <div>
                    <p className="text-[14.5px] font-semibold tracking-[-0.3px]">The hard ceiling</p>
                    <p className="mt-1 text-[13px] leading-[1.5] text-[var(--body)]">
                      If robots.txt blocks Googlebot or the AI answer bots, both scores are capped at
                      40 — however good everything else is.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── measured: the question × engine matrix on a dark panel ── */}
        <section id="measured" className="scroll-mt-24 pb-20 sm:pb-28">
          <div className={WRAP}>
            <div className="cmpa-on-dark cmpa-ink-panel cmpa-panel px-5 py-12 sm:px-12 sm:py-16">
              <div className="mx-auto max-w-[66ch] text-center">
                <span className="cmpa-tag border-white/15 bg-white/[0.08] text-white/70">
                  <b>Step 3</b>
                  Measured, not predicted
                </span>
                <h2 className="cmpa-h2 mt-5">Ten real questions, asked to every engine you pick</h2>
                <p className="mx-auto mt-4 max-w-[58ch] text-[16px] leading-[1.6] text-white/60">
                  Written from your own homepage and About page, asked in your site&rsquo;s country
                  and language, and marked answer by answer.
                </p>
              </div>

              <div className="mt-10 overflow-x-auto pb-2">
                <div className="aeo-matrix mx-auto max-w-[900px]">
                  <span className="hd lbl">
                    <span className="aeo-example">Example</span>
                  </span>
                  {ENGINES.map((e) => (
                    <span key={e} className="hd">
                      {e}
                    </span>
                  ))}
                  {MATRIX.map((row) =>
                    [
                      <span key={row.q} className="lbl">
                        {row.q}
                      </span>,
                      ...row.cells.map((c, i) => (
                        <span key={`${row.q}-${i}`}>
                          <MarkIcon c={c} />
                        </span>
                      )),
                    ],
                  )}
                </div>
              </div>

              <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-3 text-[12.5px] text-white/65">
                <span className="flex items-center gap-2">
                  <MarkIcon c={{ m: "cited", pos: 1 }} /> Cited, with source position
                </span>
                <span className="flex items-center gap-2">
                  <MarkIcon c={{ m: "read" }} /> Read your site, cited others
                </span>
                <span className="flex items-center gap-2">
                  <MarkIcon c={{ m: "named" }} /> Named you, no link
                </span>
                <span className="flex items-center gap-2">
                  <MarkIcon c={{ m: "absent" }} /> Absent
                </span>
              </div>

              <div className="mt-10 grid items-center gap-6 border-t border-white/10 pt-8 md:grid-cols-[auto_1fr]">
                <div>
                  <div className="text-[44px] leading-none font-semibold tracking-[-1.5px]">
                    {Math.round((CITED / CELLS.length) * 100)}%
                  </div>
                  <div className="mt-2 text-[13px] text-white/55">
                    cited in {CITED} of {CELLS.length} answers
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 md:justify-end">
                  <span className="mr-1 text-[12.5px] text-white/55">Cited instead:</span>
                  {CITED_INSTEAD.map((c) => (
                    <span key={c.d} className="aeo-domain">
                      {c.d} <b>{c.n}×</b>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── fix first ── */}
        <section id="plan" className="scroll-mt-24 pb-20 sm:pb-28">
          <div className={`${WRAP} grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]`}>
            <div className="cmpa-soft order-2 p-5 sm:p-7 lg:order-1">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[14px] font-semibold">Fix first</span>
                <span className="aeo-example">Example</span>
              </div>
              <div className="grid gap-2.5">
                {FIXES.map((f, i) => (
                  <div key={f.title} className="aeo-fix">
                    <span className="rk">{i + 1}</span>
                    <div>
                      <div className="text-[15px] font-semibold tracking-[-0.3px]">{f.title}</div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <span className={`aeo-tag${f.sev === "Critical" ? " crit" : ""}`}>{f.sev}</span>
                        <span className="aeo-tag gain">{f.gain}</span>
                        <span className="aeo-tag">{f.effort}</span>
                        <span className="aeo-tag">{f.where}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <span className="cmpa-tag">
                <b>Output</b>
                What you get back
              </span>
              <h2 className="cmpa-h2 mt-5">Every fix, ranked by what it&rsquo;s worth</h2>
              <p className="cmpa-lead mt-4 max-w-[52ch]">
                Each failing rule is sorted by the points it adds to AEO and GEO for the effort it
                takes — so the quick, high-impact fixes rise to the top.
              </p>
              <ul className="mt-7 space-y-3">
                {OUTPUT_POINTS.map((p) => (
                  <Point key={p}>{p}</Point>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap gap-2.5">
                <span className="cmpa-chip inline-flex items-center gap-2">
                  <History className="h-4 w-4" strokeWidth={1.9} /> Since last audit
                </span>
                <span className="cmpa-chip inline-flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" strokeWidth={1.9} /> Engine readiness
                </span>
                <span className="cmpa-chip inline-flex items-center gap-2">
                  <FileDown className="h-4 w-4" strokeWidth={1.9} /> PDF report
                </span>
              </div>
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

        <SampleReport {...SAMPLE_REPORTS.aeo} spacing="pb-20 sm:pb-28" />

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
        </div>
      </footer>

      <Footer />

      <SignupPopup />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PIECES
   ══════════════════════════════════════════════════════════════════════════ */

/** The hero visual: an example AI answer that cites the site, with both scores. */
function HeroChat() {
  return (
    <div className="relative mx-auto w-full max-w-[520px]">
      <div className="aeo-chat">
        <div className="aeo-chat-inner">
          <div className="aeo-tabs">
            {ENGINES.map((e, i) => (
              <span key={e} className={i === 0 ? "on" : undefined}>
                {e}
              </span>
            ))}
          </div>

          <div className="p-4 sm:p-5">
            <div className="aeo-q">What&rsquo;s the best CRM for a small sales team?</div>

            <div className="mt-5 flex items-start gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] bg-[var(--ink)] text-white">
                <Bot className="h-4 w-4" strokeWidth={2} />
              </span>
              <div className="grid flex-1 gap-2.5 pt-1.5">
                <div className="flex items-center">
                  <span className="aeo-line" style={{ "--w": 86 } as React.CSSProperties} />
                  <span className="aeo-cite">1</span>
                </div>
                <span className="aeo-line" style={{ "--w": 94 } as React.CSSProperties} />
                <div className="flex items-center">
                  <span className="aeo-line" style={{ "--w": 70 } as React.CSSProperties} />
                  <span className="aeo-cite">2</span>
                </div>
                <span className="aeo-line" style={{ "--w": 52 } as React.CSSProperties} />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-[12px] font-semibold tracking-[0.05em] text-[var(--muted)] uppercase">
                Sources
              </span>
              <span className="aeo-example">Example</span>
            </div>
            <div className="mt-2.5 grid gap-2">
              <div className="aeo-src me">
                <span className="n">1</span>
                <span className="font-semibold">yoursite.com</span>
                <span className="aeo-pill">Cited · #1</span>
              </div>
              <div className="aeo-src">
                <span className="n">2</span>
                competitor-a.com
              </div>
              <div className="aeo-src">
                <span className="n">3</span>
                review-site.com
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Both rings hang off the card's bottom edge, clear of the answer. */}
      <div className="aeo-score hidden sm:flex -left-6 -bottom-10">
        <div className="aeo-ring" style={{ "--v": 74 } as React.CSSProperties}>
          <span>74</span>
        </div>
        <div className="text-[12px] leading-[1.3] text-[var(--muted)]">
          AEO score
          <br />
          <b className="text-[14px] text-[var(--ink)]">Grade C</b>
        </div>
      </div>
      <div className="aeo-score late hidden sm:flex -right-6 -bottom-10">
        <div className="aeo-ring" style={{ "--v": 61, "--c": "#4a8fff" } as React.CSSProperties}>
          <span>61</span>
        </div>
        <div className="text-[12px] leading-[1.3] text-[var(--muted)]">
          GEO score
          <br />
          <b className="text-[14px] text-[var(--ink)]">Grade D</b>
        </div>
      </div>
    </div>
  );
}

function MarkIcon({ c }: { c: Cell }) {
  return (
    <span className={`aeo-mk ${c.m}`} aria-label={c.m}>
      {c.m === "cited" ? c.pos : null}
    </span>
  );
}

function TileHead({ icon: Icon, name, weights }: { icon: LucideIcon; name: string; weights: string }) {
  return (
    <div className="flex items-center gap-3.5">
      <span className="cmpa-icon">
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
      </span>
      <span>
        <span className="block text-[17px] font-semibold tracking-[-0.5px]">{name}</span>
        <span className="block text-[12.5px] text-[var(--muted)]">{weights}</span>
      </span>
    </div>
  );
}

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
