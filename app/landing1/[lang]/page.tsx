import Header from "@/components/landing1/Header";
import Hero from "@/components/landing1/Hero";
import LogoStripSteps from "@/components/landing1/LogoStripSteps";
import FeatureVisibility from "@/components/landing1/FeatureVisibility";
import FeatureCompetitors from "@/components/landing1/FeatureCompetitors";
import FeatureThematic from "@/components/landing1/FeatureThematic";
import Stats from "@/components/landing1/Stats";
import Testimonial from "@/components/landing1/Testimonial";
import FinalCTA from "@/components/landing1/FinalCTA";
import { getDictionary, hasLocale } from "@/lib/landing/dictionaries";
import { notFound } from "next/navigation";

export default async function Landing1Home({
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
