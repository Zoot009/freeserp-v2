import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { COLORS } from "@/components/site/constants";
import { FEATURES } from "./data";
import { FeatureVisual } from "./FeatureVisual";

export function Features() {
  return (
    <section
      id="features"
      className="fs-section"
      style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 40px", scrollMarginTop: 80 }}
    >
      <SectionHead
        tag="WHAT WE OFFER"
        title="Every signal that moves rankings"
        sub="Enterprise-grade keyword data and SERP intelligence — with a generous free tier and affordable Pro."
      />
      <div className="fs-grid-2" style={{ marginTop: 56 }}>
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={(i % 2) * 0.1}>
            <div
              className="fs-card"
              style={{
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12,
                padding: 40,
                background: f.bg,
                height: "100%",
              }}
            >
              <FeatureVisual kind={f.visual} />
              <h5
                style={{
                  fontSize: 24,
                  fontWeight: 500,
                  letterSpacing: "-0.04em",
                  margin: "0 0 8px",
                }}
              >
                {f.title}
              </h5>
              <p style={{ color: COLORS.gray, fontSize: 16, lineHeight: 1.5, margin: 0 }}>
                {f.text}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
