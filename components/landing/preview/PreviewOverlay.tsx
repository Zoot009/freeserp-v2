"use client";

// The replica dashboard's styles, imported HERE rather than in the landing
// layout so they load lazily with this dynamically-imported component instead of
// render-blocking every landing page paint. Everything under it (skeleton,
// dashboard, modal) shares these .fsp-* rules.
import "@/app/landing/preview.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { buildPreview, normalizeDomain, type PreviewData } from "@/lib/landing/previewData";
import { savePendingDomain } from "@/lib/landing/pendingDomain";
import { getVisitorCountry } from "@/lib/landing/geo";
import { fetchPageScore, type PageScore } from "@/lib/landing/pageScore";
import { fetchRealRank, type RealRank } from "@/lib/landing/rank";
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
 *   locked   -> the fill has played out; the data blurs and the unlock card
 *               opens over it
 *
 * The card opens at the END of the sequence rather than on arrival: by then the
 * visitor has watched the dashboard fill in, so the prompt lands on something
 * they already want instead of covering it before they have seen it. Dismissing
 * it leaves the blurred dashboard, and clicking the data reopens it.
 */
const HOLD_MS = 2400;
/**
 * The "analysis complete" beat between the crawl finishing and the unlock card.
 * A ring races to 100% with a checkmark and a sweep crosses the body, so the ask
 * lands on a scan that visibly just completed. Long enough for the ring fill
 * (~0.85s) + the checkmark pop to read, short enough not to stall the funnel.
 */
const SCAN_MS = 1300;
/**
 * The crawl window. Rows land sequentially at ROW_MS (1.25s) apart with their
 * cells pacing left-to-right inside each row, and the rail summaries close it
 * out around 5.9s — long on purpose, because a check that visibly takes time
 * is what makes it read as real work rather than a canned animation.
 */
const FILL_MS = 6200;

type Phase = "skeleton" | "reveal" | "locked";

/** Lifecycle of a slot backed by a live lookup. */
export type LiveStatus = "loading" | "ready" | "unavailable";

export type PreviewOverlayDict = PreviewDict;

export type PreviewController = {
  /** Format-only check: is this a plausible host? No side effects. */
  canOpen: (rawDomain: string) => boolean;
  /** Open the preview. Returns false if the input wasn't a plausible host. */
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
  // The brief "analysis complete" beat, between the crawl finishing and the
  // unlock card rising. Distinct from `unlocked` so the card is not shown yet.
  const [scanning, setScanning] = useState(false);
  const [flag, setFlag] = useState<string | null>(null);
  const [checkedAt, setCheckedAt] = useState("");
  const [favicon, setFavicon] = useState<string | null>(null);
  // The one genuinely measured figure. Null until the audit lands — or forever,
  // if it can't be had, in which case the sample score stays.
  // Three states, not two. A slot backed by a live lookup must never show
  // blurred SAMPLE data while that lookup is in flight — it would flash a fake
  // number and then replace it with the real one. While loading it shows a
  // shimmer; only a lookup that actually failed falls back to the sample.
  const [pageScore, setPageScore] = useState<PageScore | null>(null);
  const [scoreStatus, setScoreStatus] = useState<LiveStatus>("loading");
  const [realRank, setRealRank] = useState<RealRank | null>(null);
  const [rankStatus, setRankStatus] = useState<LiveStatus>("loading");
  const scoreAbortRef = useRef<AbortController | null>(null);
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
    scoreAbortRef.current?.abort();
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
      setScanning(false);
      setFlag(null);
      setFavicon(null);
      setPageScore(null);
      setScoreStatus("loading");
      setRealRank(null);
      setRankStatus("loading");

      // One abort for every live lookup this preview starts, so closing it (or
      // opening another domain) stops work nobody will see.
      scoreAbortRef.current?.abort();
      const scoreAbort = new AbortController();
      scoreAbortRef.current = scoreAbort;

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
      // Geo first: the flag column and the SERP country come from the same
      // answer, so the rank we measure matches the flag we draw beside it.
      void getVisitorCountry().then((code) => {
        if (scoreAbort.signal.aborted) return;
        setFlag(flagOf(code));
        void fetchRealRank(preview.domain, code, scoreAbort.signal).then((rank) => {
          if (scoreAbort.signal.aborted) return;
          setRealRank(rank);
          setRankStatus(rank ? "ready" : "unavailable");
        });
      });

      // Kick the real audit off HERE, at the top of the skeleton, so it has the
      // whole loading sequence to complete. Cached domains come back instantly;
      // an uncached one takes a few seconds and lands mid-crawl, which is
      // exactly when a real number arriving looks right. If it never arrives,
      // the sample score simply stays.
      void fetchPageScore(preview.domain, scoreAbort.signal).then((real) => {
        if (scoreAbort.signal.aborted) return;
        setPageScore(real);
        setScoreStatus(real ? "ready" : "unavailable");
      });

      const iconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(preview.domain)}&sz=64`;
      const img = new Image();
      img.onload = () => setFavicon(iconUrl);
      img.onerror = () => setFavicon(null); // falls back to the initial tile
      img.src = iconUrl;

      clearTimers();
      timersRef.current.push(
        setTimeout(() => setPhase("reveal"), HOLD_MS),
        // The crawl finishes: lock the data and play the "analysis complete"
        // beat (ring to 100% + checkmark + sweep) BEFORE the card.
        setTimeout(() => {
          setPhase("locked");
          setScanning(true);
          // Reaching `locked` = the visitor sat through the whole HOLD_MS +
          // FILL_MS crawl, the single biggest drop-off on the page. No dwellMs:
          // it is a fixed timer, so the event firing at all is the signal. Fires
          // as the data locks and the scan beat starts — not when the card rises,
          // which is now SCAN_MS behind it.
          trackLanding("preview_locked", { domain: preview.domain });
        }, HOLD_MS + FILL_MS),
        // The beat is done, so the card rises — the dashboard has been seen
        // filling in and the scan has visibly completed, so the ask lands on a
        // page the visitor already wants. Dismissing it leaves the blurred
        // dashboard, and clicking the data brings the card back (see `armed`).
        setTimeout(() => {
          setScanning(false);
          setUnlocked(true);
          // The card opens on its own here — this, not a click, is what makes the
          // unlock prompt seen, so unlockShown flips as it rises. preview_closed
          // reports it, so a close event alone tells you if they reached the ask.
          unlockShownRef.current = true;
        }, HOLD_MS + FILL_MS + SCAN_MS),
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
    controllerRef.current = {
      canOpen: (raw) => normalizeDomain(raw) != null,
      open: (raw) => start(raw, true),
    };
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
                  pageScore={pageScore}
                  scoreStatus={scoreStatus}
                  realRank={realRank}
                  rankStatus={rankStatus}
                  locked={phase === "locked"}
                  scanning={scanning}
                  unlockOpen={unlocked}
                  // Now that the card opens itself at `locked`, this path is only
                  // reached by a visitor who DISMISSED it and then clicked the
                  // blurred data to bring it back — a stronger signal than the
                  // automatic open, so it keeps its own event. Wrapped here rather
                  // than in PreviewDashboard so the click and the keyboard
                  // (Enter/Space) paths are both covered by one edit.
                  onRequestUnlock={() => {
                    trackLanding("preview_unlock_reopened", {
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
