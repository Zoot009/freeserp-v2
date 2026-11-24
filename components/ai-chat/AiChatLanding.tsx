import { BadgeCheck, CalendarCheck, Check, Clock3, FileText, Globe, Languages, MessageCircleQuestion, Rocket, ShieldCheck, Sparkles, Upload, UserRound, Wallet } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { Tag } from "@/components/site/Tag";
import { COLORS } from "@/components/site/constants";
import { BrandIcon } from "./brand-icons";
import type { Category } from "./config";
import { DemoForm } from "./DemoForm";
import { PhoneVideo } from "./PhoneVideo";

// The AI chatbot demo page: /ai-chat (organic, reads the homepage) and /ai-chat/<code> (ads, reads up to 100 pages).
// Hero with the one-field form and the demo video → benefits → how it learns → key features (dark) → industries → FAQ
// → final call. A visitor's website goes to /ai-chat/build/<token>, which follows the build and shows the agent.

const HERO_BG = "https://framerusercontent.com/images/LTzUgqhBMU0fYD8l2vHeGvu8dQI.jpg";
const DARK = "#0a0a14";

const BENEFITS = [
  { icon: Rocket, title: "Live in minutes", text: "No code and no training: just your website address." },
  { icon: Languages, title: "Every language", text: "It replies in the language each customer writes in." },
  { icon: UserRound, title: "Hands over when unsure", text: "It never guesses: it tells the customer your team will reply." },
  { icon: Wallet, title: "Free to try", text: "No sign-up and no credit card for the demo." },
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
  { q: "What does it answer from?", a: "Only from your website's pages and the documents and FAQs you add. When it doesn't know, it says so and points the customer to you." },
  { q: "Does it work with my website builder?", a: "Yes. It's one line of code, so it works on WordPress, Wix, Shopify, Webflow and any website where you can add a script." },
  { q: "What if my website can't be read?", a: "We respect your robots.txt and skip private pages. If we can't read enough automatically, contact us and our team will finish the setup with you." },
  { q: "Is my information safe?", a: "Your pages are used only to build your own assistant, which never sees another business's data. Demo chats are deleted automatically after 90 days." },
];

const section: React.CSSProperties = { width: "100%", maxWidth: 1280, margin: "0 auto", padding: "100px 40px 0", scrollMarginTop: 80 }; // body is a flex column
const h2Style: React.CSSProperties = { fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.1, margin: "18px 0 14px" };
const whiteCard: React.CSSProperties = { background: "#fff", borderRadius: 16, boxShadow: "0 14px 34px rgba(0,0,0,.18)" };

/* ─── small visual pieces ─────────────────────────────────────────── */

function Bubble({ from, children }: { from: "visitor" | "agent"; children: React.ReactNode }) {
  const visitor = from === "visitor";
  return (
    <div style={{ width: "fit-content", maxWidth: "88%", marginLeft: visitor ? "auto" : 0, padding: "10px 14px", fontSize: 14.5, lineHeight: 1.45,
      borderRadius: visitor ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: visitor ? COLORS.blue : "#fff", color: visitor ? "#fff" : COLORS.black,
      boxShadow: visitor ? "none" : "0 6px 18px rgba(10,20,80,.08)" }}>
      {children}
    </div>
  );
}

function StepPill({ n, title }: { n: number; title: string }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 16px 8px 8px", borderRadius: 999, background: COLORS.blue, color: "#fff", fontWeight: 600, fontSize: 15 }}>
      <span style={{ width: 28, height: 28, borderRadius: 999, background: "#fff", color: COLORS.blue, display: "grid", placeItems: "center", fontSize: 14 }}>{n}</span>
      {title}
    </div>
  );
}

/** A feature on the dark section: title, text, and a picture of it. */
function Feature({ title, text, children, tint }: { title: string; text: string; children: React.ReactNode; tint: string }) {
  return (
    <div style={{ background: "#13131f", border: "1px solid rgba(255,255,255,.08)", borderRadius: 26, padding: 14, height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "22px 22px 20px", textAlign: "center" }}>
        <h3 style={{ color: "#fff", fontSize: 24, fontWeight: 600, letterSpacing: "-0.6px", margin: 0 }}>{title}</h3>
        <p style={{ color: "#a3a3b5", fontSize: 16, lineHeight: 1.55, margin: "10px auto 0", maxWidth: 440 }}>{text}</p>
      </div>
      <div style={{ flex: 1, minHeight: 240, borderRadius: 18, background: tint, padding: 26, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
}

/* ─── the page ───────────────────────────────────────────────────── */

export function AiChatLanding({ categories, open, campaign }: { categories: Category[]; open: boolean; campaign?: string }) {
  const fullSite = !!campaign;

  return (
    <>
      <Nav />

      {/* Hero: the promise, the form, and the agent at work. */}
      <header className="fs-serp-hero"
        style={{ minHeight: "100vh", display: "flex", alignItems: "center", backgroundImage: `url(${HERO_BG})`, backgroundSize: "cover", backgroundPosition: "center", position: "relative" }}>
        <div className="fs-serp-hero-inner" style={{ maxWidth: 1280, width: "100%", margin: "0 auto", padding: "130px 40px 80px", position: "relative", zIndex: 1 }}>
          <div className="fs-row" style={{ display: "flex", gap: 56, alignItems: "center" }}>
            <div id="start" style={{ flex: "1 1 56%", minWidth: 0, scrollMarginTop: 90 }}>
              <Reveal>
                <Tag text="Free AI chatbot" light />
                <h1 style={{ color: "#fff", fontSize: "clamp(40px, 5.6vw, 78px)", fontWeight: 600, letterSpacing: "-0.045em", lineHeight: 1.02, margin: "20px 0 0" }}>
                  AI chatbot for your website
                </h1>
                <p style={{ color: "#fff", maxWidth: 560, margin: "22px 0 32px", fontSize: 18, lineHeight: 1.55, opacity: 0.96, textShadow: "0 1px 14px rgba(0,30,120,.35)" }}>
                  {fullSite
                    ? "Our AI reads up to 100 pages of your website, learns your products, prices and policies, and answers your customers instantly, day and night. Try it free in minutes."
                    : "Our AI reads your website and answers your customers' questions instantly, day and night, from your own pages. Try it free in minutes."}
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <div style={{ maxWidth: 640 }}>
                  <DemoForm open={open} campaign={campaign} />
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.15} style={{ flex: "0 1 40%", minWidth: 0, display: "flex", justifyContent: "center" }}>
              <div style={{ position: "relative" }}>
                <PhoneVideo src="/ai-chat-demo.mp4" poster="/ai-chat-demo-poster.jpg"
                  label="A 30-second video: a customer asks a business's AI chatbot about appointments and gets an instant answer." />
                {/* Notes floating beside the phone, where there's room (hidden on narrow screens). */}
                <div className="fs-ai-float" style={{ ...whiteCard, position: "absolute", left: -90, top: "18%", padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, color: COLORS.black }}>
                  <Clock3 size={18} color={COLORS.blue} aria-hidden="true" /> Answers in seconds
                </div>
                <div className="fs-ai-float" style={{ ...whiteCard, position: "absolute", right: -70, bottom: "22%", padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, color: COLORS.black }}>
                  <CalendarCheck size={18} color={COLORS.green} aria-hidden="true" /> Booked: Sat, 2 PM
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </header>

      {/* Why people pick it, at a glance. */}
      <section className="fs-section" style={{ ...section, paddingTop: 72 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {BENEFITS.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.06} style={{ height: "100%" }}>
              <div className="fs-card" style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: 20, borderRadius: 20, border: `1px solid ${COLORS.border}`, background: "#fff", height: "100%" }}>
                <span style={{ width: 48, height: 48, flexShrink: 0, borderRadius: 14, background: COLORS.blue, display: "grid", placeItems: "center" }}><b.icon size={22} color="#fff" aria-hidden="true" /></span>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 17, letterSpacing: "-0.3px" }}>{b.title}</p>
                  <p style={{ margin: "4px 0 0", color: COLORS.gray, fontSize: 15, lineHeight: 1.5 }}>{b.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How it learns: three steps, drawn. */}
      <section id="how-it-works" className="fs-section" style={section}>
        <SectionHead tag="How It Works" title="It learns from your website, then answers for you"
          sub={fullSite ? "It reads up to 100 of your pages and builds its answers from them, automatically." : "It reads your website and builds its answers from it, automatically."} />
        <Reveal>
          <div style={{ marginTop: 48, borderRadius: 28, padding: "36px 28px", background: `linear-gradient(180deg, ${COLORS.blueBg}, #f6f8ff)`, border: `1px solid ${COLORS.border}` }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28 }}>
              <div>
                <StepPill n={1} title="Enter your website" />
                <div style={{ ...whiteCard, marginTop: 20, overflow: "hidden" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", borderBottom: `1px solid ${COLORS.border}` }}>
                    {["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} style={{ width: 9, height: 9, borderRadius: 99, background: c }} />)}
                  </div>
                  <div style={{ padding: 18 }}>
                    <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "11px 12px", fontSize: 15, color: COLORS.black, display: "flex", alignItems: "center", gap: 8 }}>
                      <Globe size={16} color={COLORS.subtle} aria-hidden="true" /> yourbusiness.com
                    </div>
                    <div style={{ marginTop: 10, background: COLORS.blue, color: "#fff", borderRadius: 10, padding: "11px 12px", fontSize: 15, fontWeight: 600, textAlign: "center" }}>Build my chatbot →</div>
                  </div>
                </div>
              </div>
              <div>
                <StepPill n={2} title="It reads your pages" />
                <div style={{ ...whiteCard, marginTop: 20, padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
                  {([["Pages", Globe], ["Products and services", Sparkles], ["Prices", Wallet], ["Policies and FAQs", FileText]] as const).map(([label, I]) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, background: COLORS.softGray, fontSize: 15 }}>
                      <I size={16} color={COLORS.blue} aria-hidden="true" /> {label}
                      <BadgeCheck size={18} color={COLORS.green} aria-hidden="true" style={{ marginLeft: "auto" }} />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <StepPill n={3} title="It answers your customers" />
                <div style={{ ...whiteCard, marginTop: 20, padding: 18, background: COLORS.softGray, display: "flex", flexDirection: "column", gap: 10 }}>
                  <Bubble from="visitor">Do you deliver on Sundays?</Bubble>
                  <Bubble from="agent">
                    Yes! We deliver every day, 9 am to 9 pm, and delivery is free over ₹499.
                    <span style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6, fontSize: 12, color: COLORS.blue }}><Globe size={12} aria-hidden="true" /> yourbusiness.com/delivery</span>
                  </Bubble>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Key features, on dark. */}
      <section id="features" style={{ width: "100%", background: DARK, marginTop: 100, scrollMarginTop: 60 }}>
        <div className="fs-section" style={{ ...section, padding: "100px 40px" }}>
          {/* SectionHead's tag is dark text: on this background it needs the light one. */}
          <Reveal style={{ maxWidth: 760, textAlign: "center", margin: "0 auto" }}>
            <Tag text="Key Features" light />
            <h2 style={{ ...h2Style, color: "#fff", fontSize: "clamp(28px, 4vw, 56px)", margin: "20px 0 12px" }}>Everything it needs to win you customers</h2>
            <p style={{ color: "#a3a3b5", fontSize: 18, lineHeight: 1.5, margin: 0 }}>Accurate answers, your prices, your tone, and a hand-over to your team when it matters.</p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 440px), 1fr))", gap: 20, marginTop: 56 }}>
            <Reveal style={{ height: "100%" }}>
              <Feature title="Works on any website" text="One line of code adds it to every page: WordPress, Wix, Shopify, Webflow or your own site." tint="linear-gradient(135deg,#0454ff,#6a4bff)">
                <div style={{ width: "100%", maxWidth: 400, borderRadius: 14, background: "#0b0b14", color: "#c7d2fe", fontFamily: "var(--font-geist-mono)", fontSize: 13, padding: "16px 18px", lineHeight: 1.6, boxShadow: "0 16px 40px rgba(0,0,0,.35)" }}>
                  <span style={{ color: "#94a3b8" }}>&lt;script</span> src=<span style={{ color: "#86efac" }}>&quot;…/chatbot.js&quot;</span><br />
                  &nbsp;&nbsp;data-chatbot-id=<span style={{ color: "#86efac" }}>&quot;your-agent&quot;</span><span style={{ color: "#94a3b8" }}>&gt;&lt;/script&gt;</span>
                </div>
                {(["wordpress", "wix", "shopify", "webflow"] as const).map((b, i) => (
                  <span key={b} style={{ ...whiteCard, position: "absolute", width: 52, height: 52, display: "grid", placeItems: "center", borderRadius: 14,
                    ...[{ left: 16, top: 16 }, { right: 16, top: 20 }, { left: 24, bottom: 16 }, { right: 22, bottom: 18 }][i], transform: `rotate(${[-8, 7, 6, -6][i]}deg)` }}>
                    <BrandIcon brand={b} size={28} />
                  </span>
                ))}
              </Feature>
            </Reveal>
            <Reveal delay={0.06} style={{ height: "100%" }}>
              <Feature title="Your own knowledge base" text="Add documents and FAQs on top of your website, so it answers with everything your team knows." tint="linear-gradient(135deg,#ff4f8b,#ff8a5b)">
                <div style={{ display: "flex", gap: 14, alignItems: "stretch" }}>
                  {([["Upload document", Upload], ["Add FAQ", MessageCircleQuestion]] as const).map(([label, I], i) => (
                    <div key={label} style={{ ...whiteCard, width: 140, padding: "20px 14px", textAlign: "center", transform: `rotate(${i ? 4 : -3}deg)` }}>
                      <I size={30} color={COLORS.black} aria-hidden="true" />
                      <p style={{ margin: "10px 0 0", fontWeight: 600, fontSize: 15, color: COLORS.black }}>{label}</p>
                    </div>
                  ))}
                </div>
              </Feature>
            </Reveal>
            <Reveal style={{ height: "100%" }}>
              <Feature title="Never invents prices" text="Every amount in a reply is checked against your own pages before it's sent. No made-up discounts." tint="linear-gradient(135deg,#10b981,#0ea5e9)">
                <div style={{ width: "100%", maxWidth: 380, display: "flex", flexDirection: "column", gap: 10 }}>
                  <Bubble from="visitor">How much is the deluxe room?</Bubble>
                  <Bubble from="agent">The deluxe room is ₹4,500 a night, breakfast included.</Bubble>
                  <span style={{ ...whiteCard, alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 10px", fontSize: 13, fontWeight: 600, color: COLORS.green, borderRadius: 999 }}>
                    <ShieldCheck size={15} aria-hidden="true" /> Price checked against your website
                  </span>
                </div>
              </Feature>
            </Reveal>
            <Reveal delay={0.06} style={{ height: "100%" }}>
              <Feature title="Books appointments" text="Turn booking on and it offers your free slots, takes a name and number, and fills your calendar." tint="linear-gradient(135deg,#7e5bff,#c084fc)">
                <div style={{ ...whiteCard, width: "100%", maxWidth: 340, padding: 18 }}>
                  <p style={{ margin: 0, fontWeight: 600, color: COLORS.black, display: "flex", alignItems: "center", gap: 8 }}><CalendarCheck size={18} color={COLORS.purple} aria-hidden="true" /> Saturday</p>
                  <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                    {["11:00 AM", "2:00 PM", "4:00 PM"].map((t) => (
                      <span key={t} style={{ padding: "8px 12px", borderRadius: 10, fontSize: 14, fontWeight: 600, border: `1px solid ${t === "2:00 PM" ? COLORS.purple : COLORS.border}`,
                        background: t === "2:00 PM" ? "#f1ecff" : "#fff", color: t === "2:00 PM" ? COLORS.purple : COLORS.black }}>{t}</span>
                    ))}
                  </div>
                  <p style={{ margin: "14px 0 0", fontSize: 14, color: COLORS.green, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}><Check size={16} aria-hidden="true" /> Booked for Saturday, 2:00 PM</p>
                </div>
              </Feature>
            </Reveal>
            <Reveal style={{ height: "100%" }}>
              <Feature title="Speaks every language" text="Customers write in Hindi, Hinglish, English or Spanish: it answers in theirs, automatically." tint="linear-gradient(135deg,#f59e0b,#ef4444)">
                <div style={{ width: "100%", maxWidth: 380, display: "flex", flexDirection: "column", gap: 10 }}>
                  <Bubble from="visitor">Kal delivery ho sakti hai?</Bubble>
                  <Bubble from="agent">Haan! Kal subah 9 baje se delivery ho jayegi.</Bubble>
                  <Bubble from="visitor">¿Abren el domingo?</Bubble>
                </div>
              </Feature>
            </Reveal>
            <Reveal delay={0.06} style={{ height: "100%" }}>
              <Feature title="On WhatsApp, Instagram and Messenger" text="The same agent can answer where your customers already are, not just on your website." tint="linear-gradient(135deg,#0ea5e9,#22c55e)">
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  {(["whatsapp", "instagram", "messenger"] as const).map((b) => (
                    <span key={b} style={{ ...whiteCard, width: 84, height: 84, borderRadius: 24, display: "grid", placeItems: "center" }}><BrandIcon brand={b} size={42} /></span>
                  ))}
                </div>
              </Feature>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Who it's for. */}
      {categories.length > 0 && (
        <section className="fs-section" style={section}>
          <Reveal>
            <div style={{ textAlign: "center" }}>
              <Tag text="Made For Businesses Like Yours" />
              <ul style={{ listStyle: "none", padding: 0, margin: "28px 0 0", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
                {categories.filter((c) => c.key !== "other").map((c) => (
                  <li key={c.key} style={{ border: `1px solid ${COLORS.border}`, borderRadius: 999, padding: "9px 18px", fontSize: 15, color: COLORS.black, background: "#fff" }}>{c.label}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </section>
      )}

      {/* FAQ, in the site's two-column layout. */}
      <section id="faq" className="fs-section" style={{ ...section, padding: "100px 40px 80px" }}>
        <div className="fs-row fs-faq-layout" style={{ display: "flex", gap: 80, alignItems: "flex-start" }}>
          <div className="fs-faq-sidebar" style={{ flex: "0 0 33%", minWidth: 0 }}>
            <Reveal>
              <Tag text="Common Questions" />
              <h2 style={{ ...h2Style, margin: "20px 0 16px" }}>Frequently asked questions</h2>
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

      {/* Final call. */}
      <section style={{ width: "100%", maxWidth: 1280, margin: "0 auto", padding: "0 40px 100px" }}>
        <Reveal>
          <div className="fs-cta-inner" style={{ background: `linear-gradient(135deg, ${COLORS.blue}, #2f6bff 55%, ${COLORS.purple})`, borderRadius: 28, padding: "80px 40px", textAlign: "center", color: "#fff" }}>
            <Tag text="Free Demo" light />
            <h2 style={{ ...h2Style, fontSize: "clamp(28px, 4vw, 56px)", margin: "20px auto 14px", maxWidth: 760 }}>See your website talk</h2>
            <p style={{ fontSize: 18, opacity: 0.9, margin: "0 auto 32px", maxWidth: 560 }}>It takes a minute to start, and your assistant is ready while you make a coffee.</p>
            <a href="#start" className="fs-cta-btn fs-ai-link" style={{ background: "#fff", color: COLORS.blue }}>Build my chatbot →</a>
          </div>
        </Reveal>
      </section>

      <Footer />
    </>
  );
}
