"use client";

import { pushDataLayer } from "@/lib/gtm";

export function PricingCta({
  href,
  popular,
}: {
  href: string;
  popular?: boolean;
}) {
  return (
    <a
      href={href}
      onClick={() => pushDataLayer({ event: "cta_click" })}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        marginTop: "auto",
        paddingTop: 20,
        padding: "12px 20px",
        fontSize: 14,
        fontWeight: 600,
        borderRadius: 10,
        textDecoration: "none",
        cursor: "pointer",
        transition: "opacity .15s",
        ...(popular
          ? {
              background: "#0454ff",
              color: "#fff",
              border: "none",
              boxShadow: "0 4px 14px rgba(4,84,255,.3)",
            }
          : {
              background: "#fff",
              color: "#111",
              border: "1px solid #d1d5db",
              boxShadow: "0 1px 3px rgba(0,0,0,.06)",
            }),
      }}
    >
      {popular ? "Get started →" : "Get started"}
    </a>
  );
}
