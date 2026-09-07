import type { Metadata } from "next";
import { Bebas_Neue, Geist } from "next/font/google";
import Header from "@/components/rank-tracking-tools/Header";
import Hero from "@/components/rank-tracking-tools/Hero";
import Stats from "@/components/rank-tracking-tools/Stats";
import Problem from "@/components/rank-tracking-tools/Problem";
import Tools from "@/components/rank-tracking-tools/Tools";
import Features from "@/components/rank-tracking-tools/Features";
import AiTracker from "@/components/rank-tracking-tools/AiTracker";
import HowItWorks from "@/components/rank-tracking-tools/HowItWorks";
import Pricing from "@/components/rank-tracking-tools/Pricing";
import Faq from "@/components/rank-tracking-tools/Faq";
import FinalCta from "@/components/rank-tracking-tools/FinalCta";
import Footer from "@/components/rank-tracking-tools/Footer";
import "@/components/rank-tracking-tools/rank-tracking-tools.css";

// This page's own type stack, not the site's. The root layout puts Archivo on
// <body>; the design is set in Geist with Bebas Neue display headings, so both
// are loaded here and scoped to the .l2 wrapper via CSS variables — no other
// route pays for the extra faces. Geist Mono is already global (--font-geist-mono).
const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FreeSERP — Track rankings in Google, Maps, YouTube and AI chatbots",
  description:
    "One dashboard that tells you where you rank, who is beating you, and exactly what to fix. 12 tools unlocked on the free plan, 190+ countries, no credit card.",
  alternates: { canonical: "/rank-tracking-tools" },
};

export default function RankTrackingToolsPage() {
  return (
    <div className={`l2 ${bebas.variable} ${geist.variable}`}>
      <Header />
      <Hero />
      <Stats />
      <Problem />
      <Tools />
      <Features />
      <AiTracker />
      <HowItWorks />
      <Pricing />
      <Faq />
      <FinalCta />
      <Footer />
    </div>
  );
}
