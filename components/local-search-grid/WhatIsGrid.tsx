import Link from "next/link";
import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { COLORS } from "@/components/site/constants";

export function WhatIsGrid() {
  return (
    <section
      id="what-is-a-local-search-grid"
      className="fs-serp-section"
      style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 40px 0", scrollMarginTop: 80 }}
    >
      <SectionHead title="What is a local search grid?" />
      <Reveal>
        <div style={{ maxWidth: 720, margin: "40px auto 0" }}>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: COLORS.gray, margin: 0 }}>
            A local search grid — a geo-grid — is a set of coordinates laid out in a square
            around a business. The tool runs your keyword as a fresh Google Maps search at
            every one of those coordinates, records what came back, and colours each point by
            the position it found you at. What you get is not a ranking but a map of one.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: COLORS.gray, margin: "16px 0 0" }}>
            Two settings control it. The <strong>radius</strong> decides how far out the grid
            reaches; the <strong>grid size</strong> — 3×3 up to 21×21 — decides how many points
            fill that space. Spacing follows from the pair, so a wide radius on a small grid
            samples a city coarsely, and a tight radius on a large grid examines a few streets
            in detail.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: COLORS.gray, margin: "16px 0 0" }}>
            Nothing between the points is interpolated. Every pin is a search that ran, which
            is why a grid can be trusted at its edges — the place where the interesting thing
            almost always is.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: COLORS.gray, margin: "16px 0 0" }}>
            If what you need is a position for a keyword and a record of how it moves, that is
            the job of the{" "}
            <Link
              href="/google-maps-rank-tracker"
              style={{ color: COLORS.blue, textDecoration: "none" }}
            >
              Google Maps rank tracker
            </Link>
            . This page is about the grid itself — the spread, and the shape it makes. And if
            the question is about ordinary Google results seen from a city rather than Maps at
            all, that is the{" "}
            <Link href="/local-rank-tracker" style={{ color: COLORS.blue, textDecoration: "none" }}>
              local rank tracker
            </Link>
            .
          </p>
        </div>
      </Reveal>
    </section>
  );
}
