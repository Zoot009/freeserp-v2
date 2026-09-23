import Image from "next/image";
import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { COLORS } from "@/components/site/constants";
import { HEADLINE_METRICS, METRICS } from "./data";

export function Metrics() {
  return (
    <section
      id="what-you-get"
      className="fs-serp-section"
      style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 40px 0", scrollMarginTop: 80 }}
    >
      <SectionHead
        tag="In Every Scan"
        title="What a Google Maps rank check reports"
        sub="Three numbers summarise the scan, and the rest of the report tells you what to do about them."
      />
      {/* The three headline numbers, as a stat row rather than cards — it
          echoes how the scan page itself presents them. */}
      <div
        className="fs-metric-row"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          marginTop: 56,
          borderTop: `1px solid ${COLORS.border}`,
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        {HEADLINE_METRICS.map((m, i) => (
          <Reveal key={m.acronym} delay={i * 0.08}>
            <div
              className="fs-metric-cell"
              style={{
                padding: "30px 32px",
                height: "100%",
                borderLeft: i === 0 ? "none" : `1px solid ${COLORS.border}`,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: 30,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: COLORS.blue,
                }}
              >
                {m.acronym}
              </div>
              <h3
                style={{
                  margin: "10px 0 0",
                  fontSize: 17,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                }}
              >
                {m.title}
              </h3>
              <p style={{ color: COLORS.gray, fontSize: 15, lineHeight: 1.55, margin: "8px 0 0" }}>
                {m.desc}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="fs-grid-3" style={{ marginTop: 32 }}>
        {METRICS.map((m, i) => (
          <Reveal key={m.title} delay={i * 0.08}>
            <div
              className="fs-card"
              style={{
                border: `1px solid ${COLORS.border}`,
                borderRadius: 16,
                padding: 28,
                height: "100%",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: COLORS.blueBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                {m.img && (
                  <Image
                    src={m.img}
                    alt={m.alt ?? ""}
                    title={m.title}
                    width={26}
                    height={26}
                    style={{ display: "block" }}
                  />
                )}
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 600, letterSpacing: "-0.02em", margin: 0 }}>
                {m.title}
              </h3>
              <p style={{ color: COLORS.gray, fontSize: 15, lineHeight: 1.55, margin: "10px 0 0" }}>
                {m.desc}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
