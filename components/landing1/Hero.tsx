"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { LogoMark } from "@/components/landing1/ui/Logo";
import { POPULAR_LOCATIONS, ALL_LOCATIONS } from "@/components/site/locations";
import PersonalizedNote from "@/components/landing1/ui/PersonalizedNote";
import { useAppUrl } from "@/lib/useAppUrl";

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
          {/* Video (WebM 0.9MB / MP4 1.7MB) in place of the old 25.6MB GIF. */}
          <video
            width={900}
            height={500}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            aria-label={demoAlt}
            className="block h-auto w-full"
          >
            <source src="/freeserpchecker.webm" type="video/webm" />
            <source src="/freeserpchecker.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </motion.div>
  );
}

/** Multi-field SERP-checker form — replaces the single domain-search pill. */
function RankCheckerForm({ ctaButton, signupHref }: { ctaButton: string; signupHref: string }) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [country, setCountry] = useState("in");

  return (
    <motion.div
      variants={item}
      className="relative mx-auto mt-11 max-w-[640px] overflow-hidden rounded-[28px] bg-white p-6 text-left shadow-[0_25px_60px_-15px_rgba(47,107,255,0.5)] sm:p-8"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-bold tracking-wide text-[#5a6172] uppercase">
            Domain
          </span>
          <input
            placeholder="example.com"
            className="mt-1.5 w-full rounded-lg border border-[#e6e9f2] bg-white px-3.5 py-2.5 font-[family-name:var(--font-jakarta)] text-sm text-[#0b1020] outline-none placeholder:text-[#9aa2b5]"
          />
        </label>
        <label className="block">
          <span className="text-xs font-bold tracking-wide text-[#5a6172] uppercase">
            Keyword
          </span>
          <input
            placeholder="best running shoes"
            className="mt-1.5 w-full rounded-lg border border-[#e6e9f2] bg-white px-3.5 py-2.5 font-[family-name:var(--font-jakarta)] text-sm text-[#0b1020] outline-none placeholder:text-[#9aa2b5]"
          />
        </label>
        <label className="block">
          <span className="text-xs font-bold tracking-wide text-[#5a6172] uppercase">
            Country
          </span>
          <div className="relative mt-1.5">
            {/* Regional-indicator flag emoji don't render as flags on Windows
                (Chrome/Edge show the raw two-letter code instead), so use a
                real flag image here rather than flagFor()'s emoji. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://flagcdn.com/${country.toLowerCase()}.svg`}
              alt=""
              aria-hidden
              width={20}
              height={15}
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 rounded-[2px]"
            />
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              aria-label="Country"
              className="w-full cursor-pointer appearance-none rounded-lg border border-[#e6e9f2] bg-white py-2.5 pr-3.5 pl-9 font-[family-name:var(--font-jakarta)] text-sm text-[#0b1020] outline-none"
            >
              <optgroup label="Popular">
                {POPULAR_LOCATIONS.map((l) => (
                  <option key={`p-${l.code}`} value={l.code}>
                    {l.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="All countries">
                {ALL_LOCATIONS.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </label>
        <div>
          <span className="block text-xs font-bold tracking-wide text-[#5a6172] uppercase">
            Device
          </span>
          <div className="mt-1.5 flex overflow-hidden rounded-lg border border-[#e6e9f2] bg-white">
            <button
              type="button"
              onClick={() => setDevice("desktop")}
              className={`flex-1 px-3.5 py-2.5 text-sm font-bold transition-colors ${
                device === "desktop" ? "bg-accent text-white" : "text-[#5a6172] hover:bg-[#f5f6fa]"
              }`}
            >
              Desktop
            </button>
            <button
              type="button"
              onClick={() => setDevice("mobile")}
              className={`flex-1 px-3.5 py-2.5 text-sm font-bold transition-colors ${
                device === "mobile" ? "bg-accent text-white" : "text-[#5a6172] hover:bg-[#f5f6fa]"
              }`}
            >
              Mobile
            </button>
          </div>
        </div>
      </div>
      <a
        href={signupHref}
        className="group mt-5 flex items-center justify-center gap-1.5 rounded-full bg-accent px-8 py-4 text-base font-bold whitespace-nowrap text-white transition-all duration-300 hover:bg-accent-dark hover:shadow-[0_16px_40px_-12px_rgba(47,107,255,0.65)]"
      >
        {ctaButton}
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </a>
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
  const appUrl = useAppUrl();
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

        <RankCheckerForm ctaButton="Check Rankings" signupHref={appUrl("/signup")} />

        <motion.p variants={item} className="mt-5 text-sm text-[#6b7286]">
          {dict.disclaimer}
        </motion.p>
        <PersonalizedNote dict={personalization} locale={locale} />

        <TiltCard liveDemo={dict.liveDemo} demoAlt={dict.demoAlt} />
      </motion.div>
    </section>
  );
}
