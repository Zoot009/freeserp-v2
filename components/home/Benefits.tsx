import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { COLORS } from "@/components/site/constants";
import { BENEFITS } from "./data";

export function Benefits() {
  return (
    <section
      id="how-it-works"
      className="fs-section"
      style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 40px", scrollMarginTop: 80 }}
    >
      <SectionHead
        tag="PROCESS"
        title="How it works"
        sub="Four steps. No credit card, no setup, no waiting. The same flow whether you're tracking your own keywords or spying on a competitor."
      />
      <div className="fs-grid-3" style={{ marginTop: 56 }}>
        {BENEFITS.map((b, i) => (
          <Reveal key={b.title} delay={(i % 3) * 0.08}>
            <div
              className="fs-card"
              style={{
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12,
                padding: 26,
                height: "100%",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 8,
                  background: COLORS.blue,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 28,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                  <path
                    d="M 10 0 C 10.2 5.44 14.56 9.8 20 10 C 14.56 10.2 10.2 14.56 10 20 C 9.8 14.56 5.44 10.2 0 10 C 5.44 9.8 9.8 5.44 10 0 Z"
                    fill="#fff"
                  />
                </svg>
              </div>
              <h5
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  letterSpacing: "-0.04em",
                  margin: "0 0 8px",
                }}
              >
                {b.title}
              </h5>
              <p style={{ color: COLORS.gray, fontSize: 16, lineHeight: 1.5, margin: 0 }}>
                {b.text}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
