// Live aggregate product stats for the landing pages' urgency/momentum copy.
// Same direct-to-backend, never-throws pattern as lib/landing/geo.ts.

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || ""
const CACHE_KEY = "fs_public_stats"
const CACHE_TTL_MS = 5 * 60 * 1000

export type PublicStats = {
  keywords: number
  projects: number
  checks: number
  checksLast24h: number
}

type CacheEntry = { stats: PublicStats; fetchedAt: number }

export async function getPublicStats(): Promise<PublicStats | null> {
  if (typeof window === "undefined" || !BACKEND_URL) return null

  try {
    const cached = sessionStorage.getItem(CACHE_KEY)
    if (cached) {
      const entry = JSON.parse(cached) as CacheEntry
      if (Date.now() - entry.fetchedAt < CACHE_TTL_MS) return entry.stats
    }
  } catch {
    /* sessionStorage unavailable/corrupt — fall through and fetch */
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/stats/public`)
    if (!res.ok) return null
    const stats = (await res.json()) as PublicStats
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ stats, fetchedAt: Date.now() } satisfies CacheEntry))
    } catch {
      /* ignore */
    }
    return stats
  } catch {
    return null
  }
}
