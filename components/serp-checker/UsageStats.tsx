import { Reveal } from "@/components/site/Reveal";
import { COLORS } from "@/components/site/constants";

const STATS = [
  { v: "50M+", l: "Keywords Indexed" },
  { v: "190+", l: "Countries Supported" },
  { v: "Live", l: "Top-100 Google Results" },
];

export function UsageStats() {
  return (
    <section style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 40px 0" }}>
      <div className="fs-grid-3">
        {STATS.map((s, i) => (
          <Reveal key={s.l} delay={i * 0.08}>
            <div
              className="fs-card"
              style={{
                border: `1px solid ${COLORS.border}`,
                borderRadius: 16,
                padding: 28,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "clamp(36px, 4vw, 56px)",
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  color: COLORS.blue,
                  lineHeight: 1.1,
                }}
              >
                {s.v}
              </div>
              <div style={{ color: COLORS.gray, fontSize: 15, marginTop: 8 }}>{s.l}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
