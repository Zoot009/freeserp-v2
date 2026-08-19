import type { Metadata } from "next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import "./pricing.css";
import { CREDIT_PLANS, FreeCard, PlanCard, TopupPacks } from "./PricingPlans";
import { ComparePlans } from "./ComparePlans";
import { Enterprise } from "./Enterprise";

const PAGE_URL = "https://freeserp.com/pricing";

export const metadata: Metadata = {
  title: "Pricing | FreeSERP",
  description:
    "Credit-based SEO tooling from $19/mo. Rank tracking, local grid scans, site audits, keyword research and competitor analysis, all from one balance. Free plan: 100 credits a month, no card.",
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Pricing | FreeSERP",
    description: "From $19/mo. Every tool on every plan, paid for from one credit balance. Free plan: 100 credits a month, no card.",
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
            One balance, every tool. Plans from $19/month, or start free with 100 credits — no card.
          </p>
        </section>

        {/* ── Light content body ── */}
        <div style={{ background: "#f5f6f8" }}>

          {/* Plans layout */}
          {/* Four tiers on one row. The free plan is a peer of the paid ones,
              not a footnote beside them. */}
          <section style={{ maxWidth: 1080, margin: "0 auto", padding: "52px 24px 46px" }}>
            <div className="pr-plans">
              <FreeCard />
              {CREDIT_PLANS.map((plan) => (
                <PlanCard key={plan.slug} plan={plan} />
              ))}
            </div>

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
              One credit checks one keyword. Monthly credits refill on your billing date; anything
              you buy on top lasts a year. Whatever expires soonest is always spent first.
            </p>
          </section>

          <ComparePlans />
          <TopupPacks />
          <Enterprise />


        </div>
      </main>

      <Footer />
    </>
  );
}
