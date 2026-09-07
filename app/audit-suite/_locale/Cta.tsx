"use client";

import { ArrowUpRight } from "lucide-react";
import { useAppUrl } from "@/lib/useAppUrl";
import { trackLandingAndFlush } from "@/components/landing/track";

/**
 * The one CTA on the page, reused everywhere.
 *
 * Shared by every /audit-suite locale, and a sibling of
 * app/tracking-suite/Cta.tsx rather than a component shared with that too: the
 * campaigns must be able to change independently. `page` is stamped on the
 * funnel event and passed per locale, so /us and /uk clicks never pool.
 *
 * The only client island the pages have besides the popup, which is what keeps
 * each page.tsx a server component that ships as static HTML.
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
 * Skins live in audit.css (.audit-btn-*) rather than here, so every locale can
 * be rethemed from one block of CSS variables.
 */
export function Cta({
  page,
  placement,
  label = "Start for free",
  size = "lg",
  variant = "primary",
  arrow = true,
  className = "",
}: {
  /** Analytics page id — "audit_suite_us", "audit_suite_uk". */
  page: string;
  placement: string;
  label?: string;
  size?: "lg" | "sm";
  variant?: "primary" | "ink" | "ghost";
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
          page,
          href: e.currentTarget.getAttribute("href"),
        })
      }
      className={`audit-btn audit-btn-${size} audit-btn-${variant} ${className}`}
    >
      {label}
      {arrow && <ArrowUpRight className="h-[17px] w-[17px]" strokeWidth={2.2} />}
    </a>
  );
}
