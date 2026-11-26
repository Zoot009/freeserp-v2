import type { Metadata } from "next";
import { SampleReport } from "@/components/landing/SampleReport";
import { SAMPLE_REPORTS } from "@/components/landing/sample-reports";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Steps } from "@/components/serp-checker/Steps";
import { Hero } from "@/components/rank-tracker/Hero";
import { WhyTracker } from "@/components/rank-tracker/WhyTracker";
import { UseCases } from "@/components/rank-tracker/UseCases";
import { Faq } from "@/components/rank-tracker/Faq";
import { Cta } from "@/components/rank-tracker/Cta";
import {
  BREADCRUMB_SCHEMA,
  SOFTWARE_APP_SCHEMA,
  HOWTO_SCHEMA,
  FAQ_SCHEMA,
} from "@/components/rank-tracker/data";
import { DemoSection } from "@/components/demos/DemoSection";
import { RankTrackerDemo } from "@/components/demos/RankTrackerDemo";

const PAGE_URL = "https://freeserp.com/rank-tracker";
const DESCRIPTION =
  "Track Google keyword rankings daily by country, city and device. Follow SERP features, competitors and ranking history with alerts. 100 free credits a month for your first 3 months.";

export const metadata: Metadata = {
  title: "Free Rank Tracker — Track Keyword Positions Daily | FreeSERP",
  description: DESCRIPTION,
  keywords:
    "rank tracker, free rank tracker, keyword rank tracker, keyword position tracking, Google rank tracker, local rank tracker, mobile rank tracker, competitor rank tracking, SERP feature tracking, ranking history",
  alternates: { canonical: PAGE_URL },
  authors: [{ name: "FreeSERP" }],
  creator: "FreeSERP",
  publisher: "FreeSERP",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Free Rank Tracker — Track Keyword Positions Daily | FreeSERP",
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: "FreeSERP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Rank Tracker — Track Keyword Positions Daily | FreeSERP",
    description: DESCRIPTION,
  },
};

export default function RankTrackerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SOFTWARE_APP_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />

      <Nav currentNav="Free SERP Checker" />
      <Hero />
      <DemoSection title="Click a keyword, see its history">
        <RankTrackerDemo />
      </DemoSection>
      <Steps sub="Add your domain once, set the country, city and device, and the rank tracker re-checks every keyword with a clean, depersonalized query — so your position history reflects what real searchers see." />
      <WhyTracker />
      <UseCases />
      <SampleReport {...SAMPLE_REPORTS.rank} />
      <Faq />
      <Cta />
      <Footer />
    </>
  );
}
