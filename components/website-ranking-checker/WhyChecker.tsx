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
        title="Why check your website ranking with a checker?"
      />

      <Reveal>
        <div style={{ maxWidth: 720, margin: "40px auto 0" }}>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: COLORS.gray, margin: 0 }}>
            Googling your own keywords does not show your real position. Even in a private window, results are
            shaped by your location and device, and a signed-in browser adds your history and account on top —
            often making your site look 5 to 15 positions higher than it really ranks. Search Console helps, but
            it reports an average across every location and device, and only for your own site.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: COLORS.gray, margin: "16px 0 0" }}>
            A website ranking checker answers the question directly: it runs an unbiased query from a clean
            server, in the country and on the device you pick, and returns your exact position in the top 100.
            You see how far you are from page 1, which of your pages Google chose, and which competitors stand
            between you and the top — the starting point for deciding what to fix.
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
            Run a check above to see your real website ranking, then use the guide below to read the result and
            improve it.
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
