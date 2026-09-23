import type { Metadata } from "next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/local-rank-tracker/Hero";
import { Shot, StepCards } from "@/components/local-rank-tracker/Steps";
import { WhatIsLocal } from "@/components/local-rank-tracker/WhatIsLocal";
import { Workflows } from "@/components/local-rank-tracker/Workflows";
import { WhyLocal } from "@/components/local-rank-tracker/WhyLocal";
import { Markets } from "@/components/local-rank-tracker/Markets";
import { UseCases } from "@/components/local-rank-tracker/UseCases";
import { Faq } from "@/components/local-rank-tracker/Faq";
import { Cta } from "@/components/local-rank-tracker/Cta";
import {
  BREADCRUMB_SCHEMA,
  SOFTWARE_APP_SCHEMA,
  HOWTO_SCHEMA,
  FAQ_SCHEMA,
} from "@/components/local-rank-tracker/data";

/**
 * /local-rank-tracker — localized ORGANIC rankings plus Local Pack visibility.
 *
 * Third and last of the local trio, and the one that had a real conditional on
 * it: publish only if there are useful city/postcode organic AND Map Pack
 * workflows. Both were verified in the product before this page was written —
 * see the header of components/local-rank-tracker/data.ts for where each
 * capability lives in the backend.
 *
 * The three pages divide as:
 *   /local-rank-tracker    organic positions in a named market + Local Pack
 *                          PRESENCE. This page.
 *   /google-maps-rank-tracker  position inside Maps for a Business Profile,
 *                          tracked over time.
 *   /local-search-grid     that Maps position spread across a geo-grid.
 *
 * Workflows.tsx states the boundary in the body rather than leaving it to be
 * inferred, and every page links to the other two.
 */
const PAGE_URL = "https://freeserp.com/local-rank-tracker";
const TITLE = "Local Rank Tracker – City, Organic & Map Pack | FreeSERP";
const DESCRIPTION =
  "Track local Google keyword positions by city or postcode and check Map Pack visibility. Explore organic and Maps performance in distinct FreeSERP workflows.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    "local rank tracker, google local rank tracker, google local rank checker, local rank checker, local seo rank tracker, local search rank tracker, local ranking checker, free local rank checker, google local rank tracking",
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

export default function LocalRankTrackerPage() {
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
      <WhatIsLocal />
      <Workflows />
      <WhyLocal />
      <Markets />
      <UseCases />
      <Faq />
      <Cta />
      <Footer />
    </>
  );
}
