"use client"

// Consent flag scoped ONLY to session-replay recording on the marketing site — kept
// separate from the site's existing (consent-free) analytics/GTM posture so adding
// replay doesn't change how the rest of the site's tracking behaves.
const CONSENT_KEY = "replay-consent"
export const REPLAY_CONSENT_EVENT = "replay-consent-change"

export type ReplayConsent = "granted" | "denied"

export function getReplayConsent(): ReplayConsent | null {
  if (typeof window === "undefined") return null
  try {
    const value = window.localStorage.getItem(CONSENT_KEY)
    return value === "granted" || value === "denied" ? value : null
  } catch {
    return null
  }
}

export function setReplayConsent(value: ReplayConsent): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(CONSENT_KEY, value)
  } catch {
    /* consent just won't persist across reloads */
  }
  window.dispatchEvent(new Event(REPLAY_CONSENT_EVENT))
}
