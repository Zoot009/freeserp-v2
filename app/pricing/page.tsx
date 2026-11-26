import type { Metadata } from "next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import "./pricing.css";
import { Topups } from "./PricingPlans";
import { PlanPicker } from "./PlanPicker";
import { ComparePlans } from "./ComparePlans";
import { Enterprise } from "./Enterprise";

const PAGE_URL = "https://freeserp.com/pricing";

export const metadata: Metadata = {
  title: "Pricing | FreeSERP",
  description:
    "Credit-based SEO tooling from $1/mo billed yearly. Rank tracking, local grid scans, site audits, keyword research and competitor analysis, all from one balance. Free for 3 months: Google rank tracking with 100 credits a month, no card.",
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Pricing | FreeSERP",
    description: "From $1/mo billed yearly. Every tool on every paid plan, paid for from one credit balance. Free for 3 months: Google rank tracking, 100 credits a month, no card.",
    url: PAGE_URL,
    siteName: "FreeSERP",
    type: "website",
  },
};

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
            <span style={{ color: "#4a8fff", fontSize: 10 }}>◆</span> Pricing
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
            <span style={{ color: "#4a8fff" }}>No surprises.</span>
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
            One balance, every tool. Plans from $1/month billed yearly, or try Google rank tracking free for 3 months — no card.
          </p>
        </section>

        {/* ── Light content body ── */}
        <div style={{ background: "#f5f6f8" }}>

          {/* Free is a peer of the paid tiers, not a footnote beside them. */}
          <section style={{ maxWidth: 1320, margin: "0 auto", padding: "52px 16px 46px" }}>
            <PlanPicker />

            <p
              style={{
                textAlign: "center",
                fontSize: 13,
                color: "#6b7280",
                margin: "32px auto 0",
                maxWidth: 640,
                lineHeight: 1.65,
              }}
            >
              Five credits check one keyword. Plan credits refill every month, on annual plans too;
              top-ups last a month. Whatever expires soonest is always spent first.
            </p>
          </section>

          <ComparePlans />
          <Topups />
          <Enterprise />


        </div>
      </main>

      <Footer />
    </>
  );
}
