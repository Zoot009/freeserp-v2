import { COSTS, PLANS } from "./data";

export default function Pricing() {
  return (
    <section id="pricing" className="l2-pricing">
      <div className="l2-wrap">
        <div className="l2-head-narrow">
          <div className="l2-eyebrow l2-mono">Pricing</div>
          <h2 className="l2-h2">One balance, every tool</h2>
          <p className="l2-pricing-lede">
            Credits refill every month and work across the whole product. No seat
            counts, no feature gates, no annual contract.
          </p>
        </div>

        <div className="l2-plans">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={plan.featured ? "l2-plan l2-plan-featured" : "l2-plan"}
            >
              {plan.featured && <span className="l2-plan-badge">Most popular</span>}
              <span className="l2-plan-name">{plan.name}</span>
              <div className="l2-plan-price">
                <b>{plan.price}</b>
                <span>/month</span>
              </div>
              <p className="l2-plan-note">{plan.note}</p>
              <div className="l2-plan-rule" />
              <ul className="l2-plan-feats">
                {plan.feats.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <a
                href="#signup"
                className={plan.featured ? "l2-plan-btn-primary" : "l2-plan-btn"}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        <div className="l2-costs">
          <h3 className="l2-costs-h">What a credit buys</h3>
          <p className="l2-costs-sub">
            Nothing is locked behind a higher tier — your credits work across all
            of it.
          </p>
          <div className="l2-costs-table">
            {COSTS.map((row) => (
              <div key={row.name} className="l2-cost-row">
                <div>
                  <div className="l2-cost-name">{row.name}</div>
                  <p className="l2-cost-what">{row.what}</p>
                </div>
                <span className="l2-cost-price l2-mono">{row.cost}</span>
              </div>
            ))}
          </div>
          <p className="l2-costs-foot">
            Credits from a monthly plan are used first, and top-up packs are there
            when a month runs heavy.
          </p>
        </div>
      </div>
    </section>
  );
}
