"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { Cta } from "./Cta";
import { PlatformMark, type PlatformId } from "./PlatformMarks";

/**
 * The timed signup prompt.
 *
 * A sibling of app/audit-suite/SignupPopup.tsx — same behaviour and the same
 * nine-second delay, with its own session key and its own funnel placement, so
 * the three campaigns never suppress or report over each other. Nine seconds
 * rather than five: an interstitial that lands before the reader has finished
 * the headline is the one they close without reading.
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

const DELAY_MS = 9000;
const SEEN_KEY = "fs_ai_rank_tracker_popup";

/** The four marks, in the order the dashboard's sidebar lists them. */
const MARKS: PlatformId[] = ["chat_gpt", "claude", "gemini", "perplexity"];

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
    <div
      className="airt-popup"
      role="dialog"
      aria-modal="true"
      aria-labelledby="airt-popup-title"
    >
      <button type="button" className="airt-popup-backdrop" aria-label="Close" onClick={dismiss} />

      <div className="airt-popup-card">
        <button type="button" className="airt-popup-x" onClick={dismiss} aria-label="Close">
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
