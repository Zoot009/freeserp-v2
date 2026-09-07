"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, ShieldCheck, X } from "lucide-react";
import { useAppUrl } from "@/lib/useAppUrl";
import { trackLanding, trackLandingAndFlush } from "@/components/landing/track";

/** How long a visitor reads before the offer is worth interrupting them for. */
const DELAY_MS = 8_000;

/**
 * The delayed signup offer, shared by every /audit-suite locale.
 *
 * This replaces the inline offer band that would otherwise sit under the hero:
 * the same offer, but asked for after the visitor has read enough of the page
 * to want it, rather than occupying the screen above the first product shot.
 *
 * Deliberately not a <dialog>: showModal() traps focus and blocks scrolling,
 * which is the correct behaviour for a form the user opened and the wrong one
 * for an offer that interrupted them. This is a polite overlay — Escape closes
 * it, the backdrop closes it, and the page underneath keeps scrolling.
 *
 * Focus does move to the close button when it opens, so a keyboard or screen
 * reader user is not left tabbing through a panel they cannot find, and
 * role="dialog" + aria-labelledby announces it.
 *
 * Copy is passed in rather than written here: the locales differ on wording and
 * on spelling ("analyze" / "analyse"), and a shared component that branches on
 * locale is how those drift apart without anyone noticing.
 */
export function SignupPopup({
  page,
  title,
  titleAccent,
  body,
  ctaLabel,
  footnote = "No credit card required.",
}: {
  /** Analytics page id, also the sessionStorage suppression key. */
  page: string;
  /** Headline, minus the gradient tail. */
  title: string;
  /** The last few words of the headline, in the brand gradient. */
  titleAccent: string;
  body: string;
  ctaLabel: string;
  footnote?: string;
}) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const appUrl = useAppUrl();

  /**
   * Suppression key. sessionStorage, not localStorage, on purpose: a visitor who
   * dismissed it this morning and clicked a second ad this afternoon is a second
   * chance to convert, but seeing it twice while reading one page is an
   * annoyance that costs the click. Keyed per locale so a visitor who somehow
   * sees both pages is not silently opted out of the second.
   */
  const seenKey = `freeserp.${page}.popup`;

  const dismiss = useCallback(
    (reason: string) => {
      setOpen(false);
      trackLanding("signup_popup_dismiss", { reason, page });
      try {
        sessionStorage.setItem(seenKey, "1");
      } catch {
        // Private mode or blocked storage — showing it again next page load is
        // a far smaller problem than throwing here.
      }
    },
    [page, seenKey],
  );

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(seenKey) === "1";
    } catch {
      seen = false;
    }
    if (seen) return;

    const timer = window.setTimeout(() => {
      setOpen(true);
      trackLanding("signup_popup_view", { page });
    }, DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [page, seenKey]);

  // Escape closes, and the close button takes focus so the panel is reachable
  // without a mouse. Both are bound only while it is actually open.
  useEffect(() => {
    if (!open) return;

    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss("escape");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dismiss]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center">
      {/* Backdrop. A button, not a bare div, so the dismiss target is real for
          assistive tech rather than a click handler on decoration. */}
      <button
        type="button"
        aria-label="Close"
        onClick={() => dismiss("backdrop")}
        className="audit-pop-backdrop absolute inset-0 cursor-default bg-[#0d1020]/45 backdrop-blur-[3px]"
      />

      <div
        role="dialog"
        aria-modal="false"
        aria-labelledby="audit-popup-title"
        className="audit-pop-card audit-card relative w-full max-w-[520px] overflow-hidden p-7 text-center shadow-[0_40px_90px_-40px_rgba(13,16,32,0.7)] sm:p-10"
      >
        <span
          className="absolute inset-x-0 top-0 h-[3px] bg-[var(--accent)]"
          aria-hidden
        />

        <button
          ref={closeRef}
          type="button"
          onClick={() => dismiss("close_button")}
          aria-label="Close"
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-[var(--muted)] transition-colors hover:bg-[var(--canvas)] hover:text-[var(--ink)]"
        >
          <X className="h-[17px] w-[17px]" strokeWidth={2} />
        </button>

        <span className="audit-tag">{footnote}</span>

        <h2
          id="audit-popup-title"
          className="mt-5 text-[26px] leading-[1.14] font-semibold tracking-[-0.024em] sm:text-[32px]"
        >
          {title} <span className="audit-grad-text">{titleAccent}</span>
        </h2>

        <p className="mx-auto mt-4 max-w-[46ch] text-[15px] leading-[1.6] text-[var(--body)]">
          {body}
        </p>

        <a
          href={appUrl("/signup")}
          data-cta="popup"
          onClick={() => trackLandingAndFlush("signup_cta_click", { placement: "popup", page })}
          className="audit-btn audit-btn-lg audit-btn-primary mt-7 w-full"
        >
          {ctaLabel}
          <ArrowUpRight className="h-[17px] w-[17px]" strokeWidth={2.2} />
        </a>

        <p className="mt-4 flex items-center justify-center gap-2 text-[13px] text-[var(--muted)]">
          <ShieldCheck className="h-4 w-4" strokeWidth={1.8} />
          {footnote} All seven tools are on the free plan.
        </p>
      </div>
    </div>
  );
}
