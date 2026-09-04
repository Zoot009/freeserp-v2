"use client";

import { ArrowRight } from "lucide-react";
import { useAppUrl } from "@/lib/useAppUrl";
import { trackLandingAndFlush } from "@/components/landing/track";

/**
 * The one CTA on the page, reused everywhere.
 *
 * The only client component the landing page has — colocated with the route the
 * way app/contact/ContactForm.tsx is. A sibling of tracking-suite's, kept
 * separate so the two campaigns report distinct funnels. page.tsx itself stays a server component
 * so the whole page is static HTML; this is the single island that needs the
 * browser.
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
 * Skins live in ads.css (.ads-btn-*) rather than here, so the page can be
 * rethemed from one block of CSS variables. This page follows a different
 * reference from /tracking-suite, so its buttons are 10px rather than pills —
 * that difference lives entirely in the CSS.
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
          page: "audit_suite",
          href: e.currentTarget.getAttribute("href"),
        })
      }
      className={`ads-btn ads-btn-${size} ads-btn-${variant} ${className}`}
    >
      {label}
      {arrow && <ArrowRight className="h-[17px] w-[17px]" strokeWidth={2} />}
    </a>
  );
}
