"use client"

import type { CSSProperties, ReactNode } from "react"
import { useAppUrl } from "@/lib/useAppUrl"

/**
 * An app-bound CTA link (e.g. "Get started") that carries the visitor's campaign
 * UTMs across to the app origin. Use this from Server Components — which can't call
 * the useAppUrl hook directly — where a plain appUrl() would drop the campaign.
 */
export function AppCtaLink({
  path,
  children,
  className,
  style,
  onClick,
}: {
  path: string
  children: ReactNode
  className?: string
  style?: CSSProperties
  onClick?: () => void
}) {
  const appUrl = useAppUrl()
  return (
    <a href={appUrl(path)} className={className} style={style} onClick={onClick}>
      {children}
    </a>
  )
}
