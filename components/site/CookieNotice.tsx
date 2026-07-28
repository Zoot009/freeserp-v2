"use client"

import { useSyncExternalStore } from "react"
import Link from "next/link"

// Site-wide cookies / usage-data notice.
//
// This is a NOTICE, not a gate. Dismissing it records an acknowledgement and
// nothing else — analytics (lib/analytics.ts) and session replay (lib/replay.ts)
// both run from page load regardless of what the visitor does here, which is the
// site's long-standing consent-free posture. Do not wire anything to this flag
// expecting it to mean "the visitor opted in"; it only means "the visitor has
// seen this once". If replay ever needs to be genuinely opt-in, the gate belongs
// in lib/replay.ts, not here.
const ACK_KEY = "cookie-notice"

// Dismissal is held in a module-level store rather than component state because
// localStorage is external to React: useSyncExternalStore is what lets the root
// layout server-render (getServerSnapshot ⇒ hidden) and then settle to the real
// value after hydration, with no setState-in-effect and no hydration mismatch.
const listeners = new Set<() => void>()
// Mirrors the write below so a dismissal still sticks for the rest of the visit
// even when the localStorage write throws.
let dismissed = false

function subscribe(onChange: () => void) {
  listeners.add(onChange)
  return () => {
    listeners.delete(onChange)
  }
}

function shouldShow(): boolean {
  if (dismissed) return false
  try {
    return window.localStorage.getItem(ACK_KEY) == null
  } catch {
    // Storage blocked (Safari private mode, hardened profiles). Staying hidden is
    // the better failure: the alternative shows an undismissable bar on every
    // page load, since the dismissal could never persist either.
    return false
  }
}

// The server has no storage to read, and rendering the bar into the HTML would
// flash it at visitors who dismissed it long ago.
function neverOnServer(): boolean {
  return false
}

export function CookieNotice() {
  const visible = useSyncExternalStore(subscribe, shouldShow, neverOnServer)

  if (!visible) return null

  const dismiss = () => {
    dismissed = true
    try {
      window.localStorage.setItem(ACK_KEY, "1")
    } catch {
      /* in-memory flag above still hides it for this visit */
    }
    listeners.forEach((l) => l())
  }

  return (
    <div
      // region, not dialog: it interrupts nothing and traps no focus, so
      // announcing it as a dialog would misrepresent it to a screen reader.
      role="region"
      aria-label="Cookies and usage data"
      className="fixed inset-x-0 bottom-0 z-[110] border-t border-black/10 bg-white shadow-[0_-8px_30px_-15px_rgba(11,16,32,0.25)]"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-start justify-between gap-3 px-4 py-4 sm:flex-row sm:items-center sm:px-6">
        <p className="text-sm leading-relaxed text-black/70">
          We use cookies and similar technologies to understand how visitors use FreeSERP and to
          improve it. Anything you type into a form is never captured.{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-black">
            Privacy policy
          </Link>
        </p>
        <button
          onClick={dismiss}
          className="shrink-0 bg-black px-5 py-2 text-xs tracking-widest text-white uppercase transition-colors hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          Accept
        </button>
      </div>
    </div>
  )
}
