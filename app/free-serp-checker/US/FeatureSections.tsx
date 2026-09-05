import { CheckCircle2 } from "lucide-react";

import { content } from "./content";

/**
 * The three report sections, each a claim beside a drawn mockup of the thing it
 * claims. Ported from the language landers' FeatureVisibility /
 * FeatureCompetitors / FeatureThematic into this page's system: same figures
 * and same copy, restyled onto the ads.css tokens and this page's type scale.
 *
 * They live here rather than in components/landing/ because they are drawn to
 * this page's palette — nothing else on the site should depend on them.
 *
 * The mockups are pure CSS and SVG, not screenshots: they stay sharp at any
 * width, cost no image requests, and their numbers come from content.ts so the
 * figures and the prose can never drift apart.
 *
 * Hue is used in exactly one way here — semantically, inside the data. A gain
 * is green, a loss is red, an unchanged value is grey. Everything structural is
 * ink, accent or a panel wash.
 */

/** Radial meter. A conic gradient filled to `pct`, with a white centre hole. */
function Ring({
  pct,
  color,
  children,
}: {
  pct: string;
  color: string;
  children?: React.ReactNode;
}) {
  const target = parseInt(pct) || 0;
  return (
    <div
      className="us-ring mx-auto flex h-[84px] w-[84px] items-center justify-center rounded-full sm:h-32.5 sm:w-32.5"
      // --us-ring-fill is set to the FINAL value here, not 0%. The sweep
      // animation overrides it from 0 where it is supported; where it is not,
      // this inline value is what keeps the ring rendered correctly.
      style={
        {
          "--us-ring-color": color,
          "--us-ring-target": `${target}%`,
          "--us-ring-fill": `${target}%`,
        } as React.CSSProperties
      }
    >
      <div className="flex h-[62px] w-[62px] flex-col items-center justify-center rounded-full bg-white sm:h-24 sm:w-24">
        <span className="text-[17px] font-medium tracking-[-0.03em] tabular-nums sm:text-[26px]">
          {target}%
        </span>
        {children}
      </div>
    </div>
  );
}

/** The compact ring used by the thematic grid, with its % set beside it. */
function MiniRing({ pct, color }: { pct: string; color: string }) {
  const target = parseInt(pct) || 0;
  return (
    <>
      <div
        className="us-ring flex h-7 w-7 shrink-0 items-center justify-center rounded-full sm:h-8.5 sm:w-8.5"
        style={
          {
            "--us-ring-color": color,
            "--us-ring-target": `${target}%`,
            "--us-ring-fill": `${target}%`,
          } as React.CSSProperties
        }
      >
        <div className="h-4.5 w-4.5 rounded-full bg-white sm:h-5.5 sm:w-5.5" />
      </div>
      <span className="text-sm font-medium tabular-nums sm:text-[17px]">
        {target}%
      </span>
    </>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 flex flex-col gap-4">
      {items.map((b) => (
        <li
          key={b}
          className="flex gap-3 text-[16px] leading-[1.55] text-[var(--body)]"
        >
          <CheckCircle2
            className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]"
            aria-hidden
          />
          <span>{b}</span>
        </li>
      ))}
    </ul>
  );
}

/** The tinted frame every mockup sits in. */
function Frame({
  tint,
  children,
}: {
  tint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="us-rise us-panel p-5 sm:p-8" style={{ background: tint }}>
      <div className="us-card p-5 shadow-[0_20px_40px_-28px_rgba(14,15,12,0.3)] sm:p-7">
        {children}
      </div>
    </div>
  );
}

export function FeatureVisibility() {
  const d = content.visibility;
  return (
    <section className="pt-20 sm:pt-24">
      <div className="us-wrap">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-[1.05fr_1fr] md:gap-14">
          <Frame tint="var(--tint-report)">
            <div className="grid grid-cols-2 gap-3 sm:gap-5">
              <div className="text-center">
                <div className="mb-3.5 text-[13px] font-medium sm:text-[15px]">
                  {d.visibilityScore}
                </div>
                <Ring pct={d.scorePct} color="var(--accent)">
                  <span className="text-[11px] font-medium text-[var(--data-up)]">
                    {d.visibilityDelta}
                  </span>
                </Ring>
              </div>
              <div className="text-center">
                <div className="mb-3.5 text-[13px] font-medium sm:text-[15px]">
                  {d.top10Coverage}
                </div>
                <Ring pct={d.coveragePct} color="var(--data-warn)">
                  <span className="text-[11px] font-medium text-[var(--data-flat)]">
                    {d.noChange}
                  </span>
                </Ring>
              </div>
            </div>

            <div className="mt-[22px] flex flex-col gap-[11px]">
              <div className="text-[13px] font-medium">{d.trackedKeywords}</div>
              {d.trackedRows.map((t) => (
                <div key={t.label} className="flex justify-between text-sm">
                  <span className="flex items-center gap-[9px] text-[var(--body)]">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: t.color }}
                      aria-hidden
                    />
                    {t.label}
                  </span>
                  <span className="font-medium tabular-nums">{t.val}</span>
                </div>
              ))}
            </div>
          </Frame>

          <div className="us-rise">
            <h2 className="us-h3">{d.heading}</h2>
            <Bullets items={d.bullets} />
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeatureCompetitors() {
  const d = content.competitors;
  return (
    <section className="pt-20 sm:pt-24">
      <div className="us-wrap">
        {/* Text first on mobile, mockup first on desktop — the sections
            alternate sides so the page does not read as a column of cards. */}
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-[1fr_1.05fr] md:gap-14">
          <div className="us-rise order-2 md:order-1">
            <h2 className="us-h3">{d.heading}</h2>
            <Bullets items={d.bullets} />
          </div>

          <div className="order-1 md:order-2">
            <Frame tint="var(--tint-report)">
              <div className="mb-[18px] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="us-h4 whitespace-nowrap">{d.rankReport}</span>
                <div className="flex flex-wrap gap-1.5">
                  {d.filters.map((f, i) => (
                    <span
                      key={f}
                      className={
                        i === 0
                          ? "rounded-lg bg-[color-mix(in_srgb,var(--accent)_10%,#fff)] px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-[var(--accent)] tabular-nums"
                          : "rounded-lg bg-[var(--canvas)] px-2.5 py-1.5 text-xs whitespace-nowrap text-[var(--body)] tabular-nums"
                      }
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-2 text-[12.5px] font-medium tracking-[0.04em] text-[var(--muted)]">
                {d.movement}
              </div>

              <div className="flex flex-col">
                {d.issueRows.map((r) => (
                  <div
                    key={r.lead}
                    className="flex justify-between gap-3 border-b border-[var(--line)] py-[11px] text-sm"
                  >
                    <span className="text-[var(--body)]">
                      <span className="font-medium text-[var(--ink)] tabular-nums">
                        {r.lead}
                      </span>{" "}
                      {r.rest}
                    </span>
                    {/* Not a link: this is a drawing of the product, and a real
                        anchor here would be a dead end on a landing page. */}
                    <span className="text-[13px] font-medium whitespace-nowrap text-[var(--accent)]">
                      {d.view}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 rounded-xl bg-[var(--tint-report)] p-4 sm:grid-cols-2">
                <div>
                  <div className="text-xs font-medium">{d.aboutTitle}</div>
                  <div className="mt-1.5 text-[12.5px] leading-[1.5] text-[var(--body)]">
                    {d.aboutBody}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium">{d.respondTitle}</div>
                  <div className="mt-1.5 text-[12.5px] leading-[1.5] text-[var(--body)]">
                    {d.respondBody}
                  </div>
                </div>
              </div>
            </Frame>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeatureThematic() {
  const d = content.thematic;
  return (
    <section className="pt-20 sm:pt-24">
      <div className="us-wrap">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-[1.05fr_1fr] md:gap-14">
          <Frame tint="var(--tint-report)">
            <div className="mb-[18px] us-h4">{d.heading}</div>
            {/* No us-rise-group here: this grid sits inside a Frame that is
                already a us-rise, and nesting one scroll timeline inside
                another leaves the inner elements stranded part-way through
                their fade — faded labels sitting high in their tiles. The
                Frame animating as a whole is the effect that was wanted. */}
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
              {d.items.map((t) => (
                <div
                  key={t.label}
                  className="flex h-full flex-col rounded-xl border border-[var(--line)] p-3 sm:p-3.5"
                >
                  {/* leading-[1.3] rather than a min-height: labels that wrap to
                      two lines ("Competitor Gaps") then set their own height,
                      and mt-auto below keeps every ring on the same baseline
                      across the row regardless. */}
                  <div className="text-[12px] leading-[1.3] text-[var(--muted)]">
                    {t.label}
                  </div>
                  <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-3 sm:flex-nowrap">
                    <MiniRing pct={t.pct} color="var(--accent)" />
                    {t.delta && (
                      <span
                        className="text-[11px] font-medium"
                        style={{
                          color: t.positive
                            ? "var(--data-up)"
                            : "var(--data-down)",
                        }}
                      >
                        {t.delta}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Frame>

          <div className="us-rise">
            <h2 className="us-h3">{d.heading2}</h2>
            <Bullets items={d.bullets} />
          </div>
        </div>
      </div>
    </section>
  );
}
