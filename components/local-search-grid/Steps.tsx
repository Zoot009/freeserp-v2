import Image from "next/image";
import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { COLORS } from "@/components/site/constants";
import { SCAN_SHOT, STEPS } from "./data";

/**
 * "How it works", split across the blue band boundary.
 *
 * `Shot` closes the band: the scan screenshot sits straight under the hero's
 * CTAs so the product is the first thing below the fold, with no second
 * headline competing with the H1 on the same blue.
 *
 * `StepCards` opens the white below it, carrying the heading and the four
 * setup steps. They live on white because the band fades to white at the
 * bottom, where white card text disappeared — and they have to stay on the
 * page at all because they are the visible counterpart to the HowTo schema.
 */
export function Shot() {
  return (
    <section
      id="how-it-works"
      className="fs-steps-section"
      style={{
        position: "relative",
        margin: "0 auto",
        padding: "0 0 72px",
        scrollMarginTop: 80,
        overflow: "hidden",
      }}
    >
      <div className="fs-maps-shot" style={{ maxWidth: 1320, margin: "0 auto", padding: "0 60px" }}>
        <Reveal>
          {/* The screenshot carries the app's own UI, so no fake window
              chrome on top of it — just a rounded, shadowed card. */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,.28)",
              background: "#fff",
              boxShadow: "0 30px 70px rgba(4,26,80,.28)",
            }}
          >
            <Image
              src={SCAN_SHOT.src}
              alt="local search grid tool — a Google Maps geo-grid over New York with every search point coloured by the position it returned, beside the competitors holding the top-3 spots"
              title="Local search grid results"
              width={SCAN_SHOT.w}
              height={SCAN_SHOT.h}
              priority
              sizes="(max-width: 1320px) 100vw, 1200px"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** The heading and the four setup steps. Renders on white, below the band. */
export function StepCards() {
  return (
    <section
      className="fs-serp-section"
      style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 40px 0", scrollMarginTop: 80 }}
    >
      <SectionHead
        tag="Step By Step"
        title="How the local search grid works"
        sub="Centre the grid, size it, and let it search. Nothing between the points is guessed — every pin you see is a live Google Maps query that ran at those coordinates."
      />
      <div
        className="fs-maps-steps-grid"
        style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 56 }}
      >
        {STEPS.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.08}>
            <div
              className="fs-card"
              style={{
                height: "100%",
                padding: 26,
                borderRadius: 16,
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  background: COLORS.blueBg,
                  color: COLORS.blue,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {s.n}
              </div>
              <h3
                style={{
                  margin: "16px 0 0",
                  fontSize: 17,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.3,
                }}
              >
                {s.title}
              </h3>
              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: 14.5,
                  lineHeight: 1.55,
                  color: COLORS.gray,
                }}
              >
                {s.desc}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
