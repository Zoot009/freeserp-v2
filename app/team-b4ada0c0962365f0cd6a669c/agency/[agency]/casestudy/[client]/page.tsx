import type { Metadata } from "next"
import type React from "react"
import { notFound } from "next/navigation"
import { ArrowRight, ExternalLink, Globe, Lock, MapPin, QrCode, TrendingUp } from "lucide-react"
import { appUrl } from "@/components/site/constants"
import { AGENCIES } from "../../../case-studies"

type Props = { params: Promise<{ agency: string; client: string }> }

function find(agency: string, client: string) {
  const a = Object.hasOwn(AGENCIES, agency) ? AGENCIES[agency] : undefined
  const study = a && Object.hasOwn(a.clients, client) ? a.clients[client] : undefined
  return a && study ? { agencyName: a.name, study } : null
}

const host = (url: string) => new URL(url).hostname.replace(/^www\./, "")
const path = (url: string) => new URL(url).pathname.replace(/\/$/, "") || "/"
// ponytail: third-party favicon service, like the QR image below; self-host icons if it ever matters.
const favicon = (url: string) => `https://www.google.com/s2/favicons?domain=${host(url)}&sz=64`

const ext = { target: "_blank", rel: "noopener noreferrer" } as const
const btn = "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors"
const btnPrimary = `${btn} bg-[#2d5bff] text-white hover:bg-[#1e40d8]`
const btnSecondary = `${btn} border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50`
const card = "rounded-3xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-16px_rgba(15,23,42,0.12)]"

// Shared with clients by link only: never indexed.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { agency, client } = await params
  const found = find(agency, client)
  return {
    title: found ? `${found.study.name} · Case study` : "Case study",
    robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  }
}

function Section({ eyebrow, title, description, children }: { eyebrow: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className={`${card} p-6 sm:p-8`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2d5bff]">{eyebrow}</p>
      <h2 className="mt-1.5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{title}</h2>
      {description && <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-500">{description}</p>}
      <div className="mt-6">{children}</div>
    </section>
  )
}

type Side = { value: string; sub?: string }
function BeforeAfter({ before, after }: { before: Side; after: Side }) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2 sm:gap-3">
      {([["Before", before, false], ["After", after, true]] as const).map(([label, side, good], i) => (
        <div key={label} className="contents">
          {i === 1 && <ArrowRight className="h-5 w-5 self-center text-slate-300" aria-hidden />}
          <div className={`rounded-2xl p-4 ring-1 ${good ? "bg-emerald-50 ring-emerald-200" : "bg-slate-50 ring-slate-200"}`}>
            <p className={`text-[11px] font-semibold uppercase tracking-wider ${good ? "text-emerald-700" : "text-slate-500"}`}>{label}</p>
            <p className={`mt-1 text-3xl font-bold tabular-nums tracking-tight ${good ? "text-emerald-700" : "text-slate-700"}`}>{side.value}</p>
            {side.sub && <p className="mt-0.5 text-xs text-slate-500">{side.sub}</p>}
          </div>
        </div>
      ))}
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
  const { agencyName, study: s } = found

  const qrTarget =
    s.qrUrl ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${s.name}, ${s.address}`)}`
  // ponytail: third-party QR image; swap for a local generator if this needs to work offline.
  const qrImg = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encodeURIComponent(qrTarget)}`

  const ownSites = s.ownSites ?? 0
  const locked = s.hiddenSites.length + ownSites
  const totalLinks = s.citations.length + locked
  // Blurred teaser rows behind the login wall: hidden sites by name, then a few private-network placeholders.
  const teaser = [
    ...s.hiddenSites.map((name) => ({ name, type: "Local citation" })),
    ...Array.from({ length: Math.min(ownSites, 3) }, () => ({ name: "Private network site", type: "Private network" })),
  ]

  const r = s.rankReports
  const rankUp = r?.before.rank && r.after.rank ? r.before.rank - r.after.rank : 0
  const stats = [
    ...(r?.before.rank && r.after.rank
      ? [{ label: "Google Maps rank", value: `#${r.before.rank} → #${r.after.rank}`, note: rankUp > 0 ? `Up ${rankUp} positions` : "Tracked" }]
      : []),
    { label: "Backlinks built", value: String(totalLinks), note: `${s.citations.length} sample · ${locked} private` },
    ...(s.reviews
      ? [{ label: "Google rating", value: `${s.reviews.after.rating.toFixed(1)} ★`, note: `${s.reviews.after.count} reviews` }]
      : []),
  ]
  const bothReports = Boolean(r && s.growthReportUrl)

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="relative overflow-hidden bg-[#0b1437] text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(50rem_28rem_at_90%_-20%,rgba(45,91,255,0.55),transparent_60%),radial-gradient(30rem_20rem_at_0%_120%,rgba(16,185,129,0.18),transparent_60%)]"
        />
        <div className="relative mx-auto max-w-5xl px-4 pb-28 pt-8 sm:px-6">
          <div className="flex items-center justify-between gap-4 text-xs">
            <span className="font-semibold uppercase tracking-[0.18em] text-white/60">{agencyName}</span>
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-medium text-white/80">Local SEO case study</span>
          </div>
          <h1 className="mt-12 text-4xl font-bold tracking-tight sm:text-5xl">{s.name}</h1>
          <div className="mt-4 flex flex-col gap-2 text-sm text-white/70 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
            <span className="flex items-start gap-1.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              {s.address}
            </span>
            <a href={s.website} {...ext} className="inline-flex items-center gap-1.5 text-white hover:underline">
              <Globe className="h-4 w-4" aria-hidden />
              {host(s.website)}
            </a>
          </div>
        </div>
      </header>

      <div className="relative mx-auto -mt-16 flex max-w-5xl flex-col gap-6 px-4 pb-16 sm:px-6">
        <div className={`grid gap-3 ${stats.length > 2 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
          {stats.map((st) => (
            <div key={st.label} className={`${card} p-5`}>
              <p className="text-xs font-medium text-slate-500">{st.label}</p>
              <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight sm:text-3xl">{st.value}</p>
              <p className="mt-1 text-xs font-medium text-emerald-600">{st.note}</p>
            </div>
          ))}
        </div>

        {(r || s.growthReportUrl) && (
          <Section eyebrow="Results" title="Ranking reports" description={`How ${s.name} moved in local search, with the full reports behind every number.`}>
            <div className="grid gap-4 lg:grid-cols-5">
              {r && (
                <div className={`flex flex-col rounded-2xl border border-slate-200 p-5 ${bothReports ? "lg:col-span-3" : "lg:col-span-5"}`}>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold">Before &amp; after rank report</h3>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">Google Maps</span>
                  </div>
                  <div className="mt-5">
                    <BeforeAfter
                      before={{ value: r.before.rank ? `#${r.before.rank}` : "—", sub: "Map pack rank" }}
                      after={{ value: r.after.rank ? `#${r.after.rank}` : "—", sub: rankUp > 0 ? `Up ${rankUp} positions` : "Map pack rank" }}
                    />
                  </div>
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    <a href={r.before.url} {...ext} className={btnSecondary}>
                      Before report <ExternalLink className="h-4 w-4" aria-hidden />
                    </a>
                    <a href={r.after.url} {...ext} className={btnPrimary}>
                      After report <ExternalLink className="h-4 w-4" aria-hidden />
                    </a>
                  </div>
                </div>
              )}
              {s.growthReportUrl && (
                <div className={`flex flex-col rounded-2xl bg-gradient-to-br from-[#2d5bff] to-[#1a37c2] p-5 text-white ${bothReports ? "lg:col-span-2" : "lg:col-span-5"}`}>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                    <TrendingUp className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-semibold">Local growth report</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/75">
                    Rankings, visibility and competitor movement for {s.name}, tracked over time.
                  </p>
                  <a href={s.growthReportUrl} {...ext} className={`${btn} mt-5 bg-white text-[#1a37c2] hover:bg-white/90 lg:mt-auto`}>
                    Open growth report <ExternalLink className="h-4 w-4" aria-hidden />
                  </a>
                </div>
              )}
            </div>
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
        </Section>

        {s.reviews && (
          <Section eyebrow="Reputation" title="Review management">
            <BeforeAfter
              before={{ value: `${s.reviews.before.rating.toFixed(1)} ★`, sub: `${s.reviews.before.count} reviews` }}
              after={{ value: `${s.reviews.after.rating.toFixed(1)} ★`, sub: `${s.reviews.after.count} reviews` }}
            />
          </Section>
        )}

        <Section eyebrow="Reputation" title="Review QR code">
          <div className="flex flex-col items-center gap-6 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200 sm:flex-row">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrImg} alt={`QR code for ${s.name}`} width={160} height={160} className="rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-200" />
            <div className="text-center sm:text-left">
              <p className="flex items-center justify-center gap-2 font-semibold sm:justify-start">
                <QrCode className="h-4 w-4 text-[#2d5bff]" aria-hidden />
                Scan to review {s.name}
              </p>
              <p className="mt-1.5 max-w-md text-sm leading-relaxed text-slate-500">
                Print this at the counter, on table tents or on receipts. Customers scan it to find {s.name} on Google and leave a review.
              </p>
            </div>
          </div>
        </Section>

        <footer className="pt-2 text-center text-xs text-slate-400">
          Prepared by {agencyName}
        </footer>
      </div>
    </main>
  )
}
