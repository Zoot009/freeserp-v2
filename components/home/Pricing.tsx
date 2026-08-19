"use client";

import { useState } from "react";
import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { COLORS } from "@/components/site/constants";
import { useAppUrl } from "@/lib/useAppUrl";
import { pushDataLayer } from "@/lib/gtm";

const FREE_FEATURES = [
  "100 credits every month",
  "Every tool unlocked",
  "190+ countries & all devices",
  "No credit card required",
];

const PAID_FEATURES = [
  "Automated recurring rank checks",
  "Local map grid scans, site audits and keyword research",
  "Competitor and internal-link analysis",
  "190+ countries & all devices",
  "Priority support",
  "Cancel anytime",
];

// One credit checks one keyword. Keep in step with the backend's
// credits/catalog.ts, which is what actually gets charged.
const PAID_PLANS = [
  { price: 19, credits: 2_000,  label: "Starter"                },
  { price: 49, credits: 6_000,  label: "Pro", popular: true     },
  { price: 99, credits: 15_000, label: "Agency"                 },
];

function DarkCheck() {
  return (
    <span
      style={{
        display: "grid",
        placeItems: "center",
        width: 20,
        height: 20,
        flexShrink: 0,
        borderRadius: "50%",
        background: COLORS.black,
      }}
    >
      <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
        <path d="M2 7L5.5 10.5L12 3.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function LightCheck() {
  return (
    <span
      style={{
        display: "grid",
        placeItems: "center",
        width: 20,
        height: 20,
        flexShrink: 0,
        borderRadius: "50%",
        background: "rgba(255,255,255,.2)",
      }}
    >
      <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
        <path d="M2 7L5.5 10.5L12 3.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function Pricing() {
  const appUrl = useAppUrl();
  const [index, setIndex] = useState(2);
  const plan = PAID_PLANS[index];
  // Credits per day if you spread the month evenly — the number people
  // actually compare against "how many keywords do I track?".
  const perDay = Math.floor(plan.credits / 30);
  const isFirst = index === 0;
  const isLast = index === PAID_PLANS.length - 1;

  return (
    <section className="fs-section" style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 40px" }}>
      <SectionHead
        tag="PRICING"
        title="Simple plans. No surprises."
        sub="One credit checks one keyword, and the same balance pays for audits, local grids and keyword research. Start free with 100 credits a month."
      />

      <div className="fs-grid-2" style={{ marginTop: 40 }}>
        {/* ── Free card ── */}
        <Reveal style={{ height: "100%" }}>
          <div
            style={{
              background: COLORS.softGray,
              borderRadius: 24,
              padding: 24,
              height: "100%",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: 32,
                boxShadow: "0 12px 36px rgba(0,0,0,.08)",
              }}
            >
              <h4 style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em", margin: "0 0 12px" }}>
                Free
              </h4>
              <p style={{ color: COLORS.gray, fontSize: 16, lineHeight: 1.5, margin: "0 0 32px" }}>
                100 credits every month, refilled automatically — no credit card. Enough to try every tool properly.
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 16,
                }}
              >
                <a
                  href={appUrl("/signup")}
                  onClick={() => pushDataLayer({ event: "cta_click" })}
                  className="fs-btn"
                  style={{
                    display: "inline-block",
                    background: "transparent",
                    border: `1px solid ${COLORS.black}`,
                    color: COLORS.black,
                    padding: "14px 26px",
                    borderRadius: 100,
                    textDecoration: "none",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  Start for Free →
                </a>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontSize: 24, fontWeight: 600 }}>$</span>
                  <span style={{ fontSize: 48, fontWeight: 700, letterSpacing: "-0.04em" }}>0</span>
                  <span style={{ fontSize: 18, fontWeight: 600 }}>/7 days</span>
                </div>
              </div>
            </div>

            <div
              className="fs-pricing-features"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginTop: 32,
                padding: "0 12px",
              }}
            >
              {FREE_FEATURES.map((feat) => (
                <div key={feat} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <DarkCheck />
                  <span style={{ fontSize: 15, color: COLORS.black }}>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ── Paid card ── */}
        <Reveal delay={0.1} style={{ height: "100%" }}>
          <div
            style={{
              background: "radial-gradient(120% 90% at 50% 0%, #4a8fff 0%, #0454ff 45%, #03155a 100%)",
              borderRadius: 24,
              padding: 24,
              height: "100%",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: 32,
                boxShadow: "0 12px 36px rgba(0,0,0,.08)",
              }}
            >
              <h4 style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em", margin: "0 0 12px" }}>
                {plan.label}
              </h4>
              <p style={{ color: COLORS.gray, fontSize: 16, lineHeight: 1.5, margin: "0 0 24px" }}>
                {plan.credits.toLocaleString()} credits a month — about {perDay.toLocaleString()} keywords checked every day, or spend them on audits, grids and research instead. Cancel anytime.
              </p>

              {/* Stepper */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 28,
                  background: "#f4f6fb",
                  borderRadius: 14,
                  padding: "10px 14px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setIndex((i) => Math.max(0, i - 1))}
                  disabled={isFirst}
                  aria-label="Previous plan"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    background: isFirst ? "#f9fafb" : "#fff",
                    color: isFirst ? "#d1d5db" : "#374151",
                    fontSize: 20,
                    cursor: isFirst ? "default" : "pointer",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  −
                </button>
                <div
                  style={{
                    flex: 1,
                    textAlign: "center",
                    background: "#fff",
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    padding: "8px 0",
                  }}
                >
                  <span style={{ fontSize: 18, fontWeight: 600, color: "#111" }}>
                    {plan.credits.toLocaleString()} credits / mo
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIndex((i) => Math.min(PAID_PLANS.length - 1, i + 1))}
                  disabled={isLast}
                  aria-label="Next plan"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    background: isLast ? "#f9fafb" : "#fff",
                    color: isLast ? "#d1d5db" : "#374151",
                    fontSize: 20,
                    cursor: isLast ? "default" : "pointer",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  +
                </button>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 16,
                }}
              >
                <a
                  href={appUrl("/signup")}
                  onClick={() => pushDataLayer({ event: "cta_click" })}
                  className="fs-btn"
                  style={{
                    display: "inline-block",
                    background: COLORS.blue,
                    border: "none",
                    color: "#fff",
                    padding: "14px 26px",
                    borderRadius: 100,
                    textDecoration: "none",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  Get started →
                </a>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontSize: 24, fontWeight: 600 }}>$</span>
                  <span style={{ fontSize: 48, fontWeight: 700, letterSpacing: "-0.04em" }}>
                    {plan.price}
                  </span>
                  <span style={{ fontSize: 18, fontWeight: 600 }}>/mo</span>
                </div>
              </div>
            </div>

            <div
              className="fs-pricing-features"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginTop: 32,
                padding: "0 12px",
              }}
            >
              {PAID_FEATURES.map((feat) => (
                <div key={feat} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <LightCheck />
                  <span style={{ fontSize: 15, color: "rgba(255,255,255,.95)" }}>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
