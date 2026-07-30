import { Globe2, ListFilter, TrendingUp } from "lucide-react";
import { brands } from "@/lib/landing/content";
import { Reveal, RevealGroup, RevealItem } from "@/components/landing1/ui/Reveal";

const stepIcons = [Globe2, ListFilter, TrendingUp];

type LogoStripDict = {
  trustLine: string;
  heading: string;
  steps: { step: string; title: string; body: string }[];
};

export default function LogoStripSteps({ dict }: { dict: LogoStripDict }) {
  return (
    <section className="mx-auto max-w-[1160px] px-6 pt-14">
      <div className="border-t border-[#eceef4] pt-3.5 text-right text-[13px] font-medium text-[#9aa2b5]">
        {dict.trustLine}
      </div>

      <Reveal>
        <div className="group/marquee relative mt-5 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="animate-marquee flex w-max items-center gap-16">
            {[...brands, ...brands].map((b, i) => (
              <img
                key={`${b.name}-${i}`}
                src={b.logo}
                alt={b.name}
                width={b.w}
                height={b.h}
                loading="lazy"
                decoding="async"
                className="h-7 w-auto shrink-0 grayscale opacity-60 transition-all duration-300 hover:opacity-100 hover:grayscale-0"
              />
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal>
        <h2 className="mt-19 mb-10 text-[32px] font-extrabold tracking-[-0.04em] text-[#10131a] uppercase sm:text-[46px]">
          {dict.heading}
        </h2>
      </Reveal>
      <RevealGroup
        className="grid grid-cols-1 gap-[22px] sm:grid-cols-3"
        stagger={0.12}
      >
        {dict.steps.map((s, i) => {
          const Icon = stepIcons[i];
          return (
            <RevealItem key={s.step}>
              <div className="group h-full rounded-2xl bg-[#f5f6fa] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:bg-white hover:shadow-[0_24px_50px_-24px_rgba(20,40,100,0.28)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[12.5px] font-bold tracking-[0.06em] text-[#5a6172]">
                    <span className="h-[9px] w-[9px] rounded-[2px] bg-[#1fc79a]" />
                    {s.step}
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-accent shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:bg-accent group-hover:text-white">
                    <Icon className="h-[18px] w-[18px]" />
                  </div>
                </div>
                <h3 className="mt-[22px] mb-2.5 text-2xl font-extrabold tracking-[-0.02em] text-[#0b1020]">
                  {s.title}
                </h3>
                <p className="text-[15px] leading-[1.55] text-[#5a6172]">
                  {s.body}
                </p>
              </div>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </section>
  );
}
