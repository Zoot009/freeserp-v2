"use client";

import { useRef, useState } from "react";
import { BACKEND_URL, COLORS, appUrl } from "@/components/site/constants";
import { POPULAR_LOCATIONS, ALL_LOCATIONS, flagFor, countryName } from "@/components/site/locations";
import { LockIcon, GoogleLogo } from "@/components/site/icons";
import { pushDataLayer } from "@/lib/gtm";

type Device = "desktop" | "mobile";

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

/** ISO timestamp → a short "scanned …" relative label. */
function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return "just now";
  const secs = Math.max(0, Math.round((Date.now() - then) / 1000));
  if (secs < 45) return "just now";
  const mins = Math.round(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

/** Map a 0–100 keyword-difficulty score to a label + colour. */
function difficultyBadge(kd: number): { label: string; color: string } {
  if (kd <= 33) return { label: "Easy", color: COLORS.green };
  if (kd <= 66) return { label: "Medium", color: COLORS.amber };
  return { label: "Hard", color: COLORS.red };
}

// Shown as "People also check" when the SERP returned no related searches.
const FALLBACK_RELATED = ["free rank tracker", "serp checker api", "google position checker", "keyword rank tool"];

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
  difficulty: number | null;
  topDomain: string | null;
  resultsScanned: number;
  country: string;
  device: Device;
  checkedAt: string;
  relatedSearches: string[];
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
      // includes the target domain when it ranks), plus the rank and the metrics
      // the results panel surfaces (difficulty, top competitor, related searches…).
      const data = (await res.json()) as {
        position?: number | null;
        results?: SerpRow[];
        keywordDifficulty?: number | null;
        totalResults?: number;
        topCompetitor?: { domain: string; position: number } | null;
        country?: string;
        device?: Device;
        checkedAt?: string;
        serpFeatures?: { relatedSearches?: string[] };
      };

      const rows: Competitor[] = (data.results ?? []).map((r) => ({
        position: r.position,
        domain: r.domain,
        url: r.url,
        title: r.title,
        snippet: r.snippet ?? "",
      }));

      pushDataLayer({ event: "serp_check_completed" });
      setPhase({
        kind: "done",
        keyword: kw,
        domain: dom,
        result: {
          position: data.position ?? null,
          competitors: rows,
          difficulty: data.keywordDifficulty ?? null,
          topDomain: data.topCompetitor?.domain ?? rows[0]?.domain ?? null,
          resultsScanned: data.totalResults ?? rows.length,
          country: data.country ?? country,
          device: data.device ?? device,
          checkedAt: data.checkedAt ?? new Date().toISOString(),
          relatedSearches: (data.serpFeatures?.relatedSearches ?? []).slice(0, 6),
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
  const { position, competitors, difficulty, topDomain, resultsScanned, country, device, checkedAt, relatedSearches } =
    result;
  const visible = competitors.slice(0, 3);
  const locked = competitors.slice(3, 6);
  const kd = difficulty != null ? difficultyBadge(difficulty) : null;
  const pills = (relatedSearches.length ? relatedSearches : FALLBACK_RELATED).slice(0, 6);
  const signupHref = (kw: string) =>
    appUrl(`/signup?keyword=${encodeURIComponent(kw)}&country=${encodeURIComponent(country)}`);

  return (
    <div className="fs-serp-card-wrap" style={{ position: "relative", maxWidth: 920, margin: "0 auto" }}>
      <div className="fs-serp-halo" aria-hidden="true" />
      <div
        className="fs-serp-card"
        style={{
          position: "relative",
          background: "#fff",
          borderRadius: 20,
          padding: 22,
          boxShadow: "0 20px 60px rgba(0,0,0,.18)",
          textAlign: "left",
        }}
      >
        {/* Headline */}
        <p style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 700, color: COLORS.black, lineHeight: 1.3, letterSpacing: "-.3px" }}>
          {position !== null ? (
            <>
              <span style={{ color: COLORS.blue }}>{domain}</span> ranks{" "}
              <span style={{ color: COLORS.green }}>#{position}</span> for &ldquo;{keyword}&rdquo;
            </>
          ) : (
            <>
              <span style={{ color: COLORS.blue }}>{domain}</span>{" "}
              {`isn't ranking in the top ${resultsScanned} for “${keyword}” yet — but here's who is.`}
            </>
          )}
        </p>

        {/* Context subline */}
        <p style={{ margin: "0 0 14px", fontSize: 13, color: COLORS.subtle }}>
          {countryName(country)} · {device === "mobile" ? "Mobile" : "Desktop"} · scanned {timeAgo(checkedAt)}
        </p>

        {/* Stat tiles */}
        <div
          className="fs-serp-stats"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}
        >
          <StatTile label="Difficulty">
            {kd ? (
              <>
                {difficulty} <span style={{ fontSize: 14, fontWeight: 600, color: kd.color }}>{kd.label}</span>
              </>
            ) : (
              "—"
            )}
          </StatTile>
          <StatTile label="Top domain">{topDomain ?? "—"}</StatTile>
          <StatTile label="Results scanned">{resultsScanned}</StatTile>
        </div>

        {/* Top results */}
        <h3 style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 700, color: COLORS.black }}>Top results right now</h3>

        {visible.length === 0 ? (
          <p style={{ fontSize: 14, color: COLORS.gray, margin: "0 0 20px" }}>
            No results returned for this keyword.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: locked.length ? 8 : 16 }}>
            {visible.map((row, i) => (
              <ResultRow key={row.position} row={row} rank={i + 1} own={row.domain.toLowerCase() === domain.toLowerCase()} />
            ))}
          </div>
        )}

        {/* Locked competitor preview — the rest of the SERP, blurred behind the gate */}
        {locked.length > 0 && (
          <div style={{ position: "relative", marginBottom: 16 }}>
            <div className="fs-serp-locked">
              {locked.map((row, i) => (
                <ResultRow key={row.position} row={row} rank={i + 4} own={false} />
              ))}
            </div>
            <div className="fs-serp-lock-overlay">
              <span
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: "#fff",
                  boxShadow: "0 6px 20px rgba(0,0,0,.14)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: COLORS.blue,
                }}
              >
                <LockIcon size={18} />
              </span>
              <p style={{ margin: "10px 0 0", maxWidth: 380, fontSize: 13, fontWeight: 600, color: COLORS.black, textAlign: "center", lineHeight: 1.4 }}>
                See all {resultsScanned} competitors, their exact positions, and the keywords they rank for.
              </p>
            </div>
          </div>
        )}

        {/* Signup CTA */}
        <div style={{ textAlign: "center" }}>
          <a
            href={signupHref(keyword)}
            onClick={() => pushDataLayer({ event: "cta_click" })}
            style={{
              display: "inline-block",
              background: COLORS.blue,
              color: "#fff",
              padding: "13px 26px",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              textDecoration: "none",
              letterSpacing: "-.1px",
              boxShadow: "0 8px 22px rgba(4,84,255,.25)",
            }}
          >
            Start tracking &ldquo;{keyword}&rdquo; — free →
          </a>
          <p
            style={{
              margin: "8px 0 0",
              fontSize: 12.5,
              color: COLORS.subtle,
              display: "flex",
              gap: 7,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <GoogleLogo size={15} /> No credit card · sign up with Google in one click
          </p>
          <p style={{ margin: "8px 0 0", fontSize: 12.5, color: COLORS.gray }}>
            Join 2,400+ marketers tracking 60k+ keywords on FreeSerp
          </p>
        </div>

        {/* People also check */}
        {pills.length > 0 && (
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${COLORS.border}` }}>
            <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, color: COLORS.subtle, textTransform: "uppercase", letterSpacing: ".06em" }}>
              People also check
            </p>
            <div className="fs-serp-pills">
              {pills.map((term) => (
                <a
                  key={term}
                  href={signupHref(term)}
                  onClick={() => pushDataLayer({ event: "cta_click" })}
                  className="fs-serp-pill"
                >
                  {term}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Reset */}
        <p style={{ margin: "10px 0 0", textAlign: "center", fontSize: 13 }}>
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

// ── Results-panel sub-parts ──────────────────────────────────────────────────

function StatTile({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "11px 13px", background: "#fff" }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.subtle, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.black, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {children}
      </div>
    </div>
  );
}

/** One SERP row: display rank + title link + green URL breadcrumb. */
function ResultRow({ row, rank, own }: { row: Competitor; rank: number; own: boolean }) {
  return (
    <div
      className="fs-serp-result-row"
      style={{
        display: "flex",
        gap: 14,
        alignItems: "flex-start",
        padding: "8px 12px",
        borderRadius: 10,
        background: own ? COLORS.blueBg : "transparent",
        border: `1px solid ${own ? COLORS.blue : "transparent"}`,
      }}
    >
      <span style={{ flexShrink: 0, width: 20, textAlign: "center", fontSize: 14, fontWeight: 700, color: own ? COLORS.blue : COLORS.subtle, lineHeight: "20px" }}>
        {rank}
      </span>
      <div style={{ minWidth: 0 }}>
        <a
          href={row.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 15, fontWeight: 600, color: COLORS.black, textDecoration: "none", lineHeight: 1.3 }}
        >
          {row.title || row.domain}
          {own && (
            <span
              style={{
                marginLeft: 8,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: ".06em",
                textTransform: "uppercase",
                color: "#fff",
                background: COLORS.blue,
                padding: "2px 7px",
                borderRadius: 100,
                verticalAlign: "middle",
              }}
            >
              Your site
            </span>
          )}
        </a>
        <div style={{ marginTop: 2, fontSize: 13, color: COLORS.green, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {breadcrumb(row.url)}
        </div>
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
