import Image from "next/image";
import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { COLORS } from "@/components/site/constants";
import { PopCard } from "@/components/home/InsideApp";
import { TRACKERS } from "./tools";

/**
 * The four trackers, one alternating row each.
 *
 * InsideApp above this shows the Google tracker's dashboard; this section says
 * what is tracked at all — Google, the Map Pack, YouTube and the AI answers —
 * because a visitor who reads the home page and leaves currently has no way to
 * learn that the last three exist.
 *
 * Rows alternate image/text sides on desktop and stack image-first on mobile,
 * which is what `.fs-tracker-row` handles.
 */
export function Trackers() {
  return (
    <section
      id="trackers"
      className="fs-section"
      style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 40px", scrollMarginTop: 80 }}
    >
      <SectionHead
        tag="EVERY SEARCH SURFACE"
        title="Not just Google. Everywhere people search."
        sub="Your customers look for you on Google and Bing, on the map, on YouTube and now inside AI answers. FreeSERP tracks every one of them on one login and one balance."
      />

      <div style={{ marginTop: 56, display: "flex", flexDirection: "column", gap: 72 }}>
        {TRACKERS.map((t, i) => (
          <Reveal key={t.kicker}>
            <div className={`fs-tracker-row${i % 2 === 1 ? " fs-flip" : ""}`}>
              <div className="fs-tracker-copy">
                <span className="fs-tracker-kicker">
                  <i style={{ background: t.dot }} aria-hidden="true" />
                  {t.kicker}
                </span>
                <h3
                  style={{
                    fontSize: 26,
                    fontWeight: 600,
                    letterSpacing: "-0.03em",
                    margin: 0,
                  }}
                >
                  {t.title}
                </h3>
                <p style={{ color: COLORS.gray, fontSize: 15.5, lineHeight: 1.55, margin: 0 }}>
                  {t.text}
                </p>
                <ul className="fs-tick-list">
                  {t.points.map((p) => (
                    <li key={p}>
                      <svg width="15" height="15" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path
                          d="M2 7L5.5 10.5L12 3.5"
                          stroke={t.dot}
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="fs-tracker-media">
                <div className="fs-shot">
                  <div className="fs-app-frame">
                    <div className="fs-app-frame-shot">
                      <Image
                        src={t.shot.src}
                        alt={t.shot.alt}
                        width={t.shot.width}
                        height={t.shot.height}
                        loading="lazy"
                        sizes="(max-width: 1000px) 100vw, 620px"
                      />
                    </div>
                  </div>
                  <PopCard {...t.pop} position="br" width={52} />
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
