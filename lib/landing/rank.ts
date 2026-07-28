"use client"

import { BACKEND_URL } from "@/components/site/constants"

// One REAL rank for the landing page's dashboard preview.
//
// The preview's first table row tracks the visitor's own domain as the keyword
// — a navigational query for their own site, which is the one search we can
// measure without guessing at their intent. The remaining rows stay sample
// data, because the preview invents those keywords.
//
// Backed by POST /api/public/rank, which fetches Google through Scrape.do.
// Unlike the page-score audit this is synchronous: measured ~2s for an uncached
// domain, ~60ms cached, so there is nothing to poll.
//
// Never throws. Any failure — Scrape.do disabled, blocked, quota reached,
// visitor offline — resolves to null and the preview keeps its sample row.

export type RealRank = {
  keyword: string
  /** null means "not found in the top 20", which the table shows as 100+. */
  position: number | null
  /** The actual ranking URL Google returned, so the row can show it truthfully. */
  url: string | null
  /** Monthly search volume, or null when it could not be measured. */
  volume: number | null
  /** Domains ranking alongside them on this keyword, from the same SERP. */
  competitors: { domain: string; position: number }[]
}

type ApiResponse =
  | {
      status: "ready"
      keyword: string
      position: number | null
      url: string | null
      volume: number | null
      competitors: { domain: string; position: number }[]
      cached: boolean
    }
  | { status: "unavailable" }

// A deep search reaches all ten pages when the domain isn't in the top 20, and
// Scrape.do's residential fetches are slow — a full ten-page lookup measured
// ~30s. The request is held open for that whole time, so this must outlast it,
// or a genuinely deep rank would be aborted and thrown away right before it
// arrived. A top-20 result still returns in ~3s; only the deep case waits.
const REQUEST_TIMEOUT_MS = 40_000

export async function fetchRealRank(
  domain: string,
  location: string | null,
  external?: AbortSignal,
): Promise<RealRank | null> {
  if (typeof window === "undefined" || !BACKEND_URL) return null

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  // Fold the caller's abort (preview closed) into ours.
  const onAbort = () => controller.abort()
  external?.addEventListener("abort", onAbort)

  try {
    const res = await fetch(`${BACKEND_URL}/api/public/rank`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain, ...(location ? { location } : null) }),
      signal: controller.signal,
    })
    if (!res.ok) return null
    const body = (await res.json()) as ApiResponse
    if (body.status !== "ready") return null
    return {
      keyword: body.keyword,
      position: body.position,
      url: body.url ?? null,
      volume: body.volume ?? null,
      competitors: body.competitors ?? [],
    }
  } catch {
    return null
  } finally {
    clearTimeout(timer)
    external?.removeEventListener("abort", onAbort)
  }
}
