// Location personalization for the landing pages. Mirrors lib/utm.ts / lib/analytics.ts:
// a direct, cross-origin, credential-less call to our own backend (which resolves the
// visitor's country server-side via a CDN geo header or an offline geoip-lite lookup —
// no client-side third-party geo API, no navigator.geolocation prompt). Never throws;
// unresolved always degrades to null so callers can render nothing rather than a
// placeholder or a fake country.

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || ""
const CACHE_KEY = "fs_geo_country"

// Sentinel stored when the backend resolved to no country, so a "no signal" visitor
// isn't re-fetched on every client-side nav within the same tab session.
const UNKNOWN = "__unknown__"

export async function getVisitorCountry(): Promise<string | null> {
  if (typeof window === "undefined" || !BACKEND_URL) return null

  try {
    const cached = sessionStorage.getItem(CACHE_KEY)
    if (cached !== null) return cached === UNKNOWN ? null : cached
  } catch {
    /* sessionStorage unavailable — fall through and fetch, just without caching */
  }

  let country: string | null = null
  try {
    const res = await fetch(`${BACKEND_URL}/api/geo`)
    if (res.ok) {
      const data = (await res.json()) as { country?: string | null }
      country = data.country ?? null
    }
  } catch {
    /* network error — treat as unresolved */
  }

  try {
    sessionStorage.setItem(CACHE_KEY, country ?? UNKNOWN)
  } catch {
    /* ignore */
  }
  return country
}

// ISO-3166 country code -> localized display name. Returns null on any failure
// (malformed/unrecognized code) — callers must treat that exactly like "no geo data".
export function countryDisplayName(code: string, locale: string): string | null {
  try {
    const dn = new Intl.DisplayNames([locale], { type: "region" })
    return dn.of(code.toUpperCase()) ?? null
  } catch {
    return null
  }
}
