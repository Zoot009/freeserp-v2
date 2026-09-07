const POINTS = [
  {
    title: "See the position, not a guess",
    body: "Real checks against the live SERP, per country and per device, with the snapshot kept so you can look back.",
  },
  {
    title: "Get told, don't go looking",
    body: "Alerts fire when a keyword jumps or drops, so the dashboard is somewhere you go on purpose.",
  },
  {
    title: "Plain-English next step",
    body: "Every audit issue comes with a fix you can hand to whoever builds the site, and an AI panel that reads your own report data.",
  },
];

export default function Problem() {
  return (
    <section className="l2-problem">
      <div className="l2-problem-grid">
        <div>
          <div className="l2-eyebrow l2-mono">The problem</div>
          <h2 className="l2-h2">You know traffic is down. Nobody tells you why.</h2>
          <p className="l2-copy">
            Analytics shows the drop after it happens. It does not tell you that
            you slipped from position 4 to position 11 last Tuesday, that a
            competitor rewrote the page above you, or that your best page has no
            internal links pointing at it.
          </p>
          <p className="l2-copy">
            FreeSERP watches all of that on a schedule and tells you when it
            changes.
          </p>
        </div>
        <div className="l2-cards">
          {POINTS.map((p) => (
            <div key={p.title} className="l2-card">
              <div className="l2-card-t">{p.title}</div>
              <p className="l2-card-p">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
