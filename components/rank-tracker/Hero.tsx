import { Reveal } from "@/components/site/Reveal";
import { SerpForm } from "@/components/serp-checker/SerpForm";
import { HeroReportButton } from "@/components/site/HeroReportButton";
import { SAMPLE_REPORTS } from "@/components/landing/sample-reports";

export function Hero() {
  return (
    <header
      className="fs-serp-hero"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        textAlign: "center",
        backgroundImage:
          "url(https://framerusercontent.com/images/LTzUgqhBMU0fYD8l2vHeGvu8dQI.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      <div
        className="fs-serp-hero-inner"
        style={{ maxWidth: 1280, width: "100%", margin: "0 auto", padding: "80px 40px", position: "relative", zIndex: 1 }}
      >
        <Reveal>
          <h1
            style={{
              color: "#fff",
              fontSize: "clamp(36px, 5.5vw, 76px)",
              fontWeight: 600,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            Free Rank Tracker
          </h1>
          <p
            style={{
              color: "#fff",
              maxWidth: 640,
              margin: "20px auto 40px",
              fontSize: 17,
              lineHeight: 1.5,
              fontWeight: 400,
              letterSpacing: "-0.2px",
              opacity: 0.92,
            }}
          >
            Check where any domain ranks for any keyword — across any country, on any device — completely free. No signup, no credit card, no limits on manual rank checks.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <SerpForm />
          <div style={{ marginTop: 24 }}>
            <HeroReportButton href={SAMPLE_REPORTS.rank.href} />
          </div>
        </Reveal>
      </div>
    </header>
  );
}
