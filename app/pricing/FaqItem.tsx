"use client";

import { useState } from "react";

export function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        overflow: "hidden",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 20px",
          fontSize: 14,
          fontWeight: 600,
          color: "#111",
          background: "none",
          border: "none",
          cursor: "pointer",
          gap: 12,
          textAlign: "left",
        }}
      >
        <span>{q}</span>
        <span
          style={{
            display: "grid",
            placeItems: "center",
            width: 26,
            height: 26,
            borderRadius: 8,
            background: open ? "#0454ff" : "#eff6ff",
            color: open ? "#fff" : "#0454ff",
            fontSize: 18,
            fontWeight: 400,
            flexShrink: 0,
            lineHeight: 1,
            transition: "background .15s, color .15s",
          }}
        >
          {open ? "−" : "+"}
        </span>
      </button>

      {open && (
        <div
          style={{
            padding: "0 20px 18px",
            fontSize: 13,
            lineHeight: 1.65,
            color: "#6b7280",
          }}
        >
          {a}
        </div>
      )}
    </div>
  );
}
