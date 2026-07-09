"use client";

import { useState } from "react";
import { pushDataLayer } from "@/lib/gtm";
import { useAppUrl } from "@/lib/useAppUrl";

const FEATURES = [
  "190+ countries & all devices",
  "Credits never expire",
  "Real-time SERP data",
];

type Plan = {
  price: number;
  checks: number;
  label: string;
  popular?: boolean;
};

function Check() {
  return (
    <span
      style={{
        display: "grid",
        placeItems: "center",
        width: 18,
        height: 18,
        flexShrink: 0,
        borderRadius: 6,
        background: "#eff6ff",
        color: "#0454ff",
        marginTop: 1,
      }}
    >
      <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
        <path
          d="M2 7L5.5 10.5L12 3.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function PricingAccordion({ plans }: { plans: Plan[] }) {
  const appUrl = useAppUrl();
  const [index, setIndex] = useState(0);
  const plan = plans[index];
  const isFirst = index === 0;
  const isLast = index === plans.length - 1;

  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${plan.popular ? "#0454ff" : "#e5e7eb"}`,
        borderRadius: 20,
        padding: 28,
        boxShadow: plan.popular
          ? "0 0 0 1px rgba(4,84,255,.15), 0 12px 40px rgba(4,84,255,.12)"
          : "0 2px 12px rgba(0,0,0,.07)",
        transition: "border-color .2s, box-shadow .2s",
      }}
    >
      {/* Top badges */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.04em",
            padding: "4px 12px",
            borderRadius: 100,
            background: plan.popular ? "#eff6ff" : "#f3f4f6",
            color: plan.popular ? "#0454ff" : "#6b7280",
          }}
        >
          {plan.label}
        </span>

        {plan.popular && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase" as const,
              background: "#eff6ff",
              color: "#0454ff",
              border: "1px solid rgba(4,84,255,.2)",
              padding: "4px 12px",
              borderRadius: 100,
            }}
          >
            Recommended
          </span>
        )}
      </div>

      {/* Price */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 6,
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontSize: "clamp(42px, 8vw, 56px)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            color: "#111",
          }}
        >
          ${plan.price}
        </span>
        <span style={{ fontSize: 14, color: "#9ca3af" }}>/month</span>
      </div>

      <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 22px", fontWeight: 500 }}>
        {plan.checks.toLocaleString()} SERP checks
      </p>

      {/* Stepper box */}
      <div
        style={{
          background: "#f4f6fb",
          borderRadius: 14,
          padding: "16px 20px",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.09em",
              color: "#9ca3af",
              textTransform: "uppercase" as const,
            }}
          >
            SERP CHECKS
          </span>
          <span style={{ fontSize: 12, color: "#9ca3af" }}>
            {plan.checks.toLocaleString()} · ${plan.price} one-time
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <button
            type="button"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={isFirst}
            aria-label="Previous plan"
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              background: isFirst ? "#f9fafb" : "#fff",
              color: isFirst ? "#d1d5db" : "#374151",
              fontSize: 22,
              fontWeight: 400,
              cursor: isFirst ? "default" : "pointer",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
              lineHeight: 1,
            }}
          >
            −
          </button>

          <div
            style={{
              flex: 1,
              textAlign: "center",
              background: "#fff",
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              padding: "10px 0",
            }}
          >
            <span style={{ fontSize: 20, fontWeight: 600, color: "#111" }}>
              {plan.checks.toLocaleString()}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIndex((i) => Math.min(plans.length - 1, i + 1))}
            disabled={isLast}
            aria-label="Next plan"
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              background: isLast ? "#f9fafb" : "#fff",
              color: isLast ? "#d1d5db" : "#374151",
              fontSize: 22,
              fontWeight: 400,
              cursor: isLast ? "default" : "pointer",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
              lineHeight: 1,
            }}
          >
            +
          </button>
        </div>

        <p
          style={{
            fontSize: 12,
            color: "#9ca3af",
            margin: "12px 0 0",
            textAlign: "center",
          }}
        >
          Choose from {plans.length} pack sizes.
        </p>
      </div>

      {/* Features */}
      <ul
        style={{
          listStyle: "none",
          margin: "0 0 24px",
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {FEATURES.map((f) => (
          <li
            key={f}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              fontSize: 13,
              color: "#374151",
            }}
          >
            <Check />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href={appUrl("/signup")}
        onClick={() => pushDataLayer({ event: "cta_click" })}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          padding: "14px 20px",
          fontSize: 15,
          fontWeight: 600,
          borderRadius: 12,
          textDecoration: "none",
          cursor: "pointer",
          transition: "opacity .15s",
          ...(plan.popular
            ? {
                background: "#0454ff",
                color: "#fff",
                border: "none",
                boxShadow: "0 4px 16px rgba(4,84,255,.35)",
              }
            : {
                background: "#f4f6fb",
                color: "#111",
                border: "1px solid #e5e7eb",
              }),
        }}
      >
        {plan.popular ? "Get started →" : "Get started"}
      </a>
    </div>
  );
}
