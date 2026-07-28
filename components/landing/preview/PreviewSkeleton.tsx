"use client";

import { Cols } from "./PreviewDashboard";

/**
 * Loading skeleton for the dashboard body.
 *
 * It renders inside the SAME PreviewShell as the filled dashboard, and reuses
 * the same wrappers (.fsp-strip, 8x .fsp-cell, .fsp-layout, the real <table>
 * with the same nine columns and widths). Only the leaf content is swapped for
 * shimmer bars. That is the whole trick: because the structural CSS is shared
 * rather than approximated, the handoff to real data cannot reflow.
 *
 * Sizes below are not arbitrary — each bar is centred in a slot matching the
 * real element's line box (e.g. a 25px value at line-height 1.1 occupies 28px,
 * so its bar is 26px in a 28px slot). Substituting a div-based fake table, or
 * dropping the 30px position badge, is what makes skeletons snap on swap.
 *
 * Deliberately silent to assistive tech: the whole subtree is aria-hidden and
 * the overlay carries aria-busy, with a single live region announcing the wait.
 */

/** A shimmer bar. `sub` switches to the darker ramp used on the table header. */
function B({
  w,
  h,
  r = 4,
  sub = false,
  style,
}: {
  w: number | string;
  h: number;
  r?: number;
  sub?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={`fsp-sk${sub ? " on-sub" : ""}`}
      style={{ display: "block", width: w, height: h, borderRadius: r, ...style }}
    />
  );
}

/** Centres a bar in a slot of the real element's height, so rows keep their size. */
function Slot({ h, children }: { h: number; children: React.ReactNode }) {
  return <span style={{ display: "flex", alignItems: "center", height: h }}>{children}</span>;
}

// Per-cell label and footnote widths — varied so the strip doesn't read as a
// row of identical stamps. Order matches the real strip's eight cells.
const CELLS: { label: number; foot: number | null }[] = [
  { label: 68, foot: 84 }, // SEO Score — carries the gauge
  { label: 100, foot: 76 }, // Keywords tracked
  { label: 96, foot: 34 }, // Top 3
  { label: 66, foot: 34 }, // In top 10
  { label: 78, foot: 96 }, // Est. traffic
  { label: 104, foot: null }, // Domain authority — meter instead of a footnote
  { label: 66, foot: 62 }, // Backlinks
];

/** Index of the Domain Authority cell — the one that draws a meter. */
const METER_CELL = 5;

// Header bar widths only — the column TRACKS come from the shared <Cols/>, so
// the skeleton and the filled table are guaranteed to size identically.
const TH_BARS = [66, 62, 52, 30, 74, 84, 60];

// Four rows, because previewData builds exactly four keywords. The last is the
// unranked one, whose "100+" badge is wider and whose URL is an em dash.
const ROWS = [
  { kw: 116, vol: 46, url: 168, pos: 34 },
  { kw: 152, vol: 42, url: 152, pos: 34 },
  { kw: 140, vol: 38, url: 160, pos: 34 },
  { kw: 176, vol: 46, url: 14, pos: 46 },
];

export default function PreviewSkeleton() {
  return (
    <div aria-hidden>
      {/* Stat strip — same flex wrapper and eight cells as the filled state */}
      <div className="fsp-strip">
        {CELLS.map((c, i) => (
          <div className="fsp-cell" key={i}>
            <Slot h={17}>
              <B w={c.label} h={9} />
            </Slot>
            {i === METER_CELL ? (
              <>
                {/* Domain authority: value + "/ 100" suffix, then the meter bar */}
                <Slot h={28}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <B w={40} h={26} r={6} />
                    <B w={34} h={12} />
                  </span>
                </Slot>
                <B w={120} h={5} r={999} style={{ marginTop: 7 }} />
              </>
            ) : (
              <>
                {/* The SEO cell carries the 76x48 gauge, and it is the GAUGE
                    (not the 25px number) that sets every cell's height via
                    align-items: stretch. Its slot must be 48px, not 28px, or the
                    whole strip renders ~20px short and jumps on swap. */}
                <Slot h={i === 0 ? 48 : 28}>
                  {i === 0 ? (
                    <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <B w={54} h={26} r={6} />
                      <B w={76} h={48} r={8} />
                    </span>
                  ) : (
                    <B w={54} h={26} r={6} />
                  )}
                </Slot>
                {c.foot != null && (
                  <Slot h={17}>
                    <B w={c.foot} h={9} />
                  </Slot>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <div className="fsp-layout">
        <div className="fsp-rail-col">
          {/* Rankings improved */}
          <div className="fsp-card">
            <div className="fsp-card-h" style={{ marginBottom: 10 }}>
              <Slot h={21}>
                <B w={118} h={11} r={5} />
              </Slot>
              <B w={130} h={26} r={8} />
            </div>
            <Slot h={31}>
              <B w={44} h={26} r={6} />
            </Slot>
            <div style={{ marginTop: 10 }}>
              {[58, 44, 76].map((w, i) => (
                <div className="fsp-insight-row" key={i}>
                  <B w={w} h={10} />
                  <B w={30} h={12} />
                </div>
              ))}
            </div>
          </div>

          {/* Competitors */}
          <div className="fsp-card">
            <div className="fsp-card-h">
              <Slot h={21}>
                <B w={88} h={11} r={5} />
              </Slot>
              <B w={14} h={10} r={3} />
            </div>
            <B w="100%" h={34} r={8} />
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
              <B w={28} h={28} r={8} />
              <div>
                <Slot h={19}>
                  <B w={96} h={11} r={5} />
                </Slot>
                <B w={84} h={20} r={5} style={{ marginTop: 3 }} />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="fsp-serp-card">
          <div className="fsp-serp-h">
            <Slot h={21}>
              <B w={132} h={11} r={5} />
            </Slot>
            <B w={240} h={34} r={8} />
            <Slot h={17}>
              <B w={78} h={10} />
            </Slot>
            <B w={210} h={34} r={8} style={{ marginLeft: "auto" }} />
          </div>

          <div className="fsp-table-wrap">
            <table className="fsp-tbl">
              <Cols />
              <thead>
                <tr>
                  <th>
                    <B w={13} h={13} r={3} sub />
                  </th>
                  {TH_BARS.map((w, i) => (
                    <th key={i}>
                      <Slot h={17}>
                        <B w={w} h={9} sub />
                      </Slot>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r, i) => (
                  <tr key={i}>
                    <td>
                      <B w={13} h={13} r={3} />
                    </td>
                    <td>
                      {/* No flag placeholder: the filled row only draws a flag
                          when geo actually resolved, so reserving space here
                          would make the keyword jump left on swap. */}
                      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <B w={r.kw} h={11} r={5} />
                      </span>
                    </td>
                    {/* 30px tall — this block is what sets the 55px row height,
                        so it must never shrink for the unranked rows. */}
                    <td>
                      <B w={r.pos} h={30} r={8} />
                    </td>
                    <td>
                      <Slot h={19}>
                        <B w={r.vol} h={11} />
                      </Slot>
                    </td>
                    <td>
                      <Slot h={19}>
                        <B w={r.url} h={10} />
                      </Slot>
                    </td>
                    <td>
                      <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <B w={30} h={20} r={5} />
                        <B w={6} h={10} r={2} />
                        <B w={30} h={20} r={5} />
                      </span>
                    </td>
                    <td>
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <B w={74} h={10} />
                        <B w={7} h={7} r={999} />
                      </span>
                    </td>
                    <td>
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <B w={28} h={28} r={8} />
                        <B w={28} h={28} r={8} />
                        <B w={28} h={28} r={8} />
                        <B w={92} h={29} r={8} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
