"use client";

import Link from "next/link";
import { pushDataLayer } from "@/lib/gtm";

export function PricingCta({ children }: { children: React.ReactNode }) {
  return (
    <Link
      href="/serp-checker"
      onClick={() => pushDataLayer({ event: "cta_click" })}
      className="fs-cta-btn"
      style={{
        background: "#fff",
        color: "#000",
        marginTop: 36,
        padding: "15px 30px",
        fontSize: 15,
      }}
    >
      {children}
    </Link>
  );
}
