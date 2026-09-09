import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { COLORS } from "@/components/site/constants";
import { CREDIT_COSTS } from "./tools";

/**
 * How the whole thing is paid for, in one table.
 *
 * The Pricing section below sells the plans; this one explains the unit those
 * plans are denominated in. A visitor who has just read about fourteen tools
 * needs to know they all draw on the same balance rather than fourteen separate
 * limits — that is the actual product decision, and it was nowhere on the page.
 *
 * Figures come from CREDIT_COSTS in ./tools, which mirrors the backend rate card.
 */
export function Credits() {
  return (
    <section
      id="credits"
      className="fs-section"
      style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 40px 0", scrollMarginTop: 80 }}
    >
      <SectionHead
        tag="ONE BALANCE"
        title="Every tool, one pot of credits"
        sub="No per-tool limits, no seat pricing, nothing reserved for a higher tier. You get 100 credits free every month and spend them on whatever you actually need that week."
      />

      <Reveal style={{ marginTop: 48, maxWidth: 1040, marginLeft: "auto", marginRight: "auto" }}>
        <div
          style={{
            border: `1px solid ${COLORS.border}`,
            borderRadius: 16,
            overflow: "hidden",
            background: "#fff",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 520 }}>
              <thead>
                <tr style={{ background: COLORS.softGray }}>
                  <th style={{ ...th, width: "30%" }}>What you run</th>
                  <th style={{ ...th, width: "18%" }}>Credits</th>
                  <th style={th}>What that covers</th>
                </tr>
              </thead>
              <tbody>
                {CREDIT_COSTS.map((row) => (
                  <tr key={row.action} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                    <th
                      scope="row"
                      style={{
                        padding: "14px 20px",
                        textAlign: "left",
                        fontWeight: 500,
                        color: COLORS.black,
                        verticalAlign: "top",
                      }}
                    >
                      {row.action}
                    </th>
                    <td
                      style={{
                        padding: "14px 20px",
                        fontWeight: 600,
                        // Free was green, the only green on the page. Weight carries it now.
                        color: COLORS.blue,
                        background: COLORS.blueBg,
                        verticalAlign: "top",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.cost}
                    </td>
                    <td style={{ padding: "14px 20px", color: COLORS.gray, verticalAlign: "top" }}>
                      {row.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p
          style={{
            color: COLORS.subtle,
            fontSize: 13.5,
            lineHeight: 1.5,
            margin: "16px 2px 0",
          }}
        >
          Free plan: 100 credits, refilled every calendar month, no card. Paid plans add 2,000,
          6,000 or 15,000 credits a month, and top-up packs never expire for 12 months.
        </p>
      </Reveal>
    </section>
  );
}

const th: React.CSSProperties = {
  padding: "14px 20px",
  textAlign: "left",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: COLORS.subtle,
};
