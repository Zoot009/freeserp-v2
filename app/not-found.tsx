import Link from "next/link";
import { COLORS } from "@/components/site/constants";
import { ArrowUpRight } from "@/components/site/icons";

// Root not-found — also catches every unmatched URL across the marketing site.
// Next auto-injects `<meta name="robots" content="noindex">` for 404s, so there's
// nothing to configure for SEO here.
export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        background: "#fff",
        padding: "100px 24px",
      }}
    >
      {/* Big "404" with "ERROR" overlaid across the top of the digits */}
      <div style={{ position: "relative", display: "inline-block" }}>
        <div
          style={{
            fontSize: "clamp(150px, 30vw, 360px)",
            fontWeight: 900,
            color: COLORS.blue,
            letterSpacing: "-0.04em",
            lineHeight: 0.82,
          }}
        >
          404
        </div>
        <span
          style={{
            position: "absolute",
            top: "17%",
            left: "51%",
            transform: "translate(-50%, -50%)",
            color: "#fff",
            fontSize: "clamp(12px, 2.4vw, 28px)",
            fontWeight: 900,
            letterSpacing: "0.05em",
            whiteSpace: "nowrap",
          }}
        >
          ERROR
        </span>
      </div>

      <h1
        style={{
          fontSize: "clamp(30px, 4.6vw, 54px)",
          fontWeight: 700,
          letterSpacing: "-0.04em",
          color: COLORS.black,
          margin: "36px 0 0",
        }}
      >
        Oops! Page not found
      </h1>
      <p
        style={{
          fontSize: 17,
          lineHeight: 1.6,
          color: COLORS.gray,
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
          background: "#000",
          color: "#fff",
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
  );
}
