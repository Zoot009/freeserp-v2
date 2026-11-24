"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { COLORS } from "@/components/site/constants";
import { pushDataLayer } from "@/lib/gtm";
import { CHATBOT_API, type Category } from "./config";

// Two short steps: the website first (one field, the promise), then who it's for. Errors sit under their field; the
// chatbot server's own check has the final word and its message lands on the right field.

type Field = "website" | "business" | "category" | "name" | "email" | "phone" | "consent";

const labelStyle: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 600, color: COLORS.gray, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 6 };
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "13px 14px", border: `1px solid ${COLORS.border}`, borderRadius: 10, fontSize: 16, outline: "none",
  fontFamily: "inherit", color: COLORS.black, background: "#fff",
};
const buttonStyle: React.CSSProperties = {
  background: COLORS.blue, color: "#fff", border: "none", padding: "15px 26px", borderRadius: 12, fontSize: 15, fontWeight: 600,
  cursor: "pointer", letterSpacing: "-.1px", boxShadow: "0 8px 22px rgba(4,84,255,.25)", whiteSpace: "nowrap", fontFamily: "inherit",
};

/** "acme-phones.co.in" → "Acme Phones": a starting point the visitor can correct. */
function guessName(website: string) {
  try {
    const host = new URL(/^https?:\/\//i.test(website) ? website : `https://${website}`).hostname.replace(/^www\./, "");
    return host.split(".")[0].split(/[-_]/).filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
  } catch {
    return "";
  }
}

export function DemoForm({ categories, open, campaign }: { categories: Category[]; open: boolean; campaign?: string }) {
  const router = useRouter();
  const id = useId();
  const [step, setStep] = useState<1 | 2>(1);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<Field | "form", string>>>({});
  const [v, setV] = useState({ website: "", business: "", category: "", name: "", email: "", phone: "", consent: false, company_site: "" });
  const firstOfStep2 = useRef<HTMLInputElement>(null);
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target instanceof HTMLInputElement && e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setV((s) => ({ ...s, [k]: value }));
    setErrors((s) => ({ ...s, [k]: undefined, form: undefined }));
  };

  const next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/\.[a-z]{2,}/i.test(v.website.trim())) return setErrors({ website: "Enter your website address, like yourbusiness.com" });
    setV((s) => ({ ...s, business: s.business || guessName(s.website) }));
    setStep(2);
    requestAnimationFrame(() => firstOfStep2.current?.focus());
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    const res = await fetch(`${CHATBOT_API}/api/public/try`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...v, campaign: campaign ?? "" }),
    }).catch(() => null);
    const json = (await res?.json().catch(() => null)) as { token?: string; error?: string } | null;
    if (res?.ok && json?.token) {
      pushDataLayer({ event: "ai_chat_demo_started", campaign: campaign ?? "organic" });
      return router.push(`/ai-chat/build/${json.token}`);
    }
    setBusy(false);
    // The server names the field it didn't accept ("email: Enter a valid email address"); otherwise the wording says which.
    const msg = json?.error ?? (res ? "Something went wrong on our side. Please try again in a minute." : "We couldn't connect to our chatbot server. Check your internet connection and try again.");
    const m = /^(\w+): (.+)$/.exec(msg);
    const field = m?.[1] as Field | undefined;
    const named: Field | undefined = field ?? (/demos/i.test(msg) ? undefined : /website|domain/i.test(msg) ? "website" : /phone/i.test(msg) ? "phone" : undefined);
    if (named === "website") setStep(1);
    setErrors(named ? { [named]: m && field ? m[2] : msg } : { form: msg });
  };

  const err = (f: Field) =>
    errors[f] && <p id={`${id}-${f}-err`} style={{ margin: "6px 0 0", fontSize: 14, color: "#d92d2d" }}>{errors[f]}</p>;
  const a11y = (f: Field) => ({ "aria-invalid": !!errors[f], "aria-describedby": errors[f] ? `${id}-${f}-err` : undefined });

  const card: React.CSSProperties = { position: "relative", background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 20px 60px rgba(0,0,0,.18)", textAlign: "left" };

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
    <div style={{ ...card, maxWidth: 760, margin: "0 auto" }}>
      {step === 1 ? (
        <form onSubmit={next} noValidate>
          <label htmlFor={`${id}-website`} style={labelStyle}>Your website</label>
          <div className="fs-ai-website" style={{ display: "flex", gap: 10 }}>
            <input id={`${id}-website`} value={v.website} onChange={set("website")} placeholder="yourbusiness.com" inputMode="url" autoComplete="url"
              autoCapitalize="none" spellCheck={false} required className="fs-ai-input" style={{ ...inputStyle, fontSize: 17, padding: "15px 16px" }} {...a11y("website")} />
            <button type="submit" className="fs-btn fs-ai-btn" style={buttonStyle}>Build my chatbot →</button>
          </div>
          {err("website")}
          <p style={{ margin: "12px 0 0", fontSize: 14, color: COLORS.subtle }}>Free · No credit card · Usually ready in 5–15 minutes</p>
        </form>
      ) : (
        <form onSubmit={submit} noValidate style={{ position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <button type="button" onClick={() => setStep(1)} className="fs-ai-link"
              style={{ background: "none", border: "none", padding: "8px 0", color: COLORS.gray, fontSize: 14, cursor: "pointer", fontFamily: "inherit", maxWidth: "70%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              ← {v.website}
            </button>
            <span style={{ fontSize: 12, color: COLORS.subtle, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase" }}>Step 2 of 2</span>
          </div>
          <div className="fs-ai-grid2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label htmlFor={`${id}-business`} style={labelStyle}>Business name</label>
              <input ref={firstOfStep2} id={`${id}-business`} value={v.business} onChange={set("business")} autoComplete="organization" required className="fs-ai-input" style={inputStyle} {...a11y("business")} />
              {err("business")}
            </div>
            <div>
              <label htmlFor={`${id}-name`} style={labelStyle}>Your name</label>
              <input id={`${id}-name`} value={v.name} onChange={set("name")} autoComplete="name" required className="fs-ai-input" style={inputStyle} {...a11y("name")} />
              {err("name")}
            </div>
            <div>
              <label htmlFor={`${id}-email`} style={labelStyle}>Email</label>
              <input id={`${id}-email`} type="email" value={v.email} onChange={set("email")} autoComplete="email" required className="fs-ai-input" style={inputStyle} {...a11y("email")} />
              {err("email")}
            </div>
            <div>
              <label htmlFor={`${id}-phone`} style={labelStyle}>WhatsApp <span style={{ textTransform: "none", letterSpacing: 0, fontWeight: 400 }}>(optional)</span></label>
              <input id={`${id}-phone`} type="tel" value={v.phone} onChange={set("phone")} autoComplete="tel" placeholder="+91 98765 43210" className="fs-ai-input" style={inputStyle} {...a11y("phone")} />
              {err("phone")}
            </div>
          </div>
          {/* The categories as chips: all visible, one tap, and they read well on a phone. Native radios underneath. */}
          <fieldset style={{ border: "none", padding: 0, margin: "20px 0 0" }} aria-describedby={errors.category ? `${id}-category-err` : undefined}>
            <legend style={{ ...labelStyle, padding: 0 }}>What your business does</legend>
            <div role="radiogroup" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {categories.map((c) => {
                const on = v.category === c.key;
                return (
                  <label key={c.key} className="fs-ai-chip" data-on={on || undefined}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6, minHeight: 40, padding: "8px 14px", borderRadius: 999, cursor: "pointer", fontSize: 14,
                      fontWeight: on ? 600 : 500, border: `1px solid ${on ? COLORS.blue : COLORS.border}`, background: on ? COLORS.blueBg : "#fff",
                      color: on ? COLORS.blue : COLORS.black, transition: "border-color .15s ease, background .15s ease, color .15s ease",
                    }}>
                    <input type="radio" name={`${id}-category`} value={c.key} checked={on} onChange={set("category")}
                      style={{ position: "absolute", opacity: 0, width: 1, height: 1, pointerEvents: "none" }} />
                    {on && <span aria-hidden="true">✓</span>}
                    {c.label}
                  </label>
                );
              })}
            </div>
            {err("category")}
          </fieldset>
          {/* Hidden from people; bots fill it in. */}
          <div aria-hidden="true" style={{ position: "absolute", left: -9999, height: 0, overflow: "hidden" }}>
            <label>Company site<input tabIndex={-1} autoComplete="off" value={v.company_site} onChange={set("company_site")} /></label>
          </div>
          <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 18, fontSize: 15, color: COLORS.black, cursor: "pointer", lineHeight: 1.45 }}>
            <input type="checkbox" checked={v.consent} onChange={set("consent")} style={{ width: 20, height: 20, marginTop: 1, accentColor: COLORS.blue, cursor: "pointer", flexShrink: 0 }} {...a11y("consent")} />
            You may contact me about my chatbot by email or WhatsApp.
          </label>
          {err("consent")}
          {errors.form && (
            <p role="alert" style={{ margin: "16px 0 0", padding: "12px 14px", borderRadius: 10, background: COLORS.redBg, color: "#b42318", fontSize: 14 }}>{errors.form}</p>
          )}
          <div aria-live="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>{busy ? "Starting your chatbot…" : ""}</div>
          <button type="submit" disabled={busy} className="fs-btn fs-ai-btn" style={{ ...buttonStyle, width: "100%", marginTop: 20, opacity: busy ? 0.65 : 1, cursor: busy ? "default" : "pointer" }}>
            {busy ? "Starting…" : "Start building →"}
          </button>
        </form>
      )}
    </div>
  );
}
