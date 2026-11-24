"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Copy, FileSearch, Brain, Wand2, ShieldCheck, Loader2, UserRound } from "lucide-react";
import { Tag } from "@/components/site/Tag";
import { COLORS } from "@/components/site/constants";
import { CHATBOT_API, type DemoStatus } from "./config";

// A visitor's private build page: asks the chatbot server how the build is going every few seconds; then shows their
// chatbot to chat with (the server's chat page, in a frame), or says our team will finish it.

const STEPS = [
  { icon: FileSearch, title: "Reading your website", text: "Finding your pages and reading the text on each one." },
  { icon: Brain, title: "Learning your business", text: "Turning your pages into knowledge it can search in an instant." },
  { icon: Wand2, title: "Setting up your assistant", text: "Writing its welcome, its tone and the questions customers ask." },
  { icon: ShieldCheck, title: "Quality check", text: "Asking it questions about your business before anyone else does." },
];

const h1: React.CSSProperties = { fontSize: "clamp(30px, 4.4vw, 56px)", fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.08, margin: "20px 0 0" };
const btn: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 24px", borderRadius: 12, fontSize: 15, fontWeight: 600,
  textDecoration: "none", cursor: "pointer", fontFamily: "inherit",
};

function CopyLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* no clipboard: the link is still there to select */
    }
  };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "6px 6px 6px 14px", background: "#fff" }}>
      <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "var(--font-geist-mono)", fontSize: 13, color: COLORS.gray }}>{url}</span>
      <button type="button" onClick={copy} className="fs-ai-btn"
        style={{ ...btn, padding: "10px 14px", background: COLORS.softGray, color: COLORS.black, border: "none", fontSize: 14 }}>
        {copied ? <Check size={16} color={COLORS.green} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
        <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
      </button>
    </div>
  );
}

export function BuildView({ token }: { token: string }) {
  const [s, setS] = useState<DemoStatus | null>(null);
  const [missing, setMissing] = useState(false);
  // This page's own address, to keep or share (only shown once the status has loaded, so never during hydration).
  const [here] = useState(() => (typeof window === "undefined" ? "" : location.href));

  useEffect(() => {
    let stop = false;
    let timer: ReturnType<typeof setTimeout>;
    const tick = async () => {
      const res = await fetch(`${CHATBOT_API}/api/public/try/${encodeURIComponent(token)}`, { cache: "no-store" }).catch(() => null);
      if (stop) return;
      if (res?.status === 404) return setMissing(true);
      const next = (await res?.json().catch(() => null)) as DemoStatus | null;
      if (res?.ok && next) setS(next);
      // Keep asking while it builds (and through a network blip); stop once it's ready or with the team.
      if (!next || next.state === "building") timer = setTimeout(tick, 3000);
    };
    tick();
    return () => {
      stop = true;
      clearTimeout(timer);
    };
  }, [token]);

  const wrap: React.CSSProperties = { width: "100%", maxWidth: 1180, margin: "0 auto", padding: "150px 40px 100px" }; // body is a flex column

  if (missing) {
    return (
      <section className="fs-section" style={{ ...wrap, maxWidth: 720, textAlign: "center" }}>
        <h1 style={h1}>This link doesn&apos;t work</h1>
        <p style={{ color: COLORS.gray, fontSize: 18, lineHeight: 1.55, margin: "16px 0 32px" }}>Check the address, or build a new chatbot. It only takes a minute.</p>
        <Link href="/ai-chat" className="fs-btn fs-ai-link" style={{ ...btn, background: COLORS.blue, color: "#fff" }}>Build my chatbot →</Link>
      </section>
    );
  }

  if (!s) {
    return (
      <section className="fs-section" style={{ ...wrap, textAlign: "center", color: COLORS.gray }}>
        <Loader2 size={28} className="fs-chat-spin" aria-hidden="true" />
        <p>Loading your chatbot…</p>
      </section>
    );
  }

  const site = s.website.replace(/^https?:\/\//, "");

  if (s.state === "ready" && s.demoUrl) {
    return (
      <>
        <section style={{ width: "100%", maxWidth: 1600, margin: "0 auto", padding: "128px 32px 0" }}>
          <div className="fs-row" style={{ display: "flex", gap: 24, alignItems: "flex-end", justifyContent: "space-between" }}>
            <div style={{ minWidth: 0 }}>
              <Tag text="Ready" />
              <h1 style={{ ...h1, fontSize: "clamp(28px, 3.4vw, 44px)", margin: "14px 0 0" }}>{s.business}&apos;s AI agent is live</h1>
              <p style={{ color: COLORS.gray, fontSize: 16, lineHeight: 1.55, margin: "8px 0 0" }}>
                Built from {s.pagesRead} page{s.pagesRead === 1 ? "" : "s"} of {site}. Chat with it on the left; the report on the right shows what it learned and how it was tested.
              </p>
            </div>
            <div style={{ flex: "0 0 380px", maxWidth: "100%" }}>
              <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 600, color: COLORS.gray, letterSpacing: ".08em", textTransform: "uppercase" }}>Share this demo</p>
              <CopyLink url={here} />
            </div>
          </div>
          {/* The agent and its report, from the chatbot server, shown here on freeserp.com. */}
          <iframe src={s.demoUrl} title={`${s.business}'s AI agent and report`}
            style={{ display: "block", width: "100%", height: "max(720px, calc(100vh - 150px))", marginTop: 24, border: `1px solid ${COLORS.border}`, borderRadius: 20,
              boxShadow: "0 30px 80px rgba(4,84,255,.12)", background: COLORS.softGray }} />
        </section>

        <section style={{ width: "100%", maxWidth: 1600, margin: "0 auto", padding: "48px 32px 100px" }}>
          <div className="fs-cta-inner" style={{ background: `linear-gradient(135deg, ${COLORS.blue}, #2f6bff 55%, ${COLORS.purple})`, borderRadius: 28, padding: "64px 40px", textAlign: "center", color: "#fff" }}>
            <Tag text="Take it live" light />
            <h2 style={{ fontSize: "clamp(26px, 3.6vw, 48px)", fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.1, margin: "18px auto 14px", maxWidth: 820 }}>
              Want this AI agent on your website, app or WhatsApp?
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.55, opacity: 0.92, margin: "0 auto 30px", maxWidth: 640 }}>
              We add it to your website with one line of code, build it into your app, or connect it to your WhatsApp Business number through Meta,
              then teach it every page of your website and fine-tune its answers with you.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/contact" className="fs-cta-btn fs-ai-link" style={{ background: "#fff", color: COLORS.blue }}>Talk to us →</Link>
              <Link href="/ai-chat" className="fs-cta-btn fs-ai-link" style={{ border: "1px solid rgba(255,255,255,.5)", color: "#fff" }}>Try another website</Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (s.state === "review") {
    return (
      <section className="fs-section" style={{ ...wrap, maxWidth: 760, textAlign: "center" }}>
        <span style={{ width: 56, height: 56, borderRadius: 16, background: COLORS.blueBg, display: "inline-grid", placeItems: "center" }}><UserRound size={26} color={COLORS.blue} aria-hidden="true" /></span>
        <h1 style={h1}>We&apos;re finishing {s.business}&apos;s assistant by hand</h1>
        <p style={{ color: COLORS.gray, fontSize: 18, lineHeight: 1.55, margin: "16px auto 32px", maxWidth: 600 }}>
          We couldn&apos;t read enough of {site} automatically. Some websites block automated reading or keep their text in images. Contact us and our team
          will finish your assistant with you.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/contact" className="fs-btn fs-ai-link" style={{ ...btn, background: COLORS.blue, color: "#fff" }}>Talk to us →</Link>
          <Link href="/ai-chat" className="fs-ai-link" style={{ ...btn, border: `1px solid ${COLORS.border}`, color: COLORS.black }}>Try another website</Link>
        </div>
      </section>
    );
  }

  // Never quite empty (it has started) nor full (it isn't ready yet).
  const pct = Math.max(6, Math.min(96, Math.round(((s.step + (s.step === 0 && s.pagesFound ? s.pagesRead / s.pagesFound : 0.5)) / STEPS.length) * 100)));
  return (
    <section className="fs-section" style={{ ...wrap, maxWidth: 760 }}>
      <Tag text="Building" />
      <h1 style={h1}>Building {s.business}&apos;s assistant</h1>
      <p style={{ color: COLORS.gray, fontSize: 17, margin: "14px 0 0" }}>From <strong style={{ color: COLORS.black, fontWeight: 600 }}>{site}</strong>. This usually takes 5 to 15 minutes.</p>

      <div role="progressbar" aria-label="Build progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}
        style={{ height: 8, borderRadius: 99, background: COLORS.softGray, overflow: "hidden", marginTop: 32 }}>
        <div style={{ height: "100%", width: `${pct}%`, borderRadius: 99, background: `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.purple})`, transition: "width .7s ease" }} />
      </div>

      <ol aria-live="polite" style={{ listStyle: "none", padding: 0, margin: "28px 0 0", display: "flex", flexDirection: "column", gap: 12 }}>
        {STEPS.map((step, i) => {
          const done = i < s.step;
          const active = i === s.step;
          return (
            <li key={step.title} aria-current={active ? "step" : undefined}
              style={{ display: "flex", gap: 16, padding: 18, borderRadius: 16, border: `1px solid ${active ? COLORS.blue : COLORS.border}`, background: active ? COLORS.blueBg : "#fff" }}>
              <span style={{ width: 44, height: 44, flexShrink: 0, borderRadius: 12, display: "grid", placeItems: "center", background: done ? "#e7f8f0" : active ? "#fff" : COLORS.softGray }}>
                {done ? <Check size={20} color={COLORS.green} aria-hidden="true" /> : active ? <Loader2 size={20} color={COLORS.blue} className="fs-chat-spin" aria-hidden="true" /> : <step.icon size={20} color={COLORS.subtle} aria-hidden="true" />}
              </span>
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 17, color: done || active ? COLORS.black : COLORS.subtle }}>
                  {step.title}
                  <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>{done ? " (done)" : active ? " (in progress)" : ""}</span>
                </p>
                <p style={{ margin: "4px 0 0", fontSize: 15, color: COLORS.gray }}>
                  {i === 0 && (active || done) && s.pagesFound > 0 ? `Read ${s.pagesRead} of ${s.pagesFound} page${s.pagesFound === 1 ? "" : "s"}.` : step.text}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <div style={{ marginTop: 32, padding: 22, borderRadius: 16, background: COLORS.softGray }}>
        <p style={{ margin: 0, fontWeight: 600 }}>You don&apos;t have to wait here</p>
        <p style={{ margin: "4px 0 14px", fontSize: 15, color: COLORS.gray }}>Keep this private link: your assistant will be waiting when you come back.</p>
        <CopyLink url={here} />
      </div>
    </section>
  );
}
