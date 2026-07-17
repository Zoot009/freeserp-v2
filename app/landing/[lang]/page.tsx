import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import LogoStripSteps from "@/components/landing/LogoStripSteps";
import FeatureVisibility from "@/components/landing/FeatureVisibility";
import FeatureCompetitors from "@/components/landing/FeatureCompetitors";
import FeatureThematic from "@/components/landing/FeatureThematic";
import Stats from "@/components/landing/Stats";
import Testimonial from "@/components/landing/Testimonial";
import FinalCTA from "@/components/landing/FinalCTA";
import { getDictionary, hasLocale } from "@/lib/landing/dictionaries";
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
      <Header dict={dict.header} />
      <Hero dict={dict.hero} />
      <LogoStripSteps dict={dict.logoStrip} />
      <FeatureVisibility dict={dict.visibility} />
      <FeatureCompetitors dict={dict.competitors} />
      <FeatureThematic dict={dict.thematic} />
      <Stats dict={dict.stats} />
      <Testimonial dict={dict.testimonial} />
      <FinalCTA dict={dict.finalCta} />
    </div>
  );
}
