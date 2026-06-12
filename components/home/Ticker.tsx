import { COLORS } from "@/components/site/constants";

const LOGOS = [
  { src: "/logos/logo-1.svg", alt: "Tata Steel" },
  { src: "/logos/logo-2.svg", alt: "InCaps" },
  { src: "/logos/logo-3.svg", alt: "Brand" },
  { src: "/logos/logo-4.svg", alt: "Sony" },
  { src: "/logos/logo-5.svg", alt: "Payoneer" },
  { src: "/logos/logo-6.svg", alt: "HSBC" },
  { src: "/logos/logo-7.svg", alt: "Delivery" },
  { src: "/logos/logo-8.svg", alt: "Yamaha" },
];

export function Ticker() {
  return (
    <section className="fs-ticker-section" style={{ width: "100%", maxWidth: 1280, margin: "0 auto", padding: "80px 40px 40px", overflow: "hidden", minWidth: 0 }}>
      <p
        style={{
          textAlign: "center",
          fontSize: 18,
          fontWeight: 500,
          color: COLORS.black,
          margin: "0 0 32px",
          padding: "0 24px",
        }}
      >
        50M+ Keywords · 190 Countries · Daily Updates · Free Tier Available
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
          {[...LOGOS, ...LOGOS].map((logo, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={logo.src}
              alt={logo.alt}
              loading="lazy"
              decoding="async"
              style={{ maxHeight: 32, maxWidth: 160, width: "auto", height: "auto", opacity: 0.7, filter: "grayscale(100%)" }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
