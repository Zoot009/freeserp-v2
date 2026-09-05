/**
 * The three product mockups for the "what you get" rows.
 *
 * Static SVG and markup, not screenshots: every figure here is a real value
 * from ./content.ts, so the copy beside a mockup can never drift from what the
 * mockup shows. They are also server-rendered with no animation, which is what
 * keeps them free on a cold paid click.
 *
 * Restyled from the language lander's versions into this page's system —
 * hairline borders, 20px cards, ink at low opacity for the track of a ring, and
 * one accent per figure. The exception is the tracked-keywords list and the
 * two ring colours, which stay semantic: winning/losing/new/lost and
 * visibility/coverage are data, and data needs to be told apart at a glance.
 *
 * All three are decorative — every claim they illustrate is written out in the
 * bullets beside them — so they are hidden from assistive tech.
 */

const RING_TRACK = "#0e0f0c14";

/** Visibility score and top-10 coverage as rings, over the tracked-keyword split. */
export function VisibilityMock({
  dict,
}: {
  dict: {
    visibilityScore: string;
    scorePct: string;
    visibilityDelta: string;
    top10Coverage: string;
    coveragePct: string;
    noChange: string;
    trackedKeywords: string;
    trackedRows: { label: string; val: string; color: string }[];
  };
}) {
  return (
    <div className="uk-card p-6 sm:p-7" aria-hidden>
      <div className="grid grid-cols-2 gap-4">
        <Ring
          label={dict.visibilityScore}
          pct={dict.scorePct}
          color="#0454ff"
          note={dict.visibilityDelta}
          noteClass="text-[#16794f]"
        />
        <Ring
          label={dict.top10Coverage}
          pct={dict.coveragePct}
          color="#e0930b"
          note={dict.noChange}
          noteClass="text-[var(--muted)]"
        />
      </div>

      <div className="mt-7 border-t border-[var(--line)] pt-5">
        <div className="text-[13px] font-semibold">{dict.trackedKeywords}</div>
        <div className="mt-3.5 flex flex-col gap-2.5">
          {dict.trackedRows.map((r) => (
            <div key={r.label} className="flex items-center justify-between text-[13.5px]">
              <span className="flex items-center gap-2.5 text-[var(--body)]">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: r.color }}
                />
                {r.label}
              </span>
              <span data-mono className="font-semibold">{r.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** The rank report: what moved since the last check, and what to do about it. */
export function RankReportMock({
  dict,
}: {
  dict: {
    rankReport: string;
    filters: string[];
    movement: string;
    issueRows: { lead: string; rest: string }[];
    view: string;
    aboutTitle: string;
    aboutBody: string;
    respondTitle: string;
    respondBody: string;
  };
}) {
  return (
    <div className="uk-card p-6 sm:p-7" aria-hidden>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h4 className="text-[16px] font-semibold tracking-[-0.02em]">
          {dict.rankReport}
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {dict.filters.map((f, i) => (
            <span
              key={f}
              className={`rounded-full px-2.5 py-1 text-[11.5px] font-medium ${
                i === 0
                  ? "bg-[color-mix(in_srgb,var(--accent)_12%,#fff)] text-[var(--accent)]"
                  : "bg-[var(--canvas)] text-[var(--muted)]"
              }`}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      <div data-mono className="mt-6 text-[10.5px] font-medium tracking-[0.14em] uppercase text-[var(--muted)]">
        {dict.movement}
      </div>

      <div className="mt-2.5">
        {dict.issueRows.map((r) => (
          <div
            key={r.lead}
            className="flex items-baseline justify-between gap-3 border-b border-[var(--line)] py-3 text-[13.5px] last:border-b-0"
          >
            <span className="text-[var(--body)]">
              <span data-mono className="font-semibold text-[var(--ink)]">
                {r.lead}
              </span>{" "}
              {r.rest}
            </span>
            <span className="shrink-0 text-[12.5px] font-medium text-[var(--accent)]">
              {dict.view}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
        <Aside title={dict.aboutTitle} body={dict.aboutBody} />
        <Aside title={dict.respondTitle} body={dict.respondBody} />
      </div>
    </div>
  );
}

/** The six thematic reports, each a small ring with its delta. */
export function ThematicMock({
  dict,
}: {
  dict: {
    heading: string;
    items: { label: string; pct: string; delta: string; positive: boolean }[];
  };
}) {
  return (
    <div className="uk-card p-6 sm:p-7" aria-hidden>
      <h4 className="text-[16px] font-semibold tracking-[-0.02em]">
        {dict.heading}
      </h4>
      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {dict.items.map((t) => (
          <div
            key={t.label}
            className="rounded-[14px] border border-[var(--line)] p-3.5"
          >
            <div className="text-[11px] leading-[1.3] text-[var(--muted)]">
              {t.label}
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1">
              <MiniRing pct={t.pct} />
              <span data-mono className="text-[14px] font-semibold sm:text-[15px]">
                {t.pct}
              </span>
              {t.delta && (
                <span
                  data-mono
                  className={`text-[11px] font-medium ${
                    t.positive ? "text-[#16794f]" : "text-[#b3261e]"
                  }`}
                >
                  {t.delta}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── pieces ──────────────────────────────────────────────────────────────── */

function Aside({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[14px] bg-[var(--canvas)] p-3.5">
      <div className="text-[12.5px] font-semibold">{title}</div>
      <p className="mt-1.5 text-[12px] leading-[1.45] text-[var(--body)]">
        {body}
      </p>
    </div>
  );
}

/**
 * A donut. `pct` arrives as a display string ("68%"), so the number is parsed
 * out of it rather than duplicated as a second field that could disagree.
 */
function Ring({
  label,
  pct,
  color,
  note,
  noteClass,
}: {
  label: string;
  pct: string;
  color: string;
  note: string;
  noteClass: string;
}) {
  const value = Number.parseFloat(pct) || 0;
  const r = 33;
  const circumference = 2 * Math.PI * r;

  return (
    <div className="text-center">
      <div className="text-[12.5px] font-semibold">{label}</div>
      <div className="relative mx-auto mt-3 aspect-square w-full max-w-[86px]">
        <svg viewBox="0 0 86 86" className="h-full w-full">
          <circle cx="43" cy="43" r={r} fill="none" stroke={RING_TRACK} strokeWidth="9" />
          <circle
            cx="43"
            cy="43"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={`${(circumference * value) / 100} ${circumference}`}
            transform="rotate(-90 43 43)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span data-mono className="text-[19px] leading-none font-semibold">
            {pct}
          </span>
          <span className={`mt-1 text-[10.5px] font-medium ${noteClass}`}>
            {note}
          </span>
        </div>
      </div>
    </div>
  );
}

function MiniRing({ pct }: { pct: string }) {
  const value = Number.parseFloat(pct) || 0;
  const r = 9;
  const circumference = 2 * Math.PI * r;

  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0">
      <circle cx="12" cy="12" r={r} fill="none" stroke={RING_TRACK} strokeWidth="4" />
      <circle
        cx="12"
        cy="12"
        r={r}
        fill="none"
        stroke="#0454ff"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={`${(circumference * value) / 100} ${circumference}`}
        transform="rotate(-90 12 12)"
      />
    </svg>
  );
}
