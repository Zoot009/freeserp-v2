import type { ReactNode } from "react";
import { MapPin } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/landing/ui/Reveal";

type MarketsDict = {
  heading: string;
  intro: string;
  tiers: { tier: string; example: string }[];
  outro: string;
};

/**
 * The four rings are the four search markets in the tier list, innermost first
 * (local → state → national → international). It is decorative: every ring is
 * labelled in the list beside it, so the SVG carries no information of its own
 * and is hidden from assistive tech.
 */
function MarketRings() {
  const rings = [
    { r: 104, dash: "6 7", opacity: 0.35 },
    { r: 78, dash: "", opacity: 0.5 },
    { r: 52, dash: "", opacity: 0.7 },
  ];
  return (
    <svg
      aria-hidden
      viewBox="0 0 240 240"
      className="h-auto w-full max-w-[280px]"
      role="presentation"
    >
      <defs>
        <radialGradient id="market-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2f6bff" stopOpacity="0.30" />
          <stop offset="100%" stopColor="#2f6bff" stopOpacity="0.05" />
        </radialGradient>
      </defs>
      {rings.map((ring) => (
        <circle
          key={ring.r}
          cx="120"
          cy="120"
          r={ring.r}
          fill="none"
          stroke="#2f6bff"
          strokeOpacity={ring.opacity}
          strokeWidth="1.5"
          strokeDasharray={ring.dash || undefined}
        />
      ))}
      <circle cx="120" cy="120" r="28" fill="url(#market-core)" />
      <circle cx="120" cy="120" r="28" fill="none" stroke="#2f6bff" strokeWidth="1.5" />
      {/* The pin sits at the centre — one business, radiating outward. */}
      <circle cx="120" cy="120" r="9" fill="#1fc79a" />
      <circle cx="120" cy="120" r="9" fill="none" stroke="#ffffff" strokeWidth="3" />
    </svg>
  );
}

export default function SearchMarkets({
  dict,
  visual,
}: {
  dict: MarketsDict;
  /**
   * Optional replacement for the default concentric-ring diagram — a market
   * that reads better with its own artwork (a country map, say) passes one in.
   * Whatever is supplied is decorative: the tier list beside it carries the
   * meaning, so it should be aria-hidden.
   */
  visual?: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-[1160px] px-6 pt-24">
      <div className="rounded-[24px] bg-linear-to-br from-[#eef3ff] via-[#f2f5fd] to-[#e9f5f1] p-7 sm:p-12">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[280px_1fr] md:gap-14">
          <Reveal className="flex justify-center">
            {visual ?? <MarketRings />}
          </Reveal>

          <Reveal>
            <h2 className="text-[30px] leading-[1.1] font-extrabold tracking-[-0.03em] text-balance text-[#0b1020] sm:text-[38px]">
              {dict.heading}
            </h2>
            <p className="mt-4 text-[17px] leading-[1.5] text-[#5a6172]">
              {dict.intro}
            </p>

            <RevealGroup
              className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2"
              stagger={0.08}
            >
              {dict.tiers.map((t) => (
                <RevealItem key={t.tier}>
                  <div className="h-full rounded-xl border border-white bg-white/75 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_36px_-20px_rgba(20,40,100,0.32)]">
                    <div className="flex items-center gap-1.5 text-[12.5px] font-bold tracking-[0.06em] text-accent-dark uppercase">
                      <MapPin className="h-3.5 w-3.5" />
                      {t.tier}
                    </div>
                    <p className="mt-2 font-[family-name:var(--font-space-mono)] text-[15px] leading-[1.4] text-[#1b2237]">
                      &ldquo;{t.example}&rdquo;
                    </p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>

            <p className="mt-7 text-base leading-[1.55] text-pretty text-[#2b3145]">
              {dict.outro}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
