// First-party marketing-attribution capture for the marketing site (freeserp.com).
// Mirrors the app's lib/utm.ts: every touch is POSTed to our own backend
// (/api/attribution/touch) and stored in Postgres — no GTM/third party. The visitor
// id lives in a cookie shared across *.freeserp.com so the journey started here
// stitches to the same visitor once they cross over to the app (app.freeserp.com).

const VISITOR_ID_KEY = "fs_visitor_id"
const TOUCH_DEDUPE_PREFIX = "fs_touch_"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || ""

export interface Utm {
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  utmTerm?: string
}

// UTM query-param name → our camelCase field.
const UTM_KEYS: Array<[string, keyof Utm]> = [
  ["utm_source", "utmSource"],
  ["utm_medium", "utmMedium"],
  ["utm_campaign", "utmCampaign"],
  ["utm_content", "utmContent"],
  ["utm_term", "utmTerm"],
]

// Cookie attributes for the shared visitor id. Scoped to ".freeserp.com" in prod so
// the marketing site and the app (app.freeserp.com) read the SAME id; on localhost/IP
// we omit the domain → host-only, still shared across ports (cookies ignore port).
function visitorCookieAttrs(): string {
  const https = typeof location !== "undefined" && location.protocol === "https:"
  const host = typeof location !== "undefined" ? location.hostname : ""
  const domain = host.endsWith("freeserp.com") ? "; domain=.freeserp.com" : ""
  return `; path=/; max-age=31536000; SameSite=Lax${https ? "; Secure" : ""}${domain}`
}

function readVisitorCookie(): string | null {
  if (typeof document === "undefined") return null
  const m = document.cookie.match(/(?:^|;\s*)fs_visitor_id=([^;]+)/)
  return m ? decodeURIComponent(m[1]) : null
}

// Read (or lazily create) the anonymous, first-party visitor id (shared cookie).
// Migrates any pre-existing localStorage id; falls back to an ephemeral id when
// both cookies and storage are unavailable so a touch can still fire.
export function getVisitorId(): string {
  if (typeof window === "undefined") return ""
  const fromCookie = readVisitorCookie()
  if (fromCookie) return fromCookie

  let id: string | null = null
  try {
    id = localStorage.getItem(VISITOR_ID_KEY)
  } catch {
    /* localStorage unavailable */
  }
  if (!id) id = crypto.randomUUID()

  try {
    document.cookie = `${VISITOR_ID_KEY}=${encodeURIComponent(id)}${visitorCookieAttrs()}`
  } catch {
    /* ignore */
  }
  try {
    localStorage.setItem(VISITOR_ID_KEY, id)
  } catch {
    /* ignore */
  }
  return id
}

// Pull the five standard UTM params, keeping only present, non-empty keys.
export function readUtm(params: URLSearchParams): Utm {
  const utm: Utm = {}
  for (const [param, field] of UTM_KEYS) {
    const v = params.get(param)?.trim()
    if (v) utm[field] = v
  }
  return utm
}

export function hasAnyUtm(utm: Utm): boolean {
  return Object.keys(utm).length > 0
}

// Serialize a Utm map back to utm_* query params, keeping only present keys.
export function utmToParams(utm: Utm): URLSearchParams {
  const params = new URLSearchParams()
  for (const [param, field] of UTM_KEYS) {
    const v = utm[field]
    if (v) params.set(param, v)
  }
  return params
}

const UTM_SESSION_KEY = "fs_utm"

// Persist the campaign-bearing UTMs for this browser session so app-bound CTAs can
// carry them even after the visitor navigates within the marketing site (which
// drops the original query string). Only writes when at least one UTM is present,
// so a later un-tagged pageview never clobbers the campaign.
export function persistUtm(utm: Utm): void {
  if (typeof window === "undefined" || !hasAnyUtm(utm)) return
  try {
    sessionStorage.setItem(UTM_SESSION_KEY, JSON.stringify(utm))
  } catch {
    /* sessionStorage unavailable — best-effort */
  }
}

export function readPersistedUtm(): Utm {
  if (typeof window === "undefined") return {}
  try {
    const raw = sessionStorage.getItem(UTM_SESSION_KEY)
    return raw ? (JSON.parse(raw) as Utm) : {}
  } catch {
    return {}
  }
}

// Fire-and-forget a single touch to the backend (cross-origin — uses fetch with
// credentials so an existing session cookie, if any, is attributed). `dedupeKey`
// guards against duplicate inserts within the same tab session. Never throws —
// attribution is non-critical, so network/4xx failures are swallowed.
export async function recordTouch(
  payload: Utm & { referrer?: string; landingPath?: string },
  dedupeKey?: string,
): Promise<void> {
  if (typeof window === "undefined" || !BACKEND_URL) return
  const sessionKey = dedupeKey ? `${TOUCH_DEDUPE_PREFIX}${dedupeKey}` : undefined
  try {
    if (sessionKey && sessionStorage.getItem(sessionKey)) return
  } catch {
    // sessionStorage unavailable — fall through and record (best-effort).
  }
  try {
    await fetch(`${BACKEND_URL}/api/attribution/touch`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId: getVisitorId(), ...payload }),
      keepalive: true,
    })
    if (sessionKey) {
      try {
        sessionStorage.setItem(sessionKey, "1")
      } catch {
        /* ignore */
      }
    }
  } catch {
    /* attribution is non-critical — swallow */
  }
}
