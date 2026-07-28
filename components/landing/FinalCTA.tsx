"use client";

import { ArrowRight, Award } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/landing/ui/Reveal";
import { LogoMark } from "@/components/landing/ui/Logo";
import { useAppUrl } from "@/lib/useAppUrl";
import { trackLandingAndFlush } from "@/components/landing/track";

type FinalCtaDict = {
  heading: string;
  body: string;
  button: string;
  badges: string[];
  copyright: string;
  legal: string;
  privacy: string;
  doNotSell: string;
};

export default function FinalCTA({ dict }: { dict: FinalCtaDict }) {
  const appUrl = useAppUrl();
  return (
    <section className="mt-24">
      <div className="bg-noise relative overflow-hidden bg-[#0b1020] px-6 pt-24 pb-14 text-center text-white">
        <div
          aria-hidden
          className="animate-aurora pointer-events-none absolute top-0 left-1/2 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(47,107,255,0.35),transparent)] blur-3xl"
        />

        <Reveal className="relative flex justify-center">
          <LogoMark className="h-12 w-12" />
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="relative mt-6 text-[36px] font-extrabold tracking-[-0.03em] uppercase sm:text-[52px]">
            {dict.heading}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="relative mx-auto mt-5.5 max-w-[600px] text-lg leading-[1.5] text-[#c2c7d6]">
            {dict.body}
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="relative mt-7.5 inline-flex">
            <span
              aria-hidden
              className="animate-cta-pulse pointer-events-none absolute inset-0 rounded-full"
            />
            <a
              href={appUrl("/signup")}
              onClick={(e) =>
                trackLandingAndFlush("signup_cta_click", {
                  placement: "final_cta",
                  href: e.currentTarget.getAttribute("href"),
                })
              }
              className="group relative inline-flex items-center gap-2 rounded-full bg-accent px-9 py-[15px] text-base font-bold text-white shadow-[0_12px_28px_rgba(47,107,255,0.4)] transition-all duration-300 hover:bg-accent-dark hover:shadow-[0_18px_44px_-8px_rgba(47,107,255,0.65)]"
            >
              {dict.button}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </Reveal>

        <RevealGroup
          className="relative mx-auto mt-18 grid max-w-[1000px] grid-cols-2 gap-x-6 gap-y-7 sm:flex sm:flex-wrap sm:justify-between sm:gap-6"
          stagger={0.05}
        >
          {dict.badges.map((b) => (
            <RevealItem key={b}>
              <div className="flex items-center gap-2.5 text-left">
                <span className="flex h-[42px] w-[34px] items-center justify-center rounded-t-md bg-linear-to-b from-[#4a5474] to-[#2f3752] text-white">
                  <Award className="h-4 w-4" />
                </span>
                <span className="text-[11.5px] leading-[1.25] font-bold text-[#dfe3ee]">
                  {b}
                </span>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="relative mx-auto mt-14 flex max-w-[1160px] flex-wrap items-center justify-between gap-4 border-t border-[#1e2740] pt-6.5 text-[13px] text-[#8a91a3]">
          <span>{dict.copyright}</span>
          <div className="flex gap-7">
            <a href="#top" className="transition-colors hover:text-white">
              {dict.legal}
            </a>
            <a href="#top" className="transition-colors hover:text-white">
              {dict.privacy}
            </a>
            <a href="#top" className="transition-colors hover:text-white">
              {dict.doNotSell}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
