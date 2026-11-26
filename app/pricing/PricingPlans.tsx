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

/**
 * One purchasable size of a plan. The backend plan slugs are
 * `${slug}-monthly` and `${slug}-annual` (see planSlug).
 */
export interface PlanSize {
  slug: string;
  credits: number;
  /** Monthly billing, $ per month — what it renews at. */
  price: number;
  /** Annual billing, $ per month (charged as 12× up front). */
  annual: number;
  /** Monthly billing, the first month's price for a first-time subscriber. */
  intro?: number;
}

export const planSlug = (size: PlanSize, annual: boolean) => `${size.slug}-${annual ? "annual" : "monthly"}`;

export interface CreditPlan extends PlanSize {
  label: string;
  who: string;
  popular?: boolean;
  /** A credit-size picker on the card; the first size is the plan's own. */
  sizes?: PlanSize[];
}

export const CREDIT_PLANS: CreditPlan[] = [
  { slug: "starter", label: "Starter", price: 9, annual: 9, credits: 120, who: "For first-time SEO tracking" },
  {
    slug: "pro",
    label: "Pro",
    price: 49,
    annual: 25,
    intro: 35,
    credits: 1_000,
    who: "For everyday SEO work",
    popular: true,
  },
  {
    slug: "agency-3k",
    label: "Agency",
    price: 129,
    annual: 45,
    intro: 75,
    credits: 3_000,
    who: "For client work and bigger keyword sets",
    sizes: [
      { slug: "agency-3k", credits: 3_000, price: 129, annual: 45, intro: 75 },
      { slug: "agency-6k", credits: 6_000, price: 258, annual: 83, intro: 142 },
      { slug: "agency-9k", credits: 9_000, price: 387, annual: 117, intro: 205 },
    ],
  },
];

/** $1 a month, paid yearly — annual-only, so it is not shown on the monthly view. */
export const LITE_PLAN = { slug: "lite-annual", label: "Lite", annual: 1, credits: 100 };

/** The free plan lasts this long (backend credits.refill FREE_PLAN_MONTHS). */
export const FREE_MONTHS = 3;

/** Any amount in range, subscribers only, lasts a month (backend catalog TOPUP). */
export const TOPUP = { min: 5, creditsPerDollar: 50, presets: [5, 100, 200, 500, 1_000] };

/**
 * What a balance buys, in the things people actually do. A credit count is
 * meaningless on its own — "6,000 credits" only becomes a price once you can
 * see it is 40 keywords checked every day for a month.
 */
export function whatItBuys(credits: number): string[] {
  return (
    [
      [5, "rank checks"],
      [150, "keywords tracked daily"],
      [415, "local map grid scans"], // an 11×11 grid
      [500, "100-page site audits"], // 5 credits a page
    ] as const
  )
    .filter(([cost]) => credits >= cost) // "0 site audits" is not a selling point
    .map(([cost, what]) => `${Math.floor(credits / cost).toLocaleString()} ${what}`);
}

/**
 * Top-ups: any amount on top of a plan. Shown as what each quick amount buys,
 * linking into the app's top-up box, where the amount is actually chosen.
 */
export function Topups() {
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
        <div style={{ maxWidth: 600 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "#0b1220", letterSpacing: "-0.02em" }}>
            Need more in a busy month?
          </h3>
          <p style={{ fontSize: 14, color: "#6b7280", margin: "8px 0 0", lineHeight: 1.6 }}>
            {`On any plan, top up whatever you need — from $${TOPUP.min}, and every $1 adds ${TOPUP.creditsPerDollar} credits. `}
            Top-up credits last one month, so a one-off migration or client audit doesn&apos;t force you
            onto a bigger plan.
          </p>
          <p style={{ fontSize: 13, color: "#0b1220", fontWeight: 600, margin: "8px 0 0", lineHeight: 1.6 }}>
            Top-ups are available only while you have an active monthly or annual subscription.
          </p>
        </div>

        <div className="pr-topups">
          {TOPUP.presets.map((dollars) => (
            <AppCtaLink key={dollars} path="/pricing?topup=packs" className="pr-topup">
              <b>${dollars.toLocaleString()}</b>
              <span>{(dollars * TOPUP.creditsPerDollar).toLocaleString()} credits</span>
            </AppCtaLink>
          ))}
        </div>
      </div>
    </section>
  );
}
