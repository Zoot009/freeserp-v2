"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowRight, Loader2, Search } from "lucide-react";
import { LogoMark } from "@/components/landing/ui/Logo";
import PersonalizedNote from "@/components/landing/ui/PersonalizedNote";
import { domainExists } from "@/lib/landing/domainCheck";
import { LazyDemoVideo } from "@/components/landing/ui/LazyDemoVideo";
import { normalizeDomain } from "@/lib/landing/previewData";
import { trackLanding } from "@/components/landing/track";
import type { PreviewController, PreviewOverlayDict } from "@/components/landing/preview/PreviewOverlay";

// The preview overlay pulls in framer-motion and the entire replica dashboard —
// none of which is needed until the visitor actually submits a domain. Loading
// it lazily keeps it out of the landing page's initial bundle, so the hero is
// interactive fast; the chunk streams in after hydration. ssr:false because it
// is client-only (window/history) and never renders on the server anyway.
const PreviewOverlay = dynamic(() => import("@/components/landing/preview/PreviewOverlay"), {
  ssr: false,
});

type HeroDict = {
  headline1: string;
  headlineHighlight: string;
  subheading: string;
  inputPlaceholder: string;
  ctaButton: string;
  disclaimer: string;
  liveDemo: string;
  demoAlt: string;
  invalidDomain: string;
  notFound: string;
  checking: string;
};

type PersonalizationDict = {
  leadReturning: string;
  leadSource: string;
  mainLocation: string;
  mainDefault: string;
};

const WAVEFORM_BARS = Array.from({ length: 90 }, () => null);

function WaveformBackdrop() {
  return (
    <div
      aria-hidden
      /* hidden on phones: this is 90 gradient bars painting behind the demo
         card, purely decorative, and the extra DOM + paint is a real cost on a
         weak mobile GPU for something a small screen barely shows. */
      className="pointer-events-none absolute -inset-y-10 left-1/2 z-0 hidden w-screen -translate-x-1/2 gap-[3px] overflow-hidden sm:-inset-y-14 sm:flex"
    >
      {WAVEFORM_BARS.map((_, i) => (
        <span
          key={i}
          className="h-full flex-1 rounded-full bg-linear-to-b from-[#ded4f8] via-[#a78bfa] to-[#1fc79a]"
          style={{ opacity: 0.7 }}
        />
      ))}
    </div>
  );
}

function TiltCard({ liveDemo, demoAlt }: { liveDemo: string; demoAlt: string }) {
  return (
    <div className="relative -mx-6 mt-16 max-w-240 sm:mx-auto">
      <WaveformBackdrop />
      <div className="relative rounded-none bg-linear-to-br from-accent/55 to-accent-dark/50 p-0 sm:rounded-[22px] sm:p-1.5">
        <div className="relative overflow-hidden rounded-none border border-black bg-white sm:rounded-[18px]">
          <span className="absolute top-4 right-4 z-10 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-[#0f9d6e] shadow-sm backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1fc79a]" />
            {liveDemo}
          </span>
          {/* The demo clip (WebM 0.9MB / MP4 1.7MB), loaded only once it scrolls
              near — see LazyDemoVideo. autoplay would otherwise override
              preload="none" and fetch it on initial load. width/height reserve
              the box so nothing shifts when it starts. */}
          <LazyDemoVideo label={demoAlt} className="block h-auto w-full" />
        </div>
      </div>
    </div>
  );
}

export default function Hero({
  dict,
  personalization,
  preview,
  locale,
}: {
  dict: HeroDict;
  personalization: PersonalizationDict;
  preview: PreviewOverlayDict;
  locale: string;
}) {
  const [domain, setDomain] = useState("");
  // "format" — not a plausible host at all (a typo like "hello world").
  // "notfound" — a well-formed domain that does not resolve in DNS (gibberish).
  const [error, setError] = useState<null | "format" | "notfound">(null);
  const [checking, setChecking] = useState(false);
  const previewRef = useRef<PreviewController | null>(null);
  // One form_start per page load, not per keystroke.
  const formStartedRef = useRef(false);

  // Every exit from this function emits exactly one hero_domain_submitted, with a
  // `valid` flag and a `reason` rather than three separate event names — the
  // failure rate stays a single FILTER instead of extra names to keep in sync.
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (checking) return;

    // 1. Format gate (instant, offline). normalizeDomain is a pure helper — used
    //    directly rather than through the controller, so this check works even
    //    before the lazily-loaded preview chunk has finished streaming in.
    if (normalizeDomain(domain) == null) {
      setError("format");
      trackLanding("hero_domain_submitted", { valid: false, reason: "format" });
      return;
    }

    // 2. Existence gate: a well-formed domain still has to be a real, resolvable
    //    site. domainExists fails OPEN, so a backend hiccup never blocks a real
    //    visitor — only a definitive "does not resolve" is turned away.
    setError(null);
    setChecking(true);
    const exists = await domainExists(domain);
    setChecking(false);
    if (!exists) {
      setError("notfound");
      // The domain is kept here but NOT on the "format" branch above: this one
      // parsed as a host and merely failed to resolve, so it is a real signal
      // (which non-existent domains people try). A format failure is often a
      // mistyped email, which we have no reason to store.
      trackLanding("hero_domain_submitted", {
        valid: false,
        reason: "notfound",
        domain: domain.trim(),
      });
      return;
    }
    trackLanding("hero_domain_submitted", { valid: true, domain: domain.trim() });
    previewRef.current?.open(domain);
  }

  const message =
    error === "format" ? dict.invalidDomain : error === "notfound" ? dict.notFound : dict.disclaimer;

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-linear-to-b from-[#dfeef0] via-[#e7e9f7] to-[#ece9f8] px-6 pt-8 pb-28 text-center"
    >
      {/* aurora blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[560px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(47,107,255,0.28),transparent)] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-40 -right-40 h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(28,79,214,0.26),transparent)] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-10 -left-40 h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(31,199,154,0.22),transparent)] blur-3xl"
      />
      <div
        aria-hidden
        className="bg-dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_10%,transparent_70%)]"
      />

      <div className="relative">
        <div className="flex items-center justify-center gap-2.5 text-[22px] font-extrabold tracking-tight text-[#0b1020]">
          <LogoMark className="h-[30px] w-[30px]" />
          <span>
            Free<span className="text-accent">Serp</span>
          </span>
        </div>

        <h1 className="text-emboss mx-auto mt-10 max-w-[900px] text-[44px] leading-[0.98] font-extrabold tracking-[-0.045em] text-balance text-[#10131a] sm:text-[58px] md:text-[76px]">
          {dict.headline1}{" "}
          <span className="bg-linear-to-r from-accent-dark via-accent to-[#7db2ff] bg-clip-text text-transparent">
            {dict.headlineHighlight}
          </span>
        </h1>

        <p className="mx-auto mt-7 max-w-[640px] text-lg leading-[1.4] font-medium text-pretty text-[#3b4256] sm:text-[22px]">
          {dict.subheading}
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-11 flex max-w-[640px] flex-col gap-3 rounded-[28px] border border-white/80 bg-white/55 p-2.5 shadow-[0_20px_50px_-20px_rgba(20,40,100,0.25)] backdrop-blur-sm sm:flex-row sm:items-center sm:gap-2 sm:rounded-[100px]"
        >
          <div className="flex flex-1 items-center gap-2 rounded-[100px] bg-white pl-5">
            <Search className="h-[18px] w-[18px] shrink-0 text-[#9aa2b5]" />
            <input
              value={domain}
              onChange={(e) => {
                // Form start = the first keystroke, fired once per page load.
                // Focus would be noisier (tab-through, autofocus, a stray tap all
                // count as focus without intent); typing is the earliest point the
                // visitor has actually committed to the form. The gap between this
                // and hero_domain_submitted is the abandonment we care about.
                if (!formStartedRef.current) {
                  formStartedRef.current = true;
                  trackLanding("form_start", { form: "hero_domain" });
                }
                setDomain(e.target.value);
                if (error) setError(null);
              }}
              // type="text", not "url": people type "site.com", which a url input
              // rejects for lacking a scheme. normalizeDomain does the validating.
              type="text"
              inputMode="url"
              autoComplete="url"
              spellCheck={false}
              aria-invalid={!!error}
              aria-label={dict.inputPlaceholder}
              placeholder={dict.inputPlaceholder}
              className="w-full rounded-[100px] border-none bg-transparent py-4.5 font-[family-name:var(--font-jakarta)] text-base text-[#0b1020] outline-none placeholder:text-[#9aa2b5]"
            />
          </div>
          <button
            type="submit"
            disabled={checking}
            className="group flex items-center justify-center gap-1.5 rounded-[100px] bg-accent px-8 py-4 text-base font-bold whitespace-nowrap text-white transition-all duration-300 hover:bg-accent-dark hover:shadow-[0_16px_40px_-12px_rgba(47,107,255,0.65)] disabled:cursor-wait disabled:opacity-80"
          >
            {checking ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {dict.checking}
              </>
            ) : (
              <>
                {dict.ctaButton}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
        <p
          className={`mt-5 text-sm ${error ? "font-semibold text-[#c02626]" : "text-[#6b7286]"}`}
          role={error ? "alert" : undefined}
        >
          {message}
        </p>
        <PersonalizedNote dict={personalization} locale={locale} />

        <TiltCard liveDemo={dict.liveDemo} demoAlt={dict.demoAlt} />
      </div>

      <PreviewOverlay dict={preview} locale={locale} controllerRef={previewRef} />
    </section>
  );
}
