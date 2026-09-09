"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useAppUrl } from "@/lib/useAppUrl";
import { trackLandingAndFlush } from "@/components/landing/track";

/**
 * The one CTA on the page, reused everywhere.
 *
 * A sibling of /ai-rank-tracker's, /audit-suite's and /tracking-suite's, kept
 * separate so the four campaigns report distinct funnels — `page:
 * "competitor_analysis"` is what separates them downstream. page.tsx itself
 * stays a server component so the whole page is static HTML; this and the popup
 * are the only islands that need the browser.
 *
 * Two things it must not get wrong, which is why it exists at all rather than
 * being an <a> repeated a dozen times:
 *
 *  1. useAppUrl carries the visitor's campaign UTMs across to app.freeserp.com.
 *     A paid click that loses its UTMs on the signup hop is an unattributable
 *     conversion — on an ad landing page that is the whole point of the page.
 *  2. trackLandingAndFlush uses sendBeacon, because this click immediately
 *     navigates cross-origin and a batched event would race the unload.
 *
 * `placement` is what separates hero clicks from footer clicks in the funnel,
 * so every call site passes a distinct one. It is also written to data-cta, so
 * GTM can bind a click trigger without another code change.
 *
 * Skins live in ads.css (.cmpa-btn-*) rather than here, so the page can be
 * rethemed from one block of CSS variables.
 */
export function Cta({
  placement,
  label = "Start for free",
  size = "lg",
  variant = "primary",
  arrow = true,
  className = "",
}: {
  placement: string;
  label?: string;
  size?: "lg" | "sm";
  variant?: "primary" | "ink" | "ghost" | "white";
  /** `true` trails the label with →; "up-right" with ↗, for the nav pill. */
  arrow?: boolean | "up-right";
  className?: string;
}) {
  const appUrl = useAppUrl();

  return (
    <a
      href={appUrl("/signup")}
      data-cta={placement}
      onClick={(e) =>
        trackLandingAndFlush("signup_cta_click", {
          placement,
          page: "competitor_analysis",
          href: e.currentTarget.getAttribute("href"),
        })
      }
      className={`cmpa-btn cmpa-btn-${size} cmpa-btn-${variant} ${className}`}
    >
      {label}
      {arrow === "up-right" ? (
        <ArrowUpRight className="h-[17px] w-[17px]" strokeWidth={2} />
      ) : (
        arrow && <ArrowRight className="h-[17px] w-[17px]" strokeWidth={2} />
      )}
    </a>
  );
}
