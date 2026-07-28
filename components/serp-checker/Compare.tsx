import Image from "next/image";
import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { COLORS } from "@/components/site/constants";
import { COMPARE_ROWS } from "./data";

export function Compare() {
  return (
    <section
      id="free-vs-paid"
      className="fs-serp-section"
      style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 40px 0", scrollMarginTop: 80 }}
    >
      <SectionHead
        tag="Honest Comparison"
        title="Free SERP vs paid tools"
        sub="Most paid tools cost $49 to $199 per month for features you can get free if you don't need 10,000 keywords tracked daily. Here's the honest comparison."
      />
      <Reveal style={{ marginTop: 56, maxWidth: 1040, marginLeft: "auto", marginRight: "auto" }}>
        <div
          className="fs-cmp-table"
          style={{
            border: `1px solid ${COLORS.border}`,
            borderRadius: 16,
            overflow: "hidden",
            background: "#fff",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: COLORS.softGray }}>
                  <th style={{ ...thStyle, width: "32%" }}>Feature</th>
                  <th
                    style={{
                      ...thStyle,
                      fontSize: 14,
                      fontWeight: 600,
                      color: COLORS.blue,
                      background: COLORS.blueBg,
                      letterSpacing: "normal",
                      textTransform: "none",
                    }}
                  >
                    FreeSERP
                  </th>
                  <th style={{ ...thStyle, fontSize: 14, fontWeight: 500, letterSpacing: "normal", textTransform: "none", color: COLORS.black }}>
                    Ahrefs / Semrush
                  </th>
                  <th style={{ ...thStyle, fontSize: 14, fontWeight: 500, letterSpacing: "normal", textTransform: "none", color: COLORS.black }}>
                    WhatsMySerp / SerpRobot
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row) => (
                  <tr key={row.feature} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                    <th
                      scope="row"
                      style={{
                        padding: "16px 20px",
                        textAlign: "left",
                        fontWeight: 500,
                        color: COLORS.black,
                        verticalAlign: "top",
                      }}
                    >
                      {row.feature}
                    </th>
                    <td
                      style={{
                        padding: "16px 20px",
                        fontWeight: 600,
                        color: COLORS.green,
                        background: COLORS.blueBg,
                        verticalAlign: "top",
                      }}
                    >
                      {row.ours}
                    </td>
                    <td style={{ padding: "16px 20px", color: COLORS.gray, verticalAlign: "top" }}>
                      {row.mid}
                    </td>
                    <td style={{ padding: "16px 20px", color: COLORS.gray, verticalAlign: "top" }}>
                      {row.light}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile: the table reflowed into one card per feature */}
        <div className="fs-cmp-cards">
          {COMPARE_ROWS.map((row) => (
            <div
              key={row.feature}
              style={{
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12,
                background: "#fff",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "11px 14px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: COLORS.black,
                  background: COLORS.softGray,
                }}
              >
                {row.feature}
              </div>
              <div style={{ paddingBottom: 6 }}>
                {[
                  { label: "FreeSERP", value: row.ours, highlight: true },
                  { label: "Ahrefs / Semrush", value: row.mid, highlight: false },
                  { label: "WhatsMySerp / SerpRobot", value: row.light, highlight: false },
                ].map((c) => (
                  <div
                    key={c.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 14,
                      padding: "9px 14px",
                      borderTop: `1px solid ${COLORS.border}`,
                      background: c.highlight ? COLORS.blueBg : "transparent",
                      fontSize: 13.5,
                    }}
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        fontWeight: c.highlight ? 600 : 400,
                        color: c.highlight ? COLORS.blue : COLORS.gray,
                      }}
                    >
                      {c.label}
                    </span>
                    <span
                      style={{
                        textAlign: "right",
                        fontWeight: c.highlight ? 600 : 400,
                        color: c.highlight ? COLORS.green : COLORS.black,
                      }}
                    >
                      {c.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.1} style={{ maxWidth: 640, margin: "24px auto 0" }}>
        <div
          style={{
            border: `1px solid ${COLORS.border}`,
            borderRadius: 12,
            padding: "14px 18px",
            background: "#fff",
            display: "flex",
            alignItems: "flex-start",
            gap: 14,
          }}
        >
          <div
            style={{
              flexShrink: 0,
              width: 36,
              height: 36,
              borderRadius: 9,
              background: COLORS.blueBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src="/serp-image/question.png"
              alt="serp-checker — when the free trial is enough"
              title="When is the free trial enough?"
              width={20}
              height={20}
              style={{ display: "block" }}
            />
          </div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: COLORS.gray }}>
            The free 7-day trial is enough to see your real rankings. Tracking daily? Start
            at 5 workers ($5/mo, 75 checks a day) and scale to 500 as you grow.
          </p>
        </div>
      </Reveal>
    </section>
  );
}

const thStyle: React.CSSProperties = {
  padding: "16px 20px",
  textAlign: "left",
  fontSize: 12,
  fontWeight: 600,
  color: COLORS.gray,
  letterSpacing: ".12em",
  textTransform: "uppercase",
};
