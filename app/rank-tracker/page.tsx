import type { Metadata } from "next";
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
  FAQ_SCHEMA,
} from "@/components/rank-tracker/data";

const PAGE_URL = "https://freeserp.com/rank-tracker";
const DESCRIPTION =
  "Track and check ranking free. No account needed. Instant rank tracker for any domain or keyword.";

export const metadata: Metadata = {
  title: "Free Rank Tracker | Freeserp.com",
  description: DESCRIPTION,
  keywords:
    "rank tracker, free rank tracker, keyword rank checker, SEO rank tracking, check keyword ranking, search position tracker",
  alternates: { canonical: PAGE_URL },
  authors: [{ name: "FreeSERP" }],
  creator: "FreeSERP",
  publisher: "FreeSERP",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Free Rank Tracker | Freeserp.com",
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: "FreeSERP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Rank Tracker | Freeserp.com",
    description: DESCRIPTION,
  },
};

export default function RankTrackerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SOFTWARE_APP_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />

      <Nav currentNav="Free SERP Checker" />
      <Hero />
      <Steps />
      <WhyTracker />
      <UseCases />
      <Faq />
      <Cta />
      <Footer />
    </>
  );
}
