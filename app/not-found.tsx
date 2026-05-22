import Link from "next/link";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { ArrowUpRight } from "@/components/site/icons";

// Root not-found — also catches every unmatched URL across the marketing site.
// Next auto-injects `<meta name="robots" content="noindex">` for 404s, so there's
// nothing to configure for SEO here.
//
// The page uses a dark hero: Nav has white text on a transparent bar, so a
// white background would make the nav invisible (same constraint as /pricing).
export default function NotFound() {
  return (
    <>
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
        {/* Big "404" with "ERROR" overlaid across the top of the digits */}
        <div style={{ position: "relative", display: "inline-block" }}>
          <div
            style={{
              fontSize: "clamp(150px, 30vw, 360px)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 0.82,
              // Light-blue gradient clipped to the digits.
              background: "linear-gradient(180deg, #a5c5ff 0%, #2f6bff 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
            }}
          >
            404
          </div>
        </div>

        <h1
          style={{
            fontSize: "clamp(30px, 4.6vw, 54px)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            color: "#fff",
            margin: "36px 0 0",
          }}
        >
          Oops! Page not found
        </h1>
        <p
          style={{
            fontSize: 17,
            lineHeight: 1.6,
            color: "rgba(255,255,255,.7)",
            margin: "14px 0 0",
            maxWidth: 540,
          }}
        >
          The page you&apos;re looking for doesn&apos;t exist, moved, or got lost in the
          digital void.
        </p>

        <Link
          href="/"
          className="fs-cta-btn"
          style={{
            background: "#fff",
            color: "#000",
            marginTop: 32,
            padding: "15px 30px",
            fontSize: 15,
          }}
        >
          Back to Homepage
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
