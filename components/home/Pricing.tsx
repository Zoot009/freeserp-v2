"use client";

import { useState } from "react";
import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { CheckIcon } from "@/components/site/icons";
import { COLORS, appUrl } from "@/components/site/constants";
import { PLANS } from "./data";

type Billing = "monthly" | "yearly";

export function Pricing() {
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <section className="fs-section" style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 40px" }}>
      <SectionHead
        tag="WHY FREE?"
        title="No paywalls. Ever."
        sub="While others charge $99–$999/month for basic SERP tracking, we believe keyword research should be free for everyone. No credit card. No limits. No BS."
      />

      <Reveal style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
        <div
          style={{
            background: COLORS.softGray,
            padding: 6,
            borderRadius: 100,
            position: "relative",
            display: "flex",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 6,
              bottom: 6,
              width: 120,
              background: COLORS.blue,
              borderRadius: 100,
              transition: "transform .3s ease",
              transform: `translateX(${billing === "monthly" ? 0 : 120}px)`,
            }}
          />
          {(["monthly", "yearly"] as const).map((b) => (
            <button
              key={b}
              onClick={() => setBilling(b)}
              style={{
                position: "relative",
                background: "transparent",
                border: "none",
                width: 120,
                padding: "12px 0",
                fontSize: 14,
                fontWeight: 600,
                color: billing === b ? "#fff" : COLORS.black,
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {b}
            </button>
          ))}
        </div>
      </Reveal>

      <div className="fs-grid-2" style={{ marginTop: 40 }}>
        {PLANS[billing].map((plan, i) => (
          <Reveal key={plan.name} delay={i * 0.1}>
            <div
              style={{
                background: plan.featured
                  ? "radial-gradient(120% 90% at 50% 0%, #4a8fff 0%, #0454ff 45%, #03155a 100%)"
                  : COLORS.softGray,
                borderRadius: 24,
                padding: 24,
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
                <h4
                  style={{
                    fontSize: 28,
                    fontWeight: 500,
                    letterSpacing: "-0.02em",
                    margin: "0 0 12px",
                  }}
                >
                  {plan.name}
                </h4>
                <p style={{ color: COLORS.gray, fontSize: 16, lineHeight: 1.5, margin: "0 0 32px" }}>
                  {plan.desc}
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
                    className="fs-btn"
                    style={{
                      display: "inline-block",
                      background: plan.featured ? COLORS.blue : "transparent",
                      border: plan.featured ? "none" : `1px solid ${COLORS.black}`,
                      color: plan.featured ? "#fff" : COLORS.black,
                      padding: "14px 26px",
                      borderRadius: 100,
                      textDecoration: "none",
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    {plan.cta} →
                  </a>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                    <span style={{ fontSize: 24, fontWeight: 600 }}>$</span>
                    <span
                      style={{ fontSize: 48, fontWeight: 700, letterSpacing: "-0.04em" }}
                    >
                      {plan.price}
                    </span>
                    <span style={{ fontSize: 18, fontWeight: 600 }}>
                      /{billing === "monthly" ? "month" : "year"}
                    </span>
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
                {plan.features.map((feat) => (
                  <div key={feat} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <CheckIcon />
                    <span
                      style={{
                        fontSize: 15,
                        color: plan.featured ? "rgba(255,255,255,.95)" : COLORS.black,
                      }}
                    >
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
