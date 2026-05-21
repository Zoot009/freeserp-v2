import Image from "next/image";
import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { SparkleIcon } from "@/components/site/icons";
import { COLORS } from "@/components/site/constants";
import { USE_CASES } from "./data";

export function UseCases() {
  return (
    <section
      id="who-uses"
      style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 40px 0", scrollMarginTop: 80 }}
    >
      <SectionHead
        tag="Built For"
        title="Who uses this free SERP checker"
        sub="FreeSERP is built for people who need accurate Google rankings without paying for enterprise tools they won't fully use."
      />
      <div className="fs-grid-3" style={{ marginTop: 56 }}>
        {USE_CASES.map((u, i) => (
          <Reveal key={u.title} delay={i * 0.1}>
            <div
              className="fs-card"
              style={{
                border: `1px solid ${COLORS.border}`,
                borderRadius: 16,
                padding: 28,
                height: "100%",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: u.img ? COLORS.blueBg : COLORS.blue,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                {u.img ? (
                  <Image
                    src={u.img}
                    alt={u.alt ?? ""}
                    title={u.title}
                    width={26}
                    height={26}
                    style={{ display: "block" }}
                  />
                ) : (
                  <SparkleIcon size={20} fill="#fff" />
                )}
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em", margin: 0 }}>
                {u.title}
              </h3>
              <p style={{ color: COLORS.gray, fontSize: 15, lineHeight: 1.55, margin: "10px 0 0" }}>
                {u.desc}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
