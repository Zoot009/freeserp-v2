import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { DemoSection } from "@/components/demos/DemoSection";
import { RankTrackerDemo } from "@/components/demos/RankTrackerDemo";
import UrgencyBanner from "@/components/landing/UrgencyBanner";
import Hero from "@/components/landing/Hero";
import LogoStripSteps from "@/components/landing/LogoStripSteps";
import FeatureVisibility from "@/components/landing/FeatureVisibility";
import FeatureCompetitors from "@/components/landing/FeatureCompetitors";
import FeatureThematic from "@/components/landing/FeatureThematic";
import Stats from "@/components/landing/Stats";
import Testimonial from "@/components/landing/Testimonial";
import FinalCTA from "@/components/landing/FinalCTA";
import { getDictionary, hasLocale, localeTag } from "@/lib/landing/dictionaries";
import { notFound } from "next/navigation";

export default async function LandingHome({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <div className="w-full overflow-x-hidden">
      <Nav solid />
      {/* Room for the fixed nav, so it does not cover the banner. */}
      <div style={{ height: 68 }} aria-hidden />
      <UrgencyBanner dict={dict.urgency} />
      <Hero
        dict={dict.hero}
        personalization={dict.personalization}
        preview={dict.preview}
        locale={localeTag(lang)}
      />
      <DemoSection title="Click a keyword, see its history">
        <RankTrackerDemo />
      </DemoSection>
      <LogoStripSteps dict={dict.logoStrip} />
      <FeatureVisibility dict={dict.visibility} />
      <FeatureCompetitors dict={dict.competitors} />
      <FeatureThematic dict={dict.thematic} />
      <Stats dict={dict.stats} />
      <Testimonial dict={dict.testimonial} />
      <FinalCTA dict={dict.finalCta} />
      <Footer />
    </div>
  );
}
