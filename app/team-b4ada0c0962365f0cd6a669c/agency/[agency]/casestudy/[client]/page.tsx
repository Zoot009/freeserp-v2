import type { Metadata } from "next"
import type React from "react"
import { notFound } from "next/navigation"
import {
  AlertTriangle, ArrowRight, BadgeCheck, Bot, CheckCircle2, ExternalLink, Globe, Lock, MapPin, Phone,
  QrCode, Star, TrendingUp, XCircle,
} from "lucide-react"
import { appUrl } from "@/components/site/constants"
import { AGENCIES } from "../../../case-studies"
import SNAPSHOTS from "../../../snapshots.json"

type Props = { params: Promise<{ agency: string; client: string }> }

// Shape written by scripts/case-study-snapshot.mjs.
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
}
const snapshots = SNAPSHOTS as unknown as Record<string, Snapshot>

function find(agency: string, client: string) {
  const a = Object.hasOwn(AGENCIES, agency) ? AGENCIES[agency] : undefined
  const study = a && Object.hasOwn(a.clients, client) ? a.clients[client] : undefined
  return a && study ? { agencyName: a.name, study, snap: snapshots[`${agency}/${client}`] ?? {} } : null
}

const host = (url: string) => new URL(url).hostname.replace(/^www\./, "")
const path = (url: string) => new URL(url).pathname.replace(/\/$/, "") || "/"
// ponytail: third-party favicon service, like the QR image below; self-host icons if it ever matters.
const favicon = (url: string) => `https://www.google.com/s2/favicons?domain=${host(url)}&sz=64`
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

// Map-pack rank pin colours: top 3 green, top 10 amber, 11–20 red, not in the top 20 white.
const RANK_BANDS = [
  { label: "Top 3", dot: "bg-emerald-600" },
  { label: "4–10", dot: "bg-amber-500" },
  { label: "11–20", dot: "bg-rose-600" },
  { label: "Not in top 20", dot: "bg-white ring-1 ring-slate-300" },
] as const
const pinTone = (rank: number | null) =>
  rank == null ? "bg-white text-slate-500 ring-slate-300"
  : rank <= 3 ? "bg-emerald-600 text-white ring-white"
  : rank <= 10 ? "bg-amber-500 text-white ring-white"
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
  const found = find(agency, client)
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
      <div className="grid place-items-center rounded-full bg-white" style={{ width: size - 16, height: size - 16 }}>
        <span className={`text-3xl font-bold tabular-nums ${t.text}`}>{score}</span>
      </div>
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
            {p.rank ?? "–"}
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
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="w-full min-w-[30rem] text-sm">
        <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
          <tr>
            <th className="px-4 py-2.5 text-left font-semibold">Metric</th>
            <th className="px-4 py-2.5 text-right font-semibold">Before</th>
            <th className="px-4 py-2.5 text-right font-semibold">After</th>
            <th className="px-4 py-2.5 text-right font-semibold">Change</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((r) => (
            <tr key={r.metric}>
              <td className="px-4 py-3 font-medium text-slate-700">{r.metric}</td>
              <td className="px-4 py-3 text-right tabular-nums text-slate-500">{r.before}</td>
              <td className="px-4 py-3 text-right font-semibold tabular-nums">{r.after}</td>
              <td className="px-4 py-3 text-right">
                {r.change === 0 ? (
                  <span className="text-slate-400">—</span>
                ) : (
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${r.change > 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                    {r.change > 0 ? "▲" : "▼"} {Math.abs(r.change)}{r.unit && ` ${r.unit}`}
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

function LinkRow({ icon, title, sub, type }: { icon: React.ReactNode; title: string; sub: string; type: string }) {
  return (
    <>
      <span className="flex min-w-0 items-center gap-3">
        {icon}
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-slate-900">{title}</span>
          <span className="block truncate text-xs text-slate-500">{sub}</span>
        </span>
      </span>
      <span className="hidden rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 sm:inline">{type}</span>
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
        Live
      </span>
    </>
  )
}

const rowGrid = "grid grid-cols-[1fr_auto] items-center gap-4 px-4 py-3 sm:grid-cols-[1fr_8rem_4rem] sm:px-5"

export default async function CaseStudyPage({ params }: Props) {
  const { agency, client } = await params
  const found = find(agency, client)
  if (!found) notFound()
  const { agencyName, study: s, snap } = found
  const { rank, business: biz, audit, reviews } = snap

  const qrTarget =
    s.qrUrl ?? biz?.mapsUrl ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${s.name}, ${s.address}`)}`
  // ponytail: third-party QR image; swap for a local generator if this needs to work offline.
  const qrImg = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=8&data=${encodeURIComponent(qrTarget)}`

  const ownSites = s.ownSites ?? 0
  const locked = s.hiddenSites.length + ownSites
  const totalLinks = s.citations.length + locked
  // Blurred teaser rows behind the login wall: hidden sites by name, then a few private-network placeholders.
  const teaser = [
    ...s.hiddenSites.map((name) => ({ name, type: "Local citation" })),
    ...Array.from({ length: Math.min(ownSites, 3) }, () => ({ name: "Private network site", type: "Private network" })),
  ]
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
        <div className={`grid gap-3 sm:grid-cols-2 ${stats.length > 3 ? "lg:grid-cols-4" : stats.length > 2 ? "lg:grid-cols-3" : ""}`}>
          {stats.map((st) => (
            <div key={st.label} className={`${card} p-5`}>
              <p className="text-xs font-medium text-slate-500">{st.label}</p>
              <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight sm:text-3xl">{st.value}</p>
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
            <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
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
                    <div className="grid gap-4 md:grid-cols-2">
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
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center gap-5">
                  <ScoreRing score={audit.gbpScore} label="Google Business Profile score" />
                  <div>
                    <p className="text-sm font-semibold">Google Business Profile</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">Overall profile health across 8 areas Google uses to rank local businesses.</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Website audit", score: audit.siteScore, sub: audit.sitePages ? `${audit.sitePages} pages · ${fmt(audit.siteIssues ?? 0)} issues` : "" },
                    { label: "Mobile speed", score: audit.pageSpeed, sub: "Google PageSpeed" },
                    { label: "AI answer engines", score: audit.aeo, sub: "AEO score" },
                    { label: "Generative search", score: audit.geo, sub: "GEO score" },
                  ]
                    .filter((x): x is { label: string; score: number; sub: string } => x.score != null)
                    .map((x) => (
                      <div key={x.label} className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
                        <p className="text-[11px] text-slate-500">{x.label}</p>
                        <p className={`text-2xl font-bold tabular-nums ${tone(x.score).text}`}>{x.score}<span className="text-xs font-medium text-slate-400">/100</span></p>
                        {x.sub && <p className="truncate text-[11px] text-slate-500">{x.sub}</p>}
                      </div>
                    ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5">
                <h3 className="text-sm font-semibold">Score by area</h3>
                <ul className="mt-4 flex flex-col gap-3">
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
                    <div key={e.name} className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
                      <p className="truncate text-xs font-medium text-slate-600">{e.name}</p>
                      <p className={`mt-1 text-xl font-bold tabular-nums ${tone(e.score).text}`}>{e.score}</p>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                        <div className={`h-full rounded-full ${tone(e.score).bar}`} style={{ width: `${e.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Section>
        )}

        {s.beforeAfter?.length ? (
          <Section eyebrow="Results" title="Before & after screenshots">
            <div className="flex flex-col gap-8">
              {s.beforeAfter.map((p, i) => (
                <figure key={i}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {(["before", "after"] as const).map((k) => (
                      <div key={k}>
                        <p className={`mb-2 text-[11px] font-semibold uppercase tracking-wider ${k === "after" ? "text-emerald-700" : "text-slate-500"}`}>{k}</p>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p[k]} alt={`${s.name} ${k}`} className="w-full rounded-xl border border-slate-200" />
                      </div>
                    ))}
                  </div>
                  {p.caption && <figcaption className="mt-3 text-sm text-slate-500">{p.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </Section>
        ) : null}

        <Section
          eyebrow="Off-page SEO"
          title="Backlink portfolio"
          description={`${totalLinks} backlinks built for ${s.name}. A sample of live citations is shown below.`}
        >
          <div className="grid gap-5 xl:grid-cols-[1fr_20rem]">
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <div className={`${rowGrid} hidden border-b border-slate-200 bg-slate-50 !py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 sm:grid`}>
                <span>Source</span>
                <span>Type</span>
                <span>Status</span>
              </div>
              <ul className="divide-y divide-slate-100">
                {s.citations.map((url) => (
                  <li key={url}>
                    <a href={url} {...ext} className={`${rowGrid} transition-colors hover:bg-slate-50`}>
                      <LinkRow
                        // eslint-disable-next-line @next/next/no-img-element
                        icon={<img src={favicon(url)} alt="" width={20} height={20} className="h-5 w-5 shrink-0 rounded" />}
                        title={host(url)}
                        sub={path(url)}
                        type="Local citation"
                      />
                    </a>
                  </li>
                ))}
              </ul>

              {locked > 0 && (
                <div className="relative min-h-72 border-t border-slate-100">
                  <ul aria-hidden className="pointer-events-none select-none divide-y divide-slate-100 blur-[3px]">
                    {teaser.map((t, i) => (
                      <li key={i} className={rowGrid}>
                        <LinkRow
                          icon={<span className="h-5 w-5 shrink-0 rounded bg-slate-200" />}
                          title={t.name}
                          sub="••••••••••/••••••••"
                          type={t.type}
                        />
                      </li>
                    ))}
                  </ul>
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-white/40 via-white/85 to-white p-4">
                    <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-xl shadow-slate-900/10">
                      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#2d5bff]/10 text-[#2d5bff]">
                        <Lock className="h-5 w-5" aria-hidden />
                      </span>
                      <p className="mt-3 text-base font-semibold">{locked} more backlinks are locked</p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-500">
                        {[
                          s.hiddenSites.length ? `${s.hiddenSites.length} citations including ${s.hiddenSites.slice(0, 3).join(", ")}` : "",
                          ownSites ? `${ownSites} sites from our private network` : "",
                        ]
                          .filter(Boolean)
                          .join(", plus ")}
                        .
                      </p>
                      <a href={appUrl("/login")} className={`${btnPrimary} mt-5 w-full`}>
                        Unlock full backlink list <ArrowRight className="h-4 w-4" aria-hidden />
                      </a>
                      <p className="mt-2 text-xs text-slate-400">Available on paid plans</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-5">
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
              <p className="mt-auto rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-500 ring-1 ring-slate-200">
                Consistent name, address and phone on trusted directories tells Google the business is real and local, which lifts map-pack rankings.
              </p>
            </div>
          </div>
        </Section>

        <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
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
              {s.reviews && (
                <p className="mt-3 text-sm text-slate-600">
                  Rating moved from <b>{s.reviews.before.rating.toFixed(1)} ★</b> ({fmt(s.reviews.before.count)} reviews) to{" "}
                  <b className="text-emerald-700">{s.reviews.after.rating.toFixed(1)} ★</b> ({fmt(s.reviews.after.count)} reviews).
                </p>
              )}
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

          <Section eyebrow="Reputation" title="Review QR code">
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
          </Section>
        </div>

        <footer className="pt-2 text-center text-xs text-slate-400">Prepared by {agencyName}</footer>
      </div>
    </main>
  )
}
