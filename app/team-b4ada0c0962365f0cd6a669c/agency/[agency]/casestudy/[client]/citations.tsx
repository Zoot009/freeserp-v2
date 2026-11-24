"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const STEP = 10 // citations added per "Show more"

const host = (url: string) => new URL(url).hostname.replace(/^www\./, "")
const path = (url: string) => new URL(url).pathname.replace(/\/$/, "") || "/"
// ponytail: third-party favicon service; self-host icons if it ever matters.
const favicon = (url: string) => `https://www.google.com/s2/favicons?domain=${host(url)}&sz=64`
const rowGrid = "grid grid-cols-[1fr_auto] items-center gap-4 px-4 py-3 sm:grid-cols-[1fr_8rem_4rem] sm:px-5"

/** The case study's citation list: 10 at first, 10 more per click. */
export function CitationList({ citations }: { citations: string[] }) {
  const [shown, setShown] = useState(STEP)
  const left = citations.length - shown
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <div className={`${rowGrid} hidden border-b border-slate-200 bg-slate-50 !py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 sm:grid`}>
        <span>Source</span>
        <span>Type</span>
        <span>Status</span>
      </div>
      <ul className="divide-y divide-slate-100">
        {citations.slice(0, shown).map((url) => {
          const p = path(url)
          return (
            <li key={url}>
              <a href={url} target="_blank" rel="noopener noreferrer" className={`${rowGrid} transition-colors hover:bg-slate-50`}>
                <span className="flex min-w-0 items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={favicon(url)} alt="" width={20} height={20} loading="lazy" className="h-5 w-5 shrink-0 rounded" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-slate-900">{host(url)}</span>
                    <span className="block truncate text-xs text-slate-500">{p === "/" ? "Business listing site" : p}</span>
                  </span>
                </span>
                <span className="hidden rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 sm:inline">Local citation</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
                  Live
                </span>
              </a>
            </li>
          )
        })}
      </ul>
      {citations.length > STEP && (
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 border-t border-slate-100 px-4 py-3 text-sm">
          <span className="text-xs text-slate-500">
            Showing {Math.min(shown, citations.length)} of {citations.length}
          </span>
          {left > 0 ? (
            <button type="button" onClick={() => setShown((n) => n + STEP)} className="inline-flex items-center gap-1.5 font-semibold text-[#2d5bff] hover:underline">
              Show {Math.min(STEP, left)} more <ChevronDown className="h-4 w-4" aria-hidden />
            </button>
          ) : (
            <button type="button" onClick={() => setShown(STEP)} className="inline-flex items-center gap-1.5 font-semibold text-[#2d5bff] hover:underline">
              Show fewer <ChevronDown className="h-4 w-4 rotate-180" aria-hidden />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
