"use client";

import { ArrowUpRight } from "lucide-react";
import { useAppUrl } from "@/lib/useAppUrl";
import { trackLandingAndFlush } from "@/components/landing/track";

/**
 * The signup CTA, reused everywhere on the page.
 *
 * Two things it must not get wrong, which is why it exists rather than being an
 * <a> repeated a dozen times:
 *
 *  1. useAppUrl carries the visitor's campaign UTMs across to app.freeserp.com.
 *     A paid click that loses its UTMs on the signup hop is an unattributable
 *     conversion — on an ad landing page that is the whole point of the page.
 *  2. trackLandingAndFlush uses sendBeacon, because this click immediately
 *     navigates cross-origin and a batched event would race the unload.
 *
 * `placement` separates hero clicks from footer clicks in the funnel, so every
 * call site passes a distinct one. It is also written to data-cta, so GTM can
 * bind a click trigger without another code change.
 *
 * Skins live in ads.css (.us-btn-*), so the page can be rethemed from one block
 * of CSS variables.
 */
export function Cta({
  placement,
  label,
  size = "lg",
  variant = "primary",
  arrow = true,
  className = "",
}: {
  placement: string;
  label: string;
  size?: "lg" | "sm";
  /** "onsolid" is the white button used ON the accent panel, where the
   *  accent itself is unavailable as a fill. */
  variant?: "primary" | "ink" | "ghost" | "onsolid";
  arrow?: boolean;
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
          page: "free_serp_checker_us",
          href: e.currentTarget.getAttribute("href"),
        })
      }
      className={`us-btn us-btn-${size} us-btn-${variant} ${className}`}
    >
      {label}
      {arrow && <ArrowUpRight className="h-[17px] w-[17px]" strokeWidth={2.2} />}
    </a>
  );
}
