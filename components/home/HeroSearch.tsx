"use client";

import { COLORS } from "@/components/site/constants";

export function HeroSearch() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      style={{
        display: "flex",
        maxWidth: 360,
        margin: "32px auto 0",
        background: "#fff",
        borderRadius: 100,
        padding: 5,
        alignItems: "center",
      }}
    >
      <input
        type="text"
        placeholder="Enter a keyword to check"
        style={{
          flex: 1,
          border: "none",
          outline: "none",
          padding: "12px 18px",
          fontSize: 15,
          background: "transparent",
          color: COLORS.black,
        }}
      />
      <button
        className="fs-btn"
        type="submit"
        style={{
          background: "#000",
          color: "#fff",
          border: "none",
          padding: "10px 22px",
          borderRadius: 100,
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        Check SERP
      </button>
    </form>
  );
}
