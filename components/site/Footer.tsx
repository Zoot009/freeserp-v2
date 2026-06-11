import { appUrl } from "./constants";

const COLS = [
  { h: "Product", l: ["Features", "Rank Tracker", "Website Ranking Checker", "Blog", "Dashboard"] },
  { h: "Legal", l: ["Privacy Policy", "Terms of Service"] },
  { h: "Connect", l: ["Contact Us", "support@freeserp.com"] },
] as const;

const FOOTER_HREFS: Record<string, string> = {
  Features: "/#features",
  "Rank Tracker": "/rank-tracker",
  "Website Ranking Checker": "/website-ranking-checker",
  Blog: "/blog",
  Dashboard: appUrl("/dashboard"),
  "Privacy Policy": "/privacy",
  "Terms of Service": "/terms",
  "support@freeserp.com": "mailto:support@freeserp.com",
};

const SOCIAL = [
  {
    name: "LinkedIn",
    href: "https://in.linkedin.com/company/zootdigital",
    svg: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M19 0H1C.448 0 0 .448 0 1v18c0 .552.448 1 1 1h18c.552 0 1-.448 1-1V1c0-.552-.448-1-1-1zM5.922 17H2.667V7.867h3.255V17zM4.295 6.53a1.886 1.886 0 110-3.773 1.886 1.886 0 010 3.773zM17.333 17h-3.252v-4.432c0-1.058-.02-2.42-1.476-2.42-1.476 0-1.702 1.153-1.702 2.343V17H7.652V7.867h3.12v1.247h.044c.434-.823 1.496-1.69 3.08-1.69 3.29 0 3.898 2.167 3.898 4.985V17h-.46z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/zootdigitalmarketing/",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: "Twitter",
    href: "#",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer style={{ background: "#0a0a14", color: "#fff" }}>
      <div className="fs-footer-inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 40px 40px" }}>
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
                {col.h === "Connect" && (
                  <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                    {SOCIAL.map((s) => (
                      <a
                        key={s.name}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.name}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: "rgba(255,255,255,.1)",
                          color: "rgba(255,255,255,.7)",
                        }}
                      >
                        {s.svg}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div
          className="fs-footer-bottom"
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
