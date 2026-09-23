import Image from "next/image";
import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { COLORS } from "@/components/site/constants";
import { REPORT_SHOT } from "./data";

const POINTS = [
  "The headline result in a sentence, not a number to decode",
  "SoLV, ARP and ATRP side by side for the keyword",
  "The scanned area on a real map, every point ranked",
  "Competitors holding the positions above you",
];

/**
 * The shareable report. It sits after Metrics because Metrics explains what the
 * numbers mean and this shows them arriving somewhere a client can read them —
 * which is the whole argument for the report existing.
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
        title="A report you can send to a client"
        sub="Every scan has a clean report page behind it — no dashboard login, no explaining what a grid is."
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
                alt="google maps rank tracker — a shareable Maps ranking report showing top-3 coverage, average rank and every scanned point on the map"
                title="Google Maps ranking report"
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
            A Maps ranking is hard to explain in an email. The report does it for you: one
            page, one keyword, the result stated in plain language at the top and the evidence
            underneath.
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
