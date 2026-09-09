import { Reveal } from "@/components/site/Reveal";
import { T } from "./theme";

/**
 * The homepage's section header, on Qupe's measurements.
 *
 * A deliberate local copy of components/site/SectionHead rather than an edit to
 * it: that one is rendered by /serp-checker, /pricing, /blog and the rest, and
 * the brief here is the homepage and nothing else. Two files that look alike is
 * a much smaller problem than a homepage restyle leaking onto five other routes.
 *
 * Differences from the shared one, all taken from the template: the eyebrow is
 * a small caps label in the accent rather than a filled chip, the heading is
 * near-black at Qupe's h2 step, and the whole block is narrower — 640px, so a
 * subheading breaks into two or three lines instead of running the full column.
 */
export function Head({
  eyebrow,
  title,
  sub,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  /** Left-aligned for the two-column sections, centred everywhere else. */
  align?: "center" | "left";
}) {
  const centred = align === "center";
  return (
    <Reveal
      style={{
        maxWidth: 640,
        textAlign: centred ? "center" : "left",
        margin: centred ? "0 auto" : undefined,
      }}
    >
      {eyebrow && (
        <div
          style={{
            color: T.accent,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          {eyebrow}
        </div>
      )}
      <h2
        style={{
          color: T.ink,
          fontSize: T.h2,
          fontWeight: T.headingWeight,
          letterSpacing: T.tightTracking,
          lineHeight: 1.1,
          margin: 0,
        }}
      >
        {title}
      </h2>
      {sub && (
        <p
          style={{
            color: T.bodySoft,
            fontSize: T.lead,
            lineHeight: 1.6,
            margin: "16px 0 0",
          }}
        >
          {sub}
        </p>
      )}
    </Reveal>
  );
}
