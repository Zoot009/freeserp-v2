"use client";

import { Reveal } from "@/components/site/Reveal";
import { Tag } from "@/components/site/Tag";
import { COLORS } from "@/components/site/constants";
import { pushDataLayer } from "@/lib/gtm";
import { INTEGRATIONS } from "./data";

const POSITIONS: Array<React.CSSProperties> = [
  { top: "12%", left: "6%" },
  { top: "45%", left: "3%" },
  { top: "78%", left: "8%" },
  { top: "12%", right: "6%" },
  { top: "45%", right: "3%" },
  { top: "78%", right: "8%" },
];

export function Integration() {
  return (
    <section style={{ padding: "80px 0" }}>
      <div
        className="fs-integration-inner"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "140px 40px",
          borderRadius: 24,
          textAlign: "center",
          background:
            "radial-gradient(ellipse 80% 100% at 50% 50%, #4a8fff 0%, #0454ff 45%, #03155a 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className="fs-floating-cards"
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          {INTEGRATIONS.map((i, idx) => (
            <div
              key={i.name}
              style={{
                position: "absolute",
                ...POSITIONS[idx],
                background: "#fff",
                borderRadius: 12,
                padding: "10px 16px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                boxShadow: "0 12px 30px rgba(0,0,0,.18)",
                pointerEvents: "auto",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={i.img}
                alt={i.name}
                width={24}
                height={24}
                loading="lazy"
                decoding="async"
                style={{ width: 24, height: 24 }}
              />
              <span style={{ fontSize: 13, fontWeight: 500, color: COLORS.black }}>
                {i.name}
              </span>
            </div>
          ))}
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <Reveal>
            <Tag text="GLOBAL COVERAGE" light />
            <h2
              style={{
                color: "#fff",
                fontSize: "clamp(28px, 4vw, 48px)",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
                margin: "20px 0 16px",
              }}
            >
              50M+ keywords across 190+ countries
            </h2>
            <p
              style={{
                color: "#fff",
                maxWidth: 420,
                margin: "0 auto 40px",
                fontSize: 16,
                lineHeight: 1.5,
                opacity: 0.85,
              }}
            >
              Real-time Google SERP data, daily rank updates, and city-level targeting — free to start.
            </p>
            <a
              href="/serp-checker"
              onClick={() => pushDataLayer({ event: "cta_click" })}
              className="fs-btn"
              style={{
                display: "inline-block",
                background: "#fff",
                color: COLORS.black,
                padding: "14px 32px",
                borderRadius: 100,
                textDecoration: "none",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Open Free SERP Checker →
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
