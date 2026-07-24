"use client"

import { BACKEND_URL } from "@/components/site/constants"

// The one REAL number in the landing page's dashboard preview.
//
// Everything else in that preview is illustrative sample data. The Page Score
// is not: it is a genuine audit of the visitor's own homepage, run by our audit
// service via POST /api/public/page-score (unauthenticated, cached per domain
// for 24h, and capped per IP on the backend).
//
// The audit is asynchronous, so the endpoint answers `pending` and we poll.
// Measured completion is a few seconds for an uncached domain and instant for a
// cached one, which fits inside the preview's own loading sequence.
//
// Never throws and never blocks the preview: any failure — API down, no key,
// quota reached, slow audit, visitor offline — resolves to null, and the caller
// falls back to the sample score. A marketing page must not break because an
// upstream audit was unavailable.

export type PageScore = { score: number; grade: string | null }

type ApiResponse =
  | { status: "ready"; score: number; grade: string | null; cached: boolean }
  | { status: "pending" }
  | { status: "unavailable" }

/** Give up well before the visitor would notice us still trying. */
const OVERALL_TIMEOUT_MS = 25_000
const POLL_INTERVAL_MS = 1_500
/** Guards a single request; the audit itself is polled, never awaited inline. */
const REQUEST_TIMEOUT_MS = 8_000

async function ask(domain: string, signal: AbortSignal): Promise<ApiResponse | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/public/page-score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain }),
      signal,
    })
    if (!res.ok) return null
    return (await res.json()) as ApiResponse
  } catch {
    return null
  }
}

/**
 * Resolve the real Page Score for a domain, or null if it can't be had in time.
 *
 * @param onCancelled optional abort signal from the caller (e.g. the visitor
 *        closed the preview), so we stop polling a result nobody will see.
 */
export async function fetchPageScore(domain: string, external?: AbortSignal): Promise<PageScore | null> {
  if (typeof window === "undefined" || !BACKEND_URL) return null

  const deadline = Date.now() + OVERALL_TIMEOUT_MS

  while (Date.now() < deadline) {
    if (external?.aborted) return null

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
    const body = await ask(domain, controller.signal)
    clearTimeout(timer)

    if (!body) return null
    if (body.status === "ready") return { score: body.score, grade: body.grade }
    if (body.status === "unavailable") return null

    // pending — wait, then poll again.
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS))
  }
  return null
}
