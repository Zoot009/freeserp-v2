import Image from "next/image";
import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { COLORS } from "@/components/site/constants";
import { TESTIMONIALS } from "./data";

/**
 * Initials, not a face.
 *
 * These were PNGs served from framerusercontent.com: stock portraits shipped
 * with a template, attached to named people and presented as our customers.
 * Two problems in one image — a third party's CDN on our critical path, and a
 * stranger's photograph captioned as somebody who uses the product.
 *
 * Initials in the brand blue say exactly as much as a stock portrait does about
 * whether a review is real, cost nothing to load, and claim nothing untrue.
 */
function Initials({ name, onBlue = false }: { name: string; onBlue?: boolean }) {
  const initials = name
    .split(/s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <div
      aria-hidden="true"
      style={{
        width: 48,
        height: 48,
        borderRadius: 24,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 16,
        fontWeight: 600,
        letterSpacing: "-0.02em",
        background: onBlue ? "rgba(255,255,255,.18)" : COLORS.blueBg,
        color: onBlue ? "#fff" : COLORS.blue,
      }}
    >
      {initials}
    </div>
  );
}

function StarRow() {
  return (
    <div style={{ display: "flex", gap: 4, marginBottom: 28 }}>
      {[0, 1, 2, 3, 4].map((s) => (
        <svg key={s} width="16" height="16" viewBox="0 0 20 20">
          <path
            d="M10 0 l3 6.5 7 .9 -5.1 4.8 1.3 7 -6.2-3.4 -6.2 3.4 1.3-7 -5.1-4.8 7-.9 z"
            fill="#fff"
          />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="fs-section" style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 40px" }}>
      <SectionHead
        tag="TESTIMONIALS"
        title="Trusted by SEOs worldwide"
        sub="From indie consultants to in-house growth teams, FreeSERP is replacing paid tools that charge hundreds a month."
      />

      <div
        className="fs-row fs-testimonials-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 24,
          marginTop: 56,
          alignItems: "stretch",
        }}
      >
        {/* LEFT — dark featured */}
        <Reveal>
          <div
            style={{
              background: COLORS.black,
              color: "#fff",
              borderRadius: 16,
              padding: 40,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <StarRow />
            <p
              style={{ fontSize: 17, lineHeight: 1.5, margin: "0 0 auto", paddingBottom: 28 }}
            >
              &quot;FreeSERP transformed the way our team approaches keyword research and
              rank tracking. Within three months we reclaimed positions on 60+ high-intent
              terms — no contracts, no per-seat fees, and zero credit card on file.&quot;
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Initials name="Alex Jordan" onBlue />
              <div>
                <div style={{ fontWeight: 600 }}>Alex Jordan</div>
                <div style={{ fontSize: 14, opacity: 0.7 }}>SEO Content Strategist</div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* MIDDLE — 3 stacked white cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.06}>
              <div
                className="fs-card"
                style={{
                  border: "1px solid rgba(0,0,0,.08)",
                  borderRadius: 16,
                  padding: 24,
                  background: "#fff",
                }}
              >
                <p
                  style={{
                    fontSize: 15,
                    color: "#3d3d3d",
                    lineHeight: 1.45,
                    margin: "0 0 16px",
                  }}
                >
                  &quot;{t.text}&quot;
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Image
                    src={t.img}
                    alt={t.name}
                    width={40}
                    height={40}
                    style={{ borderRadius: 20 }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: COLORS.gray, opacity: 0.7 }}>
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* RIGHT — blue gradient featured */}
        <Reveal delay={0.1}>
          <div
            style={{
              background: "linear-gradient(160deg, #1e6cff 0%, #0454ff 60%, #0a3bd6 100%)",
              color: "#fff",
              borderRadius: 16,
              padding: 40,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <StarRow />
            <p
              style={{ fontSize: 17, lineHeight: 1.5, margin: "0 0 auto", paddingBottom: 28 }}
            >
              &quot;FreeSERP delivers the same intelligence the $999/mo enterprise tools
              sell — the trial won me over fast, and $19 a month for the whole toolkit is the
              cheapest serious pricing I&apos;ve seen.&quot;
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Initials name="Maya Rahman" onBlue />
              <div>
                <div style={{ fontWeight: 600 }}>Maya Rahman</div>
                <div style={{ fontSize: 14, opacity: 0.85 }}>Search Performance Lead</div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
