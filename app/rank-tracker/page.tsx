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

const PAGE_URL = "https://freeserp.com/rank-tracker";
const DESCRIPTION =
  "Free rank tracker tool. Enter any domain and keyword to instantly see your real search engine ranking — unaffected by browser history or personalization. Check rankings by country and device. No signup needed.";

export const metadata: Metadata = {
  title: "Free Rank Tracker — Check Where Any Domain Ranks | Freeserp.com",
  description: DESCRIPTION,
  keywords:
    "rank tracker, free rank tracker, keyword rank checker, SEO rank tracking, check keyword ranking, search position tracker",
  alternates: { canonical: PAGE_URL },
  authors: [{ name: "FreeSERP" }],
  creator: "FreeSERP",
  publisher: "FreeSERP",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Free Rank Tracker — Check Where Any Domain Ranks | Freeserp.com",
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: "FreeSERP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Rank Tracker — Check Where Any Domain Ranks | Freeserp.com",
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
      <Steps sub="Our rank tracker runs a clean, depersonalized search engine query from the country and device you specify — so you see exactly what your customers see, not what your browser history shows you." />
      <WhyTracker />
      <UseCases />
      <SampleReport {...SAMPLE_REPORTS.rank} />
      <Faq />
      <Cta />
      <Footer />
    </>
  );
}
