"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/site/Reveal";
import { pushDataLayer } from "@/lib/gtm";
import { PopCard } from "@/components/home/InsideApp";
import { T, container } from "./theme";

/**
 * The hero, rebuilt on the Qupe template's own measurements.
 *
 * It was a dark blue photograph served from framerusercontent.com with white
 * text over it. Qupe's hero is the opposite and it is the whole reason the
 * template reads as calm: a white ground, near-black type at 72px, one line of
 * grey underneath, and the product shot doing all of the colour.
 *
 * Two CTAs rather than one, as the reference has — the primary asks for the
 * thing we want, the secondary gives the larger half of the audience somewhere
 * to go that is not a signup.
 */
export function Hero() {
  return (
    <header
      style={{
        background: T.bg,
        paddingTop: 120,
        paddingBottom: 0,
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ ...container(), padding: `0 ${T.sectionX}px` }}>
        {/* The eyebrow pill. Qupe's is a hairline-bordered chip on white, not a
            filled block — it announces without competing with the headline. */}
        <div style={{ marginBottom: 28 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              border: `1px solid ${T.border}`,
              background: T.bg,
              color: T.body,
              padding: "7px 14px",
              borderRadius: T.radiusPill,
              fontSize: T.small,
              fontWeight: 500,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                background: T.accent,
                display: "inline-block",
              }}
            />
            50M+ keywords · 190+ countries · daily updates
          </span>
        </div>

        <h1
          style={{
            color: T.ink,
            fontSize: T.h1,
            fontWeight: T.headingWeight,
            letterSpacing: T.tightTracking,
            lineHeight: 1.05,
            margin: 0,
            maxWidth: 900,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Track your rankings, and outrank your competitors
        </h1>

        <p
          style={{
            color: T.bodySoft,
            maxWidth: 620,
            margin: "22px auto 0",
            fontSize: T.lead,
            lineHeight: 1.55,
          }}
        >
          Daily keyword positions from real Google searches, the gaps your
          competitors are winning, and a full SEO toolkit on one balance. No card
          required.
        </p>

        {/* Qupe stacks two CTAs. Primary in the accent, secondary as a plain
            bordered button — the same shape, so they read as one control pair
            rather than a button and a link. */}
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: 34,
          }}
        >
          <Link
            href="/serp-checker"
            onClick={() => pushDataLayer({ event: "cta_click" })}
            className="fs-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: T.accent,
              color: "#fff",
              padding: "14px 26px",
              borderRadius: T.radius,
              fontSize: 15,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Check a keyword free
          </Link>
          <Link
            href="/pricing"
            className="fs-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: T.bg,
              color: T.ink,
              border: `1px solid ${T.border}`,
              padding: "14px 26px",
              borderRadius: T.radius,
              fontSize: 15,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            See pricing
          </Link>
        </div>
      </div>

      {/*
        The product shot, bleeding into the section below it.
        Qupe ends its hero on the screenshot rather than on whitespace, which is
        what makes the page feel like it starts inside the product.
      */}
      <div
        id="fs-cursor-zone"
        className="fs-hero-cursor-zone"
        style={{
          maxWidth: 1200,
          margin: "72px auto 0",
          padding: `0 ${T.sectionX}px`,
          position: "relative",
        }}
      >
        <Reveal>
          <div className="fs-shot">
            <Image
              src="/hero-dashboard.jpg"
              alt="The FreeSERP dashboard, showing tracked keywords and their daily positions"
              width={1600}
              height={909}
              priority
              sizes="(max-width: 1200px) 100vw, 1152px"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                borderRadius: T.radiusLg,
                border: `1px solid ${T.border}`,
                // Soft and low, not the heavy blue drop the dark hero needed.
                boxShadow: "0 24px 60px rgba(17,17,17,.10), 0 4px 12px rgba(17,17,17,.05)",
              }}
            />
            <PopCard
              label="Average Position Changes"
              num="36.0"
              badge="2.4"
              color={T.accent}
              position="tr"
              width={24}
            />
          </div>
        </Reveal>
      </div>
    </header>
  );
}
