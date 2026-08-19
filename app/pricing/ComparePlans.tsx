// The plan comparison table.
//
// The header sticks below the site nav as you scroll, so the column you are
// reading a row against is always named. Below about the eighth row a
// comparison table is unreadable without that — you scroll back up to work out
// which column is which, which is where people give up.
//
// It uses CSS `position: sticky` on the header cells rather than a second fixed
// bar. The first attempt drew a fixed bar at top:0, where the site nav already
// lives, and the two rendered on top of each other. Sticky keeps the header
// inside the table's own flow, so a collision is not possible.

import { AppCtaLink } from "@/components/site/AppCtaLink";
import { CREDIT_PLANS } from "./PricingPlans";

type Cell = string | number | boolean;

interface CompareRow {
  feature: string;
  /** What it draws from the shared balance, shown as a quiet tag. */
  tag?: string;
  /** Free, then one per plan in CREDIT_PLANS order. */
  values: [Cell, Cell, Cell, Cell];
}

// Every value has to be true of the product. This is the one page element people
// screenshot and hold you to.
const SECTIONS: { title: string; rows: CompareRow[] }[] = [
  {
    title: "Credits",
    rows: [
      { feature: "Credits per month", values: [100, "2,000", "6,000", "15,000"] },
      { feature: "Rank checks", tag: "1 credit each", values: [100, "2,000", "6,000", "15,000"] },
      { feature: "Keywords tracked daily", tag: "for a full month", values: [3, 66, 200, 500] },
      { feature: "Buy top-up packs", values: [false, true, true, true] },
      { feature: "Credits roll over", tag: "top-ups only", values: [false, true, true, true] },
    ],
  },
  {
    title: "Rank tracking",
    rows: [
      { feature: "Google rank tracking", tag: "1 / keyword", values: [true, true, true, true] },
      { feature: "YouTube rank tracking", tag: "1 / keyword", values: [true, true, true, true] },
      { feature: "Local map grid scans", tag: "3–57 / scan", values: [true, true, true, true] },
      { feature: "Automated recurring checks", values: [false, true, true, true] },
      { feature: "190+ countries, all devices", values: [true, true, true, true] },
      { feature: "Keywords per project", values: [10, "Unlimited", "Unlimited", "Unlimited"] },
    ],
  },
  {
    title: "Research and audits",
    rows: [
      { feature: "Keyword Magic Tool", tag: "3–15 / search", values: [true, true, true, true] },
      { feature: "Rows per keyword search", values: [100, "1,000", "1,000", "1,000"] },
      { feature: "Website Audit", tag: "1 / 20 pages", values: [true, true, true, true] },
      { feature: "Competitor Analysis", tag: "5 / analysis", values: [true, true, true, true] },
      { feature: "AI Internal Linking", tag: "2 / crawl", values: [true, true, true, true] },
      { feature: "Keyword Score Checker", tag: "3 / page", values: [true, true, true, true] },
      { feature: "Quick Serp", tag: "1 / lookup", values: [true, true, true, true] },
    ],
  },
  {
    title: "Data and support",
    rows: [
      { feature: "Search Console and GA4", tag: "free", values: [true, true, true, true] },
      { feature: "CSV and PDF export", values: [false, true, true, true] },
      { feature: "Email support", values: [true, true, true, true] },
      { feature: "Priority support", values: [false, false, true, true] },
    ],
  },
];

const COLUMNS = ["Free", ...CREDIT_PLANS.map((p) => p.label)];
const PRICES = ["$0", ...CREDIT_PLANS.map((p) => `$${p.price}`)];
const SLUGS = ["", ...CREDIT_PLANS.map((p) => p.slug)];
const FEATURED = 1 + CREDIT_PLANS.findIndex((p) => p.popular);

function Tick() {
  return (
    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" role="img" aria-label="Included">
      <path d="M2 7L5.5 10.5L12 3.5" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Dash() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" role="img" aria-label="Not included">
      <path d="M3 7H11" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function renderCell(v: Cell) {
  if (v === true) return <Tick />;
  if (v === false) return <Dash />;
  return <span style={{ fontWeight: 600 }}>{v}</span>;
}

export function ComparePlans() {
  return (
    <section style={{ maxWidth: 1080, margin: "0 auto", padding: "8px 24px 72px" }}>
      <h2
        style={{
          fontSize: "clamp(24px, 4vw, 32px)",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          margin: "0 0 8px",
          color: "#0b1220",
        }}
      >
        Compare plans
      </h2>
      <p style={{ fontSize: 14.5, color: "#6b7280", margin: "0 0 24px", maxWidth: 600, lineHeight: 1.6 }}>
        Every tool is on every plan. What changes is how many credits you get — the tags show what
        each one draws from that balance.
      </p>

      <div className="pr-scroll">
        <table className="pr-compare" style={{ minWidth: 760 }}>
          <thead>
            <tr>
              <th className="pr-feature" />
              {COLUMNS.map((name, i) => (
                <th key={name} className={i === FEATURED ? "pr-col-featured" : undefined}>
                  <div style={{ paddingBottom: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#6b7280", letterSpacing: "0.01em" }}>
                      {name}
                    </div>
                    <div
                      style={{
                        fontSize: 21,
                        fontWeight: 700,
                        color: "#0b1220",
                        letterSpacing: "-0.02em",
                        marginTop: 2,
                      }}
                    >
                      {PRICES[i]}
                      {i > 0 && <span style={{ fontSize: 12, fontWeight: 500, color: "#9ca3af" }}>/mo</span>}
                    </div>
                    <AppCtaLink
                      path={i === 0 ? "/signup" : `/pricing?plan=${SLUGS[i]}`}
                      className={`pr-cta${i === FEATURED ? " pr-cta--primary" : ""}`}
                      style={{ marginTop: 10, padding: "8px 10px", fontSize: 13 }}
                    >
                      {i === 0 ? "Start free" : "Choose"}
                    </AppCtaLink>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {SECTIONS.map((section) => (
            <tbody key={section.title}>
              <tr className="pr-section-head">
                <td colSpan={COLUMNS.length + 1}>{section.title}</td>
              </tr>
              {section.rows.map((row) => (
                <tr key={row.feature}>
                  <td className="pr-feature">
                    {row.feature}
                    {row.tag && <span className="pr-tag">{row.tag}</span>}
                  </td>
                  {row.values.map((v, i) => (
                    <td key={i} className={i === FEATURED ? "pr-col-featured" : undefined}>
                      {renderCell(v)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
    </section>
  );
}
