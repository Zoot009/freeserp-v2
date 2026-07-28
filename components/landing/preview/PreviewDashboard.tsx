"use client";

import { Ic, ScoreGauge } from "./icons";
import { renderTemplate } from "@/lib/landing/template";
import { compactNumber, type PreviewData } from "@/lib/landing/previewData";

/**
 * The filled dashboard body — stat strip, insight rail, and the rank-tracking
 * table. Renders inside PreviewShell.
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
  /** Label for a rival whose position we actually measured on this SERP. */
  competitorPos: string;
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
  // The meter takes the class directly rather than through a wrapper: it is a
  // flex item here, and a shrink-to-fit wrapper would collapse it to nothing
  // (it has a max-width but no width of its own).
  const veiled = clear ? "" : " fsp-soft";

  return (
    <div className="fsp-cell">
      <div className="fsp-lbl">{label}</div>
      <div className="fsp-statbody">
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
        {/* Never veiled. Like the " / 100" above, the caption is not the
            measurement — it says what unit the hidden number is in ("monthly,
            modelled", "site-wide"). Blurring it withheld nothing and only
            made the cell look broken. */}
        {sub && <span className="fsp-tiny">{sub}</span>}
        {bar != null && (
          <div className={`fsp-bar${veiled}`}>
            <i style={{ width: `${bar}%` }} />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Obscures a cell's contents while leaving the cell itself in place.
 */
function Blur({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <span className="fsp-hard" style={{ display: "inline-flex" }} aria-hidden>
      <span style={{ display: "inline-flex", alignItems: "center", ...style }}>{children}</span>
    </span>
  );
}

/**
 * Same API as Blur, minus the blur — for the measured row. Keeps the identical
 * wrapper structure so the two rows stay pixel-aligned.
 *
 * NOT aria-hidden, unlike Blur: these figures are genuine, so a screen reader
 * should read them.
 */
function Clear({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <span style={{ display: "inline-flex" }}>
      <span style={{ display: "inline-flex", alignItems: "center", ...style }}>{children}</span>
    </span>
  );
}

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

/**
 * For a single value still being computed, where a shimmer bar would be
 * misread as the value itself. The shimmer stands in for layout; this stands in
 * for work in progress.
 */
function Spinner({ size = 14 }: { size?: number }) {
  return <span className="fsp-spin" style={{ width: size, height: size }} aria-hidden />;
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
  flag,
  checkedAt,
  dict,
  scorePending = false,
  scoresVeiled = false,
  real = false,
}: {
  kw: RowKeyword;
  flag: string | null;
  checkedAt: string;
  dict: PreviewDict;
  /**
   * The page-score audit backing this row's P.S is still running. Only ever set
   * on the measured row — a sample row has nothing being computed.
   */
  scorePending?: boolean;
  /**
   * The audit did not land, so P.S / K.S hold sample figures even on the
   * measured row. That cell is then veiled like any other sample data — the
   * alternative was a bare dash next to a blurred SEO Score in the strip, which
   * read as two different answers to the same question.
   */
  scoresVeiled?: boolean;
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
  // On the measured row the wrapper still keeps the layout, it just doesn't blur.
  const Cell = real ? Clear : Blur;
  // P.S / K.S get their own wrapper: the rank can be measured while the audit
  // behind those two scores never lands, leaving sample figures in that one cell.
  const ScoreCell = real && !scoresVeiled ? Clear : Blur;
  /** Values we have not measured render as an em dash, never as an invention. */
  const dash = <span style={{ color: 'var(--text-mute)' }}>—</span>;
  return (
    <>
      <td>
        <Cell>
          <span className="fsp-check" />
        </Cell>
      </td>
      <td>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <Cell style={{ gap: 8, minWidth: 0 }}>
            {/* Rendered only when there IS a flag. Reserving the slot
                unconditionally left an empty 26px indent whenever geo could not
                be resolved, pushing every keyword out of line with its column
                header. */}
            {flag && <span style={{ display: 'inline-flex' }}>{flag}</span>}
            <span className="fsp-kw">{kw.keyword}</span>
          </Cell>
          {/* Movement is only meaningful against a previous check. The measured
              row is a first check, so there is nothing to compare it to yet. */}
          {!real && (
            <span className={`fsp-trend ${up ? "up" : "down"}`}>
              {up ? '▲' : '▼'} {Math.abs(kw.delta)}
            </span>
          )}
        </span>
      </td>
      <td>
        <Cell>
          <PositionBadge position={kw.position} />
        </Cell>
      </td>
      <td>
        <Cell style={{ fontVariantNumeric: 'tabular-nums' }}>
          {kw.volume != null ? kw.volume.toLocaleString() : dash}
        </Cell>
      </td>
      <td>
        <Cell>
          {kw.url ? <span className="fsp-url">{kw.url}</span> : dash}
        </Cell>
      </td>
      <td>
        {/* Veiled independently of the rest of the row: the rank can be measured
            while the audit behind these two scores never arrives. */}
        <ScoreCell>
          <span className="fsp-psks">
            <span className="slot ps">
              {scorePending ? (
                <Spinner size={13} />
              ) : kw.pageScore != null ? (
                <span className="fsp-chip">{kw.pageScore}</span>
              ) : (
                dash
              )}
            </span>
            <span style={{ color: 'var(--text-mute)' }}>/</span>
            <span className="slot">
              {kw.keywordScore != null ? <span className="fsp-chip">{kw.keywordScore}</span> : dash}
            </span>
          </span>
        </ScoreCell>
      </td>
      <td>
        <Cell style={{ gap: 6, whiteSpace: 'nowrap' }}>
          <span className="fsp-tiny">{checkedAt}</span>
          <i className="fsp-dot" />
        </Cell>
      </td>
      <td>
        <Cell>
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
  pageScore: { score: number; grade: string | null; onPageScore: number | null } | null;
  /** Lifecycle of that audit — "loading" shows a shimmer, never a fake score. */
  scoreStatus: "loading" | "ready" | "unavailable";
  /** The real measured rank for the visitor's own domain. Null = sample row. */
  realRank: {
    keyword: string;
    position: number | null;
    url: string | null;
    volume: number | null;
    competitors: { domain: string; position: number }[];
  } | null;
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
  // Measured rivals when we have them, otherwise the sample stand-in.
  const rivals =
    realRank?.competitors.length
      ? realRank.competitors
      : [{ domain: data.competitor, position: data.competitorAvgPosition }];

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
              {/* 48px tall to match the gauge it will be replaced by, so the
                  whole strip does not shrink when the score lands. */}
              <span style={{ display: "inline-flex", alignItems: "center", gap: 10, height: 48 }}>
                <Spinner size={22} />
              </span>
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

          <div className="fsp-card" aria-hidden>
            <div className="fsp-card-h">
              <span className="fsp-card-t">{dict.competitorsTitle}</span>
              <span className="fsp-tiny">{rivals.length}</span>
            </div>
            <span className="fsp-dd" aria-hidden>
              {dict.addCompetitor}
              <Ic.chevD />
            </span>

            {/* Real rivals cost nothing: they are the other domains on the SERP
                we already fetched to find the visitor's own rank. The top one
                is shown clear as proof, the rest stay gated. */}
            {rankStatus === "loading" ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
                <Pending w={28} h={28} r={8} />
                <div>
                  <Pending w={96} h={11} />
                  <div style={{ marginTop: 5 }}>
                    <Pending w={84} h={18} r={5} />
                  </div>
                </div>
              </div>
            ) : (
              rivals.map((c, i) => {
                const proven = realRank != null && i === 0;
                return (
                  <div
                    key={c.domain}
                    className={proven ? undefined : "fsp-soft"}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginTop: 12,
                    }}
                    aria-hidden={proven ? undefined : true}
                  >
                    <span
                      className="fsp-favicon"
                      style={{ width: 28, height: 28, fontSize: 12, borderRadius: 8 }}
                    >
                      {c.domain.charAt(0)}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{c.domain}</div>
                      <span className="fsp-chip pos" style={{ marginTop: 3 }}>
                        {renderTemplate(realRank ? dict.competitorPos : dict.competitorAvg, {
                          pos: String(c.position),
                        })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
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
                  {/* aria-hidden throughout: these figures are illustrative, and
                      a screen reader must not recite them as measurements. */}
                  {/* Row 1 while its live rank is still in flight. Shimmer, not
                      blurred sample data — the slot is about to hold measured
                      values and must not flash invented ones first. */}
                  {rankStatus === "loading" && (
                    <tr aria-hidden>
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
                    // Volume stays null when unmeasured (renders "—").
                    const measured = i === 0 && realRank != null;
                    // K.S is the audit's on-page score, but ONLY when the site
                    // actually ranks for the keyword — an optimisation score for
                    // a page that isn't ranking would be a claim we can't stand
                    // behind. Not ranking -> "—".
                    const isRanking = realRank?.position != null;
                    const row = measured
                      ? {
                          ...kw,
                          keyword: realRank!.keyword,
                          position: realRank!.position,
                          url: realRank!.url,
                          volume: realRank!.volume,
                          // Audited score when we have one; otherwise keep the
                          // sample figures and let the cell stay veiled, so this
                          // never shows a bare dash beside a blurred SEO Score.
                          pageScore: pageScore?.score ?? kw.pageScore,
                          keywordScore: pageScore ? (isRanking ? pageScore.onPageScore : null) : kw.keywordScore,
                        }
                      : kw;
                    return (
                      <tr
                        key={kw.keyword}
                        // Only the fabricated rows are hidden from assistive
                        // tech; the measured one is genuine and may be read.
                        aria-hidden={measured ? undefined : true}
                      >
                        <Row
                          kw={row}
                          flag={flag}
                          checkedAt={checkedAt}
                          dict={dict}
                          // The rank can land before the audit does, so the
                          // measured row may sit with a real position while its
                          // P.S is still being computed.
                          scorePending={measured && scoreStatus === "loading"}
                          scoresVeiled={scoreStatus !== "ready"}
                          real={measured}
                        />
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {unlockOpen && children}
      </div>
    </div>
  );
}
