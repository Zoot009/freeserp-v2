"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { Cta } from "./Cta";
import { PlatformMark, type PlatformId } from "./PlatformMarks";
import { trackLanding } from "@/components/landing/track";

/**
 * The timed signup prompt.
 *
 * A sibling of app/audit-suite/SignupPopup.tsx — same card, same dismissal, its
 * own session key and its own funnel placement, so the three campaigns never
 * suppress or report over each other.
 *
 * It opens on scroll depth rather than a timer, matching the UK and US locale
 * pages: elapsed time counts a visitor who opened the tab and walked away
 * exactly the same as one who is reading, and an interstitial that lands before
 * the reader has finished the headline is the one they close without reading.
 * Thirty per cent of this page is around the first platform block, so the ask
 * arrives once the page has shown what it is selling.
 *
 * Dismissal is remembered for the session, so a visitor who says no once is not
 * asked again on the way back from the pricing anchor. sessionStorage rather
 * than localStorage on purpose: a returning visitor on another day is a fresh
 * chance, and every access is wrapped because Safari's private mode throws on
 * it rather than returning null.
 *
 * It is not a focus trap. A trap belongs on a dialog a visitor must answer;
 * this one has an Escape key, a close button and a backdrop that all do the
 * same thing, and locking the page behind it would cost more clicks than it
 * wins.
 */

/** How far down the page the visitor gets before the offer is worth showing. */
const SCROLL_TRIGGER = 0.3;

const SEEN_KEY = "fs_ai_rank_tracker_popup";
// Same value Cta.tsx stamps on signup_cta_click, so every event from this
// page groups together in the admin funnel.
const PAGE = "ai_rank_tracker";

/** The four marks, in the order the dashboard's sidebar lists them. */
const MARKS: PlatformId[] = ["chat_gpt", "claude", "gemini", "perplexity"];

export function SignupPopup() {
  const [open, setOpen] = useState(false);

  // `reason` separates "closed it deliberately" from "pressed escape" from
  // "clicked the backdrop" in the admin funnel — the popup's own dismiss
  // breakdown is the only signal for whether it is helping or just in the way.
  const dismiss = useCallback((reason: string) => {
    setOpen(false);
    trackLanding("signup_popup_dismiss", { reason, page: PAGE });
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* private mode — the popup simply shows again next load */
    }
  }, []);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SEEN_KEY) === "1") return;
    } catch {
      /* ignore and show it */
    }

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
      className="airt-popup"
      role="dialog"
      aria-modal="true"
      aria-labelledby="airt-popup-title"
    >
      <button type="button" className="airt-popup-backdrop" aria-label="Close" onClick={() => dismiss("backdrop")} />

      <div className="airt-popup-card">
        <button type="button" className="airt-popup-x" onClick={() => dismiss("close_button")} aria-label="Close">
          <X className="h-4 w-4" strokeWidth={2.2} />
        </button>

        <div className="airt-popup-marks" aria-hidden>
          {MARKS.map((id) => (
            <span key={id}>
              <PlatformMark id={id} size={19} />
            </span>
          ))}
        </div>

        <h2 id="airt-popup-title" className="airt-popup-title">
          Do the AI Assistants Name You?
        </h2>

        <p className="airt-popup-body">
          Sign up and get <b>100 free credits every month</b> to ask ChatGPT, Claude, Gemini
          and Perplexity what your buyers ask — and see who they answer with.
        </p>

        <Cta placement="timed_popup" label="Claim My Free Credits" className="mt-7 w-full" />
      </div>
    </div>
  );
}
