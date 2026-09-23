import Link from "next/link";
import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { COLORS } from "@/components/site/constants";

export function WhatIsLocal() {
  return (
    <section
      id="what-is-a-local-rank-tracker"
      className="fs-serp-section"
      style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 40px 0", scrollMarginTop: 80 }}
    >
      <SectionHead title="What is a local rank tracker?" />
      <Reveal>
        <div style={{ maxWidth: 720, margin: "40px auto 0" }}>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: COLORS.gray, margin: 0 }}>
            A local rank tracker records where a site ranks for a keyword{" "}
            <em>as searched from a particular place</em>. Instead of one national position, the
            check runs against the market you name — a country, a region, a city, or a postal
            code — and returns the results a searcher standing there would have been shown.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: COLORS.gray, margin: "16px 0 0" }}>
            It also reports what kind of page that was. Local searches frequently return a
            Local Pack — the block of three businesses with a map — and whether that block
            appears changes how much of the page is left for ordinary results. Every check
            records it alongside the position, so a drop that was really a Local Pack arriving
            is legible as exactly that.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: COLORS.gray, margin: "16px 0 0" }}>
            That is the whole job: organic positions, in a named market, on a named device,
            with the Local Pack flagged when it shows up. For which business holds first place{" "}
            <em>inside</em> that pack, and how that changes street by street, the{" "}
            <Link
              href="/google-maps-rank-tracker"
              style={{ color: COLORS.blue, textDecoration: "none" }}
            >
              Google Maps rank tracker
            </Link>{" "}
            and the{" "}
            <Link href="/local-search-grid" style={{ color: COLORS.blue, textDecoration: "none" }}>
              local search grid
            </Link>{" "}
            query Maps itself.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
