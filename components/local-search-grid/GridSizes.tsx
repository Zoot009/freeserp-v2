import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { COLORS } from "@/components/site/constants";
import { GRID_ROWS } from "./data";

/**
 * Grid sizes against searches and credits.
 *
 * Grid-only content by definition, and the question anyone actually has before
 * their first scan. Numbers come from GRID_SIZES in the app's grid.ts and the
 * 1-per-scan + 1-per-8-points rule in the backend's credits/catalog.ts.
 */
export function GridSizes() {
  return (
    <section
      id="grid-sizes"
      className="fs-serp-section"
      style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 40px 0", scrollMarginTop: 80 }}
    >
      <SectionHead
        tag="Sizing A Scan"
        title="How big a grid do you need?"
        sub="Every point is a paid search, so the grid is a trade between detail and cost. These are the sizes people actually use."
      />

      <Reveal>
        <div
          className="fs-gridsize-wrap"
          style={{
            marginTop: 56,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
            <thead>
              <tr style={{ background: COLORS.softGray }}>
                {["Grid", "Searches", "Credits", "Best for"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "14px 20px",
                      fontSize: 11,
                      fontFamily: "var(--font-geist-mono)",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: COLORS.subtle,
                      fontWeight: 500,
                      borderBottom: `1px solid ${COLORS.border}`,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GRID_ROWS.map((r, i) => (
                <tr key={r.grid} style={{ background: r.grid === "11 × 11" ? COLORS.blueBg : "#fff" }}>
                  <td
                    style={{
                      padding: "14px 20px",
                      fontFamily: "var(--font-geist-mono)",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      borderTop: i === 0 ? "none" : `1px solid ${COLORS.border}`,
                    }}
                  >
                    {r.grid}
                  </td>
                  <td
                    style={{
                      padding: "14px 20px",
                      fontFamily: "var(--font-geist-mono)",
                      color: COLORS.gray,
                      borderTop: i === 0 ? "none" : `1px solid ${COLORS.border}`,
                    }}
                  >
                    {r.searches}
                  </td>
                  <td
                    style={{
                      padding: "14px 20px",
                      fontFamily: "var(--font-geist-mono)",
                      color: COLORS.blue,
                      fontWeight: 600,
                      borderTop: i === 0 ? "none" : `1px solid ${COLORS.border}`,
                    }}
                  >
                    {r.credits}
                  </td>
                  <td
                    style={{
                      padding: "14px 20px",
                      color: COLORS.gray,
                      borderTop: i === 0 ? "none" : `1px solid ${COLORS.border}`,
                    }}
                  >
                    {r.use}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      <Reveal>
        <p
          style={{
            margin: "20px auto 0",
            maxWidth: 760,
            textAlign: "center",
            color: COLORS.gray,
            fontSize: 14.5,
            lineHeight: 1.6,
          }}
        >
          9×9, 13×13 and 17×17 are available too. Points have to land at least 50 metres apart,
          and one scan is capped at 900 searches in total — keywords multiply the count, so a
          21×21 takes one keyword comfortably. Failed points are refunded when the scan settles.
        </p>
      </Reveal>
    </section>
  );
}
