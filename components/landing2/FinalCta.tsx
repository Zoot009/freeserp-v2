import { appUrl } from "@/components/site/constants";
import { STATS } from "./data";

export default function FinalCta() {
  return (
    <section id="signup" className="l2-signup">
      <div className="l2-signup-panel">
        <div aria-hidden="true" className="l2-signup-glow" />
        <div className="l2-signup-body">
          <h2 className="l2-signup-h2">Find out where you actually rank</h2>
          <p className="l2-signup-p">
            Free plan, every tool unlocked, no credit card. Paid plans start at
            $19/month when you outgrow it. Your first report is about five minutes
            away.
          </p>
          <div className="l2-signup-actions">
            {/* Every other CTA on the page is an in-page anchor down to this
                section, exactly as the design has them. This is where the scroll
                stops, so it is the one that has to cross to the app. */}
            <a href={appUrl("/signup")} className="l2-signup-btn">
              Create a free account
            </a>
            <span className="l2-signup-domain l2-mono">freeserp.com</span>
          </div>
        </div>
        <div className="l2-signup-stats">
          {STATS.map((s) => (
            <div key={s.shortLabel} className="l2-signup-stat">
              <div className="l2-signup-stat-n l2-mono">{s.n}</div>
              <div className="l2-signup-stat-l">{s.shortLabel}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
