"use client";

import { useState } from "react";
import { COLORS, appUrl } from "@/components/site/constants";
import { POPULAR_LOCATIONS, ALL_LOCATIONS, flagFor } from "@/components/site/locations";

export function HeroSearch() {
  const [keyword, setKeyword] = useState("");
  const [country, setCountry] = useState("in");
  const [checking, setChecking] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const kw = keyword.trim();
    if (!kw || checking) return;
    setChecking(true);
    // The marketing site doesn't run checks itself — hand the visitor to the
    // app's sign-up page, carrying the keyword + country for the app to use.
    setTimeout(() => {
      window.location.href = appUrl(
        `/signup?keyword=${encodeURIComponent(kw)}&country=${encodeURIComponent(country)}`,
      );
    }, 1100);
  };

  const disabled = checking || !keyword.trim();

  return (
    <div style={{ maxWidth: 520, margin: "32px auto 0" }}>
      <form
        onSubmit={submit}
        className="fs-hero-search-form"
        style={{
          display: "flex",
          background: "#fff",
          borderRadius: 100,
          padding: 5,
          alignItems: "center",
          gap: 2,
        }}
      >
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          disabled={checking}
          aria-label="Country"
          className="fs-hero-search-select"
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            padding: "12px 6px 12px 14px",
            fontSize: 14,
            color: COLORS.black,
            maxWidth: 160,
            cursor: checking ? "default" : "pointer",
            fontFamily: "inherit",
          }}
        >
          <optgroup label="Popular">
            {POPULAR_LOCATIONS.map((l) => (
              <option key={`p-${l.code}`} value={l.code}>
                {l.name} {flagFor(l.code)}
              </option>
            ))}
          </optgroup>
          <optgroup label="All countries">
            {ALL_LOCATIONS.map((l) => (
              <option key={l.code} value={l.code}>
                {l.name} {flagFor(l.code)}
              </option>
            ))}
          </optgroup>
        </select>

        <span className="fs-hero-search-divider" style={{ width: 1, height: 22, background: COLORS.border, flexShrink: 0 }} />

        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter a keyword to check"
          disabled={checking}
          className="fs-hero-search-input"
          style={{
            flex: 1,
            minWidth: 0,
            border: "none",
            outline: "none",
            padding: "12px 14px",
            fontSize: 15,
            background: "transparent",
            color: COLORS.black,
          }}
        />

        <button
          className="fs-btn fs-hero-search-btn"
          type="submit"
          disabled={disabled}
          style={{
            background: "#000",
            color: "#fff",
            border: "none",
            padding: "10px 22px",
            borderRadius: 100,
            fontSize: 14,
            fontWeight: 600,
            cursor: disabled ? "default" : "pointer",
            whiteSpace: "nowrap",
            opacity: disabled ? 0.65 : 1,
            transition: "opacity .2s ease",
            flexShrink: 0,
          }}
        >
          {checking ? "Checking…" : "Check SERP"}
        </button>
      </form>

      {checking && (
        <p
          style={{
            margin: "14px 0 0",
            fontSize: 13,
            lineHeight: 1.5,
            color: "#fff",
            opacity: 0.9,
            textAlign: "center",
          }}
        >
          Sit tight — taking you to FreeSerp to run “{keyword.trim()}”. Create a free
          account to see your rankings.
        </p>
      )}
    </div>
  );
}
