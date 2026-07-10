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
          <Image src={image} alt={alt} width={width} height={height} loading="lazy" />
        </div>
      </div>
      <PopCard {...pop} position="tr" width={popWidth} />
    </div>
  );
}

export function InsideApp() {
  const [big1, card1, card2, card3, card4, big2] = INSIDE_APP;

  return (
    <section
      className="fs-section"
      style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 40px" }}
    >
      <SectionHead
        tag="INSIDE THE APP"
        title="Everything you need after the first check"
        sub="The Free SERP Checker is the front door. Once you're tracking keywords, this is the dashboard that does the daily work for you."
      />

      {/* Big: Rank Tracker */}
      <Reveal style={{ marginTop: 56 }}>
        <div className="fs-grid-2" style={{ gap: 40, alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <span
              style={{
                color: COLORS.blue,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {big1.kicker}
            </span>
            <h3 style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-0.03em", margin: 0 }}>
              {big1.title}
            </h3>
            <p style={{ color: COLORS.gray, fontSize: 15.5, lineHeight: 1.55, margin: 0 }}>
              {big1.text}
            </p>
            {big1.link && (
              <a href={big1.link.href} className="fs-inside-link">
                {big1.link.text}
              </a>
            )}
          </div>
          <AppShot image={big1.image} alt={big1.alt} pop={big1.pop} width={1600} height={909} />
        </div>
      </Reveal>

      {/* 2-col: Competitor Analysis | Projects */}
      <div className="fs-grid-2" style={{ marginTop: 24 }}>
        {[card1, card2].map((f) => (
          <Reveal key={f.title} delay={0.05}>
            <div
              style={{
                border: `1px solid ${COLORS.border}`,
                borderRadius: 20,
                padding: 28,
                background: COLORS.softGray,
                height: "100%",
              }}
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
              <h3 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.03em", margin: "10px 0 8px" }}>
                {f.title}
              </h3>
              <p style={{ color: COLORS.gray, fontSize: 15.5, lineHeight: 1.55, margin: "0 0 16px" }}>
                {f.text}
              </p>
              <div style={{ marginTop: 16 }}>
                <AppShot image={f.image} alt={f.alt} pop={f.pop} width={1572} height={788} popWidth={54} />
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* 2-col: Alerts | Favorites */}
      <div className="fs-grid-2" style={{ marginTop: 24 }}>
        {[card3, card4].map((f) => (
          <Reveal key={f.title} delay={0.05}>
            <div
              style={{
                border: `1px solid ${COLORS.border}`,
                borderRadius: 20,
                padding: 28,
                background: COLORS.softGray,
                height: "100%",
              }}
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
              <h3 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.03em", margin: "10px 0 8px" }}>
                {f.title}
              </h3>
              <p style={{ color: COLORS.gray, fontSize: 15.5, lineHeight: 1.55, margin: "0 0 16px" }}>
                {f.text}
              </p>
              <div style={{ marginTop: 16 }}>
                <AppShot
                  image={f.image}
                  alt={f.alt}
                  narrow={f.narrow}
                  pop={f.pop}
                  width={f.narrow ? 436 : 1378}
                  height={f.narrow ? 384 : 830}
                  popWidth={f.narrow ? 58 : 52}
                />
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Big: Google Search Console */}
      <Reveal style={{ marginTop: 24 }}>
        <div className="fs-grid-2" style={{ gap: 40, alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              order: 1,
            }}
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
              {big2.kicker}
            </span>
            <h3 style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-0.03em", margin: 0 }}>
              {big2.title}
            </h3>
            <p style={{ color: COLORS.gray, fontSize: 15.5, lineHeight: 1.55, margin: 0 }}>
              {big2.text}
            </p>
            {big2.link && (
              <a href={big2.link.href} className="fs-inside-link">
                {big2.link.text}
              </a>
            )}
          </div>
          <div style={{ order: 2 }}>
            <AppShot image={big2.image} alt={big2.alt} pop={big2.pop} width={1600} height={522} />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
