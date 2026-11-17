import type { ReactNode } from "react";
import { DemoTabs } from "./DemoTabs";

/**
 * "Try it" band placed right after a landing page's hero. Styled inline so it
 * sits on any of the landing pages' design systems; the demos inside carry
 * their own card. Pass one demo as `children`, or several as `tabs`.
 */
export function DemoSection({
  title = "See it in action",
  sub = "An interactive example of the results screen. Click, toggle and drag — it works like the real tool.",
  children,
  tabs,
}: {
  title?: string;
  sub?: string;
  children?: ReactNode;
  tabs?: { label: string; demo: ReactNode }[];
}) {
  return (
    <section id="demo" style={{ padding: "64px 0", scrollMarginTop: 80 }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 20px" }}>
        <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 28px" }}>
          <span
            style={{
              display: "inline-block",
              background: "#ebf1ff",
              color: "#0454ff",
              borderRadius: 100,
              padding: "6px 14px",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.06em",
            }}
          >
            INTERACTIVE DEMO
          </span>
          <h2
            style={{
              fontSize: "clamp(26px, 3.4vw, 40px)",
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              margin: "14px 0 10px",
              color: "#0b0d12",
            }}
          >
            {title}
          </h2>
          <p style={{ color: "#6d6d6d", fontSize: 16, lineHeight: 1.55, margin: 0 }}>{sub}</p>
        </div>
        {tabs ? <DemoTabs tabs={tabs} /> : children}
      </div>
    </section>
  );
}
