"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { COLORS } from "@/components/site/constants";
import { STEPS } from "./data";

const INTERVAL_MS = 5000;
const TOTAL = String(STEPS.length).padStart(2, "0");

/* ─── inline icons (lucide-react is not a dependency in this project) ─── */
function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}
function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 0 20 15.3 15.3 0 0 1 0-20" />
    </svg>
  );
}

export function Steps() {
  const [active, setActive] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [progress, setProgress] = useState(0);
  const pausedRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-advance: a rAF loop drives the progress bar and flips to the next
  // step when the interval elapses. Re-runs whenever `active` changes so a
  // manual jump (or the previous step finishing) restarts the timer cleanly.
  useEffect(() => {
    if (!autoPlay) return;
    let rafId = 0;
    let start = performance.now();
    let prog = 0;
    const tick = (now: number) => {
      if (pausedRef.current) {
        // freeze: keep `start` aligned to the current progress
        start = now - (prog / 100) * INTERVAL_MS;
        rafId = requestAnimationFrame(tick);
        return;
      }
      const elapsed = now - start;
      prog = Math.min(100, (elapsed / INTERVAL_MS) * 100);
      setProgress(prog);
      if (elapsed >= INTERVAL_MS) {
        setActive((p) => (p + 1) % STEPS.length);
        return;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [active, autoPlay]);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  // Pause auto-advance briefly after any manual interaction.
  const userInteracted = () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    pausedRef.current = true;
    resumeTimerRef.current = setTimeout(() => {
      pausedRef.current = false;
      resumeTimerRef.current = null;
    }, 4000);
  };

  const goTo = (i: number) => {
    setActive(i);
    setProgress(0);
    userInteracted();
  };
  const next = () => goTo((active + 1) % STEPS.length);
  const prev = () => goTo((active - 1 + STEPS.length) % STEPS.length);
  const toggleAutoPlay = () => {
    setAutoPlay((p) => !p);
    setProgress(0);
  };

  const step = STEPS[active];

  const ctrlBtn: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 38,
    height: 38,
    borderRadius: 9,
    cursor: "pointer",
    border: `1px solid ${COLORS.border}`,
    background: "#fff",
    color: COLORS.gray,
  };
  const primaryBtn: CSSProperties = {
    ...ctrlBtn,
    border: "1px solid transparent",
    background: COLORS.blue,
    color: "#fff",
  };

  return (
    <section
      id="how-it-works"
      style={{
        position: "relative",
        margin: "100px auto 0",
        padding: "100px 40px 100px",
        scrollMarginTop: 80,
        overflow: "hidden",
        background:
          "radial-gradient(60% 50% at 20% 0%, rgba(4,84,255,.10) 0%, transparent 70%), radial-gradient(50% 50% at 90% 30%, rgba(126,91,255,.08) 0%, transparent 70%), radial-gradient(60% 60% at 50% 100%, rgba(4,84,255,.06) 0%, transparent 70%)",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <SectionHead
          tag="How The Free SERP Checker Tool Works"
          title="Track. Analyze. Improve. Outrank."
          sub={`From sign-up to a shareable AI-powered SEO plan in ${STEPS.length} steps. No credit card. No setup time.`}
        />

        <Reveal style={{ maxWidth: 1000, margin: "56px auto 0" }}>
          <div
            onMouseEnter={() => {
              pausedRef.current = true;
            }}
            onMouseLeave={() => {
              if (!resumeTimerRef.current) pausedRef.current = false;
            }}
            style={{ position: "relative" }}
          >
            {/* soft halo behind the frame */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: "-28px -8px -56px",
                zIndex: 0,
                pointerEvents: "none",
                background:
                  "radial-gradient(60% 60% at 50% 40%, rgba(4,84,255,.16), transparent 72%)",
                filter: "blur(18px)",
              }}
            />

            {/* ─── browser frame ─── */}
            <div
              style={{
                position: "relative",
                zIndex: 1,
                borderRadius: 16,
                overflow: "hidden",
                border: `1px solid ${COLORS.border}`,
                background: "#fff",
                boxShadow:
                  "0 40px 80px rgba(8,32,96,.22), 0 12px 32px rgba(8,32,96,.16), 0 0 0 1px rgba(255,255,255,.6)",
              }}
            >
              {/* window chrome */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "10px 14px",
                  borderBottom: `1px solid ${COLORS.border}`,
                  background: COLORS.softGray,
                }}
              >
                <div style={{ display: "flex", gap: 6 }}>
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: "#d6d8df",
                      }}
                    />
                  ))}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    minWidth: 0,
                    maxWidth: "62%",
                    padding: "5px 12px",
                    borderRadius: 8,
                    border: `1px solid ${COLORS.border}`,
                    background: "#fff",
                    fontSize: 12,
                    fontFamily: "var(--font-geist-mono)",
                  }}
                >
                  <span style={{ color: COLORS.subtle, flexShrink: 0, display: "inline-flex" }}>
                    <GlobeIcon />
                  </span>
                  <span style={{ color: COLORS.gray, flexShrink: 0 }}>
                    {step.route.startsWith("/dashboard") ? "app.freeserp.com" : "freeserp.com"}
                  </span>
                  <span
                    style={{
                      color: "#0f1018",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {step.route}
                  </span>
                </div>
                <span
                  style={{
                    width: 32,
                    textAlign: "right",
                    fontSize: 9,
                    fontFamily: "var(--font-geist-mono)",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: COLORS.subtle,
                  }}
                >
                  live
                </span>
              </div>

              {/* screenshot — all steps stacked, crossfaded on opacity so
                  switching never flashes an unloaded image */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: `${step.w} / ${step.h}`,
                  background: "#fff",
                }}
              >
                {STEPS.map((s, i) => (
                  <Image
                    key={s.src}
                    src={s.src}
                    alt={s.alt}
                    title={s.title}
                    fill
                    priority={i === 0}
                    sizes="(max-width: 1040px) 100vw, 960px"
                    style={{
                      objectFit: "cover",
                      objectPosition: "top center",
                      opacity: i === active ? 1 : 0,
                      transition: "opacity .45s ease",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* ─── caption + controls ─── */}
            <div
              style={{
                position: "relative",
                zIndex: 1,
                marginTop: 24,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 20,
              }}
            >
              <div style={{ flex: "1 1 320px", minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontFamily: "var(--font-geist-mono)",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: COLORS.blue,
                  }}
                >
                  Step {step.n} of {TOTAL}
                </div>
                <h3
                  style={{
                    margin: "8px 0 0",
                    fontSize: "clamp(20px, 2.4vw, 26px)",
                    fontWeight: 600,
                    letterSpacing: "-0.03em",
                    lineHeight: 1.25,
                    color: "#0f1018",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    margin: "8px 0 0",
                    maxWidth: 620,
                    fontSize: 15,
                    lineHeight: 1.6,
                    color: COLORS.gray,
                  }}
                >
                  {step.desc}
                </p>
              </div>

              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button
                  type="button"
                  className="fs-tour-btn"
                  style={ctrlBtn}
                  onClick={toggleAutoPlay}
                  aria-label={autoPlay ? "Pause auto-advance" : "Play auto-advance"}
                >
                  {autoPlay ? <PauseIcon /> : <PlayIcon />}
                </button>
                <button
                  type="button"
                  className="fs-tour-btn"
                  style={ctrlBtn}
                  onClick={prev}
                  aria-label="Previous step"
                >
                  <ChevronLeftIcon />
                </button>
                <button
                  type="button"
                  className="fs-tour-btn fs-tour-btn--primary"
                  style={primaryBtn}
                  onClick={next}
                  aria-label="Next step"
                >
                  <ChevronRightIcon />
                </button>
              </div>
            </div>

            {/* ─── step strip ─── */}
            <div className="fs-tour-strip" style={{ position: "relative", zIndex: 1, marginTop: 22 }}>
              {STEPS.map((s, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={s.n}
                    type="button"
                    className="fs-tour-chip"
                    onClick={() => goTo(i)}
                    aria-pressed={isActive}
                    aria-label={`Go to step ${s.n}: ${s.label}`}
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      textAlign: "left",
                      padding: "10px 12px",
                      borderRadius: 10,
                      cursor: "pointer",
                      border: `1px solid ${isActive ? "rgba(4,84,255,.4)" : COLORS.border}`,
                      background: isActive ? COLORS.blueBg : "#fff",
                    }}
                  >
                    {isActive && (
                      <span
                        style={{
                          position: "absolute",
                          left: 0,
                          bottom: 0,
                          height: 2,
                          width: `${progress}%`,
                          background: COLORS.blue,
                          transition: "width 100ms linear",
                        }}
                      />
                    )}
                    <div
                      style={{
                        fontSize: 10,
                        fontFamily: "var(--font-geist-mono)",
                        letterSpacing: "0.14em",
                        color: isActive ? COLORS.blue : COLORS.subtle,
                      }}
                    >
                      {s.n}
                    </div>
                    <div
                      style={{
                        marginTop: 3,
                        fontSize: 12.5,
                        fontWeight: 500,
                        lineHeight: 1.3,
                        color: isActive ? "#0f1018" : COLORS.gray,
                      }}
                    >
                      {s.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
