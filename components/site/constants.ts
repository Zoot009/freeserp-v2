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
  blueBg: "#ebf1ff",
  purple: "#7e5bff",
  green: "#0ea66f",
} as const;

export type NavItem = "Free SERP Checker" | "Features" | "How it works" | "Blog";

export const NAV: NavItem[] = [
  "Free SERP Checker",
  "Features",
  "How it works",
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
