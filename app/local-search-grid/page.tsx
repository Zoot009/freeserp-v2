import type { Metadata } from "next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/local-search-grid/Hero";
import { Shot, StepCards } from "@/components/local-search-grid/Steps";
import { WhatIsGrid } from "@/components/local-search-grid/WhatIsGrid";
import { WhyGrid } from "@/components/local-search-grid/WhyGrid";
import { ReadingTheGrid } from "@/components/local-search-grid/ReadingTheGrid";
import { GridSizes } from "@/components/local-search-grid/GridSizes";
import { Report } from "@/components/local-search-grid/Report";
import { UseCases } from "@/components/local-search-grid/UseCases";
import { Faq } from "@/components/local-search-grid/Faq";
import { Cta } from "@/components/local-search-grid/Cta";
import {
  BREADCRUMB_SCHEMA,
  SOFTWARE_APP_SCHEMA,
  HOWTO_SCHEMA,
  FAQ_SCHEMA,
} from "@/components/local-search-grid/data";

/**
 * /local-search-grid — the grid-first landing page for the same Maps scan that
 * powers /google-maps-rank-tracker.
 *
 * Two pages over one feature is only defensible if each answers a different
 * question, so the split is strict. The rank tracker owns "where does my
 * Google Business Profile rank for this keyword, and what is it doing over
 * time". This page owns the grid as an object: proximity variation, point
 * spacing, the six rank bands, and what the shape of the heatmap means. The
 * sections unique to it — ReadingTheGrid and GridSizes — are the ones the
 * tracker page has no reason to carry.
 *
 * Each page links to the other in body copy and in its FAQ, so the intent
 * boundary is stated rather than left for a crawler to infer.
 */
const PAGE_URL = "https://freeserp.com/local-search-grid";
const TITLE = "Local Search Grid Tool – Google Maps Geo-Grid | FreeSERP";
const DESCRIPTION =
  "See Google Maps rankings across a geographic grid. Identify strong and weak neighborhoods with map-point positions and competitor insights in FreeSERP.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    "local search grid tool, google maps grid rank tracker, google maps seo grid, local seo grid tool, gmb heat map tracker, local search grid tracking, google maps geo-grid, local rank grid",
  alternates: { canonical: PAGE_URL },
  authors: [{ name: "FreeSERP" }],
  creator: "FreeSERP",
  publisher: "FreeSERP",
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: "FreeSERP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function LocalSearchGridPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SOFTWARE_APP_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />

      <Nav currentNav="Free SERP Checker" />
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          backgroundImage: "url(https://framerusercontent.com/images/LTzUgqhBMU0fYD8l2vHeGvu8dQI.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "top center",
        }}
      >
        <Hero />
        <Shot />
      </div>
      <StepCards />
      <WhatIsGrid />
      <WhyGrid />
      <ReadingTheGrid />
      <GridSizes />
      <Report />
      <UseCases />
      <Faq />
      <Cta />
      <Footer />
    </>
  );
}
