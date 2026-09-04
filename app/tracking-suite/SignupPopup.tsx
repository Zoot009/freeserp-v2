"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { Cta } from "./Cta";

/**
 * The timed signup prompt.
 *
 * The hero no longer carries a button pair — this is what asks for the signup
 * instead, nine seconds in, once the visitor has had time to see what the page
 * is actually selling. Nine rather than five: an interstitial that lands before
 * the reader has finished the headline is the one they close without reading.
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

/** Item 6 of the brief asks for 8–10 seconds. */
const DELAY_MS = 9000;
const SEEN_KEY = "fs_tracking_suite_popup";

export function SignupPopup() {
  const [open, setOpen] = useState(false);

  const dismiss = useCallback(() => {
    setOpen(false);
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
    const timer = setTimeout(() => setOpen(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, dismiss]);

  if (!open) return null;

  return (
    <div className="ads-popup" role="dialog" aria-modal="true" aria-labelledby="ads-popup-title">
      <button type="button" className="ads-popup-backdrop" aria-label="Close" onClick={dismiss} />

      <div className="ads-popup-card">
        <button type="button" className="ads-popup-x" onClick={dismiss} aria-label="Close">
          <X className="h-4 w-4" strokeWidth={2.2} />
        </button>

        <h2 id="ads-popup-title" className="ads-popup-title">
          Ready to See What You&rsquo;re Missing?
        </h2>

        <p className="ads-popup-body">
          Sign up and get <b>100 free credits every month</b> to start tracking your rankings,
          competitors and more.
        </p>

        <Cta placement="timed_popup" label="Claim My Free Credits" className="mt-7 w-full" />
      </div>
    </div>
  );
}
