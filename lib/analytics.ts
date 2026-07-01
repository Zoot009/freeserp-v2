// First-party behavioural event tracking for the marketing site. Mirrors the app's
// lib/analytics.ts: batches events and POSTs them to our own backend (/api/events),
// keyed by the shared *.freeserp.com visitor id (lib/utm.ts) so the marketing-side
// journey stitches to the same visitor in the app. Unconditional — the marketing
// site has no consent banner (matches its GA/GTM posture).

import { getVisitorId } from "@/lib/utm"

const SESSION_ID_KEY = "fs_session_id"
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || ""
const BATCH_SIZE = 10
const FLUSH_DELAY_MS = 2000

interface QueuedEvent {
  name: string
  path?: string
  referrer?: string
  properties?: Record<string, unknown>
}

let queue: QueuedEvent[] = []
let flushTimer: ReturnType<typeof setTimeout> | null = null

function getSessionId(): string {
  if (typeof window === "undefined") return ""
  try {
    let id = sessionStorage.getItem(SESSION_ID_KEY)
    if (!id) {
      id = crypto.randomUUID()
      sessionStorage.setItem(SESSION_ID_KEY, id)
    }
    return id
  } catch {
    return ""
  }
}

function send(body: string, useBeacon: boolean) {
  if (!BACKEND_URL) return
  const url = `${BACKEND_URL}/api/events`
  if (useBeacon && typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    try {
      navigator.sendBeacon(url, new Blob([body], { type: "application/json" }))
      return
    } catch {
      /* fall through to fetch */
    }
  }
  void fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
    credentials: "include",
  }).catch(() => {})
}

export function flush(useBeacon = false): void {
  if (flushTimer) {
    clearTimeout(flushTimer)
    flushTimer = null
  }
  if (queue.length === 0) return
  const events = queue
  queue = []
  send(JSON.stringify({ visitorId: getVisitorId(), sessionId: getSessionId(), source: "marketing", events }), useBeacon)
}

export function track(name: string, properties?: Record<string, unknown>): void {
  if (typeof window === "undefined" || !BACKEND_URL) return
  const referrer = typeof document !== "undefined" ? document.referrer || undefined : undefined
  queue.push({ name, path: window.location.pathname, referrer, properties })
  if (queue.length >= BATCH_SIZE) {
    flush()
    return
  }
  if (!flushTimer) flushTimer = setTimeout(() => flush(), FLUSH_DELAY_MS)
}

if (typeof window !== "undefined") {
  window.addEventListener("pagehide", () => flush(true))
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush(true)
  })
}
