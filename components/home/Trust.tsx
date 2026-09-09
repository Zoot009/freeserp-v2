import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { COLORS } from "@/components/site/constants";

/**
 * Why the numbers can be trusted.
 *
 * Every rank tracker shows you a position; the question a buyer actually has is
 * whether that position is real. This answers it in three numbered steps —
 * numbered rather than iconed because they are a sequence of guarantees, and a
 * row of decorative icons reads as feature marketing rather than an argument.
 *
 * Deliberately makes no claim the product cannot back: each point is about how
 * a check is run, not about accuracy percentages nobody can verify.
 */
const POINTS: { title: string; text: string }[] = [
  {
    title: "A real search, not an estimate",
    text: "Every position comes from an actual Google results page for your keyword, in your country and on your device — not modelled from a database of averages.",
  },
  {
    title: "The same conditions every day",
    text: "Location, language and device are pinned to the keyword when you add it, so a move in the chart is the ranking moving, never the setup drifting under it.",
  },
  {
    title: "Kept as history, not a snapshot",
    text: "Each check is stored with its date, so you can see the trend a single position can never show you — and what happened after you changed something.",
  },
];

export function Trust() {
  return (
    <section
      className="fs-section"
      style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 40px" }}
    >
      <SectionHead
        tag="ACCURACY"
        title="Positions you can act on"
        sub="A number is only useful if you know how it was produced. Here is how every position in FreeSERP is measured."
      />

      <div className="fs-grid-3" style={{ marginTop: 56 }}>
        {POINTS.map((p, i) => (
          <Reveal key={p.title} delay={(i % 3) * 0.08}>
            <div
              className="fs-card"
              style={{
                border: `1px solid ${COLORS.border}`,
                borderRadius: 12,
                padding: 26,
                height: "100%",
              }}
            >
              {/* The step number, as the card's own mark. Outlined rather than
                  filled: three solid blue blocks in a row would pull harder
                  than the sentences they are numbering. */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 8,
                  border: `1px solid ${COLORS.blue}`,
                  color: COLORS.blue,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  fontWeight: 600,
                  marginBottom: 28,
                }}
              >
                {i + 1}
              </div>
              <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em" }}>
                {p.title}
              </div>
              <p
                style={{
                  marginTop: 10,
                  color: COLORS.gray,
                  fontSize: 15,
                  lineHeight: 1.6,
                }}
              >
                {p.text}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
