import Image from "next/image";

type Feature = {
  tag: string;
  title: string;
  body: string;
  checks?: string[];
  shot: string;
  alt: string;
  width: number;
  height: number;
  /** Screenshot on the left, copy on the right — the zig-zag alternates. */
  flip?: boolean;
};

const FEATURES: Feature[] = [
  {
    tag: "Keyword Rank Tracker",
    title: "Daily positions in any country, with history",
    body: "Add the keywords you care about, pick the engine, the location and the device, and watch the line move. Checked every day without you clicking anything.",
    checks: [
      "Per-keyword history charts and SERP snapshots",
      "Email alerts when a position jumps or drops",
      "Search Console and GA4 clicks beside your positions — free",
    ],
    shot: "/screenshots/02-rank-tracker.png",
    alt: "Keyword rank history",
    width: 1127,
    height: 848,
  },
  {
    tag: "Competitor Analysis",
    title: "Your page against the ones outranking it",
    body: "Pick a keyword, pick the sites above you, and get the side-by-side: word count, headings, schema, internal links, speed. The gap stops being a mystery.",
    checks: [
      "Full comparison table, exportable to CSV and PDF",
      "Competitor Spy for the pages they actually rank with",
    ],
    shot: "/screenshots/03-competitor-analysis.png",
    alt: "Competitor comparison table",
    width: 1127,
    height: 848,
    flip: true,
  },
  {
    tag: "Website & Page Audit",
    title: "A real browser crawl and 63 SEO rules",
    body: "Audit a single page or crawl the whole site. Every issue comes back ranked by impact, with a plain-English fix and an AI plan you can act on.",
    checks: [
      "Ask AI about any issue inside the report",
      "Audit history, so you can see what you fixed",
      "PDF export for the whole report",
    ],
    shot: "/screenshots/04-page-audit.png",
    alt: "Page audit report with AI assistant",
    width: 1141,
    height: 840,
  },
  {
    tag: "Google Maps Tracker",
    title: "A geo-grid of local rankings, block by block",
    body: "Local rank is not one number. Drop a grid over your service area and see where you show up in the pack and where you vanish, point by point, with the competitors who hold each spot.",
    checks: [
      "Scan history, so you can compare weeks",
      "Shareable scan report per keyword",
    ],
    shot: "/screenshots/05-maps-grid.png",
    alt: "Google Maps geo-grid scan",
    width: 1135,
    height: 858,
    flip: true,
  },
  {
    tag: "AI Internal Linking",
    title: "Your link graph, with orphans and hubs surfaced",
    body: "Crawl the site once and see how the pages connect. The pages nobody links to, the pages carrying everything, and the links worth adding next.",
    shot: "/screenshots/06-link-graph.png",
    alt: "Internal link graph",
    width: 1125,
    height: 846,
  },
];

function Copy({ feature }: { feature: Feature }) {
  return (
    <div>
      <div className="l2-tag l2-mono">{feature.tag}</div>
      <h3 className="l2-h3">{feature.title}</h3>
      <p className="l2-feature-p">{feature.body}</p>
      {feature.checks && (
        <ul className="l2-checks">
          {feature.checks.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Shot({ feature }: { feature: Feature }) {
  return (
    <Image
      src={feature.shot}
      alt={feature.alt}
      width={feature.width}
      height={feature.height}
      sizes="(max-width: 1024px) 100vw, 600px"
    />
  );
}

export default function Features() {
  return (
    <section className="l2-features">
      <div className="l2-features-stack">
        {FEATURES.map((feature) => (
          <div
            key={feature.tag}
            className={feature.flip ? "l2-feature l2-feature-flip" : "l2-feature"}
          >
            {feature.flip ? (
              <>
                <Shot feature={feature} />
                <Copy feature={feature} />
              </>
            ) : (
              <>
                <Copy feature={feature} />
                <Shot feature={feature} />
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
