"use client";

import { Reveal } from "@/components/site/Reveal";
import { SparkleIcon } from "@/components/site/icons";
import { COLORS, appUrl } from "@/components/site/constants";
import { pushDataLayer } from "@/lib/gtm";

export function Cta() {
  return (
    <section style={{ padding: "100px 0 80px" }}>
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
            <SparkleIcon size={18} fill="#fff" />
            Get Started
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
            Start checking your rankings
          </h2>
          <p
            style={{
              color: "#fff",
              maxWidth: 560,
              margin: "0 auto 28px",
              fontSize: 18,
              lineHeight: 1.5,
              opacity: 0.92,
            }}
          >
            Enter your domain, your keyword, your country, and your device. Click Check
            Rankings — you&apos;ll see your real Google position in under 10 seconds.
          </p>
          <div style={{ display: "inline-flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                pushDataLayer({ event: "cta_click" });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
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
              Check My Rankings →
            </a>
            <a
              href={appUrl("/signup")}
              onClick={() => pushDataLayer({ event: "cta_click" })}
              className="fs-btn"
              style={{
                display: "inline-block",
                background: "rgba(255,255,255,.18)",
                color: "#fff",
                padding: "14px 32px",
                borderRadius: 100,
                textDecoration: "none",
                fontWeight: 600,
                backdropFilter: "blur(8px)",
              }}
            >
              Sign Up Free
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
