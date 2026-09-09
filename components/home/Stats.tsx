import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { COLORS } from "@/components/site/constants";

/**
 * The scale of the data, as figures rather than sentences.
 *
 * Every number here is a claim the site already makes in prose — the hero badge
 * and the plan tables carry the same 190 countries and 50M keywords. Nothing new
 * is asserted; it is the same evidence, said in the form people actually read on
 * a landing page, which is a big number and four words under it.
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
    note: "Plus city-level targeting and desktop or mobile results.",
  },
  {
    figure: "Top 100",
    label: "Results checked",
    note: "Not just page one — we look far enough down to see you climbing.",
  },
  {
    figure: "Daily",
    label: "Position updates",
    note: "One position is trivia. The line it draws is the signal.",
  },
];

export function Stats() {
  return (
    <section
      className="fs-section"
      style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 40px" }}
    >
      <SectionHead
        tag="SCALE"
        title="Built on data wide enough to be useful"
        sub="Rank tracking is only worth anything if it reaches the searches you actually care about, in the places your customers actually are."
      />

      {/*
        One row, four figures, separated rather than boxed. Cards would put a
        border around each number and turn a single fact into four competing
        ones — these are meant to be read across, not compared.
      */}
      <div className="fs-stats-row" style={{ marginTop: 56 }}>
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={(i % 4) * 0.08}>
            <div style={{ padding: "4px 8px" }}>
              <div
                style={{
                  fontSize: "clamp(38px, 5vw, 60px)",
                  fontWeight: 600,
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                  color: COLORS.blue,
                }}
              >
                {s.figure}
              </div>
              <div
                style={{
                  marginTop: 14,
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: "-0.2px",
                }}
              >
                {s.label}
              </div>
              <p
                style={{
                  marginTop: 6,
                  color: COLORS.gray,
                  fontSize: 14,
                  lineHeight: 1.55,
                  maxWidth: 260,
                }}
              >
                {s.note}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
