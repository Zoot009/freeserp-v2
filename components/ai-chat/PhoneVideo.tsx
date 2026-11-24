"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

// The demo video in a phone frame. It plays (muted, looping) only while it's on screen, so it neither costs data nor
// distracts once the visitor has scrolled past, and the file is only fetched when it first comes into view. With
// reduced motion it doesn't start by itself: the poster shows, and a tap (or the sound button) plays it.

export function PhoneVideo({ src, poster, label }: { src: string; poster: string; label: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = video.current!;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (v.preload !== "auto") v.preload = "auto";
          v.play().catch(() => {}); // a browser may still refuse; the poster stays
        } else v.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const togglePlay = () => {
    const v = video.current!;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  const toggleSound = () => {
    const v = video.current!;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted && v.paused) v.play().catch(() => {});
  };

  return (
    <div style={{ position: "relative", width: "min(320px, 78vw)", aspectRatio: "9 / 16" }}>
      {/* The phone: a dark bezel with a rounded screen. */}
      <div style={{ position: "absolute", inset: 0, borderRadius: 44, padding: 10, background: "#0b0b12", boxShadow: "0 40px 90px rgba(4,40,140,.45), inset 0 0 0 2px rgba(255,255,255,.08)" }}>
        <video ref={video} src={src} poster={poster} muted loop playsInline preload="none" aria-label={label} onClick={togglePlay}
          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 34, display: "block", background: "#111", cursor: "pointer" }} />
        <span aria-hidden="true" style={{ position: "absolute", top: 18, left: "50%", transform: "translateX(-50%)", width: 84, height: 22, borderRadius: 99, background: "#0b0b12" }} />
      </div>
      <button type="button" onClick={toggleSound} className="fs-ai-btn" aria-label={muted ? "Turn the sound on" : "Turn the sound off"} aria-pressed={!muted}
          style={{ position: "absolute", right: 22, bottom: 24, width: 44, height: 44, borderRadius: 999, border: "none", cursor: "pointer", display: "grid", placeItems: "center",
            background: "rgba(255,255,255,.92)", color: "#0b0b12", boxShadow: "0 6px 18px rgba(0,0,0,.25)" }}>
          {muted ? <VolumeX size={20} aria-hidden="true" /> : <Volume2 size={20} aria-hidden="true" />}
        </button>
    </div>
  );
}
