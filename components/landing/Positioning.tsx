import { Check, X } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/landing/ui/Reveal";

type PositioningDict = {
  heading: string;
  suiteTitle: string;
  suitePoints: string[];
  freeserpTitle: string;
  freeserpPoints: string[];
};

/**
 * Category positioning: a full SEO suite versus a ranking check.
 *
 * The left column is deliberately about "traditional SEO platforms" as a
 * concept and names no competitor — the comparison is about how much tool you
 * need for the job, not about who is worse.
 */
export default function Positioning({ dict }: { dict: PositioningDict }) {
  return (
    <section className="mx-auto max-w-[1160px] px-6 pt-24">
      <Reveal>
        <h2 className="mx-auto max-w-[880px] text-center text-[32px] leading-[1.08] font-extrabold tracking-[-0.03em] text-balance text-[#0b1020] sm:text-[42px]">
          {dict.heading}
        </h2>
      </Reveal>

      <RevealGroup
        className="mt-12 grid grid-cols-1 items-stretch gap-[22px] md:grid-cols-2"
        stagger={0.1}
      >
        <RevealItem>
          <div className="h-full rounded-[22px] border border-[#e8ebf4] bg-[#f5f6fa] p-8 sm:p-9">
            <h3 className="text-xl font-extrabold tracking-[-0.02em] text-[#5a6172]">
              {dict.suiteTitle}
            </h3>
            <ul className="mt-6 flex flex-col gap-4">
              {dict.suitePoints.map((p) => (
                <li
                  key={p}
                  className="flex items-start gap-3 text-base leading-[1.5] text-[#5a6172]"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e3e5ee]">
                    <X className="h-3 w-3 text-[#8b93a5]" strokeWidth={3} />
                  </span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </RevealItem>

        <RevealItem>
          <div className="h-full rounded-[22px] border border-accent/25 bg-linear-to-br from-[#eef3ff] to-[#e6edff] p-8 shadow-[0_24px_50px_-30px_rgba(47,107,255,0.45)] sm:p-9">
            <h3 className="text-xl font-extrabold tracking-[-0.02em] text-accent-dark">
              {dict.freeserpTitle}
            </h3>
            <ul className="mt-6 flex flex-col gap-4">
              {dict.freeserpPoints.map((p) => (
                <li
                  key={p}
                  className="flex items-start gap-3 text-base leading-[1.5] font-medium text-[#1b2237]"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent">
                    <Check className="h-3 w-3 text-white" strokeWidth={3.5} />
                  </span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
