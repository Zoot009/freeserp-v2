/**
 * The homepage's design system, read off the Qupe template's own stylesheet.
 *
 * Not guessed from a screenshot: these are the values in the page source —
 * its CSS custom properties, its type scale, its radii, its container width.
 * The one substitution is the accent. Qupe's is #ff5106 orange; ours is the
 * FreeSERP blue, because a template's brand colour is the one thing that must
 * NOT come across.
 *
 * Homepage only. components/site/constants.ts is shared with /serp-checker and
 * every other route, so nothing here touches it.
 */

export const T = {
  /* ── Surfaces ──────────────────────────────────────────────────────────── */
  /** Page ground. Qupe is white throughout; sections separate by tint, not rule. */
  bg: "#fff",
  /** The alternating section tint — barely there, and doing all the separation work. */
  bgSoft: "#fafafa",
  /** A second, slightly stronger tint for cards sitting ON the soft sections. */
  bgSofter: "#f7f7f7",
  border: "#ebebeb",

  /* ── Ink ───────────────────────────────────────────────────────────────── */
  /** Headings. Near-black, never pure #000 — Qupe uses #111. */
  ink: "#111",
  inkSoft: "#1b1b1b",
  /** Body copy. */
  body: "#464646",
  bodySoft: "#666",
  muted: "#979797",

  /* ── Accent ────────────────────────────────────────────────────────────── */
  /** Ours, in place of Qupe's #ff5106. */
  accent: "#0454ff",
  accentSoft: "#ebf1ff",
  accentInk: "#0339b8",

  /* ── Type scale ────────────────────────────────────────────────────────── */
  /**
   * Qupe's actual ladder: 72 / 56 / 48 / 40 / 36 / 24 / 20 / 18 / 16 / 14.
   * Expressed as clamps so the same steps hold on a phone.
   */
  h1: "clamp(40px, 6vw, 72px)",
  h2: "clamp(32px, 4.4vw, 48px)",
  h3: "clamp(20px, 2vw, 24px)",
  lead: "18px",
  bodySize: "16px",
  small: "14px",

  /** Qupe sets headings tight and body normal. */
  tightTracking: "-0.03em",
  headingWeight: 600,

  /* ── Shape ─────────────────────────────────────────────────────────────── */
  /** 8px is the template's dominant radius by a distance; 24 is for big panels. */
  radius: 8,
  radiusLg: 24,
  radiusPill: 999,

  /* ── Rhythm ────────────────────────────────────────────────────────────── */
  /** Qupe's content column is 1152px, and sections breathe at 96/24. */
  maxW: 1152,
  sectionY: 96,
  sectionX: 24,
} as const;

/** A standard section shell: centred column, consistent vertical rhythm. */
export function section(tinted = false): React.CSSProperties {
  return {
    background: tinted ? T.bgSoft : T.bg,
    padding: `${T.sectionY}px ${T.sectionX}px`,
  };
}

/** The inner column every section shares. */
export function container(): React.CSSProperties {
  return { maxWidth: T.maxW, margin: "0 auto", width: "100%" };
}
