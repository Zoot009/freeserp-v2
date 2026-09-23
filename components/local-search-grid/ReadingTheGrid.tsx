import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { COLORS } from "@/components/site/constants";
import { BANDS, PATTERNS } from "./data";

/**
 * The heatmap legend and what its patterns mean.
 *
 * This is the section that makes a separate grid page worth having: it is
 * entirely about reading a spread of points, which the Maps rank tracker page
 * has no room for and no reason to cover.
 *
 * Band labels, order and colours mirror RANK_BANDS in the app's grid.ts, so
 * the legend here matches the legend on a real scan.
 */
export function ReadingTheGrid() {
  return (
    <section
      id="reading-the-grid"
      className="fs-serp-section"
      style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 40px 0", scrollMarginTop: 80 }}
    >
      <SectionHead
        tag="The Heatmap"
        title="Reading the grid"
        sub="Every point comes back in one of six bands. The colours are the easy part — the pattern they make is the finding."
      />

      {/* The bands are an ordered scale, not six parallel facts — so they
          render as one continuous strip, best to worst, the way the scan's
          own rank-distribution bar does. */}
      <Reveal style={{ maxWidth: 900, margin: "56px auto 0" }}>
        <div
          className="fs-band-scale"
          style={{
            display: "flex",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(15,26,60,.12)",
          }}
        >
          {BANDS.map((b) => (
            <div
              key={b.label}
              style={{
                flex: 1,
                background: b.color,
                color: b.on,
                padding: "16px 8px",
                textAlign: "center",
                fontSize: 13.5,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
              }}
            >
              {b.label}
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 10,
            fontSize: 12.5,
            fontFamily: "var(--font-geist-mono)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: COLORS.subtle,
          }}
        >
          <span>Found first</span>
          <span>Not found at all</span>
        </div>
      </Reveal>

      {/* What each band means, as rows — a legend reads down, not across. */}
      <Reveal style={{ maxWidth: 900, margin: "36px auto 0" }}>
        <div style={{ borderTop: `1px solid ${COLORS.border}` }}>
          {BANDS.map((b) => (
            <div
              key={b.label}
              className="fs-band-row"
              style={{
                display: "grid",
                gridTemplateColumns: "18px 104px minmax(0, 1fr)",
                gap: 16,
                alignItems: "baseline",
                padding: "15px 4px",
                borderBottom: `1px solid ${COLORS.border}`,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: b.color,
                  transform: "translateY(2px)",
                }}
              />
              <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.02em" }}>
                {b.label}
              </span>
              <span style={{ color: COLORS.gray, fontSize: 15, lineHeight: 1.55 }}>
                {b.meaning}
              </span>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <h3
          style={{
            margin: "72px 0 0",
            fontSize: "clamp(22px, 2.6vw, 30px)",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            textAlign: "center",
          }}
        >
          Four patterns worth recognising
        </h3>
        <p
          style={{
            margin: "12px auto 0",
            maxWidth: 600,
            textAlign: "center",
            color: COLORS.gray,
            fontSize: 16,
            lineHeight: 1.5,
          }}
        >
          The same average rank can produce very different maps, and the map is what tells you
          what to fix.
        </p>
      </Reveal>

      <div
        className="fs-pattern-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginTop: 40,
        }}
      >
        {PATTERNS.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.07}>
            <div
              className="fs-card"
              style={{
                height: "100%",
                padding: 26,
                borderRadius: 16,
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <h4 style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.02em", margin: 0 }}>
                {p.title}
              </h4>
              <p style={{ color: COLORS.gray, fontSize: 15, lineHeight: 1.6, margin: "8px 0 0" }}>
                {p.desc}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
