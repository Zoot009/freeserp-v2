"use client"

import { useEffect, useState } from "react"
import { getReplayConsent, setReplayConsent } from "@/lib/replay-consent"

// One-time opt-in banner for session-replay recording. Independent of the site's
// existing (consent-free) analytics — only rrweb recording is gated on this.
export function ReplayConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(getReplayConsent() === null)
  }, [])

  if (!visible) return null

  const choose = (value: "granted" | "denied") => {
    setReplayConsent(value)
    setVisible(false)
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] border-t border-black/10 bg-white shadow-xl">
      <div className="mx-auto flex max-w-3xl flex-col items-start justify-between gap-3 px-4 py-4 sm:flex-row sm:items-center sm:px-6">
        <p className="text-sm text-black/70">
          We record anonymized session replays to improve this page. Form fields are always masked.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => choose("denied")}
            className="border border-black/15 px-4 py-2 text-xs uppercase tracking-widest text-black/70 transition-colors hover:bg-black/5"
          >
            No thanks
          </button>
          <button
            onClick={() => choose("granted")}
            className="bg-black px-4 py-2 text-xs uppercase tracking-widest text-white transition-colors hover:bg-black/80"
          >
            Allow
          </button>
        </div>
      </div>
    </div>
  )
}
