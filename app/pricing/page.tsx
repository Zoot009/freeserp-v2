import type { Metadata } from "next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { AppCtaLink } from "@/components/site/AppCtaLink";
import { PricingAccordion } from "./PricingAccordion";

const PAGE_URL = "https://freeserp.com/pricing";

export const metadata: Metadata = {
  title: "Pricing | FreeSERP",
  description:
    "Simple worker subscription pricing, monthly or annual. From $5/mo (5 workers = 75 rank checks/day). Free: 3 checks in a 7-day trial, no card.",
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Pricing | FreeSERP",
    description: "Worker subscriptions from $5/mo — 5 workers, 75 rank checks a day. Free 7-day trial with 3 checks.",
    url: PAGE_URL,
    siteName: "FreeSERP",
    type: "website",
  },
};

const FREE_FEATURES: { text: string; muted?: boolean }[] = [
  { text: "3 rank checks in a 7-day trial" },
  { text: "Manual checks only", muted: true },
  { text: "All locations & devices" },
  { text: "No credit card required" },
];

function CheckIcon() {
  return (
    <span
      style={{
        display: "grid",
        placeItems: "center",
        width: 18,
        height: 18,
        flexShrink: 0,
        borderRadius: 6,
        background: "#eff6ff",
        color: "#0454ff",
        marginTop: 1,
      }}
    >
      <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
        <path d="M2 7L5.5 10.5L12 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

// 1 worker = 15 rank checks / day · $1/worker/month (or $10/worker/year)
const PLANS: { price: number; checks: number; label: string; popular?: boolean }[] = [
  { price: 5,   checks: 75,   label: "Starter"    },
  { price: 10,  checks: 150,  label: "Standard"   },
  { price: 20,  checks: 300,  label: "Popular", popular: true },
  { price: 40,  checks: 600,  label: "Growth"     },
  { price: 50,  checks: 750,  label: "Business"   },
  { price: 100, checks: 1500, label: "Scale"      },
  { price: 500, checks: 7500, label: "Enterprise" },
];


export default function PricingPage() {
  return (
    <>
      <Nav currentNav="Pricing" />

      <main>
        {/* ── Dark hero — keeps white nav text readable ── */}
        <section
          style={{
            background: "radial-gradient(130% 90% at 50% 0%, #0f1f5c 0%, #0a0a14 58%)",
            textAlign: "center",
            padding: "164px 24px 72px",
            color: "#fff",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#7aabff",
              marginBottom: 22,
            }}
          >
            <span style={{ color: "#4a9eff", fontSize: 10 }}>◆</span> Pricing
          </span>

          <h1
            style={{
              fontSize: "clamp(32px, 7vw, 52px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.08,
              margin: 0,
            }}
          >
            Simple plans.{" "}
            <span style={{ color: "#4a9eff" }}>No surprises.</span>
          </h1>

          <p
            style={{
              fontSize: 15,
              lineHeight: 1.65,
              color: "rgba(255,255,255,.5)",
              margin: "14px auto 0",
              maxWidth: 440,
            }}
          >
            Worker subscriptions from $5/month — 5 workers, 75 rank checks a day. Cancel anytime.
          </p>
        </section>

        {/* ── Light content body ── */}
        <div style={{ background: "#f4f6fb" }}>

          {/* Plans layout */}
          <section style={{ maxWidth: 980, margin: "0 auto", padding: "52px 24px 56px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: 24,
                alignItems: "stretch",
              }}
            >
              {/* Left: Free plan */}
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 20,
                  padding: 28,
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 2px 12px rgba(0,0,0,.07)",
                }}
              >
                <span
                  style={{
                    alignSelf: "flex-start",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    padding: "4px 12px",
                    borderRadius: 100,
                    background: "#eff6ff",
                    color: "#0454ff",
                    marginBottom: 18,
                  }}
                >
                  Free
                </span>

                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 }}>
                  <span
                    style={{
                      fontSize: "clamp(42px, 8vw, 56px)",
                      fontWeight: 700,
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                      color: "#111",
                    }}
                  >
                    $0
                  </span>
                  <span style={{ fontSize: 14, color: "#9ca3af" }}>/7-day trial</span>
                </div>

                <p style={{ fontSize: 14, color: "#9ca3af", margin: "0 0 20px" }}>
                  3 rank checks to try it out. No card required.
                </p>

                <div style={{ height: 1, background: "#f3f4f6", marginBottom: 20 }} />

                <ul
                  style={{
                    listStyle: "none",
                    margin: "0 0 auto",
                    padding: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {FREE_FEATURES.map((f) => (
                    <li
                      key={f.text}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        fontSize: 13,
                        color: f.muted ? "#f59e0b" : "#374151",
                      }}
                    >
                      <CheckIcon />
                      <span>{f.text}</span>
                    </li>
                  ))}
                </ul>

                <AppCtaLink
                  path="/signup"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    padding: "14px 20px",
                    fontSize: 15,
                    fontWeight: 600,
                    borderRadius: 12,
                    textDecoration: "none",
                    background: "#f4f6fb",
                    color: "#111",
                    border: "1px solid #e5e7eb",
                    marginTop: 24,
                  }}
                >
                  Start Free Trial
                </AppCtaLink>
              </div>

              {/* Right: Paid plans stepper */}
              <PricingAccordion plans={PLANS} />
            </div>
          </section>


        </div>
      </main>

      <Footer />
    </>
  );
}
