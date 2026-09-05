import "server-only";
import type { Dictionary } from "./types";

// Languages only. Ad-market landers (/free-serp-checker/US, /free-serp-checker/UK)
// are standalone routes with their own copy, not entries here — a market is not
// a language, and modelling one as a locale made the two look interchangeable.
export const locales = ["en", "es", "fr", "nl"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./en").then((m) => m.default),
  es: () => import("./es").then((m) => m.default),
  fr: () => import("./fr").then((m) => m.default),
  nl: () => import("./nl").then((m) => m.default),
};

export const hasLocale = (locale: string): locale is Locale =>
  (locales as readonly string[]).includes(locale);

export const getDictionary = (locale: Locale) => dictionaries[locale]();

/**
 * The BCP 47 tag for a route segment. Every locale here is already a valid tag,
 * so this is a pass-through — it exists so callers that feed the segment to
 * Intl (the preview overlay's dates, the hero's country name) never have to
 * care whether that stays true. The ad-market routes, whose segments are NOT
 * valid tags, set their own `lang` and never reach this.
 */
export const localeTag = (locale: Locale): string => locale;
