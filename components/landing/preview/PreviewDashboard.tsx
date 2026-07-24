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
  /** Caption used when the score shown is a real audit of the visitor's site. */
  statSeoScoreReal: string;
  statKeywords: string;
  statKeywordsSub: string;
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
  clear = false,
}: {
  label: string;
  value: string | number;
  sub?: string;
  suffix?: string;
  bar?: number;
  gauge?: number;
  /**
   * Render this cell unblurred. Used for the tracked-keyword count, which the
   * table already states in plain text ("Showing 4 of 4") — blurring a number
   * the visitor can read two inches away just looks broken. It doubles as proof
   * the dashboard is real rather than a static image.
   */
  clear?: boolean;
}) {
  // Aggregates trickle in over the back half of the crawl (2.0-5.2s) — totals
  // updating WHILE rows are still landing is what a real pipeline looks like.
  const delay = fillDelay(`stat:${label}`, 2000, 3200);

  /**
   * Blurs one piece of the cell rather than the whole body.
   *
   * Applied per-element so fixed scaffolding can stay legible next to a hidden
   * figure — the " / 100" on Domain Authority is not data, it is the axis the
   * data is measured against, and blurring it just made the cell look broken.
   */
  const Veil = ({ children }: { children: React.ReactNode }) =>
    clear ? (
      <>{children}</>
    ) : (
      <span className="fsp-soft" style={{ display: "inline-flex", alignItems: "center" }}>
        {children}
      </span>
    );
  // The caption and meter take the class directly rather than a wrapper: both
  // are flex items here, and a shrink-to-fit wrapper would collapse the meter
  // (it has a max-width but no width of its own) to nothing.
  const veiled = clear ? "" : " fsp-soft";

  return (
    <div className="fsp-cell">
      <div className="fsp-lbl">{label}</div>
      <div className="fsp-statbody">
        <div className="fsp-fill" style={{ animationDelay: `${delay}ms` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="fsp-val">
              <Veil>{value}</Veil>
              {/* Outside the veil on purpose — the denominator is context. */}
              {suffix && <span className="fsp-of">{suffix}</span>}
            </div>
            {gauge != null && (
              <Veil>
                <ScoreGauge score={gauge} />
              </Veil>
            )}
          </div>
          {sub && <span className={`fsp-tiny${veiled}`}>{sub}</span>}
          {bar != null && (
            <div className={`fsp-bar${veiled}`}>
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
 * Same API as Blur, minus the blur — for the measured row. Keeps the identical
 * wrapper structure so the two rows stay pixel-aligned, and keeps the fill
 * delay so the real values still land in step with the crawl.
 *
 * NOT aria-hidden, unlike Blur: these figures are genuine, so a screen reader
 * should read them.
 */
/**
 * A slot whose live lookup is still in flight: a shimmer bar, not blurred
 * sample data.
 *
 * This distinction matters. Blur means "real data, withheld until you sign up".
 * Showing a blurred INVENTED number in a slot that is about to be replaced by a
 * measured one would flash a fake figure and then swap it — so those slots wait
 * here instead, and only fall back to the blurred sample if the lookup fails.
 */
function Pending({ w, h = 14, r = 5 }: { w: number | string; h?: number; r?: number }) {
  return <span className="fsp-sk" style={{ display: "inline-block", width: w, height: h, borderRadius: r }} />;
}

function Clear({
  children,
  delay,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  return (
    <span style={{ display: "inline-flex" }}>
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
const CELL_STEP = [0, 0, 560, 700, 840, 980, 1120, 1260] as const;

/**
 * A row as rendered. Widens the three fields the measured row cannot supply —
 * we have not looked up search volume or run a keyword analysis, so those show
 * an em dash rather than a number we made up.
 */
type RowKeyword = Omit<PreviewData["keywords"][number], "volume" | "pageScore" | "keywordScore"> & {
  volume: number | null;
  pageScore: number | null;
  keywordScore: number | null;
};

function Row({
  kw,
  index,
  flag,
  checkedAt,
  dict,
  real = false,
}: {
  kw: RowKeyword;
  index: number;
  flag: string | null;
  checkedAt: string;
  dict: PreviewDict;
  /**
   * This row's figures were actually measured, so nothing in it is blurred.
   * Only row 1 qualifies: we search the visitor's own domain through Scrape.do
   * and audit their homepage, so keyword, position, first check, URL, page
   * score and timestamp are all true. Volume and keyword score render as "—"
   * because we genuinely have not measured them — exactly what the real
   * dashboard shows for a keyword that was only just added.
   */
  real?: boolean;
}) {
  const up = kw.delta > 0;
  const showCta = kw.position == null || kw.position > 3;
  const base = index * ROW_MS;
  const d = (cell: number) =>
    base + CELL_STEP[cell]! + fillDelay(`${kw.keyword}:${cell}`, 0, 90);
  // On the measured row the wrapper still paces the fill, it just doesn't blur.
  const Cell = real ? Clear : Blur;
  /** Values we have not measured render as an em dash, never as an invention. */
  const dash = <span style={{ color: 'var(--text-mute)' }}>—</span>;
  return (
    <>
      <td>
        <Cell delay={d(0)}>
          <span className="fsp-check" />
        </Cell>
      </td>
      <td>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <Cell delay={d(1)} style={{ gap: 8, minWidth: 0 }}>
            {/* Rendered only when there IS a flag. Reserving the slot
                unconditionally left an empty 26px indent whenever geo could not
                be resolved, pushing every keyword out of line with its column
                header. Geo resolves during the skeleton hold, before this table
                mounts, so there is nothing left to shift. */}
            {flag && <span style={{ display: 'inline-flex' }}>{flag}</span>}
            <span className="fsp-kw">{kw.keyword}</span>
          </Cell>
          {/* Movement is only meaningful against a previous check. The measured
              row is a first check, so there is nothing to compare it to yet. */}
          {!real && (
            <span
              className={`fsp-trend fsp-fill ${up ? "up" : "down"}`}
              style={{ animationDelay: `${d(1) + 380}ms` }}
            >
              {up ? '▲' : '▼'} {Math.abs(kw.delta)}
            </span>
          )}
        </span>
      </td>
      <td>
        <Cell delay={d(2)}>
          <PositionBadge position={kw.position} />
        </Cell>
      </td>
      <td>
        <Cell delay={d(3)} style={{ fontVariantNumeric: 'tabular-nums' }}>
          {kw.volume != null ? kw.volume.toLocaleString() : dash}
        </Cell>
      </td>
      <td>
        <Cell delay={d(4)}>
          {kw.url ? <span className="fsp-url">{kw.url}</span> : dash}
        </Cell>
      </td>
      <td>
        <Cell delay={d(5)}>
          <span className="fsp-psks">
            <span className="slot ps">
              {kw.pageScore != null ? <span className="fsp-chip">{kw.pageScore}</span> : dash}
            </span>
            <span style={{ color: 'var(--text-mute)' }}>/</span>
            <span className="slot">
              {kw.keywordScore != null ? <span className="fsp-chip">{kw.keywordScore}</span> : dash}
            </span>
          </span>
        </Cell>
      </td>
      <td>
        <Cell delay={d(6)} style={{ gap: 6, whiteSpace: 'nowrap' }}>
          <span className="fsp-tiny">{checkedAt}</span>
          <i className="fsp-dot" />
        </Cell>
      </td>
      <td>
        <Cell delay={d(7)}>
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
                <span className="from">{kw.position == null ? "#100+" : `#${kw.position}`}</span>
                →<span className="to">#1</span>
              </span>
            )}
          </span>
        </Cell>
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
export const COLS: (number | string)[] = [40, "auto", 120, 100, "22%", 120, 140, 190];

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
  pageScore,
  scoreStatus,
  realRank,
  rankStatus,
  locked,
  unlockOpen,
  onRequestUnlock,
  children,
}: {
  data: PreviewData;
  dict: PreviewDict;
  flag: string | null;
  checkedAt: string;
  /** The real audited Page Score, once it lands. Null = fall back to sample. */
  pageScore: { score: number; grade: string | null } | null;
  /** Lifecycle of that audit — "loading" shows a shimmer, never a fake score. */
  scoreStatus: "loading" | "ready" | "unavailable";
  /** The real measured rank for the visitor's own domain. Null = sample row. */
  realRank: { keyword: string; position: number | null; url: string | null; volume: number | null } | null;
  /** Lifecycle of that lookup — "loading" shows a shimmer row. */
  rankStatus: "loading" | "ready" | "unavailable";
  /**
   * The data is blurred from the first frame regardless — this only gates the
   * centred prompt and the click-to-unlock, which arrive after the behind-the-
   * blur fill has finished playing out.
   */
  locked: boolean;
  unlockOpen: boolean;
  onRequestUnlock: () => void;
  /** The unlock card, rendered over the body when open. */
  children?: React.ReactNode;
}) {
  // Once the data is blurred, clicking ANY of it — a stat value, a rank badge,
  // a row — opens the unlock card. The handler sits on the whole body rather
  // than the table alone so every obscured number is a live target.
  const armed = locked && !unlockOpen;
  return (
    <div
      className={armed ? "fsp-armed" : undefined}
      onClick={armed ? onRequestUnlock : undefined}
      role={armed ? "button" : undefined}
      tabIndex={armed ? 0 : undefined}
      onKeyDown={
        armed
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onRequestUnlock();
              }
            }
          : undefined
      }
      aria-label={armed ? dict.hintClick : undefined}
    >
      {/* Stat strip — labels crisp, values blurred */}
      <div className="fsp-strip">
        {/* A measured figure. While the audit is in flight this shows a shimmer
            rather than a blurred invented score — a slot about to hold a real
            number must never flash a fake one first. Only a failed audit falls
            back to the blurred sample. */}
        {scoreStatus === "loading" ? (
          <div className="fsp-cell">
            <div className="fsp-lbl">{dict.statSeoScore}</div>
            <div className="fsp-statbody">
              <Pending w={54} h={26} r={6} />
              <Pending w={84} h={9} r={4} />
            </div>
          </div>
        ) : (
          <Stat
            label={dict.statSeoScore}
            value={pageScore ? pageScore.score : data.seoScore}
            sub={pageScore ? dict.statSeoScoreReal : dict.statSeoScoreSub}
            gauge={pageScore ? pageScore.score : data.seoScore}
            clear={!!pageScore}
          />
        )}
        <Stat
          label={dict.statKeywords}
          value={data.keywordsTracked}
          sub={renderTemplate(dict.statKeywordsSub, { count: String(data.top3) })}
          clear
        />
        {/* Coverage counts render clear alongside the tracked total — they are
            all derived from the same four keywords, so the strip reads as a
            consistent summary rather than three blurs around one legible cell.
            The specifics (positions, volumes, scores) stay gated in the table. */}
        <Stat
          label={dict.statTop3}
          value={data.top3}
          sub={`${Math.round((data.top3 / data.keywordsTracked) * 100)}%`}
          clear
        />
        <Stat
          label={dict.statTop10}
          value={data.top10}
          sub={`${Math.round((data.top10 / data.keywordsTracked) * 100)}%`}
          clear
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

          {/* The click target is the whole blurred body (see the root element),
              so clicking any obscured number opens the card. */}
          <div className="fsp-tablearea">
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
                  {/* Row 1 while its live rank is still in flight. Shimmer, not
                      blurred sample data — the slot is about to hold measured
                      values and must not flash invented ones first. */}
                  {rankStatus === "loading" && (
                    <tr className="fsp-rise" aria-hidden>
                      <td>
                        <Pending w={13} h={13} r={3} />
                      </td>
                      <td>
                        <Pending w={140} h={11} />
                      </td>
                      <td>
                        <Pending w={34} h={30} r={8} />
                      </td>
                      <td>
                        <Pending w={46} h={11} r={4} />
                      </td>
                      <td>
                        <Pending w={168} h={10} r={4} />
                      </td>
                      <td>
                        <Pending w={74} h={20} r={5} />
                      </td>
                      <td>
                        <Pending w={80} h={10} r={4} />
                      </td>
                      <td>
                        <Pending w={120} h={28} r={8} />
                      </td>
                    </tr>
                  )}
                  {data.keywords.map((kw, i) => {
                    // Row 1 is withheld entirely while its measurement is in
                    // flight; the placeholder above stands in for it.
                    if (i === 0 && rankStatus === "loading") return null;
                    // Row 1 is the only measured row: we searched the visitor's
                    // own domain through Scrape.do and audited their homepage.
                    // Volume and keyword score stay null — we have not measured
                    // those, so they render as "—" rather than as an invention.
                    const measured = i === 0 && realRank != null;
                    const row = measured
                      ? {
                          ...kw,
                          keyword: realRank!.keyword,
                          position: realRank!.position,
                          url: realRank!.url,
                          volume: realRank!.volume,
                          pageScore: pageScore?.score ?? null,
                          keywordScore: null,
                        }
                      : kw;
                    return (
                      <tr
                        key={kw.keyword}
                        className="fsp-rise"
                        // Only the fabricated rows are hidden from assistive
                        // tech; the measured one is genuine and may be read.
                        aria-hidden={measured ? undefined : true}
                      >
                        <Row
                          kw={row}
                          index={i}
                          flag={flag}
                          checkedAt={checkedAt}
                          dict={dict}
                          real={measured}
                        />
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <span className="fsp-sweep" aria-hidden>
              <i />
            </span>

          </div>
        </div>
      </div>

      {unlockOpen && children}
      </div>
    </div>
  );
}
