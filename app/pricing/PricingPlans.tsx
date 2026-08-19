// Credit plans and top-up packs.
//
// Hardcoded rather than fetched: this is the marketing site, it renders
// statically for SEO, and a pricing page that waits on an API is a pricing page
// that flashes empty. Keep in step with the backend's credits/catalog.ts, which
// is the source of truth for what actually gets charged.
//
// Layout lives in ./pricing.css — the four-across row and its breakpoints
// cannot be expressed as inline styles.

import { AppCtaLink } from "@/components/site/AppCtaLink";

export interface CreditPlan {
  slug: string;
  label: string;
  price: number;
  credits: number;
  who: string;
  popular?: boolean;
}

export const CREDIT_PLANS: CreditPlan[] = [
  { slug: "credits-19", label: "Starter", price: 19, credits: 2_000, who: "One site, checked every day" },
  {
    slug: "credits-49",
    label: "Pro",
    price: 49,
    credits: 6_000,
    who: "Several sites, or one you work hard",
    popular: true,
  },
  { slug: "credits-99", label: "Agency", price: 99, credits: 15_000, who: "Client work and bigger keyword sets" },
];

export const TOPUP_PACKS = [
  { credits: 1_000, price: 19 },
  { credits: 5_000, price: 79 },
  { credits: 15_000, price: 199 },
];

const FREE_FEATURES = [
  "100 credits every month",
  "Every tool unlocked",
  "190+ countries, all devices",
  "No credit card required",
];

/**
 * What a balance buys, in the things people actually do. A credit count is
 * meaningless on its own — "6,000 credits" only becomes a price once you can
 * see it is 200 keywords checked every day for a month.
 */
function whatItBuys(credits: number): string[] {
  return [
    `${credits.toLocaleString()} rank checks`,
    `${Math.floor(credits / 30).toLocaleString()} keywords tracked daily`,
    `${Math.floor(credits / 17).toLocaleString()} local map grid scans`,
    `${Math.floor(credits / 5).toLocaleString()} full site audits`,
  ];
}

function Tick() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden style={{ marginTop: 3, flexShrink: 0 }}>
      <path d="M2 7L5.5 10.5L12 3.5" stroke="#0454ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** The free tier, shaped like the paid ones so the row reads as one scale. */
export function FreeCard() {
  return (
    <div className="pr-card">
      <span className="pr-tier">Free</span>
      <div className="pr-price">
        <b>$0</b>
        <span>/month</span>
      </div>
      <p className="pr-credits">100 credits a month</p>
      <p className="pr-who">Refilled automatically. No card.</p>
      <div className="pr-rule" />
      <ul className="pr-list">
        {FREE_FEATURES.map((f) => (
          <li key={f}>
            <Tick />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <AppCtaLink path="/signup" className="pr-cta">
        Start free
      </AppCtaLink>
    </div>
  );
}

export function PlanCard({ plan }: { plan: CreditPlan }) {
  return (
    <div className={`pr-card${plan.popular ? " pr-card--featured" : ""}`}>
      {plan.popular && <span className="pr-badge">Most popular</span>}
      <span className="pr-tier">{plan.label}</span>
      <div className="pr-price">
        <b>${plan.price}</b>
        <span>/month</span>
      </div>
      <p className="pr-credits">{plan.credits.toLocaleString()} credits a month</p>
      <p className="pr-who">{plan.who}</p>
      <div className="pr-rule" />
      <ul className="pr-list">
        {whatItBuys(plan.credits).map((line, i) => (
          <li key={line}>
            <Tick />
            {/* The first line is the literal conversion; the rest are
                alternatives, so they read as "or" without repeating the word. */}
            <span>
              {i > 0 && <span style={{ color: "#9ca3af" }}>or </span>}
              {line}
            </span>
          </li>
        ))}
      </ul>
      <AppCtaLink path={`/pricing?plan=${plan.slug}`} className={`pr-cta${plan.popular ? " pr-cta--primary" : ""}`}>
        Get {plan.label}
      </AppCtaLink>
    </div>
  );
}

/**
 * What a pack buys, in work rather than arithmetic.
 *
 * The per-credit price was on these cards and is gone: "$0.019 per credit"
 * makes the reader do division to find out whether a pack is worth buying, and
 * the answer it produces — three decimal places of a cent — means nothing to
 * anyone. What they actually want to know is how much tracking it covers.
 */
function packBuys(credits: number): string[] {
  return [
    `${credits.toLocaleString()} rank checks`,
    `or ${Math.floor(credits / 17).toLocaleString()} local grid scans`,
    `or ${Math.floor(credits / 5).toLocaleString()} site audits`,
  ];
}

function Arrow() {
  return (
    <svg className="pr-pack-go" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 8h9M8.5 4.5L12 8l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TopupPacks() {
  return (
    <section style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px 64px" }}>
      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 18,
          padding: "28px 28px 30px",
          boxShadow: "0 1px 2px rgba(16,24,40,.04)",
        }}
      >
        <div style={{ maxWidth: 560 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "#0b1220", letterSpacing: "-0.02em" }}>
            Need more in a busy month?
          </h3>
          <p style={{ fontSize: 14, color: "#6b7280", margin: "8px 0 0", lineHeight: 1.6 }}>
            Buy credits on top of your plan at any time. Unlike your monthly allowance, these last a
            full year — so a one-off migration or client audit doesn&apos;t force you onto a bigger plan.
          </p>
        </div>

        <div className="pr-packs">
          {TOPUP_PACKS.map((pack, i) => {
            const best = i === TOPUP_PACKS.length - 1;
            return (
              <AppCtaLink
                key={pack.credits}
                path={`/pricing?topup=${pack.credits}`}
                className={`pr-pack${best ? " pr-pack--best" : ""}`}
              >
                {best && <span className="pr-pack-badge">Best value</span>}
                <Arrow />
                <span className="pr-pack-credits">{pack.credits.toLocaleString()} credits</span>
                <span className="pr-pack-price">${pack.price} one-off</span>
                <span className="pr-pack-rule" />
                <ul className="pr-pack-buys">
                  {packBuys(pack.credits).map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </AppCtaLink>
            );
          })}
        </div>
      </div>
    </section>
  );
}
