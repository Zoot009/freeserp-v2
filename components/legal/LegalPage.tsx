import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { COLORS } from "@/components/site/constants";
import type { LegalBlock, LegalDoc } from "./data";

const mono = "var(--font-geist-mono), monospace";

function Block({ block }: { block: LegalBlock }) {
  if (block.type === "p") {
    return (
      <p style={{ color: COLORS.gray, fontSize: 16, lineHeight: 1.7, margin: "0 0 14px" }}>
        {block.text}
      </p>
    );
  }

  if (block.type === "list") {
    return (
      <ul style={{ listStyle: "none", margin: "4px 0 14px", padding: 0 }}>
        {block.items.map((it) => (
          <li
            key={it.text}
            style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10 }}
          >
            <span
              style={{
                marginTop: 9,
                width: 6,
                height: 6,
                borderRadius: 2,
                background: COLORS.blue,
                flexShrink: 0,
              }}
            />
            <span style={{ color: COLORS.gray, fontSize: 16, lineHeight: 1.6 }}>
              {it.lead && (
                <strong style={{ color: COLORS.black, fontWeight: 600 }}>{it.lead} </strong>
              )}
              {it.text}
            </span>
          </li>
        ))}
      </ul>
    );
  }

  // contact box
  return (
    <div
      style={{
        marginTop: 18,
        padding: "22px 24px",
        border: `1px solid ${COLORS.border}`,
        borderRadius: 14,
        background: COLORS.blueBg,
      }}
    >
      <p style={{ fontFamily: mono, fontSize: 14, color: COLORS.black, margin: 0 }}>
        Email:{" "}
        <a href={`mailto:${block.email}`} style={{ color: COLORS.blue, textDecoration: "none" }}>
          {block.email}
        </a>
      </p>
      {block.address && (
        <p style={{ fontFamily: mono, fontSize: 14, color: COLORS.black, margin: "8px 0 0" }}>
          Address: {block.address}
        </p>
      )}
    </div>
  );
}

export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <Nav />

      {/* Dark header — sits behind the fixed nav so its white text stays legible. */}
      <header style={{ background: "#0a0a14", paddingTop: 140, paddingBottom: 72 }}>
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 40px" }}>
          <Reveal>
            <span
              style={{
                fontFamily: mono,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: COLORS.blue,
              }}
            >
              {doc.eyebrow}
            </span>
            <h1
              style={{
                color: "#fff",
                fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 600,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                margin: "16px 0 0",
              }}
            >
              {doc.title}
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,.62)",
                fontSize: 16,
                lineHeight: 1.55,
                maxWidth: 560,
                margin: "18px 0 0",
              }}
            >
              {doc.intro}
            </p>
            <p
              style={{
                fontFamily: mono,
                fontSize: 13,
                color: "rgba(255,255,255,.45)",
                margin: "22px 0 0",
              }}
            >
              Last updated: {doc.updated}
            </p>
          </Reveal>
        </div>
      </header>

      <main style={{ maxWidth: 880, margin: "0 auto", padding: "60px 40px 110px" }}>
        {doc.sections.map((s, i) => (
          <Reveal key={s.heading} delay={Math.min(i, 6) * 0.03}>
            <section style={{ marginBottom: 40 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 12 }}>
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: 13,
                    fontWeight: 600,
                    color: COLORS.blue,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2
                  style={{
                    fontSize: 23,
                    fontWeight: 600,
                    letterSpacing: "-0.03em",
                    margin: 0,
                  }}
                >
                  {s.heading}
                </h2>
              </div>
              <div>
                {s.blocks.map((b, bi) => (
                  <Block key={bi} block={b} />
                ))}
              </div>
            </section>
          </Reveal>
        ))}
      </main>

      <Footer />
    </>
  );
}
