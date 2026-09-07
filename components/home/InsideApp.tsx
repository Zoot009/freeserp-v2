import { useId } from "react";
import Image from "next/image";
import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { COLORS } from "@/components/site/constants";
import { INSIDE_APP } from "./data";

export function PopCard({
  label,
  num,
  badge,
  color,
  position,
  width = 44,
}: {
  label: string;
  num: string;
  badge?: string;
  color: string;
  position: "tr" | "br";
  width?: number;
}) {
  const gradientId = `pop-spark-${useId()}`;
  return (
    <div className={`fs-pop fs-pop-${position}`} style={{ width: `${width}%` }}>
      <div className="fs-pop-card">
        <div className="fs-pop-label">{label}</div>
        <div className="fs-pop-metric">
          <span className="fs-pop-num">{num}</span>
          {badge && (
            <span className="fs-pop-badge" style={{ background: color }}>
              {badge}
            </span>
          )}
        </div>
        <svg
          className="fs-pop-spark"
          viewBox="0 0 240 70"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={color} stopOpacity=".26" />
              <stop offset="1" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,55 L30,50 L60,52 L90,42 L120,45 L150,34 L180,30 L210,20 L240,15 L240,70 L0,70 Z"
            fill={`url(#${gradientId})`}
          />
          <path
            d="M0,55 L30,50 L60,52 L90,42 L120,45 L150,34 L180,30 L210,20 L240,15"
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

function AppShot({
  image,
  alt,
  narrow,
  pop,
  width,
  height,
  popWidth = 46,
}: {
  image: string;
  alt: string;
  narrow?: boolean;
  pop: { label: string; num: string; badge?: string; color: string };
  width: number;
  height: number;
  popWidth?: number;
}) {
  return (
    <div className="fs-shot">
      <div className="fs-app-frame">
        <div className={`fs-app-frame-shot${narrow ? " fs-narrow" : ""}`}>
          <Image
            src={image}
            alt={alt}
            width={width}
            height={height}
            loading="lazy"
            sizes="(max-width: 1000px) 100vw, 600px"
          />
        </div>
      </div>
      <PopCard {...pop} position="tr" width={popWidth} />
    </div>
  );
}

/**
 * "Inside the app" — one full-width row per screen.
 *
 * This used to be a big row, then two rows of half-width cards, then another big
 * row. The cards were the problem: at half width the screenshots were too small
 * to read, two different image shapes side by side ended at different heights,
 * and the floating stat card covered most of the shot it was annotating. Every
 * item now gets the same full-width treatment the Rank Tracker and Search
 * Console rows always had, alternating sides so the screenshots zig-zag rather
 * than lining up in a single right-hand column.
 *
 * Uniform rows also mean there is one code path instead of three, so adding a
 * screen is a new entry in INSIDE_APP and nothing else.
 */
export function InsideApp() {
  return (
    <section
      className="fs-section"
      style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 40px" }}
    >
      <SectionHead
        tag="INSIDE THE APP"
        title="Everything you need after the first check"
        sub="This is the front door. Once you're tracking keywords, this is the dashboard that does the daily work for you."
      />

      <div style={{ marginTop: 56, display: "flex", flexDirection: "column", gap: 72 }}>
        {INSIDE_APP.map((f, i) => (
          <Reveal key={f.title}>
            {/* Odd rows flip, so the screenshots zig-zag down the page instead of
                stacking in one right-hand column. The swap is done with `order`
                rather than by reordering the markup, so the copy still comes
                first in the DOM on every row. */}
            <div
              className={`fs-grid-2 fs-alt-row${i % 2 === 1 ? " fs-flip" : ""}`}
              style={{ gap: 40, alignItems: "center" }}
            >
              <div
                className="fs-alt-copy"
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                <span
                  style={{
                    color: COLORS.blue,
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {f.kicker}
                </span>
                <h3 style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-0.03em", margin: 0 }}>
                  {f.title}
                </h3>
                <p style={{ color: COLORS.gray, fontSize: 15.5, lineHeight: 1.55, margin: 0 }}>
                  {f.text}
                </p>
                {f.link && (
                  <a href={f.link.href} className="fs-inside-link">
                    {f.link.text}
                  </a>
                )}
              </div>
              <div className="fs-alt-media">
                <AppShot
                  image={f.image}
                  alt={f.alt}
                  narrow={f.narrow}
                  pop={f.pop}
                  width={f.w}
                  height={f.h}
                />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
