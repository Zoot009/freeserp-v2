import "server-only";
import type { Dictionary } from "./types";

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
