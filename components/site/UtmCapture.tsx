"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { hasAnyUtm, persistUtm, readUtm, recordTouch, type Utm } from "@/lib/utm"
import { track } from "@/lib/analytics"

// Marks that this browser session's entry touch has been recorded, so the
// direct/organic origin (referrer + landing path) is logged once per session.
const SESSION_STARTED_KEY = "fs_session_started"

function sessionStarted(): boolean {
  try {
    return sessionStorage.getItem(SESSION_STARTED_KEY) === "1"
  } catch {
    return true
  }
}
function markSessionStarted() {
  try {
    sessionStorage.setItem(SESSION_STARTED_KEY, "1")
  } catch {
    /* ignore */
  }
}

function dedupeKey(prefix: string, path: string, utm: Utm) {
  return [prefix, path, utm.utmSource, utm.utmMedium, utm.utmCampaign, utm.utmContent, utm.utmTerm]
    .map((p) => p ?? "")
    .join("|")
}

// Records first-party marketing touches to our backend (no GTM/third party) so a
// visitor's journey on freeserp.com is captured and later stitched to the app via
// the shared *.freeserp.com visitor cookie (see lib/utm.ts). Fires on a UTM-tagged
// landing or, once per session, on the direct/organic entry.
//
// Capture is UNCONDITIONAL: the marketing site has no cookie-consent banner and
// already loads GTM/GA/Ads without one, so gating on a consent flag that doesn't
// exist would never capture. Renders nothing.
export function UtmCapture() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Snapshot the entry URL's UTMs on the first render (before any client nav).
  const [entry] = useState<{ utm: Utm; landingPath: string; referrer?: string }>(() => {
    if (typeof window === "undefined") return { utm: {}, landingPath: "/" }
    return {
      utm: readUtm(new URLSearchParams(window.location.search)),
      landingPath: window.location.pathname,
      referrer: document.referrer || undefined,
    }
  })
  const entryHandled = useRef(false)

  useEffect(() => {
    // 1) Entry touch — once per page load, from the snapshot.
    if (!entryHandled.current) {
      entryHandled.current = true
      if (hasAnyUtm(entry.utm)) {
        markSessionStarted() // an attributed entry IS the session origin
        // Stash for app-bound CTAs so the campaign carries across the origin hop
        // even after the visitor navigates within the marketing site.
        persistUtm(entry.utm)
        void recordTouch(
          { ...entry.utm, referrer: entry.referrer, landingPath: entry.landingPath },
          dedupeKey("entry", entry.landingPath, entry.utm),
        )
        return
      }
      // No UTMs on entry → fall through to record the session origin below.
    }

    // 2) UTMs picked up on a later in-site navigation.
    const utm = readUtm(searchParams)
    const referrer = typeof document !== "undefined" ? document.referrer || undefined : undefined
    if (hasAnyUtm(utm)) {
      persistUtm(utm)
      void recordTouch({ ...utm, referrer, landingPath: pathname }, dedupeKey("nav", pathname, utm))
      return
    }

    // 3) First landing of the session with no UTMs → record the origin once.
    if (!sessionStarted()) {
      markSessionStarted()
      void recordTouch({ referrer, landingPath: pathname })
    }
  }, [pathname, searchParams, entry])

  // Behavioural page-view tracking, deduped on consecutive identical paths.
  const lastPagePath = useRef<string | null>(null)
  useEffect(() => {
    if (lastPagePath.current === pathname) return
    lastPagePath.current = pathname
    track("$pageview")
  }, [pathname])

  return null
}
