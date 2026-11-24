// Pulls the numbers a case study page shows out of its reports and saves them to
// app/team-b4ada0c0962365f0cd6a669c/agency/snapshots.json, so the page keeps working after
// a share link expires. Re-run after adding a client or when the reports change:
//   node scripts/case-study-snapshot.mjs            (every client)
//   node scripts/case-study-snapshot.mjs ci-siamo   (one client)
import { readFileSync, writeFileSync } from "node:fs"
import { AGENCIES } from "../app/team-b4ada0c0962365f0cd6a669c/agency/case-studies.ts"

const OUT = new URL("../app/team-b4ada0c0962365f0cd6a669c/agency/snapshots.json", import.meta.url)
const only = process.argv[2]
const num = (v) => (v == null || v === "" ? null : Number(v))

async function get(url, as = "text") {
  const res = await fetch(url, { redirect: "follow" })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res[as]()
}

// localrankreports.com renders its report data into the Next.js flight payload; pull the
// `{"data":{"arp":...}}` object out of it.
// ponytail: scrapes their page markup; ask them for a JSON endpoint if this ever breaks.
async function rankReport(url) {
  const html = await get(url)
  const flight = [...html.matchAll(/self\.__next_f\.push\(\[1,"((?:[^"\\]|\\.)*)"\]\)/g)]
    .map((m) => JSON.parse(`"${m[1]}"`))
    .join("")
  const start = flight.indexOf('{"data":{"arp"')
  if (start < 0) throw new Error(`no report data in ${url}`)
  let depth = 0, inStr = false, end = start
  for (let i = start; i < flight.length; i++) {
    const c = flight[i]
    if (inStr) { if (c === "\\") i++; else if (c === '"') inStr = false; continue }
    if (c === '"') inStr = true
    else if (c === "{") depth++
    else if (c === "}" && --depth === 0) { end = i; break }
  }
  const d = JSON.parse(flight.slice(start, end + 1)).data
  const size = d.gridSize
  const grid = Array.from({ length: size * size }, (_, i) => num(d.customMapRanks?.[i]))
  const all = d.competitors.map((c, i) => ({
    rank: i + 1,
    name: c.name,
    rating: c.rating ?? null,
    reviews: c.totalReviews ?? null,
    arp: num(d.competitorMetrics?.[i]?.arp),
    solv: num(d.competitorMetrics?.[i]?.solv),
    you: Boolean(c.isCurrentBusiness),
  }))
  // Top 6, plus the client's own row when it ranks below that.
  const competitors = all.filter((c, i) => i < 6 || c.you)
  // The page shows "N mile radius", so gridRadius is in miles.
  const center = { lat: d.businessInfo.lat, lng: d.businessInfo.lng }
  return { keyword: d.keyword, position: d.clientPosition, arp: d.arp, solv: d.solv, size, grid, center, radiusMiles: d.gridRadius, competitors }
}

async function growthReport(shareUrl) {
  const u = new URL(shareUrl)
  const token = u.pathname.split("/").filter(Boolean).pop()
  const { data } = await get(`${u.origin}/api/public/report-builder/shared/${token}`, "json")
  const g = data.gbp?.report
  const f = data.gbp?.facts
  const rs = g?.reviewStats
  return {
    business: f && {
      category: f.business.category,
      description: f.business.description ?? null,
      phone: f.business.phone ?? null,
      rating: f.business.rating ?? null,
      reviews: data.maps?.location?.reviewCount ?? null,
      image: f.business.mainImage ?? null,
      mapsUrl: f.business.mapsUrl ?? null,
    },
    audit: g && {
      gbpScore: g.score,
      siteScore: data.site?.report?.overallScore ?? null,
      sitePages: data.site?.report?.totals?.pages ?? null,
      siteIssues: data.site?.report?.totals?.issues ?? null,
      pageSpeed: f.website?.psi?.score ?? null,
      aeo: data.aeo?.breakdown?.aeo ?? null,
      geo: data.aeo?.breakdown?.geo ?? null,
      engines: (data.aeo?.breakdown?.engines ?? []).map((e) => ({ name: e.name, score: e.score })),
      categories: g.categories.map((c) => ({ label: c.label, score: c.score })),
      issues: g.findings.filter((x) => x.status !== "pass").slice(0, 8).map((x) => ({ label: x.label, value: x.value, status: x.status })),
      strengths: g.strengths.slice(0, 6).map((x) => ({ label: x.label, value: x.value })),
    },
    reviews: rs && {
      last30: rs.last30?.count ?? null,
      negativeShare: rs.negativeShare ?? null,
      latest: f.reviews.items
        .filter((r) => r.rating === 5 && r.text && r.text.length > 60)
        .slice(0, 3)
        .map((r) => ({ author: r.author, text: r.text, date: r.publishedAt ?? null, localGuide: Boolean(r.localGuide) })),
    },
  }
}

const snapshots = JSON.parse(readFileSync(OUT, "utf8").trim() || "{}")
for (const [agency, a] of Object.entries(AGENCIES)) {
  for (const [client, s] of Object.entries(a.clients)) {
    if (only && only !== client) continue
    const key = `${agency}/${client}`
    const snap = { fetchedAt: new Date().toISOString() }
    try {
      if (s.rankReports) {
        snap.rank = { before: await rankReport(s.rankReports.before), after: await rankReport(s.rankReports.after) }
      }
      if (s.growthReportUrl) Object.assign(snap, await growthReport(s.growthReportUrl))
      snapshots[key] = snap
      console.log(`ok   ${key}`)
    } catch (err) {
      // Keep the last good snapshot rather than blanking the page.
      console.error(`FAIL ${key}: ${err.message}`)
      process.exitCode = 1
    }
  }
}
writeFileSync(OUT, JSON.stringify(snapshots, null, 2) + "\n")
