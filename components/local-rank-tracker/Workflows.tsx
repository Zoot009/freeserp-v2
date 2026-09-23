import Link from "next/link";
import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { COLORS } from "@/components/site/constants";
import { WORKFLOWS } from "./data";

/**
 * The two workflows, side by side.
 *
 * This is the section the page is built around: local search is half an
 * ordinary results page and half a map, and a local rank tracker that covers
 * only one of them is describing half the problem. Stating both — and being
 * explicit that in-pack POSITION lives on the Maps pages, while this page
 * reports Local Pack PRESENCE — is what keeps the three local pages from
 * collapsing into one another.
 */
export function Workflows() {
  return (
    <section
      id="workflows"
      className="fs-serp-section"
      style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 40px 0", scrollMarginTop: 80 }}
    >
      <SectionHead
        tag="Two Workflows"
        title="Local search is two surfaces, not one"
        sub="A local searcher sees an ordinary results page with a map on it. Both halves decide whether they call you, and they are tracked differently."
      />

      <div
        className="fs-workflow-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          marginTop: 56,
        }}
      >
        {WORKFLOWS.map((w, i) => (
          <Reveal key={w.title} delay={i * 0.1}>
            <div
              className="fs-card"
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                padding: 32,
                borderRadius: 18,
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontFamily: "var(--font-geist-mono)",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: COLORS.blue,
                }}
              >
                {w.kicker}
              </div>
              <h3
                style={{
                  margin: "14px 0 0",
                  fontSize: 23,
                  fontWeight: 600,
                  letterSpacing: "-0.03em",
                }}
              >
                {w.title}
              </h3>
              <p
                style={{
                  margin: "12px 0 0",
                  padding: "12px 16px",
                  borderRadius: 10,
                  background: COLORS.blueBg,
                  color: COLORS.black,
                  fontSize: 15,
                  lineHeight: 1.5,
                  fontStyle: "italic",
                }}
              >
                &ldquo;{w.question}&rdquo;
              </p>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "20px 0 0",
                  display: "flex",
                  flexDirection: "column",
                  gap: 11,
                }}
              >
                {w.bullets.map((b) => (
                  <li
                    key={b}
                    style={{
                      display: "flex",
                      gap: 11,
                      alignItems: "flex-start",
                      fontSize: 15,
                      lineHeight: 1.55,
                      color: COLORS.gray,
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
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <p
          style={{
            margin: "28px auto 0",
            maxWidth: 780,
            textAlign: "center",
            color: COLORS.gray,
            fontSize: 15,
            lineHeight: 1.65,
          }}
        >
          One honest limit, stated plainly: this page tracks whether a Local Pack{" "}
          <strong style={{ color: COLORS.black }}>appeared</strong>, not which position you hold{" "}
          <strong style={{ color: COLORS.black }}>inside</strong> it. For that, the{" "}
          <Link href="/google-maps-rank-tracker" style={{ color: COLORS.blue, textDecoration: "none" }}>
            Google Maps rank tracker
          </Link>{" "}
          queries Maps directly, and the{" "}
          <Link href="/local-search-grid" style={{ color: COLORS.blue, textDecoration: "none" }}>
            local search grid
          </Link>{" "}
          shows how that position changes across an area.
        </p>
      </Reveal>
    </section>
  );
}
