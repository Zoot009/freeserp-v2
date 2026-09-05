import { ArrowRight, LineChart, Radar, Search, TrendingUp } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/landing/ui/Reveal";

type JourneyDict = {
  heading: string;
  body: string;
  steps: string[];
};

const stepIcons = [Search, LineChart, Radar, TrendingUp];

/**
 * The one-off check → ongoing tracking bridge: a visitor arrives for a single
 * ranking lookup, and this is where that becomes a dashboard habit.
 */
export default function RankJourney({ dict }: { dict: JourneyDict }) {
  return (
    <section className="mx-auto max-w-[1160px] px-6 pt-24">
      <Reveal className="text-center">
        <h2 className="mx-auto max-w-[860px] text-[32px] leading-[1.08] font-extrabold tracking-[-0.03em] text-balance text-[#0b1020] sm:text-[42px]">
          {dict.heading}
        </h2>
        <p className="mx-auto mt-5 max-w-[680px] text-[17px] leading-[1.55] text-pretty text-[#5a6172]">
          {dict.body}
        </p>
      </Reveal>

      <RevealGroup
        className="mt-11 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center"
        stagger={0.08}
      >
        {dict.steps.map((step, i) => {
          const Icon = stepIcons[i] ?? Search;
          return (
            <RevealItem key={step} className="contents">
              <div className="flex flex-1 items-center gap-3 rounded-2xl bg-[#f5f6fa] px-6 py-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_22px_44px_-24px_rgba(20,40,100,0.3)] sm:max-w-[220px] sm:flex-col sm:gap-3 sm:px-5 sm:text-center">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-accent shadow-sm sm:bg-accent sm:text-white">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <span className="text-lg font-extrabold tracking-[-0.02em] text-[#0b1020]">
                  {step}
                </span>
              </div>
              {i < dict.steps.length - 1 && (
                <ArrowRight
                  aria-hidden
                  className="mx-auto h-5 w-5 shrink-0 rotate-90 text-[#9aa2b5] sm:rotate-0"
                />
              )}
            </RevealItem>
          );
        })}
      </RevealGroup>
    </section>
  );
}
