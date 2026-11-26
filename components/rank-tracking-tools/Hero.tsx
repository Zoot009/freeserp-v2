import Image from "next/image";
import { SAMPLE_REPORTS } from "@/components/landing/sample-reports";

export default function Hero() {
  return (
    <section className="l2-hero">
      <div aria-hidden="true" className="l2-hero-glow" />
      <div className="l2-hero-grid">
        <div>
          <div className="l2-pill l2-mono">
            <span className="l2-pill-dot" />
            Free Google tracking · no card
          </div>
          <h1 className="l2-h1">
            Rank tracking for Google, Maps, YouTube{" "}
            <em>and AI chatbots</em>
          </h1>
          <p className="l2-lede">
            One dashboard that tells you where you rank on mobile and desktop, who
            is beating you, and exactly what to fix. Built for people who own a
            website, not an SEO department.
          </p>
          <div className="l2-hero-cta">
            <a href="#signup" className="l2-btn-primary">
              Create a free account
            </a>
            <a href="#tools" className="l2-btn-ghost">
              See every tool
            </a>
            <a
              href={SAMPLE_REPORTS.rank.href}
              target="_blank"
              rel="noopener noreferrer"
              className="l2-btn-ghost"
            >
              View sample report
            </a>
          </div>
          <p className="l2-hero-note l2-mono">
            190+ countries · mobile & desktop · 12 tools from $9/month
          </p>
        </div>
        <div className="l2-hero-shot">
          {/* The one above-the-fold image: eager, and the LCP candidate. */}
          <Image
            src="/screenshots/01-hero-keywords.png"
            alt="FreeSERP keyword rank tracking dashboard"
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
