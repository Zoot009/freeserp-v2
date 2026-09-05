import { LazyDemoVideo } from "@/components/landing/ui/LazyDemoVideo";
import { Reveal } from "@/components/landing/ui/Reveal";

type DemoDict = {
  heading: string;
  body: string;
  liveDemo: string;
};

/**
 * The demo clip, lifted out of the hero into a section of its own.
 *
 * The section sits on a very subtle gradient and the clip sits in a plain white
 * card with a soft shadow, so the product reads as floating above the page
 * rather than as another band of marketing.
 */
export default function DemoShowcase({
  dict,
  demoAlt,
}: {
  dict: DemoDict;
  demoAlt: string;
}) {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-[#f4f7fe] via-[#f7f8fd] to-white px-6 pt-20 pb-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(47,107,255,0.10),transparent)] blur-3xl"
      />

      <div className="relative mx-auto max-w-[1160px] text-center">
        <Reveal>
          <h2 className="mx-auto max-w-[820px] text-[32px] leading-[1.08] font-extrabold tracking-[-0.03em] text-balance text-[#0b1020] sm:text-[44px]">
            {dict.heading}
          </h2>
          <p className="mx-auto mt-5 max-w-[640px] text-[17px] leading-[1.55] text-pretty text-[#5a6172]">
            {dict.body}
          </p>
        </Reveal>

        <Reveal className="relative mx-auto mt-12 max-w-240 rounded-[22px] border border-[#e8ebf4] bg-white p-1.5 shadow-[0_30px_70px_-30px_rgba(20,40,100,0.35)]">
          <span className="absolute top-4 right-4 z-10 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-[#0f9d6e] shadow-sm backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1fc79a]" />
            {dict.liveDemo}
          </span>
          <div className="overflow-hidden rounded-[16px] bg-white">
            {/* Same lazily-fetched clip the hero uses elsewhere — see LazyDemoVideo. */}
            <LazyDemoVideo label={demoAlt} className="block h-auto w-full" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
