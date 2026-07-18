import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale, hasLocale } from "@/lib/landing/dictionaries";

// Every locale-prefixed marketing-page variant that shares this proxy's
// redirect logic. Add new roots here (and to `config.matcher` below) rather
// than duplicating the function.
const LANDING_ROOTS = ["/landing", "/landing1"];

function getPreferredLocale(request: NextRequest) {
  const acceptLanguage = request.headers.get("accept-language");
  if (!acceptLanguage) return defaultLocale;

  const preferred = acceptLanguage
    .split(",")
    .map((part) => part.split(";")[0].trim().toLowerCase().split("-")[0]);

  for (const lang of preferred) {
    if (hasLocale(lang)) return lang;
  }

  return defaultLocale;
}

// Scoped to LANDING_ROOTS only — every other route on the site (/, /pricing,
// /blog, /api/contact, ...) is never touched. The `matcher` below is the
// primary, build-time-verifiable guarantee of that; this in-function guard
// is a second, redundant safety net in case the matcher is ever loosened.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const root = LANDING_ROOTS.find(
    (r) => pathname === r || pathname.startsWith(`${r}/`),
  );
  if (!root) return NextResponse.next();

  const pathnameHasLocale = locales.some(
    (locale) => pathname === `${root}/${locale}` || pathname.startsWith(`${root}/${locale}/`),
  );
  if (pathnameHasLocale) return NextResponse.next();

  const locale = getPreferredLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = pathname.replace(new RegExp(`^${root}`), `${root}/${locale}`);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/landing", "/landing/:path*", "/landing1", "/landing1/:path*"],
};
