"use client"

import { BACKEND_URL } from "@/components/site/constants"

// "Is this a real, resolvable website?" — gates the landing preview so it can't
// be run on gibberish the visitor typed. Backed by POST /api/public/domain-check,
// which does a DNS lookup on the backend (a browser can't resolve DNS itself).
//
// Returns:
//   true  — the domain resolves; open the preview
//   false — it does not resolve; show "we couldn't find that domain"
//
// FAILS OPEN: a network error, a slow backend, or a missing BACKEND_URL all
// resolve to true. A check we cannot run must never block a real visitor from
// the preview — the worst case is a gibberish domain slipping through, which the
// preview already handles (its lookups just come back empty).

const TIMEOUT_MS = 6000

export async function domainExists(domain: string): Promise<boolean> {
  if (typeof window === "undefined" || !BACKEND_URL) return true

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(`${BACKEND_URL}/api/public/domain-check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain }),
      signal: controller.signal,
    })
    if (!res.ok) return true // fail open
    const body = (await res.json()) as { exists?: boolean }
    // Only a definitive false blocks; anything unexpected fails open.
    return body.exists !== false
  } catch {
    return true // fail open
  } finally {
    clearTimeout(timer)
  }
}
