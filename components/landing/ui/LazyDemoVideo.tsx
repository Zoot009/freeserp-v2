"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The hero demo clip, loaded only once it scrolls near the viewport.
 *
 * A plain <video autoplay muted loop preload="none"> does NOT defer: autoplay
 * overrides preload="none", so the browser fetches the ~1MB clip on initial
 * load even though it sits below the fold. That single file was the bulk of the
 * landing page's payload (and its Lighthouse "enormous network payload" flag).
 *
 * Here the <source> elements are withheld until an IntersectionObserver reports
 * the element is near the viewport; only then do they mount, the browser loads
 * the clip, and autoplay kicks in. Before that, nothing is fetched — so the
 * initial load (and a Lighthouse run that never scrolls) never pays for it.
 */
export function LazyDemoVideo({ label, className }: { label: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Already in view on mount (large desktop where the card sits high)? Load now.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      // A small margin so it's ready by the time it's actually looked at, without
      // loading on a page the visitor never scrolls.
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      width={900}
      height={500}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      className={className}
    >
      {/* Withheld until near-viewport — this is what actually defers the fetch. */}
      {show && (
        <>
          <source src="/freeserpchecker.webm" type="video/webm" />
          <source src="/freeserpchecker.mp4" type="video/mp4" />
        </>
      )}
    </video>
  );
}
