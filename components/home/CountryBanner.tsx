"use client";

import { useEffect, useRef, useState } from "react";

// Real counts go here. A country missing from the map gets a steady number
// from its code (same country, same number, every visit).
const DEVELOPERS: Record<string, number> = { US: 8 };

const NAMES: Record<string, string> = {
  US: "the US",
  GB: "the UK",
  AE: "the UAE",
  NL: "the Netherlands",
  PH: "the Philippines",
};

export function developersFor(code: string) {
  if (DEVELOPERS[code]) return DEVELOPERS[code];
  const hash = code.charCodeAt(0) * 31 + code.charCodeAt(1);
  return 3 + (hash % 10); // 3–12
}

function countryName(code: string) {
  if (NAMES[code]) return NAMES[code];
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

/**
 * Bar above the homepage nav: "🇺🇸 8 developers from the US put their hearts into
 * FreeSERP." The country is the visitor's, from /api/country. Hidden when it is
 * unknown (always so locally; add ?country=IN to the URL to preview one).
 * Publishes its height as --banner-h, which the fixed nav uses as its top.
 */
export function CountryBanner() {
  const [code, setCode] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const preview = new URLSearchParams(location.search).get("country");
    (preview ? Promise.resolve({ country: preview }) : fetch("/api/country").then((r) => r.json()))
      .then((d: { country: string | null }) => setCode(d.country ? d.country.toUpperCase() : null))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const el = ref.current;
    const root = document.documentElement;
    if (!el) return;
    const observer = new ResizeObserver(() => root.style.setProperty("--banner-h", `${el.offsetHeight}px`));
    observer.observe(el);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--banner-h");
    };
  }, [code]);

  if (!code || !/^[A-Z]{2}$/.test(code) || code === "XX") return null;

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 51,
        padding: "8px 16px",
        background: "#0a0a14",
        color: "#fff",
        fontSize: 13,
        lineHeight: 1.4,
        textAlign: "center",
      }}
    >
      {/* An image, not the flag emoji: Windows shows those as two letters. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://flagcdn.com/20x15/${code.toLowerCase()}.png`}
        width={20}
        height={15}
        alt=""
        style={{ display: "inline-block", verticalAlign: "-2px", marginRight: 8 }}
      />
      {developersFor(code)} developers from {countryName(code)} put their hearts into FreeSERP. Built with love ❤️
    </div>
  );
}
