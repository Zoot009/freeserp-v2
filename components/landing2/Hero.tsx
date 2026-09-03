import Image from "next/image";

export default function Hero() {
  return (
    <section className="l2-hero">
      <div aria-hidden="true" className="l2-hero-glow" />
      <div className="l2-hero-grid">
        <div>
          <div className="l2-pill l2-mono">
            <span className="l2-pill-dot" />
            Free plan · no credit card
          </div>
          <h1 className="l2-h1">
            Track your rankings in Google, Maps, YouTube{" "}
            <em>and AI chatbots</em>
          </h1>
          <p className="l2-lede">
            One dashboard that tells you where you rank, who is beating you, and
            exactly what to fix. Built for people who own a website, not an SEO
            department.
          </p>
          <div className="l2-hero-cta">
            <a href="#signup" className="l2-btn-primary">
              Create a free account
            </a>
            <a href="#tools" className="l2-btn-ghost">
              See every tool
            </a>
          </div>
          <p className="l2-hero-note l2-mono">
            190+ countries · all devices · 12 tools, all unlocked free
          </p>
        </div>
        <div className="l2-hero-shot">
          {/* The one above-the-fold image: eager, and the LCP candidate. */}
          <Image
            src="/screenshots/01-hero-keywords.png"
            alt="FreeSERP keyword tracking dashboard"
            width={1441}
            height={720}
            sizes="(max-width: 1024px) 100vw, 560px"
            priority
          />
        </div>
      </div>
    </section>
  );
}
