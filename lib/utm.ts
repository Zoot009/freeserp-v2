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
  // Meta (Facebook) ad identifiers, expanded by Meta's dynamic macros in the ad's
  // URL-parameters template. Deliberately NOT folded into utm_* — those slots hold
  // human-readable names and drive Campaign.slug matching in the admin, while
  // these are the numeric join key to the imported ad-delivery rows.
  metaCampaignId?: string
  metaAdsetId?: string
  metaAdId?: string
  metaPlacement?: string
  metaSiteSource?: string
  // Meta's own click id, appended automatically to ad clicks. Not a join key (the
  // Marketing API never exposes it) — it exists so we can measure how much Meta
  // traffic arrived with unusable ad ids.
  fbclid?: string
}

// UTM query-param name → our camelCase field.
const UTM_KEYS: Array<[string, keyof Utm]> = [
  ["utm_source", "utmSource"],
  ["utm_medium", "utmMedium"],
  ["utm_campaign", "utmCampaign"],
  ["utm_content", "utmContent"],
  ["utm_term", "utmTerm"],
]

// Meta params, kept in their own table so the five standard slots stay untouched.
//
// Each field lists the query-param ALIASES we accept, most specific first. Ad URL
// templates in the wild use the bare Meta names (ad_id, adset_id, campaign_id,
// placement) — that's what Meta's own docs suggest — so we detect those without
// anyone having to rewrite live ads. The fs_meta_* forms are our canonical
// spelling: unambiguous, collision-proof against a genuine ?campaign_id= elsewhere
// on the site, and what utmToParams emits when forwarding to the app.
//
// `pattern` rejects values that could never join: Meta does not always expand its
// macros (boosted-post organic reach, some dynamic-creative formats), so a literal
// "{{ad.id}}" genuinely arrives in the wild. Storing it would silently poison every
// per-ad rollup, so we drop it and let the row count as unattributed instead.
// A failed pattern falls through to the NEXT alias rather than giving up, so
// ?fs_meta_ad_id={{ad.id}}&ad_id=120210987654321 still resolves to the real id.
const META_ID_RE = /^\d{1,25}$/
const FBCLID_RE = /^[A-Za-z0-9_.-]{1,255}$/
const META_KEYS: Array<[readonly string[], keyof Utm, RegExp | null]> = [
  [["fs_meta_campaign_id", "campaign_id"], "metaCampaignId", META_ID_RE],
  [["fs_meta_adset_id", "adset_id"], "metaAdsetId", META_ID_RE],
  [["fs_meta_ad_id", "ad_id"], "metaAdId", META_ID_RE],
  // Free-form Meta labels (e.g. "Facebook_Mobile_Feed", "fb") — bounded, not matched.
  [["fs_meta_placement", "placement"], "metaPlacement", null],
  [["fs_meta_source", "site_source_name"], "metaSiteSource", null],
  [["fbclid"], "fbclid", FBCLID_RE],
]

// The spelling we EMIT when forwarding to app.freeserp.com — always canonical,
// regardless of which alias the ad link arrived with.
const META_CANONICAL: Record<string, string> = {
  metaCampaignId: "fs_meta_campaign_id",
  metaAdsetId: "fs_meta_adset_id",
  metaAdId: "fs_meta_ad_id",
  metaPlacement: "fs_meta_placement",
  metaSiteSource: "fs_meta_source",
  fbclid: "fbclid",
}

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

// Read-only: true if the visitor cookie already existed, without creating one.
// Callers must read this via a lazy useState initializer (evaluated at render time),
// not inside a useEffect — UtmCapture (mounted globally) may create the cookie in its
// own effect during the same commit, and React runs all render-phase code before any
// passive effect fires, so a render-time read is the only reliable way to distinguish
// "cookie already existed" from "cookie just got created this load".
export function hasExistingVisitorId(): boolean {
  return readVisitorCookie() !== null
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

// Pull the five standard UTM params plus the Meta ad params, keeping only
// present, non-empty keys. Meta values that fail their format check are dropped
// rather than stored (see META_KEYS) — an unexpanded macro must not become a
// join key that can never match.
export function readUtm(params: URLSearchParams): Utm {
  const utm: Utm = {}
  for (const [param, field] of UTM_KEYS) {
    const v = params.get(param)?.trim()
    if (v) utm[field] = v
  }
  for (const [aliases, field, pattern] of META_KEYS) {
    for (const param of aliases) {
      const v = params.get(param)?.trim()
      if (!v) continue
      if (pattern && !pattern.test(v)) continue // unusable — try the next alias
      utm[field] = pattern ? v : v.slice(0, 200)
      break
    }
  }
  return utm
}

export function hasAnyUtm(utm: Utm): boolean {
  return Object.keys(utm).length > 0
}

// Serialize a Utm map back to query params, keeping only present keys. The Meta
// params ride along to app.freeserp.com so the app-side capture records a touch
// carrying the ad id too — that way the signup→ad join survives even if the
// anonymous visitorId → userId back-fill misses (cleared cookies, ITP expiry).
export function utmToParams(utm: Utm): URLSearchParams {
  const params = new URLSearchParams()
  for (const [param, field] of UTM_KEYS) {
    const v = utm[field]
    if (v) params.set(param, v)
  }
  for (const [, field] of META_KEYS) {
    const v = utm[field]
    if (v) params.set(META_CANONICAL[field], v)
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
