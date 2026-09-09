import { Reveal } from "@/components/site/Reveal";
import { Head } from "./Head";
import { T, section, container } from "./theme";

/**
 * Why the numbers can be trusted.
 *
 * Every rank tracker shows a position; the question a buyer actually has is
 * whether it is real. Three numbered steps, numbered rather than iconed because
 * they are a sequence of guarantees and a row of decorative icons reads as
 * feature marketing rather than an argument.
 *
 * Makes no claim the product cannot back: each point is about how a check is
 * run, not an accuracy percentage nobody can verify.
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
    text: "Each check is stored with its date, so you see the trend a single position can never show you — and what happened after you changed something.",
  },
];

export function Trust() {
  return (
    <section style={section()}>
      <div style={container()}>
        <Head
          eyebrow="Accuracy"
          title="Positions you can act on"
          sub="A number is only useful if you know how it was produced. Here is how every position in FreeSERP is measured."
        />

        <div className="fs-grid-3" style={{ marginTop: 64 }}>
          {POINTS.map((p, i) => (
            <Reveal key={p.title} delay={(i % 3) * 0.08}>
              <div
                style={{
                  border: `1px solid ${T.border}`,
                  borderRadius: T.radius,
                  background: T.bg,
                  padding: 28,
                  height: "100%",
                }}
              >
                {/* The step number as the card's mark. A tinted square rather
                    than a filled accent block: three solid blue tiles in a row
                    would pull harder than the sentences they number. */}
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 6,
                    background: T.accentSoft,
                    color: T.accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 15,
                    fontWeight: 600,
                    marginBottom: 24,
                  }}
                >
                  {i + 1}
                </div>
                <h3
                  style={{
                    color: T.ink,
                    fontSize: T.h3,
                    fontWeight: T.headingWeight,
                    letterSpacing: "-0.02em",
                    margin: 0,
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    marginTop: 10,
                    color: T.bodySoft,
                    fontSize: T.bodySize,
                    lineHeight: 1.65,
                  }}
                >
                  {p.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
