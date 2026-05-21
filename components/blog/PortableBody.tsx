/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { COLORS } from "@/components/site/constants";
import { urlFor } from "@/lib/sanity";

function youTubeId(url: string) {
  const m = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
  return m && m[2].length === 11 ? m[2] : null;
}
function vimeoId(url: string) {
  const m = url.match(/vimeo\.com\/(\d+)/);
  return m ? m[1] : null;
}

const captionStyle: React.CSSProperties = {
  fontFamily: "var(--font-geist-mono)",
  fontSize: 12,
  color: COLORS.subtle,
  textAlign: "center",
  margin: "10px 0 0",
};
const embedFrame: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  border: `1px solid ${COLORS.border}`,
  borderRadius: 12,
};

const components: PortableTextComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) return null;
      return (
        <figure style={{ margin: "32px 0" }}>
          <Image
            src={urlFor(value).width(1600).url()}
            alt={value.alt || ""}
            width={1600}
            height={900}
            sizes="(max-width: 820px) 100vw, 740px"
            style={{ width: "100%", height: "auto", borderRadius: 12, display: "block" }}
          />
          {(value.caption || value.alt) && (
            <figcaption style={captionStyle}>{value.caption || value.alt}</figcaption>
          )}
        </figure>
      );
    },
    youtube: ({ value }: any) => {
      const id = youTubeId(value?.url || "");
      if (!id) return null;
      return (
        <figure style={{ margin: "32px 0" }}>
          <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%" }}>
            <iframe
              style={embedFrame}
              src={`https://www.youtube.com/embed/${id}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          {value.caption && <figcaption style={captionStyle}>{value.caption}</figcaption>}
        </figure>
      );
    },
    vimeo: ({ value }: any) => {
      const id = vimeoId(value?.url || "");
      if (!id) return null;
      return (
        <figure style={{ margin: "32px 0" }}>
          <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%" }}>
            <iframe
              style={embedFrame}
              src={`https://player.vimeo.com/video/${id}`}
              title="Vimeo video player"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
          {value.caption && <figcaption style={captionStyle}>{value.caption}</figcaption>}
        </figure>
      );
    },
    code: ({ value }: any) => (
      <pre
        style={{
          background: COLORS.softGray,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
          padding: 18,
          overflowX: "auto",
          margin: "24px 0",
        }}
      >
        <code style={{ fontFamily: "var(--font-geist-mono)", fontSize: 13, color: "#0f1018" }}>
          {value?.code}
        </code>
      </pre>
    ),
  },
  block: {
    h2: ({ children }: any) => (
      <h2
        style={{
          fontSize: "clamp(24px, 3vw, 32px)",
          fontWeight: 600,
          letterSpacing: "-0.03em",
          lineHeight: 1.2,
          margin: "44px 0 16px",
          color: "#0f1018",
        }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3
        style={{
          fontSize: "clamp(20px, 2.4vw, 24px)",
          fontWeight: 600,
          letterSpacing: "-0.02em",
          lineHeight: 1.25,
          margin: "32px 0 12px",
          color: "#0f1018",
        }}
      >
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 style={{ fontSize: 19, fontWeight: 600, margin: "26px 0 10px", color: "#0f1018" }}>
        {children}
      </h4>
    ),
    blockquote: ({ children }: any) => (
      <blockquote
        style={{
          borderLeft: `3px solid ${COLORS.blue}`,
          background: COLORS.blueBg,
          margin: "24px 0",
          padding: "14px 20px",
          borderRadius: "0 10px 10px 0",
          color: "#0f1018",
          fontSize: 17,
          lineHeight: 1.6,
        }}
      >
        {children}
      </blockquote>
    ),
    normal: ({ children }: any) => (
      <p style={{ fontSize: 17, lineHeight: 1.7, color: COLORS.gray, margin: "0 0 18px" }}>
        {children}
      </p>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul style={{ margin: "18px 0", paddingLeft: 22, display: "flex", flexDirection: "column", gap: 8 }}>
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol style={{ margin: "18px 0", paddingLeft: 22, display: "flex", flexDirection: "column", gap: 8 }}>
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => (
      <li style={{ fontSize: 17, lineHeight: 1.6, color: COLORS.gray }}>{children}</li>
    ),
    number: ({ children }: any) => (
      <li style={{ fontSize: 17, lineHeight: 1.6, color: COLORS.gray }}>{children}</li>
    ),
  },
  marks: {
    strong: ({ children }: any) => (
      <strong style={{ fontWeight: 600, color: "#0f1018" }}>{children}</strong>
    ),
    em: ({ children }: any) => <em>{children}</em>,
    code: ({ children }: any) => (
      <code
        style={{
          fontFamily: "var(--font-geist-mono)",
          fontSize: "0.88em",
          background: COLORS.softGray,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 5,
          padding: "1px 6px",
          color: COLORS.blue,
        }}
      >
        {children}
      </code>
    ),
    link: ({ value, children }: any) => {
      const external = (value?.href || "").startsWith("http");
      return (
        <a
          href={value?.href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          style={{ color: COLORS.blue, textDecoration: "underline", textUnderlineOffset: 2 }}
        >
          {children}
        </a>
      );
    },
  },
};

export function PortableBody({ value }: { value: any }) {
  if (!value) return null;
  return <PortableText value={value} components={components} />;
}
