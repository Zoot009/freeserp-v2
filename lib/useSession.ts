"use client"

import { useEffect, useState } from "react"
import { BACKEND_URL } from "@/components/site/constants"

/**
 * Whether this visitor already has an app session, so CTAs can say "Go to
 * dashboard" instead of "Get started for free".
 *
 * How it works: the backend's requireAuth reads the httpOnly `access_token`
 * cookie before falling back to the Authorization header, so a credentialed
 * request from this origin authenticates on the cookie alone. The marketing site
 * and the app are different origins but the SAME site (freeserp.com /
 * app.freeserp.com; on localhost the port is ignored), so the SameSite cookie is
 * still sent. The backend's ALLOWED_ORIGINS must include this site's origin —
 * same requirement the SERP checker already has.
 *
 * Deliberately NOT /api/auth/refresh: that rotates the refresh token, and racing
 * the app's own refresh trips the "token reuse" guard, which revokes the whole
 * token family and logs the user out. This check is read-only.
 *
 * The answer is cached for the tab session so browsing the marketing site costs
 * one request rather than one per page.
 */

const CACHE_KEY = "fs_session_authed"

type SessionState = { authed: boolean; ready: boolean }

function readCache(): boolean | null {
  try {
    const v = sessionStorage.getItem(CACHE_KEY)
    return v === null ? null : v === "1"
  } catch {
    return null
  }
}

export function useSession(): SessionState {
  // Starts false so the first paint shows the signed-out CTA — the common case
  // for marketing traffic, and it avoids flashing "Go to dashboard" at visitors
  // who don't have an account.
  const [state, setState] = useState<SessionState>({ authed: false, ready: false })

  useEffect(() => {
    const cached = readCache()
    if (cached !== null) {
      setState({ authed: cached, ready: true })
      return
    }

    let cancelled = false
    const controller = new AbortController()
    // Never let a slow/unreachable backend leave the CTA in limbo.
    const timeout = setTimeout(() => controller.abort(), 4000)

    ;(async () => {
      let authed = false
      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
          credentials: "include",
          signal: controller.signal,
          headers: { Accept: "application/json" },
        })
        authed = res.ok
      } catch {
        // Offline, aborted, CORS, backend down — treat as signed out.
      } finally {
        clearTimeout(timeout)
      }
      if (cancelled) return
      try { sessionStorage.setItem(CACHE_KEY, authed ? "1" : "0") } catch {}
      setState({ authed, ready: true })
    })()

    return () => {
      cancelled = true
      clearTimeout(timeout)
      controller.abort()
    }
  }, [])

  return state
}
