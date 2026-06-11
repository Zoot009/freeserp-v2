"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * A soft, translucent blue ball that replaces the pointer.
 * Only active on the home page, and only while the pointer is over the
 * hero area — down to the bottom of the dashboard image (#fs-cursor-zone).
 * Below that, the native cursor takes over again.
 * Disabled on touch devices.
 */
export function CursorBall() {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  const enabled = pathname === "/";

  useEffect(() => {
    if (!enabled) return;
    const ball = ref.current;
    if (!ball) return;
    // No hovering pointer on touch devices — skip entirely.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const root = document.documentElement;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let bx = mx;
    let by = my;
    let hasMoved = false;
    let inZone = false;
    let raf = 0;
    let zoneBoundaryY = Infinity;

    const updateZoneBoundary = () => {
      const zone = document.getElementById("fs-cursor-zone");
      zoneBoundaryY = zone ? zone.getBoundingClientRect().bottom : Infinity;
    };
    updateZoneBoundary();

    const within = (clientY: number) => clientY <= zoneBoundaryY;

    // Enter / leave the zone: show the ball + hide the native cursor,
    // or hand control back to the native cursor.
    const setZone = (next: boolean) => {
      if (next === inZone) return;
      inZone = next;
      root.classList.toggle("fs-no-cursor", next);
      ball.style.opacity = next ? "1" : "0";
    };

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      hasMoved = true;
      setZone(within(e.clientY));
    };
    const onLeave = () => setZone(false);
    const onScroll = () => {
      updateZoneBoundary();
      if (hasMoved) setZone(within(my));
    };

    const tick = () => {
      // ease toward the real pointer — tight enough to click accurately,
      // soft enough to keep a subtle trailing feel
      bx += (mx - bx) * 0.3;
      by += (my - by) * 0.3;
      ball.style.transform = `translate3d(${bx}px, ${by}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("fs-no-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;
  return <div ref={ref} className="fs-cursor-ball" aria-hidden="true" />;
}
