"use client"

import { useCallback, useEffect, useState } from "react"
import { appUrlWithUtm } from "@/components/site/constants"
import { readPersistedUtm, readUtm, type Utm } from "@/lib/utm"

/**
 * Returns a builder that turns an app path (e.g. "/signup") into an absolute app
 * URL carrying the visitor's campaign UTMs, so the campaign survives the marketing
 * → app origin hop and lands on the auth-page URL where the app records it.
 *
 * UTMs come from the current query string first, falling back to the UTMs persisted
 * for this session (set by UtmCapture on the tagged entry) — so a CTA clicked
 * several pages deep still carries the campaign.
 *
 * Resolved in an effect from window.location, NOT useSearchParams: the UTMs live in
 * the URL and sessionStorage (both client-only), and this keeps every page that
 * renders a CTA (Nav is global) free of the useSearchParams Suspense/dynamic-render
 * requirement. The href is a real attribute updated after hydration, so it works
 * with middle-click / open-in-new-tab; it just resolves to the campaign-less app
 * URL for the first paint before the effect runs.
 */
export function useAppUrl(): (path: string) => string {
  const [utm, setUtm] = useState<Utm>({})

  useEffect(() => {
    const fromUrl = readUtm(new URLSearchParams(window.location.search))
    setUtm(Object.keys(fromUrl).length ? fromUrl : readPersistedUtm())
  }, [])

  return useCallback((path: string) => appUrlWithUtm(path, utm), [utm])
}
