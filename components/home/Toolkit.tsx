"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { COLORS } from "@/components/site/constants";
import { TOOLS } from "./tools";

/**
 * The audit and research half of the product, as a tabbed showcase.
 *
 * Seven cards side by side did not work: at card width the screenshots read as
 * grey mush and the repeated kicker/title/bullets/price block turned into six
 * identical boxes. One tab at a time gives each screenshot the full column, and
 * the tab strip doubles as the list of what is in here — you can see all seven
 * names before you click anything.
 *
 * Every panel stays mounted and is hidden with the `hidden` attribute rather
 * than unmounted, so all seven tools' copy is in the HTML for crawlers and a tab
 * switch has nothing to re-render. The screenshots are lazy, so the six you
 * never open are never fetched.
 *
 * Keyboard: the strip is a real tablist — arrows move between tabs, Home and End
 * jump to the ends, and focus follows selection the way the APG pattern expects.
 */
export function Toolkit() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function select(i: number) {
    const next = (i + TOOLS.length) % TOOLS.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        select(active + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        select(active - 1);
        break;
      case "Home":
        e.preventDefault();
        select(0);
        break;
      case "End":
        e.preventDefault();
        select(TOOLS.length - 1);
        break;
    }
  }

  return (
    <section
      id="toolkit"
      className="fs-section"
      style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 40px", scrollMarginTop: 80 }}
    >
      <SectionHead
        tag="AUDIT & RESEARCH"
        title="Find what is holding the site back"
        sub="Rankings tell you where you stand. These tell you why — and what to change. Seven tools, all on the same credit balance, none locked behind a higher tier."
      />

      <Reveal style={{ marginTop: 48 }}>
        {/* Tab strip — also the inventory: all seven names, visible at once. */}
        <div className="fs-tabs-rail">
          <div
            className="fs-tabs"
            role="tablist"
            aria-label="Audit and research tools"
            onKeyDown={onKeyDown}
          >
            {TOOLS.map((t, i) => (
              <button
                key={t.label}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                id={`fs-tab-${i}`}
                role="tab"
                type="button"
                aria-selected={i === active}
                aria-controls={`fs-panel-${i}`}
                tabIndex={i === active ? 0 : -1}
                className={`fs-tab${i === active ? " is-active" : ""}`}
                onClick={() => setActive(i)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {TOOLS.map((tool, i) => (
          <div
            key={tool.label}
            id={`fs-panel-${i}`}
            role="tabpanel"
            aria-labelledby={`fs-tab-${i}`}
            hidden={i !== active}
            className="fs-tab-panel"
          >
            <div className="fs-tool-copy">
              <span className="fs-tracker-kicker">
                <i style={{ background: COLORS.blue }} aria-hidden="true" />
                {tool.kicker}
              </span>
              <h3 style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-0.03em", margin: 0 }}>
                {tool.title}
              </h3>
              <p style={{ color: COLORS.gray, fontSize: 15.5, lineHeight: 1.55, margin: 0 }}>
                {tool.text}
              </p>
              <ul className="fs-tick-list">
                {tool.points.map((p) => (
                  <li key={p}>
                    <svg width="15" height="15" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path
                        d="M2 7L5.5 10.5L12 3.5"
                        stroke={COLORS.blue}
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <span className="fs-cost-chip">{tool.cost}</span>
            </div>

            <div className="fs-tool-media">
              <div className="fs-app-frame">
                <div className="fs-app-frame-shot">
                  <Image
                    src={tool.shot.src}
                    alt={tool.shot.alt}
                    width={tool.shot.width}
                    height={tool.shot.height}
                    loading="lazy"
                    sizes="(max-width: 1000px) 100vw, 700px"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
