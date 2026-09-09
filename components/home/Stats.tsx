import { Reveal } from "@/components/site/Reveal";
import { Head } from "./Head";
import { T, section, container } from "./theme";

/**
 * The scale of the data, as figures rather than sentences.
 *
 * Every number is a claim the page already makes in prose — the hero pill and
 * the plan tables carry the same 190 countries and 50M keywords. Nothing new is
 * asserted; it is the same evidence in the form a landing page is read in.
 */
const STATS: { figure: string; label: string; note: string }[] = [
  {
    figure: "50M+",
    label: "Keywords indexed",
    note: "Search terms we can pull ranking data for on demand.",
  },
  {
    figure: "190+",
    label: "Countries",
    note: "Plus city-level targeting, on desktop or mobile.",
  },
  {
    figure: "Top 100",
    label: "Results checked",
    note: "Far enough down the page to see you climbing toward it.",
  },
  {
    figure: "Daily",
    label: "Position updates",
    note: "One position is trivia. The line it draws is the signal.",
  },
];

export function Stats() {
  return (
    <section style={section(true)}>
      <div style={container()}>
        <Head
          eyebrow="Scale"
          title="Wide enough to cover the searches you care about"
          sub="Rank tracking is only worth anything if it reaches the terms your customers actually type, in the places they actually are."
        />

        {/* Four figures read across, not four cards compared against each other
            — so no borders between them and a wide gap doing the separating. */}
        <div className="fs-stats-row" style={{ marginTop: 64 }}>
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={(i % 4) * 0.08}>
              <div>
                <div
                  style={{
                    fontSize: "clamp(36px, 4.4vw, 48px)",
                    fontWeight: T.headingWeight,
                    letterSpacing: T.tightTracking,
                    lineHeight: 1,
                    color: T.ink,
                  }}
                >
                  {s.figure}
                </div>
                <div
                  style={{
                    marginTop: 14,
                    fontSize: T.bodySize,
                    fontWeight: 600,
                    color: T.ink,
                  }}
                >
                  {s.label}
                </div>
                <p
                  style={{
                    marginTop: 6,
                    color: T.bodySoft,
                    fontSize: T.small,
                    lineHeight: 1.6,
                    maxWidth: 260,
                  }}
                >
                  {s.note}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
