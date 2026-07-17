import { Reveal, RevealGroup, RevealItem } from "@/components/landing/ui/Reveal";
import { AnimatedCounter } from "@/components/landing/ui/AnimatedCounter";

type StatsDict = {
  headingLine1: string;
  headingLine2: string;
  items: { n: string; bold: string; rest: string }[];
};

export default function Stats({ dict }: { dict: StatsDict }) {
  return (
    <section className="mx-auto max-w-[1160px] px-6 pt-26">
      <Reveal>
        <h2 className="mb-9 text-[32px] leading-[1.05] font-extrabold tracking-[-0.03em] text-[#10131a] uppercase sm:text-[40px]">
          {dict.headingLine1}
          <br />
          {dict.headingLine2}
        </h2>
      </Reveal>
      <RevealGroup
        className="grid grid-cols-1 gap-[22px] sm:grid-cols-3"
        stagger={0.1}
      >
        {dict.items.map((s) => (
          <RevealItem key={s.n}>
            <div className="h-full rounded-[18px] bg-[#e6edff] p-8 transition-all duration-300 hover:-translate-y-1.5 hover:bg-[#dbe6ff] hover:shadow-[0_24px_50px_-24px_rgba(47,107,255,0.35)] sm:p-9.5">
              <div className="text-5xl leading-none font-extrabold tracking-[-0.04em] text-[#10131a] sm:text-[64px]">
                <AnimatedCounter value={s.n} />
              </div>
              <p className="mt-4.5 text-[15px] leading-[1.5] text-[#2b3145]">
                <strong>{s.bold}</strong> {s.rest}
              </p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
