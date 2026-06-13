"use client";

import { Reveal } from "@/components/site/Reveal";
import { COLORS, appUrl } from "@/components/site/constants";
import { pushDataLayer } from "@/lib/gtm";

export function Cta() {
  return (
    <section style={{ padding: "80px 0" }}>
      <div
        className="fs-cta-inner"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: 80,
          borderRadius: 24,
          textAlign: "center",
          backgroundImage:
            "url(https://framerusercontent.com/images/uBWoN7hnAElyBXYe18qKfbasI.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Reveal>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#000",
              color: "#fff",
              padding: "9px 18px",
              borderRadius: 100,
              fontSize: 14,
              marginBottom: 24,
              boxShadow: "inset 0 1px 2px rgba(255,255,255,.5)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
              <path
                d="M 10 0 C 10.2 5.44 14.56 9.8 20 10 C 14.56 10.2 10.2 14.56 10 20 C 9.8 14.56 5.44 10.2 0 10 C 5.44 9.8 9.8 5.44 10 0 Z"
                fill="#fff"
              />
            </svg>
            Free tier · No credit card · Pro from $20/mo
          </div>
          <h2
            style={{
              color: "#fff",
              fontSize: "clamp(28px, 4vw, 56px)",
              fontWeight: 600,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              margin: "0 0 20px",
            }}
          >
            Track rankings.
            <br />
            Outrank rivals. Free.
          </h2>
          <p
            style={{
              color: "#fff",
              maxWidth: 520,
              margin: "0 auto 28px",
              fontSize: 18,
              lineHeight: 1.5,
              opacity: 0.92,
            }}
          >
            5 free SERP checks a day, real-time ranking data, daily rank updates, and competitor intelligence — for SEOs, marketers, and developers. Upgrade to Pro for 300 checks that never expire.
          </p>
          <a
            href={appUrl("/signup")}
            onClick={() => pushDataLayer({ event: "cta_click" })}
            className="fs-btn"
            style={{
              display: "inline-block",
              background: COLORS.blue,
              color: "#fff",
              padding: "14px 32px",
              borderRadius: 100,
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Start Tracking for Free →
          </a>
        </Reveal>
      </div>
    </section>
  );
}
