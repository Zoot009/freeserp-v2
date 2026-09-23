import Image from "next/image";
import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { COLORS } from "@/components/site/constants";
import { WHY_CALLOUTS } from "./data";

export function WhyGrid() {
  return (
    <section
      id="why-a-grid"
      className="fs-serp-section"
      style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 40px 0", scrollMarginTop: 80 }}
    >
      <SectionHead tag="Why It Matters" title="Why a grid, and not a number" />
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
            Ask what a local business ranks for &ldquo;dentist near me&rdquo; and the honest
            answer is a question back: near who? Google Maps folds the searcher&apos;s location
            into the ranking, so the result is not one position that happens to vary. There is
            genuinely a different ranking at every point on the map.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: COLORS.gray, margin: "16px 0 0" }}>
            That makes a single number the wrong shape for the answer. Two businesses can both
            average eighth: one is fourth across a whole city, the other is first outside its
            door and absent a mile away. They need completely different work, and no average
            will ever tell them apart.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: COLORS.gray, margin: "16px 0 0" }}>
            A grid answers the question in the shape it was asked. Lay points across the area,
            search from each one, and what comes back is a picture of how far your visibility
            actually reaches.
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
            The number you want is not your rank. It is the distance at which your rank stops
            being good enough.
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
