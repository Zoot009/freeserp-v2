import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { Check, X } from "lucide-react";

import { LazyDemoVideo } from "@/components/landing/ui/LazyDemoVideo";
import { SerpForm } from "@/components/serp-checker/SerpForm";
import { brands } from "@/lib/landing/content";

import { Cta } from "./Cta";
import { UsMap } from "./UsMap";
import {
  FeatureVisibility,
  FeatureCompetitors,
  FeatureThematic,
} from "./FeatureSections";
import { content } from "./content";
import "./ads.css";

/**
 * /free-serp-checker/US — the paid-acquisition landing page for the US market.
 *
 * A standalone route, NOT a locale. It is a static segment, so Next matches it
 * ahead of the sibling [lang] route, and it shares no copy and no styling with
 * the /en, /es, /fr and /nl language landers. Its words live in ./content.ts
 * and its design system in ./ads.css. proxy.ts exempts this segment from the
 * locale redirect that would otherwise send a US ad click to
 * /free-serp-checker/en/US.
 *
 * The layout is left-aligned and rule-separated: a mono eyebrow, a large
 * Archivo heading run slightly wide on its width axis, and — where a section
 * needs explaining — a sentence in a second column beside the heading rather
 * than centred beneath it. Colour appears as whole surfaces (one solid accent
 * panel per screenful at most), never as coloured body text.
 *
 * Almost a pure server component, which keeps LCP low on a cold paid click:
 * the page ships as static HTML and the only islands are the CTA buttons and
 * the checker form.
 *
 * It renders inside the root layout, so GA4, GTM and Google Ads conversion
 * tracking are inherited — pointing an ad at this URL needs no tag setup.
 */

// Archivo with its width axis, which the root layout's instance does not have:
// that one is a set of static weights, so font-stretch against it would do
// nothing. Headings here run 106–112% wide, which is what carries the display
// type without pushing the weight to 800. Geist Mono for the eyebrows comes
// from the root layout's --font-geist-mono and costs no extra fetch.
const archivo = Archivo({
  variable: "--font-archivo-us",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

export const metadata: Metadata = {
  title: content.meta.title,
  description: content.meta.description,
  // Paid-traffic destination, kept out of the index on purpose — it restates
  // the /serp-checker page, and letting Google choose between them is how a
  // site ends up ranking its ad copy instead of its content.
  robots: { index: false, follow: false },
};

const WRAP = "us-wrap";

export default function FreeSerpCheckerUsPage() {
  return (
    <div className={`us-scope ${archivo.variable}`}>
      <header className={WRAP}>
        <div className="us-nav">
          <span className="us-nav-brand">
            <span className="us-nav-mark" aria-hidden>
              F
            </span>
            FreeSERP
          </span>
          <div className="flex items-center gap-5">
            <span className="us-eyebrow hidden sm:inline-flex">
              {content.nav.credits}
            </span>
            <Cta placement="nav" label={content.nav.cta} size="sm" />
          </div>
        </div>
      </header>

      <main>
        {/* ── hero ────────────────────────────────────────────────────────
            Left-aligned and full-width: the headline is the largest thing on
            the page and centring it would waste the measure it needs. */}
        <section className="pt-10 pb-14 sm:pt-16 sm:pb-20">
          <div className={`${WRAP} us-hero-in`}>
            <span className="us-eyebrow us-eyebrow-accent">
              {content.hero.eyebrow}
              <span aria-hidden>·</span>
              {content.hero.market}
            </span>

            <h1 className="us-h1 mt-6 max-w-[15ch]">
              {content.hero.headline1} {content.hero.headlineHighlight}
            </h1>

            <p className="us-lead mt-7 max-w-[54ch]">{content.hero.subheading}</p>
            <p className="us-lead mt-1.5 max-w-[54ch]">
              {content.hero.subheading2}
            </p>

            <div className="mt-9">
              <SerpForm submitLabel={content.hero.submitLabel} />
            </div>

            <span className="us-note">{content.hero.disclaimer}</span>
          </div>
        </section>

        {/* ── the demo ────────────────────────────────────────────────────
            The clip is the section: the heading only exists to introduce it.
            It is the one moving image on the page and is fetched lazily — see
            LazyDemoVideo, which withholds the <source> until the element is
            near the viewport, because autoplay otherwise overrides
            preload="none" and pulls ~1MB on initial load. */}
        <section className="pt-10 sm:pt-14">
          <div className={WRAP}>
            <SectionHead
              className="us-rise"
              eyebrow={content.tags.demo}
              title={content.demo.heading}
              sub={content.demo.body}
            />
            <div className="us-rise us-card mt-10 overflow-hidden">
              <LazyDemoVideo
                label={content.hero.demoAlt}
                className="block h-auto w-full"
              />
            </div>
          </div>
        </section>

        {/* ── positioning ───────────────────────────────────────────────────
            Two surfaces, not two tinted washes: the category is an outline and
            FreeSERP is the solid accent. The size of the argument is visible
            before a word of it is read. */}
        <section className="pt-16 sm:pt-20">
          <div className={WRAP}>
            <SectionHead
              className="us-rise"
              eyebrow={content.tags.positioning}
              title={content.positioning.heading}
            />

            <div className="us-rise-group mt-10 grid gap-5 lg:grid-cols-[1fr_1.15fr]">
              <div className="us-outline p-7 sm:p-9">
                <h3 className="us-h4 text-[var(--muted)]">
                  {content.positioning.suiteTitle}
                </h3>
                <ul className="mt-6 space-y-3.5">
                  {content.positioning.suitePoints.map((p) => (
                    <li
                      key={p}
                      className="flex items-start gap-3 text-[15.5px] leading-[1.5] text-[var(--body)]"
                    >
                      <X
                        className="mt-1 h-3.5 w-3.5 shrink-0 text-[var(--muted)]"
                        strokeWidth={2.6}
                        aria-hidden
                      />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="us-solid p-7 sm:p-9">
                <h3 className="us-h4">{content.positioning.freeserpTitle}</h3>
                <ul className="mt-6 grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
                  {content.positioning.freeserpPoints.map((p) => (
                    <li
                      key={p}
                      className="flex items-start gap-3 text-[15.5px] leading-[1.5]"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0"
                        strokeWidth={2.6}
                        aria-hidden
                      />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── how it works ────────────────────────────────────────────────
            A rule, then three numbered columns. The numbers are mono so they
            read as steps rather than as headings of their own. */}
        <section className="pt-16 sm:pt-20">
          <div className={WRAP}>
            <SectionHead
              className="us-rise"
              eyebrow={content.tags.steps}
              title={content.logoStrip.heading}
            />

            <hr className="us-rule mt-10" />

            <div className="us-rise-group grid gap-10 pt-9 sm:grid-cols-3 sm:gap-8">
              {content.logoStrip.steps.map((s, i) => (
                <div key={s.step}>
                  <span className="us-mono text-[12px] font-medium text-[var(--accent)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="us-h4 mt-3">{s.title}</h3>
                  <p className="mt-2.5 text-[15px] leading-[1.55] text-[var(--body)]">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>

            <p className="us-eyebrow mt-14 flex justify-center text-center">
              {content.logoStrip.trustLine}
            </p>
            {/* The list is rendered twice so the -50% loop is seamless; the
                second pass is aria-hidden so the brands are announced once.
                Sizing is in ads.css, which caps both dimensions — these files
                have very different intrinsic aspects, and capping height alone
                renders one logo several times the width of its neighbour. */}
            <div className="us-ticker mt-6">
              <div className="us-ticker-track">
                {[0, 1].map((pass) =>
                  brands.map((b) => (
                    /* Local SVGs at fixed intrinsic size: the next/image
                       pipeline buys nothing here. */
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={`${pass}-${b.name}`}
                      src={b.logo}
                      alt={pass === 0 ? b.name : ""}
                      aria-hidden={pass === 1 || undefined}
                      className={pass === 1 ? "us-ticker-dup" : undefined}
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

        {/* ── the reports ─────────────────────────────────────────────────
            Three claims, each beside a drawn mockup of the thing it claims.
            See ./FeatureSections.tsx — the figures are CSS and SVG, not
            screenshots, and their numbers come from content.ts. */}
        <FeatureVisibility />
        <FeatureCompetitors />
        <FeatureThematic />

        {/* ── search markets ────────────────────────────────────────────── */}
        <section className="pt-16 sm:pt-20">
          <div className={WRAP}>
            <SectionHead
              className="us-rise"
              eyebrow={content.tags.markets}
              title={content.markets.heading}
              sub={content.markets.outro}
            />

            <div className="mt-10 grid items-center gap-10 md:grid-cols-[300px_1fr] md:gap-14">
              <div className="us-rise flex justify-center">
                <UsMap
                  alt={content.markets.map.alt}
                  localPin={content.markets.map.localPin}
                  statePin={content.markets.map.statePin}
                />
              </div>

              <div>
                <p className="us-eyebrow">{content.markets.intro}</p>
                <div className="us-rise-group mt-5 grid gap-3 sm:grid-cols-2">
                  {content.markets.tiers.map((t) => (
                    <div key={t.tier} className="us-lift us-card p-4">
                      <div className="us-mono text-[11.5px] font-medium tracking-[0.12em] text-[var(--accent)] uppercase">
                        {t.tier}
                      </div>
                      <p className="mt-2 text-[15px] leading-[1.4]">
                        &ldquo;{t.example}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── stats ───────────────────────────────────────────────────────
            Ruled top and bottom, left-aligned. No dark panel: the hairlines do
            the separating that a filled block used to. */}
        <section className="pt-16 sm:pt-20">
          <div className={WRAP}>
            <hr className="us-rule" />
            <div className="us-rise-group grid gap-10 py-10 sm:grid-cols-3 sm:gap-8">
              {content.stats.items.map((s) => (
                <div key={s.n}>
                  <div className="us-h2">{s.n}</div>
                  <p className="mt-3 max-w-[26ch] text-[14.5px] leading-[1.5] text-[var(--body)]">
                    <span className="font-semibold text-[var(--ink)]">
                      {s.bold}
                    </span>{" "}
                    {s.rest}
                  </p>
                </div>
              ))}
            </div>
            <hr className="us-rule" />
          </div>
        </section>

        {/* ── after the check ───────────────────────────────────────────── */}
        <section className="pt-16 sm:pt-20">
          <div className={WRAP}>
            <SectionHead
              className="us-rise"
              eyebrow={content.tags.journey}
              title={content.journey.heading}
              sub={content.journey.body}
            />

            <ol className="us-rise-group mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {content.journey.steps.map((step, i) => (
                <li
                  key={step}
                  className="us-lift us-card flex items-center gap-3 px-5 py-4"
                >
                  <span className="us-mono text-[12px] font-medium text-[var(--accent)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="us-h4">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── proof ───────────────────────────────────────────────────────
            The quote carries the argument; the two figures beside it are the
            evidence, one on the solid accent and one outlined. */}
        <section className="pt-16 sm:pt-20">
          <div className={WRAP}>
            <SectionHead
              className="us-rise"
              eyebrow={content.tags.proof}
              title={`${content.stats.headingLine1} ${content.stats.headingLine2}`}
            />

            <div className="us-rise-group mt-10 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
              <figure className="us-card flex flex-col p-7 sm:p-9">
                <span className="us-mono text-[18px] leading-none text-[var(--muted)]">
                  &rdquo;
                </span>
                <blockquote className="mt-5 text-[17px] leading-[1.55] text-pretty">
                  {content.testimonial.quote}
                </blockquote>
                <figcaption className="mt-auto flex flex-wrap items-baseline gap-x-3 pt-8">
                  <span className="text-[15px] font-semibold">
                    {content.testimonial.name}
                  </span>
                  <span className="text-[14px] text-[var(--muted)]">
                    {content.testimonial.role}
                  </span>
                </figcaption>
              </figure>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                <div className="us-solid p-7">
                  <div className="us-h3">{content.testimonial.stat1Val}</div>
                  <p className="mt-1.5 text-[14px]">
                    {content.testimonial.stat1Label}
                  </p>
                </div>
                <div className="us-outline p-7">
                  <div className="us-h3">{content.testimonial.stat2Val}</div>
                  <p className="mt-1.5 text-[14px] text-[var(--body)]">
                    {content.testimonial.stat2Label}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── closing CTA ───────────────────────────────────────────────── */}
        <section className="pt-16 pb-16 sm:pt-20">
          <div className={WRAP}>
            <div className="us-rise us-solid px-7 py-14 sm:px-12 sm:py-16">
              <h2 className="us-h2 max-w-[16ch]">{content.finalCta.heading}</h2>
              <p className="mt-5 max-w-[52ch] text-[16px] leading-[1.6] text-pretty text-white/80">
                {content.finalCta.body}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <Cta
                  placement="final_cta"
                  label={content.finalCta.button}
                  variant="onsolid"
                />
                <span className="us-mono text-[12px] tracking-[0.1em] text-white/70 uppercase">
                  {content.hero.disclaimer}
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="pb-12">
        <div className={WRAP}>
          <hr className="us-rule mb-6" />
          <div className="flex flex-wrap items-center justify-between gap-4 text-[13px] text-[var(--muted)]">
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
        </div>
      </footer>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PIECES
   ══════════════════════════════════════════════════════════════════════════ */

/**
 * Eyebrow, heading, and — when a section needs a sentence of explanation — that
 * sentence in a second column beside the heading rather than centred under it.
 * Without `sub` it collapses to a single left-aligned column.
 */
function SectionHead({
  eyebrow,
  title,
  sub,
  className = "",
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <span className="us-eyebrow">{eyebrow}</span>
      <div
        className={
          sub
            ? "mt-4 grid items-end gap-x-12 gap-y-4 md:grid-cols-[1.35fr_1fr]"
            : "mt-4"
        }
      >
        <h2 className="us-h2 max-w-[20ch] text-balance">{title}</h2>
        {sub && (
          <p className="us-lead max-w-[46ch] text-pretty md:pb-1.5">{sub}</p>
        )}
      </div>
    </div>
  );
}
