"use client";

import { useCallback, useEffect, useState } from "react";
import { FileText, Gauge, Link2, Search, X } from "lucide-react";
import { Cta } from "./Cta";
import { trackLanding } from "@/components/landing/track";

/**
 * The timed signup prompt.
 *
 * A sibling of app/ai-rank-tracker/SignupPopup.tsx — same card, same dismissal,
 * its own session key and its own funnel placement, so the four campaigns never
 * suppress or report over each other.
 *
 * It opens on scroll depth rather than a timer, matching every other campaign
 * page: elapsed time counts a visitor who opened the tab and walked away
 * exactly the same as one who is reading, and an interstitial that lands before
 * the reader has finished the headline is the one they close without reading.
 * Thirty per cent of this page is around the first comparison-layer block, so
 * the ask arrives once the page has shown what it is selling.
 *
 * Dismissal lasts for the page load, not the session — deliberately unlike the
 * sibling campaigns, which persist a "seen" flag to sessionStorage. Once shown
 * and closed it will not come back while the visitor stays on this page,
 * because the scroll listener is detached the moment it opens; a reload or a
 * fresh navigation starts it over. Nothing is written to storage at all, which
 * also means no Safari private-mode access to guard.
 *
 * It is not a focus trap. A trap belongs on a dialog a visitor must answer;
 * this one has an Escape key, a close button and a backdrop that all do the
 * same thing, and locking the page behind it would cost more clicks than it
 * wins.
 */

/** How far down the page the visitor gets before the offer is worth showing. */
const SCROLL_TRIGGER = 0.3;
// Same value Cta.tsx stamps on signup_cta_click, so every event from this page
// groups together in the admin funnel.
const PAGE = "competitor_analysis";

/** The layers of the comparison, in the order the page introduces them. */
const MARKS = [Search, FileText, Gauge, Link2];

export function SignupPopup() {
  const [open, setOpen] = useState(false);

  // `reason` separates "closed it deliberately" from "pressed escape" from
  // "clicked the backdrop" in the admin funnel — the popup's own dismiss
  // breakdown is the only signal for whether it is helping or just in the way.
  const dismiss = useCallback((reason: string) => {
    setOpen(false);
    trackLanding("signup_popup_dismiss", { reason, page: PAGE });
  }, []);

  useEffect(() => {
    let frame = 0;
    let fired = false;

    const measure = () => {
      frame = 0;
      // The furthest this page can be scrolled. Zero when the content is
      // shorter than the viewport, where there is no 30% to reach and dividing
      // by it would be a NaN that opens the popup instantly.
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      if (window.scrollY / scrollable < SCROLL_TRIGGER) return;

      fired = true;
      window.removeEventListener("scroll", onScroll);
      setOpen(true);
      // Without this the admin sees popup CTA clicks with no impressions behind
      // them, so the popup's conversion rate is unmeasurable.
      trackLanding("signup_popup_view", { page: PAGE });
    };

    // Coalesced into a frame: scroll fires far faster than the page paints, and
    // reading scrollHeight is a layout flush every time.
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    // Measured once up front as well. A back-navigation restores the previous
    // scroll position without ever firing a scroll event, so a visitor
    // returning to the middle of the page would otherwise have to scroll again
    // to reach a depth they had already passed.
    measure();
    if (!fired) window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss("escape");
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, dismiss]);

  if (!open) return null;

  return (
    <div
      className="cmpa-popup"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cmpa-popup-title"
    >
      <button type="button" className="cmpa-popup-backdrop" aria-label="Close" onClick={() => dismiss("backdrop")} />

      <div className="cmpa-popup-card">
        <button type="button" className="cmpa-popup-x" onClick={() => dismiss("close_button")} aria-label="Close">
          <X className="h-4 w-4" strokeWidth={2.2} />
        </button>

        <div className="cmpa-popup-marks" aria-hidden>
          {MARKS.map((Mark, i) => (
            <span key={i}>
              <Mark className="h-[19px] w-[19px]" strokeWidth={1.8} />
            </span>
          ))}
        </div>

        <h2 id="cmpa-popup-title" className="cmpa-popup-title">
          Why Are They Ranking Above You?
        </h2>

        <p className="cmpa-popup-body">
          Sign up and get <b>100 free credits every month</b> — enough to put your page beside
          the ones beating you and get every gap back as a prioritised plan.
        </p>

        <Cta placement="timed_popup" label="Claim My Free Credits" className="mt-7 w-full" />
      </div>
    </div>
  );
}
