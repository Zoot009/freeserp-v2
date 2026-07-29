"use client"

import { useEffect } from "react"
import { initSessionReplay } from "@/lib/replay"

// Mounts the rrweb session-replay recorder once, globally. Renders nothing —
// recording begins as soon as this mounts, with no consent prompt.
export function SessionReplay() {
  useEffect(() => {
    initSessionReplay()
  }, [])

  return null
}
