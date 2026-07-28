// Landing-page behavioural events. A thin wrapper over lib/analytics so the ad
// landing pages emit named funnel events on top of the generic $pageview /
// page_engagement / heatmap capture that UtmCapture already provides site-wide.
//
// Deliberately a plain module rather than a context/provider: every call site is
// already a client component, and the only thing a provider would supply
// implicitly — page variant and locale — is already carried on every event as
// `path` (/landing/en vs /landing1/en), so the admin derives both in SQL instead
// of us stamping them on each row.
//
// Must NOT reach for useSearchParams: /landing/[lang] is statically prerendered
// via generateStaticParams, which is why PreviewOverlay reads window.location
// directly. Keep this module hook-free.

import { track, flush } from "@/lib/analytics"

export function trackLanding(name: string, properties?: Record<string, unknown>): void {
  track(name, properties)
}

// For handlers that immediately navigate cross-origin (the signup CTAs hop to
// app.freeserp.com). lib/analytics batches at 10 events / 2000ms and otherwise
// only escapes on pagehide, which races a same-tab cross-origin navigation — the
// highest-intent event on the page is exactly the one most likely to be lost.
// flush(true) uses sendBeacon, which the browser guarantees past unload.
export function trackLandingAndFlush(name: string, properties?: Record<string, unknown>): void {
  track(name, properties)
  flush(true)
}
