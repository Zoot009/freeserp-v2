import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale, hasLocale } from "@/lib/landing/dictionaries";

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

// Scoped to /landing only — every other route on the site (/, /pricing,
// /blog, /api/contact, ...) is never touched. The `matcher` below is the
// primary, build-time-verifiable guarantee of that; this in-function guard
// is a second, redundant safety net in case the matcher is ever loosened.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname !== "/landing" && !pathname.startsWith("/landing/")) {
    return NextResponse.next();
  }

  const pathnameHasLocale = locales.some(
    (locale) =>
      pathname === `/landing/${locale}` || pathname.startsWith(`/landing/${locale}/`),
  );
  if (pathnameHasLocale) return NextResponse.next();

  const locale = getPreferredLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = pathname.replace(/^\/landing/, `/landing/${locale}`);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/landing", "/landing/:path*"],
};
