import Image from "next/image";
import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { COLORS } from "@/components/site/constants";
import { FEATURE_BLOCKS } from "./data";

export function WhyChecker() {
  return (
    <section
      id="why-checker"
      style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 40px 0", scrollMarginTop: 80 }}
    >
      <SectionHead
        tag="Why It Matters"
        title="Why use a website ranking checker?"
      />

      <Reveal>
        <div style={{ maxWidth: 720, margin: "40px auto 0" }}>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: COLORS.gray, margin: 0 }}>
            Checking your website ranking from your own browser does not show your real position. Results are
            personalized based on your location, browsing history, account, and device. The ranking you see for
            your site is not the ranking your customers see — this gap can be 5 to 15 positions higher than your
            actual rank.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: COLORS.gray, margin: "16px 0 0" }}>
            A website ranking checker fixes this by running an unbiased query from a clean server, with no
            personalization, from the country and device you specify. It also pulls the full top 100 results,
            not just page 1, so you can see exactly how far from page 1 you are and which competitors are
            sitting between you and the top position.
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
            Run a check above to see your actual website ranking — not the one your browser shows when you are
            logged in.
          </div>
        </div>
      </Reveal>

      <div style={{ marginTop: 72 }}>
        {FEATURE_BLOCKS.map((block, i) => (
          <Reveal key={block.title} delay={i * 0.06}>
            <div
              style={{
                display: "flex",
                gap: 24,
                alignItems: "flex-start",
                padding: "40px 0",
                borderTop: `1px solid ${COLORS.border}`,
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: COLORS.blueBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 4,
                }}
              >
                <Image
                  src={block.img}
                  alt={block.alt}
                  title={block.title}
                  width={28}
                  height={28}
                  style={{ display: "block" }}
                />
              </div>
              <div style={{ minWidth: 0 }}>
                <h2
                  style={{
                    fontSize: "clamp(20px, 2.5vw, 28px)",
                    fontWeight: 600,
                    letterSpacing: "-0.03em",
                    margin: "0 0 14px",
                  }}
                >
                  {block.title}
                </h2>
                {block.paras.map((para, j) => (
                  <p
                    key={j}
                    style={{
                      fontSize: 16,
                      lineHeight: 1.65,
                      color: COLORS.gray,
                      margin: j === 0 ? 0 : "12px 0 0",
                    }}
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
