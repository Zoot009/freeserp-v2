import Image from "next/image";
import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { COLORS } from "@/components/site/constants";
import { REPORT_BULLETS } from "./data";

export function Report() {
  return (
    <section
      id="what-it-shows"
      className="fs-serp-section"
      style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 40px 0", scrollMarginTop: 80 }}
    >
      <SectionHead
        tag="Inside Your Report"
        title="What the FreeSERP checker shows you"
        sub="Every check returns a structured report you can read in 5 seconds or hand to a client. Here's what's on it."
      />
      <div
        className="fs-grid-2"
        style={{ marginTop: 56, maxWidth: 1040, marginLeft: "auto", marginRight: "auto" }}
      >
        {REPORT_BULLETS.map((b, i) => (
          <Reveal key={b.title} delay={(i % 2) * 0.08}>
            <div
              className="fs-card"
              style={{
                border: `1px solid ${COLORS.border}`,
                borderRadius: 14,
                padding: 24,
                height: "100%",
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: COLORS.blueBg,
                  color: COLORS.blue,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: ".02em",
                }}
              >
                {b.img ? (
                  <Image
                    src={b.img}
                    alt={b.alt ?? ""}
                    title={b.title}
                    width={26}
                    height={26}
                    style={{ display: "block" }}
                  />
                ) : (
                  b.n
                )}
              </div>
              <div style={{ minWidth: 0 }}>
                <h3 style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.02em", margin: 0 }}>
                  {b.title}
                </h3>
                <p style={{ color: COLORS.gray, fontSize: 15, lineHeight: 1.55, margin: "8px 0 0" }}>
                  {b.desc}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <p style={{ textAlign: "center", color: COLORS.gray, fontSize: 14, marginTop: 32 }}>
        Every metric is live and pulled the moment you click Check Rankings.
      </p>
    </section>
  );
}
