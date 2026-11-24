import Link from "next/link";
import { Globe, Smartphone } from "lucide-react";
import { Tag } from "@/components/site/Tag";
import { COLORS } from "@/components/site/constants";
import { BrandIcon, type Brand } from "./brand-icons";

// "Take it live": after the demo, where the agent can work for the visitor's business, and a way to talk to us.
// Instagram and Messenger are marked "Soon": the chatbot server has them prepared, not yet live.

type Channel = { title: string; text: string; soon?: boolean } & ({ brand: Brand } | { icon: typeof Globe; tint: string });

const CHANNELS: Channel[] = [
  { title: "Your website", text: "A chat bubble on every page, from one line of code", icon: Globe, tint: COLORS.blue },
  { title: "Your app", text: "Built into your iOS or Android app", icon: Smartphone, tint: COLORS.purple },
  { title: "WhatsApp", text: "On your WhatsApp Business number", brand: "whatsapp" },
  { title: "Instagram", text: "Answers your Instagram DMs", brand: "instagram", soon: true },
  { title: "Messenger", text: "Answers your Facebook Page chats", brand: "messenger", soon: true },
];

function ChannelTile({ c }: { c: Channel }) {
  const color = "brand" in c ? undefined : c.tint;
  return (
    <div className="fs-card" style={{ position: "relative", background: "#fff", borderRadius: 18, padding: "18px 18px 16px", boxShadow: "0 14px 34px rgba(10,20,80,.18)", textAlign: "left" }}>
      {c.soon && (
        <span style={{ position: "absolute", top: 12, right: 12, fontSize: 11, fontWeight: 600, letterSpacing: ".04em", color: COLORS.amberText, background: COLORS.amberBg, borderRadius: 999, padding: "3px 8px" }}>
          Soon
        </span>
      )}
      <span style={{ width: 44, height: 44, borderRadius: 12, display: "grid", placeItems: "center", background: "brand" in c ? "#f5f6f8" : `${color}14` }}>
        {"brand" in c ? <BrandIcon brand={c.brand} size={24} /> : <c.icon size={22} color={color} aria-hidden="true" />}
      </span>
      <p style={{ margin: "14px 0 4px", fontSize: 16, fontWeight: 600, color: COLORS.black, letterSpacing: "-0.2px" }}>{c.title}</p>
      <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.45, color: COLORS.gray }}>{c.text}</p>
    </div>
  );
}

export function TakeItLive() {
  return (
    <div className="fs-cta-inner"
      style={{ position: "relative", overflow: "hidden", background: `linear-gradient(135deg, ${COLORS.blue} 0%, #2f6bff 50%, ${COLORS.purple} 100%)`, borderRadius: 28, padding: "64px 56px", color: "#fff" }}>
      {/* Soft light, so the card reads as one surface rather than a flat block of colour. */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(60% 80% at 85% 10%, rgba(255,255,255,.22), transparent 60%), radial-gradient(50% 60% at 0% 100%, rgba(0,0,0,.12), transparent 70%)" }} />
      <div className="fs-row" style={{ position: "relative", display: "flex", gap: 56, alignItems: "center" }}>
        <div style={{ flex: "1 1 46%", minWidth: 0 }}>
          <Tag text="Take it live" light />
          <h2 style={{ fontSize: "clamp(28px, 3.6vw, 50px)", fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.08, margin: "18px 0 16px" }}>
            Put your AI agent everywhere your customers are
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.6, opacity: 0.92, margin: "0 0 30px", maxWidth: 520 }}>
            We add it to your website, build it into your app and connect it to your WhatsApp Business number, then teach it every page of your
            website and fine-tune its answers with you.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/contact" className="fs-cta-btn fs-ai-link" style={{ background: "#fff", color: COLORS.blue }}>Talk to us →</Link>
            <Link href="/ai-chat" className="fs-cta-btn fs-ai-link" style={{ border: "1px solid rgba(255,255,255,.55)", color: "#fff" }}>Try another website</Link>
          </div>
          <p style={{ display: "flex", alignItems: "center", gap: 8, margin: "28px 0 0", fontSize: 14, opacity: 0.9 }}>
            <span style={{ display: "inline-grid", placeItems: "center", width: 26, height: 26, borderRadius: 8, background: "#fff" }}><BrandIcon brand="meta" size={16} /></span>
            WhatsApp runs on Meta&apos;s official WhatsApp Business Platform.
          </p>
        </div>
        <div style={{ flex: "1 1 54%", minWidth: 0, width: "100%" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 14 }}>
            {CHANNELS.map((c) => <ChannelTile key={c.title} c={c} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
