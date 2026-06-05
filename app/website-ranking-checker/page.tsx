import type { Metadata } from "next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Steps } from "@/components/serp-checker/Steps";
import { Hero } from "@/components/website-ranking-checker/Hero";
import { WhyChecker } from "@/components/website-ranking-checker/WhyChecker";
import { WhoUses } from "@/components/website-ranking-checker/WhoUses";
import { Faq } from "@/components/website-ranking-checker/Faq";
import {
  BREADCRUMB_SCHEMA,
  SOFTWARE_APP_SCHEMA,
  HOWTO_SCHEMA,
  FAQ_SCHEMA,
} from "@/components/website-ranking-checker/data";

const PAGE_URL = "https://freeserp.com/website-ranking-checker";
const DESCRIPTION =
  "Check your website ranking free. No account needed. Instant website rank finder for any domain or keyword.";

export const metadata: Metadata = {
  title: "Website Ranking Checker Free | Freeserp.com",
  description: DESCRIPTION,
  keywords:
    "website ranking checker, check website ranking, website rank finder, website ranking free, check website ranking free",
  alternates: { canonical: PAGE_URL },
  authors: [{ name: "FreeSERP" }],
  creator: "FreeSERP",
  publisher: "FreeSERP",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Website Ranking Checker Free | Freeserp.com",
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: "FreeSERP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Website Ranking Checker Free | Freeserp.com",
    description: DESCRIPTION,
  },
};

export default function WebsiteRankingCheckerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SOFTWARE_APP_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />

      <Nav currentNav="Free SERP Checker" />
      <Hero />
      <Steps />
      <WhyChecker />
      <WhoUses />
      <Faq />
      <Footer />
    </>
  );
}
