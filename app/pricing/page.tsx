import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { ArrowUpRight } from "@/components/site/icons";

const PAGE_URL = "https://freeserp.com/pricing";
const DESCRIPTION =
  "FreeSERP pricing plans are on the way. For now, the SERP checker is 100% free — no signup, no credit card, no limits.";

export const metadata: Metadata = {
  title: "Pricing — Coming Soon | FreeSERP",
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  // Placeholder page — keep it out of search until real plans ship, so a thin
  // "coming soon" page doesn't get indexed. Flip `index` to true once it's live.
  robots: { index: false, follow: true },
  openGraph: {
    title: "Pricing — Coming Soon | FreeSERP",
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: "FreeSERP",
    type: "website",
  },
};

export default function PricingPage() {
  return (
    <>
      {/* Nav has white text on a transparent bar, so the page needs a dark
          hero behind it — hence the radial-gradient background on <main>. */}
      <Nav />
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "180px 24px 140px",
          background: "radial-gradient(120% 80% at 50% 0%, #1a2b6b 0%, #0a0a14 55%)",
          color: "#fff",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,255,255,.08)",
            border: "1px solid rgba(255,255,255,.14)",
            color: "#fff",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            padding: "8px 16px",
            borderRadius: 100,
          }}
        >
          Pricing
        </span>

        <h1
          style={{
            fontSize: "clamp(44px, 8vw, 104px)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1.02,
            margin: "28px 0 0",
          }}
        >
          Coming soon
        </h1>

        <p
          style={{
            fontSize: 18,
            lineHeight: 1.6,
            color: "rgba(255,255,255,.7)",
            margin: "20px 0 0",
            maxWidth: 540,
          }}
        >
          We&apos;re putting the finishing touches on our plans. In the meantime,
          the FreeSERP checker is 100% free — no signup, no credit card, no limits.
        </p>

        <Link
          href="/serp-checker"
          className="fs-cta-btn"
          style={{
            background: "#fff",
            color: "#000",
            marginTop: 36,
            padding: "15px 30px",
            fontSize: 15,
          }}
        >
          Try the free SERP checker
          <span className="fs-arrow-wrap">
            <span className="fs-arrow fs-arrow-1">
              <ArrowUpRight />
            </span>
            <span className="fs-arrow fs-arrow-2">
              <ArrowUpRight />
            </span>
          </span>
        </Link>
      </main>
      <Footer />
    </>
  );
}
