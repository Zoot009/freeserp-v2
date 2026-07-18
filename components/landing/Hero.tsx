"use client";

import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { LogoMark } from "@/components/landing/ui/Logo";
import PersonalizedNote from "@/components/landing/ui/PersonalizedNote";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

type HeroDict = {
  headline1: string;
  headlineHighlight: string;
  subheading: string;
  inputPlaceholder: string;
  ctaButton: string;
  disclaimer: string;
  liveDemo: string;
  demoAlt: string;
};

type PersonalizationDict = {
  leadReturning: string;
  leadSource: string;
  mainLocation: string;
  mainDefault: string;
};

const WAVEFORM_BARS = Array.from({ length: 90 }, (_, i) => ({
  delay: (i % 18) * 0.09,
}));

function WaveformBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -inset-y-10 left-1/2 z-0 flex w-screen -translate-x-1/2 gap-[3px] overflow-hidden sm:-inset-y-14"
    >
      {WAVEFORM_BARS.map((bar, i) => (
        <span
          key={i}
          className="animate-waveform h-full flex-1 rounded-full bg-linear-to-b from-[#ded4f8] via-[#a78bfa] to-[#1fc79a]"
          style={{
            opacity: 0.7,
            animationDelay: `${bar.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function TiltCard({ liveDemo, demoAlt }: { liveDemo: string; demoAlt: string }) {
  return (
    <motion.div variants={item} className="relative -mx-6 mt-16 max-w-240 sm:mx-auto">
      <WaveformBackdrop />
      <div className="relative rounded-none bg-linear-to-br from-accent/55 to-accent-dark/50 p-0 sm:rounded-[22px] sm:p-1.5">
        <div className="relative overflow-hidden rounded-none border border-black bg-white sm:rounded-[18px]">
          <span className="absolute top-4 right-4 z-10 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-[#0f9d6e] shadow-sm backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#1fc79a]" />
            {liveDemo}
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element -- animated GIF must stay unoptimized to keep playing */}
          <img
            src="/freeserpchecker.gif"
            alt={demoAlt}
            width={900}
            height={500}
            className="block h-auto w-full"
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function Hero({
  dict,
  personalization,
  locale,
}: {
  dict: HeroDict;
  personalization: PersonalizationDict;
  locale: string;
}) {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-linear-to-b from-[#dfeef0] via-[#e7e9f7] to-[#ece9f8] px-6 pt-8 pb-28 text-center"
    >
      {/* aurora blobs */}
      <div
        aria-hidden
        className="animate-aurora pointer-events-none absolute -top-32 left-1/2 h-[560px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(47,107,255,0.28),transparent)] blur-3xl"
      />
      <div
        aria-hidden
        className="animate-aurora pointer-events-none absolute top-40 -right-40 h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(28,79,214,0.26),transparent)] blur-3xl"
        style={{ animationDelay: "3s" }}
      />
      <div
        aria-hidden
        className="animate-aurora pointer-events-none absolute top-10 -left-40 h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(31,199,154,0.22),transparent)] blur-3xl"
        style={{ animationDelay: "6s" }}
      />
      <div
        aria-hidden
        className="bg-dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_10%,transparent_70%)]"
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={container}
        className="relative"
      >
        <motion.div
          variants={item}
          className="flex items-center justify-center gap-2.5 text-[22px] font-extrabold tracking-tight text-[#0b1020]"
        >
          <LogoMark className="h-[30px] w-[30px]" />
          <span>
            Free<span className="text-accent">Serp</span>
          </span>
        </motion.div>

        <motion.h1
          variants={item}
          className="text-emboss mx-auto mt-10 max-w-[900px] text-[44px] leading-[0.98] font-extrabold tracking-[-0.045em] text-balance text-[#10131a] sm:text-[58px] md:text-[76px]"
        >
          {dict.headline1}{" "}
          <span className="bg-linear-to-r from-accent-dark via-accent to-[#7db2ff] bg-clip-text text-transparent">
            {dict.headlineHighlight}
          </span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mx-auto mt-7 max-w-[640px] text-lg leading-[1.4] font-medium text-pretty text-[#3b4256] sm:text-[22px]"
        >
          {dict.subheading}
        </motion.p>

        <motion.div
          variants={item}
          className="mx-auto mt-11 flex max-w-[640px] flex-col gap-3 rounded-[28px] border border-white/80 bg-white/55 p-2.5 shadow-[0_20px_50px_-20px_rgba(20,40,100,0.25)] backdrop-blur-sm sm:flex-row sm:items-center sm:gap-2 sm:rounded-[100px]"
        >
          <div className="flex flex-1 items-center gap-2 rounded-[100px] bg-white pl-5">
            <Search className="h-[18px] w-[18px] shrink-0 text-[#9aa2b5]" />
            <input
              placeholder={dict.inputPlaceholder}
              className="w-full rounded-[100px] border-none bg-transparent py-4.5 font-[family-name:var(--font-jakarta)] text-base text-[#0b1020] outline-none placeholder:text-[#9aa2b5]"
            />
          </div>
          <a
            href="https://app.freeserp.com/"
            className="group flex items-center justify-center gap-1.5 rounded-[100px] bg-accent px-8 py-4 text-base font-bold whitespace-nowrap text-white transition-all duration-300 hover:bg-accent-dark hover:shadow-[0_16px_40px_-12px_rgba(47,107,255,0.65)]"
          >
            {dict.ctaButton}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </motion.div>
        <motion.p variants={item} className="mt-5 text-sm text-[#6b7286]">
          {dict.disclaimer}
        </motion.p>
        <PersonalizedNote dict={personalization} locale={locale} />

        <TiltCard liveDemo={dict.liveDemo} demoAlt={dict.demoAlt} />
      </motion.div>
    </section>
  );
}
