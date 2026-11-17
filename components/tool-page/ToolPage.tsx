import Image from "next/image";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { AppCtaLink } from "@/components/site/AppCtaLink";
import { COLORS } from "@/components/site/constants";
import { Cta } from "@/components/home/Cta";
import { SampleReport } from "@/components/landing/SampleReport";
import { HeroReportButton } from "@/components/site/HeroReportButton";
import { TOOL_PAGES, type ToolSlug } from "./pages";
import type { ReactNode } from "react";
import { DemoSection } from "@/components/demos/DemoSection";
import { GeoGridDemo } from "@/components/demos/GeoGridDemo";
import { YouTubeRankDemo } from "@/components/demos/YouTubeRankDemo";
import { SiteAuditDemo } from "@/components/demos/SiteAuditDemo";
import { PageAuditDemo } from "@/components/demos/PageAuditDemo";
import { LinkGraphDemo } from "@/components/demos/LinkGraphDemo";
import { KeywordMagicDemo } from "@/components/demos/KeywordMagicDemo";
import { KeywordScoreDemo } from "@/components/demos/KeywordScoreDemo";
import { SearchConsoleDemo } from "@/components/demos/SearchConsoleDemo";
import { AllKeywordsDemo } from "@/components/demos/AllKeywordsDemo";

/** The interactive demo under each tool page's hero. */
const DEMOS: Record<ToolSlug, { title: string; demo: ReactNode }> = {
  "google-maps-rank-tracker": { title: "Pick a grid, tap a pin", demo: <GeoGridDemo /> },
  "youtube-rank-tracker": { title: "Open a keyword, find your video", demo: <YouTubeRankDemo /> },
  "site-audit": { title: "Run the crawl, read the report", demo: <SiteAuditDemo /> },
  "page-audit": { title: "Open a category, read the failures", demo: <PageAuditDemo /> },
  "internal-link-analysis": { title: "Grab a page and drag it", demo: <LinkGraphDemo /> },
  "keyword-research": { title: "Pick a seed, filter the list", demo: <KeywordMagicDemo /> },
  "keyword-score-checker": { title: "Score a page for its keyword", demo: <KeywordScoreDemo /> },
  "search-console": { title: "Toggle a metric, hover the chart", demo: <SearchConsoleDemo /> },
  "all-keywords": { title: "Filter, sort and star", demo: <AllKeywordsDemo /> },
};

const mono = "var(--font-geist-mono), monospace";

/** Shared layout for the single-tool pages. Built from the home page's own parts. */
export function ToolPage({ slug }: { slug: ToolSlug }) {
  const p = TOOL_PAGES[slug];
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: p.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Nav />

      {/* Same background, badge, type and button as the home page hero (components/home/Hero.tsx). */}
      <header
        className="fs-hero"
        style={{
          paddingTop: 160,
          paddingBottom: 100,
          backgroundImage: "url(https://framerusercontent.com/images/LTzUgqhBMU0fYD8l2vHeGvu8dQI.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="fs-section-inner" style={{ maxWidth: 1080, margin: "0 auto", padding: "0 40px", textAlign: "center" }}>
          <Reveal>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: COLORS.blue,
                color: "#fff",
                padding: "9px 18px 9px 10px",
                borderRadius: 100,
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: "0.02em",
                boxShadow: "inset 0 .5px 1px rgba(255,255,255,.4)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
                <path d="M12 0 C12.3 6.6 17.4 11.7 24 12 C17.4 12.3 12.3 17.4 12 24 C11.7 17.4 6.6 12.3 0 12 C6.6 11.7 11.7 6.6 12 0 Z" />
              </svg>
              {p.kicker}
            </span>
            <h1
              style={{
                color: "#fff",
                fontSize: "clamp(36px, 5.5vw, 72px)",
                fontWeight: 600,
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
                margin: "28px 0 0",
              }}
            >
              {p.h1}
            </h1>
            <p
              style={{
                color: "#fff",
                fontSize: 17,
                lineHeight: 1.5,
                maxWidth: 720,
                margin: "20px auto 0",
              }}
            >
              {p.intro}
            </p>
            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                marginTop: 32,
              }}
            >
              <AppCtaLink
                path="/signup"
                className="fs-btn"
                style={{
                  background: "#000",
                  color: "#fff",
                  padding: "16px 34px",
                  borderRadius: 100,
                  fontSize: 15,
                  textDecoration: "none",
                  fontWeight: 600,
                  boxShadow: "0 14px 34px rgba(8, 32, 96, .28)",
                }}
              >
                Try it free →
              </AppCtaLink>
              {p.report && <HeroReportButton href={p.report.href} />}
              <span className="fs-cost-chip" style={{ background: "#fff" }}>{p.cost}</span>
            </div>
          </Reveal>

          <Reveal style={{ marginTop: 64 }}>
            <Image
              src={p.shot.src}
              alt={p.shot.alt}
              width={p.shot.width}
              height={p.shot.height}
              priority
              sizes="(max-width: 1080px) 100vw, 1000px"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                borderRadius: 18,
                boxShadow:
                  "0 40px 80px rgba(8, 32, 96, .35), 0 12px 32px rgba(8, 32, 96, .25), 0 0 0 1px rgba(255,255,255,.18)",
              }}
            />
          </Reveal>
        </div>
      </header>

      <DemoSection title={DEMOS[slug].title}>{DEMOS[slug].demo}</DemoSection>

      <section className="fs-section" style={{ maxWidth: 1080, margin: "0 auto", padding: "80px 40px" }}>
        <SectionHead tag="WHAT YOU GET" title="Everything it shows you" />
        <Reveal style={{ marginTop: 40 }}>
          <ul
            className="fs-tick-list"
            style={{ maxWidth: 640, margin: "0 auto", fontSize: 17 }}
          >
            {p.points.map((pt) => (
              <li key={pt}>
                <svg width="15" height="15" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path
                    d="M2 7L5.5 10.5L12 3.5"
                    stroke={COLORS.blue}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {p.report && <SampleReport {...p.report} spacing="pb-16 sm:pb-20" />}

      <section className="fs-section" style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 40px 80px" }}>
        <SectionHead tag="HOW IT WORKS" title="Three steps" />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20,
            marginTop: 40,
          }}
        >
          {p.steps.map((s, i) => (
            <Reveal
              key={s.title}
              style={{
                border: `1px solid ${COLORS.border}`,
                borderRadius: 20,
                padding: 28,
                background: COLORS.softGray,
              }}
            >
              <span style={{ fontFamily: mono, color: COLORS.blue, fontWeight: 600, fontSize: 13 }}>
                0{i + 1}
              </span>
              <h3 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em", margin: "12px 0 8px" }}>
                {s.title}
              </h3>
              <p style={{ color: COLORS.gray, fontSize: 15, lineHeight: 1.55, margin: 0 }}>{s.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="fs-section" style={{ maxWidth: 820, margin: "0 auto", padding: "40px 40px 40px" }}>
        <SectionHead tag="FAQ" title="Questions, answered" />
        <div style={{ marginTop: 32 }}>
          {p.faqs.map((f) => (
            <details key={f.q} style={{ borderBottom: `1px solid ${COLORS.border}`, padding: "18px 0" }}>
              <summary style={{ cursor: "pointer", fontSize: 19, fontWeight: 500, letterSpacing: "-0.3px" }}>
                {f.q}
              </summary>
              <p style={{ color: COLORS.gray, fontSize: 16, lineHeight: 1.6, margin: "12px 0 0" }}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <Cta />
      <Footer />
    </>
  );
}
