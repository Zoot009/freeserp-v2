import type { Metadata } from "next";
import Image from "next/image";
import { Inter } from "next/font/google";
import {
  ArrowRight,
  Camera,
  Check,
  ChevronDown,
  ClipboardList,
  Globe,
  History,
  LayoutGrid,
  MapPin,
  MessageSquareText,
  Printer,
  RefreshCw,
  Search,
  ShieldCheck,
  Star,
  Store,
  Target,
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
// copied so the two ad pages cannot drift apart.
import "../competitor-analysis/ads.css";

/**
 * /google-maps-audit — paid-acquisition landing page for the Google Maps
 * (Business Profile) audit. Same layout family as /competitor-analysis.
 *
 * Every claim is taken from freeserp-backend-v2/src/modules/gbp-audit:
 * report.ts (25 checks, category weights 30/25/20/15/10, "Not verified" checks
 * left out of the score), gridScan.ts (3×3 grid, 1 km to the edge),
 * gbpCache.ts (20 newest reviews, 10-day shared cache), credits/catalog.ts
 * (2 credits + 3 for the grid = 5), billing/spendGate.ts (3 a day on free).
 * Things the tool does NOT do — sentiment, posts, Q&A, AI writing, share
 * links, CSV, letter grades — are deliberately never mentioned.
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

const HERO_LAYERS: { icon: LucideIcon; label: string }[] = [
  { icon: Store, label: "Profile" },
  { icon: Star, label: "Reviews" },
  { icon: LayoutGrid, label: "Local rankings" },
  { icon: Camera, label: "Photos & website" },
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

/** The five scored categories, in report order, weights from report.ts. */
const LAYERS: Layer[] = [
  {
    id: "profile",
    icon: Store,
    tint: "#e7effe",
    dot: "#0454ff",
    name: "Profile",
    kicker: "What the listing says about you",
    title: "The fields Google reads before it ranks you",
    body: "Is the profile claimed? Is the primary category right, and are there additional ones? Is the description long enough to say something, are the phone, hours and address all there, and does the business name stay clear of keyword stuffing? Each one is a check with a pass, a warning or a fail — and the reason for it.",
    points: [
      "Claimed status, primary and additional categories",
      "Description length — passes at 250+ characters",
      "Phone, opening hours and address present",
      "Attributes filled in, and no keyword-stuffed name",
    ],
    spec: [
      { k: "Checks", v: "9" },
      { k: "Read from", v: "The live Google listing" },
      { k: "Weight", v: "30% of the score" },
      { k: "Missing data", v: "Not verified, not failed" },
    ],
  },
  {
    id: "reviews",
    icon: Star,
    tint: "#e4f2fc",
    dot: "#0d80c9",
    name: "Reviews",
    kicker: "What customers say, and whether you answer",
    title: "Your reviews, measured against the businesses beside you",
    body: "The 20 newest reviews are read in full, with the owner's replies. You see your rating, your review count against the median of the listings around you, how recently the last review landed, how many you have replied to, and which reviews of 3 stars or lower are still sitting there without a reply.",
    points: [
      "Rating — passes at 4.5, warns from 4.0",
      "Review count against the local competitor median",
      "Days since the newest review, and your reply rate",
      "Every unanswered review of 3★ or lower, flagged",
    ],
    spec: [
      { k: "Checks", v: "5" },
      { k: "Reviews read", v: "The 20 newest" },
      { k: "Weight", v: "25% of the score" },
      { k: "Also shown", v: "Star breakdown, review topics" },
    ],
  },
  {
    id: "visibility",
    icon: LayoutGrid,
    tint: "#e9ebfd",
    dot: "#3b46d6",
    name: "Local visibility",
    kicker: "Where you actually show up on the map",
    title: "A 3×3 rank grid, run around your front door",
    body: "Nine searches for your keyword — or your primary category if you leave it blank — from nine points around the business, 1 km apart. Each pin shows where you rank from that spot and who holds the top three there. It runs as a real Maps Tracker scan, so it opens in the tracker and keeps its history.",
    points: [
      "Your rank at all 9 points, pinned on a map",
      "Top-3 coverage and average rank where found",
      "The top three listings at every point",
      "Rating and category compared with the competition",
    ],
    spec: [
      { k: "Checks", v: "4" },
      { k: "Grid", v: "3×3, about 2×2 km" },
      { k: "Results read", v: "Top 20 at each point" },
      { k: "Weight", v: "20% of the score" },
    ],
  },
  {
    id: "content",
    icon: Camera,
    tint: "#e3ebfe",
    dot: "#0a3fbf",
    name: "Photos & content",
    kicker: "What people see before they call",
    title: "Photos, logo and cover — the listing's shop window",
    body: "A listing with three photos loses the click to one with sixty. The audit counts your photos and checks for a logo and a cover image, because those are what a searcher sees first when your pin is one of several on the screen.",
    points: [
      "Photo count — passes at 50, warns from 10",
      "Logo uploaded",
      "Cover photo set",
      "Each with the reason it matters",
    ],
    spec: [
      { k: "Checks", v: "3" },
      { k: "Read from", v: "The live Google listing" },
      { k: "Weight", v: "15% of the score" },
      { k: "Priority", v: "High, medium or low per check" },
    ],
  },
  {
    id: "website",
    icon: Globe,
    tint: "#e6f0fb",
    dot: "#1867c0",
    name: "Website & actions",
    kicker: "Where the click goes next",
    title: "The link from the listing to the business",
    body: "Is there a website on the profile, is it served over HTTPS, does the link carry UTM tags so the traffic shows up properly in analytics, and are there booking or order links for people ready to act straight from the map?",
    points: [
      "Website linked from the profile",
      "HTTPS on the linked site",
      "UTM tags on the website link",
      "Booking and order action links",
    ],
    spec: [
      { k: "Checks", v: "4" },
      { k: "Read from", v: "The live Google listing" },
      { k: "Weight", v: "10% of the score" },
      { k: "Shown as", v: "Pass, warning or fail" },
    ],
  },
];

/** The scoring, on one screen. */
const SCORING = [
  { id: "profile", name: "Profile", checks: "9", weight: "30%" },
  { id: "reviews", name: "Reviews", checks: "5", weight: "25%" },
  { id: "visibility", name: "Local visibility", checks: "4", weight: "20%" },
  { id: "content", name: "Photos & content", checks: "3", weight: "15%" },
  { id: "website", name: "Website & actions", checks: "4", weight: "10%" },
];

const DELIVERABLES = [
  {
    icon: Target,
    title: "One score out of 100",
    text: "Five categories weighted into a single figure with a plain verdict — Excellent, Strong, Good, Fair or Room to grow — and the change since the last time you audited the same business.",
  },
  {
    icon: LayoutGrid,
    title: "The rank grid on a map",
    text: "Nine pins coloured by rank, your visibility, top-3 coverage and average position — plus who outranks you at every point.",
  },
  {
    icon: Users,
    title: "The competitors around you",
    text: "The listings ranking at your location with their rating, review count, category and website, and Google's own “People also search for” list.",
  },
  {
    icon: MessageSquareText,
    title: "Reviews, read properly",
    text: "Each recent review with the owner's reply, the ones that still need one flagged, the star breakdown and the topics reviewers keep mentioning.",
  },
  {
    icon: ClipboardList,
    title: "A 30-day action plan",
    text: "Days 1–7 fix the essentials, days 8–14 build trust and content, days 15–30 grow local visibility — every task tied to the check behind it.",
  },
  {
    icon: ShieldCheck,
    title: "Nothing guessed",
    text: "When Google does not return a field, the check is marked Not verified and left out of the score rather than counted as a fail.",
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
  { value: "5", label: "credits an audit" },
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
    icon: Wallet,
    title: "One balance, every tool",
    text: "The same credits run rank tracking, Maps tracking, AI visibility, site audits and keyword research.",
  },
];

const FREE_POINTS = [
  "Up to 3 audits a day",
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
    a: "5 credits: 2 for the listing and reviews and 3 for the rank grid. The listing and reviews part is free when they were fetched in the last 10 days, and the grid is free when you already have a recent scan for the same keyword. A failed audit is refunded. Free accounts can run up to 3 audits a day.",
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

/** Credits per full audit: gbp.audit (2) + the 3×3 grid's maps.scan.point (3). */
const CREDITS_PER_AUDIT = 5;

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
            <a href="#plan" className="cmpa-eyebrow">
              <b>New</b>
              A 3×3 local rank grid in every audit
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
            </a>

            <h1 className="cmpa-h1 mx-auto mt-7 max-w-[20ch] text-white">
              Find out <span className="cmpa-grad-text">why you&rsquo;re not showing up on Google Maps</span>
            </h1>

            <p className="cmpa-lead mx-auto mt-6 max-w-[62ch]">
              Paste your Google Maps link. FreeSERP audits the Business Profile in 25 checks, maps
              where you rank around your own front door, lines you up against the listings beating
              you and hands back a 30-day plan to fix it.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Cta placement="hero" label="Audit my listing free" />
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

        {/* ── the five categories ── */}
        <section id="checks" className="scroll-mt-24 pt-20 sm:pt-28">
          <div className={WRAP}>
            <SectionHead
              label="Audit"
              name="The checks"
              title="Five areas, 25 checks, one score"
              sub="Everything Google shows a searcher about your business, checked against what tends to win the map."
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
              title="Every check, and what it is worth"
              sub="Pass counts in full, a warning counts half, a fail counts nothing — then each area is weighted into the total."
            />

            <div className="cmpa-table-scroll mt-12">
              <table className="cmpa-table">
                <thead>
                  <tr>
                    <th scope="col">Area</th>
                    <th scope="col">Checks</th>
                    <th scope="col">Share of the score</th>
                  </tr>
                </thead>
                <tbody>
                  {SCORING.map((row) => (
                    <tr key={row.id}>
                      <th scope="row">{row.name}</th>
                      <td>{row.checks}</td>
                      <td className="cmpa-yes">{row.weight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-center text-[13px] text-[var(--muted)]">
              It is FreeSERP&rsquo;s score, not one Google publishes. A check Google returned no data
              for is marked Not verified and left out, never counted as a fail.
            </p>
          </div>
        </section>

        {/* ── what you get back ── */}
        <section id="plan" className="scroll-mt-24 pb-20 sm:pb-28">
          <div className={WRAP}>
            <SectionHead
              label="Output"
              name="What you get back"
              title="A report you can start fixing today"
              sub="The checks tell you what is wrong. The plan tells you what to do first."
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
                  A full audit is 5 credits, and re-running one within 10 days often costs less.
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
