import type { CSSProperties } from "react";

/**
 * "View sample report" for a hero. Opens the report in a new tab.
 * `onDark` (default) is for the blue home-page background; `onLight` for pale heroes.
 */
export function HeroReportButton({
  href,
  variant = "onDark",
  style,
}: {
  href: string;
  variant?: "onDark" | "onLight";
  style?: CSSProperties;
}) {
  const light = variant === "onLight";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fs-btn"
      style={{
        display: "inline-block",
        background: light ? "#fff" : "rgba(255,255,255,.14)",
        border: light ? "1px solid #d9dce3" : "1px solid rgba(255,255,255,.35)",
        color: light ? "#0b0d12" : "#fff",
        padding: "15px 30px",
        borderRadius: 100,
        fontSize: 15,
        textDecoration: "none",
        fontWeight: 600,
        ...style,
      }}
    >
      View sample report
    </a>
  );
}
