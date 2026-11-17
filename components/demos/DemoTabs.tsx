"use client";

import { useState, type ReactNode } from "react";

/** Tab strip for pages that cover several tools. Only the active demo is mounted, so idle ones cost nothing. */
export function DemoTabs({ tabs }: { tabs: { label: string; demo: ReactNode }[] }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div
        role="tablist"
        aria-label="Choose a tool"
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginBottom: 20 }}
      >
        {tabs.map((t, i) => (
          <button
            key={t.label}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            style={{
              border: `1px solid ${i === active ? "#0454ff" : "#eaeaea"}`,
              background: i === active ? "#0454ff" : "#fff",
              color: i === active ? "#fff" : "#0b0d12",
              borderRadius: 100,
              padding: "9px 16px",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel">{tabs[active].demo}</div>
    </div>
  );
}
