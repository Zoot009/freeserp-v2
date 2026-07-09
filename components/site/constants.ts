import { utmToParams, type Utm } from "@/lib/utm";

export const COLORS = {
  blue: "#0454ff",
  black: "#000",
  white: "#fff",
  gray: "#6d6d6d",
  subtle: "#8a8a93",
  border: "#eaeaea",
  bg: "#fff",
  softGray: "#f5f6f8",
  red: "#ff5b5b",
  redBg: "#fff2f2",
  amber: "#f5a623",
  amberBg: "#fff6e3",
  amberText: "#8a5300",
  blueBg: "#ebf1ff",
  purple: "#7e5bff",
  green: "#0ea66f",
} as const;

export type NavItem = "Free SERP Checker" | "Blog" | "Pricing";

export const NAV: NavItem[] = [
  "Free SERP Checker",
  "Pricing",
  "Blog",
];

export function navHref(n: NavItem | string): string {
  switch (n) {
    case "Free SERP Checker":
      return "/serp-checker";
    case "Features":
      return "/#features";
    case "How it works":
      return "/#how-it-works";
    case "Blog":
      return "/blog";
    case "Pricing":
      return "/pricing";
    default:
      return "#";
  }
}

/**
 * Where the product app lives. The marketing site (freeserp.com) and the app
 * (app.freeserp.com) are separate deployments — every "Get started" / app link
 * on the marketing site points across to the app domain. Override per-env with
 * NEXT_PUBLIC_APP_URL (e.g. http://localhost:3001 in local dev).
 */
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://app.freeserp.com";

/** Build an absolute URL into the product app, e.g. appUrl("/signup"). */
export function appUrl(path = ""): string {
  return `${APP_URL}${path}`;
}

/**
 * Like appUrl(), but appends the visitor's campaign UTMs so they survive the hop
 * to the app's own origin (app.freeserp.com), where the app's UtmCapture records
 * a touch on the /signup or /login landing. Only present UTMs are appended, so an
 * un-tagged visitor gets the plain appUrl(path). Pure — the caller supplies the
 * UTMs (see the useAppUrl hook, which reads them from the URL / session).
 */
export function appUrlWithUtm(path = "", utm: Utm = {}): string {
  const base = appUrl(path);
  const qs = utmToParams(utm).toString();
  if (!qs) return base;
  return base + (base.includes("?") ? "&" : "?") + qs;
}

/**
 * The freeserp API backend. The marketing-site SERP checker calls it directly
 * from the browser (so the rate-limit + result IP-gate see the real visitor).
 * Override per-env with NEXT_PUBLIC_BACKEND_URL; the backend's ALLOWED_ORIGINS
 * must include this site's origin.
 */
// Defaults to the v2 (TypeScript) backend on :3003, which fetches SERPs via the
// DataForSEO API. The legacy v1 backend on :3002 is no longer used.
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3003";
