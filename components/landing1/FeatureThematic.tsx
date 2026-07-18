import { CheckCircle2 } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/landing1/ui/Reveal";
import { AnimatedMiniRing } from "@/components/landing1/ui/AnimatedRing";

type ThematicDict = {
  heading: string;
  items: { label: string; pct: string; delta: string; positive: boolean }[];
  viewDetails: string;
  heading2: string;
  bullets: string[];
};

export default function FeatureThematic({ dict }: { dict: ThematicDict }) {
  return (
    <section className="mx-auto max-w-[1160px] px-6 pt-24">
      <div className="grid grid-cols-1 items-center gap-14 md:grid-cols-[1.05fr_1fr]">
        <Reveal className="rounded-[22px] bg-linear-to-br from-[#e2efe9] to-[#e9eaf7] p-5 sm:p-10">
          <div className="rounded-2xl bg-white p-4 shadow-[0_20px_40px_-24px_rgba(20,40,100,0.28)] transition-shadow duration-300 hover:shadow-[0_30px_60px_-24px_rgba(20,40,100,0.36)] sm:p-6.5">
            <div className="mb-[18px] text-[15px] font-extrabold text-[#0b1020] sm:text-[17px]">
              {dict.heading}
            </div>
            <RevealGroup
              className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3.5"
              stagger={0.06}
            >
              {dict.items.map((t) => (
                <RevealItem key={t.label}>
                  <div className="group h-full rounded-xl border border-[#eceef4] p-2.5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_14px_30px_-16px_rgba(20,40,100,0.35)] sm:p-3.5">
                    <div className="mb-2.5 min-h-8 text-xs font-semibold text-[#5a6172]">
                      {t.label}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 sm:flex-nowrap sm:gap-2.25">
                      <AnimatedMiniRing pct={t.pct} color="var(--color-accent)" />
                      {t.delta && (
                        <span
                          className={`text-[11px] font-bold ${
                            t.positive ? "text-[#16a34a]" : "text-[#ef4444]"
                          }`}
                        >
                          {t.delta}
                        </span>
                      )}
                    </div>
                    <div className="mt-2.5 text-[11.5px] font-semibold text-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {dict.viewDetails}
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-[32px] leading-[1.12] font-extrabold tracking-[-0.03em] text-[#0b1020] sm:text-[38px]">
            {dict.heading2}
          </h2>
          <ul className="mt-6 flex flex-col gap-4">
            {dict.bullets.map((b) => (
              <li
                key={b}
                className="flex gap-3 text-base leading-[1.55] text-[#2b3145]"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
