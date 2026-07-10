"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/site/Reveal";
import { COLORS } from "@/components/site/constants";
import { pushDataLayer } from "@/lib/gtm";
import { PopCard } from "@/components/home/InsideApp";

export function Hero() {
  return (
    <header
      className="fs-hero"
      style={{
        paddingTop: 160,
        paddingBottom: 120,
        textAlign: "center",
        backgroundImage:
          "url(https://framerusercontent.com/images/LTzUgqhBMU0fYD8l2vHeGvu8dQI.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ padding: "0 24px", marginBottom: 28 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
              justifyContent: "center",
              maxWidth: "100%",
              background: COLORS.blue,
              color: "#fff",
              padding: "9px 18px 9px 10px",
              borderRadius: 100,
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "0.02em",
              boxShadow: "inset 0 .5px 1px rgba(255,255,255,.4)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
              <path d="M12 0 C12.3 6.6 17.4 11.7 24 12 C17.4 12.3 12.3 17.4 12 24 C11.7 17.4 6.6 12.3 0 12 C6.6 11.7 11.7 6.6 12 0 Z" />
            </svg>
            <span style={{ flexShrink: 1, minWidth: 0 }}>50M+ Keywords · 190 Countries · Daily Updates · Free Tier Available</span>
          </div>
        </div>
        <h1
          style={{
            color: "#fff",
            fontSize: "clamp(36px, 5.5vw, 80px)",
            fontWeight: 600,
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            margin: 0,
            padding: "0 20px",
          }}
        >
          FreeSERP — Track Rankings and
          <br />
          Outrank Your Competitors.
        </h1>
        <p
          style={{
            color: "#fff",
            maxWidth: 630,
            margin: "20px auto 0",
            fontSize: 16,
            lineHeight: 1.4,
            fontWeight: 400,
            letterSpacing: "-0.2px",
            padding: "0 20px",
          }}
        >
          Track real-time keyword rankings, monitor daily position changes, and
          expose every gap your competitors have over you. No credit card required. Built for SEOs,
          marketers, and developers.
        </p>

        <Link
          href="/serp-checker"
          onClick={() => pushDataLayer({ event: "cta_click" })}
          className="fs-btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            marginTop: 36,
            background: "#000",
            color: "#fff",
            padding: "16px 34px",
            borderRadius: 100,
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: "-0.1px",
            textDecoration: "none",
            boxShadow: "0 14px 34px rgba(8, 32, 96, .28)",
          }}
        >
          Free SERP Checker
        </Link>
      </div>

      <div
        id="fs-cursor-zone"
        className="fs-hero-cursor-zone"
        style={{
          maxWidth: 1360,
          margin: "90px auto 0",
          padding: "0 60px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Reveal>
          <div className="fs-shot">
            <Image
              src="/hero-dashboard.jpg"
              alt="FreeSERP dashboard"
              width={1600}
              height={909}
              priority
              sizes="(max-width: 1360px) 100vw, 1240px"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                borderRadius: 18,
                boxShadow:
                  "0 40px 80px rgba(8, 32, 96, .35), 0 12px 32px rgba(8, 32, 96, .25), 0 0 0 1px rgba(255,255,255,.18)",
              }}
            />
            <PopCard
              label="Average Position Changes"
              num="36.0"
              badge="2.4"
              color={COLORS.blue}
              position="tr"
              width={24}
            />
          </div>
        </Reveal>
      </div>
    </header>
  );
}
