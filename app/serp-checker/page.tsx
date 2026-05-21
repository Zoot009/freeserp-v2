import type { Metadata } from "next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/serp-checker/Hero";
import { UsageStats } from "@/components/serp-checker/UsageStats";
import { Report } from "@/components/serp-checker/Report";
import { Steps } from "@/components/serp-checker/Steps";
import { WhyChecker } from "@/components/serp-checker/WhyChecker";
import { Compare } from "@/components/serp-checker/Compare";
import { UseCases } from "@/components/serp-checker/UseCases";
import { Faq } from "@/components/serp-checker/Faq";
import { Cta } from "@/components/serp-checker/Cta";
import {
  BREADCRUMB_SCHEMA,
  SOFTWARE_APP_SCHEMA,
  HOWTO_SCHEMA,
  FAQ_SCHEMA,
} from "@/components/serp-checker/data";

const PAGE_URL = "https://freeserp.com/serp-checker";
const DESCRIPTION =
  "Try our Free SERP checker tool. Check your website's keyword rankings instantly. No credit card required.";

export const metadata: Metadata = {
  title: "Free SERP Checker - Check Keyword Rankings | FreeSERP",
  description: DESCRIPTION,
  keywords:
    "SERP checker, keyword rank tracker, SEO tool, search engine position, free SERP tool",
  alternates: { canonical: PAGE_URL },
  authors: [{ name: "FreeSERP" }],
  creator: "FreeSERP",
  publisher: "FreeSERP",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Free SERP Checker - Track Your Keyword Rankings",
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: "FreeSERP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free SERP Checker - Track Your Keyword Rankings",
    description: DESCRIPTION,
  },
};

export default function SerpCheckerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SOFTWARE_APP_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />

      <Nav currentNav="Free SERP Checker" />
      <Hero />
      <UsageStats />
      <Steps />
      <Report />
      <WhyChecker />
      <Compare />
      <UseCases />
      <Faq />
      <Cta />
      <Footer />
    </>
  );
}
