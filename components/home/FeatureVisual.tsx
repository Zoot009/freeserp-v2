import { COLORS } from "@/components/site/constants";

export type FeatureVisualKind = "chart" | "nodes" | "ring" | "tasks";

export function FeatureVisual({ kind }: { kind: FeatureVisualKind }) {
  if (kind === "chart") {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          aspectRatio: "1.6",
          padding: 24,
          boxShadow: "0 8px 24px rgba(0,0,0,.08)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginBottom: 32,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1, height: 8, background: COLORS.softGray, borderRadius: 4 }} />
          <div style={{ width: 60, height: 8, background: COLORS.blue, borderRadius: 4 }} />
        </div>
        <svg viewBox="0 0 200 80" style={{ flex: 1, width: "100%" }} preserveAspectRatio="none">
          <defs>
            <linearGradient id="lg" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#0454ff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0454ff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 60 Q40 50 60 40 T100 30 T140 20 T200 10 L200 80 L0 80 Z" fill="url(#lg)" />
          <path
            d="M0 60 Q40 50 60 40 T100 30 T140 20 T200 10"
            fill="none"
            stroke="#0454ff"
            strokeWidth="2"
          />
        </svg>
      </div>
    );
  }
  if (kind === "nodes") {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          aspectRatio: "1.6",
          padding: 24,
          boxShadow: "0 8px 24px rgba(0,0,0,.06)",
          marginBottom: 32,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <svg viewBox="0 0 240 140" width="100%" height="100%" style={{ display: "block" }}>
          <line x1="120" y1="70" x2="40" y2="40" stroke="#cfd6e4" strokeWidth="1.5" />
          <line x1="120" y1="70" x2="200" y2="40" stroke="#cfd6e4" strokeWidth="1.5" />
          <line x1="120" y1="70" x2="40" y2="110" stroke="#cfd6e4" strokeWidth="1.5" />
          <line x1="120" y1="70" x2="200" y2="110" stroke="#cfd6e4" strokeWidth="1.5" />
          <circle cx="120" cy="70" r="24" fill="#0454ff" />
          {[
            [40, 40],
            [200, 40],
            [40, 110],
            [200, 110],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="14" fill="#fff" stroke="#cfd6e4" strokeWidth="1.5" />
          ))}
        </svg>
      </div>
    );
  }
  if (kind === "ring") {
    return (
      <div
        style={{
          background: "transparent",
          aspectRatio: "1.6",
          marginBottom: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" stroke="#e2e6ee" strokeWidth="10" fill="none" />
          <circle
            cx="60"
            cy="60"
            r="50"
            stroke="#0454ff"
            strokeWidth="10"
            fill="none"
            strokeDasharray="314"
            strokeDashoffset="100"
            transform="rotate(-90 60 60)"
            strokeLinecap="round"
          />
          <text
            x="60"
            y="68"
            textAnchor="middle"
            fontSize="22"
            fontWeight="700"
            fill={COLORS.black}
          >
            68%
          </text>
        </svg>
      </div>
    );
  }
  // tasks
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        aspectRatio: "1.6",
        padding: 20,
        boxShadow: "0 8px 24px rgba(0,0,0,.06)",
        marginBottom: 32,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {["Design review", "Customer call", "Send proposal"].map((task, i) => (
        <div
          key={task}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 12px",
            background: i === 0 ? "#ebf1ff" : "#f5f6f8",
            borderRadius: 8,
            border: i === 0 ? `1px solid ${COLORS.blue}` : "1px solid transparent",
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 8,
              background: i === 0 ? COLORS.blue : "#fff",
              border: i === 0 ? "none" : "1.5px solid #cfd6e4",
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 13, color: COLORS.black }}>{task}</span>
        </div>
      ))}
    </div>
  );
}
