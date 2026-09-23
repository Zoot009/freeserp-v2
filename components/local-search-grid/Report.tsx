import Image from "next/image";
import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { COLORS } from "@/components/site/constants";
import { REPORT_SHOT } from "./data";

const POINTS = [
  "The grid drawn on a real map, every point in its band",
  "The grid size, radius and spacing the scan actually used",
  "Top-3 coverage plus the two rank averages for the keyword",
  "A plain-language headline instead of a number to decode",
];

/**
 * The shareable grid report. It sits after ReadingTheGrid because that section
 * teaches the bands and this one shows them landing somewhere a client can
 * read without being taught anything — which is the argument for the report.
 */
export function Report() {
  return (
    <section
      id="report"
      className="fs-serp-section"
      style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 40px 0", scrollMarginTop: 80 }}
    >
      <SectionHead
        tag="Shareable"
        title="A grid report you can send to a client"
        sub="Every grid has a clean report page behind it — the map, the bands and the numbers on one shareable link."
      />

      <div
        className="fs-row fs-report-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)",
          gap: 48,
          marginTop: 56,
          alignItems: "center",
        }}
      >
        <Reveal>
          {/* The report is a white page. On the site's white background it
              would dissolve, so it sits on a tinted surface and casts a
              shadow onto it — reading as a document rather than as part of
              the section. */}
          <div
            style={{
              borderRadius: 20,
              padding: 18,
              background: "linear-gradient(155deg, #e7eeff 0%, #f4f7fc 55%, #fbfcfe 100%)",
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <div
              style={{
                borderRadius: 12,
                overflow: "hidden",
                border: "1px solid rgba(15,16,24,.07)",
                background: "#fff",
                boxShadow: "0 16px 40px rgba(15,26,60,.16)",
              }}
            >
              <Image
                src={REPORT_SHOT.src}
                alt="local search grid tool — a shareable geo-grid report showing top-3 coverage, average rank and every scanned grid point on the map"
                title="Local search grid report"
                width={REPORT_SHOT.w}
                height={REPORT_SHOT.h}
                sizes="(max-width: 900px) 100vw, 640px"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: COLORS.gray, margin: 0 }}>
            A grid is the easiest local SEO finding to show and the hardest to describe. The
            report does the describing: one page, one keyword, the conclusion in a sentence at
            the top and the map that proves it underneath.
          </p>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "24px 0 0",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {POINTS.map((p) => (
              <li
                key={p}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  fontSize: 15,
                  lineHeight: 1.55,
                  color: COLORS.black,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    flexShrink: 0,
                    marginTop: 7,
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: COLORS.blue,
                  }}
                />
                {p}
              </li>
            ))}
          </ul>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: COLORS.gray, margin: "24px 0 0" }}>
            Export the same scan to CSV when you would rather work the numbers yourself.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
