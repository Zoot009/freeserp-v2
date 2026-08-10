import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/SectionHead";
import { COLORS } from "@/components/site/constants";

export function WhatIsChecker() {
  return (
    <section
      id="what-is-checker"
      className="fs-serp-section"
      style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 40px 0", scrollMarginTop: 80 }}
    >
      <SectionHead title="What Is a Free SERP Checker?" />
      <Reveal>
        <div style={{ maxWidth: 720, margin: "40px auto 0" }}>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: COLORS.gray, margin: 0 }}>
            A free SERP checker is a tool that shows you exactly where a website ranks on
            Google&apos;s search engine results page for a specific keyword. All you need to do
            is enter a website URL and keywords and the tool scans the keywords from a clean
            server and reports the original position of those keywords automatically. In the
            Free Serp Checker tool you can check a single keyword ranking or group of keywords
            ranking positions within a few seconds.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: COLORS.gray, margin: "16px 0 0" }}>
            The word SERP stands for Search Engine Results Page. A Free SERP checker&apos;s job
            is to find where your website keywords are ranking on google search results.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
