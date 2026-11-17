import type { Metadata } from "next";
import { SampleReport } from "@/components/landing/SampleReport";
import { SAMPLE_REPORTS } from "@/components/landing/sample-reports";
import Image from "next/image";
import { Inter } from "next/font/google";
import {
  ArrowRight,
  CalendarPlus,
  Camera,
  Check,
  ChevronDown,
  Globe,
  History,
  LayoutGrid,
  Lock,
  MapPin,
  MessageSquareWarning,
  Printer,
  RefreshCw,
  Search,
  ShieldCheck,
  Star,
  Store,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { LogoMark } from "@/components/landing/ui/Logo";
import { TESTIMONIALS } from "@/components/home/data";
import { CREDIT_PLANS } from "@/app/pricing/PricingPlans";
import { Cta } from "./Cta";
import { SignupPopup } from "./SignupPopup";
// Same `.cmpa-` design system as /competitor-analysis, imported rather than
// copied so the ad pages share one theme. maps.css adds this page's visuals.
import "../competitor-analysis/ads.css";
import "./maps.css";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { DemoSection } from "@/components/demos/DemoSection";
import { GbpAuditDemo } from "@/components/demos/GbpAuditDemo";

/**
 * /google-maps-audit — paid-acquisition landing page for the Google Maps
 * (Business Profile) audit.
 *
 * Every claim is taken from freeserp-backend-v2/src/modules/gbp-audit:
 * report.ts (25 checks, category weights 30/25/20/15/10, pass 1 / warn ½ /
 * fail 0, "Not verified" checks left out of the score, the 30-day plan's three
 * phases), gridScan.ts (3×3 grid, 1 km to the edge), gbpCache.ts (20 newest
 * reviews, 10-day shared cache), credits/catalog.ts ((12 + 7 for the grid) × 5 = 95),
 * billing/spendGate.ts and the frontend's verdict bands.
 * Things the tool does NOT do — sentiment, posts, Q&A, AI writing, share
 * links, CSV, letter grades — are deliberately never mentioned.
 *
 * The map, bento tiles, competitor rows and plan tasks are illustrative mock
 * ups built in HTML/CSS (no screenshot exists for this tool) and each carries
 * an "Example" badge.
 */

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Google Maps Audit — Business Profile audit with a local rank grid — FreeSERP",
  description:
    "Paste a Google Maps link and FreeSERP audits the Business Profile in 25 checks — profile, reviews, photos, website and visibility — runs a 3×3 local rank grid around the business, compares it with the listings around it and hands back a 30-day action plan. 100 free credits every month, no credit card.",
  alternates: { canonical: "/google-maps-audit" },
  openGraph: {
    title: "Why isn't your business showing up on Google Maps?",
    description:
      "A 25-check Business Profile audit, a 3×3 local rank grid and a 30-day action plan — from one pasted Google Maps link.",
    url: "/google-maps-audit",
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
  "25 checks on the Business Profile",
  "A 3×3 rank grid around the business",
  "Compared with the listings around you",
  "A 30-day plan, in order of impact",
];

/**
 * The example grid, row by row. `null` is "not in the top 20" and the centre
 * cell is the business itself. Figures quoted elsewhere on the page (top 3 at
 * 4 of 9, average 5.3) are computed from this, not typed separately.
 */
const GRID: (number | null)[] = [1, 2, 4, 3, 2, 7, 9, 14, null];
const GRID_X = [20, 50, 80];
const GRID_Y = [19, 50, 81];
const found = GRID.filter((r): r is number => r !== null);
const TOP3 = found.filter((r) => r <= 3).length;
const AVG = (found.reduce((a, b) => a + b, 0) / found.length).toFixed(1);

const tier = (r: number | null) => (r === null ? "t0" : r <= 3 ? "t1" : r <= 10 ? "t2" : "t3");

type Status = "pass" | "warn" | "fail";

const PROFILE_ROWS: { label: string; note?: string; s: Status }[] = [
  { label: "Profile claimed", s: "pass" },
  { label: "Primary category", note: "Dentist", s: "pass" },
  { label: "Additional categories", note: "none set", s: "fail" },
  { label: "Description", note: "182 / 250 characters", s: "warn" },
  { label: "Opening hours", s: "pass" },
  { label: "Attributes", note: "3 of 5", s: "warn" },
];

const STARS = [
  { n: 5, w: 72 },
  { n: 4, w: 15 },
  { n: 3, w: 6 },
  { n: 2, w: 3 },
  { n: 1, w: 4 },
];

const SCORE_PARTS = [
  { name: "Profile", w: 30, c: "#03155a" },
  { name: "Reviews", w: 25, c: "#0b3bd0" },
  { name: "Visibility", w: 20, c: "#0454ff" },
  { name: "Photos", w: 15, c: "#2f6bff" },
  { name: "Website", w: 10, c: "#4a8fff" },
];

const VERDICTS = [
  { name: "Room to grow", range: "below 60", c: "#cfd6e4" },
  { name: "Fair", range: "60+", c: "#8fb6ff" },
  { name: "Good", range: "70+", c: "#4a8fff" },
  { name: "Strong", range: "80+", c: "#0454ff" },
  { name: "Excellent", range: "90+", c: "#03155a" },
];

const COMPETITORS = [
  { rank: 1, name: "Competitor A", rating: "4.8", reviews: 412 },
  { rank: 2, name: "Your business", rating: "4.6", reviews: 128, me: true },
  { rank: 3, name: "Competitor B", rating: "4.4", reviews: 260 },
  { rank: 4, name: "Competitor C", rating: "4.9", reviews: 87 },
];

const COMPETITOR_POINTS = [
  "The listings ranking at your own location, ads removed",
  "Your rating against their average",
  "Your review count against their median",
  "The category most of them use — and whether you do",
  "Google's own “People also search for” list",
];

const PHASES = [
  {
    days: "Days 1–7",
    title: "Fix the essentials",
    tasks: [
      "Add additional categories",
      "Take the description past 250 characters",
      "Reply to the two unanswered low-star reviews",
    ],
  },
  {
    days: "Days 8–14",
    title: "Build trust and content",
    tasks: ["Upload a cover photo", "Add 16 more photos to reach 50", "Fill in the missing attributes"],
  },
  {
    days: "Days 15–30",
    title: "Grow local visibility",
    tasks: [
      "Add a booking link to the profile",
      "Keep new reviews coming in",
      "Run the audit again and compare the grid",
    ],
  },
];

const CHIPS = [
  "dentist",
  "plumber",
  "coffee shop",
  "car repair",
  "hair salon",
  "estate agent",
  "physiotherapist",
  "[service] near me",
  "emergency [service]",
  "best [business] in [city]",
];

const STEPS = [
  {
    n: "01",
    title: "Paste the Google Maps link",
    text: "A share link, a full Maps URL or a Place ID — whatever you copied from Google works. No business name to type, no account to connect.",
  },
  {
    n: "02",
    title: "Add a keyword, or don't",
    text: "Type the search you want to be found for. Leave it blank and the audit uses the listing's own primary category.",
  },
  {
    n: "03",
    title: "The listing gets audited",
    text: "The profile and its 20 newest reviews are read, the 3×3 rank grid runs around the business, and the competitors at your location are lined up beside you.",
  },
  {
    n: "04",
    title: "Work the plan, then run again",
    text: "Fix what the 30-day plan puts first, then run the audit again to see the score move. Every past audit of the profile stays in its history.",
  },
];

const STATS = [
  { value: "25", label: "checks on every profile" },
  { value: "9", label: "rank grid points" },
  { value: "95", label: "credits an audit" },
  { value: "100", label: "free credits every month" },
];

const BENEFITS = [
  {
    icon: Printer,
    title: "Print it or save as PDF",
    text: "The whole report prints cleanly from the browser, ready to hand to a client or drop into a pitch.",
  },
  {
    icon: RefreshCw,
    title: "Run again in one click",
    text: "Re-audit after you have made the changes and see the score difference next to the last result.",
  },
  {
    icon: Search,
    title: "Check another keyword",
    text: "Run the rank grid again for a different search straight from the report, without starting over.",
  },
  {
    icon: MapPin,
    title: "Carries on in Maps Tracker",
    text: "The grid is a real Maps Tracker scan saved to your account, so the ranking you audited today is the first point of its history.",
  },
  {
    icon: History,
    title: "Every audit kept",
    text: "Each business keeps its earlier audits, so you can show what changed and when.",
  },
  {
    icon: ShieldCheck,
    title: "Nothing guessed",
    text: "When Google does not return a field, the check is marked Not verified and left out of the score — never counted as a fail.",
  },
];

const FREE_POINTS = [
  "One full audit a month",
  "All 25 checks and the rank grid",
  "The full 30-day action plan",
  "No credit card required",
];

const PAID_POINTS = [
  "Audit every client's listing",
  "Every check, every report",
  "Audit history for each business",
  "Cancel anytime",
];

const FAQS = [
  {
    q: "What does the Google Maps audit check?",
    a: "25 checks across five areas: the profile (claimed status, categories, description, phone, hours, address, attributes, keyword-stuffed names), reviews (rating, review count against local competitors, recency, reply rate, unanswered low-star reviews), photos (count, logo, cover), the website link (present, HTTPS, UTM tags, booking links) and local visibility from a 3×3 rank grid around the business.",
  },
  {
    q: "What link do I need?",
    a: "Any Google Maps link to the business — a share link from maps.app.goo.gl, a full /maps/place/ URL, a link with a CID or Place ID, or the Place ID itself. Paste what you copied; you do not need to own or have access to the listing.",
  },
  {
    q: "Which keyword does the rank grid use?",
    a: "The one you type. Leave it blank and it uses the listing's primary category. The grid searches from nine points around the business, 1 km apart, and reads the top 20 Maps results at each one.",
  },
  {
    q: "How is the score calculated?",
    a: "Each check passes, warns or fails, and carries a weight. Categories are combined at Profile 30%, Reviews 25%, Local visibility 20%, Photos & content 15% and Website 10% into a score out of 100. It is FreeSERP's score, not one Google publishes — and a check Google returned no data for is left out rather than counted as a fail.",
  },
  {
    q: "What does an audit cost?",
    a: "95 credits: 60 for the listing and reviews and 35 for the rank grid. The listing and reviews part is free when they were fetched in the last 10 days, and the grid is free when you already have a recent scan for the same keyword. A failed audit is refunded. The free plan's 100 monthly credits cover one full audit.",
  },
  {
    q: "Can I give the report to a client?",
    a: "Yes — print it or save it as a PDF straight from the browser. Reports are private to your account.",
  },
  {
    q: "Do I need a credit card to start?",
    a: "No. The free plan needs no card and includes 100 credits every month, refilled automatically. Paid plans start at $19/month for 2,000 credits and can be cancelled at any time — email support@freeserp.com if you want a hand sizing one.",
  },
];

/** Credits per full audit: gbp.audit (60) + the 3×3 grid's maps.scan.point (35), both after the 5× multiplier. */
const CREDITS_PER_AUDIT = 95;

const WRAP = "mx-auto w-full max-w-[1139px] px-5 sm:px-8";

/* ══════════════════════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════════════════════ */

export default function GoogleMapsAuditPage() {
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
        {/* ── hero: copy on the left, a live-looking rank grid on the right ── */}
        <section id="top" className="cmpa-band cmpa-on-dark pt-28 pb-20 sm:pt-36 sm:pb-28">
          <div className={`${WRAP} grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr]`}>
            <div className="text-center lg:text-left">
              <a href="#grid" className="cmpa-eyebrow">
                <b>New</b>
                A 3×3 local rank grid in every audit
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
              </a>

              <h1 className="cmpa-h1 mx-auto mt-7 max-w-[17ch] text-white lg:mx-0">
                Find out <span className="cmpa-grad-text">why you&rsquo;re not showing up on Google Maps</span>
              </h1>

              <p className="cmpa-lead mx-auto mt-6 max-w-[54ch] lg:mx-0">
                Paste your Google Maps link. FreeSERP audits the Business Profile in 25 checks, maps
                where you rank around your own front door, lines you up against the listings beating
                you and hands back a 30-day plan to fix it.
              </p>

              <div className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <Cta placement="hero" label="Audit my listing free" />
                <a
                  href={SAMPLE_REPORTS.maps.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cmpa-btn cmpa-btn-lg cmpa-btn-ghost"
                >
                  View sample report
                </a>
              </div>
            </div>

            <HeroMap />
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

        <DemoSection title="Fix a check, watch the score climb">
          <GbpAuditDemo />
        </DemoSection>

        {/* ── bento: the five scored areas, each shown as the report shows it ── */}
        <section id="checks" className="scroll-mt-24 pt-20 sm:pt-28">
          <div className={WRAP}>
            <SectionHead
              label="Audit"
              name="The checks"
              title="Five areas, 25 checks, one score"
              sub="Everything Google shows a searcher about your business, checked against what tends to win the map."
            />
            <p className="mt-5 text-center">
              <span className="gma-example">Example report · illustrative figures</span>
            </p>

            <div className="gma-bento mt-12">
              {/* Profile */}
              <article className="cmpa-card gma-tile gma-span-3">
                <TileHead icon={Store} name="Profile" sub="9 checks" weight="30%" />
                <div className="mt-5 grid gap-2">
                  {PROFILE_ROWS.map((r) => (
                    <div key={r.label} className="gma-check">
                      <span>
                        {r.label}
                        {r.note && <small> · {r.note}</small>}
                      </span>
                      <StatusChip s={r.s} />
                    </div>
                  ))}
                </div>
              </article>

              {/* Reviews */}
              <article className="cmpa-card gma-tile gma-span-3">
                <TileHead icon={Star} name="Reviews" sub="5 checks · 20 newest read" weight="25%" />
                <div className="mt-5 grid gap-6 sm:grid-cols-[auto_1fr]">
                  <div>
                    <div className="text-[52px] leading-none font-semibold tracking-[-2px]">4.6</div>
                    <div className="mt-2 flex gap-0.5 text-[#f5a623]" aria-hidden>
                      {[0, 1, 2, 3, 4].map((i) => (
                        <Star key={i} className="h-4 w-4" fill="currentColor" strokeWidth={0} />
                      ))}
                    </div>
                    <div className="mt-1.5 text-[13px] text-[var(--muted)]">128 reviews</div>
                  </div>
                  <div className="grid gap-2">
                    {STARS.map((s) => (
                      <div key={s.n} className="grid grid-cols-[22px_1fr] items-center gap-2 text-[12.5px] text-[var(--muted)]">
                        <span>{s.n}★</span>
                        <div className="gma-bar">
                          <i style={{ "--w": s.w } as React.CSSProperties} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-auto grid gap-2 pt-6">
                  <div className="gma-check">
                    <span>
                      Owner reply rate <small>· 14 of 20 replied</small>
                    </span>
                    <StatusChip s="warn" />
                  </div>
                  <div className="gma-check">
                    <span className="flex items-center gap-2">
                      <MessageSquareWarning className="h-4 w-4 text-[var(--accent)]" strokeWidth={2} />
                      2 reviews of 3★ or lower have no reply
                    </span>
                    <StatusChip s="fail" />
                  </div>
                </div>
              </article>

              {/* Visibility — the grid as a small map, with its three numbers */}
              <article id="grid" className="cmpa-card gma-tile gma-span-2 scroll-mt-24">
                <TileHead icon={LayoutGrid} name="Local visibility" sub="4 checks" weight="20%" />
                <div className="gma-minimap mt-5">
                  {GRID.map((r, i) =>
                    i === 4 ? (
                      <span key={i} className="gma-minihome">
                        <Store className="h-3.5 w-3.5" strokeWidth={2.2} />
                      </span>
                    ) : (
                      <span
                        key={i}
                        className={`gma-pin ${tier(r)}`}
                        style={{ left: `${GRID_X[i % 3]}%`, top: `${GRID_Y[Math.floor(i / 3)]}%` }}
                      >
                        {r ?? "–"}
                      </span>
                    ),
                  )}
                </div>
                <div className="gma-stats mt-auto pt-5">
                  <div>
                    <b>
                      {TOP3}/9
                    </b>
                    in top 3
                  </div>
                  <div>
                    <b>
                      {found.length}/9
                    </b>
                    found
                  </div>
                  <div>
                    <b>{AVG}</b>
                    avg. rank
                  </div>
                </div>
              </article>

              {/* Photos — count against the 10 / 50 thresholds, then logo and cover */}
              <article className="cmpa-card gma-tile gma-span-2">
                <TileHead icon={Camera} name="Photos & content" sub="3 checks" weight="15%" />
                <div className="gma-photos mt-5">
                  {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                    <span key={i} />
                  ))}
                  <span className="empty">+16</span>
                </div>
                <div className="mt-4 flex items-baseline justify-between text-[13px]">
                  <span>
                    <b className="text-[15px]">34</b> photos
                  </span>
                  <span className="text-[var(--muted)]">16 to pass</span>
                </div>
                <div className="gma-track mt-2">
                  <div className="gma-bar">
                    <i style={{ "--w": 68 } as React.CSSProperties} />
                  </div>
                  <span style={{ left: "20%" }}>10</span>
                  <span style={{ left: "100%" }}>50</span>
                </div>
                <div className="mt-auto grid gap-2 pt-6">
                  <div className="gma-check">
                    <span>Logo</span>
                    <StatusChip s="pass" />
                  </div>
                  <div className="gma-check">
                    <span>Cover photo</span>
                    <StatusChip s="fail" />
                  </div>
                </div>
              </article>

              {/* Website — the link as a browser bar, the booking action, then checks */}
              <article className="cmpa-card gma-tile gma-span-2">
                <TileHead icon={Globe} name="Website & actions" sub="4 checks" weight="10%" />
                <div className="gma-browser mt-5">
                  <div className="gma-browser-bar">
                    <Lock className="h-3.5 w-3.5 text-[var(--accent)]" strokeWidth={2.4} />
                    yourbusiness.com
                  </div>
                  <div className="flex flex-wrap gap-1.5 p-3">
                    <span className="gma-param">utm_source=gbp</span>
                    <span className="gma-param">utm_medium=organic</span>
                  </div>
                </div>
                <div className="gma-book mt-3">
                  <CalendarPlus className="h-4 w-4" strokeWidth={2} />
                  Book online
                  <small>not set</small>
                </div>
                <div className="mt-auto grid gap-2 pt-6">
                  <div className="gma-check">
                    <span>HTTPS</span>
                    <StatusChip s="pass" />
                  </div>
                  <div className="gma-check">
                    <span>UTM tags on the link</span>
                    <StatusChip s="pass" />
                  </div>
                  <div className="gma-check">
                    <span>Booking link</span>
                    <StatusChip s="fail" />
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ── how the score adds up ── */}
        <section className="py-20 sm:py-28">
          <div className={WRAP}>
            <SectionHead
              label="Score"
              name="How it adds up"
              title="One number, and exactly where it came from"
              sub="Each check passes, warns or fails. Each area is weighted. The total lands on a plain verdict, and it is FreeSERP's score — not one Google publishes."
            />

            <div className="cmpa-soft mt-12 p-6 sm:p-10">
              <div className="gma-stack">
                {SCORE_PARTS.map((p) => (
                  <div key={p.name} style={{ flex: p.w, background: p.c }}>
                    {p.w}%
                    <small className="hidden sm:block">{p.name}</small>
                  </div>
                ))}
              </div>

              <div className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <p className="text-[13px] font-semibold tracking-[0.04em] text-[var(--muted)] uppercase">
                    Every check counts as
                  </p>
                  <div className="gma-weights mt-4">
                    <div>
                      <StatusChip s="pass" />
                      <span>
                        <b>1 point</b> — done right
                      </span>
                    </div>
                    <div>
                      <StatusChip s="warn" />
                      <span>
                        <b>½ point</b> — there, but not enough
                      </span>
                    </div>
                    <div>
                      <StatusChip s="fail" />
                      <span>
                        <b>0 points</b> — missing or wrong
                      </span>
                    </div>
                  </div>
                  <p className="mt-4 text-[13px] leading-[1.55] text-[var(--muted)]">
                    No data from Google? The check is marked Not verified and left out entirely.
                  </p>
                </div>

                <div>
                  <p className="text-[13px] font-semibold tracking-[0.04em] text-[var(--muted)] uppercase">
                    The verdict on your score
                  </p>
                  <div className="gma-scale mt-4">
                    {VERDICTS.map((v) => (
                      <div key={v.name} style={{ borderTopColor: v.c }}>
                        <b>{v.name}</b>
                        {v.range}
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-[13px] leading-[1.55] text-[var(--muted)]">
                    Re-audit the same business and the report shows how far the score moved since last
                    time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── competitors ── */}
        <section className="pb-20 sm:pb-28">
          <div className={`${WRAP} grid items-center gap-12 lg:grid-cols-2`}>
            <div>
              <span className="cmpa-tag">
                <b>Compare</b>
                The map around you
              </span>
              <h2 className="cmpa-h2 mt-5">You, beside the listings that beat you</h2>
              <p className="cmpa-lead mt-4 max-w-[52ch]">
                The audit reads the Maps results at your own location and lines your profile up
                against them — so a review count is never judged in a vacuum.
              </p>
              <ul className="mt-7 space-y-3">
                {COMPETITOR_POINTS.map((p) => (
                  <Point key={p}>{p}</Point>
                ))}
              </ul>
            </div>

            <div className="cmpa-soft p-5 sm:p-7">
              <div className="mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2 text-[14px] font-semibold">
                  <Trophy className="h-4 w-4 text-[var(--accent)]" strokeWidth={2} />
                  Ranking at your location
                </span>
                <span className="gma-example">Example</span>
              </div>
              <div className="gma-comp">
                <div className="head">
                  <span>#</span>
                  <span>Business</span>
                  <span>Rating</span>
                  <span>Reviews</span>
                </div>
                {COMPETITORS.map((c) => (
                  <div key={c.rank} className={c.me ? "me" : undefined}>
                    <span className="rk">{c.rank}</span>
                    <span className={c.me ? "font-semibold" : undefined}>{c.name}</span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-[#f5a623]" fill="currentColor" strokeWidth={0} />
                      {c.rating}
                    </span>
                    <span>{c.reviews}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── the 30-day plan ── */}
        <section id="plan" className="scroll-mt-24 pb-20 sm:pb-28">
          <div className={WRAP}>
            <SectionHead
              label="Output"
              name="The action plan"
              title="Thirty days, in the order that matters"
              sub="Every task comes from a check that failed or warned, so nothing on the list is filler — and the essentials always come first."
            />
            <p className="mt-5 text-center">
              <span className="gma-example">Example tasks</span>
            </p>

            <div className="gma-timeline mt-12">
              {PHASES.map((p) => (
                <article key={p.days} className="cmpa-card gma-phase">
                  <div className="flex items-center gap-3">
                    <span className="gma-phase-dot">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    <span className="gma-days">{p.days}</span>
                  </div>
                  <h3 className="mt-5 text-[19px] font-semibold tracking-[-0.6px]">{p.title}</h3>
                  <ul className="mt-4 space-y-3">
                    {p.tasks.map((t) => (
                      <Point key={t}>{t}</Point>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── who it is for ── */}
        <section className="pb-20 sm:pb-28">
          <div className={WRAP}>
            <SectionHead
              label="Keywords"
              name="Who it is for"
              title="Any business people find on the map"
              sub="If customers search for what you do and pick from the pins, the audit applies to you."
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
            <SectionHead label="Setup" name="How it works" title="One link in, one plan out" />
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
              title="An audit that keeps working after the first run"
              sub="Print it for the client, fix what it found, then run it again and show the difference."
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

        <SampleReport {...SAMPLE_REPORTS.maps} spacing="pb-20 sm:pb-28" />

        {/* ── pricing ── */}
        <section id="pricing" className="scroll-mt-24 pb-20 sm:pb-28">
          <div className={WRAP}>
            <SectionHead
              label="Pricing"
              name="Credits"
              title="Choose the plan that fits"
              sub="One balance covers Maps audits, rank tracking, AI visibility, site audits and keyword research."
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
                  Auditing listings for clients?
                </p>
                <p className="mt-1.5 max-w-[62ch] text-[14.5px] leading-[1.55] text-[var(--body)]">
                  A full audit is 95 credits, and re-running one within 10 days often costs less.
                  Tell us how many locations you look after and we will size the balance for you.
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
              See your listing <span className="cmpa-grad-text">the way Google sees it</span>
            </h2>
            <p className="mx-auto mt-5 max-w-[54ch] text-[16px] leading-[1.6] text-white/60">
              One Google Maps link, 25 checks, a local rank grid and a 30-day plan. 100 free credits
              every month, no credit card.
            </p>
            <div className="mt-8 flex justify-center">
              <Cta placement="final_cta" label="Audit my listing free" />
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

/** The hero visual: the example 3×3 grid as pins on a CSS-drawn map. */
function HeroMap() {
  return (
    <div className="relative mx-auto w-full max-w-[520px]">
      <div className="gma-mapcard">
        <div className="gma-map" role="img" aria-label={`Example rank grid: top 3 at ${TOP3} of 9 points around the business`}>
          {GRID.map((r, i) =>
            i === 4 ? null : (
              <span
                key={i}
                className={`gma-pin ${tier(r)}`}
                style={
                  {
                    left: `${GRID_X[i % 3]}%`,
                    top: `${GRID_Y[Math.floor(i / 3)]}%`,
                    "--d": i,
                  } as React.CSSProperties
                }
              >
                {r ?? "–"}
              </span>
            ),
          )}
          <span className="gma-home">
            <Store className="h-5 w-5" strokeWidth={2} />
            <b>{GRID[4]}</b>
          </span>
        </div>

        <div className="gma-listing">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate text-[15px] font-semibold">Your business</span>
              <span className="gma-example">Example</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[13px] text-[var(--muted)]">
              <Star className="h-3.5 w-3.5 text-[#f5a623]" fill="currentColor" strokeWidth={0} />
              4.6 · 128 reviews · Dentist
            </div>
            <div className="gma-legend mt-2.5">
              <span>
                <i style={{ background: "#0454ff" }} />
                Top 3
              </span>
              <span>
                <i style={{ background: "#4a8fff" }} />
                4–10
              </span>
              <span>
                <i style={{ background: "#cfd6e4" }} />
                11–20
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="gma-ring" style={{ "--v": 78 } as React.CSSProperties}>
              <span>78</span>
            </div>
            <div className="hidden text-[12px] leading-[1.3] text-[var(--muted)] sm:block">
              Score
              <br />
              <b className="text-[14px] text-[var(--ink)]">Good</b>
            </div>
          </div>
        </div>
      </div>

      {/* Placed off the pins: one hangs over the card's top edge, the other
          sits in the gap between the first and second row of the grid. */}
      <div className="gma-float hidden sm:flex -left-5 -top-6">
        <span className="gma-dot">
          <LayoutGrid className="h-4 w-4" strokeWidth={2} />
        </span>
        Top 3 at {TOP3} of 9 points
      </div>
      <div className="gma-float late hidden sm:flex -right-6 top-[24%]">
        <span className="gma-dot">
          <MessageSquareWarning className="h-4 w-4" strokeWidth={2} />
        </span>
        2 reviews need a reply
      </div>
    </div>
  );
}

function TileHead({ icon: Icon, name, sub, weight }: { icon: LucideIcon; name: string; sub: string; weight: string }) {
  return (
    <div className="flex items-center gap-3.5">
      <span className="cmpa-icon">
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
      </span>
      <span>
        <span className="block text-[17px] font-semibold tracking-[-0.5px]">{name}</span>
        <span className="block text-[12.5px] text-[var(--muted)]">{sub}</span>
      </span>
      <span className="gma-weight">{weight}</span>
    </div>
  );
}

function StatusChip({ s }: { s: Status }) {
  return <span className={`gma-s ${s}`}>{s === "pass" ? "Pass" : s === "warn" ? "Warn" : "Fail"}</span>;
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
        <p className="mt-1.5 text-[13.5px] text-[var(--muted)]">Perfect for one business</p>
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
