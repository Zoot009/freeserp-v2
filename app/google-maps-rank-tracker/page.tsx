import type { Metadata } from "next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/google-maps-rank-tracker/Hero";
import { Shot, StepCards } from "@/components/google-maps-rank-tracker/Steps";
import { WhatIsTracker } from "@/components/google-maps-rank-tracker/WhatIsTracker";
import { WhyTracker } from "@/components/google-maps-rank-tracker/WhyTracker";
import { Metrics } from "@/components/google-maps-rank-tracker/Metrics";
import { Report } from "@/components/google-maps-rank-tracker/Report";
import { UseCases } from "@/components/google-maps-rank-tracker/UseCases";
import { Faq } from "@/components/google-maps-rank-tracker/Faq";
import { Cta } from "@/components/google-maps-rank-tracker/Cta";
import {
  BREADCRUMB_SCHEMA,
  SOFTWARE_APP_SCHEMA,
  HOWTO_SCHEMA,
  FAQ_SCHEMA,
} from "@/components/google-maps-rank-tracker/data";

/**
 * /google-maps-rank-tracker — the landing page for the Maps tracker that lives
 * in the app at /dashboard/google-maps-tracker.
 *
 * Built on the /serp-checker page's shape (dark hero band, how-it-works,
 * explainer, why, who, FAQ, CTA) with one deliberate difference: no inline
 * tool. See components/google-maps-rank-tracker/Hero.tsx for why.
 *
 * Search intent this page owns: Maps / Google Business Profile rank *checking*
 * and ongoing rank *tracking* — "google maps rank tracker", "gmb rank checker",
 * "google places ranking checker". It stays off broad "local rank" and
 * grid-first queries on purpose; the geo-grid appears here as the mechanism,
 * not as the thing being sold.
 */
const PAGE_URL = "https://freeserp.com/google-maps-rank-tracker";
const TITLE = "Google Maps Rank Tracker & Checker | FreeSERP";
const DESCRIPTION =
  "Check Google Maps and Google Business Profile positions by keyword and location. Monitor Map Pack rankings and competitors with FreeSERP.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    "google maps rank tracker, google maps rank checker, google maps rank tracking, google maps ranking checker, google map rank checker, google maps ranking check, google maps ranking tool, track google maps rankings, google places rank tracker, google places ranking checker, google my business rank tracker, google my business rank checker, google business profile rank checker, gmb rank checker, gmb rank tracker, gmb ranking checker, gmb ranking tool, check gmb ranking, free gmb rank checker, map rank tracker, map ranking tool",
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

export default function GoogleMapsRankTrackerPage() {
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
      <WhatIsTracker />
      <WhyTracker />
      <Metrics />
      <Report />
      <UseCases />
      <Faq />
      <Cta />
      <Footer />
    </>
  );
}
