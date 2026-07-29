// Session-replay recorder (rrweb) for the marketing site. Mirrors the app's
// lib/replay.ts, keyed by the shared *.freeserp.com visitorId (lib/utm.ts) and the
// same per-tab sessionId as lib/analytics.ts, so a recorded session lines up with
// that visitor's row in the admin Overview table. Recording starts on page load,
// matching the site's existing consent-free analytics posture — form fields are
// masked at capture time (maskAllInputs below), which is the only PII control here.
"use client"

import type { eventWithTime } from "rrweb"
import { getVisitorId } from "@/lib/utm"
import { getSessionId } from "@/lib/analytics"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || ""
const FLUSH_INTERVAL_MS = 15000
const MAX_BUFFER_SIZE = 300
const RETRY_DELAY_MS = 1000

let stopRecordingFn: (() => void) | null = null
let flushTimer: ReturnType<typeof setInterval> | null = null
let retryTimer: ReturnType<typeof setTimeout> | null = null
const buffer: eventWithTime[] = []
let initialized = false

function send(useBeacon: boolean) {
  if (!BACKEND_URL || buffer.length === 0) return
  const url = `${BACKEND_URL}/api/events/replay`
  const events = buffer.splice(0, buffer.length)
  const body = JSON.stringify({ visitorId: getVisitorId(), sessionId: getSessionId(), source: "marketing", events })

  if (useBeacon && typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    if (navigator.sendBeacon(url, new Blob([body], { type: "application/json" }))) return
  }
  // `keepalive` caps the request body at ~64 KiB in most browsers — same limit
  // sendBeacon has. The FullSnapshot chunk is routinely several hundred KB, so only
  // the actual page-hide path (useBeacon) sets keepalive; the periodic flush must not.
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: useBeacon,
    credentials: "include",
  })
    .then(() => {})
    .catch(() => {
      buffer.unshift(...events)
      if (!retryTimer) {
        retryTimer = setTimeout(() => {
          retryTimer = null
          send(false)
        }, RETRY_DELAY_MS)
      }
    })
}

async function startRecording() {
  if (stopRecordingFn || !BACKEND_URL) return // already running / not configured
  const { record, EventType } = await import("rrweb") // dynamic import: keep rrweb out of the initial bundle

  stopRecordingFn =
    record({
      emit: (event) => {
        buffer.push(event as eventWithTime)
        if (event.type === EventType.FullSnapshot) send(false)
        else if (buffer.length >= MAX_BUFFER_SIZE) send(false)
      },
      // Blanks every form field's recorded value — any input could be PII.
      maskAllInputs: true,
      sampling: { scroll: 200, mousemoveCallback: 400 },
    }) ?? null

  if (!flushTimer) flushTimer = setInterval(() => send(false), FLUSH_INTERVAL_MS)
}

export function initSessionReplay(): void {
  if (typeof window === "undefined" || initialized) return
  initialized = true

  void startRecording()

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") send(true)
  })
  window.addEventListener("pagehide", () => send(true))
}
