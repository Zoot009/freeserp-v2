"use client";

// The "for teams" enquiry form.
//
// Posts to the backend rather than a Next route handler: the marketing site is
// statically rendered and has no database, and the enquiry belongs in the same
// place as everything else we know about a customer.
//
// Native form validation is deliberately left on (`required`, `type="email"`) —
// the browser's messages are localised, accessible and instant, and hand-rolling
// them is how a form ends up worse than the platform default.

import { useEffect, useRef, useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "sent" | "error";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "https://api-v2.freeserp.com";

function labelStyle(): React.CSSProperties {
  return { display: "block", fontSize: 13, fontWeight: 600, color: "#0b1220", marginBottom: 6 };
}

function inputStyle(): React.CSSProperties {
  return {
    width: "100%",
    padding: "10px 12px",
    fontSize: 14,
    fontFamily: "inherit",
    color: "#0b1220",
    background: "#fff",
    border: "1px solid #d7dbe3",
    borderRadius: 9,
    outline: "none",
  };
}

export function TalkToUs() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const firstField = useRef<HTMLInputElement>(null);

  // Escape closes, and focus lands in the first field on open — a dialog you
  // have to reach for with the mouse is a dialog people abandon.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const t = setTimeout(() => firstField.current?.focus(), 40);
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError(null);

    const form = new FormData(e.currentTarget);
    const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;

    try {
      const res = await fetch(`${API_BASE}/api/public/leads/enterprise`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone") || undefined,
          company: form.get("company") || undefined,
          message: form.get("message") || undefined,
          // Hidden field. Anything in it means a bot filled the form.
          website: form.get("website") || undefined,
          source: "pricing_page",
          utmSource: params?.get("utm_source") ?? undefined,
          utmMedium: params?.get("utm_medium") ?? undefined,
          utmCampaign: params?.get("utm_campaign") ?? undefined,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
    } catch {
      setStatus("error");
      setError("We couldn't send that. Please try again, or email support@freeserp.com.");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setStatus("idle");
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          padding: "13px 20px",
          fontSize: 15,
          fontWeight: 600,
          fontFamily: "inherit",
          borderRadius: 11,
          border: "none",
          cursor: "pointer",
          background: "#4a8fff",
          color: "#08111f",
        }}
      >
        Talk to us
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Talk to us about a team plan"
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(11,18,32,.55)",
            backdropFilter: "blur(3px)",
            display: "grid",
            placeItems: "center",
            padding: 20,
            overflowY: "auto",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 460,
              background: "#fff",
              borderRadius: 16,
              padding: "26px 26px 22px",
              boxShadow: "0 24px 60px -20px rgba(11,18,32,.5)",
              color: "#0b1220",
            }}
          >
            {status === "sent" ? (
              <div style={{ textAlign: "center", padding: "18px 0 8px" }}>
                <div
                  aria-hidden
                  style={{
                    width: 46,
                    height: 46,
                    margin: "0 auto 14px",
                    display: "grid",
                    placeItems: "center",
                    borderRadius: "50%",
                    background: "#e8f7ef",
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2 7L5.5 10.5L12 3.5"
                      stroke="#16a34a"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 style={{ fontSize: 19, fontWeight: 700, margin: 0 }}>Thanks — that&apos;s with us</h3>
                <p style={{ fontSize: 14, color: "#6b7280", margin: "8px 0 20px", lineHeight: 1.6 }}>
                  We&apos;ll come back to you within one working day. If it&apos;s urgent, email
                  support@freeserp.com.
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  style={{
                    padding: "10px 20px",
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: "inherit",
                    borderRadius: 9,
                    border: "1px solid #e5e7eb",
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <h3 style={{ fontSize: 19, fontWeight: 700, margin: 0, letterSpacing: "-0.01em" }}>
                      Talk to us about a team plan
                    </h3>
                    <p style={{ fontSize: 13.5, color: "#6b7280", margin: "6px 0 0", lineHeight: 1.55 }}>
                      Tell us what you&apos;re tracking and we&apos;ll come back with a number.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    style={{
                      flexShrink: 0,
                      width: 30,
                      height: 30,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: 8,
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      color: "#9ca3af",
                      fontSize: 20,
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={onSubmit} style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label htmlFor="lead-name" style={labelStyle()}>
                      Name
                    </label>
                    <input ref={firstField} id="lead-name" name="name" required maxLength={120} style={inputStyle()} />
                  </div>

                  <div>
                    <label htmlFor="lead-email" style={labelStyle()}>
                      Work email
                    </label>
                    <input id="lead-email" name="email" type="email" required maxLength={200} style={inputStyle()} />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label htmlFor="lead-company" style={labelStyle()}>
                        Company
                      </label>
                      <input id="lead-company" name="company" maxLength={160} style={inputStyle()} />
                    </div>
                    <div>
                      <label htmlFor="lead-phone" style={labelStyle()}>
                        Phone <span style={{ fontWeight: 400, color: "#9ca3af" }}>(optional)</span>
                      </label>
                      <input id="lead-phone" name="phone" type="tel" maxLength={40} style={inputStyle()} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lead-message" style={labelStyle()}>
                      What are you tracking?{" "}
                      <span style={{ fontWeight: 400, color: "#9ca3af" }}>(optional)</span>
                    </label>
                    <textarea
                      id="lead-message"
                      name="message"
                      rows={3}
                      maxLength={2000}
                      placeholder="How many sites, how many keywords, anything else we should know."
                      style={{ ...inputStyle(), resize: "vertical", lineHeight: 1.55 }}
                    />
                  </div>

                  {/* Honeypot. Hidden from people, irresistible to bots. Not
                      display:none — some bots skip those; off-screen and
                      aria-hidden keeps it away from screen readers too. */}
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
                  />

                  {error && (
                    <p style={{ fontSize: 13, color: "#b91c1c", margin: 0, lineHeight: 1.5 }}>{error}</p>
                  )}

                  <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      style={{
                        flex: 1,
                        padding: "12px 20px",
                        fontSize: 14.5,
                        fontWeight: 600,
                        fontFamily: "inherit",
                        borderRadius: 10,
                        border: "none",
                        background: "#0b1220",
                        color: "#fff",
                        cursor: status === "sending" ? "default" : "pointer",
                        opacity: status === "sending" ? 0.7 : 1,
                      }}
                    >
                      {status === "sending" ? "Sending…" : "Send request"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      style={{
                        padding: "12px 20px",
                        fontSize: 14.5,
                        fontWeight: 600,
                        fontFamily: "inherit",
                        borderRadius: 10,
                        border: "1px solid #e5e7eb",
                        background: "#fff",
                        color: "#0b1220",
                        cursor: "pointer",
                      }}
                    >
                      Close
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
