import { appUrl } from "./constants";

const COLS = [
  { h: "Product", l: ["Features", "Blog", "Dashboard"] },
  { h: "Legal", l: ["Privacy Policy", "Terms of Service"] },
  { h: "Connect", l: ["Contact Us", "support@freeserp.com", "Twitter", "LinkedIn", "GitHub"] },
] as const;

// Known destinations for footer labels — anything not listed falls back to "#".
// "Dashboard" lives in the product app on the app.freeserp.com domain.
const FOOTER_HREFS: Record<string, string> = {
  Features: "/#features",
  Blog: "/blog",
  Dashboard: appUrl("/dashboard"),
  "Privacy Policy": "/privacy",
  "Terms of Service": "/terms",
  "support@freeserp.com": "mailto:support@freeserp.com",
};

export function Footer() {
  return (
    <footer style={{ background: "#0a0a14", color: "#fff" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 40px 40px" }}>
        <div
          className="fs-row"
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 60,
            flexWrap: "wrap",
          }}
        >
          <div style={{ maxWidth: 320 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 22 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
                <path d="M12 0 C12.3 6.6 17.4 11.7 24 12 C17.4 12.3 12.3 17.4 12 24 C11.7 17.4 6.6 12.3 0 12 C6.6 11.7 11.7 6.6 12 0 Z" />
              </svg>
              FreeSerp
            </span>
            <p style={{ color: "rgba(255,255,255,.55)", fontSize: 15, lineHeight: 1.5, marginTop: 16 }}>
              Free SERP tracking and keyword research for SEOs, marketers, and developers.
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.h}>
              <h5
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  margin: "0 0 16px",
                  color: "#fff",
                }}
              >
                {col.h}
              </h5>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {col.l.map((x) => (
                  <a key={x} href={FOOTER_HREFS[x] ?? "#"} className="fs-footer-link">
                    {x}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 60,
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,.08)",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            color: "rgba(255,255,255,.45)",
            fontSize: 14,
          }}
        >
          <span>© FreeSERP 2026. All Rights Reserved</span>
          <span>Made with precision for SEO professionals</span>
        </div>
      </div>
    </footer>
  );
}
