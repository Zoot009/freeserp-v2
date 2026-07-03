"use client";

import { useRef, useState } from "react";
import { BACKEND_URL, COLORS, appUrl } from "@/components/site/constants";
import { POPULAR_LOCATIONS, ALL_LOCATIONS, flagFor } from "@/components/site/locations";
import { pushDataLayer } from "@/lib/gtm";

type Device = "desktop" | "mobile";

/** "whatsmyserp.com" → "Whatsmyserp" — the site-name line, like Google's. */
function siteName(domain: string): string {
  const base = domain.replace(/^www\./, "").split(".")[0] || domain;
  return base.charAt(0).toUpperCase() + base.slice(1);
}

/** A URL → "domain › path › bits" breadcrumb, like Google's result URL line. */
function breadcrumb(url: string): string {
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    const host = u.hostname.replace(/^www\./, "");
    const segs = u.pathname.split("/").filter(Boolean);
    return [host, ...segs].join(" › ");
  } catch {
    return url;
  }
}

type Competitor = {
  position: number;
  domain: string;
  url: string;
  title: string;
  snippet: string;
};

type CheckResult = {
  position: number | null;
  competitors: Competitor[];
};

type Phase =
  | { kind: "idle" }
  | { kind: "loading"; keyword: string }
  | { kind: "done"; keyword: string; domain: string; result: CheckResult }
  | { kind: "error"; message: string }
  // Hitting the anonymous-check limit is expected behaviour, not a failure —
  // it gets its own phase so it can be shown as a calm notice, not a red error.
  | { kind: "ratelimit"; message: string }
  | { kind: "timeout" };

// The v2 /api/check runs the DataForSEO lookup synchronously and can take up to
// ~45s to return, so give the request a little headroom before we give up.
const CHECK_TIMEOUT_MS = 60_000;

/** A single SERP row, as returned by the v2 /api/check response. */
type SerpRow = {
  position: number;
  domain: string;
  url: string;
  title: string;
  snippet: string | null;
};

export function SerpForm() {
  const [domain, setDomain] = useState("");
  const [keyword, setKeyword] = useState("");
  const [country, setCountry] = useState("in");
  const [device, setDevice] = useState<Device>("desktop");
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });

  const abortRef = useRef<AbortController | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const kw = keyword.trim();
    const dom = domain.trim();
    if (!kw || !dom) return;

    // Cancel any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    // Bound the (synchronous, potentially ~45s) check so a stuck request can't
    // hang the UI — the abort surfaces as the friendly "taking longer" notice.
    const timeout = setTimeout(() => controller.abort(), CHECK_TIMEOUT_MS);
    setPhase({ kind: "loading", keyword: kw });

    try {
      const res = await fetch(`${BACKEND_URL}/api/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: kw, domain: dom, country, device }),
        signal: controller.signal,
      });

      if (res.status === 429) {
        setPhase({ kind: "ratelimit", message: "You've reached the free check limit." });
        return;
      }

      if (res.status === 504) {
        setPhase({ kind: "timeout" });
        return;
      }

      if (!res.ok) {
        setPhase({ kind: "error", message: `Server error: ${res.status} ${res.statusText}` });
        return;
      }

      // v2 returns the SERP inline: `results` is the top organic list (which
      // includes the target domain when it ranks) and `position` is its rank.
      const data = (await res.json()) as {
        position?: number | null;
        results?: SerpRow[];
      };

      pushDataLayer({ event: "serp_check_completed" });
      setPhase({
        kind: "done",
        keyword: kw,
        domain: dom,
        result: {
          position: data.position ?? null,
          competitors: (data.results ?? []).map((r) => ({
            position: r.position,
            domain: r.domain,
            url: r.url,
            title: r.title,
            snippet: r.snippet ?? "",
          })),
        },
      });
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        setPhase({ kind: "timeout" });
      } else {
        setPhase({ kind: "error", message: "Could not reach the server. Check your connection and try again." });
      }
    } finally {
      clearTimeout(timeout);
    }
  };

  const reset = () => {
    abortRef.current?.abort();
    setPhase({ kind: "idle" });
  };

  const isChecking = phase.kind === "loading";
  const submitDisabled = isChecking || !keyword.trim() || !domain.trim();

  // ─── Form (always visible) + results panel rendered below it once done ────
  return (
    <>
      <div className="fs-serp-card-wrap" style={{ position: "relative", maxWidth: 920, margin: "0 auto" }}>
      <div className="fs-serp-halo" aria-hidden="true" />
      <div
        className="fs-serp-card"
        style={{
          position: "relative",
          background: "#fff",
          borderRadius: 20,
          padding: 28,
          boxShadow: "0 20px 60px rgba(0,0,0,.18)",
          textAlign: "left",
        }}
      >
        <form onSubmit={submit}>
          <div
            className="fs-form-grid"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}
          >
            <label style={{ display: "block" }}>
              <span style={labelStyle}>Domain</span>
              <input
                type="text"
                required
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="example.com"
                disabled={isChecking}
                className="fs-serp-input"
                style={inputStyle}
              />
            </label>
            <label style={{ display: "block" }}>
              <span style={labelStyle}>Keyword</span>
              <input
                type="text"
                required
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="best running shoes"
                disabled={isChecking}
                className="fs-serp-input"
                style={inputStyle}
              />
            </label>
          </div>

          <div
            className="fs-form-grid"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}
          >
            <label style={{ display: "block" }}>
              <span style={labelStyle}>Country</span>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                disabled={isChecking}
                aria-label="Country"
                className="fs-serp-input"
                style={{
                  ...inputStyle,
                  background: "#fff",
                  appearance: "none",
                  cursor: isChecking ? "default" : "pointer",
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
            </label>
            <div>
              <span style={labelStyle}>Device</span>
              <div
                style={{
                  marginTop: 6,
                  background: COLORS.softGray,
                  padding: 4,
                  borderRadius: 10,
                  position: "relative",
                  display: "flex",
                  height: 46,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 4,
                    bottom: 4,
                    width: "calc(50% - 4px)",
                    background: COLORS.blue,
                    borderRadius: 8,
                    transition: "transform .3s ease",
                    transform: `translateX(${device === "desktop" ? 0 : "100%"})`,
                  }}
                />
                {(["desktop", "mobile"] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDevice(d)}
                    disabled={isChecking}
                    style={{
                      position: "relative",
                      background: "transparent",
                      border: "none",
                      flex: 1,
                      fontSize: 14,
                      fontWeight: 600,
                      color: device === d ? "#fff" : COLORS.black,
                      cursor: isChecking ? "default" : "pointer",
                      textTransform: "capitalize",
                      fontFamily: "inherit",
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitDisabled}
            className="fs-serp-submit"
            style={{
              width: "100%",
              background: COLORS.blue,
              color: "#fff",
              border: "none",
              padding: "16px 24px",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              cursor: submitDisabled ? "default" : "pointer",
              letterSpacing: "-.1px",
              boxShadow: "0 8px 22px rgba(4,84,255,.25)",
              opacity: submitDisabled ? 0.65 : 1,
              transition: "opacity .2s ease",
            }}
          >
            {isChecking ? "Checking…" : "Check Rankings →"}
          </button>
        </form>

        {/* Loading / polling status */}
        {isChecking && (
          <p
            style={{
              margin: "16px 0 0",
              fontSize: 13,
              lineHeight: 1.5,
              color: COLORS.gray,
              textAlign: "center",
            }}
          >
            Sit tight — checking &ldquo;{(phase as { keyword: string }).keyword}&rdquo;&hellip; this can take ~20–30
            seconds.
          </p>
        )}

        {/* Error — something actually went wrong */}
        {phase.kind === "error" && (
          <div
            style={{
              marginTop: 16,
              padding: "12px 16px",
              borderRadius: 10,
              background: COLORS.redBg,
              border: `1px solid ${COLORS.red}`,
              fontSize: 13,
              lineHeight: 1.5,
              color: COLORS.red,
            }}
          >
            {phase.message}
          </div>
        )}

        {/* Rate limit — an amber "heads-up" notice. Visible and attention-
            grabbing, but not a red error: hitting the limit is expected. */}
        {phase.kind === "ratelimit" && (
          <div
            style={{
              marginTop: 16,
              padding: "14px 16px",
              borderRadius: 10,
              background: COLORS.amberBg,
              border: `1.5px solid ${COLORS.amber}`,
              boxShadow: "0 6px 18px rgba(245,166,35,.25)",
              fontSize: 13.5,
              lineHeight: 1.5,
              color: COLORS.amberText,
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
            }}
          >
            <span>
              <strong style={{ fontWeight: 600 }}>{phase.message}</strong>{" "}
              <a
                href={appUrl("/signup")}
                onClick={() => pushDataLayer({ event: "cta_click" })}
                style={{ color: COLORS.blue, fontWeight: 700, textDecoration: "underline" }}
              >
                Sign up for more checks
              </a>
            </span>
          </div>
        )}

        {/* Timeout */}
        {phase.kind === "timeout" && (
          <div
            style={{
              marginTop: 16,
              padding: "12px 16px",
              borderRadius: 10,
              background: COLORS.softGray,
              border: `1px solid ${COLORS.border}`,
              fontSize: 13,
              lineHeight: 1.5,
              color: COLORS.gray,
            }}
          >
            This is taking longer than usual.{" "}
            <a
              href={appUrl("/signup")}
              onClick={() => pushDataLayer({ event: "cta_click" })}
              style={{ color: COLORS.blue, fontWeight: 600, textDecoration: "underline" }}
            >
              Sign up to finish your check
            </a>{" "}
            and get full results.
          </div>
        )}
      </div>
      </div>

      {phase.kind === "done" && (
        <div style={{ marginTop: 24 }}>
          <ResultsPanel phase={phase} onReset={reset} />
        </div>
      )}
    </>
  );
}

// ─── Results panel ─────────────────────────────────────────────────────────────

type DonePhase = {
  kind: "done";
  keyword: string;
  domain: string;
  result: CheckResult;
};

function ResultsPanel({ phase, onReset }: { phase: DonePhase; onReset: () => void }) {
  const { keyword, domain, result } = phase;
  const top10 = result.competitors.slice(0, 10);

  return (
    <div className="fs-serp-card-wrap" style={{ position: "relative", maxWidth: 920, margin: "0 auto" }}>
      <div className="fs-serp-halo" aria-hidden="true" />
      <div
        className="fs-serp-card"
        style={{
          position: "relative",
          background: "#fff",
          borderRadius: 20,
          padding: 28,
          boxShadow: "0 20px 60px rgba(0,0,0,.18)",
          textAlign: "left",
        }}
      >
        {/* Summary */}
        <p
          style={{
            margin: "0 0 20px",
            fontSize: 16,
            fontWeight: 600,
            color: COLORS.black,
            lineHeight: 1.4,
          }}
        >
          {result.position !== null ? (
            <>
              <span style={{ color: COLORS.blue }}>{domain}</span> ranks{" "}
              <span style={{ color: COLORS.green }}>#{result.position}</span> for &ldquo;{keyword}&rdquo;
            </>
          ) : (
            <>
              <span style={{ color: COLORS.blue }}>{domain}</span>{" "}
              isn&apos;t in the results we scanned for &ldquo;{keyword}&rdquo;
            </>
          )}
        </p>

        {/* Results list — styled like a Google SERP */}
        {top10.length === 0 ? (
          <p style={{ fontSize: 14, color: COLORS.gray, margin: "0 0 20px" }}>
            No results returned for this keyword.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
            {top10.map((row) => {
              const isOwn = row.domain.toLowerCase() === domain.toLowerCase();
              return (
                <div
                  key={row.position}
                  className="fs-serp-result-row"
                  style={{
                    padding: "14px 16px",
                    borderRadius: 12,
                    background: isOwn ? COLORS.blueBg : "transparent",
                    border: `1px solid ${isOwn ? COLORS.blue : "transparent"}`,
                  }}
                >
                  {/* site line — favicon + name + URL breadcrumb */}
                  <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://www.google.com/s2/favicons?sz=64&domain=${encodeURIComponent(row.domain)}`}
                      alt=""
                      width={28}
                      height={28}
                      onError={(e) => {
                        e.currentTarget.style.visibility = "hidden";
                      }}
                      style={{
                        flexShrink: 0,
                        borderRadius: "50%",
                        border: `1px solid ${COLORS.border}`,
                        background: "#fff",
                      }}
                    />
                    <div style={{ minWidth: 0, lineHeight: 1.3 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 14, color: COLORS.black }}>
                          {siteName(row.domain)}
                        </span>
                        {isOwn && (
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              letterSpacing: ".06em",
                              textTransform: "uppercase",
                              color: "#fff",
                              background: COLORS.blue,
                              padding: "2px 7px",
                              borderRadius: 100,
                            }}
                          >
                            Your site
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: 12.5,
                          color: COLORS.gray,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {breadcrumb(row.url)}
                      </div>
                    </div>
                  </div>

                  {/* title — clickable, like a Google result link */}
                  <a
                    href={row.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-block",
                      margin: "6px 0 0",
                      fontSize: 19,
                      fontWeight: 500,
                      color: COLORS.blue,
                      lineHeight: 1.3,
                      textDecoration: "none",
                      letterSpacing: "-.2px",
                    }}
                  >
                    {row.title || row.domain}
                  </a>

                  {/* snippet */}
                  {row.snippet && (
                    <p
                      style={{
                        margin: "4px 0 0",
                        fontSize: 14,
                        color: COLORS.gray,
                        lineHeight: 1.55,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {row.snippet}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Login gate */}
        <div
          style={{
            padding: "20px 22px",
            borderRadius: 12,
            border: `1px solid ${COLORS.border}`,
            background: COLORS.softGray,
            textAlign: "center",
          }}
        >
          <p style={{ margin: "0 0 14px", fontSize: 14, lineHeight: 1.5, color: COLORS.gray }}>
            This free check scans just the first page or two of results. Log in to see the full
            report and competitor analysis.
          </p>
          <a
            href={appUrl("/login")}
            style={{
              display: "inline-block",
              background: COLORS.blue,
              color: "#fff",
              padding: "13px 28px",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              textDecoration: "none",
              letterSpacing: "-.1px",
              boxShadow: "0 8px 22px rgba(4,84,255,.25)",
            }}
          >
            Log in to view the full report
          </a>
        </div>

        {/* Reset */}
        <p style={{ margin: "16px 0 0", textAlign: "center", fontSize: 13 }}>
          <button
            type="button"
            onClick={onReset}
            style={{
              background: "none",
              border: "none",
              color: COLORS.blue,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "underline",
              fontFamily: "inherit",
              padding: 0,
            }}
          >
            Check another keyword
          </button>
        </p>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: COLORS.gray,
  letterSpacing: ".08em",
  textTransform: "uppercase",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  marginTop: 6,
  padding: "12px 14px",
  border: `1px solid ${COLORS.border}`,
  borderRadius: 10,
  fontSize: 15,
  outline: "none",
  fontFamily: "inherit",
  color: COLORS.black,
};
