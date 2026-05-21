import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/home/Hero";
import { Ticker } from "@/components/home/Ticker";
import { Features } from "@/components/home/Features";
import { Pricing } from "@/components/home/Pricing";
import { Benefits } from "@/components/home/Benefits";
import { Integration } from "@/components/home/Integration";
import { Testimonials } from "@/components/home/Testimonials";
import { Blog } from "@/components/home/Blog";
import { Faq } from "@/components/home/Faq";
import { Cta } from "@/components/home/Cta";

export default function HomePage() {
  return (
    <>
      <Nav />
      <Hero />
      <Ticker />
      <Features />
      <Pricing />
      <Benefits />
      <Integration />
      <Testimonials />
      <Blog />
      <Faq />
      <Cta />
      <Footer />
    </>
  );
}
