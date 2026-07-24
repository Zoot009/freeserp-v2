// Fake dashboard data for the landing-page preview.
//
// Every value here is FABRICATED and computed offline. Nothing in this module
// touches the backend, DataForSEO, Scrape.do, or the visitor's quota — the
// preview exists to show what the dashboard *looks* like, so it must never
// spend a SERP credit. The UI that renders this labels it as sample data.
//
// Values are derived deterministically from the domain (see `hash`), not from
// Math.random(), for three reasons:
//   - the same visitor re-running the preview sees the same numbers, so it reads
//     as a real measurement rather than a slot machine;
//   - two people comparing the same domain see the same thing;
//   - Math.random() during render would break React's expectations.

export type PreviewKeyword = {
  keyword: string
  /** Current rank. `null` renders as the "100+" badge, same as the real table. */
  position: number | null
  volume: number
  url: string | null
  pageScore: number
  keywordScore: number
  /**
   * Places moved since the previous check. Positive = climbed, negative = fell.
   *
   * This is the ONE value left legible in an otherwise blurred row, so the table
   * still communicates something (movement in both directions) without exposing
   * any specific figure.
   */
  delta: number
}

export type PreviewData = {
  /** Cleaned host, e.g. "seoptimer.com" — also the project name. */
  domain: string
  /** First label of the host, e.g. "seoptimer" — used as the brand keyword. */
  brand: string
  keywords: PreviewKeyword[]
  seoScore: number
  keywordsTracked: number
  avgPosition: number
  top3: number
  top10: number
  estTraffic: number
  domainAuthority: number
  backlinks: number
  competitor: string
  competitorAvgPosition: number
}

/**
 * Strip everything that isn't the host: scheme, credentials, www, port, path,
 * query, fragment. Accepts what people actually paste into a domain field
 * ("https://www.site.com/pricing?x=1", "SITE.com ", "site.com/blog").
 *
 * Returns null when there's no plausible host, so callers can keep the CTA
 * disabled rather than previewing garbage.
 */
export function normalizeDomain(raw: string): string | null {
  let s = raw.trim().toLowerCase()
  if (!s) return null

  s = s.replace(/^[a-z][a-z0-9+.-]*:\/\//, "") // scheme
  s = s.replace(/^[^@/]*@/, "") // user:pass@
  s = s.split(/[/?#]/)[0] ?? "" // path / query / fragment
  s = s.split(":")[0] ?? "" // port
  s = s.replace(/^www\./, "")
  s = s.replace(/\.+$/, "") // trailing dots (valid DNS, noise here)

  // A bare label ("seoptimer") isn't a domain; require at least one dot and a
  // TLD of 2+ letters. Allows IDN/punycode hosts and hyphens, rejects spaces.
  if (!/^[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/.test(s)) return null
  return s
}

/** FNV-1a. Small, dependency-free, and well-spread for short strings. */
function hash(s: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/** Deterministic integer in [min, max], varied by `salt` so fields differ. */
function pick(domain: string, salt: string, min: number, max: number): number {
  return min + (hash(`${domain}:${salt}`) % (max - min + 1))
}

/**
 * Build the preview for a domain.
 *
 * Row 1 is the brand keyword (the domain's own name) ranking in the top 3. That
 * is the one row shown unblurred, and it's the one claim that holds up: a site
 * ranking for its own brand name is close to universally true, so the visitor
 * recognises it as correct and reads the blurred rows as equally real.
 *
 * Rows 2-4 are brand-modifier keywords. They stay blurred in the UI, so their
 * exact wording matters far less than their shape.
 */
export function buildPreview(rawDomain: string): PreviewData | null {
  const domain = normalizeDomain(rawDomain)
  if (!domain) return null

  const brand = domain.split(".")[0] ?? domain

  const brandPos = pick(domain, "brandpos", 1, 3)
  const kw2Pos = pick(domain, "kw2", 4, 9)
  const kw3Pos = pick(domain, "kw3", 11, 28)

  const keywords: PreviewKeyword[] = [
    {
      // The brand label — this is the one row whose rank we measure for real
      // (POST /api/public/rank searches the brand as a navigational query), and
      // the backend derives it the same way, so the keyword shown is exactly
      // what was searched. The sample position below is only the fallback for
      // when that lookup is unavailable.
      keyword: brand,
      position: brandPos,
      volume: pick(domain, "brandvol", 12, 74) * 100,
      url: `www.${domain}/`,
      pageScore: pick(domain, "brandps", 71, 92),
      keywordScore: pick(domain, "brandks", 68, 90),
      delta: pick(domain, "d1", 2, 9),
    },
    {
      keyword: `${brand} review`,
      position: kw2Pos,
      volume: pick(domain, "kw2vol", 8, 41) * 100,
      url: `www.${domain}/reviews`,
      pageScore: pick(domain, "kw2ps", 58, 84),
      keywordScore: pick(domain, "kw2ks", 55, 81),
      // Negative on purpose. A table where every row climbs reads as a pitch;
      // mixed movement is what a real week of tracking looks like.
      delta: -pick(domain, "d2", 1, 6),
    },
    {
      keyword: `${brand} pricing`,
      position: kw3Pos,
      volume: pick(domain, "kw3vol", 5, 26) * 100,
      url: `www.${domain}/pricing`,
      pageScore: pick(domain, "kw3ps", 49, 77),
      keywordScore: pick(domain, "kw3ks", 47, 73),
      delta: pick(domain, "d3", 3, 14),
    },
    {
      // Deliberately unranked: a preview where everything ranks reads as a sales
      // pitch. One "100+" row is what makes the set look like a real measurement
      // — and it's the row that implies there's work to do here.
      keyword: `best ${brand} alternative`,
      position: null,
      volume: pick(domain, "kw4vol", 21, 96) * 100,
      url: null,
      pageScore: pick(domain, "kw4ps", 38, 63),
      keywordScore: pick(domain, "kw4ks", 35, 59),
      delta: -pick(domain, "d4", 2, 11),
    },
  ]

  const ranked = keywords.filter((k) => k.position != null) as (PreviewKeyword & { position: number })[]
  const avgPosition = ranked.reduce((sum, k) => sum + k.position, 0) / ranked.length

  return {
    domain,
    brand,
    keywords,
    seoScore: pick(domain, "seo", 62, 88),
    keywordsTracked: keywords.length,
    avgPosition,
    top3: ranked.filter((k) => k.position <= 3).length,
    top10: ranked.filter((k) => k.position <= 10).length,
    estTraffic: pick(domain, "traffic", 11, 94) * 100,
    domainAuthority: pick(domain, "da", 24, 67),
    backlinks: pick(domain, "bl", 12, 480) * 1000,
    competitor: COMPETITOR_POOL[hash(`${domain}:comp`) % COMPETITOR_POOL.length]!,
    competitorAvgPosition: pick(domain, "compavg", 3, 14),
  }
}

// Well-known SEO tools, used only as a plausible-looking competitor chip. Fixed
// list rather than anything derived from the visitor's actual SERP — there is no
// SERP here.
const COMPETITOR_POOL = ["ahrefs.com", "semrush.com", "moz.com", "similarweb.com", "ubersuggest.com"]

/** "2.1K" / "202.8K" / "1.2M" — matches the real dashboard's compact format. */
export function compactNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}
