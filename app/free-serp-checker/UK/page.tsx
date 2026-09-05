import type { Metadata } from "next";
import { Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { Check, MapPin, Quote } from "lucide-react";

import { LogoMark } from "@/components/landing/ui/Logo";
import { LazyDemoVideo } from "@/components/landing/ui/LazyDemoVideo";
import { brands } from "@/lib/landing/content";

import { Cta } from "./Cta";
import { CheckForm } from "./CheckForm";
import { UkMap } from "./UkMap";
import { VisibilityMock, RankReportMock, ThematicMock } from "./Mockups";
import { content } from "./content";
import "./ads.css";

/**
 * /free-serp-checker/UK — the paid-acquisition landing page for the UK market.
 *
 * A standalone route, NOT a locale. It is a static segment, so Next matches it
 * ahead of the sibling [lang] route, and it shares no copy and no styling with
 * the /en, /es, /fr and /nl language landers. Its words live in ./content.ts
 * and its design system in ./ads.css, so a UK campaign can be re-worded or
 * rethemed with no possibility of moving the language pages. proxy.ts exempts
 * this segment from the locale redirect that would otherwise send a UK ad click
 * to /free-serp-checker/en/UK.
 *
 * The visual language is shared with /tracking-suite and the US ad page so the
 * three read as a set: warm off-white canvas rather than white, near-black ink
 * rather than pure black, Inter 600 headings (not 800), a 1120px column, 20px
 * cards inside 40px pastel panels, and colour carried by tinted surfaces rather
 * than by coloured text. That is a deliberate break from the language landers,
 * which are white, blue-accented and set in Plus Jakarta at weight 800.
 *
 * What makes it the UK page rather than a copy of the US one: the hero leads
 * with the question the ad asks; the search-audience section is drawn against a
 * map of the UK with UK example keywords, on a local / regional / national /
 * international ladder rather than the US local / state / national split; and
 * the rank-tracking section ends in a screenshot of the real dashboard.
 *
 * Almost a pure server component, which is what keeps LCP low on a cold paid
 * click: the page ships as static HTML and the only islands are the CTA
 * buttons, the hero's domain field, and the demo clip's intersection observer.
 *
 * It renders inside the root layout, so GA4, GTM and Google Ads conversion
 * tracking are inherited — pointing an ad at this URL needs no tag setup.
 */

// Two faces, scoped to this page. Instrument Sans carries display and body;
// JetBrains Mono carries the eyebrow capsules, field labels and anything
// numeric, so data reads as data. Exposed as CSS variables rather than applied
// as classes, because ads.css needs to reach both from its own rules.
const sans = Instrument_Sans({
  variable: "--uk-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--uk-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: content.meta.title,
  description: content.meta.description,
  // Paid-traffic destination, kept out of the index on purpose — it restates
  // the /serp-checker page, and letting Google choose between them is how a
  // site ends up ranking its ad copy instead of its content. Google Ads does
  // not need the page indexed.
  robots: { index: false, follow: false },
};

const WRAP = "mx-auto w-full max-w-[1120px] px-5 sm:px-8";

export default function FreeSerpCheckerUkPage() {
  return (
    <div
      // en-GB, not "UK": the route segment is a market, and Intl would read
      // "UK" as "uk" — Ukrainian — without complaining.
      lang="en-GB"
      className={`uk-scope ${sans.variable} ${mono.variable}`}
    >
      <main>
        {/* ── hero ──────────────────────────────────────────────────────────
            The top bar carries the mark and one button, and that button is the
            conversion action rather than a way out of the page. Still no nav: a
            paid visitor arrived for one question, and a row of links up here is
            an invitation to leave before it is answered. */}
        <section className="uk-hero pt-5 pb-16 sm:pb-20">
          <div className={`${WRAP} uk-enter`}>
            <div className="uk-topbar">
              <span className="uk-wordmark">
                <LogoMark className="h-[22px] w-[22px]" />
                FreeSERP
              </span>
              <Cta
                placement="topbar"
                label={content.topbarCta}
                size="sm"
                variant="ghost"
              />
            </div>

            <h1 className="uk-h1 mx-auto mt-16 max-w-[19ch] text-center text-balance">
              {content.hero.headline1}{" "}
              <span className="uk-hero-accent">
                {content.hero.headlineHighlight}
              </span>
            </h1>

            {/* One block, not two paragraphs: the caveat is the second half of
                the same thought, and splitting it added a gap without adding a
                beat. */}
            <p className="uk-lead mx-auto mt-6 max-w-[62ch] text-center text-pretty">
              {content.hero.subheading} {content.hero.subheading2}
            </p>

            <CheckForm dict={content.check} />
          </div>
        </section>

        {/* ── the demo ──────────────────────────────────────────────────────
            Lifted out of the hero into a panel of its own, so the clip is the
            subject of a section rather than decoration under a form. The white
            shot on a tinted panel is what makes it read as floating. */}
        <section className="pb-4">
          <div className={WRAP}>
            <div
              className="uk-panel px-4 py-10 sm:px-10 sm:py-14"
              style={{ background: "var(--tint-demo)" }}
            >
              <SectionHead
                tag={content.tags.demo}
                title={content.demo.heading}
                sub={content.demo.body}
              />
              <div className="uk-window mt-10">
                <div className="uk-window-bar">freeserp.com — SERP checker</div>
                {/* The clip (WebM 0.9MB / MP4 1.7MB) is fetched only once it
                    scrolls near — see LazyDemoVideo. */}
                <LazyDemoVideo
                  label={content.hero.demoAlt}
                  className="block h-auto w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── positioning ───────────────────────────────────────────────────
            Two panels, not a table: the argument is that one of these is the
            right size for the job, and side-by-side surfaces make the size
            difference visible before a word is read. Names no competitor —
            the comparison is with the category. */}
        <section className="pt-14 sm:pt-20">
          <div className={WRAP}>
            <SectionHead
              tag={content.tags.positioning}
              title={content.positioning.heading}
            />

            <div className="uk-reveal-group mt-12 grid gap-5 lg:grid-cols-2">
              <div
                className="uk-panel p-6 sm:p-10"
                style={{ background: "var(--tint-suite)" }}
              >
                <h3 className="text-[21px] font-semibold tracking-[-0.02em] text-[var(--muted)]">
                  {content.positioning.suiteTitle}
                </h3>
                <ul className="mt-7 space-y-3.5">
                  {content.positioning.suitePoints.map((p) => (
                    <li
                      key={p}
                      className="flex gap-3 text-[16px] leading-[1.5] text-[var(--body)]"
                    >
                      <span className="uk-dash" aria-hidden>
                        &mdash;
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="uk-panel uk-panel-accent p-6 sm:p-10">
                <h3 className="text-[21px] font-semibold tracking-[-0.02em]">
                  {content.positioning.freeserpTitle}
                </h3>
                <ul className="mt-7 flex flex-col gap-3.5">
                  {content.positioning.freeserpPoints.map((p) => (
                    <li key={p} className="flex gap-3 text-[16px] leading-[1.5]">
                      <span className="uk-check">
                        <Check className="h-3 w-3 text-white" strokeWidth={3} />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-9">
                  <Cta
                    placement="positioning"
                    label={content.hero.ctaButton}
                    variant="ghost"
                    size="sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── how it works ──────────────────────────────────────────────── */}
        <section className="pt-14 sm:pt-24">
          <div className={WRAP}>
            <SectionHead
              tag={content.tags.steps}
              title={content.logoStrip.heading}
            />

            <div className="uk-reveal-group mt-12 grid gap-5 sm:grid-cols-3">
              {content.logoStrip.steps.map((s, i) => (
                <div key={s.step} className="uk-card uk-lift p-7">
                  <span data-mono className="text-[13px] font-medium text-[var(--accent)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-[20px] font-semibold tracking-[-0.02em]">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.55] text-[var(--body)]">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-12 text-center text-[13px] text-[var(--muted)]">
              {content.logoStrip.trustLine}
            </p>
            {/* The list is rendered twice so the -50% loop is seamless; the
                second pass is aria-hidden so the brands are announced once. */}
            <div className="uk-ticker mt-7">
              <div className="uk-ticker-track">
                {[0, 1].map((pass) =>
                  brands.map((b) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={`${pass}-${b.name}`}
                      src={b.logo}
                      alt={pass === 0 ? b.name : ""}
                      aria-hidden={pass === 1 || undefined}
                      className={pass === 1 ? "uk-ticker-dup" : undefined}
                      width={b.w}
                      height={b.h}
                      loading="lazy"
                      decoding="async"
                    />
                  )),
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── what you get ──────────────────────────────────────────────────
            Three alternating rows, each a claim beside the part of the product
            that backs it. Alternating rather than stacked so the eye has
            somewhere to go over three full-width sections, and the mockups are
            built from the same content.ts values as the copy beside them, so
            the two can never drift. */}
        <section className="pt-14 sm:pt-24">
          <div className={WRAP}>
            <FeatureRow
              tag={content.tags.reports}
              heading={content.visibility.heading}
              bullets={content.visibility.bullets}
              tint="var(--tint-freeserp)"
              visual={<VisibilityMock dict={content.visibility} />}
            />

            <FeatureRow
              heading={content.competitors.heading}
              bullets={content.competitors.bullets}
              tint="var(--tint-suite)"
              visual={<RankReportMock dict={content.competitors} />}
              flip
            />

            <FeatureRow
              heading={content.thematic.heading2}
              bullets={content.thematic.bullets}
              tint="var(--tint-audiences)"
              visual={<ThematicMock dict={content.thematic} />}
            />
          </div>
        </section>

        {/* ── search audiences ──────────────────────────────────────────────
            The UK differentiator: one website, four different SERPs, drawn
            against the market it is talking about. */}
        <section className="pt-14 sm:pt-24">
          <div className={WRAP}>
            <div
              className="uk-panel px-5 py-10 sm:px-12 sm:py-14"
              style={{ background: "var(--tint-audiences)" }}
            >
              <div className="uk-reveal-group grid items-center gap-12 md:grid-cols-[280px_1fr] md:gap-16">
                <div className="flex justify-center">
                  <UkMap
                    alt={content.audiences.map.alt}
                    localPin={content.audiences.map.localPin}
                    regionalPin={content.audiences.map.regionalPin}
                    ladder={content.audiences.map.ladder}
                  />
                </div>

                <div>
                  <span className="uk-tag">{content.tags.audiences}</span>
                  <h2 className="uk-h3 mt-5 max-w-[18ch] text-balance">
                    {content.audiences.heading}
                  </h2>

                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    {content.audiences.tiers.map((t) => (
                      <div
                        key={t.tier}
                        className="rounded-[18px] border border-white bg-white/70 px-4 py-3.5"
                      >
                        <div className="flex items-center gap-1.5 text-[12.5px] font-medium tracking-[0.04em] text-[var(--muted)] uppercase">
                          <MapPin className="h-3.5 w-3.5" />
                          {t.tier}
                        </div>
                        <p className="mt-1.5 text-[15px] leading-[1.4]">
                          &ldquo;{t.example}&rdquo;
                        </p>
                      </div>
                    ))}
                  </div>

                  <p className="mt-7 text-[16px] leading-[1.55] text-pretty text-[var(--body)]">
                    {content.audiences.outro}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── stats ─────────────────────────────────────────────────────────
            The one dark surface before the CTA, so the page has a floor. */}
        <section className="pt-14 sm:pt-24">
          <div className={WRAP}>
            <div className="uk-reveal-group uk-on-dark uk-panel grid grid-cols-1 gap-y-10 bg-[var(--ink)] px-6 py-10 text-white sm:grid-cols-3 sm:px-12 sm:py-12">
              {content.stats.items.map((s) => (
                <div key={s.n} className="text-center">
                  <div data-mono className="text-[34px] leading-none font-semibold tracking-[-0.03em] sm:text-[44px]">
                    {s.n}
                  </div>
                  <p className="mx-auto mt-3.5 max-w-[24ch] text-[14px] leading-[1.5] text-white/70">
                    <span className="text-white">{s.bold}</span> {s.rest}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── after the check ───────────────────────────────────────────────
            Where the one-off check becomes a dashboard habit. Ends in the real
            product rather than another diagram — the UK brief asked for the
            actual dashboard, and it is the last thing seen before the CTA. */}
        <section className="pt-14 sm:pt-24">
          <div className={WRAP}>
            <div
              className="uk-panel px-5 py-10 sm:px-12 sm:py-14"
              style={{ background: "var(--tint-journey)" }}
            >
              <SectionHead
                tag={content.tags.journey}
                title={content.journey.heading}
                sub={content.journey.body}
              />

              <ol className="uk-reveal-group mt-11 flex flex-col items-stretch gap-2.5 sm:flex-row sm:justify-center">
                {content.journey.steps.map((step, i) => (
                  <li
                    key={step}
                    className="flex flex-1 items-center justify-center gap-3 rounded-[18px] border border-white bg-white/70 px-6 py-4 sm:max-w-[200px] sm:flex-col sm:gap-2"
                  >
                    <span data-mono className="text-[12px] font-medium text-[var(--accent)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[17px] font-semibold tracking-[-0.02em]">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>

              <TrackerMock dict={content.journey.tracker} />
            </div>
          </div>
        </section>

        {/* ── proof ─────────────────────────────────────────────────────── */}
        <section className="pt-14 sm:pt-24">
          <div className={WRAP}>
            <SectionHead
              tag={content.tags.proof}
              title={`${content.stats.headingLine1} ${content.stats.headingLine2}`}
            />
            <figure className="uk-reveal uk-card mx-auto mt-10 max-w-[820px] p-6 sm:mt-12 sm:p-10">
              <Quote
                className="h-7 w-7 text-[var(--line)]"
                aria-hidden
                strokeWidth={2}
              />
              <blockquote className="mt-5 text-[19px] leading-[1.5] tracking-[-0.01em] text-pretty sm:text-[22px]">
                {content.testimonial.quote}
              </blockquote>
              <figcaption className="mt-7 flex flex-wrap items-center justify-between gap-6 border-t border-[var(--line)] pt-6">
                <div>
                  <div className="text-[15px] font-semibold">
                    {content.testimonial.name}
                  </div>
                  <div className="text-[14px] text-[var(--muted)]">
                    {content.testimonial.role}
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-8 gap-y-4">
                  <Stat
                    value={content.testimonial.stat1Val}
                    label={content.testimonial.stat1Label}
                  />
                  <Stat
                    value={content.testimonial.stat2Val}
                    label={content.testimonial.stat2Label}
                  />
                </div>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ── closing CTA ───────────────────────────────────────────────── */}
        <section className="pt-14 pb-12 sm:pt-24 sm:pb-16">
          <div className={WRAP}>
            <div className="uk-reveal uk-on-dark uk-panel bg-[var(--ink)] px-5 py-12 text-center text-white sm:px-12 sm:py-20">
              <LogoMark className="mx-auto h-10 w-10" />
              <h2 className="uk-h2 mx-auto mt-6 max-w-[16ch] text-balance">
                {content.finalCta.heading}
              </h2>
              <p className="mx-auto mt-5 max-w-[52ch] text-[16px] leading-[1.6] text-pretty text-white/70">
                {content.finalCta.body}
              </p>
              <div className="mt-9">
                <Cta
                  placement="final_cta"
                  label={content.finalCta.button}
                  variant="ghost"
                />
              </div>
              <p className="mt-6 text-[13.5px] text-white/55">
                {content.check.disclaimer}
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="pb-12">
        <div
          className={`${WRAP} flex flex-wrap items-center justify-between gap-4 text-[13px] text-[var(--muted)]`}
        >
          <span>{content.finalCta.copyright}</span>
          <div className="flex flex-wrap gap-6">
            <a href="/terms" className="hover:text-[var(--ink)]">
              {content.finalCta.legal}
            </a>
            <a href="/privacy" className="hover:text-[var(--ink)]">
              {content.finalCta.privacy}
            </a>
            <a href="/privacy" className="hover:text-[var(--ink)]">
              {content.finalCta.doNotSell}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PIECES
   ══════════════════════════════════════════════════════════════════════════ */

function SectionHead({
  tag,
  title,
  sub,
}: {
  tag: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="uk-reveal mx-auto max-w-[66ch] text-center">
      <span className="uk-tag">{tag}</span>
      <h2 className="uk-h2 mt-5 text-balance">{title}</h2>
      {sub && (
        <p className="uk-lead mx-auto mt-4 max-w-[58ch] text-pretty">{sub}</p>
      )}
    </div>
  );
}

/**
 * One claim beside one mockup. `flip` puts the mockup on the right; the rows
 * alternate so three of them in a column do not read as a list. On a phone the
 * grid collapses and the mockup always comes first, because the picture is what
 * earns the scroll past the heading.
 */
function FeatureRow({
  tag,
  heading,
  bullets,
  visual,
  tint,
  flip = false,
}: {
  tag?: string;
  heading: string;
  bullets: string[];
  visual: React.ReactNode;
  tint: string;
  flip?: boolean;
}) {
  return (
    <div className="uk-reveal grid items-center gap-8 py-8 md:grid-cols-2 md:gap-14 md:py-10">
      <div
        className={`uk-panel p-5 sm:p-8 ${flip ? "md:order-2" : ""}`}
        style={{ background: tint }}
      >
        {visual}
      </div>

      <div className={flip ? "md:order-1" : ""}>
        {tag && <span className="uk-tag mb-5 inline-flex">{tag}</span>}
        <h3 className="uk-h3 max-w-[16ch] text-balance">{heading}</h3>
        <ul className="mt-6 space-y-3.5">
          {bullets.map((b) => (
            <Point key={b}>{b}</Point>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Point({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 text-[15px] leading-[1.5] text-[var(--body)]">
      <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--accent)_14%,#fff)]">
        <Check
          className="h-2.5 w-2.5 text-[var(--accent)]"
          strokeWidth={3}
          aria-hidden
        />
      </span>
      {children}
    </li>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div data-mono className="text-[19px] font-semibold text-[var(--accent)]">{value}</div>
      <div data-mono className="max-w-[16ch] text-[10.5px] leading-[1.4] tracking-[0.1em] uppercase text-[var(--muted)]">
        {label}
      </div>
    </div>
  );
}

/**
 * The rank tracker, drawn rather than screenshotted.
 *
 * It replaces a 200KB PNG of the real dashboard: at the size this sits on the
 * page, a screenshot is unreadable anyway, and a drawn panel stays sharp,
 * costs nothing to load, and reads its figures from content.ts like every
 * other mockup here. The bar length is derived from the position beside it —
 * #1 full, #20 empty — so the picture cannot disagree with the number.
 */
function TrackerMock({
  dict,
}: {
  dict: { chrome: string; rows: { keyword: string; position: number }[] };
}) {
  return (
    <div className="uk-reveal uk-window mx-auto mt-12 max-w-[820px]">
      <div className="uk-window-bar">{dict.chrome}</div>
      <div className="px-5 py-2 sm:px-7 sm:py-3">
        {dict.rows.map((r) => (
          <div
            key={r.keyword}
            className="flex items-center gap-4 border-b border-[var(--line)] py-3.5 last:border-b-0 sm:gap-6"
          >
            <span className="min-w-0 flex-1 truncate text-[14px]">
              {r.keyword}
            </span>
            <span className="uk-bar-track hidden max-w-[140px] sm:block">
              <span
                className="uk-bar-fill block"
                style={{ width: `${Math.max(8, 100 - (r.position - 1) * 5)}%` }}
              />
            </span>
            <span
              data-mono
              className="w-9 shrink-0 text-right text-[13px] font-medium text-[var(--muted)]"
            >
              #{r.position}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
