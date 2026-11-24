"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { COLORS } from "@/components/site/constants";
import { pushDataLayer } from "@/lib/gtm";
import { CHATBOT_API } from "./config";

// One field: the website. Submitting starts the build straight away and opens the visitor's private build page.

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "16px 16px", border: `1px solid ${COLORS.border}`, borderRadius: 12, fontSize: 17, outline: "none",
  fontFamily: "inherit", color: COLORS.black, background: "#fff",
};
const buttonStyle: React.CSSProperties = {
  background: COLORS.blue, color: "#fff", border: "none", padding: "16px 28px", borderRadius: 12, fontSize: 16, fontWeight: 600,
  letterSpacing: "-.1px", boxShadow: "0 8px 22px rgba(4,84,255,.25)", whiteSpace: "nowrap", fontFamily: "inherit",
};

export function DemoForm({ open, campaign }: { open: boolean; campaign?: string }) {
  const router = useRouter();
  const id = useId();
  const [website, setWebsite] = useState("");
  const [trap, setTrap] = useState(""); // a field people never see; bots fill it in
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/\.[a-z]{2,}/i.test(website.trim())) return setError("Enter your website address, like yourbusiness.com");
    setBusy(true);
    setError(null);
    const res = await fetch(`${CHATBOT_API}/api/public/try`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ website, campaign: campaign ?? "", company_site: trap }),
    }).catch(() => null);
    const json = (await res?.json().catch(() => null)) as { token?: string; error?: string } | null;
    if (res?.ok && json?.token) {
      pushDataLayer({ event: "ai_chat_demo_started", campaign: campaign ?? "organic" });
      return router.push(`/ai-chat/build/${json.token}`);
    }
    setBusy(false);
    setError(
      json?.error?.replace(/^\w+: /, "") ??
        (res ? "Something went wrong on our side. Please try again in a minute." : "We couldn't connect to our chatbot server. Check your internet connection and try again."),
    );
  };

  const card: React.CSSProperties = {
    position: "relative", background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 20px 60px rgba(0,0,0,.18)", textAlign: "left",
    maxWidth: 760, margin: "0 auto",
  };

  if (!open) {
    return (
      <div style={card}>
        <p style={{ margin: 0, color: COLORS.black, fontSize: 16 }}>
          Live demos are paused right now. <Link href="/contact" style={{ color: COLORS.blue, fontWeight: 600 }}>Contact us</Link> and we&apos;ll build one for you.
        </p>
      </div>
    );
  }

  return (
    <div style={card}>
      <form onSubmit={submit} noValidate>
        <label htmlFor={`${id}-website`} style={{ display: "block", fontSize: 12, fontWeight: 600, color: COLORS.gray, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 8 }}>
          Your website
        </label>
        <div className="fs-ai-website" style={{ display: "flex", gap: 10 }}>
          <input id={`${id}-website`} value={website} onChange={(e) => { setWebsite(e.target.value); setError(null); }} placeholder="yourbusiness.com"
            inputMode="url" autoComplete="url" autoCapitalize="none" spellCheck={false} required disabled={busy} className="fs-ai-input" style={inputStyle}
            aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} />
          <button type="submit" disabled={busy} className="fs-btn fs-ai-btn"
            style={{ ...buttonStyle, opacity: busy ? 0.7 : 1, cursor: busy ? "default" : "pointer" }}>
            {busy ? "Starting…" : "Build my chatbot →"}
          </button>
        </div>
        <div aria-hidden="true" style={{ position: "absolute", left: -9999, height: 0, overflow: "hidden" }}>
          <label>Company site<input tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} /></label>
        </div>
        {error && <p id={`${id}-err`} role="alert" style={{ margin: "10px 0 0", fontSize: 14, color: "#d92d2d" }}>{error}</p>}
        <div aria-live="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>{busy ? "Starting your chatbot…" : ""}</div>
        <p style={{ margin: "12px 0 0", fontSize: 14, color: COLORS.subtle }}>Free · No sign-up · Usually ready in 5–15 minutes</p>
      </form>
    </div>
  );
}
