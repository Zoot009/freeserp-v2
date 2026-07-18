import type { Metadata } from "next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export const metadata: Metadata = {
  title: "FreeSERP — Rank Tracking and Competitor Intelligence Tool",
  description:
    "FreeSERP tracks your keyword rankings daily, reveals where competitors outrank you, and gives you the data to close the gap. Free trial available. No credit card required.",
  alternates: { canonical: "https://freeserp.com" },
  authors: [{ name: "FreeSERP" }],
  creator: "FreeSERP",
  publisher: "FreeSERP",
  robots: { index: true, follow: true },
  openGraph: {
    title: "FreeSERP — Rank Tracking and Competitor Intelligence Tool",
    description:
      "FreeSERP tracks your keyword rankings daily, reveals where competitors outrank you, and gives you the data to close the gap. Free trial available. No credit card required.",
    url: "https://freeserp.com",
    siteName: "FreeSERP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FreeSERP — Rank Tracking and Competitor Intelligence Tool",
    description:
      "FreeSERP tracks your keyword rankings daily, reveals where competitors outrank you, and gives you the data to close the gap. Free trial available. No credit card required.",
  },
};
import { Hero } from "@/components/home/Hero";
import { Ticker } from "@/components/home/Ticker";
import { Features } from "@/components/home/Features";
import { InsideApp } from "@/components/home/InsideApp";
import { Pricing } from "@/components/home/Pricing";
import { Benefits } from "@/components/home/Benefits";
import { Compare } from "@/components/serp-checker/Compare";
import { Integration } from "@/components/home/Integration";
import { Testimonials } from "@/components/home/Testimonials";
import { Blog } from "@/components/home/Blog";
import { Faq } from "@/components/home/Faq";
import { Cta } from "@/components/home/Cta";
import {
  HOME_WEBSITE_SCHEMA,
  HOME_SOFTWARE_APP_SCHEMA,
  HOME_ORGANIZATION_SCHEMA,
  HOME_FAQ_SCHEMA,
} from "@/components/home/data";

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_WEBSITE_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_SOFTWARE_APP_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_ORGANIZATION_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_FAQ_SCHEMA) }} />
      <Nav />
      <Hero />
      <Ticker />
      <Features />
      <InsideApp />
      <Pricing />
      <Benefits />
      <Compare />
      <Integration />
      <Testimonials />
      <Blog />
      <Faq />
      <Cta />
      <Footer />
    </>
  );
}
