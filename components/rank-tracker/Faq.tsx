import { Reveal } from "@/components/site/Reveal";
import { Tag } from "@/components/site/Tag";
import { COLORS } from "@/components/site/constants";
import { FAQ_ITEMS } from "./data";

export function Faq() {
  return (
    <section
      id="faq"
      className="fs-serp-section"
      style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 40px 0", scrollMarginTop: 80 }}
    >
      <div className="fs-row fs-faq-layout" style={{ display: "flex", gap: 80, alignItems: "flex-start" }}>
        <div className="fs-faq-sidebar" style={{ flex: "0 0 33%", minWidth: 0 }}>
          <Reveal>
            <Tag text="Common Questions" />
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 52px)",
                fontWeight: 600,
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
                margin: "20px 0 16px",
              }}
            >
              Frequently asked questions
            </h2>
            <p style={{ color: COLORS.gray, fontSize: 16, lineHeight: 1.5 }}>
              Common questions about SERP checking, accuracy, and tracking. Still stuck? Email{" "}
              support@freeserp.com.
            </p>
          </Reveal>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {FAQ_ITEMS.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.04}>
              <div
                style={{
                  padding: "16px 0 24px",
                  borderBottom: `1px solid ${COLORS.border}`,
                }}
              >
                <h3 style={{ fontSize: 20, fontWeight: 500, letterSpacing: "-0.4px", margin: 0 }}>
                  {f.q}
                </h3>
                <p
                  style={{
                    margin: "12px 0 0",
                    color: COLORS.gray,
                    fontSize: 16,
                    lineHeight: 1.55,
                    maxWidth: 720,
                  }}
                >
                  {f.a}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
