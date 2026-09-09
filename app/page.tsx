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
import { InsideApp } from "@/components/home/InsideApp";
import { Trackers } from "@/components/home/Trackers";
import { Toolkit } from "@/components/home/Toolkit";
import { Capabilities } from "@/components/home/Capabilities";
import { Credits } from "@/components/home/Credits";
import { Pricing } from "@/components/home/Pricing";
import { Benefits } from "@/components/home/Benefits";
import { Compare } from "@/components/serp-checker/Compare";
import { Integration } from "@/components/home/Integration";
import { Testimonials } from "@/components/home/Testimonials";
import { Faq } from "@/components/home/Faq";
import { Stats } from "@/components/home/Stats";
import { Trust } from "@/components/home/Trust";
import { Blog } from "@/components/home/Blog";
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
      <InsideApp />
      <Trackers />
      <Toolkit />
      <Capabilities />
      {/* The scale of the data, before the page asks for money. Every figure
          here is a claim the page already makes in prose elsewhere. */}
      <Stats />
      <Credits />
      <Pricing />
      <Benefits />
      <Compare />
      <Integration />
      <Testimonials />
      {/* Why a position can be believed. Every tracker shows a number; this is
          the section that says how it was measured. */}
      <Trust />
      {/* Written months ago and never rendered anywhere. The only thing on this
          page that gives a visitor a reason to return without signing up. */}
      <Blog />
      <Faq />
      <Cta />
      <Footer />
    </>
  );
}
