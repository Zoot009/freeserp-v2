import type { Metadata } from "next";
import { Bebas_Neue, Geist } from "next/font/google";
import Header from "@/components/landing2/Header";
import Hero from "@/components/landing2/Hero";
import Stats from "@/components/landing2/Stats";
import Problem from "@/components/landing2/Problem";
import Tools from "@/components/landing2/Tools";
import Features from "@/components/landing2/Features";
import AiTracker from "@/components/landing2/AiTracker";
import HowItWorks from "@/components/landing2/HowItWorks";
import Pricing from "@/components/landing2/Pricing";
import Faq from "@/components/landing2/Faq";
import FinalCta from "@/components/landing2/FinalCta";
import Footer from "@/components/landing2/Footer";
import "@/components/landing2/landing2.css";

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
  alternates: { canonical: "/landing2" },
};

export default function Landing2() {
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
