// Icons for the dashboard replica.
//
// These are transcribed from freeserp-frontend-v2/components/dashboard/icons.tsx
// rather than pulled from lucide, because the app's sidebar and top bar use a
// bespoke 16x16 set — substituting lucide equivalents is the single most visible
// way a replica reads as "not quite the real thing". Path data matches the
// source; the sizes match too, including the deliberate oddity that the search
// glyph is 14px while its rail neighbours are 16px.

type P = { size?: number; className?: string };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 16 16",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.4,
  "aria-hidden": true,
});

export const Ic = {
  /** 2x2 grid of rounded squares — Overview. */
  dash: ({ size = 16 }: P) => (
    <svg {...base(size)}>
      <rect x="2" y="2" width="5" height="5" rx="1" />
      <rect x="9" y="2" width="5" height="5" rx="1" />
      <rect x="2" y="9" width="5" height="5" rx="1" />
      <rect x="9" y="9" width="5" height="5" rx="1" />
    </svg>
  ),
  folder: ({ size = 16 }: P) => (
    <svg {...base(size)}>
      <path d="M2 4a1 1 0 011-1h3l1.5 2H13a1 1 0 011 1v6a1 1 0 01-1 1H3a1 1 0 01-1-1V4z" strokeLinejoin="round" />
    </svg>
  ),
  key: ({ size = 16 }: P) => (
    <svg {...base(size)} strokeLinecap="round">
      <circle cx="5" cy="11" r="3" />
      <path d="M7 9L14 2M11 5L14 8M11 2L14 5" />
    </svg>
  ),
  /** The only filled glyph in the rail. */
  starFilled: ({ size = 16 }: P) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 1.6l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 11.4l-3.8 2 .7-4.3-3.1-3 4.3-.6L8 1.6z" />
    </svg>
  ),
  zap: ({ size = 16 }: P) => (
    <svg {...base(size)} strokeLinejoin="round">
      <path d="M9 1L3 9H7L6 15L13 7H9L9 1Z" />
    </svg>
  ),
  /** Default 14, not 16 — matches the source's inconsistency. */
  search: ({ size = 14 }: P) => (
    <svg {...base(size)} strokeWidth={1.6} strokeLinecap="round">
      <circle cx="7" cy="7" r="5" />
      <path d="M11 11L14 14" />
    </svg>
  ),
  monitor: ({ size = 16 }: P) => (
    <svg {...base(size)} strokeLinecap="round">
      <rect x="1.5" y="2.5" width="13" height="8.5" rx="1.5" />
      <path d="M5.5 14H10.5M8 11V14" />
    </svg>
  ),
  settings: ({ size = 16 }: P) => (
    <svg {...base(size)} strokeLinecap="round">
      <circle cx="8" cy="8" r="2" />
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.1 3.1l1.4 1.4M11.5 11.5l1.4 1.4M12.9 3.1l-1.4 1.4M4.5 11.5l-1.4 1.4" />
    </svg>
  ),
  smartphone: ({ size = 14 }: P) => (
    <svg {...base(size)} strokeLinecap="round">
      <rect x="4" y="1.5" width="8" height="13" rx="1.5" />
      <path d="M7 12.5h2" />
    </svg>
  ),
  bell: ({ size = 16 }: P) => (
    <svg {...base(size)} strokeLinejoin="round">
      <path d="M4 6.5a4 4 0 118 0c0 3 1 4 1 4H3s1-1 1-4z" />
      <path d="M6.5 13a1.6 1.6 0 003 0" />
    </svg>
  ),
  moon: ({ size = 14 }: P) => (
    <svg {...base(size)} strokeLinejoin="round">
      <path d="M13 9.5A5.6 5.6 0 016.5 3a5.6 5.6 0 106.5 6.5z" />
    </svg>
  ),
  globe: ({ size = 15 }: P) => (
    <svg {...base(size)}>
      <circle cx="8" cy="8" r="6" />
      <path d="M2 8h12M8 2c1.6 1.8 2.4 3.8 2.4 6S9.6 12.2 8 14c-1.6-1.8-2.4-3.8-2.4-6S6.4 3.8 8 2z" />
    </svg>
  ),
  trash: ({ size = 15 }: P) => (
    <svg {...base(size)} strokeLinecap="round">
      <path d="M2.5 4h11M6 4V2.5h4V4M4 4l.7 9.5h6.6L12 4" />
    </svg>
  ),
  star: ({ size = 14 }: P) => (
    <svg {...base(size)} strokeLinejoin="round">
      <path d="M8 1.8l1.85 3.8 4.15.6-3 2.9.7 4.1L8 11.3l-3.7 1.9.7-4.1-3-2.9 4.15-.6L8 1.8z" />
    </svg>
  ),
  refresh: ({ size = 14 }: P) => (
    <svg {...base(size)} strokeLinecap="round" strokeLinejoin="round">
      <path d="M13.5 8a5.5 5.5 0 11-1.7-4M13.5 1.5V5H10" />
    </svg>
  ),
  /** Three filled dots — the overflow menu. */
  dots: ({ size = 14 }: P) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <circle cx="3" cy="8" r="1.2" />
      <circle cx="8" cy="8" r="1.2" />
      <circle cx="13" cy="8" r="1.2" />
    </svg>
  ),
  pencil: ({ size = 13 }: P) => (
    <svg {...base(size)} strokeLinecap="round" strokeLinejoin="round">
      <path d="M11.5 2.5l2 2L5 13H3v-2l8.5-8.5z" />
    </svg>
  ),
  plus: ({ size = 14 }: P) => (
    <svg {...base(size)} strokeWidth={1.8} strokeLinecap="round">
      <path d="M8 3v10M3 8h10" />
    </svg>
  ),
  /** 12x12 chevron on its own viewBox — used by crumbs, carets and the rail toggle. */
  chevR: ({ size = 12, className }: P) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M4 2L8 6L4 10" />
    </svg>
  ),
  chevD: ({ size = 12 }: P) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2 4L6 8L10 4" />
    </svg>
  ),
  arrowR: ({ size = 13 }: P) => (
    <svg {...base(size)} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  ),
  info: ({ size = 12 }: P) => (
    <svg {...base(size)} strokeLinecap="round">
      <circle cx="8" cy="8" r="6.2" />
      <path d="M8 7.2v4M8 5.1v.1" />
    </svg>
  ),
};

/**
 * The stat strip's SEO-score gauge: an OPEN 76x48 semicircular arc whose sweep
 * tracks the score, with the qualitative label sitting inside the arc on the
 * endpoints' baseline.
 *
 * Its 48px height is what makes every stat cell ~103px rather than ~83px (the
 * strip is align-items: stretch), so sizing this from the 25px number instead of
 * the gauge makes the whole strip come out ~40px short.
 *
 * Two details are preserved deliberately because they are real:
 *  - the COLOUR bands split at 70/40 (three bands) while the LABEL bands split
 *    at 80/60/40 (four), so a 75 draws green and reads "Good", and so does a 65;
 *  - the track is --bg-inset, which is nearly invisible on white. That is
 *    correct — the gauge is meant to read as the coloured arc alone.
 */
const ARC = "M 8 42 A 30 30 0 0 1 68 42";
const ARC_LEN = Math.PI * 30; // 94.248

export function ScoreGauge({ score }: { score: number }) {
  const color = score >= 70 ? "#16a34a" : score >= 40 ? "#c28b00" : "#dc2626";
  const label = score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Fair" : "Poor";
  return (
    <svg width={76} height={48} viewBox="0 0 76 48" fill="none" aria-hidden>
      <path d={ARC} stroke="#f2f4f7" strokeWidth={8} strokeLinecap="round" />
      <path
        d={ARC}
        stroke={color}
        strokeWidth={8}
        strokeLinecap="round"
        strokeDasharray={`${(score / 100) * ARC_LEN} ${ARC_LEN + 10}`}
      />
      <text x={38} y={42} textAnchor="middle" fontSize={10} fill={color} fontWeight={600}>
        {label}
      </text>
    </svg>
  );
}
