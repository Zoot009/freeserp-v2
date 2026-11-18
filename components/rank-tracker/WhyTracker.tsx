import Image from "next/image";
import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { COLORS } from "@/components/site/constants";
import { WHY_CALLOUTS } from "./data";

export function WhyTracker() {
  return (
    <section
      id="why-tracker"
      className="fs-serp-section"
      style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 40px 0", scrollMarginTop: 80 }}
    >
      <SectionHead
        title="What is rank tracking, and why monitor it?"
      />
      <div
        className="fs-row fs-why-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 56,
          marginTop: 56,
          alignItems: "start",
        }}
      >
        <Reveal>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: COLORS.gray, margin: 0 }}>
            Rank tracking means recording the position your pages hold in Google for each target keyword,
            again and again, so you can see the trend instead of a single moment. Checking by hand in your
            own browser cannot do that reliably — Google tailors results to your location, history, account
            and device, so the position you see is rarely the one your customers see.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: COLORS.gray, margin: "16px 0 0" }}>
            A rank tracker runs a clean, depersonalized query from the location and device you choose,
            records your spot in the top 100, and keeps every result. Over weeks, that history shows
            whether a content update worked, when an algorithm update hit, and which competitors are
            climbing past you — long before the change shows up as lost traffic.
          </p>
          <div
            style={{
              marginTop: 20,
              padding: "14px 18px",
              borderRadius: 10,
              borderLeft: `3px solid ${COLORS.blue}`,
              background: COLORS.blueBg,
              color: COLORS.black,
              fontSize: 15,
              lineHeight: 1.5,
            }}
          >
            Run a free check above for your real position today, then save the keyword to a project to
            watch it move over time.
          </div>
        </Reveal>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {WHY_CALLOUTS.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.08}>
              <div
                className="fs-card"
                style={{
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 14,
                  padding: 22,
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                }}
              >
                {c.img && (
                  <div
                    style={{
                      flexShrink: 0,
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: COLORS.blueBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      src={c.img}
                      alt={c.alt ?? ""}
                      title={c.title}
                      width={26}
                      height={26}
                      style={{ display: "block" }}
                    />
                  </div>
                )}
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.02em", margin: 0 }}>
                    {c.title}
                  </h3>
                  <p style={{ color: COLORS.gray, fontSize: 15, lineHeight: 1.55, margin: "6px 0 0" }}>
                    {c.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
