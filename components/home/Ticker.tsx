import { COLORS } from "@/components/site/constants";

const LOGOS = [
  "vmZeygJDTzMny1LbISsT2fyXMs",
  "6TpdvbGWLjUI9Cl5wQ2YY2RDdHM",
  "SZa6YJ2xI3SLpPgoxDNehnSxEHM",
  "xSlbl9OiWrQ9obNU9KQRmY3OMyY",
  "uYFMZLVQeM7BkN8SYnR23sgD4",
  "6wWE1Wvll7XiXTVbo1gI7mYY3Io",
];

export function Ticker() {
  return (
    <section className="fs-ticker-section" style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 40px 40px" }}>
      <p
        style={{
          textAlign: "center",
          fontSize: 18,
          fontWeight: 500,
          color: COLORS.black,
          margin: "0 0 32px",
        }}
      >
        50M+ Keywords · 190 Countries · Daily Updates · Free Forever
      </p>
      <div
        style={{
          overflow: "hidden",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)",
          maskImage:
            "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 86,
            width: "max-content",
            animation: "fs-ticker 22s linear infinite",
            alignItems: "center",
          }}
        >
          {[...LOGOS, ...LOGOS].map((id, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={`https://framerusercontent.com/images/${id}.svg`}
              alt="logo"
              loading="lazy"
              decoding="async"
              style={{ height: 32, opacity: 0.7 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
