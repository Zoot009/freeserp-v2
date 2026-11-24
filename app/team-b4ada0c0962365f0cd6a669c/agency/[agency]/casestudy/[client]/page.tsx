import type { Metadata } from "next"
import type React from "react"
import { notFound } from "next/navigation"
import {
  AlertTriangle, BadgeCheck, Bot, CheckCircle2, ExternalLink, Globe, MapPin, Phone,
  QrCode, Star, TrendingUp, XCircle,
} from "lucide-react"
import { BACKEND_URL } from "@/components/site/constants"
import { CitationList } from "./citations"

type Props = { params: Promise<{ agency: string; client: string }> }

// The backend's snapshot of the reports (freeserp-backend-v2 case-studies/caseStudy.snapshot.ts).
type RankSide = {
  keyword: string; position: number; arp: number; solv: number; size: number; grid: (number | null)[]
  center: { lat: number; lng: number }; radiusMiles: number
  competitors: { rank: number; name: string; rating: number | null; reviews: number | null; arp: number | null; solv: number | null; you: boolean }[]
}
type Snapshot = {
  rank?: { before: RankSide; after: RankSide }
  business?: { category: string; description: string | null; phone: string | null; rating: number | null; reviews: number | null; image: string | null; mapsUrl: string | null }
  audit?: {
    gbpScore: number; siteScore: number | null; sitePages: number | null; siteIssues: number | null; pageSpeed: number | null
    aeo: number | null; geo: number | null; engines: { name: string; score: number }[]
    categories: { label: string; score: number }[]
    issues: { label: string; value: string; status: string }[]
    strengths: { label: string; value: string }[]
  }
  reviews?: { last30: number | null; negativeShare: number | null; latest: { author: string; text: string; date: string | null; localGuide: boolean }[] }
  auditBefore?: Before // from the growth report taken before the work
}
type Before = {
  gbpScore?: number | null; siteScore?: number | null; pageSpeed?: number | null; aeo?: number | null; geo?: number | null
  engines?: { name: string; score: number }[]
}
type Study = {
  name: string; address: string; website: string; agencyName: string
  rankBeforeUrl?: string; rankAfterUrl?: string; growthReportUrl?: string
  citations: string[]; hiddenSites: string[]; ownSites: number; qrUrl?: string; hideQr?: boolean
  beforeScores?: Before // typed in the app; wins over the before growth report
}

// Case studies are managed by the in-house team at app.freeserp.com/dashboard/case-studies.
async function find(agency: string, client: string) {
  const res = await fetch(`${BACKEND_URL}/api/public/case-studies/${encodeURIComponent(agency)}/${encodeURIComponent(client)}`, {
    cache: "no-store", // edits in the app show on the next page load
  })
  if (res.status === 404 || res.status === 400) return null
  if (!res.ok) throw new Error(`Case study ${agency}/${client}: backend returned ${res.status}`)
  const { caseStudy: c } = (await res.json()) as { caseStudy: { name: string; details: Omit<Study, "name">; snapshot: Snapshot | null } }
  const study: Study = { ...c.details, name: c.name }
  const rankReports = study.rankBeforeUrl && study.rankAfterUrl ? { before: study.rankBeforeUrl, after: study.rankAfterUrl } : undefined
  return { agencyName: study.agencyName, study: { ...study, rankReports }, snap: c.snapshot ?? {} }
}

const host = (url: string) => new URL(url).hostname.replace(/^www\./, "")
const fmt = (n: number) => n.toLocaleString("en-US")
const pct = (n: number) => `${Math.round(n)}%`

const ext = { target: "_blank", rel: "noopener noreferrer" } as const
const btn = "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors"
const btnPrimary = `${btn} bg-[#2d5bff] text-white hover:bg-[#1e40d8]`
const btnSecondary = `${btn} border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50`
const card = "rounded-3xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-16px_rgba(15,23,42,0.12)]"
const wrap = "mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10"

// Score colours: green ≥ 80, amber ≥ 50, red below.
const tone = (score: number) =>
  score >= 80 ? { text: "text-emerald-600", bar: "bg-emerald-500", hex: "#10b981" }
  : score >= 50 ? { text: "text-amber-600", bar: "bg-amber-500", hex: "#f59e0b" }
  : { text: "text-rose-600", bar: "bg-rose-500", hex: "#f43f5e" }

// Map-pack rank pin colours: top 3 green, top 10 amber, 11+ (including not in the top 20) red.
const RANK_BANDS = [
  { label: "Top 3", dot: "bg-emerald-600" },
  { label: "4–10", dot: "bg-amber-500" },
  { label: "11+", dot: "bg-rose-600" },
] as const
const pinTone = (rank: number | null) =>
  rank != null && rank <= 3 ? "bg-emerald-600 text-white ring-white"
  : rank != null && rank <= 10 ? "bg-amber-500 text-white ring-white"
  : "bg-rose-600 text-white ring-white"
const top3 = (s: RankSide) => s.grid.filter((r) => r != null && r <= 3).length
const inTop20 = (s: RankSide) => s.grid.filter((r) => r != null).length

// Web Mercator maths so the rank grid sits on real map tiles, all in % so it scales with the card.
// ponytail: public OpenStreetMap tiles (fine for low traffic, attribution shown); use a keyed tile provider if this page gets busy.
const TILE = 256
const MILE = 1609.34
function mercator(lat: number, lng: number, z: number) {
  const n = TILE * 2 ** z
  const sin = Math.sin((lat * Math.PI) / 180)
  return { x: ((lng + 180) / 360) * n, y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * n }
}
function mapView(side: RankSide) {
  const { lat, lng } = side.center
  const cos = Math.cos((lat * Math.PI) / 180)
  const half = side.radiusMiles * MILE * 1.45 // metres from the centre to the map edge, with room around the outer pins
  const z = Math.min(17, Math.floor(Math.log2((156543.03 * cos * 640) / (2 * half))))
  const span = (2 * half) / ((156543.03 * cos) / 2 ** z) // map width in tile pixels
  const c = mercator(lat, lng, z)
  const x0 = c.x - span / 2
  const y0 = c.y - span / 2
  const at = (x: number, y: number) => ({ left: `${((x - x0) / span) * 100}%`, top: `${((y - y0) / span) * 100}%` })

  const tiles = []
  for (let tx = Math.floor(x0 / TILE); tx <= Math.floor((x0 + span) / TILE); tx++) {
    for (let ty = Math.floor(y0 / TILE); ty <= Math.floor((y0 + span) / TILE); ty++) {
      tiles.push({ key: `${tx}/${ty}`, src: `https://tile.openstreetmap.org/${z}/${tx}/${ty}.png`, size: `${(TILE / span) * 100}%`, ...at(tx * TILE, ty * TILE) })
    }
  }
  const mid = (side.size - 1) / 2
  const step = mid > 0 ? (side.radiusMiles * MILE) / mid : 0 // metres between grid points
  const pins = side.grid.map((rank, i) => {
    const row = Math.floor(i / side.size)
    const col = i % side.size
    // Row 0 is the northern edge, column 0 the western edge.
    const p = mercator(lat - ((row - mid) * step) / 111320, lng + ((col - mid) * step) / (111320 * cos), z)
    return { rank, isCenter: row === mid && col === mid, ...at(p.x, p.y) }
  })
  return { tiles, pins }
}

// Shared with clients by link only: never indexed.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { agency, client } = await params
  const found = await find(agency, client)
  return {
    title: found ? `${found.study.name} · Case study` : "Case study",
    robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  }
}

function Section({ eyebrow, title, description, aside, children }: { eyebrow: string; title: string; description?: string; aside?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className={`${card} p-5 sm:p-8`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2d5bff]">{eyebrow}</p>
          <h2 className="mt-1.5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{title}</h2>
          {description && <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-slate-500">{description}</p>}
        </div>
        {aside}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  )
}

function ScoreRing({ score, size = 112, label }: { score: number; size?: number; label?: string }) {
  const t = tone(score)
  return (
    <div
      className="grid shrink-0 place-items-center rounded-full"
      style={{ width: size, height: size, background: `conic-gradient(${t.hex} ${score * 3.6}deg, #e2e8f0 0deg)` }}
      role="img"
      aria-label={`${label ?? "Score"} ${score} out of 100`}
    >
      <div className="grid place-items-center rounded-full bg-white" style={{ width: size - size / 7, height: size - size / 7 }}>
        <span className={`font-bold tabular-nums ${t.text} ${size < 100 ? "text-xl" : "text-3xl"}`}>{score}</span>
      </div>
    </div>
  )
}

function Delta({ d }: { d: number }) {
  const cls = d > 0 ? "bg-emerald-100 text-emerald-700" : d < 0 ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-600"
  return <span className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-bold tabular-nums ${cls}`}>{d > 0 ? `▲ +${d}` : d < 0 ? `▼ ${d}` : "±0"}</span>
}

/** A score card. With a before score: "38 → 51", the change, and before/after bars. */
function ScoreCard({ label, now, before, sub }: { label: string; now: number; before?: number | null; sub?: string }) {
  if (before == null) {
    return (
      <div className="min-w-0 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
        <p className="truncate text-xs font-medium text-slate-600">{label}</p>
        <p className={`mt-1 text-2xl font-bold tabular-nums ${tone(now).text}`}>{now}<span className="text-xs font-medium text-slate-400">/100</span></p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
          <div className={`h-full rounded-full ${tone(now).bar}`} style={{ width: `${now}%` }} />
        </div>
        {sub && <p className="mt-1.5 truncate text-[11px] text-slate-500">{sub}</p>}
      </div>
    )
  }
  return (
    <div className="min-w-0 rounded-xl bg-white p-3 ring-1 ring-slate-200 shadow-sm">
      <p className="text-xs font-semibold leading-tight text-slate-700">{label}</p>
      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
        <p className="flex items-baseline gap-1.5 tabular-nums">
          <span className="text-lg font-semibold text-slate-400">{before}</span>
          <span aria-hidden className="text-slate-300">→</span>
          <span className={`text-3xl font-bold ${tone(now).text}`}>{now}</span>
          <span className="sr-only">{`${label}: ${before} before, ${now} after`}</span>
        </p>
        <Delta d={now - before} />
      </div>
      <div className="mt-2 flex flex-col gap-1">
        {[
          { k: "Before", v: before, bar: "bg-slate-300" },
          { k: "After", v: now, bar: tone(now).bar },
        ].map((b) => (
          <div key={b.k} className="flex items-center gap-2">
            <span className="w-12 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-slate-400">{b.k}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
              <div className={`h-full rounded-full ${b.bar}`} style={{ width: `${b.v}%` }} />
            </div>
          </div>
        ))}
      </div>
      {sub && <p className="mt-1.5 truncate text-[11px] text-slate-500">{sub}</p>}
    </div>
  )
}

function RankMap({ side, label, href, good }: { side: RankSide; label: string; href?: string; good?: boolean }) {
  const { tiles, pins } = mapView(side)
  const n = side.grid.length
  return (
    <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <figcaption className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${good ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{label}</span>
          <span className="text-sm text-slate-600">
            <b className={`text-base tabular-nums ${good ? "text-emerald-700" : "text-slate-900"}`}>#{side.position}</b> in the map pack
          </span>
        </div>
        {href && (
          <a href={href} {...ext} className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[#2d5bff] hover:underline">
            Full report <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        )}
      </figcaption>
      <div className="relative aspect-square overflow-hidden bg-slate-100" role="img" aria-label={`${label}: map-pack rank for “${side.keyword}” at ${n} search locations`}>
        {tiles.map((t) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={t.key} src={t.src} alt="" className="absolute max-w-none select-none grayscale contrast-75 brightness-125" style={{ left: t.left, top: t.top, width: `calc(${t.size} + 1px)`, height: `calc(${t.size} + 1px)` }} />
        ))}
        {pins.map((p, i) => (
          <span
            key={i}
            className={`absolute grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-[13px] font-bold tabular-nums shadow-[0_2px_8px_rgba(15,23,42,0.35)] ring-2 ${pinTone(p.rank)} ${p.isCenter ? "outline-2 outline-offset-2 outline-[#2d5bff]" : ""}`}
            style={{ left: p.left, top: p.top }}
          >
            {p.rank ?? <span className="text-[11px]">+20</span>}
          </span>
        ))}
        <span className="absolute bottom-1 right-1.5 rounded bg-white/85 px-1 text-[9px] text-slate-500">© OpenStreetMap contributors</span>
      </div>
      <dl className="grid grid-cols-3 divide-x divide-slate-200 border-t border-slate-200 text-center">
        {[
          ["Avg. rank", side.arp.toFixed(1)],
          ["Share of voice", pct(side.solv)],
          ["Top 3 spots", `${top3(side)}/${n}`],
        ].map(([k, v]) => (
          <div key={k} className="px-2 py-3">
            <dt className="text-[11px] text-slate-500">{k}</dt>
            <dd className="mt-0.5 text-lg font-bold tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>
    </figure>
  )
}

function RankComparison({ b, a }: { b: RankSide; a: RankSide }) {
  const n = a.grid.length
  const rows = [
    { metric: "Map-pack position", before: `#${b.position}`, after: `#${a.position}`, change: b.position - a.position, unit: "places" },
    { metric: "Average rank across the area", before: b.arp.toFixed(1), after: a.arp.toFixed(1), change: Math.round((b.arp - a.arp) * 10) / 10, unit: "" },
    { metric: "Share of local voice", before: pct(b.solv), after: pct(a.solv), change: Math.round(a.solv - b.solv), unit: "pts" },
    { metric: "Search locations in the top 3", before: `${top3(b)} of ${n}`, after: `${top3(a)} of ${n}`, change: top3(a) - top3(b), unit: "" },
    { metric: "Search locations in the top 20", before: `${inTop20(b)} of ${n}`, after: `${inTop20(a)} of ${n}`, change: inTop20(a) - inTop20(b), unit: "" },
  ]
  // Narrow cell padding and no units on phones so all four columns fit without sideways scrolling.
  const cell = "px-2.5 sm:px-4"
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="w-full text-[13px] sm:text-sm">
        <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 sm:text-[11px]">
          <tr>
            <th className={`${cell} py-2.5 text-left font-semibold`}>Metric</th>
            <th className={`${cell} py-2.5 text-right font-semibold`}>Before</th>
            <th className={`${cell} py-2.5 text-right font-semibold`}>After</th>
            <th className={`${cell} py-2.5 text-right font-semibold`}>Change</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((r) => (
            <tr key={r.metric}>
              <td className={`${cell} py-3 font-medium text-slate-700`}>{r.metric}</td>
              <td className={`${cell} whitespace-nowrap py-3 text-right tabular-nums text-slate-500`}>{r.before}</td>
              <td className={`${cell} whitespace-nowrap py-3 text-right font-semibold tabular-nums`}>{r.after}</td>
              <td className={`${cell} py-3 text-right`}>
                {r.change === 0 ? (
                  <span className="text-slate-400">—</span>
                ) : (
                  <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${r.change > 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                    {r.change > 0 ? "▲" : "▼"} {Math.abs(r.change)}{r.unit && <span className="hidden sm:inline"> {r.unit}</span>}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default async function CaseStudyPage({ params }: Props) {
  const { agency, client } = await params
  const found = await find(agency, client)
  if (!found) notFound()
  const { agencyName, study: s, snap } = found
  const { rank, business: biz, audit, reviews } = snap
  // Before scores: typed in the app first, then the before growth report's.
  const typed = s.beforeScores
  const rep = snap.auditBefore
  const ab = typed || rep
    ? {
        gbpScore: typed?.gbpScore ?? rep?.gbpScore ?? null,
        siteScore: typed?.siteScore ?? rep?.siteScore ?? null,
        pageSpeed: typed?.pageSpeed ?? rep?.pageSpeed ?? null,
        aeo: typed?.aeo ?? rep?.aeo ?? null,
        geo: typed?.geo ?? rep?.geo ?? null,
        engine: (name: string) => typed?.engines?.find((e) => e.name === name)?.score ?? rep?.engines?.find((e) => e.name === name)?.score,
      }
    : null

  const qrTarget =
    s.qrUrl ?? biz?.mapsUrl ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${s.name}, ${s.address}`)}`
  // ponytail: third-party QR image; swap for a local generator if this needs to work offline.
  const qrImg = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=8&data=${encodeURIComponent(qrTarget)}`

  const ownSites = s.ownSites ?? 0
  const locked = s.hiddenSites.length + ownSites
  const totalLinks = s.citations.length + locked
  const linkMix = [
    { label: "Live citations", n: s.citations.length, bar: "bg-emerald-500" },
    { label: "Hidden citations", n: s.hiddenSites.length, bar: "bg-[#2d5bff]" },
    { label: "Private network", n: ownSites, bar: "bg-violet-500" },
  ].filter((x) => x.n > 0)

  const b = rank?.before
  const a = rank?.after
  const rankUp = b && a ? b.position - a.position : 0
  const stats = [
    ...(b && a ? [{ label: "Google Maps rank", value: `#${b.position} → #${a.position}`, note: rankUp > 0 ? `Up ${rankUp} positions` : "Tracked" }] : []),
    ...(b && a ? [{ label: "Share of local voice", value: `${pct(b.solv)} → ${pct(a.solv)}`, note: `“${a.keyword}”` }] : []),
    { label: "Backlinks built", value: String(totalLinks), note: `${s.citations.length} sample · ${locked} private` },
    ...(biz?.rating ? [{ label: "Google rating", value: `${biz.rating.toFixed(1)} ★`, note: biz.reviews ? `${fmt(biz.reviews)} reviews` : "" }] : []),
  ]

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="relative overflow-hidden bg-[#0b1437] text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_30rem_at_90%_-20%,rgba(45,91,255,0.55),transparent_60%),radial-gradient(40rem_24rem_at_0%_120%,rgba(16,185,129,0.2),transparent_60%)]"
        />
        <div className={`relative ${wrap} pb-28 pt-8`}>
          <div className="flex items-center justify-between gap-4 text-xs">
            <span className="font-semibold uppercase tracking-[0.18em] text-white/60">{agencyName}</span>
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-medium text-white/80">Local SEO case study</span>
          </div>
          <div className="mt-10 grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              {biz?.category && (
                <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">{biz.category}</span>
              )}
              <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-6xl">{s.name}</h1>
              {biz?.description && <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/70">{biz.description}</p>}
              <div className="mt-5 flex flex-col gap-2 text-sm text-white/70 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
                <span className="flex items-start gap-1.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  {s.address}
                </span>
                {biz?.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-4 w-4" aria-hidden />
                    {biz.phone}
                  </span>
                )}
                <a href={s.website} {...ext} className="inline-flex items-center gap-1.5 text-white hover:underline">
                  <Globe className="h-4 w-4" aria-hidden />
                  {host(s.website)}
                </a>
              </div>
            </div>
            {biz?.image && (
              <div className="relative hidden lg:block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={biz.image} alt={s.name} className="h-56 w-80 rounded-3xl object-cover shadow-2xl ring-1 ring-white/20" />
                {biz.rating && (
                  <div className="absolute -bottom-4 -left-4 flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-slate-900 shadow-xl">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" aria-hidden />
                    <span className="text-lg font-bold">{biz.rating.toFixed(1)}</span>
                    {biz.reviews && <span className="text-xs text-slate-500">{fmt(biz.reviews)} Google reviews</span>}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className={`relative -mt-16 flex flex-col gap-6 pb-16 ${wrap}`}>
        <div className={`grid grid-cols-2 gap-3 ${stats.length > 3 ? "lg:grid-cols-4" : stats.length > 2 ? "lg:grid-cols-3" : ""}`}>
          {stats.map((st) => (
            <div key={st.label} className={`${card} min-w-0 p-4 sm:p-5`}>
              <p className="text-xs font-medium text-slate-500">{st.label}</p>
              <p className="mt-1 text-lg font-bold tabular-nums tracking-tight min-[400px]:text-xl sm:text-3xl">{st.value}</p>
              <p className="mt-1 truncate text-xs font-medium text-emerald-600">{st.note}</p>
            </div>
          ))}
        </div>

        {(rank || s.rankReports || s.growthReportUrl) && (
          <Section
            eyebrow="Results"
            title="Google Maps ranking reports"
            description={
              a
                ? `Where ${s.name} appears in Google Maps when people around the restaurant search “${a.keyword}”. Each pin is a search location, showing the map-pack position found there; the outlined pin is the business itself.`
                : `How ${s.name} moved in local search, with the full reports behind every number.`
            }
          >
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.5fr_1fr] *:min-w-0">
              <div className="flex flex-col gap-4">
                {b && a && (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-2.5 ring-1 ring-slate-200">
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-500">
                        <span>Keyword <b className="font-semibold text-slate-800">{a.keyword}</b></span>
                        <span>Grid <b className="font-semibold text-slate-800">{a.size}×{a.size}</b></span>
                        <span>Radius <b className="font-semibold text-slate-800">{a.radiusMiles} mi</b></span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                        {RANK_BANDS.map((x) => (
                          <span key={x.label} className="inline-flex items-center gap-1.5"><span className={`h-2.5 w-2.5 rounded-full ${x.dot}`} />{x.label}</span>
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 *:min-w-0">
                      <RankMap side={b} label="Before" href={s.rankReports?.before} />
                      <RankMap side={a} label="After" href={s.rankReports?.after} good />
                    </div>
                    <RankComparison b={b} a={a} />
                  </>
                )}
                {!(b && a) && s.rankReports && (
                  <div className="grid gap-2 sm:grid-cols-2">
                    <a href={s.rankReports.before} {...ext} className={btnSecondary}>
                      Full before report <ExternalLink className="h-4 w-4" aria-hidden />
                    </a>
                    <a href={s.rankReports.after} {...ext} className={btnPrimary}>
                      Full after report <ExternalLink className="h-4 w-4" aria-hidden />
                    </a>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4">
                {a && (
                  <div className="rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                      <h3 className="text-sm font-semibold">Local leaderboard now</h3>
                      <span className="text-[11px] text-slate-500">Avg. rank · Share of voice</span>
                    </div>
                    <ol className="divide-y divide-slate-100">
                      {a.competitors.map((c) => (
                        <li key={c.rank} className={`flex items-center gap-3 px-4 py-2.5 ${c.you ? "bg-[#2d5bff]/5" : ""}`}>
                          <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${c.you ? "bg-[#2d5bff] text-white" : "bg-slate-100 text-slate-600"}`}>{c.rank}</span>
                          <span className="min-w-0 flex-1">
                            <span className={`block truncate text-sm ${c.you ? "font-bold text-[#2d5bff]" : "font-medium"}`}>{c.name}</span>
                            {c.rating && (
                              <span className="block text-xs text-slate-500">
                                {c.rating.toFixed(1)} ★{c.reviews ? ` · ${fmt(c.reviews)} reviews` : ""}
                              </span>
                            )}
                          </span>
                          <span className="w-10 text-right text-sm tabular-nums text-slate-600">{c.arp?.toFixed(1) ?? "—"}</span>
                          <span className="w-12 text-right text-sm font-semibold tabular-nums">{c.solv != null ? pct(c.solv) : "—"}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
                {s.growthReportUrl && (
                  <div className="flex flex-col gap-3 rounded-2xl bg-gradient-to-br from-[#2d5bff] to-[#1a37c2] p-5 text-white sm:flex-row sm:items-center">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                      <TrendingUp className="h-5 w-5" aria-hidden />
                    </span>
                    <div className="flex-1">
                      <h3 className="font-semibold">Local growth report</h3>
                      <p className="text-sm text-white/75">Maps grid, profile audit, website and AI visibility in one report.</p>
                    </div>
                    <a href={s.growthReportUrl} {...ext} className={`${btn} shrink-0 bg-white text-[#1a37c2] hover:bg-white/90`}>
                      Open <ExternalLink className="h-4 w-4" aria-hidden />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </Section>
        )}

        {audit && (
          <Section
            eyebrow="Audit report"
            title="Profile, website & AI visibility audit"
            description={`What we checked across ${s.name}'s Google Business Profile, website and AI search presence, and what it found.`}
          >
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3 *:min-w-0">
              <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-5">
                {ab?.gbpScore != null ? (
                  <div>
                    <p className="text-sm font-semibold">Google Business Profile</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">Overall profile health across 8 areas Google uses to rank local businesses.</p>
                    <div className="mt-4 flex items-center justify-center gap-3 sm:gap-5">
                      <div className="flex flex-col items-center gap-1.5">
                        <ScoreRing score={ab.gbpScore} size={80} label="Profile score before" />
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Before</span>
                      </div>
                      <span aria-hidden className="pb-6 text-xl text-slate-300">→</span>
                      <div className="flex flex-col items-center gap-1.5">
                        <ScoreRing score={audit.gbpScore} label="Profile score after" />
                        <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-700">
                          After <Delta d={audit.gbpScore - ab.gbpScore} />
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-5">
                    <ScoreRing score={audit.gbpScore} label="Google Business Profile score" />
                    <div>
                      <p className="text-sm font-semibold">Google Business Profile</p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-500">Overall profile health across 8 areas Google uses to rank local businesses.</p>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Website audit", score: audit.siteScore, was: ab?.siteScore, sub: audit.sitePages ? `${audit.sitePages} pages · ${fmt(audit.siteIssues ?? 0)} issues` : "" },
                    { label: "Mobile speed", score: audit.pageSpeed, was: ab?.pageSpeed, sub: "Google PageSpeed" },
                    { label: "AI answer engines", score: audit.aeo, was: ab?.aeo, sub: "AEO score" },
                    { label: "Generative search", score: audit.geo, was: ab?.geo, sub: "GEO score" },
                  ]
                    .filter((x): x is { label: string; score: number; was: number | null | undefined; sub: string } => x.score != null)
                    .map((x) => <ScoreCard key={x.label} label={x.label} now={x.score} before={x.was} sub={x.sub} />)}
                </div>
              </div>

              <div className="flex flex-col rounded-2xl border border-slate-200 p-5">
                <h3 className="text-sm font-semibold">Score by area</h3>
                {/* Spread down the card so it fills the height of its neighbours. */}
                <ul className="mt-4 flex flex-1 flex-col justify-between gap-3">
                  {audit.categories.map((c) => (
                    <li key={c.label}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-700">{c.label}</span>
                        <span className={`font-bold tabular-nums ${tone(c.score).text}`}>{c.score}</span>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className={`h-full rounded-full ${tone(c.score).bar}`} style={{ width: `${Math.max(c.score, 2)}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 text-center">
                  {[
                    { label: "Strong", sub: "80+", n: audit.categories.filter((c) => c.score >= 80).length, cls: "text-emerald-600" },
                    { label: "Fair", sub: "50–79", n: audit.categories.filter((c) => c.score >= 50 && c.score < 80).length, cls: "text-amber-600" },
                    { label: "Weak", sub: "below 50", n: audit.categories.filter((c) => c.score < 50).length, cls: "text-rose-600" },
                  ].map((x) => (
                    <div key={x.label} className="rounded-xl bg-slate-50 py-2.5 ring-1 ring-slate-200">
                      <p className={`text-2xl font-bold tabular-nums ${x.cls}`}>{x.n}</p>
                      <p className="text-[11px] font-medium text-slate-600">{x.label} <span className="text-slate-400">· {x.sub}</span></p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5 lg:col-span-2 xl:col-span-1">
                <h3 className="text-sm font-semibold">Key findings</h3>
                <ul className="mt-3 flex flex-col divide-y divide-slate-100">
                  {audit.issues.map((x) => (
                    <li key={x.label} className="flex items-start gap-2.5 py-2">
                      {x.status === "fail"
                        ? <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" aria-label="Needs work" />
                        : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-label="Could be better" />}
                      <span className="min-w-0 flex-1 text-sm">{x.label}</span>
                      <span className="shrink-0 text-right text-xs text-slate-500">{x.value}</span>
                    </li>
                  ))}
                </ul>
                {audit.strengths.length > 0 && (
                  <>
                    <h3 className="mt-4 text-sm font-semibold">Already strong</h3>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {audit.strengths.map((x) => (
                        <li key={x.label} className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                          {x.label}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>

            {audit.engines.length > 0 && (
              <div className="mt-4 rounded-2xl border border-slate-200 p-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <Bot className="h-4 w-4 text-[#2d5bff]" aria-hidden />
                  Visibility in AI search
                </h3>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  {audit.engines.map((e) => (
                    <ScoreCard key={e.name} label={e.name} now={e.score} before={ab?.engine(e.name)} />
                  ))}
                </div>
              </div>
            )}
          </Section>
        )}

        <div className={`grid grid-cols-1 gap-6 *:min-w-0 ${s.hideQr ? "" : "xl:grid-cols-[1.6fr_1fr]"}`}>
          {(reviews || biz?.rating) && (
            <Section eyebrow="Reputation" title="Review management">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {[
                  biz?.rating ? { label: "Google rating", value: `${biz.rating.toFixed(1)} ★` } : null,
                  biz?.reviews ? { label: "Total reviews", value: fmt(biz.reviews) } : null,
                  reviews?.last30 != null ? { label: "New in last 30 days", value: `+${reviews.last30}` } : null,
                  reviews?.negativeShare != null ? { label: "Positive reviews", value: pct((1 - reviews.negativeShare) * 100) } : null,
                ]
                  .filter((x) => x !== null)
                  .map((x) => (
                    <div key={x.label} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <p className="text-[11px] text-slate-500">{x.label}</p>
                      <p className="mt-1 text-2xl font-bold tabular-nums">{x.value}</p>
                    </div>
                  ))}
              </div>
              {reviews?.latest.length ? (
                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {reviews.latest.map((r) => (
                    <figure key={r.author + r.date} className="flex flex-col rounded-2xl border border-slate-200 p-4">
                      <div className="flex gap-0.5" aria-label="5 stars">
                        {Array.from({ length: 5 }, (_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />)}
                      </div>
                      <blockquote className="mt-2 line-clamp-5 flex-1 text-sm leading-relaxed text-slate-700">“{r.text}”</blockquote>
                      <figcaption className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">{r.author}</span>
                        {r.localGuide && <BadgeCheck className="h-3.5 w-3.5 text-[#2d5bff]" aria-label="Local Guide" />}
                        {r.date && <span>· {new Date(r.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              ) : null}
            </Section>
          )}

          {!s.hideQr && <Section eyebrow="Reputation" title="Review QR code">
            <div className="flex flex-col items-center gap-5 text-center">
              <div className="rounded-3xl bg-gradient-to-br from-[#2d5bff] to-[#1a37c2] p-4 shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrImg} alt={`QR code for ${s.name}`} width={200} height={200} className="rounded-2xl bg-white p-2" />
                <p className="mt-3 flex items-center justify-center gap-1.5 text-sm font-semibold text-white">
                  <QrCode className="h-4 w-4" aria-hidden />
                  Scan to review {s.name}
                </p>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-slate-500">
                Print this at the counter, on table tents or on receipts. Customers scan it to open {s.name} on Google and leave a review.
              </p>
            </div>
          </Section>}
        </div>

        <Section
          eyebrow="Off-page SEO"
          title="Backlink portfolio"
          description={`${totalLinks} backlinks built for ${s.name}. A sample of live citations is shown below.`}
        >
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_20rem] *:min-w-0">
            <CitationList citations={s.citations} />

            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-5 xl:sticky xl:top-6 xl:self-start">
              <div>
                <p className="text-xs font-medium text-slate-500">Total backlinks</p>
                <p className="text-4xl font-bold tabular-nums">{totalLinks}</p>
              </div>
              <div className="flex h-3 overflow-hidden rounded-full bg-slate-100">
                {linkMix.map((x) => (
                  <div key={x.label} className={x.bar} style={{ width: `${(x.n / totalLinks) * 100}%` }} />
                ))}
              </div>
              <ul className="flex flex-col gap-2.5">
                {linkMix.map((x) => (
                  <li key={x.label} className="flex items-center gap-2.5 text-sm">
                    <span className={`h-2.5 w-2.5 rounded-full ${x.bar}`} />
                    <span className="flex-1 text-slate-600">{x.label}</span>
                    <span className="font-semibold tabular-nums">{x.n}</span>
                  </li>
                ))}
              </ul>
              <p className="rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-500 ring-1 ring-slate-200">
                Consistent name, address and phone on trusted directories tells Google the business is real and local, which lifts map-pack rankings.
              </p>
            </div>
          </div>
        </Section>

        <footer className="pt-2 text-center text-xs text-slate-400">Prepared by {agencyName}</footer>
      </div>
    </main>
  )
}
