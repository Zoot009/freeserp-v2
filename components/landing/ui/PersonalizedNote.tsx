"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { hasExistingVisitorId, readPersistedUtm, readUtm } from "@/lib/utm";
import { getVisitorCountry, countryDisplayName } from "@/lib/landing/geo";
import { renderTemplate } from "@/lib/landing/template";

type PersonalizationDict = {
  leadReturning: string;
  leadSource: string;
  mainLocation: string;
  mainDefault: string;
};

const SOURCE_LABELS: Record<string, string> = {
  google: "Google",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  twitter: "Twitter",
  x: "X",
  instagram: "Instagram",
  youtube: "YouTube",
  reddit: "Reddit",
  newsletter: "our newsletter",
};

function sourceLabel(source: string): string {
  const lower = source.toLowerCase();
  return SOURCE_LABELS[lower] ?? lower.charAt(0).toUpperCase() + lower.slice(1);
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Combines up to two anonymous signals (UTM source or returning-visitor cookie,
 * plus IP-derived location) into a single personalized line below the Hero
 * disclaimer. Renders nothing until every signal is resolved as absent — never a
 * placeholder or a fake country. SSR/first paint render nothing so there's no
 * hydration mismatch; the line only appears as a post-mount enhancement.
 */
export default function PersonalizedNote({
  dict,
  locale,
}: {
  dict: PersonalizationDict;
  locale: string;
}) {
  // Lazy initializers run at render time, before UtmCapture's own effect (mounted
  // globally in the root layout) can create the visitor cookie / persist the UTM
  // this same commit — reading the cookie and the current URL directly here avoids
  // racing that effect (UtmCapture uses a Suspense-gated useSearchParams(), so its
  // effect can commit in a later pass than this component's).
  const [isReturning] = useState(() => hasExistingVisitorId());
  const [utmSource] = useState(() => {
    if (typeof window === "undefined") return undefined;
    return readUtm(new URLSearchParams(window.location.search)).utmSource ?? readPersistedUtm().utmSource;
  });
  const [mounted, setMounted] = useState(false);
  const [country, setCountry] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    let cancelled = false;
    getVisitorCountry().then((code) => {
      if (!cancelled) setCountry(code);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!mounted) return null;

  const countryName = country ? countryDisplayName(country, locale) : null;

  const lead = utmSource
    ? renderTemplate(dict.leadSource, { source: sourceLabel(utmSource) })
    : isReturning
      ? dict.leadReturning
      : null;

  if (!lead && !countryName) return null;

  const main = countryName ? renderTemplate(dict.mainLocation, { country: countryName }) : dict.mainDefault;
  const text = lead ? `${lead} — ${main}` : capitalize(main);

  return (
    <motion.p
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mt-3 text-sm font-semibold text-accent-dark"
    >
      {text}
    </motion.p>
  );
}
