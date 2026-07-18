import { CheckCircle2 } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/landing/ui/Reveal";
import { AnimatedCounter } from "@/components/landing/ui/AnimatedCounter";

type CompetitorsDict = {
  heading: string;
  bullets: string[];
  rankReport: string;
  filters: string[];
  movement: string;
  issueRows: { lead: string; rest: string }[];
  view: string;
  aboutTitle: string;
  aboutBody: string;
  respondTitle: string;
  respondBody: string;
};

export default function FeatureCompetitors({ dict }: { dict: CompetitorsDict }) {
  return (
    <section className="mx-auto max-w-[1160px] px-6 pt-24">
      <div className="grid grid-cols-1 items-center gap-14 md:grid-cols-[1fr_1.05fr]">
        <Reveal className="order-2 md:order-1">
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
        <Reveal
          delay={0.1}
          className="order-1 rounded-[22px] bg-linear-to-br from-[#e9eaf7] to-[#e2efe9] p-4 sm:p-10 md:order-2"
        >
          <div className="relative rounded-2xl bg-white p-5 shadow-[0_20px_40px_-24px_rgba(20,40,100,0.28)] transition-shadow duration-300 hover:shadow-[0_30px_60px_-24px_rgba(20,40,100,0.36)] sm:p-6.5">
            <div className="mb-[18px] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-[19px] font-extrabold whitespace-nowrap text-[#0b1020]">
                {dict.rankReport}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {dict.filters.map((f, i) => (
                  <span
                    key={f}
                    className={
                      i === 0
                        ? "rounded-lg bg-[#eef2ff] px-2.5 py-1.5 text-xs font-bold whitespace-nowrap text-accent"
                        : "rounded-lg bg-[#f5f6fa] px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap text-[#5a6172]"
                    }
                  >
                    <AnimatedCounter value={f} />
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-2 text-[12.5px] font-bold text-[#8a91a3]">
              {dict.movement}
            </div>
            <RevealGroup className="flex flex-col" stagger={0.08}>
              {dict.issueRows.map((i) => (
                <RevealItem key={i.lead}>
                  <div className="flex justify-between gap-3 border-b border-[#f0f1f5] py-[11px] text-sm">
                    <span className="text-[#2b3145]">
                      <a href="#top" className="font-bold">
                        <AnimatedCounter value={i.lead} />
                      </a>{" "}
                      {i.rest}
                    </span>
                    <a
                      href="#top"
                      className="text-[13px] font-semibold whitespace-nowrap text-accent"
                    >
                      {dict.view}
                    </a>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
            <div className="mt-4 grid grid-cols-1 gap-4 rounded-xl bg-[#eaf7f1] p-4 sm:grid-cols-2">
              <div>
                <div className="text-xs font-extrabold text-[#0b1020]">
                  {dict.aboutTitle}
                </div>
                <div className="mt-1.5 text-[12.5px] leading-[1.5] text-[#5a6172]">
                  {dict.aboutBody}
                </div>
              </div>
              <div>
                <div className="text-xs font-extrabold text-[#0b1020]">
                  {dict.respondTitle}
                </div>
                <div className="mt-1.5 text-[12.5px] leading-[1.5] text-[#5a6172]">
                  {dict.respondBody}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
