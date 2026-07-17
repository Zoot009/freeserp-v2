import { CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/landing/ui/Reveal";

type VisibilityDict = {
  visibilityScore: string;
  scorePct: string;
  visibilityDelta: string;
  top10Coverage: string;
  coveragePct: string;
  noChange: string;
  trackedKeywords: string;
  trackedRows: { label: string; val: string; color: string }[];
  heading: string;
  bullets: string[];
};

export default function FeatureVisibility({ dict }: { dict: VisibilityDict }) {
  return (
    <section className="mx-auto max-w-[1160px] px-6 pt-24">
      <div className="grid grid-cols-1 items-center gap-14 md:grid-cols-[1.05fr_1fr]">
        <Reveal className="rounded-[22px] bg-linear-to-br from-[#e2efe9] to-[#e9eaf7] p-5 sm:p-10">
          <div className="rounded-2xl bg-white p-4 shadow-[0_20px_40px_-24px_rgba(20,40,100,0.28)] transition-shadow duration-300 hover:shadow-[0_30px_60px_-24px_rgba(20,40,100,0.36)] sm:p-7">
            <div className="grid grid-cols-2 gap-3 sm:gap-5">
              <div className="text-center">
                <div className="mb-3.5 text-[13px] font-bold text-[#0b1020] sm:text-[15px]">
                  {dict.visibilityScore}
                </div>
                <div
                  className="mx-auto flex h-26 w-26 items-center justify-center rounded-full sm:h-32.5 sm:w-32.5"
                  style={{
                    background: `conic-gradient(var(--color-accent) 0 ${
                      parseInt(dict.scorePct) / 100
                    }turn, #e6e9f2 ${parseInt(dict.scorePct) / 100}turn 1turn)`,
                  }}
                >
                  <div className="flex h-19 w-19 flex-col items-center justify-center rounded-full bg-white sm:h-24 sm:w-24">
                    <span className="text-[20px] font-extrabold text-[#0b1020] sm:text-[26px]">
                      {dict.scorePct}
                    </span>
                    <span className="text-[11px] font-bold text-[#16a34a]">
                      {dict.visibilityDelta}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="mb-3.5 text-[13px] font-bold text-[#0b1020] sm:text-[15px]">
                  {dict.top10Coverage}
                </div>
                <div
                  className="mx-auto flex h-26 w-26 items-center justify-center rounded-full sm:h-32.5 sm:w-32.5"
                  style={{
                    background: `conic-gradient(#f59e0b 0 ${
                      parseInt(dict.coveragePct) / 100
                    }turn, #e6e9f2 ${parseInt(dict.coveragePct) / 100}turn 1turn)`,
                  }}
                >
                  <div className="flex h-19 w-19 flex-col items-center justify-center rounded-full bg-white sm:h-24 sm:w-24">
                    <span className="text-[20px] font-extrabold text-[#0b1020] sm:text-[26px]">
                      {dict.coveragePct}
                    </span>
                    <span className="text-[11px] font-bold text-[#8a91a3]">
                      {dict.noChange}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-[22px] flex flex-col gap-[11px]">
              <div className="text-[13px] font-bold text-[#0b1020]">
                {dict.trackedKeywords}
              </div>
              {dict.trackedRows.map((t) => (
                <div key={t.label} className="flex justify-between text-sm">
                  <span className="flex items-center gap-[9px] text-[#5a6172]">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: t.color }}
                    />
                    {t.label}
                  </span>
                  <span className="font-bold text-[#0b1020]">{t.val}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-[32px] leading-[1.12] font-extrabold tracking-[-0.03em] text-[#0b1020] sm:text-[38px]">
            {dict.heading}
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
