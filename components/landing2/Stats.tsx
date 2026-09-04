import { STATS } from "./data";

export default function Stats() {
  return (
    <section className="l2-stats">
      <div className="l2-stats-grid">
        {STATS.map((s) => (
          <div key={s.label} className="l2-stat">
            <div className="l2-stat-n l2-mono">{s.n}</div>
            <div className="l2-stat-l">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
