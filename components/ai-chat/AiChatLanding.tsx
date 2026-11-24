import { BadgeIndianRupee, CalendarCheck, Code2, Globe, Languages, MessageCircle, ScanSearch, ShieldCheck, MessagesSquare } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { Tag } from "@/components/site/Tag";
import { COLORS } from "@/components/site/constants";
import type { Category } from "./config";
import { DemoForm } from "./DemoForm";

// The AI chatbot demo page: /ai-chat (organic, reads the homepage) and /ai-chat/<code> (ads, reads up to 100 pages).
// A visitor enters their website → /ai-chat/build/<token> follows the build → their chatbot, there, to chat with.

const HERO_BG = "https://framerusercontent.com/images/LTzUgqhBMU0fYD8l2vHeGvu8dQI.jpg";

const FEATURES = [
  { icon: ShieldCheck, title: "Answers only from your website", text: "Every answer comes from your own pages, with the source linked. When something isn't on your site, it says so instead of guessing." },
  { icon: BadgeIndianRupee, title: "Never invents prices", text: "Amounts are checked against your pages before a reply is sent, so customers only see prices you actually publish." },
  { icon: Languages, title: "Speaks your customers' language", text: "It replies in the language each customer writes in: English, Hindi and many more." },
  { icon: CalendarCheck, title: "Books appointments", text: "Turn booking on and it offers free slots and collects a name and number, straight into your calendar." },
  { icon: Code2, title: "One line on your website", text: "A chat bubble on every page of your site, from a single script tag." },
  { icon: MessageCircle, title: "On WhatsApp too", text: "Connect your WhatsApp number and the same assistant answers your customers there." },
];

const faq = (fullSite: boolean) => [
  { q: "Is the demo really free?", a: "Yes. Build your chatbot and try it at no cost, with no sign-up and no credit card. If you'd like it on your website, app or WhatsApp, our team will talk you through the options." },
  {
    q: "How much of my website does it read?",
    a: fullSite
      ? "Up to 100 pages of your website: your services, products, prices, policies and contact details."
      : "For the free demo it reads your homepage. The full version learns every page of your website: services, products, prices and policies.",
  },
  { q: "How long does it take?", a: "Usually 5 to 15 minutes, depending on your website. You can close the page and come back: your private link keeps your progress." },
  { q: "What does it answer from?", a: "Only from your website's pages. It doesn't make things up: when it doesn't know, it says so and points the customer to you." },
  { q: "What if my website can't be read?", a: "We respect your robots.txt and skip private pages. If we can't read enough automatically, contact us and our team will finish the setup with you." },
  { q: "Is my information safe?", a: "Your pages are used only to build your own assistant, which never sees another business's data. Demo chats are deleted automatically after 90 days." },
];

// width 100%: the site's <body> is a flex column, where a box with auto side margins would shrink to its content.
const section: React.CSSProperties = { width: "100%", maxWidth: 1280, margin: "0 auto", padding: "100px 40px 0", scrollMarginTop: 80 };
const cardStyle: React.CSSProperties = { background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 20, padding: 28, height: "100%" };

/** An example conversation, played in once. */
function ExampleChat() {
  const at = (s: number) => ({ animationDelay: `${s}s` });
  const visitor: React.CSSProperties = { marginLeft: "auto", width: "fit-content", maxWidth: "85%", background: COLORS.blue, color: "#fff", padding: "10px 14px", borderRadius: "16px 16px 4px 16px", fontSize: 15, lineHeight: 1.45 };
  const bot: React.CSSProperties = { width: "fit-content", maxWidth: "88%", background: COLORS.softGray, color: COLORS.black, padding: "10px 14px", borderRadius: "16px 16px 16px 4px", fontSize: 15, lineHeight: 1.45 };
  return (
    <div role="img" aria-label="Example conversation with a website chatbot"
      style={{ background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 20, padding: 20, boxShadow: "0 30px 80px rgba(4,84,255,.12)", maxWidth: 460, width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 14, borderBottom: `1px solid ${COLORS.border}` }}>
        <span aria-hidden="true" style={{ width: 40, height: 40, borderRadius: 999, background: "linear-gradient(135deg,#ffb547,#ff6b6b)", display: "grid", placeItems: "center", fontWeight: 700, color: "#fff" }}>A</span>
        <div>
          <p style={{ margin: 0, fontWeight: 600 }}>Aurora Hotel</p>
          <p style={{ margin: 0, fontSize: 13, color: COLORS.green }}>● Online · replies instantly</p>
        </div>
        <span style={{ marginLeft: "auto", fontSize: 12, color: COLORS.subtle, border: `1px solid ${COLORS.border}`, borderRadius: 999, padding: "2px 8px" }}>Example</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 16 }}>
        <p className="fs-chat-in" style={{ ...visitor, margin: 0, ...at(0.3) }}>Do you have a room for two this Friday?</p>
        <div className="fs-chat-in" style={{ ...bot, ...at(1.2) }}>
          Yes! Deluxe rooms are ₹4,500 a night with breakfast included. Shall I book Friday for two?
          <span style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8, fontSize: 12, color: COLORS.blue }}><Globe size={12} aria-hidden="true" /> aurorahotel.in/rooms</span>
        </div>
        <p className="fs-chat-in" style={{ ...visitor, margin: 0, ...at(2.4) }}>Yes please. Is there parking?</p>
        <div className="fs-chat-in" style={{ ...bot, display: "flex", gap: 4, padding: "14px 16px", ...at(3.2) }}>
          {[0, 0.15, 0.3].map((d) => <span key={d} className="fs-chat-dot" style={{ width: 6, height: 6, borderRadius: 99, background: COLORS.gray, animationDelay: `${d}s` }} />)}
        </div>
      </div>
    </div>
  );
}

export function AiChatLanding({ categories, open, campaign }: { categories: Category[]; open: boolean; campaign?: string }) {
  const fullSite = !!campaign;
  const steps = [
    { icon: Globe, title: "Enter your website", text: "Paste your website address. That's it: no sign-up, no setup and no code." },
    {
      icon: ScanSearch,
      title: "We read and train",
      text: fullSite
        ? "Our AI reads up to 100 pages of your website, learns what you offer, and passes a quality test before it talks to anyone."
        : "Our AI reads your homepage, learns what you offer, and passes a quality test before it talks to anyone.",
    },
    { icon: MessagesSquare, title: "Chat with your assistant", text: "Try it live, share the link with your team, and put it on your website or WhatsApp when you're ready." },
  ];

  return (
    <>
      <Nav />

      {/* Hero: the promise and the form */}
      <header className="fs-serp-hero"
        style={{ minHeight: "100vh", display: "flex", alignItems: "center", textAlign: "center", backgroundImage: `url(${HERO_BG})`, backgroundSize: "cover", backgroundPosition: "center", position: "relative" }}>
        <div id="start" className="fs-serp-hero-inner" style={{ maxWidth: 1280, width: "100%", margin: "0 auto", padding: "120px 40px 80px", position: "relative", zIndex: 1, scrollMarginTop: 80 }}>
          <Reveal>
            <Tag text="Free AI chatbot demo" light />
            <h1 style={{ color: "#fff", fontSize: "clamp(36px, 5.5vw, 76px)", fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.05, margin: "20px auto 0", maxWidth: 980 }}>
              Turn your website into an AI chatbot
            </h1>
            <p style={{ color: "#fff", maxWidth: 660, margin: "20px auto 40px", fontSize: 17, lineHeight: 1.55, opacity: 0.92, letterSpacing: "-0.2px" }}>
              {fullSite
                ? "Enter your website. Our AI reads up to 100 of your pages, learns your products, prices and policies, and builds a chatbot that answers your customers day and night. Try it live in minutes, free."
                : "Enter your website. Our AI reads your homepage, learns what you offer, and builds a chatbot that answers your customers day and night. Try it live in minutes, free."}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <DemoForm open={open} campaign={campaign} />
          </Reveal>
        </div>
      </header>

      {/* How it works */}
      <section id="how-it-works" className="fs-section" style={section}>
        <SectionHead tag="How It Works" title="From your website to a working assistant" sub="Three steps, and nothing to install." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, marginTop: 56 }}>
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <div className="fs-card" style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ width: 48, height: 48, borderRadius: 14, background: COLORS.blueBg, display: "grid", placeItems: "center" }}><s.icon size={22} color={COLORS.blue} aria-hidden="true" /></span>
                  <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 14, color: COLORS.subtle }}>0{i + 1}</span>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.4px", margin: "22px 0 8px" }}>{s.title}</h3>
                <p style={{ margin: 0, color: COLORS.gray, fontSize: 16, lineHeight: 1.55 }}>{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* What it feels like */}
      <section className="fs-section" style={section}>
        <div className="fs-row" style={{ display: "flex", gap: 64, alignItems: "center" }}>
          <Reveal style={{ flex: 1, minWidth: 0 }}>
            <Tag text="Live in minutes" />
            <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.1, margin: "20px 0 16px" }}>
              Your customers get answers, even at 2 am
            </h2>
            <p style={{ color: COLORS.gray, fontSize: 17, lineHeight: 1.6, margin: 0 }}>
              Prices, opening hours, services, delivery areas: your assistant answers the questions your team answers every day, from
              your own website, with the page it came from. When a customer is ready, it hands them to you.
            </p>
            <a href="#start" className="fs-cta-btn fs-ai-link" style={{ marginTop: 28, background: COLORS.blue, color: "#fff", boxShadow: "0 8px 22px rgba(4,84,255,.25)" }}>
              Build my chatbot →
            </a>
          </Reveal>
          <Reveal delay={0.1} style={{ flex: 1, minWidth: 0, display: "flex", justifyContent: "center" }}>
            <ExampleChat />
          </Reveal>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="fs-section" style={section}>
        <SectionHead tag="Built For Real Customers" title="An assistant you can trust in front of your customers" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, marginTop: 56 }}>
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 0.06}>
              <div className="fs-card" style={cardStyle}>
                <f.icon size={26} color={COLORS.blue} aria-hidden="true" />
                <h3 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.4px", margin: "18px 0 8px" }}>{f.title}</h3>
                <p style={{ margin: 0, color: COLORS.gray, fontSize: 16, lineHeight: 1.55 }}>{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div style={{ marginTop: 56, textAlign: "center" }}>
            <p style={{ color: COLORS.subtle, fontSize: 14, margin: "0 0 16px" }}>Made for businesses like yours</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
              {categories.filter((c) => c.key !== "other").map((c) => (
                <li key={c.key} style={{ border: `1px solid ${COLORS.border}`, borderRadius: 999, padding: "8px 16px", fontSize: 15, color: COLORS.black, background: "#fff" }}>{c.label}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* FAQ, in the site's two-column layout */}
      <section id="faq" className="fs-section" style={{ ...section, padding: "100px 40px 80px" }}>
        <div className="fs-row fs-faq-layout" style={{ display: "flex", gap: 80, alignItems: "flex-start" }}>
          <div className="fs-faq-sidebar" style={{ flex: "0 0 33%", minWidth: 0 }}>
            <Reveal>
              <Tag text="Common Questions" />
              <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.1, margin: "20px 0 16px" }}>Frequently asked questions</h2>
              <p style={{ color: COLORS.gray, fontSize: 16, lineHeight: 1.5 }}>Still stuck? Email support@freeserp.com.</p>
            </Reveal>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {faq(fullSite).map((f, i) => (
              <Reveal key={f.q} delay={i * 0.04}>
                <div style={{ padding: "16px 0 24px", borderBottom: `1px solid ${COLORS.border}` }}>
                  <h3 style={{ fontSize: 20, fontWeight: 500, letterSpacing: "-0.4px", margin: 0 }}>{f.q}</h3>
                  <p style={{ margin: "12px 0 0", color: COLORS.gray, fontSize: 16, lineHeight: 1.55, maxWidth: 720 }}>{f.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final call */}
      <section style={{ width: "100%", maxWidth: 1280, margin: "0 auto", padding: "0 40px 100px" }}>
        <Reveal>
          <div className="fs-cta-inner" style={{ background: `linear-gradient(135deg, ${COLORS.blue}, #2f6bff 55%, ${COLORS.purple})`, borderRadius: 28, padding: "80px 40px", textAlign: "center", color: "#fff" }}>
            <Tag text="Free Demo" light />
            <h2 style={{ fontSize: "clamp(28px, 4vw, 56px)", fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.1, margin: "20px auto 14px", maxWidth: 760 }}>See your website talk</h2>
            <p style={{ fontSize: 18, opacity: 0.9, margin: "0 auto 32px", maxWidth: 560 }}>It takes a minute to start, and your assistant is ready while you make a coffee.</p>
            <a href="#start" className="fs-cta-btn fs-ai-link" style={{ background: "#fff", color: COLORS.blue }}>Build my chatbot →</a>
          </div>
        </Reveal>
      </section>

      <Footer />
    </>
  );
}
