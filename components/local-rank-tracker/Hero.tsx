import { Reveal } from "@/components/site/Reveal";
import { Tag } from "@/components/site/Tag";
import { AppCtaLink } from "@/components/site/AppCtaLink";
import { COLORS } from "@/components/site/constants";

export function Hero() {
  return (
    <header
      className="fs-serp-hero"
      style={{
        paddingTop: 132,
        paddingBottom: 44,
        textAlign: "center",
        position: "relative",
      }}
    >
      <div
        className="fs-serp-hero-inner"
        style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px", position: "relative", zIndex: 1 }}
      >
        <Reveal>
          <Tag text="City, Organic & Map Pack" light />
          <h1
            style={{
              color: "#fff",
              fontSize: "clamp(36px, 5.5vw, 76px)",
              fontWeight: 600,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              margin: "20px 0 0",
            }}
          >
            Local Rank Tracker
          </h1>
          <p
            style={{
              color: "#fff",
              maxWidth: 700,
              margin: "20px auto 36px",
              fontSize: 17,
              lineHeight: 1.5,
              fontWeight: 400,
              letterSpacing: "-0.2px",
              opacity: 0.92,
            }}
          >
            Track Google keyword positions by city or postcode, on mobile and desktop, and see
            when a search returns a Map Pack. The results your customers get, from where they
            actually search.
          </p>

          <div style={{ display: "inline-flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            {/* White, not COLORS.blue: the hero band is itself blue, and the
                brand blue button disappears into it. */}
            <AppCtaLink
              path="/signup"
              className="fs-btn"
              style={{
                display: "inline-block",
                background: "#fff",
                color: COLORS.blue,
                padding: "14px 32px",
                borderRadius: 100,
                textDecoration: "none",
                fontWeight: 600,
                boxShadow: "0 8px 24px rgba(0,0,0,.18)",
              }}
            >
              Track Local Rankings →
            </AppCtaLink>
            <a
              href="#workflows"
              className="fs-btn"
              style={{
                display: "inline-block",
                background: "rgba(255,255,255,.14)",
                color: "#fff",
                padding: "14px 32px",
                borderRadius: 100,
                textDecoration: "none",
                fontWeight: 600,
                border: "1px solid rgba(255,255,255,.35)",
                backdropFilter: "blur(8px)",
              }}
            >
              Organic vs Map Pack
            </a>
          </div>

          <p style={{ color: "#fff", opacity: 0.7, fontSize: 14, margin: "18px 0 0" }}>
            100 free credits every month · No credit card
          </p>
        </Reveal>
      </div>
    </header>
  );
}
