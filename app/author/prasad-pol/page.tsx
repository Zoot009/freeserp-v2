import type { Metadata } from "next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { COLORS } from "@/components/site/constants";

const SITE = "https://freeserp.com";

export const metadata: Metadata = {
  title: "Prasad Pol — Local SEO Specialist | FreeSERP",
  description:
    "Prasad Pol is a Local SEO specialist and web developer working in SEO since 2011. Author at FreeSERP.",
  alternates: { canonical: `${SITE}/author/prasad-pol` },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE}/author/prasad-pol#person`,
  name: "Prasad Pol",
  url: `${SITE}/author/prasad-pol`,
  jobTitle: "Local SEO Specialist",
  description:
    "Local SEO specialist and web developer working in SEO since 2011.",
  alumniOf: "Mediatech Mumbai",
  award: "SEO Expert - Mediatech Mumbai (2016)",
  knowsAbout: ["Rank tracking", "AI search optimization"],
  worksFor: { "@id": `${SITE}/#organization` },
  sameAs: ["https://in.linkedin.com/company/zootdigital"],
};

export default function PrasadPolPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Nav />
      <main
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "120px 40px 100px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: COLORS.subtle,
            marginBottom: 16,
          }}
        >
          Author
        </p>
        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 600,
            letterSpacing: "-0.04em",
            color: "#0f1018",
            margin: "0 0 16px",
          }}
        >
          Prasad Pol
        </h1>
        <p
          style={{
            fontSize: 16,
            fontFamily: "var(--font-geist-mono)",
            color: COLORS.subtle,
            margin: "0 0 24px",
          }}
        >
          Local SEO Specialist
        </p>
        <p style={{ fontSize: 17, lineHeight: 1.7, color: COLORS.gray, maxWidth: 600 }}>
          Local SEO specialist and web developer working in SEO since 2011.
          SEO Expert — Mediatech Mumbai (2016). Focused on rank tracking and AI
          search optimization.
        </p>
      </main>
      <Footer />
    </>
  );
}
