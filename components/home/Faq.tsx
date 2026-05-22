"use client";

import { useState } from "react";
import { Reveal } from "@/components/site/Reveal";
import { Tag } from "@/components/site/Tag";
import { COLORS } from "@/components/site/constants";
import { FAQS } from "./data";

function FaqItem({
  q,
  a,
  open,
  onClick,
}: {
  q: string;
  a: string;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "16px 0 24px",
        borderBottom: `1px solid ${COLORS.border}`,
        cursor: "pointer",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          justifyContent: "space-between",
        }}
      >
        <h4 className="fs-faq-q" style={{ fontSize: 20, fontWeight: 500, letterSpacing: "-0.4px", margin: 0 }}>
          {q}
        </h4>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          style={{
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform .3s ease",
          }}
        >
          <path
            d="M 6 9 L 12 15 L 18 9"
            stroke={COLORS.black}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div
        style={{
          maxHeight: open ? 200 : 0,
          opacity: open ? 1 : 0,
          overflow: "hidden",
          transition: "max-height .35s ease, opacity .35s ease, margin-top .35s ease",
          marginTop: open ? 12 : 0,
          color: COLORS.gray,
          fontSize: 16,
          lineHeight: 1.5,
          maxWidth: 480,
        }}
      >
        {a}
      </div>
    </div>
  );
}

export function Faq() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section className="fs-faq-section" style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 40px" }}>
      <div
        className="fs-row"
        style={{ display: "flex", gap: 80, alignItems: "flex-start" }}
      >
        <Reveal style={{ flex: "0 0 33%" }}>
          <Tag text="FAQ" />
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 56px)",
              fontWeight: 600,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              margin: "20px 0 16px",
            }}
          >
            Frequently asked questions
          </h2>
          <p style={{ color: COLORS.gray, fontSize: 16, lineHeight: 1.5 }}>
            Common questions about SERP checking, analysis, and ranking. Still stuck? Email
            support@freeserp.com.
          </p>
        </Reveal>
        <div style={{ flex: 1 }}>
          {FAQS.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.05}>
              <FaqItem
                q={f.q}
                a={f.a}
                open={openFaq === i}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
