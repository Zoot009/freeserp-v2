import { Quote, Star } from "lucide-react";
import { Reveal } from "@/components/landing/ui/Reveal";
import { AnimatedCounter } from "@/components/landing/ui/AnimatedCounter";

type TestimonialDict = {
  quote: string;
  name: string;
  role: string;
  stat1Val: string;
  stat1Label: string;
  stat2Val: string;
  stat2Label: string;
  stat3Val: string;
  stat3Label: string;
};

export default function Testimonial({ dict }: { dict: TestimonialDict }) {
  return (
    <section className="mx-auto max-w-[1160px] px-6 pt-20">
      <div className="grid grid-cols-1 items-stretch gap-[22px] md:grid-cols-[1.1fr_1fr]">
        <Reveal className="relative flex flex-col overflow-hidden rounded-[20px] bg-[#0b1020] p-10 text-white">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-accent/20 blur-3xl"
          />
          <Quote className="relative h-8 w-8 text-mint/70" />
          <div className="relative mt-4 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-mint text-mint" />
            ))}
          </div>
          <p className="relative mt-5 text-xl leading-[1.45] font-semibold text-[#f2f4fb] sm:text-[22px]">
            &ldquo;{dict.quote}&rdquo;
          </p>
          <div className="relative mt-auto flex items-center gap-3 pt-7">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-accent to-accent-dark text-sm font-bold">
              DC
            </div>
            <div>
              <div className="text-[15px] font-bold">{dict.name}</div>
              <div className="text-[13.5px] text-[#9aa2b5]">{dict.role}</div>
            </div>
          </div>
        </Reveal>
        <div className="grid grid-rows-2 gap-[22px]">
          <div className="grid grid-cols-2 gap-[22px]">
            <Reveal delay={0.05}>
              <div className="h-full rounded-[20px] bg-[#f5f6fa] p-7.5 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_20px_40px_-24px_rgba(20,40,100,0.28)]">
                <div className="text-[36px] font-extrabold tracking-[-0.03em] text-[#10131a] sm:text-[44px]">
                  <AnimatedCounter value={dict.stat1Val} />
                </div>
                <div className="mt-2 text-sm text-[#5a6172]">
                  {dict.stat1Label}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="h-full rounded-[20px] bg-[#f5f6fa] p-7.5 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_20px_40px_-24px_rgba(20,40,100,0.28)]">
                <div className="text-[36px] font-extrabold tracking-[-0.03em] text-[#10131a] sm:text-[44px]">
                  <AnimatedCounter value={dict.stat2Val} />
                </div>
                <div className="mt-2 text-sm text-[#5a6172]">
                  {dict.stat2Label}
                </div>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <div className="relative h-full overflow-hidden rounded-[20px] bg-[#f5f6fa] p-7.5 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_20px_40px_-24px_rgba(20,40,100,0.28)]">
              <div className="text-[36px] font-extrabold tracking-[-0.03em] text-[#10131a] sm:text-[44px]">
                <AnimatedCounter value={dict.stat3Val} />
              </div>
              <div className="mt-2 text-sm text-[#5a6172]">
                {dict.stat3Label}
              </div>
              <div
                className="pointer-events-none absolute inset-y-0 right-0 w-[45%] opacity-50"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(90deg, transparent, transparent 5px, #1fc79a 5px, #1fc79a 7px)",
                }}
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
