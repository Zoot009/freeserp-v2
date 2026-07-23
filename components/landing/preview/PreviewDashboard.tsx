"use client";

import { Ic, ScoreGauge } from "./icons";
import { renderTemplate } from "@/lib/landing/template";
import { compactNumber, type PreviewData } from "@/lib/landing/previewData";

/**
 * The filled dashboard body — stat strip, insight rail, and the rank-tracking
 * table. Renders inside PreviewShell, in place of PreviewSkeleton.
 *
 * Two rules govern this component:
 *
 *  1. It NEVER calls the ranking backend. Everything comes from buildPreview(),
 *     computed in the browser, so the preview cannot spend a SERP credit.
 *
 *  2. The data is labelled as a sample (the badge lives in PreviewShell). A
 *     blurred preview of invented rankings shown without qualification would be
 *     a claim about the visitor's real search performance, and it isn't one.
 *
 * `flag` and `checkedAt` arrive as props already resolved — they are fetched and
 * formatted during the skeleton hold, not in a post-mount effect here, because
 * populating them afterwards visibly reflowed two columns.
 *
 * Everything except the first table row is blurred: the stat values partially
 * (labels stay readable, so the visitor sees WHAT is measured), the rest hard.
 */

export type PreviewDict = {
  // Shell
  close: string;
  crumbWorkspace: string;
  crumbProjects: string;
  crumbKeywords: string;
  topSearch: string;
  allProjects: string;
  autoCheck: string;
  autoCheckOff: string;
  autoCheckSub: string;
  addKeywords: string;
  language: string;
  loadingAria: string;
  // Stat strip
  statSeoScore: string;
  statSeoScoreSub: string;
  statKeywords: string;
  statKeywordsSub: string;
  statAvgPosition: string;
  statAvgPositionSub: string;
  statTop3: string;
  statTop10: string;
  statTraffic: string;
  statTrafficSub: string;
  statDomainAuthority: string;
  statBacklinks: string;
  statBacklinksSub: string;
  // Table
  tableTitle: string;
  tableSearch: string;
  tableShowing: string;
  deviceDesktop: string;
  deviceMobile: string;
  colKeyword: string;
  colPosition: string;
  colFirstCheck: string;
  colVolume: string;
  colUrl: string;
  colScores: string;
  colLastChecked: string;
  colActions: string;
  rankCta: string;
  // Rail
  railTitle: string;
  railVs: string;
  railGained: string;
  railLost: string;
  railNoChange: string;
  competitorsTitle: string;
  addCompetitor: string;
  competitorAvg: string;
  // Unlock
  hintClick: string;
  modalTitle: string;
  modalSubtitle: string;
  modalPoint1: string;
  modalPoint2: string;
  modalPoint3: string;
  modalCta: string;
  modalNote: string;
  modalDismiss: string;
  modalDisclosure: string;
};

/**
 * The unranked state is NOT a rank tile — the app renders "100+" as a small
 * chip (11px, 5px radius, ~20px tall), visually much lighter than the 30x30
 * tile beside it. The wrapper keeps the row at full height either way.
 */
function PositionBadge({ position }: { position: number | null }) {
  return (
    <span className="fsp-pos-cell">
      {position == null ? (
        <span className="fsp-chip">100+</span>
      ) : (
        <span className={`fsp-pos ${position <= 3 ? "top3" : position <= 10 ? "top10" : ""}`}>{position}</span>
      )}
    </span>
  );
}

function Stat({
  label,
  value,
  sub,
  suffix,
  bar,
  gauge,
}: {
  label: string;
  value: string | number;
  sub?: string;
  suffix?: string;
  bar?: number;
  gauge?: number;
}) {
  // Aggregates trickle in over the back half of the crawl (2.0-5.2s) — totals
  // updating WHILE rows are still landing is what a real pipeline looks like.
  const delay = fillDelay(`stat:${label}`, 2000, 3200);
  return (
    <div className="fsp-cell">
      <div className="fsp-lbl">{label}</div>
      <div className="fsp-soft">
        <div className="fsp-fill" style={{ animationDelay: `${delay}ms` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="fsp-val">
              {value}
              {suffix && <span className="fsp-of">{suffix}</span>}
            </div>
            {gauge != null && <ScoreGauge score={gauge} />}
          </div>
          {sub && <span className="fsp-tiny">{sub}</span>}
          {bar != null && (
            <div className="fsp-bar">
              <i style={{ width: `${bar}%` }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Deterministic pseudo-random delay (FNV-1a over the seed). Deliberately NOT
 * Math.random(): re-renders (the flag resolving, the favicon landing) must not
 * reshuffle delays and restart every fill animation mid-flight.
 */
function fillDelay(seed: string, min: number, spread: number): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return min + ((h >>> 0) % spread);
}

/**
 * Obscures a cell's contents while leaving the cell itself in place. With a
 * `delay`, the content pops in behind the blur at that moment — the per-value
 * arrival is what creates the "something is crawling" illusion.
 */
function Blur({
  children,
  delay,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  return (
    <span className="fsp-hard" style={{ display: "inline-flex" }} aria-hidden>
      <span
        className={delay != null ? "fsp-fill" : undefined}
        style={{
          display: "inline-flex",
          alignItems: "center",
          ...(delay != null ? { animationDelay: `${delay}ms` } : null),
          ...style,
        }}
      >
        {children}
      </span>
    </span>
  );
}

/**
 * One tracked keyword.
 *
 * Every cell is blurred EXCEPT the movement arrow. The blur is applied per-cell
 * rather than to the <tr>, precisely so the trend can stay crisp inside an
 * otherwise unreadable row — the table then communicates direction of travel
 * (some keywords climbing, some falling) without exposing a single figure.
 */
/**
 * Per-row pacing of the behind-the-blur fill. A real crawler works through
 * keywords IN ORDER — row N starts only after row N-1 has mostly landed, and
 * within a row the keyword is discovered first, then its metrics arrive left
 * to right (position, volume, URL, scores…). ROW_MS is the stride between
 * rows; the step offsets pace the cells inside one row. Deterministic jitter
 * (seeded, not random) keeps it from looking metronomic without reshuffling
 * on re-render.
 */
const ROW_MS = 1250;
const CELL_STEP = [0, 0, 560, 700, 840, 980, 1120, 1260, 1400] as const;

function Row({
  kw,
  index,
  flag,
  checkedAt,
  dict,
}: {
  kw: PreviewData["keywords"][number];
  index: number;
  flag: string | null;
  checkedAt: string;
  dict: PreviewDict;
}) {
  const up = kw.delta > 0;
  const showCta = kw.position == null || kw.position > 3;
  const base = index * ROW_MS;
  const d = (cell: number) =>
    base + CELL_STEP[cell]! + fillDelay(`${kw.keyword}:${cell}`, 0, 90);
  return (
    <>
      <td>
        <Blur delay={d(0)}>
          <span className="fsp-check" />
        </Blur>
      </td>
      <td>
        <span style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <Blur delay={d(1)} style={{ gap: 8, minWidth: 0 }}>
            <span style={{ minWidth: 18, display: "inline-flex" }}>{flag}</span>
            <span className="fsp-kw">{kw.keyword}</span>
          </Blur>
          {/* Crisp, but it still ARRIVES like the rest — shortly after its
              keyword is discovered, before the metric cells land. */}
          <span
            className={`fsp-trend fsp-fill ${up ? "up" : "down"}`}
            style={{ animationDelay: `${d(1) + 380}ms` }}
          >
            {up ? "▲" : "▼"} {Math.abs(kw.delta)}
          </span>
        </span>
      </td>
      <td>
        <Blur delay={d(2)}>
          <PositionBadge position={kw.position} />
        </Blur>
      </td>
      <td>
        <Blur delay={d(3)}>
          <PositionBadge position={kw.firstPosition} />
        </Blur>
      </td>
      <td>
        <Blur delay={d(4)} style={{ fontVariantNumeric: "tabular-nums" }}>
          {kw.volume.toLocaleString()}
        </Blur>
      </td>
      <td>
        <Blur delay={d(5)}>
          <span className="fsp-url">{kw.url ?? "—"}</span>
        </Blur>
      </td>
      <td>
        <Blur delay={d(6)}>
          <span className="fsp-psks">
            <span className="slot ps">
              <span className="fsp-chip">{kw.pageScore}</span>
            </span>
            <span style={{ color: "var(--text-mute)" }}>/</span>
            <span className="slot">
              <span className="fsp-chip">{kw.keywordScore}</span>
            </span>
          </span>
        </Blur>
      </td>
      <td>
        <Blur delay={d(7)} style={{ gap: 6, whiteSpace: "nowrap" }}>
          <span className="fsp-tiny">{checkedAt}</span>
          <i className="fsp-dot" />
        </Blur>
      </td>
      <td>
        <Blur delay={d(8)}>
          <span className="fsp-act">
            <span className="fsp-act-btn">
              <Ic.star />
            </span>
            <span className="fsp-act-btn">
              <Ic.refresh />
            </span>
            <span className="fsp-act-btn">
              <Ic.dots />
            </span>
            {showCta && (
              <span className="fsp-rank-cta">
                {dict.rankCta}
                {/* Fixed-width slot so the arrow lines up down the column whether
                    the current rank is "#7" or "#100+". */}
                <span className="from">{kw.position == null ? "#100+" : `#${kw.position}`}</span>
                {/* A literal arrow, as in the app — it sits on the text baseline
                    and reads lighter than a stroked SVG would. */}
                →<span className="to">#1</span>
              </span>
            )}
          </span>
        </Blur>
      </td>
    </>
  );
}

/**
 * Column widths, declared once and shared by the skeleton and the filled table.
 *
 * A <colgroup> rather than per-<th> widths because it binds header and body to
 * the SAME track sizes — which is what makes the columns line up, and what
 * guarantees the skeleton and the filled table have identical geometry.
 */
export const COLS: (number | string)[] = [40, "auto", 120, 100, 100, "22%", 120, 140, 190];

export function Cols() {
  return (
    <colgroup>
      {COLS.map((w, i) => (
        <col key={i} style={w === "auto" ? undefined : { width: w }} />
      ))}
    </colgroup>
  );
}

export default function PreviewDashboard({
  data,
  dict,
  flag,
  checkedAt,
  locked,
  unlockOpen,
  onRequestUnlock,
  children,
}: {
  data: PreviewData;
  dict: PreviewDict;
  flag: string | null;
  checkedAt: string;
  /**
   * The data is blurred from the first frame regardless — this only gates the
   * centred prompt and the click-to-unlock, which arrive after the behind-the-
   * blur fill has finished playing out.
   */
  locked: boolean;
  unlockOpen: boolean;
  onRequestUnlock: () => void;
  /** The unlock card, rendered inside the table box when open. */
  children?: React.ReactNode;
}) {
  return (
    <div>
      {/* Stat strip — labels crisp, values blurred */}
      <div className="fsp-strip">
        <Stat
          label={dict.statSeoScore}
          value={data.seoScore}
          sub={dict.statSeoScoreSub}
          gauge={data.seoScore}
        />
        <Stat
          label={dict.statKeywords}
          value={data.keywordsTracked}
          sub={renderTemplate(dict.statKeywordsSub, { count: String(data.top3) })}
        />
        <Stat
          label={dict.statAvgPosition}
          value={data.avgPosition.toFixed(1)}
          sub={renderTemplate(dict.statAvgPositionSub, { count: String(data.top10) })}
        />
        <Stat
          label={dict.statTop3}
          value={data.top3}
          sub={`${Math.round((data.top3 / data.keywordsTracked) * 100)}%`}
        />
        <Stat
          label={dict.statTop10}
          value={data.top10}
          sub={`${Math.round((data.top10 / data.keywordsTracked) * 100)}%`}
        />
        <Stat label={dict.statTraffic} value={compactNumber(data.estTraffic)} sub={dict.statTrafficSub} />
        <Stat
          label={dict.statDomainAuthority}
          value={data.domainAuthority}
          suffix=" / 100"
          bar={data.domainAuthority}
        />
        <Stat label={dict.statBacklinks} value={compactNumber(data.backlinks)} sub={dict.statBacklinksSub} />
      </div>

      {/* The unlock card anchors to THIS wrapper, not the table box: the table
          card is overflow:hidden (its 16px radius clips the corners) and with
          only 4 rows it is shorter than the card, which got the card clipped
          mid-bullet. Here it centres over the full two-column body instead. */}
      <div style={{ position: "relative" }}>
      <div className="fsp-layout">
        <div className="fsp-rail-col">
          <div className="fsp-card" aria-hidden>
            <div className="fsp-card-h" style={{ marginBottom: 10 }}>
              <span className="fsp-card-t">{dict.railTitle}</span>
              <span className="fsp-pill-toggle">
                <span className="on">1d</span>
                <span>7d</span>
                <span>15d</span>
                <span>30d</span>
              </span>
            </div>
            <div className="fsp-soft">
              {/* Derived summaries land near the end, once the rows they
                  summarise have finished arriving. */}
              <div className="fsp-fill" style={{ animationDelay: `${fillDelay("rail:improved", 4600, 900)}ms` }}>
              <span style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span className="fsp-hero-n">{data.top3}</span>
                <span className="fsp-tiny">{dict.railVs}</span>
              </span>
              <div style={{ marginTop: 10 }}>
                <div className="fsp-insight-row">
                  <span style={{ color: "var(--text-soft)" }}>{dict.railGained}</span>
                  <span style={{ fontWeight: 600, color: "var(--pos)" }}>{data.top3} ↑</span>
                </div>
                <div className="fsp-insight-row">
                  <span style={{ color: "var(--text-soft)" }}>{dict.railLost}</span>
                  <span style={{ fontWeight: 600, color: "var(--neg)" }}>0 ↓</span>
                </div>
                <div className="fsp-insight-row">
                  <span style={{ color: "var(--text-soft)" }}>{dict.railNoChange}</span>
                  <span style={{ fontWeight: 600, color: "var(--text-soft)" }}>
                    {data.keywordsTracked - data.top3} →
                  </span>
                </div>
              </div>
              </div>
            </div>
          </div>

          <div className="fsp-card" aria-hidden>
            <div className="fsp-card-h">
              <span className="fsp-card-t">{dict.competitorsTitle}</span>
              <span className="fsp-tiny">1</span>
            </div>
            <span className="fsp-dd">
              {dict.addCompetitor}
              <Ic.chevD />
            </span>
            <div
              className="fsp-soft fsp-fill"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginTop: 12,
                animationDelay: `${fillDelay("rail:competitor", 5100, 800)}ms`,
              }}
            >
              <span className="fsp-favicon" style={{ width: 28, height: 28, fontSize: 12, borderRadius: 8 }}>
                {data.competitor.charAt(0)}
              </span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{data.competitor}</div>
                <span className="fsp-chip pos" style={{ marginTop: 3 }}>
                  {renderTemplate(dict.competitorAvg, { pos: String(data.competitorAvgPosition) })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="fsp-serp-card">
          <div className="fsp-serp-h">
            <span className="fsp-card-t">{dict.tableTitle}</span>
            <div className="fsp-serp-search" aria-hidden>
              <span className="ic">
                <Ic.search />
              </span>
              <input readOnly tabIndex={-1} placeholder={dict.tableSearch} />
            </div>
            <span className="fsp-tiny">
              {renderTemplate(dict.tableShowing, { count: String(data.keywords.length) })}
            </span>
            <span className="fsp-device" aria-hidden>
              <span className="on">
                <Ic.monitor size={14} />
                {renderTemplate(dict.deviceDesktop, { count: String(data.keywords.length) })}
              </span>
              <span>
                <Ic.smartphone />
                {renderTemplate(dict.deviceMobile, { count: "0" })}
              </span>
            </span>
          </div>

          {/* The table is the trigger: once locked, clicking anywhere on it
              opens the unlock card, which is anchored inside this box. Before
              the lock lands there is nothing to unlock, so no click handler. */}
          <div
            className="fsp-tablearea"
            style={locked ? undefined : { cursor: "default" }}
            onClick={locked ? onRequestUnlock : undefined}
            role={locked ? "button" : undefined}
            tabIndex={locked ? 0 : undefined}
            onKeyDown={
              locked
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onRequestUnlock();
                    }
                  }
                : undefined
            }
            aria-label={locked ? dict.hintClick : undefined}
          >
            <div className="fsp-table-wrap">
              <table className="fsp-tbl">
                <Cols />
                <thead>
                  <tr>
                    <th>
                      <span className="fsp-check" />
                    </th>
                    <th>{dict.colKeyword}</th>
                    <th>{dict.colPosition}</th>
                    <th>{dict.colFirstCheck}</th>
                    <th>{dict.colVolume}</th>
                    <th>{dict.colUrl}</th>
                    <th>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                        {dict.colScores}
                        <Ic.info />
                      </span>
                    </th>
                    <th>{dict.colLastChecked}</th>
                    <th>{dict.colActions}</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Row STRUCTURE appears at once; the values inside pop in at
                      scattered moments behind the blur (see Blur's delay).
                      aria-hidden throughout: these figures are illustrative, and
                      a screen reader must not recite them as measurements. */}
                  {data.keywords.map((kw, i) => (
                    <tr key={kw.keyword} className="fsp-rise" aria-hidden>
                      <Row kw={kw} index={i} flag={flag} checkedAt={checkedAt} dict={dict} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <span className="fsp-sweep" aria-hidden>
              <i />
            </span>

            {/* Centred over the freshly-blurred table — appears WITH the lock,
                so it reads as the reason the data was curtained. Hidden again
                once the card is open. */}
            {locked && !unlockOpen && (
              <span className="fsp-hint">
                <span className="zap">
                  <Ic.zap size={14} />
                </span>
                {dict.hintClick}
              </span>
            )}

          </div>
        </div>
      </div>

      {unlockOpen && children}
      </div>
    </div>
  );
}
