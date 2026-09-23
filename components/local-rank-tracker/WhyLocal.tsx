import Image from "next/image";
import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { COLORS } from "@/components/site/constants";
import { WHY_CALLOUTS } from "./data";

export function WhyLocal() {
  return (
    <section
      id="why-local"
      className="fs-serp-section"
      style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 40px 0", scrollMarginTop: 80 }}
    >
      <SectionHead tag="Why It Matters" title="Why national rankings mislead local businesses" />
      <div
        className="fs-row fs-why-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 56,
          marginTop: 56,
          alignItems: "start",
        }}
      >
        <Reveal>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: COLORS.gray, margin: 0 }}>
            Google has not shown one set of results for a country in a very long time. For
            anything with local intent it reorders the page around where the searcher is,
            swaps in a Local Pack, and promotes nearby businesses over better-known distant
            ones. A national position for &ldquo;emergency electrician&rdquo; is an average of
            thousands of different pages, none of which anyone saw.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: COLORS.gray, margin: "16px 0 0" }}>
            The practical damage is that the number moves for reasons you cannot act on. A
            competitor three cities away gains ground, your national average slips, and nothing
            has changed for the customers who could actually walk in. Meanwhile a real drop in
            your own town gets averaged into invisibility.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: COLORS.gray, margin: "16px 0 0" }}>
            Tracking the market you sell in fixes both. Set the keyword&apos;s location to the
            city — or the postcode, in a dense metro where one city is still too coarse — and
            every check runs as a search from there. The number then only moves when something
            has changed for the people you are trying to reach.
          </p>
          <div
            style={{
              marginTop: 20,
              padding: "14px 18px",
              borderRadius: 10,
              borderLeft: `3px solid ${COLORS.blue}`,
              background: COLORS.blueBg,
              color: COLORS.black,
              fontSize: 15,
              lineHeight: 1.5,
            }}
          >
            &ldquo;Where do we rank?&rdquo; is not answerable. &ldquo;Where do we rank in
            Leeds, on a phone?&rdquo; is — and it is the one the business actually needs.
          </div>
        </Reveal>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {WHY_CALLOUTS.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.08}>
              <div
                className="fs-card"
                style={{
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 14,
                  padding: 22,
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                }}
              >
                {c.img && (
                  <div
                    style={{
                      flexShrink: 0,
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: COLORS.blueBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      src={c.img}
                      alt={c.alt ?? ""}
                      title={c.title}
                      width={26}
                      height={26}
                      style={{ display: "block" }}
                    />
                  </div>
                )}
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.02em", margin: 0 }}>
                    {c.title}
                  </h3>
                  <p style={{ color: COLORS.gray, fontSize: 15, lineHeight: 1.55, margin: "6px 0 0" }}>
                    {c.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
