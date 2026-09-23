import Image from "next/image";
import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { COLORS } from "@/components/site/constants";
import { WHY_CALLOUTS } from "./data";

export function WhyTracker() {
  return (
    <section
      id="why-maps-rank-tracking"
      className="fs-serp-section"
      style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 40px 0", scrollMarginTop: 80 }}
    >
      <SectionHead
        tag="Why It Matters"
        title="Why you can't check your own Maps ranking"
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
            Every local business owner has done the same test: open Google Maps, type the
            service, see themselves near the top, and conclude the listing is fine. The test is
            worthless. You are signed into your own account, searching from inside your own
            premises, on a device that has visited your own profile — four separate reasons
            Google ranks you higher for you than for anyone else.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: COLORS.gray, margin: "16px 0 0" }}>
            A Google Maps ranking checker removes all four. Each search runs signed-out, from a
            clean query, at coordinates you choose rather than the ones you happen to be
            standing on. Run it across a spread of points and the shape of your local visibility
            appears: the streets where you hold the Map Pack, the edge where you drop out of the
            top three, and the distance at which you stop appearing at all.
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
            The useful question is not &ldquo;what is my Google Maps ranking?&rdquo; — it is
            &ldquo;how far from my door does my ranking survive?&rdquo;
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
