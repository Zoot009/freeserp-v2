import Link from "next/link";
import Image from "next/image";
import { COLORS } from "@/components/site/constants";
import { urlFor, type BlogPost } from "@/lib/sanity";

function formatDate(iso?: string) {
  if (!iso) return "Recently";
  const d = new Date(iso);
  if (d.getFullYear() < 2000) return "Recently";
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

export function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug.current}`}
      className="fs-card fs-blog-card"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        border: `1px solid ${COLORS.border}`,
        borderRadius: 14,
        overflow: "hidden",
        background: "#fff",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      {post.mainImage?.asset && (
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 9",
            background: COLORS.softGray,
            overflow: "hidden",
          }}
        >
          <Image
            src={urlFor(post.mainImage).width(800).height(450).url()}
            alt={post.title}
            fill
            sizes="(max-width: 1000px) 100vw, 380px"
            style={{ objectFit: "cover" }}
          />
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: 22, flex: 1 }}>
        {post.categories && post.categories.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {post.categories.slice(0, 2).map((cat) => (
              <span
                key={cat}
                style={{
                  padding: "4px 10px",
                  borderRadius: 100,
                  background: COLORS.blueBg,
                  color: COLORS.blue,
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontFamily: "var(--font-geist-mono)",
                }}
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        <h3
          className="fs-clamp-2"
          style={{
            fontSize: 19,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            lineHeight: 1.3,
            margin: 0,
            color: "#0f1018",
          }}
        >
          {post.title}
        </h3>

        {post.excerpt && (
          <p
            className="fs-clamp-3"
            style={{ fontSize: 14.5, lineHeight: 1.6, color: COLORS.gray, margin: 0 }}
          >
            {post.excerpt}
          </p>
        )}

        <div
          style={{
            marginTop: "auto",
            paddingTop: 10,
            display: "flex",
            justifyContent: "space-between",
            gap: 10,
            fontSize: 12,
            fontFamily: "var(--font-geist-mono)",
            color: COLORS.subtle,
          }}
        >
          <span>{post.author || "FreeSERP"}</span>
          <span>{formatDate(post.publishedAt)}</span>
        </div>
      </div>
    </Link>
  );
}
