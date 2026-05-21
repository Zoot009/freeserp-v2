import { COLORS } from "./constants";

export function Tag({ text, light = false }: { text: string; light?: boolean }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, margin: "0 auto" }}>
      <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
        <path
          d="M 10 0 C 10.2 5.44 14.56 9.8 20 10 C 14.56 10.2 10.2 14.56 10 20 C 9.8 14.56 5.44 10.2 0 10 C 5.44 9.8 9.8 5.44 10 0 Z"
          fill={light ? "#fff" : COLORS.blue}
        />
      </svg>
      <span
        style={{
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: "0.02em",
          color: light ? "#fff" : COLORS.black,
        }}
      >
        {text}
      </span>
    </div>
  );
}
