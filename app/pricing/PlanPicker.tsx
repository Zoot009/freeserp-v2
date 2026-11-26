"use client";

// The plan row: a Monthly / Annual toggle over the cards. Client-side only for
// the toggle — every price is in the static HTML (annual is the default view),
// so the page still renders without JS.

import { useState } from "react";
import { AppCtaLink } from "@/components/site/AppCtaLink";
import { CREDIT_PLANS, FREE_MONTHS, LITE_PLAN, planSlug, whatItBuys, type CreditPlan } from "./PricingPlans";

type Interval = "month" | "year";

// Rounded down, so a discount is never overstated.
const pct = (price: number, now: number) => Math.floor((1 - now / price) * 100);
const MAX_OFF = Math.max(...CREDIT_PLANS.flatMap((p) => (p.sizes ?? [p]).map((s) => pct(s.price, s.annual))));

// Christmas & New Year wording on the annual saving, until 6 Jan 2027. Checked
// in the browser, so the page drops it on time without a redeploy (the static
// HTML may still say it until the next build — hence suppressHydrationWarning).
const FESTIVE = Date.now() < Date.UTC(2027, 0, 7);
const short = (credits: number) => `${credits / 1000}K`;

/** Price line plus a caption saying what is actually charged, and when. */
function Price({ now, was, note }: { now: number; was?: number; note: string }) {
  return (
    <>
      <div className="pp-price">
        {was !== undefined && was > now && <s>${was}</s>}
        <b>${now}</b>
        <span>/mo</span>
      </div>
      <p className="pp-note">{note}</p>
    </>
  );
}

function Credits({ credits, lines }: { credits: string; lines: string[] }) {
  return (
    <div className="pp-credits">
      <p>
        <span className="pp-plus" aria-hidden>+</span>
        <b>{credits}</b> / month
      </p>
      <ul>
        {lines.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
    </div>
  );
}

function PaidCard({ plan, interval }: { plan: CreditPlan; interval: Interval }) {
  const [size, setSize] = useState(plan.sizes?.[0] ?? plan);
  const annual = interval === "year";
  const save = (size.price - size.annual) * 12;
  const off = annual ? pct(size.price, size.annual) : size.intro ? pct(size.price, size.intro) : 0;
  const tone = plan.popular ? " pp-card--featured" : plan.sizes ? " pp-card--top" : "";
  return (
    <div className={`pp-card${tone}`}>
      <div className="pp-panel">
        <div className="pp-head">
          <h3>{plan.label}</h3>
          {plan.popular && <span className="pp-chip">Most popular</span>}
          {plan.sizes && (
            <div className="pp-sizes" role="group" aria-label={`${plan.label} credits per month`}>
              {plan.sizes.map((s) => (
                <button key={s.slug} type="button" aria-pressed={s.slug === size.slug} onClick={() => setSize(s)}>
                  {short(s.credits)}
                </button>
              ))}
            </div>
          )}
        </div>
        <p className="pp-who">{plan.who}</p>
        {annual ? (
          <Price
            now={size.annual}
            was={size.price}
            note={`$${(size.annual * 12).toLocaleString()} billed yearly${save > 0 ? ` · save $${save.toLocaleString()}` : ""}`}
          />
        ) : size.intro ? (
          <Price now={size.intro} was={size.price} note={`First month, then renews at $${size.price}/mo`} />
        ) : (
          <Price now={size.price} note="Billed monthly, cancel any time" />
        )}
        <AppCtaLink path={`/pricing?plan=${planSlug(size, annual)}`} className="pp-cta">
          Get {plan.label}
          {off > 0 && <span className="pp-off">−{off}%</span>}
        </AppCtaLink>
      </div>
      <Credits credits={`${size.credits.toLocaleString()} credits`} lines={whatItBuys(size.credits)} />
    </div>
  );
}

export function PlanPicker() {
  const [interval, setBilling] = useState<Interval>("year");
  return (
    <>
      <div className="pp-bar">
        <div>
          <h2>All plans</h2>
          <p suppressHydrationWarning>
            {FESTIVE
              ? `🎄 Christmas & New Year offer: pay yearly and save up to ${MAX_OFF}%.`
              : `Pay yearly and save up to ${MAX_OFF}%.`}
          </p>
        </div>
        <div className="pp-toggles">
          <div className="pp-seg" role="group" aria-label="Billing">
            {(
              [
                ["month", "Monthly"],
                ["year", "Annual"],
              ] as const
            ).map(([v, text]) => (
              <button key={v} type="button" aria-pressed={interval === v} onClick={() => setBilling(v)}>
                {text}
              </button>
            ))}
          </div>
          <span className="pp-max-off" suppressHydrationWarning>
            {FESTIVE ? `🎄 Holiday sale · up to ${MAX_OFF}% off` : `Up to ${MAX_OFF}% off`}
          </span>
        </div>
      </div>

      <div className={`pp-row ${interval === "year" ? "pp-row--5" : "pp-row--4"}`}>
        <div className="pp-card">
          <div className="pp-panel">
            <div className="pp-head">
              <h3>Free</h3>
              <span className="pp-chip pp-chip--quiet">{FREE_MONTHS} months</span>
            </div>
            <p className="pp-who">Try Google rank tracking, no card</p>
            <Price now={0} note={`For your first ${FREE_MONTHS} months, then pick a plan`} />
            <AppCtaLink path="/signup" className="pp-cta">
              Start free
            </AppCtaLink>
          </div>
          <Credits credits="100 credits" lines={["Refilled on the 1st", ...whatItBuys(100).slice(0, 1)]} />
        </div>

        {interval === "year" && (
        <div className="pp-card">
          <div className="pp-panel">
            <div className="pp-head">
              <h3>{LITE_PLAN.label}</h3>
              <span className="pp-chip pp-chip--quiet">Annual only</span>
            </div>
            <p className="pp-who">Every paid tool, at light use</p>
            <Price now={LITE_PLAN.annual} note={`$${LITE_PLAN.annual * 12} billed yearly`} />
            <AppCtaLink path={`/pricing?plan=${LITE_PLAN.slug}`} className="pp-cta">
              Get Lite
            </AppCtaLink>
          </div>
          <Credits
            credits={`${LITE_PLAN.credits} credits`}
            lines={["50 projects, 500-page audits", ...whatItBuys(LITE_PLAN.credits).slice(0, 1)]}
          />
        </div>
        )}

        {CREDIT_PLANS.map((plan) => (
          <PaidCard key={plan.slug} plan={plan} interval={interval} />
        ))}
      </div>
    </>
  );
}
