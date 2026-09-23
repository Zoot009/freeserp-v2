import Link from "next/link";
import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { COLORS } from "@/components/site/constants";

export function WhatIsTracker() {
  return (
    <section
      id="what-is-maps-rank-tracker"
      className="fs-serp-section"
      style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 40px 0", scrollMarginTop: 80 }}
    >
      <SectionHead title="What is a Google Maps rank tracker?" />
      <Reveal>
        <div style={{ maxWidth: 720, margin: "40px auto 0" }}>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: COLORS.gray, margin: 0 }}>
            A Google Maps rank tracker shows where a business appears in Google Maps for a
            given keyword — and, because Maps ranks partly on how close the searcher is,
            where that position applies. It is the local equivalent of a{" "}
            <Link href="/serp-checker" style={{ color: COLORS.blue, textDecoration: "none" }}>
              SERP checker
            </Link>
            , except that a single number would be meaningless. You can be first in the Map
            Pack outside your own door and absent two miles away, for the same search, at the
            same moment.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: COLORS.gray, margin: "16px 0 0" }}>
            So a Google Maps rank checker runs the same search from many coordinates around
            your business and records the position at each one. FreeSERP checks your Google
            Business Profile — matched by its place ID, so there is no confusion with a
            similarly named listing — and reports the Map Pack position, the businesses ranked
            around you, and how much of your area you actually own.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: COLORS.gray, margin: "16px 0 0" }}>
            The tracking part is the same check, repeated. Every scan is saved against the
            business, so a GMB rank check you ran in January is still there to compare against
            the one you run in June — per keyword, and per part of the map.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: COLORS.gray, margin: "16px 0 0" }}>
            The spread of points a check runs across is a grid, and if what you are after is
            that spread itself — the shape of your coverage rather than a position and a trend
            — the{" "}
            <Link
              href="/local-search-grid"
              style={{ color: COLORS.blue, textDecoration: "none" }}
            >
              local search grid tool
            </Link>{" "}
            covers it, including how to read the heatmap and which grid size to pick. For
            ordinary Google results seen from a given city or postcode — rather than Maps —
            there is the{" "}
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
