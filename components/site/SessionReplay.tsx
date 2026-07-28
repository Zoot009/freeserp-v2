"use client"

import { useEffect } from "react"
import { initSessionReplay } from "@/lib/replay"

// Mounts the rrweb session-replay recorder once, globally. Renders nothing —
// initSessionReplay itself gates on the replay-consent banner's choice.
export function SessionReplay() {
  useEffect(() => {
    initSessionReplay()
  }, [])

  return null
}
