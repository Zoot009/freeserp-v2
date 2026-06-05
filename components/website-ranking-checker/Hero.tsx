import { Reveal } from "@/components/site/Reveal";
import { SerpForm } from "@/components/serp-checker/SerpForm";

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
            Website Ranking Checker
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
            Check your website ranking in any country, on any device, for free. No signup, no credit card, no limits.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <SerpForm />
        </Reveal>
      </div>
    </header>
  );
}
