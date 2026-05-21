import Image from "next/image";
import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { COLORS } from "@/components/site/constants";
import { WHY_CALLOUTS } from "./data";

export function WhyChecker() {
  return (
    <section
      id="why-checker"
      style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 40px 0", scrollMarginTop: 80 }}
    >
      <SectionHead
        tag="Why It Matters"
        title="Why use a free SERP checker instead of Google?"
      />
      <div
        className="fs-row"
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
            Searching for your own keyword in Google does not show your real rank. Google
            personalizes results by your location, browser history, account, and device. The
            position you see is not the position your customers see.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: COLORS.gray, margin: "16px 0 0" }}>
            A SERP checker fixes this by running an unbiased query from a clean server, with
            no personalization, from the country and device you specify. It also pulls the
            full top 100, not just page 1, so you can see exactly how far from page 1 you
            are and which competitors are between you and the top.
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
            Run a check above to see your actual position — not the one Google shows logged-in
            to your own browser.
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
