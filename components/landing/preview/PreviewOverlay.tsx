"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { buildPreview, normalizeDomain, type PreviewData } from "@/lib/landing/previewData";
import { savePendingDomain } from "@/lib/landing/pendingDomain";
import { getVisitorCountry } from "@/lib/landing/geo";
import { useAppUrl } from "@/lib/useAppUrl";
import { trackLanding } from "@/components/landing/track";
import PreviewShell from "./PreviewShell";
import PreviewSkeleton from "./PreviewSkeleton";
import PreviewModal from "./PreviewModal";
import PreviewDashboard, { type PreviewDict } from "./PreviewDashboard";

/**
 * Full-screen takeover: dashboard skeleton, then the filled sample dashboard.
 *
 * History behaviour — the preview is a state the visitor can back out of, so it
 * gets a history entry (`?domain=`). Consequences, all deliberate:
 *   - Browser Back closes the preview instead of leaving the site.
 *   - The URL is shareable and appears in analytics as a distinct page view.
 *   - Reloading, or arriving on a shared link, re-opens the preview directly.
 *
 * pushState/replaceState rather than router.push because this is client-side UI
 * state on an otherwise static page — Next explicitly supports the native
 * History API here, and it avoids making the landing route dynamic.
 *
 * The hold is not theatre for its own sake: the three genuinely async pieces
 * (visitor country for the flag column, the locale date string, and the favicon
 * image) are resolved DURING it. Previously they landed after the dashboard
 * mounted and each one visibly reflowed a column.
 */

export const PREVIEW_PARAM = "domain";

/**
 * Three phases:
 *   skeleton -> the shell is up, body is shimmer bars, a load bar runs on top
 *   reveal   -> the table appears ALREADY BLURRED, and the values behind the
 *               blur pop in one by one at scattered moments — through the blur
 *               that reads as a crawl progressively filling the dashboard.
 *               Nothing is ever legible.
 *   locked   -> the fill has played out; the centred prompt appears and the
 *               table becomes the click-to-unlock trigger
 *
 * The unlock card itself opens on CLICK (state `unlocked`), never on a timer —
 * a prompt that covers the dashboard uninvited hides the thing it is selling.
 */
const HOLD_MS = 2400;
/**
 * The crawl window. Rows land sequentially at ROW_MS (1.25s) apart with their
 * cells pacing left-to-right inside each row, and the rail summaries close it
 * out around 5.9s — long on purpose, because a check that visibly takes time
 * is what makes it read as real work rather than a canned animation.
 */
const FILL_MS = 6200;

type Phase = "skeleton" | "reveal" | "locked";

export type PreviewOverlayDict = PreviewDict;

export type PreviewController = {
  open: (rawDomain: string) => boolean;
};

/** ISO-3166 alpha-2 -> regional-indicator flag emoji. */
function flagOf(code: string | null): string | null {
  if (!code || code.length !== 2) return null;
  const upper = code.toUpperCase();
  if (!/^[A-Z]{2}$/.test(upper)) return null;
  return String.fromCodePoint(...[...upper].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

export default function PreviewOverlay({
  dict,
  locale,
  controllerRef,
}: {
  dict: PreviewOverlayDict;
  locale: string;
  /** Filled with an `open()` the Hero calls when its form is submitted. */
  controllerRef: React.RefObject<PreviewController | null>;
}) {
  const [data, setData] = useState<PreviewData | null>(null);
  const [phase, setPhase] = useState<Phase>("skeleton");
  const [unlocked, setUnlocked] = useState(false);
  const [flag, setFlag] = useState<string | null>(null);
  const [checkedAt, setCheckedAt] = useState("");
  const [favicon, setFavicon] = useState<string | null>(null);
  const appUrl = useAppUrl();

  // Whether WE pushed the history entry. Determines how close() unwinds: a
  // pushed entry is popped with back(), whereas a preview opened straight from a
  // shared URL has nothing of ours to pop.
  const pushedRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Open preview being measured: domain + when it opened. Also acts as the
  // "already reported closed" latch — emitClosed() nulls it, so the two paths
  // that can both run for one dismissal (close() calling history.back(), then the
  // popstate handler it triggers) emit exactly one preview_closed between them.
  const openRef = useRef<{ domain: string; openedAt: number } | null>(null);
  const unlockShownRef = useRef(false);
  // close() and the popstate handler are stable callbacks that must not re-create
  // on every phase change, so the phase they report is mirrored into a ref.
  const phaseRef = useRef<Phase>("skeleton");

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  // Idempotent: a second call for the same dismissal is a no-op.
  const emitClosed = useCallback(() => {
    const open = openRef.current;
    if (!open) return;
    openRef.current = null;
    trackLanding("preview_closed", {
      domain: open.domain,
      phase: phaseRef.current,
      dwellMs: Date.now() - open.openedAt,
      unlockShown: unlockShownRef.current,
    });
  }, []);

  const close = useCallback(() => {
    emitClosed();
    if (pushedRef.current) {
      pushedRef.current = false;
      window.history.back(); // fires popstate, which clears state below
      return;
    }
    const url = new URL(window.location.href);
    url.searchParams.delete(PREVIEW_PARAM);
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    clearTimers();
    setData(null);
    setPhase("skeleton");
  }, [clearTimers, emitClosed]);

  const start = useCallback(
    (rawDomain: string, push: boolean) => {
      const preview = buildPreview(rawDomain);
      if (!preview) return false;

      setData(preview);
      setPhase("skeleton");
      setUnlocked(false);
      setFlag(null);
      setFavicon(null);

      // `push` distinguishes the two ways in: true = the hero form was submitted,
      // false = the preview was restored from ?domain= (shared link, reload, or a
      // back-forward into it). Without it, restores would inflate hero conversion.
      phaseRef.current = "skeleton";
      unlockShownRef.current = false;
      openRef.current = { domain: preview.domain, openedAt: Date.now() };
      trackLanding("preview_opened", { domain: preview.domain, source: push ? "submit" : "url" });

      // Saved as soon as the preview opens, not at CTA click: a visitor who
      // browses away and signs up days later should still land in a project
      // named after the domain they looked up.
      savePendingDomain(preview.domain);

      // --- resolved during the hold, so the filled state paints complete ---
      setCheckedAt(
        new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short", year: "numeric" }).format(new Date()),
      );
      void getVisitorCountry().then((code) => setFlag(flagOf(code)));

      const iconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(preview.domain)}&sz=64`;
      const img = new Image();
      img.onload = () => setFavicon(iconUrl);
      img.onerror = () => setFavicon(null); // falls back to the initial tile
      img.src = iconUrl;

      clearTimers();
      timersRef.current.push(
        setTimeout(() => setPhase("reveal"), HOLD_MS),
        setTimeout(() => {
          setPhase("locked");
          // No dwellMs here: reaching `locked` is a fixed HOLD_MS + FILL_MS timer,
          // so the duration would be the same constant on every row. The event
          // firing at all is the signal — the visitor sat through the whole hold
          // instead of bailing, which is the single biggest drop-off on the page.
          trackLanding("preview_locked", { domain: preview.domain });
        }, HOLD_MS + FILL_MS),
      );

      if (push) {
        const url = new URL(window.location.href);
        url.searchParams.set(PREVIEW_PARAM, preview.domain);
        window.history.pushState(null, "", url.pathname + url.search + url.hash);
        pushedRef.current = true;
      }
      return true;
    },
    [locale, clearTimers],
  );

  useEffect(() => {
    controllerRef.current = { open: (raw) => start(raw, true) };
  }, [controllerRef, start]);

  useEffect(() => clearTimers, [clearTimers]);

  // Arriving with ?domain= already set (shared link, reload, or a back-forward
  // into the preview) opens it without pushing another entry.
  //
  // Reads window.location rather than useSearchParams deliberately: this page is
  // statically prerendered for every locale, and useSearchParams would force it
  // dynamic or require a Suspense boundary. Same reasoning as lib/useAppUrl.ts.
  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get(PREVIEW_PARAM);
    if (initial && normalizeDomain(initial)) start(initial, false);

    const onPop = () => {
      const domain = new URLSearchParams(window.location.search).get(PREVIEW_PARAM);
      pushedRef.current = false;
      if (domain && normalizeDomain(domain)) {
        start(domain, false);
      } else {
        // Covers the browser Back button, which dismisses the preview without
        // going through close(). When close() DID run it already emitted, and
        // emitClosed() is a no-op the second time.
        emitClosed();
        clearTimers();
        setData(null);
        setPhase("skeleton");
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [start, clearTimers, emitClosed]);

  // Lock the page behind the overlay so a scroll gesture moves the dashboard,
  // not the landing page underneath it.
  useEffect(() => {
    if (!data) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [data]);

  useEffect(() => {
    if (!data) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [data, close]);

  return (
    <AnimatePresence>
      {data && (
        <motion.div
          key="fsp"
          className="fsp fsp-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          role="dialog"
          aria-modal="true"
          aria-busy={phase === "skeleton"}
          aria-label={dict.tableTitle}
        >
          {/* The only thing announced during the hold — the skeleton itself is
              aria-hidden, so without this the wait would be silent. */}
          <span
            aria-live="polite"
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              overflow: "hidden",
              clip: "rect(0 0 0 0)",
              whiteSpace: "nowrap",
            }}
          >
            {phase === "skeleton" ? dict.loadingAria : ""}
          </span>

          {phase === "skeleton" && (
            <span className="fsp-loadbar" aria-hidden>
              <i />
            </span>
          )}

          <PreviewShell
            dict={dict}
            domain={data.domain}
            brand={data.brand}
            favicon={favicon}
            onClose={close}
          >
            {/* Cross-fade in place. No slide: a 14px entrance after a
                pixel-matched skeleton reintroduces the exact jump the skeleton
                exists to prevent. Rows do their own staggered rise inside. */}
            <motion.div
              key={phase === "skeleton" ? "skeleton" : "filled"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            >
              {phase === "skeleton" ? (
                <PreviewSkeleton />
              ) : (
                <PreviewDashboard
                  data={data}
                  dict={dict}
                  flag={flag}
                  checkedAt={checkedAt}
                  locked={phase === "locked"}
                  unlockOpen={unlocked}
                  // Wrapped here rather than in PreviewDashboard so the click and
                  // the keyboard (Enter/Space) paths are both covered by one edit.
                  onRequestUnlock={() => {
                    unlockShownRef.current = true;
                    trackLanding("preview_unlock_requested", {
                      domain: data.domain,
                      dwellMs: openRef.current ? Date.now() - openRef.current.openedAt : undefined,
                    });
                    setUnlocked(true);
                  }}
                >
                  <AnimatePresence>
                    {unlocked && (
                      <PreviewModal
                        key="unlock"
                        dict={dict}
                        domain={data.domain}
                        onDismiss={() => setUnlocked(false)}
                        signupHref={appUrl(
                          // The domain also rides in the query string: cookies
                          // can be blocked, and the app reads either channel.
                          `/signup?${PREVIEW_PARAM}=${encodeURIComponent(data.domain)}`,
                        )}
                      />
                    )}
                  </AnimatePresence>
                </PreviewDashboard>
              )}
            </motion.div>
          </PreviewShell>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
