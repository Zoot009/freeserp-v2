import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { COLORS } from "@/components/site/constants";
import { LEVELS } from "./data";

/**
 * Market granularity. Levels and example formats match the serp_locations
 * table (Country | Region | City | Postal Code) and DataForSEO's own
 * most-specific-first naming, e.g. "Austin,Texas,United States".
 */
export function Markets() {
  return (
    <section
      id="markets"
      className="fs-serp-section"
      style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 40px 0", scrollMarginTop: 80 }}
    >
      <SectionHead
        tag="Targeting"
        title="Track at the level you actually sell at"
        sub="Every keyword carries its own market, so a national term and a suburb term can sit in the same project without one distorting the other."
      />

      <Reveal>
        <div
          className="fs-market-wrap"
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
                {["Level", "Looks like", "When to use it"].map((h) => (
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
              {LEVELS.map((l, i) => (
                <tr key={l.level} style={{ background: l.level === "City" ? COLORS.blueBg : "#fff" }}>
                  <td
                    style={{
                      padding: "14px 20px",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      borderTop: i === 0 ? "none" : `1px solid ${COLORS.border}`,
                    }}
                  >
                    {l.level}
                  </td>
                  <td
                    style={{
                      padding: "14px 20px",
                      fontFamily: "var(--font-geist-mono)",
                      fontSize: 13.5,
                      color: COLORS.gray,
                      borderTop: i === 0 ? "none" : `1px solid ${COLORS.border}`,
                    }}
                  >
                    {l.example}
                  </td>
                  <td
                    style={{
                      padding: "14px 20px",
                      color: COLORS.gray,
                      borderTop: i === 0 ? "none" : `1px solid ${COLORS.border}`,
                    }}
                  >
                    {l.use}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      <Reveal>
        <div
          style={{
            margin: "20px auto 0",
            maxWidth: 780,
            padding: "16px 20px",
            borderRadius: 12,
            borderLeft: `3px solid ${COLORS.blue}`,
            background: COLORS.blueBg,
            color: COLORS.black,
            fontSize: 15,
            lineHeight: 1.6,
          }}
        >
          Sub-country targeting is a Google capability, not a universal one. If you add a city
          keyword on a search engine that cannot honour it, FreeSERP refuses the keyword and
          tells you — rather than returning the country&apos;s results and filing them under
          the city&apos;s name.
        </div>
      </Reveal>
    </section>
  );
}
