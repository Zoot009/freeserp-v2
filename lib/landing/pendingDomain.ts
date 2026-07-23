"use client"

// Carries the domain a visitor previewed on the landing page across to the app,
// so that after they sign up we can create their project already named after it
// instead of dropping them on an empty dashboard.
//
// A cookie rather than localStorage because the marketing site (freeserp.com)
// and the app (app.freeserp.com) are different ORIGINS — localStorage is
// per-origin and would not survive the hop. They are, however, the same SITE, so
// a cookie scoped to the registrable domain is readable by both.
//
// The app-side reader/clearer is lib/pendingDomain.ts in freeserp-frontend-v2.
// The cookie NAME and the localhost fallback must stay in sync between the two.

export const PENDING_DOMAIN_COOKIE = "fs_pending_domain"

/** 30 days: long enough to cover "I'll sign up later", short enough to go stale. */
const MAX_AGE_SECONDS = 30 * 24 * 60 * 60

/**
 * The `Domain` attribute to scope the cookie to, or null to leave it host-only.
 *
 * On *.freeserp.com we widen to the registrable domain so app.freeserp.com can
 * read it. Everywhere else we deliberately do NOT set a domain:
 *   - on localhost the attribute is rejected by browsers anyway, and host-only
 *     localhost cookies already ignore the port, so :3000 -> :3001 works;
 *   - on Vercel preview URLs the two deployments are unrelated hosts, so no
 *     cookie could bridge them — the preview still works, the handoff just
 *     doesn't, which is the correct degradation for a throwaway environment.
 */
function cookieDomain(): string | null {
  const host = window.location.hostname
  if (host === "freeserp.com" || host.endsWith(".freeserp.com")) return ".freeserp.com"
  return null
}

/**
 * Remember the previewed domain. Best-effort: a visitor who blocks cookies still
 * gets the full preview, they just land on a normal empty dashboard afterwards.
 */
export function savePendingDomain(domain: string): void {
  if (typeof document === "undefined") return
  try {
    const scope = cookieDomain()
    const parts = [
      `${PENDING_DOMAIN_COOKIE}=${encodeURIComponent(domain)}`,
      "path=/",
      `max-age=${MAX_AGE_SECONDS}`,
      // Lax, not Strict: the visitor reaches the app via a top-level link from
      // this page, and Strict would withhold the cookie on exactly that hop.
      "samesite=lax",
    ]
    if (scope) parts.push(`domain=${scope}`)
    if (window.location.protocol === "https:") parts.push("secure")
    document.cookie = parts.join("; ")
  } catch {
    /* cookies disabled — the preview is unaffected, only the handoff is lost */
  }
}
